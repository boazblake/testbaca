import m from "mithril"
import Default from "@/Pages/default.js"
import Account from "@/Pages/Account/index.js"
import Admin from "@/Pages/Admin"
import Layout from "@/Layouts/index.js"
import { scrollToAnchor, ScrollToPageTitle } from "@/Utils"

const AuthenticatedRoutes = [
  {
    id: "account",
    name: "Account",
    // icon: Icons.logo,
    route: "/account/:name",
    position: ["toolbar"],
    group: ["authenticated"],
    children: [],
    options: [],
    onmatch: (mdl, args, path, fullroute, isAnchor) => {
      return ScrollToPageTitle()
    },
    component: (mdl) =>
      m(Layout, { mdl }, m(Account, { key: mdl.state.anchor, mdl })),
  },
  {
    id: "admin",
    name: "Admin",
    // icon: Icons.logo,
    route: "/admin/:name",
    position: ["toolbar"],
    group: ["authenticated"],
    children: [],
    options: [],
    onmatch: (mdl, args, path, fullroute, isAnchor) => {
      !isAnchor && ScrollToPageTitle()
    },
    component: (mdl) => m(Layout, { mdl }, m(Admin, { mdl })),
  },
  {
    id: "profile-page",
    name: "Profile Page",
    // icon: Icons.home,
    route: "/account/:name/profile",
    position: ["settings-nav"],
    group: ["authenticated"],
    children: [],
    options: [],
    onmatch: (mdl, args, path, fullroute, isAnchor) => {
      console.log(
        "profile page login on match",
        mdl,
        args,
        path,
        fullroute,
        isAnchor,
        !mdl.state.isAuth()
      )
      !isAnchor && ScrollToPageTitle()
    },
    component: (mdl) => m(Layout, { mdl }, m(Default, { mdl })),
  },
  {
    id: "manage-users",
    name: "Manage Users",
    // icon: Icons.users,
    route: "/account/:name/user-management",
    position: ["settings-nav"],
    group: ["authenticated", "admin"],
    children: [],
    options: [],
    onmatch: (mdl, args, path, fullroute, isAnchor) => {
      // console.log(
      //   "manage users on match",
      //   mdl,
      //   args,
      //   path,
      //   fullroute,
      //   isAnchor,
      //   mdl.state.isAuth(),
      // )
      mdl.user.role != "admin" && m.route.set(m.route.get())
      !isAnchor && ScrollToPageTitle()
    },
    component: (mdl) => m(Layout, { mdl }, m(Default, { mdl })),
  },
  {
    id: "logout",
    name: "",
    // icon: Icons.users,
    route: "/logout",
    position: [],
    group: ["authenticated", "admin"],
    children: [],
    options: [],
    onmatch: (mdl, args, path, fullroute, isAnchor) => {
      // PageTitle().scroll({
      //   top: 0,
      //   left: 0,
      //   behavior: "smooth",
      // })

      localStorage.clear()
      sessionStorage.clear()
      mdl.state.isAuth(false)
      mdl.user = {}
      console.log("loggout", mdl)

      let routes = ["/account"]
      let currentRoute = m.route.get()
      routes.map((r) => currentRoute.includes(r))
        ? m.route.set("/")
        : m.route.set(currentRoute)
    },
    component: (mdl) => m(Layout, { mdl }, m(Default, { mdl })),
  },
]

export default AuthenticatedRoutes
