'use client'

import Link from 'next/link'
import {
  getStatus,
} from '@/lib/dashboardHelpers'

export default function CriticalAlerts({
  meters,
 proveHistory,
}) {

  const overdue =
    meters.filter(
      meter =>
        getStatus(meter) === "OVERDUE"
    ).length

  const critical =
    meters.filter(
      meter =>
        getStatus(meter) === "CRITICAL"
    ).length

  const failed =
    proveHistory.filter(
      prove =>
        prove.status === "FAIL"
    ).length

  const hasAlerts =
    overdue > 0 ||
    critical > 0 ||
    failed > 0

  if (!hasAlerts) {

    return (

      <div
        className="card"
        style={{
          marginBottom: "30px",
          borderLeft:
            "6px solid #16a34a",
        }}
      >

        <h2
          style={{
            color: "#16a34a",
            marginBottom: "15px",
          }}
        >
          ✅ Operations Healthy
        </h2>

        <p
          style={{
            color: "#6b7280",
          }}
        >
          No overdue meters,
          critical meters,
          or failed proves.
        </p>

      </div>

    )

  }

  return (

    <div
      className="card"
      style={{
        marginBottom: "30px",
        borderLeft:
          "6px solid #dc2626",
      }}
    >

      <h2
        style={{
          marginBottom: "20px",
        }}
      >
        🚨 Critical Alerts
      </h2>

      {overdue > 0 && (

        <p style={{marginBottom:"12px"}}>
          🔴
          {" "}
          <strong>{overdue}</strong>
          {" "}
          overdue meter
          {overdue !== 1 && "s"}
        </p>

      )}

      {critical > 0 && (

        <p style={{marginBottom:"12px"}}>
          🟡
          {" "}
          <strong>{critical}</strong>
          {" "}
          meter
          {critical !== 1 && "s"}
          {" "}
          due within 7 days
        </p>

      )}

      {failed > 0 && (

        <p style={{marginBottom:"20px"}}>
          ❌
          {" "}
          <strong>{failed}</strong>
          {" "}
          failed prove
          {failed !== 1 && "s"}
        </p>

      )}

      <Link
        href="/meters"
        style={{
          color: "#2563eb",
          fontWeight: 600,
          textDecoration: "none",
        }}
      >
        View Meters →
      </Link>

    </div>

  )

}