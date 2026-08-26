import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function getDueMeters(organizationId: number) {
  const today = new Date()

  const nextMonthStart = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    1
  )

  const nextMonthEnd = new Date(
    today.getFullYear(),
    today.getMonth() + 2,
    0
  )

  const { data, error } = await supabase
    .from("meters")
    .select(`
  meter_id_tag,
  location,
  meter_type,
  next_due_date
`)
    .eq("organization_id", organizationId)
    .gte("next_due_date", nextMonthStart.toISOString().split("T")[0])
    .lte("next_due_date", nextMonthEnd.toISOString().split("T")[0])
    .order("next_due_date")

  if (error) throw error

  return data ?? []
}