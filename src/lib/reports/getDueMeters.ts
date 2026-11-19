
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function getDueMeters(
  organizationId: number,
  reportMonth: string,
  timeZone: string = "America/Chicago"
) {
  // reportMonth must be formatted as YYYY-MM.
  if (!/^\d{4}-\d{2}$/.test(reportMonth)) {
    throw new Error("Invalid report month. Expected YYYY-MM.");
  }

  // Validate the timezone and calculate the month boundaries.
  try {
    new Intl.DateTimeFormat("en-US", { timeZone });
  } catch {
    throw new Error(`Invalid report timezone: ${timeZone}`);
  }

  const [year, month] = reportMonth.split("-").map(Number);

  if (month < 1 || month > 12) {
    throw new Error("Invalid report month.");
  }

  const monthStart =
    `${year}-${String(month).padStart(2, "0")}-01`;

  const nextMonthDate = new Date(Date.UTC(year, month, 1));

  const nextMonthStart =
    `${nextMonthDate.getUTCFullYear()}-` +
    `${String(nextMonthDate.getUTCMonth() + 1).padStart(2, "0")}-01`;

  const lastDay = new Date(
    Date.UTC(year, month, 0)
  ).getUTCDate();

  const monthEnd =
    `${year}-${String(month).padStart(2, "0")}-` +
    `${String(lastDay).padStart(2, "0")}`;

  const { data, error } = await supabase
    .from("meters")
    .select(`
      meter_id_tag,
      location,
      meter_type,
      next_due_date
    `)
    .eq("organization_id", organizationId)
    .eq("is_archived", false)
    .gte("next_due_date", monthStart)
    .lt("next_due_date", nextMonthStart)
    .order("next_due_date");

  if (error) throw error;

  return data ?? [];
}