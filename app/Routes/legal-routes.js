import m from "mithril"
import Layout from "@/Layouts/index.js"
import Default from "@/Pages/default.js"
import CityOrd from "@/Pages/city-ordinances.js"
import DeedRes from "@/Pages/deed-restrictions.js"

import { scrollToAnchor, ScrollToPageTitle } from "@/Utils/index.js"

const LegalRoutes = [
  {
    id: "legal",
    name: "Legal",
    // icon: Icons.home,
    route: "/legal",
    isNav: true,
    group: ["navmenu"],
    children: ["deed-restrictions", "city-ordinances"],
    options: [],
    onmatch: (mdl, args, path, fullroute, isAnchor) => {
      return isAnchor ? scrollToAnchor(mdl.state.anchor) : ScrollToPageTitle()
    },
    component: (mdl) => m(Layout, { mdl }, m(Default, { mdl })),
  },
  {
    id: "deed-restrictions",
    name: "Deed Restrictions",
    // icon: Icons.home,
    route: "/legal/deed-restrictions",
    isNav: true,
    group: ["nav", "legal"],
    children: [],
    options: [],
    onmatch: (mdl, args, path, fullroute, isAnchor) => {
      return !isAnchor && ScrollToPageTitle()
    },
    component: (mdl) =>
      m(Layout, { mdl }, m(DeedRes, { key: mdl.state.anchor, mdl })),
  },
  {
    id: "city-ordinances",
    name: "City Ordinances",
    // icon: Icons.home,
    route: "/legal/city-ordinances",
    isNav: true,
    group: ["nav", "legal"],
    children: [],
    options: [],
    onmatch: (mdl, args, path, fullroute, isAnchor) => {
      return isAnchor ? scrollToAnchor(mdl.state.anchor) : ScrollToPageTitle()
    },
    component: (mdl) => m(Layout, { mdl }, m(CityOrd, { mdl })),
  },
]

export default LegalRoutes
