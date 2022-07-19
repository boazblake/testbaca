import m from "mithril"
import { uuid } from "@/Utils/helpers"

const toastTypes = ["info", "warning", "success", "danger"]
// Toasts.js
const state = {
  list: [],
  destroy: (id) => {
    let index = state.list.findIndex((x) => x.id === id)
    state.list.splice(index, 1)
  },
}

export const addSuccess = (text, timeout = 3000) => {
  state.list.push({ id: uuid(), type: "success", text, timeout })
  console.log("state", state)
}
export const addInfo = (text, timeout = 3000) => {
  state.list.push({ id: uuid(), type: "info", text, timeout })
}
export const addWarning = (text, timeout = 3000) => {
  state.list.push({ id: uuid(), type: "warning", text, timeout })
}
export const addDanger = (text, timeout = 3000) => {
  state.list.push({ id: uuid(), type: "danger", text, timeout })
}

const toastType = (type) => (toastTypes.includes(type) ? type : "info")

const destroyToast = ({ dom, attrs: { id } }) => {
  dom.classList.add("destroy")
  setTimeout(() => {
    state.destroy(id)
    m.redraw()
  }, 300)
}

let Toast = (vnode) => {
  setTimeout(() => {
    destroyToast(vnode)
  }, vnode.attrs.timeout)

  return {
    view: ({ attrs: { type, text } }) => {
      return m(
        ".m-notification",
        {
          class: toastType(type),
          onclick: () => destroyToast(vnode),
        },
        text
      )
    },
  }
}

export default {
  view: () =>
    state.list.any() &&
    m(
      ".m-notifications",
      state.list.map((msg) => m("div", { key: msg.id }, m(Toast, msg)))
    ),
}
