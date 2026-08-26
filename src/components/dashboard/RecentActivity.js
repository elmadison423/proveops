'use client'

export default function RecentActivity({
  proveHistory,
}) {

  const recent = [...proveHistory]
    .sort(
      (a, b) =>
        new Date(b.prove_date) -
        new Date(a.prove_date)
    )
    .slice(0, 8)

  if (recent.length === 0) {

    return (

      <div className="card">

        <h2
          style={{
            marginBottom: "25px",
          }}
        >
          📝 Recent Activity
        </h2>

        <div
          style={{
            textAlign: "center",
            padding: "45px 20px",
          }}
        >

          <div
            style={{
              fontSize: "52px",
              marginBottom: "20px",
            }}
          >
            📝
          </div>

          <h3>No Activity Yet</h3>

          <p
            style={{
              color: "#6b7280",
              marginTop: "10px",
              maxWidth: "420px",
              marginInline: "auto",
              lineHeight: 1.6,
            }}
          >
            Completed proving jobs will appear
            here as technicians begin using
            ProveOps.
          </p>

        </div>

      </div>

    )

  }

  return (

    <div className="card">

      <h2
        style={{
          marginBottom: "25px",
        }}
      >
        📝 Recent Activity
      </h2>

      {recent.map(activity => (

        <div
          key={activity.id}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px 0",
            borderBottom:
              "1px solid #e5e7eb",
          }}
        >

          <div>

            <div
              style={{
                fontWeight: 600,
                marginBottom: "5px",
              }}
            >
              {activity.meter_name}
            </div>

            <div
              style={{
                color: "#64748b",
                fontSize: "14px",
              }}
            >
              Prove completed
            </div>

          </div>

          <div
            style={{
              textAlign: "right",
            }}
          >

            <div
              style={{
                fontWeight: 600,
                color:
                  activity.status === "PASS"
                    ? "#16a34a"
                    : "#dc2626",
              }}
            >
              {activity.status}
            </div>

            <div
              style={{
                color: "#64748b",
                fontSize: "13px",
              }}
            >
              {new Date(
                activity.prove_date
              ).toLocaleDateString()}
            </div>

          </div>

        </div>

      ))}

    </div>

  )

}