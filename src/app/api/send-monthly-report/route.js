import { createClient } from "@supabase/supabase-js"

import { getDueMeters } from "@/lib/reports/getDueMeters"
import { generateMonthlyPdf } from "@/lib/reports/generateMonthlyPdf"
import { sendMonthlyEmail } from "@/lib/reports/sendMonthlyEmail"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function GET(request) {

  const { searchParams } = new URL(request.url)

  /*
    Allow either:

    1. Vercel Cron using CRON_SECRET
    2. Manual testing using MONTHLY_REPORT_SECRET
  */

  const authHeader =
    request.headers.get("authorization")

  const cronSecret =
    process.env.CRON_SECRET

  const manualSecret =
    searchParams.get("secret")

  const validCronRequest =
    cronSecret &&
    authHeader === `Bearer ${cronSecret}`

  const validManualRequest =
    manualSecret ===
    process.env.MONTHLY_REPORT_SECRET

  if (
    !validCronRequest &&
    !validManualRequest
  ) {

    return Response.json(
      {
        error: "Unauthorized",
      },
      {
        status: 401,
      }
    )

  }

  /*
    Force is ONLY available for manual testing.
  */

  const force =
    validManualRequest &&
    searchParams.get("force") === "true"

  const today = new Date()

  const firstDayNextMonth = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    1
  )

  const sendDay = new Date(
    firstDayNextMonth
  )

  sendDay.setDate(
    sendDay.getDate() - 7
  )

  today.setHours(
    0,
    0,
    0,
    0
  )

  sendDay.setHours(
    0,
    0,
    0,
    0
  )

  /*
    Only send on the scheduled day
    unless manually forced.
  */

  if (
    !force &&
    today.getTime() !==
      sendDay.getTime()
  ) {

    console.log(
      "Not scheduled send day."
    )

    return Response.json({

      success: true,

      skipped: true,

      reason:
        "Not scheduled send day",

    })

  }

  console.log(
    "Monthly Report Job Started"
  )

  try {

    const {
      data: organizations,
      error,
    } = await supabase
      .from("Organizations")
      .select("*")

    if (error) {
      throw error
    }

    let emailsSent = 0

    for (
      const organization
      of organizations
    ) {

      /*
        Example:
        2026-09

        This is the month being reported.
      */

      const reportMonth =
        `${firstDayNextMonth.getFullYear()}-${String(
          firstDayNextMonth.getMonth() + 1
        ).padStart(2, "0")}`

      /*
        Prevent duplicate reports.
      */

      const {
        data: existingLog,
      } = await supabase
        .from("MonthlyReportLog")
        .select("id")
        .eq(
          "organization_id",
          organization.id
        )
        .eq(
          "report_month",
          reportMonth
        )
        .maybeSingle()

      if (existingLog) {

        console.log(
          `Monthly report already sent to ${organization.name}`
        )

        continue

      }

      /*
        Find meters due next month.
      */

      const meters =
        await getDueMeters(
          organization.id
        )

      if (
        meters.length === 0
      ) {

        console.log(
          `No meters due for ${organization.name}`
        )

        continue

      }

      /*
        Generate PDF.
      */

      const pdf =
        generateMonthlyPdf(
          organization,
          meters
        )

      /*
        Send email.
      */

      await sendMonthlyEmail(
        organization,
        pdf
      )

      /*
        Record successful send.
      */

      await supabase
        .from("MonthlyReportLog")
        .insert({
          organization_id:
            organization.id,

          report_month:
            reportMonth,
        })

      emailsSent++

      console.log(
        `Email sent to ${organization.name}`
      )

    }

    return Response.json({

      success: true,

      organizations:
        organizations.length,

      emailsSent,

    })

  }

  catch (error) {

    console.error(
      "Monthly report error:",
      error
    )

    return Response.json({

      success: false,

      error:
        error.message,

    })

  }

}