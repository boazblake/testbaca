import m from "mithril"
import ViolationReport from "@/Components/report"
import Stream from "mithril-stream"
// import Modal from "@/Components/Modal"
import {
  CarLine,
  ExclamationTriangleLine,
  HomeLine,
  MusicNoteLine,
  PopOutLine,
  TrashLine,
} from "@mithril-icons/clarity"

const state = {
  showOrdinanceViolation: Stream(false),
  showModal: Stream(false),
  title: null,
  contents: null,
}

const contents = {
  car: {
    icons: { default: CarLine },
    title: "Car Parking in Residential Area",
    contents: m(
      "", // ".container",
      // {
      //   style: { maxHeight: "50vh", overflow: "auto", wordBreak: "break-word" },
      // },
      m(
        "em",
        "Parking of Vehicles on Residential Property Chapter 28, Article X"
      ),
      m(
        "p",
        "To read the complete ordinance, go to ",
        m(
          "a.nav-link",
          { target: "__blank", href: "www.Municode.com" },
          "www.Municode.com"
        ),
        " on the internet and search for City of Houston, Chapter 28, Article X, or enter Parking of Vehicles on Residential Property in the search block."
      ),
      m(
        "p",
        m(
          "a.nav-link",
          {
            target: "__blank",
            href: "https://www.houstontx.gov/police/pdfs/brochures/english/Parking_of_vehicles_on_residential_propert.pdf",
          },
          "https://www.houstontx.gov/police/pdfs/brochures/english/Parking_of_vehicles_on_residential_propert.pdf"
        )
      ),

      m(
        "p",
        "You can find out if a residence is covered by the ordinance by calling 311 or going to the city map viewer on the internet at ",
        m(
          "a.nav-link",
          {
            target: "__blank",
            href: "http://mycity.houstontx.gov/public/",
          },
          " http://mycity.houstontx.gov/public/ "
        ),
        "and activating ",
        m("em", "the Prohibited Yard Parking application: ")
      ),
      m(
        "p",
        m(
          "a.nav-link",
          {
            target: "__blank",
            href: "https://www.houstontx.gov/planning/Prohibited-Yard-Parking-Ordinance.html",
          },
          "https://www.houstontx.gov/planning/Prohibited-Yard-Parking-Ordinance.html"
        )
      )
    ),
  },
  trash: {
    icons: { default: TrashLine },
    title: "Trash & Dumpster Ordinances",
    contents: m(
      "", // ".container",
      // {
      //   style: { maxHeight: "50vh", overflow: "auto", wordBreak: "break-word" },
      // },
      m(
        "p",
        m(
          "a.nav-link",
          { target: "__blank", href: "https://www.rollouthouston.com/" },
          ["Roll Out Houston!", m(PopOutLine)]
        )
      ),
      m(
        "p",
        m(
          "a.nav-link",
          {
            target: "__blank",
            href: "https://www.houstontx.gov/solidwaste/trashfacts.pdf",
          },
          ["Houston Trash Facts PDF", m(PopOutLine)]
        )
      )
    ),
  },
  noise: {
    icons: { default: MusicNoteLine },
    title: "Noise Ordinances",
    contents: m(
      "", // ".container",
      // {
      //   style: { maxHeight: "50vh", overflow: "auto", wordBreak: "break-word" },
      // },
      m(
        "p",
        "According to the ",
        ("a.nav-link",
          { target: "__blank", href: "#" },
          " Houston Sound Ordinance, "),
        " sound ",
        m("span.strong", " cannot exceed 65 decibels during the day "),
        "and",
        m("span.strong", " 58 decibels at night in residential areas."),
        " Permits must be obtained for sound up to 75 decibels until 10pm on Sundays through Thursdays and until 11pm on Fridays and Saturdays. ",
        " The Houston ordinance penalizes up to ",
        m("span.strong", " $1, 000 per offense or per hour.")
      ),

      m(
        "p",
        m(
          "a.nav-link",
          {
            target: "__blank",
            href: "https://library.municode.com/tx/houston/codes/code_of_ordinances?nodeId=COOR_CH30NOSOLERE",
          },
          "https://library.municode.com/tx/houston/codes/code_of_ordinances?nodeId=COOR_CH30NOSOLERE"
        )
      )
    ),
  },
  nuisance: {
    icons: { default: HomeLine },
    title: "Nuisance Ordinances",
    contents: m(
      "", // ".container",
      // {
      //   style: { maxHeight: "50vh", overflow: "auto", wordBreak: "break-word" },
      // },
      m(
        "p",
        m(
          "a.nav-link",
          {
            target: "__blank",
            href: "https://statutes.capitol.texas.gov/Docs/HS/htm/HS.342.htm#342.004",
          },
          "Section 342.004 of the Texas Health and Safety Code"
        )
      ),
      m(
        "p",
        "State law giving authority to municipalities to require landowners to keep their property free of weeds, brush and conditions constituting a public nuisance."
      ),
      m(
        "p",
        m(
          "a.nav-link",
          {
            target: "__blank",
            href: "https://statutes.capitol.texas.gov/Docs/TN/htm/TN.311.htm#311.003",
          },
          "Sections 311.003 - 311.004 of the Texas Transportation Code"
        )
      ),

      m(
        "p",
        "State laws giving authority to type-A municipalities to require a person to keep the front of their premise free of weeds and trash. It also gives them the authority to require a landowner to improve their sidewalk and allows home-rule municipalities to declare a defective sidewalk a public nuisance."
      ),
      m(
        "p",
        m(
          "a.nav-link",
          {
            target: "__blank",
            href: "https://statutes.capitol.texas.gov/Docs/TN/htm/TN.683.htm#E",
          },
          "Texas Transportation Code, Chapter 683, Subchapter E"
        )
      ),
      m(
        "p",
        "State law governing junked vehicles; declaring them a public nuisance."
      )
    ),
  },
}

