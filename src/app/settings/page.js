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

     const [reportEnabled, setReportEnabled] = useState(true)

  const [reportScheduleType, setReportScheduleType] =
    useState("days_before_month_end")

  const [reportDaysBefore, setReportDaysBefore] =
    useState(7)

  const [reportDayOfMonth, setReportDayOfMonth] =
    useState(25)

  const [reportSendTime, setReportSendTime] =
    useState("08:00")

  const [reportTimezone, setReportTimezone] =
    useState("America/Chicago")

  const [reportEmail, setReportEmail] =
    useState("")

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

       setReportEnabled(
        orgData.monthly_report_enabled ?? true
      )

      setReportScheduleType(
        orgData.monthly_report_schedule_type ||
        "days_before_month_end"
      )

      setReportDaysBefore(
        orgData.monthly_report_days_before ?? 7
      )

      setReportDayOfMonth(
        orgData.monthly_report_day_of_month ?? 25
      )

      setReportSendTime(
        String(orgData.monthly_report_send_time || "08:00:00")
          .slice(0, 5)
      )

      setReportTimezone(
        orgData.monthly_report_timezone ||
        "America/Chicago"
      )

      setReportEmail(
        orgData.monthly_report_email || ""
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

  dispatch_region: dispatchRegion,

  monthly_report_enabled: reportEnabled,

  monthly_report_schedule_type: reportScheduleType,

  monthly_report_days_before: Number(reportDaysBefore),

  monthly_report_day_of_month: Number(reportDayOfMonth),

  monthly_report_send_time: reportSendTime,

  monthly_report_timezone: reportTimezone,

  monthly_report_email: reportEmail.trim() || null,

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

        {/* Monthly Report Settings */}

        <div
          className="card"
          style={{
            padding: "30px",
            marginBottom: "30px",
          }}
        >
          <h2 style={{ marginTop: 0 }}>
            📧 Automatic Monthly Reports
          </h2>

          <p style={{ color: "#6b7280", marginBottom: "25px" }}>
            Choose when ProveOps emails your organization its upcoming due-meter report.
          </p>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "25px",
            }}
          >
            <input
              type="checkbox"
              checked={reportEnabled}
              onChange={(e) => setReportEnabled(e.target.checked)}
              style={{ width: "18px", height: "18px" }}
            />
            Enable automatic monthly reports
          </label>

          <label>Report Schedule</label>

          <select
            value={reportScheduleType}
            onChange={(e) => setReportScheduleType(e.target.value)}
            style={{ marginBottom: "20px" }}
          >
            <option value="days_before_month_end">
              A number of days before the upcoming month
            </option>
            <option value="specific_day">
              A specific day each month
            </option>
          </select>

          {reportScheduleType === "days_before_month_end" ? (
            <>
              <label>Days Before Upcoming Month</label>

              <select
                value={reportDaysBefore}
                onChange={(e) => setReportDaysBefore(Number(e.target.value))}
                style={{ marginBottom: "20px" }}
              >
                <option value={1}>1 day before</option>
                <option value={3}>3 days before</option>
                <option value={5}>5 days before</option>
                <option value={7}>7 days before</option>
                <option value={10}>10 days before</option>
                <option value={14}>14 days before</option>
                <option value={21}>21 days before</option>
                <option value={28}>28 days before</option>
              </select>
            </>
          ) : (
            <>
              <label>Day of Month</label>

              <select
                value={reportDayOfMonth}
                onChange={(e) => setReportDayOfMonth(Number(e.target.value))}
                style={{ marginBottom: "20px" }}
              >
                {Array.from({ length: 28 }, (_, i) => i + 1).map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </>
          )}

          <label>Preferred Delivery Time (Central Time)</label>

          <select
            value={reportSendTime}
            onChange={(e) => setReportSendTime(e.target.value)}
            style={{ marginBottom: "20px" }}
          >
            <option value="06:00">6:00 AM</option>
            <option value="07:00">7:00 AM</option>
            <option value="08:00">8:00 AM</option>
            <option value="09:00">9:00 AM</option>
            <option value="10:00">10:00 AM</option>
            <option value="12:00">12:00 PM</option>
            <option value="14:00">2:00 PM</option>
            <option value="16:00">4:00 PM</option>
          </select>

          <label>Report Recipient Email (Optional)</label>

          <input
            type="email"
            value={reportEmail}
            onChange={(e) => setReportEmail(e.target.value)}
            placeholder={email || "Use organization contact email"}
            style={{ marginBottom: "10px" }}
          />

          <p
            style={{
              color: "#6b7280",
              fontSize: "13px",
              marginBottom: "25px",
            }}
          >
            Leave blank to send reports to your organization&apos;s contact email.
            The schedule uses America/Chicago time, including daylight saving time.
          </p>

          <button
            onClick={saveSettings}
            className="primary-button"
            disabled={!organization || !profile}
          >
            Save Report Settings
          </button>
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