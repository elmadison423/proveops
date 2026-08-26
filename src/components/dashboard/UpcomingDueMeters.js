'use client'

import Link from 'next/link'

import {
  getStatus,
  formatDate,
} from '@/lib/dashboardHelpers'

export default function UpcomingDueMeters({
  meters,
}) {

  const dueMeters = [...meters]
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

    <div className="card">

      <h2>
        Upcoming Due Meters
      </h2>

      <br />

      {
        dueMeters.length === 0
        ? (
            <p>
              No upcoming provings.
            </p>
          )
        : (
            dueMeters.map(meter => (

              <Link
                key={meter.id}
                href={`/meter-detail?id=${meter.id}`}
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                }}
              >

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '14px',
                    borderBottom:
                      '1px solid #e5e7eb',
                  }}
                >

                  <div>

                    <div
                      style={{
                        fontWeight: 700,
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
                      textAlign: 'right',
                    }}
                  >

                    <div>
                      {formatDate(
                        meter.next_due_date
                      )}
                    </div>

                    <div
                      style={{
                        marginTop: 6,
                        fontSize: 12,
                        fontWeight: 700,
                        color:
                          getStatus(meter) === "OVERDUE"
                            ? "#dc2626"
                            : getStatus(meter) === "CRITICAL"
                            ? "#f97316"
                            : getStatus(meter) === "DUE SOON"
                            ? "#ca8a04"
                            : "#16a34a",
                      }}
                    >
                      {getStatus(meter)}
                    </div>

                  </div>

                </div>

              </Link>

            ))
          )
      }

    </div>

  )

}