const Modal = () => {
  return {
    view: ({ attrs: { mdl, title, contents } }) =>
      m(
        "article.modal-container",
        {
          oncreate: ({ dom }) =>
            dom.scrollIntoView({
              behavior: "smooth",
              block: "start",
              inline: "center",
            }),
          onclick: () => {
            state.contents = null
            state.showModal(false)
          },
        },
        m(
          "article.modal.container.card",
          m("header.model-header", m("h2", title)),
          m("section.modal-content", contents)
        )
      ),
  }
}

const CardOrd = () => {
  let isSelected = false

  return {
    view: ({ attrs: { mdl, id, title, icons, contents } }) =>
      m(
        "article.card.col-6.bd-primary.p-x-50.p-y-6.pointer",
        {
          id,
          class: isSelected && "text-success",
          onmouseover: () => (isSelected = true),
          onmouseout: () => (isSelected = false),
          onclick: () => {
            mdl.modal.header(m("h2", title))
            mdl.modal.content(contents)
            mdl.toggleLayoutModal(mdl)
            // state.showModal(true)
          },
        },

        m(
          "hgroup.row",
          m(icons.default, {
            class: "col.is-center",
            fill: isSelected && "#14854f",
            style: { margin: "0 auto", width: "30%", height: "250px" },
          }),
          m("h2.col.is-center", title)
        )
      ),
  }
}

const CityOrd = {
  view: ({ attrs: { mdl } }) =>
    m(
      "section.container",
      { class: mdl.settings.screenSize == "desktop" && "p-50" },
      m(
        "section.is-marginless",
        m(
          "p",
          "Bonham Acres is a deed restricted community in which deed restrictions are actively enforced. ",
          m(
            m.route.Link,
            {
              selector: "a.underline",
              class: "strong",
              href: "/legal/deed-restrictions",
            },
            m("em", "The Deed Restrictions")
          ),
          " are intended to preserve and enhance property values as well as to promote safety in our community. "
        ),
        m(
          "p",
          "Many of these deed restrictions are enforced with the assistance of the City of Houston, whose legal department and our council representative have supported and whom have been valuable partners to Bonham Acres when enforcing deed restrictions."
        ),
        m(
          "p",
          "Violations to any of these deed restrictions should be reported directly to the Bonham Acres Civic Association.",

          m(
            ".p-y-6.is-center",
            mdl.state.isAuth()
              ? m(
                "button.button.icon.bd-error",
                {
                  disabled: true,
                  onclick: (e) => ViolationReport(mdl),
                  // state.showOrdinanceViolation(true)
                },
                "COMING SOON Report City Ordinance Violation",
                m(ExclamationTriangleLine, { fill: "red" })
              )
              : m(
                m.route.Link,
                {
                  selector: "button",
                  class: "button.bd-error",
                  href: "/login",
                },
                "Login To Report City Ordinance Violation"
              )
            // state.showOrdinanceViolation() &&
            //   m(ViolationReport, {
            //     mdl,
            //     showModal: state.showOrdinanceViolation,
            //   })
          ),
          m(
            "p",
            m(
              "em",
              "All reports will be treated as anonymous and your name kept private."
            )
          ),
          m(
            "p.strong",
            "Your assistance in reporting violations will go a very long way to protect and enhance our property values."
          )
        )
      ),

      m(
        "section.row",
        Object.keys(contents).map((ord) =>
          m(CardOrd, {
            mdl,
            id: ord,
            title: contents[ord].title,
            icons: contents[ord].icons,
            contents: contents[ord].contents,
          })
        )
      ),
      state.showModal() &&
      m(Modal, {
        mdl,
        title: state.title,
        contents: state.contents,
        close: () => {
          state.contents = null
          state.title = null
          state.showModal(false)
        },
      })
    ),
}

export default CityOrd

