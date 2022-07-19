import { FadeBack } from "@/Styles/animations"
import m from "mithril"

const Loader = () => {
  return {
    view: () =>
      m(
        "#logo-container",
        { onremove: FadeBack },
        m("img#heartbeat.heartbeat", { src: "images/logo.webp" })
      ),
  }
}

export default Loader
