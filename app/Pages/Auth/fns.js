import m from "mithril"
import Task from "data.task"
import { head, prop } from "ramda"

const setUserAndSessionToken = (mdl) => (user) => {
  sessionStorage.setItem("baca-user", JSON.stringify(user.objectId))
  sessionStorage.setItem("baca-session-token", user["sessionToken"])
  mdl.state.isAuth(true)
  mdl.user = user
  mdl.user.routename = mdl.user.name.replaceAll(" ", "")
  return mdl
}

const loginUserTask =
  (mdl) =>
    ({ email, password }) => {
      let login = encodeURI(`username=${email}&password=${password}`)
      return mdl.http.back4App
        .getTask(mdl)(`login?${login}`)
        .map(setUserAndSessionToken(mdl))
    }

const getAddressTask = (mdl) => (addressId) => {
  let login = encodeURI(`objectId=${addressId}`)
  return mdl.http.back4App
    .getTask(mdl)(`classes/Addresses`)
    .map(log("address??"))
}

const getUserAccountTask = (mdl) => (encodeId) =>
  mdl.http.back4App
    .getTask(mdl)(`classes/Accounts?${encodeId}`)
    .map(prop("results"))
    .chain((account) =>
      account.any() ? Task.of(account) : createAccountTask(mdl)
    )
    .map(head)

const getUserDuesTask = (mdl) => (encodeId) =>
  mdl.http.back4App
    .getTask(mdl)(`classes/Dues?${encodeId}`)
    .map(prop("results"))

const getUserMessagesTask = (mdl) => (encodeId) =>
  mdl.http.back4App
    .getTask(mdl)(`classes/Messages?${encodeId}`)
    .map(prop("results"))
    .chain((messages) => {
      console.log("messages", messages)
      return messages.any()
        ? () => {
          let hasNotifications = messages.filter(
            (message) => !message.hasRead
          )
          mdl.state.hasNotifications(hasNotifications.any())
          return Task.of(messages)
        }
        : createMessagesTask(mdl)
    })

const getUserInfoTask = (mdl) => {
  let encodeId = encodeURI(`where={"userId":"${mdl.user.objectId}"}`)
  return Task.of((account) => (dues) =>
  // (messages) =>
  {
    {
      mdl.data.account = account
      mdl.data.dues = dues
      mdl.data.messages = []
      // console.log(mdl)
    }
  }
  )
    .ap(getUserAccountTask(mdl)(encodeId))
    .ap(getUserDuesTask(mdl)(encodeId))
  // .ap(getUserMessagesTask(mdl)(encodeId))
}
export const loginTask =
  (mdl) =>
    ({ email, password }) =>
      loginUserTask(mdl)({ email, password }).chain((_) => getUserInfoTask(mdl))

export const resetPasswordTask = (mdl, email) =>
  mdl.http.back4App.postTask(mdl)("requestPasswordReset")({ email })

export const registerUserTask =
  (mdl) =>
    ({ name, email, password, role }) =>
      mdl.http.back4App.postTask(mdl)("users")({
        username: email,
        name,
        email,
        password,
        role,
      })

export const createAccountTask = (mdl) => {
  mdl.user.account = {
    userId: mdl.user.objectId,
    email: mdl.user.email,
    name: mdl.user.name,
    avatar: "",
    address: "",
    telephone: "",
  }
  return mdl.http.back4App
    .postTask(mdl)("classes/Accounts")(mdl.user.account)
    .map(({ objectId }) => {
      mdl.user.account.objectId = objectId
      return mdl
    })
}

// export const createDuesTask = (mdl) => {
//   mdl.user.dues = {
//     userId: mdl.user.objectId,
//     address: "",
//   }
//   return mdl.http.back4App
//     .postTask(mdl)("classes/Dues")(mdl.user.dues)
//     .map(({ objectId }) => {
//       mdl.user.dues.objectId = objectId
//       return mdl
//     })
// }

export const createMessagesTask = (mdl) => {
  mdl.user.conversations = {
    userId: mdl.user.objectId,
  }
  return mdl.http.back4App
    .postTask(mdl)("classes/Conversations")(mdl.user.conversations)
    .map(({ objectId }) => {
      mdl.user.conversations.objectId = objectId
      return mdl
    })
}

