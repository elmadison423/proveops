"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function MetersPage() {
  const [meters, setMeters] = useState([]);
  const [search, setSearch] = useState("");
  const router = useRouter();

  const [meterTypeFilter, setMeterTypeFilter] =
    useState("ALL");

  const [technicianFilter, setTechnicianFilter] =
    useState("ALL");

  useEffect(() => {
    fetchMeters();
  }, []);

  async function fetchMeters() {
    const { data, error } = await supabase
      .from("meters")
      .select("*")
      .order("last_prove_date", {
        ascending: true,
      });

    if (!error) {
      setMeters(data || []);
    }
  }

  const filteredMeters = meters.filter((meter) => {
    const matchesSearch =
      meter.meter_id_tag
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      meter.name
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      meter.location
        ?.toLowerCase()
        .includes(search.toLowerCase());

    const matchesType =
      meterTypeFilter === "ALL" ||
      meter.meter_type === meterTypeFilter;

    const matchesTechnician =
      technicianFilter === "ALL" ||
      String(meter.technician_id) ===
        technicianFilter;

    return (
      matchesSearch &&
      matchesType &&
      matchesTechnician
    );
  });

  return (
    <div className="page-container">
      <h1 className="page-title">Meters</h1>

      <div className="card mb-24">
        <div className="filters-row">
          <input
            placeholder="Search meters..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          <select
            value={meterTypeFilter}
            onChange={(e) =>
              setMeterTypeFilter(
                e.target.value
              )
            }
          >
            <option value="ALL">
              All Meter Types
            </option>

            <option value="Coriolis">
              Coriolis
            </option>

            <option value="Turbine">
              Turbine
            </option>

            <option value="Positive Displacement">
              Positive Displacement
            </option>
          </select>

          <select
            value={technicianFilter}
            onChange={(e) =>
              setTechnicianFilter(
                e.target.value
              )
            }
          >
            <option value="ALL">
              All Technicians
            </option>

            <option value="5">
              Evan Madison
            </option>
          </select>
        </div>
      </div>

      <div className="table-card">
        <table className="meters-table">
          <thead>
            <tr>
              <th>Meter ID</th>
              <th>Meter Name</th>
              <th>Location</th>
              <th>Meter Type</th>
              <th>Status</th>
<th>Last Prove</th>
<th>Next Due</th>
<th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredMeters.map((meter) => {
               console.log(
      'Meter:',
      meter.meter_id_tag,
      'Last:',
      meter.last_prove_date,
      'Next:',
      meter.next_due_date
    )

              const today = new Date()

const nextDue = meter.next_due_date
  ? new Date(meter.next_due_date)
  : null

let status = "GOOD"

if (nextDue) {

const daysUntilDue =
  Math.floor(
    (nextDue.getTime() - today.getTime()) /
    (1000 * 60 * 60 * 24)
  )

  if (daysUntilDue < 0) {
    status = "OVERDUE"
  }
  else if (daysUntilDue <= 7) {
    status = "CRITICAL"
  }
 else if (daysUntilDue <= 14) {
  status = "DUE SOON"
}
}

              return (
                <tr key={meter.id}>
                  <td>
                    {meter.meter_id_tag}
                  </td>

                  <td>
                    <Link
                      href={`/meter-detail?id=${meter.id}`}
                    >
                      {meter.name}
                    </Link>
                  </td>

     <td>
  {meter.location}
</td>

<td>
  {meter.meter_type}
</td>

<td>
  <span
    style={{
      background:
        status === "GOOD"
          ? "#16a34a"
          : status === "DUE SOON"
          ? "#f59e0b"
          : status === "CRITICAL"
          ? "#dc2626"
          : "#7f1d1d",
      color: "white",
      padding: "6px 12px",
      borderRadius: "999px",
      fontWeight: "600",
      fontSize: "12px",
      display: "inline-block",
    }}
  >
    {status}
  </span>
</td>

<td>
  {meter.last_prove_date || "-"}
</td>

<td>
  {meter.next_due_date || "-"}
</td>

<td>
  <div className="actions">
    <Link
      href={`/log-prove?id=${meter.id}`}
    >
      <button>
        Log Prove
      </button>
    </Link>

    <Link
      href={`/edit-meter?id=${meter.meter_id_tag}`}
    >
      <button className="edit-button">
        Edit
      </button>
    </Link>
  </div>
</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}