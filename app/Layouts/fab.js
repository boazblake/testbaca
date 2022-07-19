import m from "mithril"
import Hamburger from "@/Components/Hamburger.js"

const Fab = () => ({
  view: ({ attrs: { mdl } }) => {
    console.log("FAB", mdl.state.fab())
    return m(
      "button#fab",
      {
        style: { right: `-${mdl.state.fab()}px` },
        onclick: (e) => mdl.state.showNavModal(!mdl.state.showNavModal()),
      },
      m(Hamburger, { mdl })
    )
  },
})
export default Fab
