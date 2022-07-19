import m from "mithril"
import NavLink from "@/Components/nav-link"
import { jsonCopy } from "@/Utils"
import { validateLoginTask } from "./Validations.js"
import { loginTask, resetPasswordTask } from "./fns.js"
import Stream from "mithril-stream"

const validateForm = (mdl) => (data) => {
  const onError = (errs) => {
    if (errs.code != 209) {
      state.errors = errs
      state.msg(state.errors?.response?.error)
      state.showMsg(true)
    } else {
      state.msg(
        "There seems to be an issue with logging in. Have you registered or verified your email?"
      )
      state.showMsg(true)
    }
  }

  const onSuccess = (mdl) => (_) => {
    state.errors = {}
    m.route.set("/")
  }

  state.isSubmitted = true

  validateLoginTask(data.userModel)
    .chain(loginTask(mdl))
    .fork(onError, onSuccess(mdl))
}

const resetPassword = (mdl, email) => {
  const onError = ({ message }) => {
    state.msg(message)
    state.showMsg(true)
    state.showResetModal(false)
  }

  const onSuccess = () => {
    state.showResetModal(false)
    state.msg(
      "A password reset request was sent to the email provided, please check your email to reset your password."
    )
    state.showMsg(true)
  }

  resetPasswordTask(mdl, email).fork(onError, onSuccess)
}

const userModel = {
  name: "",
  email: "",
  password: "",
  confirmEmail: "",
  confirmPassword: "",
  role: "user",
}

const dataModel = { userModel }

const state = {
  isSubmitted: false,
  errors: {},
  httpError: undefined,
  data: jsonCopy(dataModel),
  showMsg: Stream(false),
  msg: Stream(""),
  showResetModal: Stream(false),
}

const resetState = () => {
  state.data = jsonCopy(dataModel)
  state.errors = {}
  state.httpError = undefined
  state.isSubmitted = false
  state.showMsg(false)
  state.msg("")
  state.showResetModal(false)
}

export const Login = () => {
  return {
    onremove: () => resetState(),
    view: ({ attrs: { mdl } }) =>
      mdl.state.isLoading()
        ? "" //m(LogoLoader, { mdl })
        : m(
          "section.container.p-y-50",

          state.showMsg() && m("p.text-error", state.msg()),
          m(
            "article.card",
            mdl.settings.screenSize != "phone" && {
              style: { maxWidth: "80%", margin: "0 auto" },
            },
            m(
              "form.row",
              {
                role: "form",
                id: "login-form",
                onsubmit: (e) => e.preventDefault(),
              },
              m(
                "formgroup.col-12",
                // {
                //   class: mdl.settings.screenSize == "desktop" && "grouped",
                // },
                m("input", {
                  class: state.isSubmitted
                    ? state.errors.email
                      ? "error"
                      : "success"
                    : "",
                  id: "reg-email",
                  type: "email",
                  autocomplete: "username",
                  placeholder: "Email",
                  oninput: (e) => {
                    // state.isSubmitted && validateForm(mdl)(state.data)
                    state.data.userModel.email = e.target.value
                  },
                  value: state.data.userModel.email,
                }),
                state.errors.email && m("p.text-error", state.errors.email)
              ),
              m(
                "formgroup.col-12",
                m("input", {
                  class: state.isSubmitted
                    ? state.errors.password
                      ? "error"
                      : "success"
                    : "",
                  id: "reg-pass",
                  type: "password",
                  autocomplete: "current-password",
                  placeholder: "Password",
                  oninput: (e) => {
                    // state.isSubmitted && validateForm(mdl)(state.data)
                    state.data.userModel.password = e.target.value
                  },
                  value: state.data.userModel.password,
                }),
                state.errors.password &&
                m("p.text-error", state.errors.password)
              ),
              m(
                "button.button.primary.col-12",
                {
                  role: "button",
                  form: `login-form`,
                  onclick: () => validateForm(mdl)(state.data),
                  class: mdl.state.isLoading() && "loading",
                },
                "LOGIN"
              )
            ),

            m(
              "p.pointer.text-primary",
              { onclick: () => state.showResetModal(true) },
              "Need to reset password ?"
            ),
            state.showResetModal() &&
            m(
              "section.modal-container#modal",
              m(
                "article.modal.card.grid",
                m(
                  "header.modal-header",
                  "Reset Password",
                  m(
                    "button.button.icon-only",
                    {
                      id: "modal-close",
                      "aria-label": "Close",
                      onclick: () => state.showResetModal(false),
                    },
                    "X"
                  )
                ),
                m(
                  "section.modal-content",
                  m("input", {
                    type: "email",
                    autocomplete: "username",
                    placeholder: "Enter Email",
                    value: state.data.userModel.email,
                    oninput: (e) =>
                      (state.data.userModel.email = e.target.value),
                  })
                ),
                m(
                  "section.modal-footer",
                  m(
                    "button",
                    {
                      onclick: () =>
                        resetPassword(mdl, state.data.userModel.email),
                    },
                    "Reset Password"
                  )
                )
              )
            ),
            state.httpError && m(".toast toast-error", state.httpError)
          ),
          m(
            ".auth-link",
            "Need to ",
            m(
              "u",
              m(NavLink, {
                mdl,
                href: "/register",
                link: "register",
                classList: "",
              })
            ),
            " ?"
          )
        ),
  }
}

export default Login

