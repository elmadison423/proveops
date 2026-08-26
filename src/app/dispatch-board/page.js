'use client'

import {
  useEffect,
  useState,
} from 'react'

import { supabase }
from '../../lib/supabase'

import ProtectedRoute
from '../../components/ProtectedRoute'

import { useRouter } from 'next/navigation'

import toast from 'react-hot-toast'

export default function DispatchBoard() {

  const router = useRouter()

  const [search, setSearch] =
  useState('')

const [sortBy, setSortBy] =
  useState('priority')

  const [meters, setMeters] =
    useState([])

    const [filter, setFilter] =
  useState('ALL')

  const [
    technicians,
    setTechnicians,
  ] = useState([])

  const [selectedMeter, setSelectedMeter] = useState(null)

const [showScheduleModal, setShowScheduleModal] =
  useState(false)

const [scheduleDate, setScheduleDate] =
  useState('')

const [scheduleTime, setScheduleTime] =
  useState('')

const [scheduleNotes, setScheduleNotes] =
  useState('')

  useEffect(() => {

    fetchData()

  }, [])

  async function fetchData() {

  console.log("========== DISPATCH BOARD ==========")

  const {
    data: {
      user
    },
    error: userError
  } = await supabase.auth.getUser()

  console.log("USER:", user)
  console.log("USER ERROR:", userError)

  if (!user) {
    console.error("NO LOGGED-IN USER")
    return
  }

  const {
    data: profile,
    error: profileError
  } = await supabase
    .from('Profiles')
    .select('*')
    .eq(
      'user_id',
      user.id
    )
    .single()

  console.log("PROFILE:", profile)
  console.log("PROFILE ERROR:", profileError)

  if (profileError || !profile) {
    console.error(
      "COULD NOT LOAD PROFILE"
    )
    return
  }

  console.log(
    "ORGANIZATION ID:",
    profile.organization_id
  )

  const {
    data: meterData,
    error: meterError
  } = await supabase
    .from('meters')
    .select('*')
    .eq(
      'organization_id',
      profile.organization_id
    )

  console.log("METERS:", meterData)
  console.log("METER ERROR:", meterError)

  const {
    data: techData,
    error: techError
  } = await supabase
    .from('Technicians')
    .select('*')

  console.log("TECHNICIANS:", techData)
  console.log("TECHNICIAN ERROR:", techError)

  setMeters(
    meterData || []
  )

  setTechnicians(
    techData || []
  )

  console.log(
    "DISPATCH BOARD METERS:",
    meterData?.length || 0
  )

  console.log(
    "===================================="
  )
}

 async function scheduleMeter() {

  if (!selectedMeter) {
    toast.error("No meter selected.")
    return
  }

  if (!scheduleDate) {
    toast.error("Please select a scheduled date.")
    return
  }

  if (!scheduleTime) {
    toast.error("Please select a scheduled time.")
    return
  }

  const user =
    (
      await supabase.auth.getUser()
    ).data.user

  if (!user) {
    toast.error("No logged-in user found.")
    return
  }

  const {
    data: profile,
    error: profileError
  } = await supabase
    .from('Profiles')
    .select('organization_id')
    .eq(
      'user_id',
      user.id
    )
    .single()

  if (profileError || !profile) {
    console.error(
      "PROFILE ERROR:",
      profileError
    )

    toast.error("Unable to find your organization.")
    return
  }

  const {
    data: existingSchedule,
    error: existingError
  } = await supabase
    .from('Schedules')
    .select('id')
    .eq(
      'meter_id',
      selectedMeter.id
    )
    .eq(
      'status',
      'Scheduled'
    )
    .maybeSingle()

  if (existingError) {
    console.error(
      "SCHEDULE CHECK ERROR:",
      existingError
    )

    toast.error("Unable to check existing schedules.")
    return
  }

  if (existingSchedule) {
    toast.error(
  "This meter is already scheduled."
)

    return
  }

  const {
    error: scheduleError
  } = await supabase
    .from('Schedules')
    .insert({
      organization_id:
        profile.organization_id,

      meter_id:
        selectedMeter.id,

      technician_id:
        selectedMeter.technician_id || null,

      scheduled_date:
        scheduleDate,

      scheduled_time:
        scheduleTime,

      status:
        'Scheduled',

      notes:
        scheduleNotes || null
    })

  if (scheduleError) {

    console.error(
      "SCHEDULE ERROR:",
      scheduleError
    )

    toast.error(
  "Unable to schedule meter."
)

    return
  }

  toast.success(
  "Meter scheduled successfully!"
)

  setShowScheduleModal(false)

  setSelectedMeter(null)

  setScheduleDate('')

  setScheduleTime('')

  setScheduleNotes('')

}

  function getNextProveDate(
    meter
  ) {

    const lastProve =
      new Date(
        meter.last_prove_date
      )

    lastProve.setDate(
      lastProve.getDate() +
      meter.time_interval_days
    )

    return lastProve
  }

  function getPriority(
    meter
  ) {

    const today = new Date()

const nextWeek =
  new Date(today)

nextWeek.setDate(
  today.getDate() + 7
)

    const nextProve =
      getNextProveDate(
        meter
      )

    const volumeUsed =

      (meter.current_volume || 0)

      -

      (meter.last_prove_volume || 0)

    const volumeDue =
  meter.volume_interval &&
  meter.current_volume &&
  meter.current_volume >= meter.volume_interval
  
    if (
      nextProve < today ||
      volumeDue
    ) {

      return 'CRITICAL'
    }

    if (
      nextProve <= nextWeek
    ) {

      return 'HIGH'
    }

    return 'NORMAL'
  }

  const sortedMeters =

    [...meters].sort(
      (a, b) => {

        const priorityOrder = {

          CRITICAL: 1,

          HIGH: 2,

          NORMAL: 3,
        }

        return (

          priorityOrder[
            getPriority(a)
          ]

          -

          priorityOrder[
            getPriority(b)
          ]
        )
      }
    )

    const filteredMeters =
  [...meters]

    .filter(meter => {

      const matchesFilter =
        filter === 'ALL'
        ||
        getPriority(meter)
        === filter

      const searchText = `
  ${meter.meter_id_tag || ''}
  ${meter.name || ''}
  ${meter.location || ''}
`
.toLowerCase()

      const matchesSearch =
        searchText.includes(
          search.toLowerCase()
        )

      return (
        matchesFilter
        &&
        matchesSearch
      )
    })

    .sort((a, b) => {

      if (sortBy === 'dueDate') {

        return (
          getNextProveDate(a)
          -
          getNextProveDate(b)
        )
      }

      if (sortBy === 'serial') {

        return (
          (a.serial_number || '')
          .localeCompare(
            b.serial_number || ''
          )
        )
      }

      const priorityOrder = {
        CRITICAL: 1,
        HIGH: 2,
        NORMAL: 3,
      }

      return (
        priorityOrder[
          getPriority(a)
        ]
        -
        priorityOrder[
          getPriority(b)
        ]
      )
    })

  return (

    <ProtectedRoute>

      <div className="container">

        <h1>
          Dispatch Board
        </h1>

        <br />

        <div className="dispatch-toolbar">

  <input
    type="text"
    placeholder="Search meters..."
    value={search}
   onChange={(e) => setSearch(e.target.value)}
    className="dispatch-search"
  />

  <select
    value={sortBy}
   onChange={(e) => setSortBy(e.target.value)}
    className="dispatch-sort"
  >

    <option value="priority">
      Sort by Priority
    </option>

    <option value="dueDate">
      Sort by Due Date
    </option>

    <option value="serial">
      Sort by Serial
    </option>

  </select>

</div>

<div className="dispatch-filters">

  {
    [
      'ALL',
      'CRITICAL',
      'HIGH',
      'NORMAL',
    ].map(type => (

      <button
        key={type}
        className={
          filter === type
          ? 'dispatch-filter active'
          : 'dispatch-filter'
        }
        onClick={() =>
          setFilter(type)
        }
      >

        {type}

      </button>
    ))
  }

</div>

<br />

        <br />

        <div className="cards">

  {
    filteredMeters.map(
      meter => {

        const priority =
          getPriority(meter)

        const technician =
          technicians.find(
            tech =>
              tech.id ===
              meter.technician_id
          )

        return (

          <div
  key={meter.id}
  className={`dispatch-card ${priority.toLowerCase()}`}
  onClick={() => router.push(`/meter-detail?id=${meter.id}`)}
  style={{ cursor: 'pointer' }}
>
           <h2>
            {meter.meter_id_tag}
           </h2>

            <p>
              {meter.name}
            </p>

            <p>
              {meter.location}
            </p>

            <p>
              Technician:
              {' '}
              {
                technician?.name ||
                'Unassigned'
              }
            </p>

            <div
              className={`priority-badge ${priority.toLowerCase()}`}
            >
              {priority}
            </div>

            <p
              style={{
                marginTop: '14px'
              }}
            >
              Due Date:
              {' '}
              {
  meter.next_due_date
    ? new Date(
        meter.next_due_date + "T00:00:00"
      ).toLocaleDateString()
    : getNextProveDate(meter)
        .toLocaleDateString()
}
            </p>

            <button
  type="button"
  onClick={(e) => {
    e.stopPropagation();

    setSelectedMeter(meter);

    setScheduleDate(
      meter.next_due_date || ''
    );

    setScheduleTime('');

    setScheduleNotes('');

    setShowScheduleModal(true);
  }}
>
  📅 Schedule Job
</button>

          </div>
        )
      }
    )
  }

</div>

       </div>

      {showScheduleModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >

          <div
            style={{
              background: "#fff",
              borderRadius: "12px",
              padding: "24px",
              width: "min(500px, 90%)",
              boxShadow:
                "0 20px 50px rgba(0,0,0,0.25)",
            }}
          >

            <h2>
              Schedule Meter
            </h2>

            <p
              style={{
                marginTop: "8px",
                marginBottom: "20px",
              }}
            >
              {selectedMeter?.meter_id_tag}
              {" — "}
              {selectedMeter?.name}
            </p>

            <div
              style={{
                marginBottom: "16px",
              }}
            >

              <label>
                Technician
              </label>

              <select
                value={
                  selectedMeter?.technician_id || ""
                }
                onChange={(e) =>
                  setSelectedMeter({
                    ...selectedMeter,
                    technician_id:
                      e.target.value
                        ? Number(e.target.value)
                        : null,
                  })
                }
                style={{
                  width: "100%",
                  marginTop: "6px",
                  padding: "10px",
                }}
              >

                <option value="">
                  Select Technician
                </option>

                {technicians.map(
                  technician => (
                    <option
                      key={technician.id}
                      value={technician.id}
                    >
                      {technician.name}
                    </option>
                  )
                )}

              </select>

            </div>

            <div
              style={{
                marginBottom: "16px",
              }}
            >

              <label>
                Scheduled Date
              </label>

              <input
                type="date"
                value={scheduleDate}
                onChange={(e) =>
                  setScheduleDate(
                    e.target.value
                  )
                }
                style={{
                  width: "100%",
                  marginTop: "6px",
                  padding: "10px",
                }}
              />

            </div>

            <div
              style={{
                marginBottom: "16px",
              }}
            >

              <label>
                Scheduled Time
              </label>

              <input
                type="time"
                value={scheduleTime}
                onChange={(e) =>
                  setScheduleTime(
                    e.target.value
                  )
                }
                style={{
                  width: "100%",
                  marginTop: "6px",
                  padding: "10px",
                }}
              />

            </div>

            <div
              style={{
                marginBottom: "20px",
              }}
            >

              <label>
                Notes
              </label>

              <textarea
                value={scheduleNotes}
                onChange={(e) =>
                  setScheduleNotes(
                    e.target.value
                  )
                }
                placeholder="Optional notes..."
                rows={4}
                style={{
                  width: "100%",
                  marginTop: "6px",
                  padding: "10px",
                  resize: "vertical",
                }}
              />

            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "12px",
              }}
            >

              <button
                type="button"
                onClick={() => {
                  setShowScheduleModal(false);
                  setSelectedMeter(null);
                }}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={scheduleMeter}
              >
                Schedule Job
              </button>

            </div>

          </div>

        </div>
      )}

    </ProtectedRoute>
  )
}