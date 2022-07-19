import m from "mithril"
import Loader from "@/Components/loader.js"
import { formatDate } from "@/Utils"
import {
  compose,
  lensProp,
  map,
  over,
  prop,
  propEq,
  reverse,
  sortBy,
} from "ramda"
import BlogPreview from "./blog-preview.js"

const state = {
  errors: {},
  blogs: [],
}

export const formatLensDate = (prpty) => over(lensProp(prpty), formatDate)

export const toViewModel = compose(
  reverse,
  sortBy(propEq("createdAt")),
  map(compose(formatLensDate("updatedAt"), formatLensDate("createdAt")))
)

const loadBlogs = ({ attrs: { mdl } }) => {
  const onError = (error) => (state.errors = error)

  const onSuccess = (results) => (state.blogs = results)

  mdl.http.back4App
    .getTask(mdl)("Classes/Blogs")
    .map(prop("results"))
    .map(toViewModel)
    .fork(onError, onSuccess)
}

const Blog = () => {
  return {
    oninit: loadBlogs,
    onremove: () => {
      state.errors = {}
      state.data = []
    },
    view: ({ attrs: { mdl } }) =>
      mdl.state.isLoading()
        ? m(Loader)
        : m(
          "article.grid.p-y-6.fade",
          m(
            "section.container",
            mdl.state.isAuth() &&
            m(
              "nav.nav.m-y-6",
              m(
                ".nav-center",
                m(
                  m.route.Link,
                  {
                    selector: "button.button.primary",
                    href: "/social/blog-editor:",
                    class:
                      mdl.settings.screenSize == "phone" ? "col-12" : "",
                  },
                  "Add A Blog Post"
                )
              )
            ),
            m(
              ".row",
              state.blogs.any()
                ? state.blogs.map((post) => m(BlogPreview, { mdl, post }))
                : m(
                  "article.card",
                  mdl.state.isAuth()
                    ? m(
                      m.route.Link,
                      {
                        href: "/social/blog-editor:",
                        class: "button primary",
                      },
                      "Add The First Post !"
                    )
                    : m("h1", "Log in to add the First Post!")
                )
            )
          )
        ),
  }
}

export default Blog
