import m from 'mithril'
import {
  compose,
  last,
  join,
  values,
  props,
  assoc,
  test,
  prop,
  filter,
  sortBy,
  toLower,
  identity,
  reverse,
  slice,
  split,
  trim,
  max,
  toPairs,
  min,
  add,
  map,
  flatten,
  reduce,
  type,
  equals,
} from "ramda"
import Task from "data.task"

export const makeRoute = compose(join("-"), split(" "), trim(), toLower())

export const isEmpty = (data) => data.length == 0

export const infiniteScroll = (mdl) => (e) => {
  let route = mdl.state.route
  let length = mdl.data[route].data.length
  let setpoint = 10 * length * mdl.state.scrollPos
  if (e.target.scrollTop - mdl.state.scrollPos >= setpoint) {
    mdl.state.scrollPos++ + e.target.scrollTop
  }
}

export const addTerms = (item) => {
  const terms = compose(join(" "), values, props(["uuid", "id", "name"]))(item)

  return assoc("_terms", terms, item)
}

const byTerms = (query) => compose(test(new RegExp(query, "i")), prop("name"))

export const _search = (query) => compose(filter(byTerms(query)))

export const _sort = (p) => sortBy(compose(toLower, toString, prop(p)))

export const _direction = (dir) => (dir == "asc" ? identity : reverse)

export const _paginate = (offset) => (limit) => (data) =>
  slice(
    max(0, min(offset, data.length)),
    min(offset + limit, data.length),
    data
  )

export const filterTask =
  (query) => (prop) => (direction) => (offset) => (limit) =>
    compose(
      Task.of,
      map(_paginate(offset)(limit)),
      map(_direction(direction)),
      map(_sort(prop)),
      _search(query)
    )

export const debounce = (wait, now) => (fn) => {
  let timeout = undefined
  return function () {
    let context = this
    let args = arguments
    let later = function () {
      timeout = undefined
      if (!now) fn.apply(context, args)
    }
    let callNow = now && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    console.log(fn)
    if (callNow) fn.apply(context, args)
  }
}

export const getRoute = () => last(m.route.get().split("/"))

export const scrollToAnchor = (anchor) => {
  let is = (el) => el !== undefined && el !== null
  //if you pass an undefined anchor it will scroll to the top of the body
  let targetEl = is(anchor) ? document.getElementById(anchor) : document.body
  let scrollTop = window.pageYOffset || document.documentElement.scrollTop
  let target = is(targetEl) ? targetEl.getBoundingClientRect().top : 0

  return window.scroll({
    top: target + scrollTop - 150,
    left: 0,
    behavior: "smooth",
  })
}

export const randomEl = (list) => list[Math.floor(Math.random() * list.length)]

export const jsonCopy = (src) => JSON.parse(JSON.stringify(src))

export const isActiveRoute = (route) =>
  m.route.get() == route ? "is-active" : ""

export const uuid = () => {
  return "xxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export const listOf = (x) => (y) => Array(x).fill(y)

export const toProducts = (cart) =>
  toPairs(cart).map(([product, genders]) => [product, toPairs(genders)])

export const getPrice = (mdl, title, genders) =>
  mdl.state.prices[title] * getQuantity(genders)

export const getQuantity = (xs) =>
  reduce(add, 0, filter(compose(equals("Number"), type), flatten(xs)))

export const getTotal = (mdl, products) =>
  getQuantity(products.map((p) => getPrice(mdl, p[0], p[1])))

const toPriceModel = ({ Burpies, Wraps, Blankets, Collections }) => ({
  Burpies,
  Wraps,
  Blankets,
  Collections,
})

export const parsePrices = compose(toPriceModel, last, prop("results"))

export const DAYSOFWEEK = ["Sun", "Mon", "Teus", "Wed", "Thurs", "Fri", "Sat"]
export const formatDate = (date) => date.split("T")[0]

export const handlers = (types, fn) =>
  types.reduce((acc, type) => Object.assign(acc, { [type]: fn }), {})

export const exists = (xs) => xs.length >= 1
export const oneExists = (xs, ys) => exists(xs) || exists(ys)

export const ScrollToPageTitle = () =>
  document.getElementById("page-title")
    ? document.getElementById("page-title").scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "start",
    })
    : window.scroll({
      top: 160,
      left: 0,
      behavior: "smooth",
    })

export const AVATAR_URL = "https://i.ibb.co/6W0zsZH/avatar.webp"

export const getUserByUserId = (userId, mdl) =>
  mdl.data.users.find((u) => u.objectId == userId)

export const confirmTask = (msg) =>
  new Task((rej, res) => (window.confirm(msg) ? res() : rej()))

export const isAdminOrMod = (mdl) => ["admin", "mod"].includes(mdl.user.role)
