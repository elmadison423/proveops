'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import ProtectedRoute from '@/components/ProtectedRoute'

export default function TechnicianSchedule() {

  const [schedules, setSchedules] = useState([])
const [loading, setLoading] = useState(true)

useEffect(() => {
  loadSchedule()
}, [])

async function loadSchedule() {

  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    setLoading(false)
    return
  }

  const { data: profile } =
    await supabase
      .from('Profiles')
      .select('organization_id')
      .eq('user_id', user.id)
      .single()

      console.log("Organization ID:", profile?.organization_id)

const { data: schedules, error } =
  await supabase
    .from('Schedules')
    .select('*')
    .eq(
      'organization_id',
      profile.organization_id
    )
    .eq(
      'status',
      'Scheduled'
    )
    .order('scheduled_date')
    .order('scheduled_time')

    const { data: meters } =
  await supabase
    .from('meters')
    .select(`
      id,
      meter_id_tag,
      location
    `)

    const { data: technicians } =
  await supabase
    .from('Technicians')
    .select(`
      id,
      name
    `)

 if (error) {
  console.log("PROFILE =", profile)
  console.log("USER =", user)
  console.log("ERROR =", error)
}

console.log("Schedules:", schedules)
console.log("Technicians:", technicians)

 const combined =
  (schedules || []).map(schedule => ({

    ...schedule,

    meter:
      meters?.find(
        meter =>
          meter.id === schedule.meter_id
      ),

    technician:
      technicians?.find(
        tech =>
          tech.id === schedule.technician_id
      )

  }))

setSchedules(combined)
  setLoading(false)

}

  return (

    <ProtectedRoute>

      <div className="container">

        <h1>
          Technician Schedule
        </h1>

        <br />

       <div className="card">

  <h2>
    Scheduled Jobs
  </h2>

  <br />

  {loading ? (

    <p>Loading...</p>

  ) : schedules.length === 0 ? (

    <p>No scheduled jobs.</p>

  ) : (

   <div
  style={{
    display: "grid",
    gap: "16px",
    marginTop: "20px",
  }}
>

  {schedules.map(schedule => (

    <div
      key={schedule.id}
      className="card"
      style={{
        padding: "20px",
      }}
    >

      <h3>

        {schedule.meter?.meter_id_tag || "Unknown Meter"}

      </h3>

      <p>

        📍 {schedule.meter?.location || "Unknown Location"}

      </p>

      <p>

  👷 {schedule.technician?.name || "Unassigned"}

</p>

      <br />

 <p>

  📅 {new Date(
    `${schedule.scheduled_date}T00:00:00`
  ).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  )}

</p>

<p>

  🕒 {schedule.scheduled_time
    ? new Date(
        `1970-01-01T${schedule.scheduled_time}`
      ).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      })
    : "No Time Assigned"}

</p>

      <br />

      <p>

        Status: {schedule.status}

      </p>

      <br />

<p>

  <strong>📝 Notes</strong>

</p>

<p>

  {schedule.notes || "No notes"}

</p>

<br />

<div
  style={{
    display: "flex",
    gap: "12px",
    marginTop: "15px",
  }}
>

  <Link
  href={`/log-prove?id=${schedule.meter_id}&schedule=${schedule.id}`}
>

  <button>

    ▶ Start Prove

  </button>

</Link>

</div>

    </div>

  ))}

</div>

  )}

</div>

      </div>

    </ProtectedRoute>

  )

}