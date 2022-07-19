import m from "mithril"
import D from "dayjs"
import af from "dayjs/plugin/advancedFormat"
D.extend(af)

const DateTime = ({ attrs: { event } }) => {
  const formatDate = (x) => D(x).format("dddd, MMMM Do YYYY")
  const formatTime = (x) => D(x).format("h:mm a")

  return {
    view: () =>
      event.startDate == event.endDate
        ? m(
          ".",
          m("h3", m("label.strong", formatDate(event.startDate))),
          m(
            "h4.grouped",
            m("label", formatTime(event.start)),
            m("label", " - "),
            m("label", formatTime(event.end))
          )
        )
        : m(
          "h4.grouped",
          m("label.strong", formatDate(event.start)),
          m("label", " - "),
          m("label.strong", formatDate(event.end))
        ),
  }
}

export default DateTime

