// Invoice Template for Simple Invoice Generator
// Data is passed as JSON and parsed at compile time

#let invoice-data = json("invoice-data.json")

// Page setup
#set page(
  paper: "a4",
  margin: (top: 1.5cm, bottom: 1.5cm, left: 2cm, right: 2cm),
)

// Typography setup
#set text(
  font: "IBM Plex Sans",
  size: 10pt,
  fill: rgb("#1a1a1a"),
)

// Helper function for section headings
#let section-heading(title) = {
  text(
    font: "Georgia",
    size: 11pt,
    weight: "regular",
    fill: rgb("#1a1a1a"),
  )[#title]
}

// Helper function for field display
#let field-value(value, placeholder: "") = {
  if value != "" { value } else { text(fill: rgb("#9ca3af"))[#placeholder] }
}

// Helper to format currency
#let format-currency(symbol, amount) = {
  [#symbol#amount]
}

// ===== HEADER =====
#grid(
  columns: (1fr, auto),
  gutter: 2em,
  [
    // Invoice title
    #text(
      font: "Georgia",
      size: 42pt,
      weight: "regular",
      fill: rgb("#1a1a1a"),
    )[#invoice-data.invoiceTitle]
    #v(0.3em)
    #line(length: 3em, stroke: 2pt + rgb("#0284c7"))
  ],
  [
    // Invoice details (right side)
    #set align(right)
    #set text(size: 9pt)

    #grid(
      columns: (auto, auto),
      gutter: 0.5em,
      row-gutter: 0.4em,
      align: (right, right),

      text(fill: rgb("#6b7280"))[#invoice-data.invoiceNumberLabel],
      text(weight: "medium", font: "IBM Plex Mono")[#invoice-data.invoiceNumber],

      text(fill: rgb("#6b7280"))[#invoice-data.dateLabel],
      text(weight: "medium")[#invoice-data.invoiceDate],

      text(fill: rgb("#6b7280"))[#invoice-data.dueDateLabel],
      text(weight: "medium")[#invoice-data.dueDate],
    )
  ]
)

#v(1.5em)

// ===== FROM / TO SECTIONS =====
#grid(
  columns: (1fr, 1fr),
  gutter: 2em,
  [
    // From section
    #box(
      fill: rgb("#fafaf8"),
      stroke: 1pt + rgb("#e7e5e0"),
      radius: 4pt,
      inset: 1em,
    )[
      #section-heading(invoice-data.fromTitle)
      #v(0.5em)
      #for field in invoice-data.fromFields [
        #if field.value != "" [
          #text(size: 9pt)[#field.value]
          #linebreak()
        ]
      ]
    ]
  ],
  [
    // To section
    #box(
      fill: rgb("#fafaf8"),
      stroke: 1pt + rgb("#e7e5e0"),
      radius: 4pt,
      inset: 1em,
    )[
      #section-heading(invoice-data.toTitle)
      #v(0.5em)
      #for field in invoice-data.toFields [
        #if field.value != "" [
          #text(size: 9pt)[#field.value]
          #linebreak()
        ]
      ]
    ]
  ]
)

#v(1.5em)

// ===== SERVICES TABLE =====
#let cols = invoice-data.columns
#let rows = invoice-data.rows
#let currency = invoice-data.currencySymbol

// Build column widths
#let col-widths = cols.map(col => {
  let w = col.width
  // Parse percentage string to fraction
  if w.ends-with("%") {
    let num = float(w.slice(0, -1)) / 100
    num * 1fr
  } else {
    1fr
  }
})

// Table header
#table(
  columns: col-widths,
  stroke: none,
  inset: (x: 0.6em, y: 0.5em),

  // Header row with background
  table.header(
    ..cols.map(col => {
      table.cell(
        fill: luma(245),
        align: if col.align == "left" { left } else if col.align == "right" { right } else { center },
      )[
        #text(weight: "medium", size: 9pt)[#col.name]
      ]
    })
  ),

  // Data rows
  ..rows.map(row => {
    cols.map(col => {
      let cell-value = row.cells.at(col.id, default: "")
      let display-value = if type(cell-value) == dictionary {
        // Description cell with name and description
        let name = cell-value.at("name", default: "")
        let desc = cell-value.at("description", default: "")
        if name != "" or desc != "" {
          [
            #if name != "" [#text(weight: "medium")[#name]]
            #if name != "" and desc != "" [#linebreak()]
            #if desc != "" [#text(size: 8pt, fill: rgb("#6b7280"))[#desc]]
          ]
        } else { "" }
      } else {
        cell-value
      }

      table.cell(
        align: if col.align == "left" { left } else if col.align == "right" { right } else { center },
      )[
        #if col.isAmount and display-value != "" [
          #text(font: "IBM Plex Mono", size: 9pt)[#currency#display-value]
        ] else [
          #text(size: 9pt)[#display-value]
        ]
      ]
    })
  }).flatten()
)

#line(length: 100%, stroke: 0.5pt + rgb("#e7e5e0"))

#v(1em)

// ===== TOTALS SECTION =====
#align(right)[
  #set text(size: 9pt)

  // Subtotal
  #grid(
    columns: (auto, 6em),
    gutter: 1em,
    align: (right, right),

    text(fill: rgb("#6b7280"))[Subtotal:],
    text(font: "IBM Plex Mono")[#currency#invoice-data.subtotal],
  )

  // Discount (if enabled)
  #if invoice-data.discountEnabled [
    #v(0.3em)
    #grid(
      columns: (auto, 6em),
      gutter: 1em,
      align: (right, right),

      text(fill: rgb("#6b7280"))[#invoice-data.discountLabel (#invoice-data.discountPercentage%):],
      text(font: "IBM Plex Mono", fill: rgb("#16a34a"))[(#currency#invoice-data.discount)],
    )
  ]

  // Tax (if enabled)
  #if invoice-data.taxEnabled [
    #v(0.3em)
    #grid(
      columns: (auto, 6em),
      gutter: 1em,
      align: (right, right),

      text(fill: rgb("#6b7280"))[#invoice-data.taxLabel (#invoice-data.taxPercentage%):],
      text(font: "IBM Plex Mono")[#currency#invoice-data.tax],
    )
  ]

  #v(0.5em)
  #line(length: 12em, stroke: 1pt + rgb("#d1d5db"))
  #v(0.5em)

  // Total
  #grid(
    columns: (auto, 6em),
    gutter: 1em,
    align: (right, right),

    text(font: "Georgia", size: 11pt)[#invoice-data.totalLabel],
    text(font: "IBM Plex Mono", size: 12pt, weight: "semibold")[#currency#invoice-data.total],
  )
]

#v(1.5em)

// ===== PAYMENT DETAILS =====
#box(
  fill: rgb("#fafaf8"),
  stroke: 1pt + rgb("#e7e5e0"),
  radius: 4pt,
  inset: 1em,
  width: 50%,
)[
  #section-heading(invoice-data.paymentTitle)
  #v(0.5em)
  #for field in invoice-data.paymentFields [
    #if field.value != "" [
      #text(size: 9pt)[#field.value]
      #linebreak()
    ]
  ]
]
