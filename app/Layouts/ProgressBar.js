import m from "mithril"
const ProgressBar = () => {
  return {
    view: ({
      attrs: {
        mdl: {
          state: {
            loadingProgress: { value, max },
          },
        },
      },
    }) =>
      m(
        ".progress-bar",
        m("progress.progress-bar", {
          id: "progressbar",
          value: value ? value() : 0,
          max: max ? max() : 0,
        })
      ),
  }
}

export default ProgressBar
