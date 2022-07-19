import Task from "data.task"

const getLocalStorageTask = (key) =>
  new Task((rej, res) =>
    localStorage.getItem(key)
      ? rej("nothing here")
      : res(localStorage.getItem(key))
  )

const getSessionStorageTask = (key) =>
  new Task((rej, res) =>
    sessionStorage.getItem(key)
      ? rej("nothing here")
      : res(sessionStorage.getItem(key))
  )

const saveLocalStorageTask = (key) => (value) => {
  localStorage.setItem(key, JSON.stringify(value))
  return Task.of(localStorage.getItem(key))
}

const saveDbStorageTask = (mdl) => (cart) =>
  mdl.http.back4App.putTask(mdl)(
    `classes/Accounts/${mdl.user.account.objectId}`
  )({
    cart: JSON.parse(cart),
  })

const getDbStorageTask = (mdl) =>
  mdl.http.back4App.gettTask(mdl)(
    `classes/Accounts/${mdl.user.account.objectId}`
  )

const saveStorageTask = (mdl) => (key) => (value) => {
  return mdl.state.isAuth()
    ? saveLocalStorageTask(key)(value).chain(saveDbStorageTask(mdl))
    : saveLocalStorageTask(key)(value)
}

export {
  getLocalStorageTask,
  getSessionStorageTask,
  saveLocalStorageTask,
  saveDbStorageTask,
  getDbStorageTask,
  saveStorageTask,
}
