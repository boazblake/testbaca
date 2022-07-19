import m from "mithril"
import Task from "data.task"

export const getCenterView = (locations) =>
  Microsoft.Maps.LocationRect.fromLocations(locations)

export const setCenterView = (state) => (bounds) =>
  state.map.setView({ bounds, minZoom: 16 })

export const toPushPin = ({ property, lat, lng }) =>
  new Microsoft.Maps.Pushpin(
    {
      altitude: 0,
      altitudeReference: -1,
      latitude: lat,
      longitude: lng,
    },
    {
      title: property,
    }
  )

const AddResidentsTask = (state, xs) => {
  state.locations = xs ? xs : state.locations
  state.entities = state.locations.map(toPushPin)
  return Task.of(state)
}
const loadMapConfig = (mdl) => (state) => {
  const getCenterViewFromStateEntities = () => {
    let locations = state.entities.any()
      ? state.entities.map((e) => e.getLocation())
      : [
        toPushPin({
          property: "BACA",
          lat: Microsoft.Maps.Location.parseLatLong(mdl.Map.bh).latitude,
          lng: Microsoft.Maps.Location.parseLatLong(mdl.Map.bh).longitude,
        }).getLocation(),
      ]

    return getCenterView(locations)
  }

  let centerPoint = getCenterViewFromStateEntities()

  let lat = centerPoint.center.latitude
  let lng = centerPoint.center.longitude

  state.opts.center = new Microsoft.Maps.Location(lat, lng)
  state.map = new Microsoft.Maps.Map(state.dom, state.opts)
  state.map.entities.push(state.entities)
  setCenterView(state)(centerPoint)
  return state
}

const Map = ({ attrs: { mdl, locations } }) => {
  const onError = (err) => log("err")(err)
  const onSuccess = (data) => {
    // log("mad go state success")(data)
  }

  const state = {
    locations,
    dom: null,
    entities: [],
    input: null,
    map: null,
    opts: {
      mapTypeId: Microsoft.Maps.MapTypeId.road,
      zoom: 16,
    },
  }

  const go = (xs) =>
    AddResidentsTask(state, xs).map(loadMapConfig(mdl)).fork(onError, onSuccess)

  return {
    onupdate: (x) =>
      x.attrs.locations.length != state.locations.length &&
      go(x.attrs.locations),
    view: ({ attrs: { mdl, locations } }) => {
      return m(
        "section",
        m("section#map", {
          oncreate: ({ attrs: { mdl }, dom }) => {
            state.dom = dom
            go()
          },
          style: {
            position: "relative",
            width: "500px",
            height: "500px",
            margin: "0 auto",
          },
        })
      )
    },
  }
}

export default Map

