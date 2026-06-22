"use client";

import { useEffect, useState } from "react";

import { useSearchParams } from "next/navigation";

import { supabase } from "@/lib/supabase";

export default function EditMeterPage() {
  const searchParams =
    useSearchParams();

  const meterId =
    searchParams.get("id");

  const [meter, setMeter] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

    const handleSave = async () => {
        console.log(meter)
  const { error } = await supabase
    .from("meters")
    .update({
      meter_id_tag: meter.meter_id_tag,
      serial_number: meter.serial_number,
      location: meter.location,
      meter_type: meter.meter_type,
      time_interval_days: meter.time_interval_days,
    })
    .eq("id", meter.id)

    console.log(error)
    

  if (error) {
    console.log(error)
    alert("Failed to save changes")
    return
  }

  alert("Meter updated successfully")
}

  useEffect(() => {
    fetchMeter();
  }, []);

  async function fetchMeter() {
   const { data, error } = await supabase
  .from("meters")
  .select("*")
  .eq("meter_id_tag", meterId)
  .maybeSingle()

console.log(data)
console.log(error)

if (data) {
  setMeter(data)
}

    setLoading(false);
  }

  async function saveMeter() {
    const { error } =
      await supabase
        .from("meters")
        .update({
          meter_id_tag:
            meter.meter_id_tag,

          serial_number:
            meter.serial_number,

          location:
            meter.location,

          meter_type:
            meter.meter_type,

          time_interval_days:
            meter.time_interval_days,
        })
        .eq("meter_id_tag", meterId)

    if (!error) {
      alert("Meter updated!");
    }
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!meter) {
  return <p>Meter not found</p>;
}

  return (
    <div className="page-container">
      <h1 className="page-title">
        Edit Meter
      </h1>

      <div className="card">
        <div className="form-grid">
          <div className="form-group">
            <label>
              Meter ID
            </label>

            "Meters"
              value={
                meter.meter_id_tag || ""
              }
              onChange={(e) =>
                setMeter({
                  ...meter,
                  meter_id_tag:
                    e.target.value,
                })
              }
            />
          </div>

          <div className="form-group">
            <label>
              Serial Number
            </label>

            "Meters"
              value={
                meter.serial_number ||
                ""
              }
              onChange={(e) =>
                setMeter({
                  ...meter,
                  serial_number:
                    e.target.value,
                })
              }
            />
          </div>

          <div className="form-group">
            <label>
              Location
            </label>

            "Meters"
              value={
                meter.location || ""
              }
              onChange={(e) =>
                setMeter({
                  ...meter,
                  location:
                    e.target.value,
                })
              }
            />
          </div>

          <div className="form-group">
            <label>
              Meter Type
            </label>

            <select
              value={
                meter.meter_type ||
                ""
              }
              onChange={(e) =>
                setMeter({
                  ...meter,
                  meter_type:
                    e.target.value,
                })
              }
            >
              <option>
                Coriolis
              </option>

              <option>
                Turbine
              </option>

              <option>
                Positive Displacement
              </option>
            </select>
          </div>

          <div className="form-group">
            <label>
              Time Interval Days
            </label>

            "Meters"
              type="number"
              value={
                meter.time_interval_days ||
                ""
              }
              onChange={(e) =>
                setMeter({
                  ...meter,
                  time_interval_days:
                    e.target.value,
                })
              }
            />
          </div>
        </div>

       <button onClick={handleSave}>
  Save Changes
</button>
        
      </div>
    </div>
  );
}