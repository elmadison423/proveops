"use client";

import {
  Suspense,
  useEffect,
  useState,
} from "react";

import {
  useSearchParams,
  useRouter,
} from "next/navigation";

import { supabase } from "@/lib/supabase";

import ProtectedRoute from "@/components/ProtectedRoute";

function MeterDetailContent() {

  const searchParams = useSearchParams();
  const router = useRouter();

  const meterId = searchParams.get("id");

  const [meter, setMeter] = useState(null);
  const [proveHistory, setProveHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {

    if (!meterId) {
      setError("No meter was specified.");
      setLoading(false);
      return;
    }

    fetchData();

  }, [meterId]);

  async function fetchData() {

    setLoading(true);
    setError(null);

    /*
      Load meter
    */

    const {
      data: meterData,
      error: meterError,
    } = await supabase
      .from("meters")
      .select("*")
      .eq("id", meterId)
      .single();

    console.log("METER:", meterData);
    console.log("METER ERROR:", meterError);

    if (meterError) {

      console.error(meterError);

      setError(
        "Unable to load this meter."
      );

      setLoading(false);

      return;
    }

    setMeter(meterData);

    /*
      Load prove history
    */

    const {
      data: historyData,
      error: historyError,
    } = await supabase
      .from("ProveHistory")
      .select("*")
      .eq(
        "meter_id",
        meterId
      )
      .order(
        "prove_date",
        {
          ascending: false,
        }
      );

    console.log(
      "PROVE HISTORY:",
      historyData
    );

    console.log(
      "PROVE HISTORY ERROR:",
      historyError
    );

    if (historyError) {
      console.error(historyError);
    }

    setProveHistory(
      historyData || []
    );

    setLoading(false);
  }

  if (loading) {

    return (

      <ProtectedRoute>

        <div className="page-container">

          <p>
            Loading meter...
          </p>

        </div>

      </ProtectedRoute>

    );
  }

  if (error) {

    return (

      <ProtectedRoute>

        <div className="page-container">

          <h1 className="page-title">
            Meter
          </h1>

          <div className="card">

            <p>
              {error}
            </p>

            <br />

            <button
              onClick={() =>
                router.push("/meters")
              }
            >
              Back to Meters
            </button>

          </div>

        </div>

      </ProtectedRoute>

    );
  }

  return (

    <ProtectedRoute>

      <div className="page-container">

        <div
          className="page-header"
          style={{
            marginBottom: "24px",
          }}
        >

          <div>

            <h1 className="page-title">
              {meter.meter_id_tag}
            </h1>

            <p className="page-subtitle">
              Meter details and proving history.
            </p>

          </div>

          <div
            style={{
              display: "flex",
              gap: "12px",
            }}
          >

            <button
              className="secondary-button"
              onClick={() =>
                router.push("/meters")
              }
            >
              ← Back to Meters
            </button>

            <button
              className="primary-button"
              onClick={() =>
                router.push(
                  `/edit-meter?id=${meter.meter_id_tag}`
                )
              }
            >
              Edit Meter
            </button>

          </div>

        </div>

        {/* METER INFORMATION */}

        <div
          className="card"
          style={{
            marginBottom: "24px",
          }}
        >

          <h2>
            Meter Information
          </h2>

          <br />

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "20px",
            }}
          >

            <div>

              <strong>
                Meter ID
              </strong>

              <p>
                {meter.meter_id_tag || "-"}
              </p>

            </div>

            <div>

              <strong>
                Meter Name
              </strong>

              <p>
                {meter.name || "-"}
              </p>

            </div>

            <div>

              <strong>
                Serial Number
              </strong>

              <p>
                {meter.serial_number || "-"}
              </p>

            </div>

            <div>

              <strong>
                Meter Type
              </strong>

              <p>
                {meter.meter_type || "-"}
              </p>

            </div>

            <div>

              <strong>
                Location
              </strong>

              <p>
                {meter.location || "-"}
              </p>

            </div>

            <div>

              <strong>
                Status
              </strong>

              <p>
                {meter.status || "ACTIVE"}
              </p>

            </div>

            <div>

              <strong>
                Last Prove Date
              </strong>

              <p>
                {meter.last_prove_date || "-"}
              </p>

            </div>

            <div>

              <strong>
                Next Due Date
              </strong>

              <p>
                {meter.next_due_date || "-"}
              </p>

            </div>

            <div>

              <strong>
                Time Interval
              </strong>

              <p>
                {meter.time_interval_days
                  ? `${meter.time_interval_days} days`
                  : "-"}
              </p>

            </div>

            <div>

              <strong>
                Proving Method
              </strong>

              <p>
                {meter.proving_method || "-"}
              </p>

            </div>

          </div>

        </div>

    {/* PROVE HISTORY */}

