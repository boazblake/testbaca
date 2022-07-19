import m from "mithril"
const state = {
  date: "",
  time: "",
  location: "",
  subject: "",
  message: "",
  firstName: "",
  lastName: "",
  email: "",
  images: [],
}

const resetState = () => {
  state.date = ""
  state.time = ""
  state.location = ""
  state.subject = ""
  state.message = ""
  state.firstName = ""
  state.lastName = ""
  state.email = ""
  state.images = []
}

const submitReport = (mdl) => {
  const onSuccess = (s) => { }
  const onError = (e) => log("submitReport - error")(e)
  console.log("submit", state)
  // save imgBB then

  // mdl.http.back4App
  //   .postTask(mdl)("Classes/Reports")(state)
  //   .fork(onError, onSuccess)
}

const footer = (mdl) =>
  m(
    ".is-right grouped",
    m(
      "button.button.primary",
      {
        onclick: (e) => {
          e.preventDefault()
          submitReport(mdl)
        },
      },
      "Submit Report"
    ),
    m(
      "button.button.secondary",
      {
        onclick: (e) => {
          e.preventDefault()
          mdl.toggleLayoutModal(mdl)
        },
      },
      "cancel"
    )
  )

const form = m(
  "form",
  m(
    "formgroup.grouped",
    m(
      "label",
      "Date",
      m("input", {
        type: "date",
        oninput: (e) => (state.date = e.target.value),
      })
    ),
    m(
      "label",
      "Time",
      m("input", {
        type: "time",
        oninput: (e) => (state.time = e.target.value),
      })
    )
  ),

  m(
    "formgroup",
    m(
      "label",
      "Location",
      m("input", {
        oninput: (e) => (state.location = e.target.value),
      })
    ),

    m(
      "label",
      "Violation",
      m(
        "select",
        {
          onchange: (e) => (state.violation = e.target.value),
        },
        m("option", { value: "" }, "Select a violation"),
        m("option", { value: "Yard Parking" }, "Yard Parking"),
        m("option", { value: "Overgrown Lot" }, "Overgrown Lot"),
        m(
          "option",
          { value: "Garbage / Trash / Rubbish" },
          "Garbage / Trash / Rubbish"
        ),
        m(
          "option",
          { value: "Junked auto appliances / furniture" },
          "Junked auto appliances / furniture"
        ),
        m("option", { value: "new construction" }, "new construction"),
        m(
          "option",
          { value: "Business in westview terrace" },
          "Business in westview terrace"
        ),
        m(
          "option",
          { value: "Trailer being used as residance" },
          "Trailer being used as residance"
        ),
        m("option", { value: "Other" }, "Other")
      )
    ),

    m(
      "label",
      "Subject",
      m("input", {
        oninput: (e) => (state.subject = e.target.value),
      })
    ),

    m(
      "label",
      "Message",
      m("textarea", {
        oninput: (e) => (state.message = e.target.value),
      })
    )
  ),

  m(
    "formgroup.grouped",
    m(
      "label",
      "First Name",
      m("input", {
        oninput: (e) => (state.firstName = e.target.value),
      })
    ),
    m(
      "label",
      "Last Name",
      m("input", {
        oninput: (e) => (state.lastName = e.target.value),
      })
    )
  ),
  m(
    "formgroup",
    m(
      "label",
      "Email",
      m("input", {
        oninput: (e) => (state.email = e.target.value),
      })
    )
  ),
  m(
    "formgroup",
    m(
      "label",
      "Attachement",
      m("input", {
        oninput: (e) => (state.images = e.target.files),
        type: "file",
        id: "files",
      }),
      state.images[0] &&
      m("img", {
        src: URL.createObjectURL(state.images[0]),
      })
    )
  )
)

const ViolationReport = (mdl) => {
  mdl.modal.content(form)
  mdl.modal.footer(footer(mdl))
  mdl.toggleLayoutModal(mdl)
}

export default ViolationReport

