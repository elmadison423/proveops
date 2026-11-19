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


function ProveDetailContent() {

  const searchParams =
    useSearchParams();

  const router =
    useRouter();

  const proveId =
    searchParams.get("id");


  const [prove, setProve] =
    useState(null);

  const [meter, setMeter] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(null);


  useEffect(() => {

    if (!proveId) {

      setError(
        "No prove was specified."
      );

      setLoading(false);

      return;
    }

    fetchProve();

  }, [proveId]);


  async function fetchProve() {

    setLoading(true);

    setError(null);


    /*
      LOAD PROVE
    */

    const {
      data: proveData,
      error: proveError,
    } = await supabase
      .from("ProveHistory")
      .select("*")
      .eq(
        "id",
        proveId
      )
      .single();


    console.log(
      "PROVE:",
      proveData
    );

    console.log(
      "PROVE ERROR:",
      proveError
    );


    if (proveError) {

      console.error(
        proveError
      );

      setError(
        "Unable to load this prove."
      );

      setLoading(false);

      return;
    }


    setProve(
      proveData
    );


    /*
      LOAD METER
    */

    if (proveData?.meter_id) {

      const {
        data: meterData,
        error: meterError,
      } = await supabase
        .from("meters")
        .select("*")
        .eq(
          "id",
          proveData.meter_id
        )
        .single();


      console.log(
        "METER:",
        meterData
      );

      console.log(
        "METER ERROR:",
        meterError
      );


      if (!meterError) {

        setMeter(
          meterData
        );

      }

    }


    setLoading(false);

  }


  if (loading) {

    return (

      <ProtectedRoute>

        <div className="page-container">

          <p>
            Loading prove...
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
            Prove
          </h1>

          <div className="card">

            <p>
              {error}
            </p>

            <br />

            <button
              className="primary-button"
              onClick={() =>
                router.back()
              }
            >
              Back
            </button>

          </div>

        </div>

      </ProtectedRoute>

    );

  }


  return (

    <ProtectedRoute>

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
              Prove Record
            </h1>

            <p className="page-subtitle">

              {meter?.meter_id_tag ||
                "Meter"}{" "}

              {meter?.name
                ? `— ${meter.name}`
                : ""}

            </p>

          </div>


          <button
            className="secondary-button"
            onClick={() =>
              router.back()
            }
          >
            ← Back to Meter
          </button>

        </div>


        {/* PROVE RECORD */}

        <div className="card">


          {/* PROVE HEADER */}

          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center",
              gap: "20px",
              marginBottom: "24px",
              paddingBottom: "20px",
              borderBottom:
                "1px solid #e2e8f0",
            }}
          >

            <div>

              <strong
                style={{
                  display: "block",
                  fontSize: "16px",
                  marginBottom: "6px",
                }}
              >
                Prove Date
              </strong>

              <span
                style={{
                  fontSize: "18px",
                }}
              >
                {prove.prove_date ||
                  prove.date ||
                  "-"}
              </span>

            </div>


            <div
              style={{
                padding:
                  "8px 18px",
                borderRadius:
                  "999px",
                fontWeight: "700",
                background:
                  prove.status === "PASS"
                    ? "#16a34a"
                    : "#dc2626",
                color:
                  "#ffffff",
              }}
            >

              {prove.status || "-"}

            </div>

          </div>


          {/* PROVE DETAILS */}

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "24px",
            }}
          >


            {/* TECHNICIAN */}

            <div>

              <strong>
                Technician
              </strong>

              <p>
                {prove.technician ||
                  "-"}
              </p>

            </div>


            {/* METER FACTOR */}

            <div>

              <strong>
                Meter Factor
              </strong>

              <p>
                {prove.meter_factor ??
                  "-"}
              </p>

            </div>


            {/* PROVER VOLUME */}

            <div>

              <strong>
                Prover Volume
              </strong>

              <p>
                {prove.prover_volume ??
                  "-"}
              </p>

            </div>


            {/* FLOW RATE */}

            <div>

              <strong>
                Flow Rate
              </strong>

              <p>
                {prove.flow_rate ??
                  "-"}
              </p>

            </div>


            {/* TOTALIZER */}

            <div>

              <strong>
                Totalizer
              </strong>

              <p>
                {prove.totalizer ??
                  "-"}
              </p>

            </div>


            {/* METER TEMPERATURE */}

            <div>

              <strong>
                Meter Temperature
              </strong>

              <p>
                {prove.meter_temp ??
                  "-"}
              </p>

            </div>


            {/* CERTIFIED TEMPERATURE */}

            <div>

              <strong>
                Certified Temperature
              </strong>

              <p>
                {prove.certified_temp ??
                  "-"}
              </p>

            </div>


            {/* SEALS */}

            <div>

              <strong>
                Seals
              </strong>

              <p>
                {prove.seals ||
                  "-"}
              </p>

            </div>

          </div>


          {/* NOTES */}

          <div
            style={{
              marginTop: "28px",
              paddingTop: "24px",
              borderTop:
                "1px solid #e2e8f0",
            }}
          >

            <strong>
              Notes
            </strong>

            <p
              style={{
                marginTop: "8px",
                whiteSpace:
                  "pre-wrap",
              }}
            >
              {prove.notes ||
                "-"}
            </p>

          </div>


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

export default function ProveDetail() {

  return (

    <Suspense
      fallback={

        <ProtectedRoute>

          <div className="page-container">

            <p>
              Loading prove...
            </p>

          </div>

        </ProtectedRoute>

      }
    >

      <ProveDetailContent />

    </Suspense>

  );

}