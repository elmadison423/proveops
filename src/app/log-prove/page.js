"use client";

import { Suspense, useState } from "react";

import {
  useSearchParams,
  useRouter,
} from "next/navigation";

import { supabase } from "@/lib/supabase";

import ProtectedRoute from "@/components/ProtectedRoute";

import toast from "react-hot-toast";


function LogProveContent() {

  const router = useRouter();

  const searchParams =
    useSearchParams();

  const scheduleId =
    searchParams.get("schedule");

  const meterId =
    searchParams.get("id");


  const [meterFactor, setMeterFactor] =
    useState("");

  const [proverVolume, setProverVolume] =
    useState("");

  const [flowRate, setFlowRate] =
    useState("");

  const [totalizer, setTotalizer] =
    useState("");

  const [meterTemp, setMeterTemp] =
    useState("");

  const [certifiedTemp, setCertifiedTemp] =
    useState("");

  const [seals, setSeals] =
    useState("");

  const [notes, setNotes] =
    useState("");

  const [status, setStatus] =
    useState("PASS");

  const [saving, setSaving] =
    useState(false);


  function handleEnterKey(e) {

    if (e.key !== "Enter") {
      return;
    }

    e.preventDefault();

    const form = e.target.form;

    if (!form) {
      return;
    }

    const index =
      Array.prototype.indexOf.call(
        form,
        e.target
      );

    form.elements[
      index + 1
    ]?.focus();
  }


  async function saveProve() {

    if (saving) {
      return;
    }


    /* =========================
       VALIDATION
    ========================= */

    if (!meterFactor.trim()) {
      toast.error(
        "Meter Factor is required."
      );
      return;
    }

    if (!proverVolume.trim()) {
      toast.error(
        "Prover Volume is required."
      );
      return;
    }

    if (!flowRate.trim()) {
      toast.error(
        "Flow Rate is required."
      );
      return;
    }

    if (!totalizer.trim()) {
      toast.error(
        "Totalizer is required."
      );
      return;
    }

    if (!meterTemp.trim()) {
      toast.error(
        "Meter Temperature is required."
      );
      return;
    }

    if (!certifiedTemp.trim()) {
      toast.error(
        "Certified Temperature is required."
      );
      return;
    }


    setSaving(true);


    try {

      /* =========================
         GET USER
      ========================= */

      const {
        data: {
          user,
        },
      } = await supabase.auth.getUser();


      if (!user) {

        toast.error(
          "You must be logged in."
        );

        setSaving(false);

        return;
      }


      /* =========================
         GET PROFILE
      ========================= */

      const {
        data: profile,
        error: profileError,
      } = await supabase
        .from("Profiles")
        .select("*")
        .eq(
          "user_id",
          user.id
        )
        .single();


      if (
        profileError ||
        !profile
      ) {

        console.error(
          "PROFILE ERROR:",
          profileError
        );

        toast.error(
          "Unable to load your profile."
        );

        setSaving(false);

        return;
      }


      /* =========================
         GET METER
      ========================= */

      const {
        data: meter,
        error: meterError,
      } = await supabase
        .from("meters")
        .select("*")
        .eq(
          "id",
          meterId
        )
        .single();


      console.log(
        "METER:",
        meter
      );

      console.log(
        "METER ERROR:",
        meterError
      );


      if (
        meterError ||
        !meter
      ) {

        console.error(
          "METER ERROR:",
          meterError
        );

        toast.error(
          "Meter could not be found."
        );

        setSaving(false);

        return;
      }


      /* =========================
         GET TECHNICIAN
      ========================= */

      let technicianId =
        meter.technician_id || null;


      if (scheduleId) {

        const {
          data: schedule,
          error: scheduleError,
        } = await supabase
          .from("Schedules")
          .select(
            "id, technician_id, meter_id"
          )
          .eq(
            "id",
            scheduleId
          )
          .maybeSingle();


        if (scheduleError) {

          console.error(
            "SCHEDULE ERROR:",
            scheduleError
          );

        }


        if (schedule?.technician_id) {

          technicianId =
            schedule.technician_id;

        }

      }


      /* =========================
         TODAY
      ========================= */

      const today =
        new Date()
          .toISOString()
          .split("T")[0];


      /* =========================
         SAVE PROVE HISTORY
      ========================= */

      const {
        error: historyError,
      } = await supabase
        .from("ProveHistory")
        .insert([
          {

            meter_id:
              meter.id,

            meter_name:
              meter.name,

            location:
              meter.location,

            technician_id:
              technicianId,

            prove_date:
              today,

            meter_factor:
              Number(meterFactor),

            prover_volume:
              Number(proverVolume),

            flow_rate:
              Number(flowRate),

            totalizer:
              Number(totalizer),

            meter_temp:
              Number(meterTemp),

            certified_temp:
              Number(certifiedTemp),

            seals,

            notes,

            status,

            organization_id:
              profile.organization_id,

          },
        ]);


      if (historyError) {

        console.error(
          "PROVE HISTORY ERROR:",
          historyError
        );

        toast.error(
          "Unable to save the prove."
        );

        setSaving(false);

        return;
      }


      /* =========================
         PASS
      ========================= */

      if (
        status === "PASS"
      ) {

        const nextDueDate =
          new Date(today);


        nextDueDate.setDate(
          nextDueDate.getDate() +
          Number(
            meter.time_interval_days || 30
          )
        );


        /* =========================
           VOLUME THRESHOLD
        ========================= */

        let volumeThreshold =
          null;


        if (
          meter.volume_interval !== null &&
          meter.volume_interval !== undefined &&
          totalizer !== ""
        ) {

          volumeThreshold =
            Number(totalizer) +
            Number(
              meter.volume_interval
            );

        }


        /* =========================
           UPDATE PASSING METER
        ========================= */

        const {
          error: meterUpdateError,
        } = await supabase
          .from("meters")
          .update({

            last_prove_status:
              "PASS",

            reprove_required:
              false,

            last_prove_date:
              today,

            next_due_date:
              nextDueDate
                .toISOString()
                .split("T")[0],

            last_prove_volume:
              Number(totalizer),

            volume_threshold:
              volumeThreshold,

            current_volume:
              Number(totalizer),

          })
          .eq(
            "id",
            meter.id
          );


        if (meterUpdateError) {

          console.error(
            "========== METER UPDATE ERROR =========="
          );

          console.log(
            "ERROR OBJECT:",
            meterUpdateError
          );

          console.log(
            "ERROR CODE:",
            meterUpdateError?.code
          );

          console.log(
            "ERROR MESSAGE:",
            meterUpdateError?.message
          );

          console.log(
            "ERROR DETAILS:",
            meterUpdateError?.details
          );

          console.log(
            "ERROR HINT:",
            meterUpdateError?.hint
          );

          console.log(
            "========================================"
          );


          toast.error(
            "Prove was saved, but the meter could not be updated."
          );

          setSaving(false);

          return;
        }

      }


      /* =========================
         FAIL
      ========================= */

      if (
        status === "FAIL"
      ) {

        /*
          A FAILED PROVE:

          - Records FAIL in history
          - Sets last_prove_status to FAIL
          - Sets reprove_required to true
          - DOES NOT change last_prove_date
          - DOES NOT change next_due_date
          - DOES NOT change volume values
        */


        const {
          error: failUpdateError,
        } = await supabase
          .from("meters")
          .update({

            last_prove_status:
              "FAIL",

            reprove_required:
              true,

          })
          .eq(
            "id",
            meter.id
          );


        if (failUpdateError) {

          console.error(
            "========== FAIL UPDATE ERROR =========="
          );

          console.log(
            "ERROR OBJECT:",
            failUpdateError
          );

          console.log(
            "ERROR CODE:",
            failUpdateError?.code
          );

          console.log(
            "ERROR MESSAGE:",
            failUpdateError?.message
          );

          console.log(
            "ERROR DETAILS:",
            failUpdateError?.details
          );

          console.log(
            "ERROR HINT:",
            failUpdateError?.hint
          );

          console.log(
            "======================================="
          );


          toast.error(
            "Prove was saved, but the meter could not be flagged for re-proving."
          );

          setSaving(false);

          return;
        }

      }


   /* =========================
   COMPLETE SCHEDULE
========================= */

if (
  scheduleId &&
  status === "PASS"
) {

  const {
    error: scheduleUpdateError,
  } = await supabase
    .from("Schedules")
    .update({

      status: "Completed",

      completed_at:
        new Date().toISOString(),

    })
    .eq(
      "id",
      scheduleId
    );


  if (scheduleUpdateError) {

    console.error(
      "SCHEDULE UPDATE ERROR:",
      scheduleUpdateError
    );

    toast.error(
      "Prove saved, but the schedule could not be completed."
    );

    setSaving(false);

    return;
  }

}


      /* =========================
         SUCCESS MESSAGE
      ========================= */

      if (
        status === "PASS"
      ) {

        toast.success(
          "Prove logged successfully."
        );

      } else {

        toast.error(
          "Prove failed — meter flagged for re-proving."
        );

      }


      /* =========================
         REDIRECT
      ========================= */

      router.push(
        "/history"
      );


    } catch (error) {

      console.error(
        "SAVE PROVE ERROR:",
        error
      );

      toast.error(
        "Something went wrong while saving the prove."
      );

      setSaving(false);

    }

  }


  return (

    <ProtectedRoute>

      <div className="container">

        <h1>
          Log Prove
        </h1>


        <form>


          <div>

            <label>
              Meter Factor
            </label>

            <input
              type="number"
              value={meterFactor}
              onChange={(e) =>
                setMeterFactor(
                  e.target.value
                )
              }
              onKeyDown={
                handleEnterKey
              }
            />

          </div>


          <div>

            <label>
              Prover Volume
            </label>

            <input
              type="number"
              value={proverVolume}
              onChange={(e) =>
                setProverVolume(
                  e.target.value
                )
              }
              onKeyDown={
                handleEnterKey
              }
            />

          </div>


          <div>

            <label>
              Flow Rate
            </label>

            <input
              type="number"
              value={flowRate}
              onChange={(e) =>
                setFlowRate(
                  e.target.value
                )
              }
              onKeyDown={
                handleEnterKey
              }
            />

          </div>


          <div>

            <label>
              Totalizer
            </label>

            <input
              type="number"
              value={totalizer}
              onChange={(e) =>
                setTotalizer(
                  e.target.value
                )
              }
              onKeyDown={
                handleEnterKey
              }
            />

          </div>


          <div>

            <label>
              Meter Temp
            </label>

            <input
              type="number"
              value={meterTemp}
              onChange={(e) =>
                setMeterTemp(
                  e.target.value
                )
              }
              onKeyDown={
                handleEnterKey
              }
            />

          </div>


          <div>

            <label>
              Certified Temp
            </label>

            <input
              type="number"
              value={certifiedTemp}
              onChange={(e) =>
                setCertifiedTemp(
                  e.target.value
                )
              }
              onKeyDown={
                handleEnterKey
              }
            />

          </div>


          <div>

            <label>
              Seals
            </label>

            <input
              value={seals}
              onChange={(e) =>
                setSeals(
                  e.target.value
                )
              }
              onKeyDown={
                handleEnterKey
              }
            />

          </div>


          <div>

            <label>
              Notes
            </label>

            <input
              value={notes}
              onChange={(e) =>
                setNotes(
                  e.target.value
                )
              }
              onKeyDown={
                handleEnterKey
              }
            />

          </div>


          <div>

            <label>
              Status
            </label>

            <select
              value={status}
              onChange={(e) =>
                setStatus(
                  e.target.value
                )
              }
              onKeyDown={
                handleEnterKey
              }
            >

              <option value="PASS">
                PASS
              </option>

              <option value="FAIL">
                FAIL
              </option>

            </select>

          </div>


          <button
            type="button"
            onClick={saveProve}
            disabled={saving}
          >

            {saving
              ? "Saving..."
              : "Save Prove"}

          </button>


        </form>

      </div>

    </ProtectedRoute>

   );

}

export default function LogProve() {

  return (
    <Suspense
      fallback={
        <div className="container">
          <p>Loading...</p>
        </div>
      }
    >
      <LogProveContent />
    </Suspense>
  );

}