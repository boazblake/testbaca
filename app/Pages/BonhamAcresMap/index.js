import m from "mithril"
import { isAdminOrMod } from "@/Utils/helpers"
import {
  loadResidentsTask,
  loadMapConfig,
  findLocationTask,
  saveResidentTask,
  defaultPushPinEntities,
  selectLocation,
} from "./model.js"

const load = (mdl, state) =>
  loadResidentsTask(mdl, state).map(loadMapConfig(mdl))

const findResident = (mdl, state) => {
  const onError = (e) => {
    let msg = "error finding resident"
    console.log(msg, e)
  }

  const onSuccess = (results) => (state.findLocationResults = results)

  state.input?.length > 5 &&
    findLocationTask(mdl, state.input).fork(onError, onSuccess)
}

const restartFindResident = (mdl, state) => {
  load(mdl, state).fork(log("e"), () => {
    state.newLocation = null
    state.findLocationResults = []
    state.input = null
  })
}

const toggleEditResidents = (mdl, state) => (state.isEdit = !state.isEdit)

const saveResident = (mdl, state) => {
  const onError = (e) => log("e")(e)
  const onSuccess = (data) => log("suc")(data)

  saveResidentTask(mdl, state.newLocation)
    .chain(() => load(mdl, state))
    .fork(onError, onSuccess)
}

const BonhamAcresMap = ({ attrs: { mdl } }) => {
  const state = {
    findLocationResults: [],
    newLocation: null,
    dom: null,
    entities: defaultPushPinEntities(mdl),
    input: null,
    map: null,
    isEdit: false,
    opts: {
      mapTypeId: Microsoft.Maps.MapTypeId.road,
      zoom: 16,
      // center: Microsoft.Maps.Location(
      //   Microsoft.Maps.Location.parseLatLong(mdl.Map.bh).latitude,
      //   Microsoft.Maps.Location.parseLatLong(mdl.Map.bh).longitude
      // ),
    },
  }

  const onError = (err) => log("err")(err)
  const onSuccess = (location) => { }

  load(mdl, state).fork(onError, onSuccess)
  return {
    view: ({ attrs: { mdl } }) =>
      m(
        "section",

        isAdminOrMod(mdl) &&
        m(
          "section",
          state.isEdit
            ? m(
              ".grouped",
              m("input", {
                type: "text",
                value: state.input,
                oninput: (e) => (state.input = e.target.value),
              }),
              state.newLocation
                ? [
                  m(
                    "button.outline.bd-danger",
                    { onclick: () => restartFindResident(mdl, state) },
                    "restart"
                  ),
                  m(
                    "button.outline.bd-primary",
                    { onclick: () => saveResident(mdl, state) },
                    "Save"
                  ),
                ]
                : [
                  m(
                    "button.primary",
                    { onclick: () => findResident(mdl, state) },
                    "Search"
                  ),
                  m(
                    "button.outline.bd-danger",
                    { onclick: () => toggleEditResidents(mdl, state) },
                    "Cancel"
                  ),
                ]
            )
            : m(
              "button.outline.bd-primary",
              { onclick: () => toggleEditResidents(mdl, state) },
              "Edit"
            ),

          state.findLocationResults.any() &&
          m(
            "ul",
            state.findLocationResults.map((location) =>
              m(
                "li.grouped",
                m("p", location.formatted),
                m(
                  "button",
                  {
                    onclick: () => selectLocation(mdl, state, location),
                  },
                  "Select"
                )
              )
            )
          )
        ),

        m("section#map", {
          oncreate: ({ dom }) => (state.dom = dom),
          style: {
            position: "relative",
            // width: "500px",
            height: "500px",
            margin: "0 auto",
          },
        })
      ),
  }
}

export default BonhamAcresMap

