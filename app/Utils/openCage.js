import { path, paths, map, prop } from "ramda"

const toOpenCageFormat = (q) =>
  typeof q == "string"
    ? encodeURIComponent(q)
    : encodeURIComponent(`${q[0]},${q[1]}`)

const toLocationViewModel = ([address, ll]) => ({
  address,
  latlong: JSON.stringify(ll),
})

export const locateQueryTask = (http) => (mdl) => (query) =>
  http.openCage
    .getLocationTask(mdl)(toOpenCageFormat(query))
    .map(prop("results"))
    .map(map(paths([["formatted"], ["geometry"]])))
    .map(map(toLocationViewModel))

export const getBoundsTask = (http) => (mdl) => (coords) =>
  http.openCage
    .getLocationTask(mdl)(toOpenCageFormat(coords))
    .map(path(["results", 0, "bounds"]))
    .map(({ southwest, northeast }) =>
      encodeURIComponent(
        `${southwest.lng},${southwest.lat},${northeast.lng},${northeast.lat}`
      )
    )
