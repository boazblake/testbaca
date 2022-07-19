import m from "mithril"
import NavLink from "@/Components/nav-link.js"
const isActiveRoute = (a, b) => (a == b ? "active button outline" : "")

const routes = (mdl) => mdl.Routes.filter((r) => r.group.includes("navmenu"))

const Navbar = {
  view: ({ attrs: { mdl } }) =>
    m(
      "nav.nav#navbar.is-full-width",
      routes(mdl).map((r) =>
        m(NavLink, {
          // onmouseover: (e) => {
          //   mdl.state.navState(r.route)
          // },
          onclick: (e) => {
            if (r.children.any()) {
              mdl.state.navState(r.id)
              e.stopPropagation()
              e.preventDefault()
            }
          },
          mdl,
          role: "button",
          href: r.route,
          link: r.name,
          classList: `primary clear ${isActiveRoute(
            `/${mdl.state.navState()}`,
            r.route
          )}`,
        })
      )
    ),
}

export default Navbar
