#let project(title: "", date: datetime.today().display("[day padding:none] [month repr:long] [year]"), body) = {
  // Set the document's basic properties.
  set document(title: title)
  set page(paper: "us-letter", numbering: "1", number-align: center)
  set text(font: "Libertinus Serif", lang: "en", size: 11.5pt)

  set enum(numbering: "1.a)")
  show link: underline

  set par(leading: 0.75em)

  // Title row.
  align(center)[
    #block(text(weight: 700, 1.75em, title))
    #v(1.2em, weak: true)
    #date
  ]

  // Main body.
  set par(justify: true)

  body
}