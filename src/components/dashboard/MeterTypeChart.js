'use client'

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts'

export default function MeterTypeChart({
  meters,
}) {

  const meterTypeData = [

    {
      type: "Coriolis",
      count: meters.filter(
        m => m.meter_type === "Coriolis"
      ).length,
    },

    {
      type: "Turbine",
      count: meters.filter(
        m => m.meter_type === "Turbine"
      ).length,
    },

    {
      type: "Positive Displacement",
      count: meters.filter(
        m =>
          m.meter_type ===
          "Positive Displacement"
      ).length,
    },

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
  minHeight: "360px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
  padding: "35px",
}}
      >

        <div
          style={{
            fontSize: "60px",
            marginBottom: "20px",
          }}
        >
          🛢️
        </div>

        <h2
          style={{
            marginBottom: "12px",
          }}
        >
          No Meter Types
        </h2>

        <p
          style={{
            color: "#6b7280",
            maxWidth: "300px",
            marginBottom: "25px",
            lineHeight: "1.6",
          }}
        >
          Meter type distribution will appear
          once you begin adding meters to your
          organization.
        </p>

        <button
  className="primary-button"
  style={{
    marginTop: "30px",
  }}
  onClick={() =>
    window.location.href = "/add-meter"
  }
>
          ➕ Add First Meter
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
        height: "300px",
      }}
    >

      <h2>Meter Types</h2>

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
            stroke="rgba(255,255,255,.5)"
            tick={{
              fill: "rgba(255,255,255,.7)",
              fontSize: 13,
            }}
          />

          <YAxis
            stroke="rgba(255,255,255,.3)"
            tick={{
              fill: "rgba(255,255,255,.6)",
            }}
          />

          <Tooltip />

          <Bar
            dataKey="count"
            fill="#60a5fa"
            radius={[8, 8, 0, 0]}
          />

        </BarChart>

      </ResponsiveContainer>

    </div>

  )

}