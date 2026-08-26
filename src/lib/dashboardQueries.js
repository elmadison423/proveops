import { supabase } from "./supabase";

export async function fetchDashboardData(organizationId) {

  if (!organizationId) return null;

  const { data: meters } = await supabase
    .from("meters")
    .select("*")
    .eq("organization_id", organizationId);

  const { data: technicians } = await supabase
    .from("Technicians")
    .select("*")
    .eq("organization_id", organizationId);

  const { data: proveHistory } = await supabase
    .from("ProveHistory")
    .select("*")
    .eq("organization_id", organizationId);

  return {
    meters: meters || [],
    technicians: technicians || [],
    proveHistory: proveHistory || [],
  };
}