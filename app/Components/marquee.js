import m from "mithril"
const Marq = {
  view: () =>
    m(
      "marquee",
      {
        direction: "right",
        width: "100px",
        height: "100px",
        behaviour,
        scrolldelay,
        truespeed: "",
      },
      m("marquee", {
        style: { background: "linear-gradient(to left top, white, lightgrey)" },
        direction: "down",
        width: "400px",
        height: "100px",
        id: "fill",
      })
    ),
}

export default Marq

