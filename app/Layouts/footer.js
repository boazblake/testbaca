import m from "mithril"
const Footer = () => {
  return {
    view: ({ attrs: { mdl } }) =>
      m(
        "footer.footer.grid.card",
        m(
          "section.row",
          m(
            ".col-6",
            m("h2", "Connect with Bonham Acres via"),
            m(
              ".container.grouped",
              m(
                "a.row.underline.nav-link",
                {
                  target: "__blank",
                  name: "facebook",
                  href: "https://www.facebook.com/groups/BonhamAcres?modal=false&should_open_composer=false&hoisted_section_header_type=notifications&show_migration_preparation_dialog=false&show_migration_onboarding_dialog=false",
                },
                m("img", {
                  style: { width: "50px", height: "50px" },
                  src: "app/assets/icons/facebook.webp",
                })
              ),
              m(
                "a.row.underline.nav-link",
                {
                  target: "__blank",
                  name: "nextdoor",
                  href: "https://nextdoor.com/neighborhood/bonhamacres--houston--tx/",
                },
                m("img", {
                  style: { width: "50px", height: "50px" },
                  src: "app/assets/icons/nextdoor.webp",
                })
              ),
              m(
                "a.row.underline.nav-link",
                {
                  target: "__blank",
                  name: "gmail",
                  href: "http://mailto:bonhamacrescivicassociation@gmail.com/",
                },
                m("img", {
                  style: { width: "50px", height: "50px" },
                  src: "app/assets/icons/gmail.webp",
                })
              )
            ),
            m("p", "bonhamacrescivicassociation at gmail dot com"),
            m("p", "Bellaire, TX 77401")
          ),
          m(
            ".col-6",
            m("h3", "Useful Links"),
            m(
              "ul.no-list",
              m(
                "li",
                m(
                  "a.row.underline.nav-link",
                  {
                    target: "__blank",
                    href: "https://www.bonhamacres.org/city-ordinances",
                  },
                  "City of Houston City Ordinances"
                )
              ),
              m(
                "li",
                m(
                  "a.row.underline.nav-link",
                  {
                    target: "__blank",
                    href: "https://09ee40f4-9ff7-4e3d-819c-429f2403854d.filesusr.com/ugd/537320_f8abdef644b04cde8dc36f671bb9868f.pdf",
                  },
                  "COH trash facts"
                )
              ),
              m(
                "li",
                m(
                  "a.row.underline.nav-link",
                  {
                    target: "__blank",
                    href: "https://www.houstontx.gov/solidwaste/Recycle_Cal.pdf",
                  },
                  "COH recycling calendar Schedule B"
                )
              ),
              m(
                "li",
                m(
                  "a.row.underline.nav-link",
                  {
                    target: "__blank",
                    href: "https://mycity.maps.arcgis.com/apps/webappviewer/index.html?id=63ed96f439fe404387c9f9e479dc4965",
                  },
                  "COH trash service day"
                )
              ),
              m(
                "li",
                m(
                  "a.row.underline.nav-link",
                  {
                    target: "__blank",
                    href: "http://www.houstontx.gov/solidwaste/treewaste.html",
                  },
                  "COH tree and junk waste program"
                )
              ),
              m(
                "li",
                m(
                  "a.row.underline.nav-link",
                  {
                    target: "__blank",
                    href: "http://www.centerpointenergy.com/en-us/residential/customer-service/electric-outage-center/report-streetlight-outages?sa=ho",
                  },
                  "Streetlight outage repair"
                )
              ),
              m(
                "li",
                m(
                  "a.row.underline.nav-link",
                  { target: "__blank", href: "http://www.hcad.org/" },
                  "Harris County Appraisal District"
                )
              ),
              m(
                "li",
                m(
                  "a.row.underline.nav-link",
                  { target: "__blank", href: "http://www.hcfcd.org/" },
                  "Harris County Flood Control District"
                )
              ),
              m(
                "li",
                m(
                  "a.row.underline.nav-link",
                  {
                    target: "__blank",
                    href: "https://09ee40f4-9ff7-4e3d-819c-429f2403854d.filesusr.com/ugd/537320_2472d77b27c640bfa348613b3aa86c95.pdf",
                  },
                  "Construction in a Floodplain"
                )
              )
            )
          )
        )
      ),
  }
}

export default Footer

