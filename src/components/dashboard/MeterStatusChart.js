'use client'

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts'

import { getStatus } from '@/lib/dashboardHelpers'

export default function MeterStatusChart({
  meters,
}) {

  const statusData = [

    {
      name: "GOOD",
      value: meters.filter(
        m => getStatus(m) === "GOOD"
      ).length,
    },

    {
      name: "DUE SOON",
      value: meters.filter(
        m => getStatus(m) === "DUE SOON"
      ).length,
    },

    {
      name: "CRITICAL",
      value: meters.filter(
        m => getStatus(m) === "CRITICAL"
      ).length,
    },

    {
      name: "OVERDUE",
      value: meters.filter(
        m => getStatus(m) === "OVERDUE"
      ).length,
    },

  ]

  const COLORS = [

    "#22c55e",
    "#eab308",
    "#f97316",
    "#ef4444",

  ]

   // ===========================
  // Empty State
  // ===========================

  if (meters.length === 0) {

    return (

      <div
        className="card"
        style={{
          width: "500px",
          height: "350px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          padding: "30px",
        }}
      >

        <div
          style={{
            fontSize: "60px",
            marginBottom: "20px",
          }}
        >
          📊
        </div>

        <h2
          style={{
            marginBottom: "12px",
          }}
        >
          No Meter Data
        </h2>

        <p
          style={{
            color: "#6b7280",
            maxWidth: "300px",
            marginBottom: "25px",
            lineHeight: "1.6",
          }}
        >
          Add your first meter to begin tracking
          operational status and proving health.
        </p>

        <button
          className="primary-button"
          onClick={() =>
            window.location.href =
              "/add-meter"
          }
        >
          + Add Meter
        </button>

      </div>

    )

  }

  // ===========================
  // Chart
  // ===========================

  return (

    <div
      className="card"
      style={{
        width: "500px",
        height: "350px",
      }}
    >

      <h2>Meter Status</h2>

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

            {statusData.map(
              (_, index) => (

                <Cell
                  key={index}
                  fill={COLORS[index]}
                />

              )
            )}

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

  )

}