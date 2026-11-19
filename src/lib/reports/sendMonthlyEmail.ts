import { Resend } from "resend";
import jsPDF from "jspdf";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendMonthlyEmail(
  organization: any,
  pdf: jsPDF,
  reportMonth: string,
  recipientOverride?: string
) {
  const recipient =
  recipientOverride?.trim() ||
  organization.monthly_report_email?.trim() ||
  organization.contact_email?.trim();

  if (!recipient) {
    throw new Error(
      `No report recipient configured for ${
        organization.name || organization.id
      }`
    );
  }

  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not configured.");
  }

  if (!/^\d{4}-\d{2}$/.test(reportMonth)) {
    throw new Error("Invalid report month. Expected YYYY-MM.");
  }

  const monthLabel = new Date(
    `${reportMonth}-01T12:00:00Z`
  ).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

  const safeOrganizationName = String(
    organization.name || "Organization"
  ).replace(/[\\/:*?"<>|]/g, "-");

  const { data, error } = await resend.emails.send({
    from: "ProveOps Reports <reports@proveopssoftware.com>",
    to: recipient,
    subject: `${monthLabel} Meter Proving Schedule`,
    html: `
      <h2>${monthLabel} Meter Proving Schedule</h2>

      <p>Hello ${organization.name || "Customer"},</p>

      <p>
        Attached is your meter proving schedule for
        <strong>${monthLabel}</strong>.
        It lists active meters with proving due dates during
        that month.
      </p>

      <p>
        Thank you for using ProveOps.
      </p>
    `,
    attachments: [
      {
        filename: `${safeOrganizationName}-${reportMonth}-Meter-Schedule.pdf`,
        content: Buffer.from(
          pdf.output("arraybuffer")
        ).toString("base64"),
      },
    ],
  });

  if (error) {
    throw new Error(
      `Resend failed for ${
        organization.name || organization.id
      }: ${error.message}`
    );
  }

  if (!data?.id) {
    throw new Error(
      `Resend did not return an email ID for ${
        organization.name || organization.id
      }.`
    );
  }

  return {
    emailId: data.id,
    recipient,
  };
}