<div className="card">

  <h2>
    Prove History
  </h2>

  <br />

  {proveHistory.length === 0 ? (

    <p>
      No prove history
    </p>

  ) : (

    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}
    >

      {proveHistory.map(
        (prove) => (

          <div
            key={prove.id}
            style={{
              display: "grid",
              gridTemplateColumns:
                "1fr 120px 150px 150px",
              alignItems: "center",
              gap: "16px",
              padding: "12px 16px",
              border:
                "1px solid #e2e8f0",
              borderRadius: "10px",
              background: "#f8fafc",
            }}
          >

            {/* PROVE DATE */}

            <div>

              <strong
                style={{
                  display: "block",
                  marginBottom: "4px",
                }}
              >
                Prove Date
              </strong>

              <span>
                {prove.prove_date ||
                  prove.date ||
                  "-"}
              </span>

            </div>


            {/* STATUS */}

            <div>

              <span
                style={{
                  display: "inline-block",
                  padding: "6px 12px",
                  borderRadius: "999px",
                  fontSize: "13px",
                  fontWeight: "700",
                  background:
                    prove.status === "PASS"
                      ? "#16a34a"
                      : "#dc2626",
                  color: "#ffffff",
                }}
              >
                {prove.status || "-"}
              </span>

            </div>


            {/* VIEW PROVE */}

            <div
              style={{
                textAlign: "right",
              }}
            >

              <button
                className="secondary-button"
                onClick={() =>
                  router.push(
                    `/prove-detail?id=${prove.id}`
                  )
                }
              >
                View Prove →
              </button>

            </div>


            {/* VIEW REPORT */}

            <div
              style={{
                textAlign: "right",
              }}
            >

              {prove.report_file_path ? (

                <button
                  className="secondary-button"
                  onClick={async () => {

                    const {
                      data,
                      error,
                    } = await supabase
                      .storage
                      .from("proving-reports")
                      .createSignedUrl(
                        prove.report_file_path,
                        60 * 60
                      );

                    if (error) {

                      console.error(
                        "REPORT ERROR:",
                        error
                      );

                      alert(
                        "Unable to open proving report."
                      );

                      return;
                    }

                    window.open(
                      data.signedUrl,
                      "_blank"
                    );

                  }}
                >
                  📄 View Report
                </button>

              ) : (

                <span
                  style={{
                    color: "#94a3b8",
                    fontSize: "13px",
                  }}
                >
                  No Report
                </span>

              )}

            </div>

          </div>

        )
      )}

    </div>

  )}

</div>

      </div>

    </ProtectedRoute>

  );
}


/*
  Next.js requires useSearchParams()
  to be inside a Suspense boundary
  during production builds.
*/

export default function MeterDetail() {

  return (

    <Suspense
      fallback={

        <ProtectedRoute>

          <div className="page-container">

            <p>
              Loading meter...
            </p>

          </div>

        </ProtectedRoute>

      }
    >

      <MeterDetailContent />

    </Suspense>

  );

}