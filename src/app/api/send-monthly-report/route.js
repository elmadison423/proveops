import { createClient } from "@supabase/supabase-js";

import { getDueMeters } from "@/lib/reports/getDueMeters";
import { generateMonthlyPdf } from "@/lib/reports/generateMonthlyPdf";
import { sendMonthlyEmail } from "@/lib/reports/sendMonthlyEmail";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const DEFAULT_TIME_ZONE = "America/Chicago";

function getDateParts(date, timeZone) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  return Object.fromEntries(
    parts
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value])
  );
}

function getDateKey(date, timeZone) {
  const parts = getDateParts(date, timeZone);
  return `${parts.year}-${parts.month}-${parts.day}`;
}

function getScheduleDate(organization, now) {
  const timeZone =
    organization.monthly_report_timezone || DEFAULT_TIME_ZONE;

  const { year, month } = getDateParts(now, timeZone);
  const yearNumber = Number(year);
  const monthNumber = Number(month);

  if (organization.monthly_report_schedule_type === "specific_day") {
    const selectedDay = Number(
      organization.monthly_report_day_of_month || 20
    );

    const targetDate = new Date(
      Date.UTC(yearNumber, monthNumber - 1, selectedDay)
    );

    return [
      targetDate.getUTCFullYear(),
      String(targetDate.getUTCMonth() + 1).padStart(2, "0"),
      String(targetDate.getUTCDate()).padStart(2, "0"),
    ].join("-");
  }

  const daysBefore = Number(
    organization.monthly_report_days_before ?? 7
  );

  const targetDate = new Date(
    Date.UTC(yearNumber, monthNumber, 1)
  );

  targetDate.setUTCDate(
    targetDate.getUTCDate() - daysBefore
  );

  return [
    targetDate.getUTCFullYear(),
    String(targetDate.getUTCMonth() + 1).padStart(2, "0"),
    String(targetDate.getUTCDate()).padStart(2, "0"),
  ].join("-");
}

export async function GET(request) {
  const cronSecret = process.env.CRON_SECRET;
const authorization = request.headers.get("authorization");

if (
  !cronSecret ||
  authorization !== `Bearer ${cronSecret}`
) {
  return Response.json(
    { error: "Unauthorized" },
    { status: 401 }
  );
}

  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    return Response.json(
      { error: "Server database configuration is missing." },
      { status: 500 }
    );
  }

  const now = new Date();
  const dryRun = true;

  try {
    const { data: organizations, error } = await supabase
      .from("Organizations")
      .select("*")
      .eq("monthly_report_enabled", true);

    if (error) throw error;

    const results = {
  organizationsChecked: organizations.length,
  emailsSent: 0,
  skipped: 0,
  failures: [],
  dryRun: dryRun,
  dryRunReports: [],
};

    for (const organization of organizations) {
      try {
        const timeZone =
          organization.monthly_report_timezone || DEFAULT_TIME_ZONE;

        const scheduledDate = getScheduleDate(organization, now);
        const today = getDateKey(now, timeZone);


        const { year, month } = getDateParts(now, timeZone);

        const nextMonth = new Date(
          Date.UTC(Number(year), Number(month), 1)
        );

        const reportMonth =
          `${nextMonth.getUTCFullYear()}-${String(
            nextMonth.getUTCMonth() + 1
          ).padStart(2, "0")}`;

   if (dryRun) {
  const { data: existingLog, error: logError } = await supabase
    .from("MonthlyReportLog")
    .select("id, sent_at")
    .eq("organization_id", organization.id)
    .eq("report_month", reportMonth)
    .maybeSingle();

  if (logError) throw logError;

  results.dryRunReports.push({
    organizationId: organization.id,
    organizationName: organization.name,
    reportMonth,
    scheduledDate,
    today,
    isScheduledToday: today === scheduledDate,
    alreadyLogged: Boolean(existingLog),
    previouslySentAt: existingLog?.sent_at ?? null,
  });

  console.log("MONTHLY REPORT DRY RUN", {
    organizationId: organization.id,
    organizationName: organization.name,
    reportMonth,
    scheduledDate,
    today,
    isScheduledToday: today === scheduledDate,
    existingLog: existingLog
      ? {
          id: existingLog.id,
          sentAt: existingLog.sent_at,
        }
      : null,
  });

  results.skipped++;
  continue;
}

if (today !== scheduledDate) {
  results.skipped++;
  continue;
}         // Reserve this organization/month before sending. The unique
        // database index prevents concurrent requests from reserving it twice.
        const { data: reservation, error: reservationError } =
          await supabase
            .from("MonthlyReportLog")
            .insert({
              organization_id: organization.id,
              report_month: reportMonth,
              sent_at: null,
            })
            .select("id")
            .single();

        if (reservationError) {
          if (reservationError.code === "23505") {
            results.skipped++;
            continue;
          }

          throw reservationError;
        }

        let emailAttempted = false;

        try {
          const meters = await getDueMeters(
            organization.id,
            reportMonth,
            timeZone
          );

          if (!meters.length) {
            // No report is needed. Release the reservation so this
            // organization can be checked again if its meters change.
            const { error: deleteError } = await supabase
              .from("MonthlyReportLog")
              .delete()
              .eq("id", reservation.id);

            if (deleteError) throw deleteError;

            results.skipped++;
            continue;
          }

    const pdf = generateMonthlyPdf(
            organization,
            meters,
            reportMonth,
            timeZone
          );

          emailAttempted = true;

          const { emailId, recipient } =
            await sendMonthlyEmail(
  organization,
  pdf,
  reportMonth
);

          const { error: sentUpdateError } = await supabase
            .from("MonthlyReportLog")
            .update({ sent_at: new Date().toISOString() })
            .eq("id", reservation.id);

          if (sentUpdateError) {
            // Keep the reservation to prevent an automatic duplicate.
            throw new Error(
              `Email accepted by Resend (${emailId}) for ${recipient}, but sent_at could not be recorded: ${sentUpdateError.message}. Review this report manually.`
            );
          }

          results.emailsSent++;

          console.log(
            `Monthly report accepted for ${organization.name}; ` +
            `month ${reportMonth}; recipient ${recipient}; email ID ${emailId}`
          );
      } catch (error) {
          console.error(
            `Monthly report failed for organization ${organization.id}:`,
            error
          );

          if (!emailAttempted) {
            // The email helper has not been called, so this attempt
            // cannot have sent an email. Release the reservation.
            const { error: deleteError } = await supabase
              .from("MonthlyReportLog")
              .delete()
              .eq("id", reservation.id);

            if (deleteError) {
              console.error(
                `Could not release reservation ${reservation.id}:`,
                deleteError
              );
            }
          }

          results.failures.push({
            organizationId: organization.id,
            organizationName: organization.name,
            error: error.message || "Unknown error",
            reviewRequired: emailAttempted,
          });
        }
      } catch (error) {
        console.error(
          `Monthly report failed for organization ${organization.id}:`,
          error
        );

        results.failures.push({
          organizationId: organization.id,
          organizationName: organization.name,
          error: error.message || "Unknown error",
        });
      }
    }

    return Response.json({
  success: results.failures.length === 0,
  mode: dryRun ? "DRY RUN - NO EMAILS SENT" : "LIVE",
  ...results,
});
  } catch (error) {
    console.error("Monthly report job failed:", error);

    return Response.json(
      {
        success: false,
        error: error.message || "Monthly report job failed",
      },
      { status: 500 }
    );
  }
}