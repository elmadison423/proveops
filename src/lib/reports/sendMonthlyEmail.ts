import { Resend } from "resend"
import jsPDF from "jspdf"

const resend = new Resend(
  process.env.RESEND_API_KEY
)

export async function sendMonthlyEmail(
  organization: any,
  pdf: jsPDF
) {
  await resend.emails.send({
    from: "ProveOps <onboarding@resend.dev>",

    to: organization.contact_email,

    subject: "Upcoming Meter Proving Schedule",

    html: `
      <h2>Upcoming Meter Proving Schedule</h2>

      <p>Hello ${organization.name},</p>

      <p>
        Attached is your monthly meter proving schedule
        for all meters due next month.
      </p>

      <p>
        Thank you for using ProveOps.
      </p>
    `,

    attachments: [
      {
        filename: `${organization.name}-Meter-Schedule.pdf`,
        content: Buffer.from(
          pdf.output("arraybuffer")
        ).toString("base64"),
      },
    ],
  })
}