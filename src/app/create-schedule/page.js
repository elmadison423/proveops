'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import ProtectedRoute from '@/components/ProtectedRoute'

export default function CreateSchedule() {

  const router = useRouter()

  const [meters, setMeters] = useState([])
  const [technicians, setTechnicians] = useState([])

  const [meterId, setMeterId] = useState('')
  const [technicianId, setTechnicianId] = useState('')
  const [scheduledDate, setScheduledDate] = useState('')
  const [scheduledTime, setScheduledTime] = useState('08:00')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {

    const {
      data: { user }
    } = await supabase.auth.getUser()

    if (!user) return

    const { data: profile } =
      await supabase
        .from('Profiles')
        .select('organization_id')
        .eq('user_id', user.id)
        .single()

    const { data: meterData } =
      await supabase
        .from('meters')
        .select('*')
        .eq(
          'organization_id',
          profile.organization_id
        )
        .order('meter_id_tag')

    const { data: techData } =
      await supabase
        .from('Technicians')
        .select('*')
        .eq(
          'organization_id',
          profile.organization_id
        )
        .order('name')

    setMeters(meterData || [])
    setTechnicians(techData || [])

  }

 async function saveSchedule() {

  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) return

  const { data: profile } =
    await supabase
      .from('Profiles')
      .select('organization_id')
      .eq('user_id', user.id)
      .single()

  const { error } =
    await supabase
      .from('Schedules')
      .insert([

        {
          organization_id:
            profile.organization_id,

          meter_id:
            meterId,

          technician_id:
            Number(technicianId),

          scheduled_date:
            scheduledDate,

          scheduled_time:
            scheduledTime,

          status:
            "Scheduled",

          priority:
            "NORMAL",

          notes
        }

      ])

  if (error) {

    console.log(error)

    alert("Error creating schedule.")

    return

  }

  alert("Schedule created successfully!")

  router.push("/technician-schedule")

}

  return (

    <ProtectedRoute>

      <div className="container">

        <h1>Create Schedule</h1>

<br />

<div className="card">

  <h2>Schedule a Meter Prove</h2>

  <br />

  <label>Meter</label>

  <select
    value={meterId}
    onChange={(e) =>
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

        {meter.meter_id_tag} - {meter.location}

      </option>

    ))}

  </select>

  <br />
  <br />

  <label>Technician</label>

  <select
    value={technicianId}
    onChange={(e) =>
      setTechnicianId(e.target.value)
    }
  >

    <option value="">
      Select Technician
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

  <br />
  <br />

  <label>Date</label>

  <input
    type="date"
    value={scheduledDate}
    onChange={(e) =>
      setScheduledDate(e.target.value)
    }
  />

  <br />
  <br />

  <label>Time</label>

  <input
    type="time"
    value={scheduledTime}
    onChange={(e) =>
      setScheduledTime(e.target.value)
    }
  />

  <br />
  <br />

  <label>Notes</label>

  <textarea
    value={notes}
    onChange={(e) =>
      setNotes(e.target.value)
    }
  />

  <br />
  <br />

  <button
    onClick={saveSchedule}
  >

    Save Schedule

  </button>

</div>

      </div>

    </ProtectedRoute>

  )

}