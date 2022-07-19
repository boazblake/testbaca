import m from "mithril"
import { Times, CheckLine } from "@mithril-icons/clarity/cjs"
import { toPairs, compose, map, keys, clone } from "ramda"

const formatUIValue = (val) => {
  switch (val) {
    case typeof val == "boolean":
      return val ? m(CheckLine) : m(Times)
      break
    default:
      return val
  }
}

const toColCell = (x) => ({ col: x[0], val: formatUIValue(x[1]) })

export const formatDataForTable = (removeProps, data) => {
  let dto = clone(data)
  removeProps.forEach((prop) => dto.map((d) => delete d[prop]))
  let cols = Array.from(new Set(dto.flatMap(keys)))
  let rows = compose(map(map(toColCell)), map(toPairs))(dto)
  return { cols, rows }
}

const Cell = () => {
  return {
    view: ({
      attrs: {
        mdl: {
          settings: { screenSize },
        },
      },
      children,
    }) =>
      ["phone", "wide"].includes(screenSize)
        ? m("tr", [
          m(
            "td",
            { style: { width: "25%" } },
            m("label", children[0].key.toUpperCase())
          ),
          m("th", children),
        ])
        : m("td", { style: { width: "20%" } }, children),
  }
}

const Row = ({ attrs: { mdl, idxR } }) => {
  return {
    view: ({ attrs: { row } }) => {
      return [
        m(
          "tr.card",
          {
            style: { borderBottom: "2px solid var(--color-lightGrey)" },
          },
          row.map((cell) =>
            m(Cell, { mdl }, m("", { key: cell.col }, cell.val))
          )
        ),
      ]
    },
  }
}

export const Table = () => {
  return {
    view: ({
      attrs: {
        mdl,
        data: { cols, rows },
      },
    }) => {
      return m(
        "section.table",
        {
          style: {
            minWidth: "100%",
            overflow: "auto",
          },
        },
        rows.any()
          ? m(
            "table.dash-table",
            !["phone", "wide"].includes(mdl.settings.screenSize) &&
            m(
              "thead.dash-nav",
              m(
                "tr.mb-5",
                cols.map((col) => m("th.primary", col.toUpperCase()))
              )
            ),
            m(
              "tbody",
              rows.map((row, idxR) => m(Row, { mdl, row, idxR }))
            )
          )
          : m("h2", "No data")
      )
    },
  }
}

