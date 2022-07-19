import m from 'mithril'
import Task from "data.task"
import { PAYPAL, BACK4APP, IMGBB, OpenCage } from "../../.secrets.js"

const updatePayPalAuth = (mdl) => (paypal) => (mdl.state.paypal = paypal)

const onProgress = (mdl) => (e) => {
  if (e.lengthComputable) {
    mdl.state.loadingProgress.max = e.total
    mdl.state.loadingProgress.value = e.loaded
    m.redraw()
  }
}

function onLoad() {
  return false
}

const onLoadStart = (mdl) => (e) => {
  mdl.state.isLoading(true)
  return false
}

const onLoadEnd = (mdl) => (e) => {
  mdl.state.isLoading(false)
  mdl.state.loadingProgress.max = 0
  mdl.state.loadingProgress.value = 0
  return false
}

const xhrProgress = (mdl) => ({
  config: (xhr) => {
    xhr.onprogress = onProgress(mdl)
    xhr.onload = onLoad
    xhr.onloadstart = onLoadStart(mdl)
    xhr.onloadend = onLoadEnd(mdl)
  },
})

export const parseHttpError = (mdl) => (rej) => (e) => {
  mdl.state.isLoading(false)

  return rej(JSON.parse(JSON.stringify(e)))
}

export const parseHttpSuccess = (mdl) => (res) => (data) => {
  mdl.state.isLoading(false)
  return res(data)
}

const HttpTask = (_headers) => (method) => (mdl) => (url) => (body) => {
  mdl.state.isLoading(true)
  return new Task((rej, res) =>
    m
      .request({
        method,
        url,
        headers: {
          ..._headers,
        },
        body,
        withCredentials: false,
        ...xhrProgress(mdl),
      })
      .then(parseHttpSuccess(mdl)(res), parseHttpError(mdl)(rej))
  )
}

const lookupLocationTask = (query) => {
  return new Task((rej, res) =>
    m
      .request({
        method: "GET",
        url: `https://nominatim.openstreetmap.org/search?q=${query}&format=json`,
      })
      .then(res, rej)
  )
}

const getTask = (mdl) => (url) => HttpTask({})("GET")(mdl)(url)(null)

const paypalUrl = `${PAYPAL.sandbox.baseUrl}/`
const paypal = {
  getTokenTask: (mdl) =>
    HttpTask(PAYPAL.sandbox.headers())("POST")(mdl)(
      paypalUrl + "v1/oauth2/token/"
    )(`grant_type=client_credentials`).map(updatePayPalAuth(mdl)),
  getTask: (mdl) => (url) =>
    HttpTask(PAYPAL.sandbox.headers(PAYPAL))("GET")(mdl)(paypalUrl + url)(null),
  postTask: (mdl) => (url) => (dto) =>
    HttpTask(PAYPAL.sandbox.headers(PAYPAL))("POST")(mdl)(paypalUrl + url)(dto),
  putTask: (mdl) => (url) => (dto) =>
    HttpTask(PAYPAL.sandbox.headers(PAYPAL))("PUT")(mdl)(paypalUrl + url)(dto),
}

const cachCall = (url) =>
  url == "users/me"
    ? { "Cache-Control": "private" }
    : {
      "If-Modified-Since": new Date(),
      "Cache-Control": "public, max-age=604800",
    }

const back4App = {
  getTask: (mdl) => (url) =>
    HttpTask(BACK4APP.headers(mdl, BACK4APP, cachCall(url)))("GET")(mdl)(
      `${BACK4APP.baseUrl}/${url}`
    )(null),
  postTask: (mdl) => (url) => (dto) =>
    HttpTask(BACK4APP.headers(mdl, BACK4APP))("POST")(mdl)(
      `${BACK4APP.baseUrl}/${url}`
    )(dto),
  putTask: (mdl) => (url) => (dto) =>
    HttpTask(BACK4APP.headers(mdl, BACK4APP))("PUT")(mdl)(
      `${BACK4APP.baseUrl}/${url}`
    )(dto),
  deleteTask: (mdl) => (url) =>
    HttpTask(BACK4APP.headers(mdl, BACK4APP))("DELETE")(mdl)(
      `${BACK4APP.baseUrl}/${url}`
    )(),
}

const imgBB = {
  postTask: (mdl) => (file) => {
    const image = new FormData()
    image.append("image", file)
    image.set("key", IMGBB.apiKey)

    // console.log(image, file)
    return HttpTask()("POST")(mdl)(`${IMGBB.url}?key=${IMGBB.apiKey}`)(image)
  },
}

const OpenCageUrl = `${OpenCage.baseUrl}?key=${OpenCage.key}&q=`

const openCage = {
  getLocationTask: (mdl) => (query) =>
    HttpTask(OpenCage.headers())("GET")(mdl)(
      OpenCageUrl +
      query +
      `&pretty=1&countrycode=us&bounds=${encodeURIComponent(
        mdl.Map.bounds()
      )}`
    )(null),
}

const http = {
  imgBB,
  openCage,
  back4App,
  paypal,
  HttpTask,
  getTask,
  lookupLocationTask,
}

export default http
