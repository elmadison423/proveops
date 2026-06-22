'use client'

import {
  useEffect,
  useState,
} from 'react'

import Link from 'next/link'

import CountUp from 'react-countup'

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from 'recharts'

import { supabase }
from '../lib/supabase'

import ProtectedRoute
from '../components/ProtectedRoute'

export default function Dashboard() {

  const [meters, setMeters] =
    useState([])

  const [
    technicians,
    setTechnicians,
  ] = useState([])

  const [
    proveHistory,
    setProveHistory,
  ] = useState([])

  const [
    organization,
    setOrganization,
  ] = useState(null)

  const [
    recentActivity,
    setRecentActivity,
  ] = useState([])

  useEffect(() => {

    fetchDashboard()

  }, [])

  async function fetchDashboard() {

    const user =
      (
        await supabase.auth
          .getUser()
      ).data.user

    if (!user) return

    const {
      data: profile,
    } = await supabase
      .from("Profiles")
      .select('*')
      .eq(
        'user_id',
        user.id
      )
      .single()

  const {
  data: org,
} = await supabase
  .from("Organizations")
  .select("*")
  .limit(1)

    setOrganization(
      org?.[0]
    )

    const {
  data: meterData,
} = await supabase
  .from("meters")
  .select("*")
      .eq(
        'organization_id',
        profile.organization_id
      )

    const {
      data: technicianData,
    } = await supabase
      .from("Technicians")
      .select('*')
      .eq(
        'organization_id',
        profile.organization_id
      )

    const {
      data: proveData,
    } = await supabase
      .from("ProveHistory")
      .select('*')
      .eq(
        'organization_id',
        profile.organization_id
      )

    setMeters(
      meterData || []
    )

    setTechnicians(
      technicianData || []
    )

    setProveHistory(
      proveData || []
    )

    const recent =

      (proveData || [])

        .slice(-5)

        .reverse()

        .map(prove => {

          const meter =
            meterData?.find(

              m =>

                String(m.id)
                ===
                String(
                  prove.meter_id
                )
            )

          return {

            id: prove.id,

            text:

              `${meter?.meter_id_tag || 'Unknown'} proved successfully`,

            date:
              prove.prove_date,
          }
        })

    setRecentActivity(
      recent
    )
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

  function getStatus(meter) {

  const today = new Date()

  const nextDue =
    meter.next_due_date
      ? new Date(meter.next_due_date)
      : null

  if (!nextDue)
    return "GOOD"

  const daysUntilDue =
    Math.floor(
      (
        nextDue.getTime() -
        today.getTime()
      ) /
      (1000 * 60 * 60 * 24)
    )

  if (daysUntilDue < 0)
    return "OVERDUE"

  if (daysUntilDue <= 7)
    return "CRITICAL"

  if (daysUntilDue <= 14)
    return "DUE SOON"

  return "GOOD"
}

  function isDueThisWeek(
    meter
  ) {

    const today =
      new Date()

    const nextWeek =
      new Date()

    nextWeek.setDate(
      today.getDate() + 7
    )

    const nextProve =
      getNextProveDate(
        meter
      )

    return (
      nextProve >= today
      &&
      nextProve <= nextWeek
    )
  }

  const overdueMeters =
    meters.filter(

      meter =>

        getStatus(
          meter
        )
        === 'DUE'
    )

  const okMeters =
    meters.filter(

      meter =>

        getStatus(
          meter
        )
        === 'OK'
    )

  const dueThisWeek =
    meters.filter(

      meter =>

        isDueThisWeek(
          meter
        )
    )

  const statusData = [

    {
      name: 'OK',
      value: okMeters.length,
    },

    {
      name: 'Due',
      value: overdueMeters.length,
    },
  ]

  const meterTypeData = [

    {
      type: 'Coriolis',

      count:

        meters.filter(

          m =>

            m.meter_type
            === 'Coriolis'
        ).length,
    },

    {
      type: 'Turbine',

      count:

        meters.filter(

          m =>

            m.meter_type
            === 'Turbine'
        ).length,
    },

    {
      type:
        'Positive Displacement',

      count:

        meters.filter(

          m =>

            m.meter_type
            ===
            'Positive Displacement'
        ).length,
    },
  ]

const dueMeters = meters
  .filter(
    meter => meter.next_due_date
  )
  .sort(
    (a, b) =>
      new Date(a.next_due_date) -
      new Date(b.next_due_date)
  )
  .slice(0, 10)
  return (

    <ProtectedRoute>

      <div className="container">

        <h1>

          {
            organization?.name ||
            'ProveOps Dashboard'
          }

        </h1>

        <br />

       <div className="cards">

  <Link href="/meters">

    <div className="card kpi-card">

      <small className="kpi-label">
        Total Meters
      </small>

      <h1 className="kpi-number">

        <CountUp
          end={meters.length}
          duration={1.5}
        />

      </h1>

      <small className="kpi-trend">
        Active asset base
      </small>

    </div>

  </Link>

  <Link href="/meters?status=DUE">

    <div className="card kpi-card kpi-overdue">

      <small className="kpi-label">
        Overdue Meters
      </small>

      <h1
        className="kpi-number"
        style={{
          color: '#f87171',
        }}
      >

        <CountUp
          end={overdueMeters.length}
          duration={1.5}
        />

      </h1>

      <small className="kpi-trend">
        Immediate attention required
      </small>

    </div>

  </Link>

  <Link href="/dispatch-board">

    <div className="card kpi-card kpi-warning">

      <small className="kpi-label">
        Due This Week
      </small>

      <h1
        className="kpi-number"
        style={{
          color: '#fbbf24',
        }}
      >

        <CountUp
          end={dueThisWeek.length}
          duration={1.5}
        />

      </h1>

      <small className="kpi-trend">
        Upcoming proving workload
      </small>

    </div>

  </Link>

  <Link href="/technician-dashboard">

    <div className="card kpi-card kpi-success">

      <small className="kpi-label">
        Technicians
      </small>

      <h1 className="kpi-number">

        <CountUp
          end={technicians.length}
          duration={1.5}
        />

      </h1>

      <small className="kpi-trend">
        Active field personnel
      </small>

    </div>

  </Link>

  <Link href="/history">

    <div className="card kpi-card kpi-info">

      <small className="kpi-label">
        Total Proves
      </small>

      <h1 className="kpi-number">

        <CountUp
          end={proveHistory.length}
          duration={1.5}
        />

      </h1>

      <small className="kpi-trend">
        Historical prove records
      </small>

    </div>

  </Link>

</div>

        <br />
        <br />

        <div className="cards">

          <div
            className="card"
            style={{
  width: '500px',
  height: '350px',
}}
          >

            <h2>
              Meter Status
            </h2>

<ResponsiveContainer
  width="100%"
  height={260}
  >

              <PieChart>

  <Pie
    data={statusData}
    dataKey="value"
    nameKey="name"
    outerRadius={110}
    innerRadius={65}
    paddingAngle={4}
  >

    <Cell fill="#34d399" />

    <Cell fill="#f87171" />

  </Pie>

  <Tooltip />

  <text
    x="50%"
    y="48%"
    textAnchor="middle"
    dominantBaseline="middle"
    fill="white"
    fontSize="28"
    fontWeight="700"
  >
    {meters.length}
  </text>

  <text
    x="50%"
    y="58%"
    textAnchor="middle"
    dominantBaseline="middle"
    fill="rgba(255,255,255,0.6)"
    fontSize="14"
  >
    Total Meters
  </text>

</PieChart>

            </ResponsiveContainer>

          </div>

          <div
            className="card"
            style={{
              width: '500px',
              height: '300px',
            }}
          >

            <h2>
              Meter Types
            </h2>

 <ResponsiveContainer
  width="100%"
  height={260}
>

          <BarChart
  data={meterTypeData}
  margin={{
    top: 20,
    right: 20,
    left: 0,
    bottom: 20,
  }}
>

  <XAxis
    dataKey="type"
    stroke="rgba(255,255,255,0.5)"
    tick={{
      fill: 'rgba(255,255,255,0.6)',
      fontSize: 13,
    }}
  />

  <YAxis
    stroke="rgba(255,255,255,0.3)"
    tick={{
      fill: 'rgba(255,255,255,0.5)',
      fontSize: 12,
    }}
  />

  <Tooltip />

  <Bar
    dataKey="count"
    fill="#60a5fa"
    radius={[10, 10, 0, 0]}
  />

</BarChart>

            </ResponsiveContainer>

          </div>

        </div>

        <br />
        <br />

        <div
  className="card"
  style={{
    minHeight: '160px',
  }}
>

<h2>
  Recent Activity
</h2>

<br />

{
  dueMeters.length === 0
  ? (
      <div>
        No upcoming provings
      </div>
    )
  : (
      dueMeters.map(meter => (

        <div
          key={meter.id}
          style={{
            padding: '12px',
            borderBottom:
              '1px solid #e5e7eb',
          }}
        >

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >

            <div>

              <div
                style={{
                  fontWeight: '700',
                }}
              >
                {meter.meter_id_tag}
              </div>

              <div
                style={{
                  color: '#64748b',
                }}
              >
                {meter.location}
              </div>

            </div>

            <div
  style={{
    textAlign: "right",
    minWidth: "120px",
  }}
>

              <div>
                Due
              </div>

              <div
                style={{
                  color: '#2563eb',
                }}
              >
                {meter.next_due_date}
              </div>

            </div>

          </div>

        </div>

      ))
    )
}

<br />
<br />

<div className="card">

  <h2>
    Active Dispatch Queue
  </h2>

  <br />

  {
    meters
      .slice()
      .sort((a, b) => {

        const dateA =
          getNextProveDate(a)

        const dateB =
          getNextProveDate(b)

        return dateA - dateB
      })
      .slice(0, 5)
      .map(meter => {

        const nextDate =
          getNextProveDate(meter)

        const priority =
          getStatus(meter)

        return (

          <Link
            key={meter.id}
            href={`/meter-detail?id=${meter.id}`}
            style={{
              textDecoration: 'none',
            }}
          >

            <div
  className="dispatch-preview-item"
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 16px",
    borderBottom: "1px solid #e5e7eb",
  }}
>

  <div>

    <div
      style={{
        fontWeight: "700",
        fontSize: "16px",
      }}
    >
      {meter.meter_id_tag}
    </div>

    <div
      style={{
        color: "#64748b",
        fontSize: "14px",
      }}
    >
      {meter.location}
    </div>

  </div>

  <div>

    <span
      style={{
        background:
          priority === "DUE"
            ? "#dc2626"
            : "#16a34a",
        color: "white",
        padding: "6px 12px",
        borderRadius: "999px",
        fontSize: "12px",
        fontWeight: "600",
      }}
    >
      {priority}
    </span>

  </div>

  <div
    style={{
      textAlign: "right",
    }}
  >

    <div
  style={{
    fontWeight: "600",
    marginBottom: "4px",
  }}
>
  Due
</div>

    <div
      style={{
        color: "#2563eb",
      }}
    >
      {nextDate.toLocaleDateString()}
    </div>

  </div>

</div>

          </Link>
        )
      })
  }

</div>

        </div>

      </div>

    </ProtectedRoute>
  )
}