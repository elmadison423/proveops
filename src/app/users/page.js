'use client'

import { useEffect, useState } from 'react'
import ProtectedRoute from '../../components/ProtectedRoute'
import { useOrganization } from '../../context/OrganizationContext'
import { supabase } from '../../lib/supabase'

export default function UsersPage() {

  const { organization } = useOrganization()

  // ===========================
  // State
  // ===========================

  const [users, setUsers] = useState([])

  const [showInviteModal, setShowInviteModal] =
    useState(false)

  const [inviteName, setInviteName] =
    useState("")

  const [inviteEmail, setInviteEmail] =
    useState("")

  const [inviteRole, setInviteRole] =
    useState("Technician")

  // ===========================
  // Load Users
  // ===========================

  useEffect(() => {

    if (organization) {

      loadUsers()

    }

  }, [organization])

  async function loadUsers() {

    const { data, error } =
      await supabase
        .from("Profiles")
        .select("*")
        .eq(
          "organization_id",
          organization.id
        )
        .order("full_name")

    if (error) {

      console.error(error)

      return

    }

    console.log("Profiles returned:");
console.log(data);

    setUsers(data || [])

  }

  // ===========================
  // Invite User
  // ===========================

  async function inviteUser() {

    try {

      const response =
        await fetch(
          "/api/invite-user",
          {

            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({

              fullName:
                inviteName,

              email:
                inviteEmail,

              role:
                inviteRole,

              organizationId:
                organization.id,

            }),

          }
        )

      const result =
        await response.json()

      if (!response.ok) {

        throw new Error(
          result.error
        )

      }

      alert(
        "User invited successfully!"
      )

      setShowInviteModal(false)

      setInviteName("")
      setInviteEmail("")
      setInviteRole("Technician")

      setTimeout(() => {

  loadUsers();

}, 1000);

    }

    catch (err) {

      console.error(err)

      alert(err.message)

    }

  }

  // ===========================
  // UI
  // ===========================

  return (

    <ProtectedRoute>

      <div
        style={{
          padding: "40px",
        }}
      >
<div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >

        <div>

          <h1
            style={{
              fontSize: "2.5rem",
              fontWeight: "700",
              marginBottom: "8px",
            }}
          >
            Users
          </h1>

          <p
            style={{
              opacity: 0.7,
            }}
          >
            Manage users in your organization.
          </p>

        </div>

        <button
          className="primary-button"
          onClick={() =>
            setShowInviteModal(true)
          }
        >
          + Invite User
        </button>

      </div>

      <div
        className="card"
        style={{
          padding: "30px",
        }}
      >

        {users.length === 0 && (

          <div
            style={{
              textAlign: "center",
              padding: "60px",
              opacity: 0.6,
            }}
          >

            No users found.

          </div>

        )}

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "18px",
          }}
        >

          {users.map((user) => (

            <div
              key={user.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "20px",
                borderRadius: "16px",
                border: "1px solid #e5e7eb",
                background: "white",
              }}
            >

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "18px",
                }}
              >

                <div
                  style={{
                    width: "52px",
                    height: "52px",
                    borderRadius: "50%",
                    background:
                      "linear-gradient(135deg,#2563eb,#7c3aed)",
                    color: "white",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontWeight: "700",
                    fontSize: "18px",
                  }}
                >

                  {user.full_name
                    ?.split(" ")
                    .map(name => name[0])
                    .join("")}

                </div>

                <div>

                  <h3
                    style={{
                      margin: 0,
                    }}
                  >
                    {user.full_name}
                  </h3>

                  <p
                    style={{
                      marginTop: "5px",
                      color: "#6b7280",
                    }}
                  >
                    {user.email}
                  </p>

                </div>

              </div>

              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  alignItems: "center",
                }}
              >

                <span
                  style={{
                    background: "#eef2ff",
                    color: "#4338ca",
                    padding: "6px 12px",
                    borderRadius: "999px",
                    fontWeight: "600",
                  }}
                >
                  {user.role}
                </span>

                <span
                  style={{
                    background: "#dcfce7",
                    color: "#15803d",
                    padding: "6px 12px",
                    borderRadius: "999px",
                    fontWeight: "600",
                  }}
                >
                  Active
                </span>

              </div>

            </div>

          ))}

        </div>

      </div>

       {showInviteModal && (

        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >

          <div
            style={{
              width: "500px",
              background: "white",
              borderRadius: "20px",
              padding: "32px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
            }}
          >

            <h2
              style={{
                marginTop: 0,
                marginBottom: "8px",
              }}
            >
              Invite User
            </h2>

            <p
              style={{
                color: "#6b7280",
                marginBottom: "28px",
              }}
            >
              Invite a new member to your organization.
            </p>

            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: 600,
              }}
            >
              Full Name
            </label>

            <input
              type="text"
              value={inviteName}
              onChange={(e) =>
                setInviteName(e.target.value)
              }
              placeholder="John Smith"
              style={{
                width: "100%",
                marginBottom: "20px",
              }}
            />

            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: 600,
              }}
            >
              Email
            </label>

            <input
              type="email"
              value={inviteEmail}
              onChange={(e) =>
                setInviteEmail(e.target.value)
              }
              placeholder="john@company.com"
              style={{
                width: "100%",
                marginBottom: "20px",
              }}
            />

            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: 600,
              }}
            >
              Role
            </label>

            <select
              value={inviteRole}
              onChange={(e) =>
                setInviteRole(e.target.value)
              }
              style={{
                width: "100%",
                marginBottom: "30px",
              }}
            >
              <option>Technician</option>
              <option>Dispatcher</option>
              <option>Viewer</option>
              <option>Organization Admin</option>
            </select>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "12px",
              }}
            >

              <button
                onClick={() =>
                  setShowInviteModal(false)
                }
              >
                Cancel
              </button>

              <button
                onClick={inviteUser}
              >
                Invite User
              </button>

            </div>

          </div>

        </div>

      )}

        </div>

    </ProtectedRoute>

  )

}