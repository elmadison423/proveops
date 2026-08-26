"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { supabase } from "@/lib/supabase";

export default function EditMeterPage() {

  const searchParams = useSearchParams();
  const router = useRouter();

  const meterId = searchParams.get("id");

  const [meter, setMeter] = useState(null);
const [loading, setLoading] = useState(true);
const [saving, setSaving] = useState(false);
const [technicians, setTechnicians] = useState([]);

  useEffect(() => {

    if (!meterId) {
      setLoading(false);
      return;
    }

    fetchMeter();
fetchTechnicians();

  }, [meterId]);

  async function fetchMeter() {

    setLoading(true);

    const {
      data,
      error,
    } = await supabase
      .from("meters")
      .select("*")
      .eq(
        "meter_id_tag",
        meterId
      )
      .maybeSingle();

    console.log("Meter:", data);
    console.log("Meter Error:", error);

    if (error) {

      console.error(error);

      toast.error(
        "Unable to load meter."
      );

      setLoading(false);

      return;
    }

    if (!data) {

      toast.error(
        "Meter not found."
      );

      setLoading(false);

      return;
    }

    setMeter(data);

    setLoading(false);
  }

  async function fetchTechnicians() {

  const {
    data: {
      user,
    },
  } = await supabase.auth.getUser();

  if (!user) {
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

  if (profileError || !profile) {
    console.error(
      "PROFILE ERROR:",
      profileError
    );
    return;
  }

  const {
    data,
    error,
  } = await supabase
    .from("Technicians")
    .select("id, name")
    .eq(
      "organization_id",
      profile.organization_id
    )
    .order("name", {
      ascending: true,
    });

  if (error) {
    console.error(
      "TECHNICIAN ERROR:",
      error
    );
    return;
  }

  setTechnicians(
    data || []
  );
}

  async function handleSave() {

    if (!meter) return;

    if (saving) return;

    setSaving(true);

    const {
      error,
    } = await supabase
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
  Number(
    meter.time_interval_days
  ),

technician_id:
  meter.technician_id || null,

      })
      .eq(
        "id",
        meter.id
      );

    console.log(
      "Update Error:",
      error
    );

    if (error) {

      console.error(error);

      toast.error(
        "Failed to save changes."
      );

      setSaving(false);

      return;
    }

    toast.success(
      "Meter updated successfully!"
    );

    router.push("/meters");

  }

  if (loading) {

    return (

      <div className="page-container">

        <p>
          Loading...
        </p>

      </div>

    );

  }

  if (!meter) {

    return (

      <div className="page-container">

        <h1>
          Meter Not Found
        </h1>

      </div>

    );

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

            <input
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

            <input
              value={
                meter.serial_number || ""
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

            <input
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
                meter.meter_type || ""
              }
              onChange={(e) =>
                setMeter({
                  ...meter,
                  meter_type:
                    e.target.value,
                })
              }
            >

              <option value="">
                Select Meter Type
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

          </div>

          <div className="form-group">

  <label>
    Technician
  </label>

  <select
    value={
      meter.technician_id || ""
    }
    onChange={(e) =>
      setMeter({
        ...meter,
        technician_id:
          e.target.value || null,
      })
    }
  >

    <option value="">
      Unassigned
    </option>

    {technicians.map((technician) => (

      <option
        key={technician.id}
        value={technician.id}
      >
        {technician.name}
      </option>

    ))}

  </select>

</div>

          <div className="form-group">

            <label>
              Time Interval Days
            </label>

            <input
              type="number"
              value={
                meter.time_interval_days ?? ""
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

        <br />

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
        >

          {saving
            ? "Saving..."
            : "Save Changes"}

        </button>

      </div>

    </div>

  );

}