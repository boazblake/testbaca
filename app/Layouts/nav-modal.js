import m from "mithril"
import { PopOutLine } from "@mithril-icons/clarity/cjs"
import NavLink from "@/Components/nav-link"
import AuthBox from "@/Components/authbox"
import { isActiveRoute } from "@/Utils/index.js"

let navItemstate = {
  onHover: () => { },
}

const toggleRoutes = (mdl) => (id) => {
  let keys = Object.keys(mdl.navState)
  keys.map((k) => id !== k && mdl.navState[k](false))
  mdl.navState[id](!mdl.navState[id]())
}

const NavItem = () => {
  return {
    view: ({ attrs: { mdl, href, link, classList } }) =>
      m(NavLink, { mdl, ...navItemstate, href, link, classList }),
  }
}

const displayRoute = (mdl) => (r) => {
  if (r.group.includes("authenticated")) {
    if (mdl.state.isAuth()) {
      return m(NavItem, {
        mdl,
        href: r.route,
        link: r.name,
        classList: `${isActiveRoute(r.route)} col-12`,
      })
    } else {
      return
    }
  } else
    return m(NavItem, {
      mdl,
      href: r.route,
      link: r.name,
      classList: `${isActiveRoute(r.route)} col-12`,
    })
}

const getChildRoutes = (mdl, routeIds) =>
  mdl.Routes.filter((r) => routeIds.includes(r.id))

const NavSection = ({ attrs: { mdl, route, toggleRoutes } }) => {
  let childRoutes = getChildRoutes(mdl, route.children)
  return {
    view: ({ attrs: { isSelected } }) =>
      m(
        "details.grid.col-12.text-primary.animated.pointer",
        {
          class: "primary",
          onclick: (e) => toggleRoutes(mdl)(route.id),
        },
        m("summary.nav-link", route.name),
        m(
          "nav.row.fade.p-x-l-50",
          childRoutes.map((r) =>
            r.group.includes("external")
              ? m(
                "a.col-12 icon nav-link",
                { target: "_blank", href: r.external },
                r.name,
                m(PopOutLine, {
                  margin: "8px",
                  width: "15px",
                  height: "15px",
                })
              )
              : displayRoute(mdl)(r)
          )
        )
      ),
  }
}

const NavModal = ({ attrs: { mdl } }) => {
  const routes = (mdl) => mdl.Routes.filter((r) => r.group.includes("navmenu"))
  let _domOverlay
  let _domModal

  return {
    view: ({ attrs: { mdl } }) =>
      m(
        "section.modal-container.animated#nav-modal",
        {
          oncreate: ({ dom }) => (_domOverlay = dom),
          onclick: (e) => {
            if ([_domModal, _domOverlay].includes(e.target))
              mdl.state.showNavModal(false)
          },
        },
        m(
          "article.modal.card",
          {
            oncreate: ({ dom }) => (_domModal = dom),
            id: "nav-modal",
          },
          m("header.header", m(AuthBox, { mdl })),
          m(
            "nav.modal-content.row.animated",
            routes(mdl).map((r) =>
              r.children.any()
                ? m(NavSection, {
                  mdl,
                  route: r,
                  toggleRoutes,
                  isSelected: mdl.navState[r.id],
                })
                : displayRoute(mdl)(r)
            )
          )
        )
      ),
  }
}

export default NavModal

