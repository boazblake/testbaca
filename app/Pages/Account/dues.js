import m from "mithril"
import PayPal from "./paypal"
import { Table, formatDataForTable } from "@/Components/table.js"

const state = {
  paypal: null,
}

const Dues = {
  view: ({ attrs: { mdl, reload } }) =>
    m(
      "section.p-y-50",
      m(PayPal, { mdl, data: mdl.data.profile, status: state, reload }),
      mdl.data.dues.any() &&
      m(Table, {
        mdl,
        data: formatDataForTable(
          ["userId", "objectId", "createdAt", "updatedAt"],
          mdl.data.dues
        ),
      })
    ),
}

export default Dues
