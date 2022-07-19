import m from 'mithril'

const toRoutes = (mdl) => (acc, route) => {
  acc[route.route] = {
    onmatch: (args, path, fullroute) => {
      mdl.state.showNavModal(false)
      if (route.group.includes("authenticated") && !mdl.state.isAuth()) {
        console.log('m.route.get()', mdl.state.isAuth(), m.route.get())
        mdl.route.set(m.route.get())
      }
      mdl.state.route = route
      mdl.state.anchor = path.split("#")[1]
      mdl.state.navState(route.id)
      if (route.route.split("/")[2]) {
        mdl.state.subnavState(route.route)
        mdl.state.navState(route.route.split("/")[1])
      } else {
        mdl.state.subnavState(null)
        mdl.state.navState(route.id)
      }
      let isAnchor = Boolean(mdl.state.anchor)
      route.onmatch(mdl, args, path, fullroute, isAnchor)
    },
    render: () => route.component(mdl),
  }
  return acc
}

const App = (mdl) => mdl.Routes.reduce(toRoutes(mdl), {})

export default App
