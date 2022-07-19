import m from "mithril"
import { fetchAll } from "../Layouts"
import DateTime from "@/Components/DateTime"
import { AngleDoubleLine } from "@mithril-icons/clarity/cjs"
import GliderJS from "@/Utils/glider.js"
import { clone } from "ramda"
import dayjs from "dayjs"

const tomorrow = dayjs().add(-1, "day")

const eventIsUpcoming = (evt) => dayjs(evt.startDate).isAfter(tomorrow)

const state = {
  events: null,
  blogs: null,
  images: null,
}

const createCarousel = (dom) => {
  let slides = dom.children[1]
  let prev = dom.children[2].children[0]
  let next = dom.children[2].children[1]

  const slider = new GliderJS(slides, {
    // `auto` allows automatic responsive
    // width calculations
    slidesToShow: "auto",
    slidesToScroll: "auto",

    // should have been named `itemMinWidth`
    // slides grow to fit the container viewport
    // ignored unless `slidesToShow` is set to `auto`
    // itemWidth: "350px",

    // if true, slides wont be resized to fit viewport
    // requires `itemWidth` to be set
    // * this may cause fractional slides
    // exactWidth: false,

    // speed aggravator - higher is slower
    duration: 0.5,
    // dot container element or selector
    // dots: "CSS Selector",

    // arrow container elements or selector
    arrows: {
      prev,
      next,
    },

    // allow mouse dragging
    draggable: true,
    // how much to scroll with each mouse delta
    dragVelocity: 3.3,

    // use any custom easing function
    // compatible with most easing plugins
    easing: function (x, t, b, c, d) {
      return c * (t /= d) * t + b
    },

    // event control
    scrollPropagate: false,
    rewind: true,
    eventPropagate: true,

    // Force centering slide after scroll event
    scrollLock: true,
    // how long to wait after scroll event before locking
    // if too low, it might interrupt normal scrolling
    scrollLockDelay: 150,

    // Force centering slide after resize event
    resizeLock: true,

    // Glider.js breakpoints are mobile-first
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 4,
          itemWidth: "100%",
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 1000,
        settings: {
          slidesToShow: 3,
          itemWidth: "100%",
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 624,
        settings: {
          slidesToShow: 2,
          itemWidth: "100%",
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 300,
        settings: {
          slidesToShow: 1,
          itemWidth: "100%",
          slidesToScroll: 1,
        },
      },
    ],
  })



  state[dom.id] = slider
}

const Blog = {
  view: ({ attrs: { mdl, idx, blog } }) =>
    m(
      m.route.Link,
      {
        selector: "",
        href: `/social/blog-post:${blog.objectId}`,
        key: idx,
        style: {
          height: "200px",
          alignContent: "stretch",
          overflow: "auto",
        },
      },
      m(
        ".card.opacity-overlay.is-vertical-align m6 row",
        {},
        m("img", {
          src: blog.img || "assets/images/main.webp",
          alt: "",
          style: {
            objectFit: "contain",
            maxHeight: "150px",
          },
        }),
        m("h2.text-primary text-wrap", blog.title)
      )
    ),
}

const Img = {
  view: ({ attrs: { mdl, idx, img } }) =>
    m(
      ".card.m6",
      {
        onclick: () => {
          mdl.modal.content(
            m("img.is-center", {
              style: { height: "100%", margin: "0 auto" },
              src: img.image,
              alt: "",
            })
          )
          mdl.state.showLayoutModal(true)
        },
        style: {
          width: "250px",
        },
      },
      m("img.is-center", {
        style: { height: "100%", margin: "0 auto" },
        key: idx,
        src: img.thumb,
        alt: "",
      })
    ),
}

const Event = {
  view: ({ attrs: { mdl, idx, event } }) =>
    m(
      m.route.Link,
      {
        selector: "",
        onclick: () => mdl.state.selectedPreviewEvent(event.objectId),
        href: "/social/events",
        key: idx,
        style: {
          height: "200px",
          backgroundImage: event.image,
          alignContent: "stretch",
          overflow: "auto",
        },
      },
      m(
        ".card.is-vertical-align m6 row",
        {},
        event.allDay && m("p.tag", "All Day Event!"),
        m(
          ".row.grouped",
          m("h2.is-left.text-primary text-wrap", event.title),
          m("img.is-right", {
            alt: "",
            style: {
              maxHeight: "100px",
            },
            src: event.image,
          })
        ),
        m(DateTime, { event })
      )
    ),
}

const Slider = {
  view: ({ attrs: { mdl, data, type } }) =>
    m(
      ".grouped.glider",
      {
        style: { maxHeight: "350px" },
      },
      clone(data)
        .reverse()
        .map((item, idx) => {
          if (type == "event") return m(Event, { mdl, event: item, idx })
          if (type == "img") return m(Img, { mdl, img: item, idx })
          if (type == "blog") return m(Blog, { mdl, blog: item, idx })
        })
    ),
}

const Nav = {
  view: () =>
    m(
      "nav.p-t-25.row",
      m(
        ".nav-left",
        m(
          "button.button.m-auto.outline.dark",
          {
            style: { width: "80%" },
          },
          m(AngleDoubleLine, {
            style: {
              transform: "rotate(270deg)",
              transition: "transform .3s ease-out",
            },
          })
        )
      ),
      m(
        ".nav-right",
        m(
          "button.button.m-auto.outline.dark",
          {
            style: { width: "80%" },
          },
          m(AngleDoubleLine, {
            style: {
              transform: "rotate(90deg)",
              transition: "transform .3s ease-out",
            },
          })
        )
      )
    ),
}

const Section = {
  view: ({ attrs: { mdl, title, type, data } }) =>
    m(
      "section.row.p-b-25",
      data.any() &&
      m(
        ".glider-contain",
        {
          onbeforeremove: ({ dom }) => state[dom.id].destroy(),
          oncreate: ({ dom }) => createCarousel(dom),
        },
        m("h2.is-center.strong", title),
        m(Slider, { mdl, data, type }),
        m(Nav)
      )
    ),
}

const Home = {
  oninit: fetchAll,
  // oncreate: ({ dom }) => {
  //   let imgs = Array.from(dom.getElementsByTagName("img"))
  //   imgs.map((img) => (img.src = img.dataset.src))
  // },
  view: ({ attrs: { mdl } }) =>
    m(
      "#home-page.container-fluid",
      m(
        "article.grid",
        m(Section, {
          mdl,
          title: "Upcoming Events!",
          type: "event",
          data: mdl.data.events.filter(eventIsUpcoming),
        }),
        m(Section, {
          mdl,
          title: "Latest Blog Posts!",
          type: "blog",
          data: mdl.data.blogs,
        }),
        m(Section, {
          mdl,
          title: "Recent Photos",
          type: "img",
          data: mdl.data.images,
        })
      )
    ),
}

export default Home

