"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import ActionsMenu from "@/components/ActionsMenu";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";

export default function MetersPage() {
  const router = useRouter();

const [selectedMeters, setSelectedMeters] = useState([]);
  const [meters, setMeters] = useState([]);
  const [search, setSearch] = useState("");
  const [meterTypeFilter, setMeterTypeFilter] =
    useState("ALL");
  const [technicianFilter, setTechnicianFilter] =
    useState("ALL");
    const [meterToDelete, setMeterToDelete] = useState(null);
const [showDeleteModal, setShowDeleteModal] = useState(false);
const [bulkDelete, setBulkDelete] = useState(false);
const [technicians, setTechnicians] = useState([]);
const [showReproveOnly, setShowReproveOnly] =
  useState(false);

 async function fetchMeters() {

  const { data, error } = await supabase
    .from("meters")
    .select("*")
    .order("last_prove_date", {
      ascending: true,
    });

  if (error) {
    console.error(error);
    return;
  }

  setMeters(data || []);
}


async function fetchTechnicians() {

  const {
    data: {
      user,
    },
  } = await supabase.auth.getUser();

  if (!user) {
    console.error(
      "No logged-in user found."
    );

    return;
  }


  const {
    data: profile,
    error: profileError,
  } = await supabase
    .from("Profiles")
    .select("organization_id")
    .eq(
      "user_id",
      user.id
    )
    .maybeSingle();


  if (profileError) {

    console.error(
      "PROFILE ERROR:",
      profileError
    );

    return;
  }


  if (!profile) {

    console.error(
      "No profile found."
    );

    return;
  }


  const {
    data: technicianData,
    error: technicianError,
  } = await supabase
    .from("Technicians")
    .select("id, name")
    .eq(
      "organization_id",
      profile.organization_id
    )
    .order(
      "name",
      {
        ascending: true,
      }
    );


  if (technicianError) {

    console.error(
      "TECHNICIAN ERROR:",
      technicianError
    );

    return;
  }


  console.log(
    "TECHNICIANS:",
    technicianData
  );


  setTechnicians(
    technicianData || []
  );

}


useEffect(() => {

  fetchMeters();

  fetchTechnicians();

}, []);

  const filteredMeters = useMemo(() => {
    return meters.filter((meter) => {
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

const matchesReprove =
  !showReproveOnly ||
  meter.reprove_required === true;

return (
  matchesSearch &&
  matchesType &&
  matchesTechnician &&
  matchesReprove
);
    });
  }, [
    meters,
    search,
    meterTypeFilter,
    technicianFilter,
  ]);

  function toggleMeter(id) {
  setSelectedMeters((current) =>
    current.includes(id)
      ? current.filter((meterId) => meterId !== id)
      : [...current, id]
  );
}

function toggleAllMeters() {
  if (selectedMeters.length === filteredMeters.length) {
    setSelectedMeters([]);
  } else {
    setSelectedMeters(filteredMeters.map((m) => m.id));
  }
}

async function deleteMeter() {
  let error = null;

  if (bulkDelete) {
    // Delete all selected meters
    const result = await supabase
      .from("meters")
      .delete()
      .in("id", selectedMeters);

    error = result.error;
  } else {
    // Delete one meter
    if (!meterToDelete) return;

    const result = await supabase
      .from("meters")
      .delete()
      .eq("id", meterToDelete.id);

    error = result.error;
  }

  if (error) {
    console.error(error);
    alert("Unable to delete meter.");
    return;
  }

  // Reset modal state
  setShowDeleteModal(false);
  setMeterToDelete(null);
  setBulkDelete(false);

  // Clear selections
  setSelectedMeters([]);

  // Refresh table
  fetchMeters();
}

  const summary = useMemo(() => {
   const counts = {
  total: filteredMeters.length,
  good: 0,
  dueSoon: 0,
  critical: 0,
  overdue: 0,
  reproveRequired: 0,
};

    const today = new Date();

    filteredMeters.forEach((meter) => {

  /*
    Reprove Required takes priority
    over all normal due-date statuses.
  */

  if (meter.reprove_required === true) {

    counts.reproveRequired++;

    return;
  }


  if (!meter.next_due_date) {

    counts.good++;

    return;
  }


  const nextDue = new Date(
    meter.next_due_date
  );

      const daysUntilDue = Math.floor(
        (nextDue.getTime() -
          today.getTime()) /
          (1000 * 60 * 60 * 24)
      );

      if (daysUntilDue < 0) {
        counts.overdue++;
      } else if (daysUntilDue <= 7) {
        counts.critical++;
      } else if (daysUntilDue <= 14) {
        counts.dueSoon++;
      } else {
        counts.good++;
      }
    });

    return counts;
  }, [filteredMeters]);

  return (
    <div className="page-container">
      <div className="page-header">
  <div>
    <h1 className="page-title">
      Meters
    </h1>

    <p className="page-subtitle">
      Manage all meters across your organization.
    </p>
  </div>
</div>

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

{technicians.map((technician) => (
  <option
    key={technician.id}
    value={String(technician.id)}
  >
    {technician.name}
  </option>
))}
          </select>
        </div>
      </div>

      <div className="meter-summary">
        <div className="summary-card">
          <h2>{summary.total}</h2>
          <p>Total Meters</p>
        </div>

        <div className="summary-card">
          <h2>{summary.good}</h2>
          <p>Good</p>
        </div>

        <div className="summary-card">
          <h2>{summary.dueSoon}</h2>
          <p>Due Soon</p>
        </div>

        <div className="summary-card">
          <h2>{summary.critical}</h2>
          <p>Critical</p>
        </div>

        <div className="summary-card">
          <h2>{summary.overdue}</h2>
          <p>Overdue</p>
        </div>

  <div
  className={`summary-card reprove-required-card ${
    showReproveOnly
      ? "reprove-filter-active"
      : ""
  }`}
  onClick={() =>
    setShowReproveOnly(
      !showReproveOnly
    )
  }
  role="button"
  tabIndex={0}
  onKeyDown={(e) => {
    if (
      e.key === "Enter" ||
      e.key === " "
    ) {
      e.preventDefault();

      setShowReproveOnly(
        !showReproveOnly
      );
    }
  }}
>

  <div className="reprove-icon">
    🚩
  </div>

  <h2>
    {summary.reproveRequired}
  </h2>

  <p>
    Reprove Required
  </p>

</div>

</div>

      <div className="table-card">

        {selectedMeters.length > 0 && (
  <div className="bulk-toolbar">
    <div className="bulk-toolbar-left">
      <strong>{selectedMeters.length}</strong> meter
      {selectedMeters.length > 1 ? "s" : ""} selected
    </div>

    <div className="bulk-toolbar-right">
      <button
        className="secondary-button"
        onClick={() => setSelectedMeters([])}
      >
        Clear Selection
      </button>

  <button
  className="danger-button"
  onClick={() => {
    setBulkDelete(true);
    setShowDeleteModal(true);
  }}
>
  Delete Selected
</button>
    </div>
  </div>
)}

{showReproveOnly && (
  <div className="reprove-filter-banner">
    🚩 Showing Reprove Required Meters Only
  </div>
)}

  <div className="table-header">

    <div>
      <h2>Meter Inventory</h2>
      <p>
        View, search, and manage every meter in your organization.
      </p>
    </div>

    <div className="table-header-actions">

      <button className="secondary-button">
        Export
      </button>

      <Link href="/add-meter">
        <button className="primary-button">
          + Add Meter
        </button>
      </Link>

    </div>

  </div>

  <table className="meters-table">
          <thead>
  <tr>

    <th style={{ width: "48px" }}>
      <input
        type="checkbox"
        checked={
          filteredMeters.length > 0 &&
          selectedMeters.length === filteredMeters.length
        }
        onChange={toggleAllMeters}
      />
    </th>

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

           {filteredMeters.length === 0 ? (
              <tr>
                <td colSpan={9}>
                  <div className="empty-state">
                    <div className="empty-icon">
                      📋
                    </div>

                    <h3>No meters yet</h3>

                    <p>
                      Add your first meter to begin tracking
                      proving schedules and service history.
                    </p>

                    <Link href="/add-meter">
                      <button className="primary-button">
                        + Add Your First Meter
                      </button>
                    </Link>
                  </div>
                </td>
              </tr>
            ) : (
              filteredMeters.map((meter) => {
                const today = new Date();

                const nextDue = meter.next_due_date
                  ? new Date(meter.next_due_date)
                  : null;

               let status = "GOOD";

/*
  REPROVE REQUIRED takes priority
  over normal due-date status.
*/

if (meter.reprove_required === true) {

  status = "REPROVE REQUIRED";

} else if (nextDue) {

  const daysUntilDue = Math.floor(
    (nextDue.getTime() -
      today.getTime()) /
      (1000 * 60 * 60 * 24)
  );

  if (daysUntilDue < 0) {

    status = "OVERDUE";

  } else if (
    daysUntilDue <= 7
  ) {

    status = "CRITICAL";

  } else if (
    daysUntilDue <= 14
  ) {

    status = "DUE SOON";

  }

}

                const badgeColor =
  status === "GOOD"
    ? "#16a34a"
    : status === "DUE SOON"
    ? "#f59e0b"
    : status === "CRITICAL"
    ? "#dc2626"
    : status === "OVERDUE"
    ? "#7f1d1d"
    : "#dc2626";

                return (
                  <tr key={meter.id}>

  <td>
    <input
      type="checkbox"
      checked={selectedMeters.includes(meter.id)}
      onChange={() => toggleMeter(meter.id)}
    />
  </td>

  <td>{meter.meter_id_tag}</td>

                    <td>
                      <Link
                        href={`/meter-detail?id=${meter.id}`}
                      >
                        {meter.name}
                      </Link>
                    </td>

                    <td>{meter.location}</td>

                    <td>{meter.meter_type}</td>

                    <td>
                      <span
                        style={{
                          background:
                            badgeColor,
                          color: "#fff",
                          padding:
                            "6px 12px",
                          borderRadius:
                            "999px",
                          fontWeight: 600,
                          fontSize: 12,
                          display:
                            "inline-block",
                        }}
                      >
                        {status}
                      </span>
                    </td>

                    <td>
                      {meter.last_prove_date ||
                        "-"}
                    </td>

                    <td>
                      {meter.next_due_date ||
                        "-"}
                    </td>

                  <td>
<ActionsMenu
  meterId={meter.id}
  meterTag={meter.meter_id_tag}
  onDelete={() => {
    setMeterToDelete(meter);
    setShowDeleteModal(true);
  }}
/>
</td>
                  </tr>
                );
              })
            )}
          </tbody>
         </table>
      </div>

     <DeleteConfirmModal
  open={showDeleteModal}
  title={bulkDelete ? "Delete Selected Meters" : "Delete Meter"}
  message={
    bulkDelete
      ? `Are you sure you want to delete ${selectedMeters.length} selected meter${selectedMeters.length === 1 ? "" : "s"}? This action cannot be undone.`
      : meterToDelete
      ? `Are you sure you want to delete "${meterToDelete.meter_id_tag}"? This action cannot be undone.`
      : ""
  }
  onCancel={() => {
    setShowDeleteModal(false);
    setMeterToDelete(null);
    setBulkDelete(false);
  }}
  onConfirm={deleteMeter}
/>
    </div>
  );
}