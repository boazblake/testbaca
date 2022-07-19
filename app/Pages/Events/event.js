import m from "mithril"
import {
  CalendarLine,
  HappyFaceLine,
  HeartLine,
  HomeSolid,
  SadFaceLine,
  UserLine,
} from "@mithril-icons/clarity/cjs"
import DateTime from "@/Components/DateTime"
import { DAYSOFWEEK, isAdminOrMod } from "@/Utils"
import { includes, without } from "ramda"

const updateEventTask = (mdl) => (id) => (event) =>
  mdl.http.back4App.putTask(mdl)(`Classes/Events/${id}`)(event)

const onError = (e) => console.log("e", e)

const onSuccess = (event, field, value) => () => (event[field] = value)

const updateEvent = (xs) => (x) =>
  xs.includes(x) ? without([x], xs) : xs.concat([x])

const updateAttendees = (mdl, event) => {
  let attendees = updateEvent(event.attendees)(mdl.user.objectId)
  updateEventTask(mdl)(event.id)({ attendees }).fork(
    onError,
    onSuccess(event, "attendees", attendees)
  )
}
const updateLikes = (mdl, event) => {
  let likes = updateEvent(event.likes)(mdl.user.objectId)
  updateEventTask(mdl)(event.id)({ likes }).fork(
    onError,
    onSuccess(event, "likes", likes)
  )
}

const Event = {
  view: ({
    attrs: { mdl, event, previewEvent, editEvent, resetState, state },
  }) =>
    m(
      ".modal-container",
      m(
        ".modal",
        m(
          "header.modal-header",
          m("h2.text-primary strong is-center", event.title.toUpperCase())
        ),

        m(
          "section.modal-content ",

          m(
            ".row",
            m(
              ".col",
              m(
                ".grouped",
                m(CalendarLine, { fill: "#14854f", height: 35, width: 35 }),
                m(DateTime, { event })
              ),

              event.isRecur &&
              m(
                ".grouped",
                "This event reoccurs on the following days: ",
                event.daysRecur.map((idx) => DAYSOFWEEK[idx]).join(", ")
              ),

              event.location &&
              m(
                "h4.grouped",
                m(HomeSolid, { fill: "#14854f", height: 35, width: 35 }),
                m("label", event.location)
              ),
              event.allDay &&
              m(".grouped", m("label.tag.primary", "All Day Event"))
            ),
            m(
              ".col",
              m(
                ".grouped clear icon",
                m(UserLine, { height: 35, width: 35, fill: "#14854f" }),
                m("label", "Attendees: ", event.attendees.length)
              ),
              mdl.state.isAuth() &&
              m(
                ".tag grouped",
                m(
                  ".button.clear icon",
                  { onclick: () => updateAttendees(mdl, event) },
                  includes(mdl.user.objectId, event.attendees)
                    ? m(
                      "",
                      m(HappyFaceLine, {
                        fill: "green",
                      }),
                      m("", "I'm Attending!")
                    )
                    : m("", m(SadFaceLine), m("", "Not Attending"))
                ),
                m(
                  ".button.clear icon-only",
                  { onclick: () => updateLikes(mdl, event) },
                  m(HeartLine, {
                    fill: includes(mdl.user.objectId, event.likes) && "red",
                  })
                )
              )
            )
          ),
          m(".grouped", m("img", { src: event.image })),
          m("hr.bd-primary"),
          m(".grouped.container", m("p.p-t-25", event.description))
        ),
        m(
          "footer.modal-footer",

          m(
            ".tabs grouped",
            (event.createdBy == mdl.user.name || isAdminOrMod(mdl)) &&
            m(
              "button.button.secondary.is-full-width",
              {
                onclick: (e) => {
                  editEvent(true)
                  previewEvent(false)
                  e.preventDefault()
                },
                role: "button",
                disabled: false,
              },
              "Edit"
            ),
            m(
              "button.button.primary.is-full-width",
              {
                onclick: () => {
                  resetState(state)
                  mdl.state.selectedPreviewEvent(null)
                  previewEvent(false)
                },
              },
              "Close"
            )
          )
        )
      )
    ),
}

export default Event

