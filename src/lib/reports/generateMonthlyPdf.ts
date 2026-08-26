import jsPDF from "jspdf"

export function generateMonthlyPdf(
  organization: any,
  meters: any[]
) {
  const doc = new jsPDF()

  doc.setFontSize(22)
  doc.text("PROVEOPS", 20, 20)

  doc.setFontSize(16)
  doc.text("Upcoming Meter Proving Schedule", 20, 32)

  doc.setFontSize(12)
  doc.text(`Company: ${organization.name}`, 20, 45)
  doc.text(
    `Generated: ${new Date().toLocaleDateString()}`,
    20,
    53
  )

  let y = 70

  doc.setFont(undefined, "bold")
  doc.text("Meter ID", 20, y)
  doc.text("Type", 60, y)
  doc.text("Location", 105, y)
  doc.text("Due Date", 160, y)

  y += 10

  doc.setFont(undefined, "normal")

  meters.forEach((meter) => {
    doc.text(meter.meter_id_tag || "", 20, y)
    doc.text(meter.meter_type || "", 60, y)
    doc.text(meter.location || "", 105, y)
    doc.text(
      new Date(meter.next_due_date).toLocaleDateString(),
      160,
      y
    )

    y += 10

    if (y > 270) {
      doc.addPage()
      y = 20
    }
  })

  y += 10

  doc.setFont(undefined, "bold")
  doc.text(`Total Meters Due: ${meters.length}`, 20, y)

  return doc
}