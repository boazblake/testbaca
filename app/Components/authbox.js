import NavLink from "@/Components/nav-link.js"
import { isActiveRoute, isAdminOrMod } from "@/Utils/index.js"
import m from "mithril"

const AuthBox = () => {
  return {
    view: ({ attrs: { mdl } }) =>
      mdl.state.isAuth()
        ? m(
          ".is-center",
          isAdminOrMod(mdl) &&
          m(NavLink, {
            selector: "button",
            mdl,
            href: `/admin/${mdl.user.routename}`,
            link: "Admin",
            classList: `${isActiveRoute(
              `/admin/${mdl.user.routename}`
            )} button dark`,
          }),
          m(NavLink, {
            selector: "button",
            mdl,
            href: `/account/${mdl.user.routename}`,
            role: "button",
            link: "Account",
            classList: `${isActiveRoute(
              `/account/${mdl.user.routename}`
            )} button primary`,
          }),
          m(NavLink, {
            selector: "button",
            mdl,
            href: "/logout",
            role: "button",
            link: "Logout",
            classList: "button secondary",
          })
        )
        : m(
          ".grouped.is-center",
          m(NavLink, {
            selector: "button",
            mdl,
            role: "button",
            href: "/login",
            link: "Login",
            classList: `${isActiveRoute("/login")} button primary`,
          }),
          m(NavLink, {
            selector: "button",
            mdl,
            role: "button",
            href: "/register",
            link: "Register",
            classList: `${isActiveRoute("/register")} button secondary`,
          })
        ),
  }
}

export default AuthBox

