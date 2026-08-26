'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import ProtectedRoute from '@/components/ProtectedRoute'

export default function SchedulePage() {

  const [meters, setMeters] = useState([])
  const [technicians, setTechnicians] = useState([])

  const [meterId, setMeterId] = useState("")
  const [technicianId, setTechnicianId] = useState("")
  const [scheduledDate, setScheduledDate] = useState("")
  const [scheduledTime, setScheduledTime] = useState("")
  const [notes, setNotes] = useState("")

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {

    const {
      data: metersData,
    } = await supabase
      .from("meters")
      .select("*")
      .order("meter_id_tag")

    const {
      data: techData,
    } = await supabase
      .from("Technicians")
      .select("*")
      .order("name")

    setMeters(metersData || [])
    setTechnicians(techData || [])

  }

  async function saveSchedule() {

    const {
      data: { user }
    } =
      await supabase.auth.getUser()

    if (!user) return

    const {
      data: profile
    } =
      await supabase
        .from("Profiles")
        .select("*")
        .eq("user_id", user.id)
        .single()

    await supabase
      .from("Schedules")
      .insert([{

        organization_id:
          profile.organization_id,

        meter_id:
          meterId,

        technician_id:
          technicianId || null,

        scheduled_date:
          scheduledDate,

        scheduled_time:
          scheduledTime || null,

        status:
          "Scheduled",

        priority:
          "GOOD",

        notes

      }])

    alert("Schedule Saved!")

    setMeterId("")
    setTechnicianId("")
    setScheduledDate("")
    setScheduledTime("")
    setNotes("")

  }

  return (

    <ProtectedRoute>

      <div className="container">

        <h1>
          Schedule Meter
        </h1>

        <br />

        <select
          value={meterId}
          onChange={e =>
            setMeterId(e.target.value)
          }
        >

          <option value="">
            Select Meter
          </option>

          {meters.map(meter => (

            <option
              key={meter.id}
              value={meter.id}
            >

              {meter.meter_id_tag}

            </option>

          ))}

        </select>

        <br /><br />

        <select
          value={technicianId}
          onChange={e =>
            setTechnicianId(
              e.target.value
            )
          }
        >

          <option value="">
            Assign Technician
          </option>

          {technicians.map(tech => (

            <option
              key={tech.id}
              value={tech.id}
            >

              {tech.name}

            </option>

          ))}

        </select>

        <br /><br />

        <input
          type="date"
          value={scheduledDate}
          onChange={e =>
            setScheduledDate(
              e.target.value
            )
          }
        />

        <br /><br />

        <input
          type="time"
          value={scheduledTime}
          onChange={e =>
            setScheduledTime(
              e.target.value
            )
          }
        />

        <br /><br />

        <textarea
          placeholder="Dispatcher Notes..."
          value={notes}
          onChange={e =>
            setNotes(
              e.target.value
            )
          }
        />

        <br /><br />

        <button
          onClick={saveSchedule}
        >

          Save Schedule

        </button>

      </div>

    </ProtectedRoute>

  )

}