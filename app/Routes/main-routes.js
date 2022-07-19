import m from "mithril"
import Layout from "@/Layouts/index.js"
import BoardMembers from "@/Pages/board-members.js"
import Home from "@/Pages/home.js"
import About from "@/Pages/about.js"
import JoinBACA from "@/Pages/join-baca.js"
import { scrollToAnchor, ScrollToPageTitle } from "@/Utils/index.js"

const Logo = m("img", {
  src: "@assets/images/baca-logo.webp",
})

const Routes = [
  {
    id: "home",
    name: "Welcome to Bonham Acres Civic Association (BACA)",
    // icon: Icons.home,
    route: "/",
    isNav: true,
    group: ["toolbar"],
    children: [],
    options: [],
    onmatch: (mdl, args, path, fullroute, isAnchor) => {
      return isAnchor ? scrollToAnchor(mdl.state.anchor) : ScrollToPageTitle()
    },
    component: (mdl) => m(Layout, { mdl }, m(Home, { mdl })),
  },
  {
    id: "about",
    name: "About Bonham Acres",
    // icon: Icons.home,
    route: "/about",
    isNav: true,
    group: ["navmenu"],
    children: [],
    options: [],
    onmatch: (mdl, args, path, fullroute, isAnchor) => {
      return isAnchor ? scrollToAnchor(mdl.state.anchor) : ScrollToPageTitle()
    },
    component: (mdl) => m(Layout, { mdl }, m(About, { mdl })),
  },
  {
    id: "board-members",
    name: "BACA Board Members",
    // icon: Icons.search,
    route: "/board-members",
    isNav: true,
    group: ["navmenu"],
    children: [],
    options: [],
    onmatch: (mdl, args, path, fullroute, isAnchor) => {
      return isAnchor ? scrollToAnchor(mdl.state.anchor) : ScrollToPageTitle()
    },
    component: (mdl) => m(Layout, { mdl }, m(BoardMembers, { mdl })),
  },
  {
    id: "join-BACA",
    name: "Join Bonham Acres Civic Association",
    // icon: Icons.search,
    route: "/join-BACA",
    isNav: false,
    group: ["navmenu"],
    children: [],
    options: [],
    onmatch: (mdl, args, path, fullroute, isAnchor) => {
      return isAnchor ? scrollToAnchor(mdl.state.anchor) : ScrollToPageTitle()
    },
    component: (mdl) => m(Layout, { mdl }, m(JoinBACA, { mdl })),
  },
]

export default Routes

