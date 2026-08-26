'use client'

import Link from 'next/link'
import CountUp from 'react-countup'

import {
  getStatus,
  isDueThisWeek,
} from '@/lib/dashboardHelpers'

export default function KPICards({
  meters,
  technicians,
  proveHistory,
}) {

  const overdue =
    meters.filter(
      m => getStatus(m) === "OVERDUE"
    ).length

  const dueThisWeek =
    meters.filter(
      m => isDueThisWeek(m)
    ).length

  const cards = [

    {
      title: "Total Meters",
      value: meters.length,
      color: "#2563eb",
      href: "/meters",
    },

    {
      title: "Overdue",
      value: overdue,
      color: "#dc2626",
      href: "/meters?status=OVERDUE",
    },

    {
      title: "Due This Week",
      value: dueThisWeek,
      color: "#ca8a04",
      href: "/dispatch-board",
    },

    {
      title: "Technicians",
      value: technicians.length,
      color: "#16a34a",
      href: "/technician-dashboard",
    },

    {
      title: "Total Proves",
      value: proveHistory.length,
      color: "#7c3aed",
      href: "/history",
    },

  ]

  return (

    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "repeat(auto-fit,minmax(220px,1fr))",
        gap: 20,
      }}
    >

      {cards.map(card => (

        <Link
          key={card.title}
          href={card.href}
          style={{
            textDecoration: "none",
          }}
        >

        <div
  style={{
    background: "white",
    borderRadius: 20,
    padding: 24,
    boxShadow:
      "0 12px 30px rgba(0,0,0,.08)",
    borderTop:
      `5px solid ${card.color}`,
    cursor: "pointer",

    transition:
      "all .25s ease",

    height: "100%",

    display: "flex",

    flexDirection: "column",

    justifyContent: "space-between",
  }}

  onMouseEnter={(e)=>{

    e.currentTarget.style.transform =
      "translateY(-8px)"

    e.currentTarget.style.boxShadow =
      "0 18px 45px rgba(37,99,235,.15)"

  }}

  onMouseLeave={(e)=>{

    e.currentTarget.style.transform =
      "translateY(0px)"

    e.currentTarget.style.boxShadow =
      "0 12px 30px rgba(0,0,0,.08)"

  }}

>

            <div
              style={{
                color: "#64748b",
                fontSize: 14,
                marginBottom: 12,
              }}
            >
              {card.title}
            </div>

            <div
              style={{
                fontSize: 42,
                fontWeight: 700,
                color: card.color,
              }}
            >
              <CountUp
                end={card.value}
                duration={1}
              />
            </div>

            <div
  style={{
    marginTop: "18px",
    color: card.color,
    fontWeight: 600,
    fontSize: "15px",
  }}
>

  View Details →

</div>

          </div>

        </Link>

      ))}

    </div>

  )

}