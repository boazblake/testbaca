import m from "mithril"
import dayjs from "dayjs"
import { propEq, head, tail } from "ramda"
import FullCalendar from "@/Utils/fullcalendar.min.js"

const getCellDate = (target) => {
  if (["MAIN", "BUTTON"].includes(target.tagName)) return null
  return target.tagName == "TD"
    ? target.dataset.date
    : getCellDate(target.parentNode)
}

const onEventClick = (mdl, state) => (info) => {
  info.jsEvent.preventDefault()
  let id = info.event.extendedProps.objectId
  state.event = state.events.find(propEq("objectId", id))
  let start = state.event.start.split("T")
  let end = state.event.end.split("T")
  state.event.startDate = head(start)
  state.event.startTime = head(tail(start))
  state.event.endDate = head(end)
  state.event.endTime = head(tail(end))
  state.event.id = id
  state.previewEvent(true)

  if (info.event.url) {
    window.open(info.event.url)
  }
}

const formatEventForCalendar = (event) =>
  event.isRecur
    ? {
      daysOfWeek: event.daysRecur,
      startRecur: event.start,
      endRecur: event.end,
      ...event,
    }
    : event

const initCal = (mdl, dom, state, events) => {
  return new FullCalendar.Calendar(dom, {
    events,
    eventClick: onEventClick(mdl, state),
    initialView: "dayGridMonth",
    initialDate: new Date(),
    selectable: true,
    editable: true,
    droppable: true,
    headerToolbar: {
      left: "today",
      center: "title",
      right: "prev next",
      // right: "dayGridMonth,timeGridWeek,timeGridDay",
    },
    // eventDidMount: function (info) {
    // var tooltip = new Tooltip(info.el, {
    // title: info.event.extendedProps.description,
    // placement: "top",
    // trigger: "hover",
    // container: "body",
    // })
    // },
  })
}

const Calendar = {
  view: ({ attrs: { mdl, state } }) =>
    m("section#calendar", {
      oncreate: ({ dom }) => {
        let events = state.events.map(formatEventForCalendar)
        state.calendar = initCal(mdl, dom, state, events)
        state.calendar.render()
      },
      onclick: (e) => {
        let date = getCellDate(e.target)
        if (mdl.state.isAuth() && !state.previewEvent() && date) {
          console.log("date", date, dayjs(date).add(1, "day").toISOString())
          state.selectedDate(date)
          state.event.startDate = state.selectedDate()
          state.event.endDate = dayjs(date)
            .add(1, "day")
            .toISOString()
            .split("T")[0]
          state.selectedDate() && state.showEditor(true)
        }
      },
    }),
}

export default Calendar

