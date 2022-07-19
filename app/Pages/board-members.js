import m from "mithril"
const current = [
  {
    title: "President",
    name: "Tim Hatton",
  },
  {
    title: "Vice President",
    name: "Steve Edwards",
  },
  {
    title: "Secretary",
    name: "Elaine Lupovitch",
  },
  {
    title: "Treasurer",
    name: "Donna Spencer",
  },
]

const past = [
  {
    title: "Vice President",
    name: "Cortney Meza",
  },
  {
    title: "Secretary",
    name: "Alan Hernandez",
  },
  {
    title: "Treasurer",
    name: "David Gessing",
  },
  {
    title: "Deed Restrictions ",
    name: "Henrietta Nixon",
  },
]

const calcSize = (mdl) => {
  switch (mdl.settings.screenSize) {
    case "phone":
      return "12"
    case "wide":
      return "12"
    case "tablet":
      return "6"
    default:
    case "desktop":
      return "4"
  }
}

const BoardMembers = (mdl) => {
  return {
    view: ({ attrs: { mdl } }) =>
      m(
        "article",
        m(
          "section.container",
          m(
            "h2.is-center.is-marginless.m-b-15.strong",
            "2022-2023 Bonham Acres Civic Association Board Members"
          ),
          m(
            ".row",
            current.map(({ title, name }) =>
              m(
                `.card.col-${calcSize(mdl)}`,
                m("h4.text-primary", title),
                m("p", name)
              )
            )
          ),
          m(
            "row.container",
            m(
              "a.button",
              {
                target: "__blank",
                name: "gmail",
                href: "http://mailto:bonhamacrescivicassociation@gmail.com/",
              },
              m("h3", "Click here to send us an email!")
            )
          ),
          m(
            "section.container",
            m("h3.primary-text", "Past Board Members"),
            m(
              "ul",
              past.map((member) => m("li", `${member.title} ${member.name}`))
            )
          )
        )
      ),
  }
}

export default BoardMembers

