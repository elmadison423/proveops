'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

import ProtectedRoute from '@/components/ProtectedRoute'
import { supabase } from '@/lib/supabase'

export default function SettingsPage() {

  const router = useRouter()

  // ===========================
  // State
  // ===========================

  const [loading, setLoading] =
    useState(true)

  const [organization, setOrganization] =
    useState(null)

  const [profile, setProfile] =
    useState(null)

  const [name, setName] =
    useState("")

  const [email, setEmail] =
    useState("")

  const [phone, setPhone] =
    useState("")

  const [dispatchRegion, setDispatchRegion] =
    useState("")

  const [theme, setTheme] =
    useState("midnight")

  // ===========================
  // Load Settings
  // ===========================

  useEffect(() => {

    loadSettings()

  }, [])

  useEffect(() => {

    document.body.classList.remove(
      "theme-carbon",
      "theme-emerald"
    )

    if (theme === "carbon") {

      document.body.classList.add(
        "theme-carbon"
      )

    }

    if (theme === "emerald") {

      document.body.classList.add(
        "theme-emerald"
      )

    }

    localStorage.setItem(
      "proveops-theme",
      theme
    )

  }, [theme])

  async function loadSettings() {

    try {

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      const {
        data: profileData,
        error: profileError,
      } = await supabase
        .from("Profiles")
        .select("*")
        .eq("user_id", user.id)
        .single()

      if (profileError)
        throw profileError

      setProfile(profileData)

      const {
        data: orgData,
        error: orgError,
      } = await supabase
        .from("Organizations")
        .select("*")
        .eq(
          "id",
          profileData.organization_id
        )
        .single()

      if (orgError)
        throw orgError

      setOrganization(orgData)

      setName(
        orgData.name || ""
      )

      setEmail(
        orgData.contact_email || ""
      )

      setPhone(
        orgData.phone || ""
      )

      setDispatchRegion(
        orgData.dispatch_region || ""
      )

      setTheme(
        profileData.theme ||
        "midnight"
      )

    }

    catch (err) {

      console.error(err)

      toast.error(
        "Unable to load settings."
      )

    }

    finally {

      setLoading(false)

    }

  }

   // ===========================
  // Save Settings
  // ===========================

  async function saveSettings() {

    if (!organization || !profile)
      return

    try {

      const { error } =
        await supabase
          .from("Organizations")
          .update({

            name,

            contact_email: email,

            phone,

            dispatch_region:
              dispatchRegion,

          })
          .eq(
            "id",
            organization.id
          )

      if (error)
        throw error

      const {
        error: profileError,
      } = await supabase
        .from("Profiles")
        .update({
          theme,
        })
        .eq(
          "id",
          profile.id
        )

      if (profileError)
        throw profileError

      toast.success(
        "Settings saved successfully!"
      )

    }

    catch (err) {

      console.error(err)

      toast.error(
        "Unable to save settings."
      )

    }

  }

  // ===========================
  // Loading Screen
  // ===========================

  if (loading) {

    return (

      <ProtectedRoute>

        <div className="container">

          <h2>
            Loading Settings...
          </h2>

        </div>

      </ProtectedRoute>

    )

  }

  // ===========================
  // UI
  // ===========================

  return (

    <ProtectedRoute>

      <div
        style={{
          padding: "40px",
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >

        <div
          style={{
            marginBottom: "40px",
          }}
        >

          <h1
            style={{
              fontSize: "2.6rem",
              marginBottom: "8px",
            }}
          >
            Organization Settings
          </h1>

          <p
            style={{
              color: "#6b7280",
            }}
          >
            Manage your organization, branding and preferences.
          </p>

        </div>

        {/* Company Information */}

        <div
          className="card"
          style={{
            padding: "30px",
            marginBottom: "30px",
          }}
        >

          <h2
            style={{
              marginTop: 0,
            }}
          >
            🏢 Company Information
          </h2>

          <p
            style={{
              color: "#6b7280",
              marginBottom: "25px",
            }}
          >
            Update your organization details.
          </p>

          <label>Company Name</label>

          <input
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            placeholder="Company Name"
            style={{
              marginBottom: "20px",
            }}
          />

          <label>Contact Email</label>

          <input
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            placeholder="Email Address"
            style={{
              marginBottom: "20px",
            }}
          />

          <label>Phone Number</label>

          <input
            value={phone}
            onChange={(e) =>
              setPhone(e.target.value)
            }
            placeholder="Phone Number"
            style={{
              marginBottom: "20px",
            }}
          />

          <label>Dispatch Region</label>

          <input
            value={dispatchRegion}
            onChange={(e) =>
              setDispatchRegion(
                e.target.value
              )
            }
            placeholder="Permian Basin"
            style={{
              marginBottom: "30px",
            }}
          />

          <button
            onClick={saveSettings}
            className="primary-button"
          >
            Save Changes
          </button>

        </div>

        {/* Users */}

        <div
          className="card"
          style={{
            padding: "30px",
            marginBottom: "30px",
          }}
        >

          <h2
            style={{
              marginTop: 0,
            }}
          >
            👥 Organization Users
          </h2>

          <p
            style={{
              color: "#6b7280",
              marginBottom: "20px",
            }}
          >
            Invite users and manage permissions.
          </p>

          <button
            onClick={() =>
              router.push("/users")
            }
          >
            Manage Users →
          </button>

        </div>

        {/* Appearance */}

        <div
          className="card"
          style={{
            padding: "30px",
            marginBottom: "30px",
          }}
        >

          <h2
            style={{
              marginTop: 0,
            }}
          >
            🎨 Appearance
          </h2>

          <p
            style={{
              color: "#6b7280",
            }}
          >
            Customize the look and feel of ProveOps.
          </p>

          <br />

          <label>Theme</label>

          <select
            value={theme}
            onChange={(e) =>
              setTheme(
                e.target.value
              )
            }
          >

            <option value="midnight">
              Midnight Blue
            </option>

            <option value="carbon">
              Carbon Black
            </option>

            <option value="emerald">
              Emerald Ops
            </option>

          </select>

        </div>

        {/* Notifications */}

        <div
          className="card"
          style={{
            padding: "30px",
            marginBottom: "30px",
          }}
        >

          <h2
            style={{
              marginTop: 0,
            }}
          >
            🔔 Notifications
          </h2>

          <p
            style={{
              color: "#6b7280",
            }}
          >
            Monthly due reports, technician alerts, dispatch emails and customer reminders will be configurable here in Version 1.0.
          </p>

        </div>

        {/* Security */}

        <div
          className="card"
          style={{
            padding: "30px",
          }}
        >

          <h2
            style={{
              marginTop: 0,
            }}
          >
            🔒 Security
          </h2>

          <p
            style={{
              color: "#6b7280",
            }}
          >
            Password management, two-factor authentication and API access will be added here.
          </p>

        </div>

        </div>

    </ProtectedRoute>

  )

}