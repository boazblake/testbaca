import { formatDate } from "@/Utils"
import { AngleLine } from "@mithril-icons/clarity/cjs"
import { assoc, map, add, prop } from "ramda"
import m from "mithril"

const STATE = () => ({
  invoices: [],
})

let state = STATE()

const calcProductPrice = ({ prices, cart }, product) => {
  return parseInt(prices[product]) * Object.values(cart[product]).reduce(add, 0)
}

const calcTotalPrice = (invoice) =>
  Object.keys(invoice.cart)
    .map((product) => calcProductPrice(invoice, product))
    .reduce(add, 0)

const invoiceUrl = (mdl) => {
  let userInvoices = `{"userId":"${mdl.user.objectId}"}`
  return mdl.state.route.id == "admin"
    ? "classes/Invoices"
    : `classes/Invoices?where=${encodeURI(userInvoices)}`
}

const fetchInvoicesTask = (mdl) =>
  mdl.http.back4App
    .getTask(mdl)(invoiceUrl(mdl))
    .map(prop("results"))
    .map(map(assoc("isSelected", false)))

const onFetchInvoiceError = (mdl) => (e) => log("e")([e, mdl])

const onFetchInvoiceSuccess = (_) => (invoices) => (state.invoices = invoices)

const fetchInvoices = ({ attrs: { mdl } }) =>
  fetchInvoicesTask(mdl).fork(
    onFetchInvoiceError(mdl),
    onFetchInvoiceSuccess(mdl)
  )

const InvoiceCell = () => {
  return {
    view: ({
      attrs: {
        mdl: {
          settings: { screenSize },
        },
      },
      children,
    }) =>
      screenSize == "phone"
        ? m("tr", [
          m("td", { style: { width: "25%" } }, m("label", children[0].key)),
          children,
        ])
        : m("td", { style: { width: "20%" } }, children),
  }
}

const Invoice = ({ attrs: { mdl } }) => {
  return {
    view: ({ attrs: { invoice } }) => {
      return [
        m(
          "tr",
          m(
            InvoiceCell,
            { mdl },
            m("", { key: "Date" }, formatDate(invoice.purchaseTime))
          ),
          m(InvoiceCell, { mdl }, m("", { key: "Order Id" }, invoice.orderID)),
          m(
            InvoiceCell,
            { mdl },
            m(
              "",
              { key: "Name" },
              `${invoice.shippingDestination.name.full_name} `
            )
          ),
          m(
            InvoiceCell,
            { mdl },
            m("", { key: "Payment Status" }, invoice.status)
          ),
          m(
            InvoiceCell,
            { mdl },
            m(
              "",

              {
                key: "Shipping Status",
                style: { width: "100%", borderBottom: "1px solid gold" },
              },
              invoice.shippingStatus
                ? m("a", { href: invoice.shippingStatus }, "Shipping Status")
                : m("p", "Prepparing your order")
            )
          ),

          m(
            "td",
            m(AngleLine, {
              class: `clickable ${!invoice.isSelected && "point-down"}`,
              onclick: () => (invoice.isSelected = !invoice.isSelected),
              width: "16px",
            })
          )
        ),
        invoice.isSelected &&
        m(
          "td",
          { colspan: 5, style: { width: "100%" } },
          m(
            "tr",
            m(
              "td",
              m("label", "Shipping Destination"),
              `${invoice.shippingDestination.address.address_line_1} ${invoice.shippingDestination.address.admin_area_2} ${invoice.shippingDestination.address.admin_area_1} ${invoice.shippingDestination.address.postal_code}`
            ),
            mdl.state.route.id == "admin" &&
            m("td", m("button", "Update Shipping Status"))
          ),
          m(
            "table",
            { style: { width: "100%", borderBottom: "1px solid gold" } },
            [
              m(
                "thead",
                m("tr", [
                  m("th", "Product"),
                  m("th", "Quantities"),
                  m("th", "Unit Price"),
                  m("th", "Unit Total"),
                ])
              ),
              m(
                "tbody",
                Object.keys(invoice.cart).map((product) =>
                  m("tr", [
                    m("td", product),
                    m("td", JSON.stringify(invoice.cart[product])),
                    m("td", invoice.prices[product]),
                    m("td", calcProductPrice(invoice, product)),
                  ])
                ),
                m(
                  "tr",
                  m("th", "Order Total"),
                  m("th", calcTotalPrice(invoice))
                )
              ),
            ]
          )
        ),
      ]
    },
  }
}

export const Orders = () => {
  return {
    onremove: (state = STATE()),
    oninit: fetchInvoices,
    view: ({ attrs: { mdl } }) =>
      m(
        "section.overflow-auto",
        {
          style: {
            minWidth: "100%",
            height: "75vh",
          },
        },
        state.invoices.any()
          ? m(
            "table.dash-table",
            mdl.settings.screenSize != "phone" &&
            m(
              "thead.dash-nav",
              m("tr.mb-5", [
                m("th", "Date"),
                m("th", "Order Id"),
                m("th", "Name"),
                m("th", "Payment Status"),
                m("th", "Shipping Status"),
                m("th"),
              ])
            ),
            m(
              "tbody",
              state.invoices.map((invoice) => m(Invoice, { mdl, invoice }))
            )
          )
          : m("h2", "No Orders")
      ),
  }
}
