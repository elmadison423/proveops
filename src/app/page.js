'use client'

import { useEffect, useState } from 'react'

import CriticalAlerts from '../components/dashboard/CriticalAlerts'

import RecentActivity from '../components/dashboard/RecentActivity'

import { useRouter } from "next/navigation";

import UpcomingDueMeters from '../components/dashboard/UpcomingDueMeters'

import ProtectedRoute from '../components/ProtectedRoute'

import DispatchQueue from '../components/dashboard/DispatchQueue'

import { fetchDashboardData } from '../lib/dashboardQueries'

import { useOrganization } from "../context/OrganizationContext";

import KPICards from '../components/dashboard/KPICards'
import MeterStatusChart from '../components/dashboard/MeterStatusChart'
import MeterTypeChart from '../components/dashboard/MeterTypeChart'

export default function Dashboard() {

  const router = useRouter();

const greeting = () => {

  const hour = new Date().getHours();

  if (hour < 12)
    return "Good Morning";

  if (hour < 18)
    return "Good Afternoon";

  return "Good Evening";

};

const today = new Date().toLocaleDateString(
  "en-US",
  {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }
);

  const {
  user,
  profile,
  organization,
  loading: organizationLoading,
} = useOrganization();

  const [loading, setLoading] = useState(true)

  const [meters, setMeters] =
    useState([])

  const [technicians, setTechnicians] =
    useState([])

  const [proveHistory, setProveHistory] =
    useState([])

 useEffect(() => {

  if (organizationLoading) return;

  if (!organization?.id) {
    setLoading(false);
    return;
  }

  loadDashboard();

}, [organization, organizationLoading]);

  async function loadDashboard() {

   const data = await fetchDashboardData(
  organization?.id
)

    if (!data) {

      setLoading(false)

      return

    }

    setMeters(
      data.meters
    )

    setTechnicians(
      data.technicians
    )

    setProveHistory(
      data.proveHistory
    )

    setLoading(false)

  }

  if (organizationLoading || loading) {

  return (

    <ProtectedRoute>

      <div className="container">

        <h2>
          Loading Dashboard...
        </h2>

      </div>

    </ProtectedRoute>

  )
}

  return (

    <ProtectedRoute>

      <div className="container">

        <div
  className="card"
  style={{
    padding: "35px",
    marginBottom: "35px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "25px",
  }}
>

  <div>

    <h3
      style={{
        color: "#2563eb",
        marginBottom: "10px",
      }}
    >
      👋 {greeting()},
      {" "}
      {profile?.full_name?.split(" ")[0]}
    </h3>

    <h1
      style={{
        marginBottom: "8px",
      }}
    >
      {organization?.name}
    </h1>

    <p
      style={{
        color: "#6b7280",
        marginBottom: "6px",
      }}
    >
      {today}
    </p>

    <p
      style={{
        color: "#6b7280",
      }}
    >
      Welcome back! Here's today's operational summary.
    </p>

  </div>

  <div
    style={{
      display: "flex",
      gap: "15px",
      flexWrap: "wrap",
    }}
  >

    <button
      className="primary-button"
      onClick={() =>
        router.push("/add-meter")
      }
    >
      + Add Meter
    </button>

    <button
      onClick={() =>
        router.push("/schedule")
      }
    >
      📅 Schedule Work
    </button>

  </div>

</div>

<KPICards
  meters={meters}
  technicians={technicians}
  proveHistory={proveHistory}
/>

<br />

<CriticalAlerts
  meters={meters}
  proveHistory={proveHistory}
/>

<br />

<h2>
  📅 Today's Operations
</h2>

<div
  className="cards"
  style={{
    marginBottom: "35px",
  }}
>
  <UpcomingDueMeters
    meters={meters}
  />

  <DispatchQueue
    meters={meters}
  />
</div>

{/* =========================================
    OPERATIONAL HEALTH
========================================= */}

<h2
  style={{
    marginBottom: "20px",
    color: "#0f172a",
  }}
>
  📊 Operational Health
</h2>

<div
  className="cards"
  style={{
    marginBottom: "35px",
  }}
>
  <MeterStatusChart
    meters={meters}
  />

  <MeterTypeChart
    meters={meters}
  />
</div>

{/* =========================================
    RECENT ACTIVITY
========================================= */}

<RecentActivity
  proveHistory={proveHistory}
/>

</div>

</ProtectedRoute>

)

}