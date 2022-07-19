// const getOverFlow = (mdl, overflow) => {
//   console.log(
//     mdl.settings.screenSize,
//     mdl.settings.screenSize == "phone" ? "none" : overflow
//   )
//   return mdl.settings.screenSize == "phone" ? "none" : overflow
// }
import m from "mithril"

const Fig = {
  view: ({ children, attrs: { id } }) =>
    m(
      `figure#${id}-slidy`,
      {
        "flex-direction": "column",
        "justify-content": "center",
        "scroll-snap-align": "start",
      },
      children
    ),
}

const Grid = {
  onremove: () => { },
  view: ({ children, attrs: { id, maxheight, height, overflow, mdl } }) =>
    m(
      `frow-row`,
      {
        style: {
          width: "80%",
          "scroll-snap-type": " mandatory",
          "scroll-snap-points-y": " repeat(3rem)",
          "scroll-snap-type": " x mandatory",
        },
      },
      children.map((child) => m(Fig, { id }, child))
    ),
}

export default Grid
