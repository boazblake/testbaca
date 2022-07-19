import m from "mithril"
const JoinBACA = (mdl) => {
  return {
    view: ({ attrs: { mdl } }) =>
      m(
        "",
        m(
          "section.card",
          m(
            "hgroup",
            m(
              "p",
              "BACA operates as a non-profit organization for community and civic improvement and protection and other non-profit purposes."
            ),
            m(
              "p",
              "Any income received shall be applied only to the non-profit purposes and objectives of the organization, and no part of the income shall inure to the benefit of any officer or member."
            ),
            m(
              "p",
              "We will use the ",
              m("span.text-primary", "annual $50 membership"),
              " to maintain ",
              m(
                m.route.Link,
                { selector: "a", class: "underline", href: "/" },
                "bonhamacres.org"
              ),
              ", Bonham Acre monuments, BACA work & communication uphold deed restriction and city ordinances, mailers & signage, social events, other items as voted on by BACA members."
            ),
            m(
              "h3",
              "We are not a HOA",
              m(
                "a",
                {
                  target: "__blank",
                  href: "https://independentamericancommunities.com/2017/06/18/civic-and-neighborhood-associations-very-different-from-modern-hoas/",
                },
                " we are a voluntary civic association "
              ),
              "with the goal of helping one another!!"
            )
          )
        ),
        m(
          "section.bg-primary.text-white.card",
          m("h2", "Why Join?"),
          m(
            "hgroup",
            m(
              "h4",
              "Safety & Peace for You & YOUR Family and everyone else in the neighborhood."
            ),
            m(
              "p",
              "If you want to protect YOU & YOUR family, you can either rely on yourself alone or else with neighbors working together—by reporting crimes and violations that disturb peace, tranquility and joy.  When you",
              m("span.strong", " become involved "),
              "in BACA, you are on the team that will be looking out for each other! "
            )
          ),
          m(
            "hgroup",
            m("h4", "Safeguard YOUR property value."),
            m(
              "p",
              "If you want to protect your property value, you can either rely on someone else to do it or do it yourself by joining other residents to work for the betterment of our community. When you",
              m("span.strong", " join "),
              "BACA, you have better control over community rules and maintenance, which can affect the value of your property.As a ",
              m("span.strong", " homeowner "),
              " it's only normal to have an interest in your investment."
            )
          ),
          m(
            "hgroup",
            m(
              "h4",
              "Work with the City of Houston and Precinct 3 for the benefit of BACA."
            ),
            m(
              "p",
              "If you want to leverage many voices, namely the many members of Bonham Acres, to work with organizations, commercial entities, governments to improvement our neighborhood you need to join."
            )
          )
        )
      ),
  }
}

export default JoinBACA
