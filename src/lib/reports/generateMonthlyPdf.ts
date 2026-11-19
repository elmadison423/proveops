import jsPDF from "jspdf";

export function generateMonthlyPdf(
  organization: any,
  meters: any[],
  reportMonth?: string,
  timeZone: string = "America/Chicago"
) {
  const doc = new jsPDF();

  const monthLabel = reportMonth
    ? new Date(`${reportMonth}-01T12:00:00Z`).toLocaleDateString(
        "en-US",
        {
          month: "long",
          year: "numeric",
          timeZone: "UTC",
        }
      )
    : "Upcoming Month";

  const generatedDate = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone,
  }).format(new Date());

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const bottomMargin = 20;

  const columns = {
    meter: { x: margin, width: 38 },
    type: { x: 55, width: 35 },
    location: { x: 92, width: 55 },
    dueDate: { x: 153, width: 42 },
  };

  function drawHeader() {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("PROVEOPS", margin, 20);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(15);
    doc.text(
  `${monthLabel} Meter Proving Schedule`,
  margin,
  31
);

    doc.setFontSize(12);
    doc.text(`Organization: ${organization.name || "Organization"}`, margin, 42);
    doc.text(`Schedule month: ${monthLabel}`, margin, 50);

    doc.setFontSize(10);
    doc.text(`Generated: ${generatedDate}`, margin, 57);
  }

  function drawTableHeader(y: number) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);

    doc.text("Meter ID", columns.meter.x, y);
    doc.text("Type", columns.type.x, y);
    doc.text("Location", columns.location.x, y);
    doc.text("Due Date", columns.dueDate.x, y);

    doc.setLineWidth(0.3);
    doc.line(margin, y + 3, pageWidth - margin, y + 3);

    doc.setFont("helvetica", "normal");
    return y + 10;
  }

  drawHeader();

  let y = drawTableHeader(68);

  doc.setFontSize(8.5);

  for (const meter of meters) {
    const meterId = String(meter.meter_id_tag || "");
    const meterType = String(meter.meter_type || "");
    const location = String(meter.location || "");
    const dueDate = meter.next_due_date
      ? String(meter.next_due_date).slice(0, 10)
      : "";

    const meterLines = doc.splitTextToSize(
      meterId,
      columns.meter.width
    );
    const typeLines = doc.splitTextToSize(
      meterType,
      columns.type.width
    );
    const locationLines = doc.splitTextToSize(
      location,
      columns.location.width
    );
    const dueDateLines = doc.splitTextToSize(
      dueDate,
      columns.dueDate.width
    );

    const lineCount = Math.max(
      meterLines.length,
      typeLines.length,
      locationLines.length,
      dueDateLines.length,
      1
    );

    const rowHeight = Math.max(8, lineCount * 4.5);

    if (y + rowHeight > pageHeight - bottomMargin) {
      doc.addPage();
      y = 20;
      y = drawTableHeader(y);
    }

    doc.text(meterLines, columns.meter.x, y);
    doc.text(typeLines, columns.type.x, y);
    doc.text(locationLines, columns.location.x, y);
    doc.text(dueDateLines, columns.dueDate.x, y);

    y += rowHeight;
  }

  if (y + 15 > pageHeight - bottomMargin) {
    doc.addPage();
    y = 25;
  } else {
    y += 8;
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(`Total Meters Due: ${meters.length}`, margin, y);

  return doc;
}