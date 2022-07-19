import m from "mithril"
export default {
  view: ({ attrs: { mdl, children } }) =>
    m(
      "main.bg-white.animated.zoomIn",
      mdl.state.route.name &&
      m(
        "#page-title.is-marginless.text-primary",
        m(
          "p.text-center.p-t-25.is-vertical-align.is-horizontal-align.is-center",
          {
            style: {
              fontWeight: "bolder",
              fontSize: "xx-large",
              // height: !mdl.state.route.name && "57px",
            },
          },
          mdl.state.route.name
        )
      ),
      children
    ),
}

