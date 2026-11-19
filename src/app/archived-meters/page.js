"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import Link from "next/link";

import { supabase } from "@/lib/supabase";

import ProtectedRoute from "@/components/ProtectedRoute";

import toast from "react-hot-toast";

export default function ArchivedMetersPage() {

  const [meters, setMeters] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
const [meterToRestore, setMeterToRestore] = useState(null);

  async function fetchArchivedMeters() {

    setLoading(true);

    const {
      data,
      error,
    } = await supabase
      .from("meters")
      .select("*")
      .eq(
        "is_archived",
        true
      )
      .order(
        "last_prove_date",
        {
          ascending: false,
        }
      );

    if (error) {

      console.error(
        "ARCHIVED METERS ERROR:",
        error
      );

      setMeters([]);

      setLoading(false);

      return;
    }

    setMeters(
      data || []
    );

    setLoading(false);
  }

  useEffect(() => {

    fetchArchivedMeters();

  }, []);

  const filteredMeters = useMemo(() => {

    return meters.filter(
      (meter) => {

        const searchText =
          search.toLowerCase();

        return (

          meter.meter_id_tag
            ?.toLowerCase()
            .includes(searchText) ||

          meter.name
            ?.toLowerCase()
            .includes(searchText) ||

          meter.location
            ?.toLowerCase()
            .includes(searchText) ||

          meter.serial_number
            ?.toLowerCase()
            .includes(searchText)

        );

      }
    );

  }, [
    meters,
    search,
  ]);

async function restoreMeter() {

  if (!meterToRestore) {
    return;
  }

  const {
    error,
  } = await supabase
    .from("meters")
    .update({
      is_archived: false,
    })
    .eq(
      "id",
      meterToRestore.id
    );

  if (error) {

    console.error(
      "RESTORE METER ERROR:",
      error
    );

    toast.error(
      "Unable to restore meter."
    );

    return;
  }

  toast.success(
    "Meter restored successfully."
  );

  setMeterToRestore(null);

  fetchArchivedMeters();
}

  if (loading) {

    return (

      <ProtectedRoute
        allowedRoles={[
          "Organization Admin",
        ]}
      >

        <div className="page-container">

          <p>
            Loading archived meters...
          </p>

        </div>

      </ProtectedRoute>

    );
  }

  return (

    <ProtectedRoute
      allowedRoles={[
        "Organization Admin",
      ]}
    >

      <div className="page-container">

        {/* PAGE HEADER */}

        <div
          className="page-header"
          style={{
            marginBottom: "24px",
          }}
        >

          <div>

            <h1 className="page-title">
              Archived Meters
            </h1>

            <p className="page-subtitle">
              View and restore meters that have been archived.
            </p>

          </div>

          <Link href="/meters">

            <button
              className="secondary-button"
            >
              ← Back to Meters
            </button>

          </Link>

        </div>


        {/* SEARCH */}

        <div
          className="card"
          style={{
            marginBottom: "24px",
          }}
        >

          <input
            type="text"
            placeholder="Search archived meters..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            style={{
              width: "100%",
            }}
          />

        </div>


        {/* ARCHIVED METERS */}

        <div className="table-card">

          <div className="table-header">

            <div>

              <h2>
                Archived Meter Inventory
              </h2>

              <p>
                {filteredMeters.length} archived meter
                {filteredMeters.length === 1
                  ? ""
                  : "s"}
              </p>

            </div>

          </div>


          {filteredMeters.length === 0 ? (

            <div
              className="empty-state"
              style={{
                padding: "50px 20px",
              }}
            >

              <div className="empty-icon">
                📦
              </div>

              <h3>
                No Archived Meters
              </h3>

              <p>
                There are currently no archived
                meters matching your search.
              </p>

            </div>

          ) : (

            <div
              style={{
                overflowX: "auto",
              }}
            >

              <table className="meters-table">

                <thead>

                  <tr>

                    <th>
                      Meter ID
                    </th>

                    <th>
                      Meter Name
                    </th>

                    <th>
                      Location
                    </th>

                    <th>
                      Make / Model
                    </th>

                    <th>
                      Serial Number
                    </th>

                    <th>
                      Last Prove
                    </th>

                    <th>
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filteredMeters.map(
                    (meter) => (

                      <tr
                        key={meter.id}
                      >

                        <td>
                          {meter.meter_id_tag ||
                            "-"}
                        </td>

                        <td>

                          <Link
                            href={`/meter-detail?id=${meter.id}`}
                          >
                            {meter.name ||
                              "-"}
                          </Link>

                        </td>

                        <td>
                          {meter.location ||
                            "-"}
                        </td>

                        <td>
                          {[
                            meter.meter_make,
                            meter.meter_model,
                          ]
                            .filter(Boolean)
                            .join(" / ") ||
                            "-"}
                        </td>

                        <td>
                          {meter.serial_number ||
                            "-"}
                        </td>

                        <td>
                          {meter.last_prove_date ||
                            "-"}
                        </td>

                        <td>

                          <div
                            style={{
                              display: "flex",
                              gap: "8px",
                              flexWrap: "wrap",
                            }}
                          >

                            <Link
                              href={`/meter-detail?id=${meter.id}`}
                            >

                              <button
                                className="secondary-button"
                              >
                                View Meter
                              </button>

                            </Link>

                           <button
  className="primary-button"
  onClick={() =>
    setMeterToRestore(meter)
  }
>
  Restore
</button>

                          </div>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>

        {meterToRestore && (

  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(15, 23, 42, 0.45)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 999999,
      padding: "20px",
    }}
  >

    <div
      style={{
        width: "100%",
        maxWidth: "480px",
        background: "#ffffff",
        borderRadius: "16px",
        padding: "28px",
        boxShadow:
          "0 25px 60px rgba(0,0,0,0.25)",
      }}
    >

      <h2
        style={{
          marginTop: 0,
          marginBottom: "12px",
        }}
      >
        Restore Meter?
      </h2>

      <p
        style={{
          marginBottom: "24px",
          lineHeight: "1.6",
        }}
      >
        Are you sure you want to restore{" "}
        <strong>
          {meterToRestore.meter_id_tag}
        </strong>{" "}
        to the active meter list?
      </p>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "12px",
        }}
      >

        <button
          type="button"
          className="secondary-button"
          onClick={() =>
            setMeterToRestore(null)
          }
        >
          Cancel
        </button>

        <button
          type="button"
          className="primary-button"
          onClick={restoreMeter}
        >
          Restore Meter
        </button>

      </div>

    </div>

  </div>

)}

      </div>

    </ProtectedRoute>

  );
}