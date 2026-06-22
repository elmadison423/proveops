'use client'

import {
  useEffect,
  useState,
} from 'react'

import toast
from 'react-hot-toast'

import { supabase }
from '../../lib/supabase'

import ProtectedRoute
from '../../components/ProtectedRoute'

export default function SettingsPage() {

  const [organization, setOrganization] =
    useState(null)

  const [profile, setProfile] =
    useState(null)

  const [name, setName] =
    useState('')

  const [email, setEmail] =
    useState('')

  const [phone, setPhone] =
    useState('')

  const [
    dispatchRegion,
    setDispatchRegion,
  ] = useState('')

  const [theme, setTheme] =
    useState('midnight')

 useEffect(() => {
  document.body.classList.remove(
    "theme-carbon",
    "theme-emerald"
  )

  if (theme === "carbon") {
    document.body.classList.add("theme-carbon")
  }

  if (theme === "emerald") {
    document.body.classList.add("theme-emerald")
  }

  localStorage.setItem("proveops-theme", theme)
}, [theme])

useEffect(() => {
  const savedTheme =
    localStorage.getItem("proveops-theme")

  if (savedTheme) {
    setTheme(savedTheme)
  }
}, [])

 useEffect(() => {
  fetchSettings()
}, [])

  async function fetchSettings() {

    const user =
      (
        await supabase.auth
          .getUser()
      ).data.user

    if (!user) return

    const {
      data: profileData,
    } = await supabase
      .from('Profiles')
      .select('*')
      .eq(
        'user_id',
        user.id
      )
      .single()

    setProfile(profileData)

    setTheme(
      profileData?.theme ||
      'midnight'
    )

    const {
      data: org,
    } = await supabase
      .from('Organizations')
      .select('*')
      .eq(
        'id',
        profileData.organization_id
      )
      .single()

    if (!org) return

    setOrganization(org)

    setName(org.name || '')

    setEmail(
      org.contact_email || ''
    )

    setPhone(
      org.phone || ''
    )

    setDispatchRegion(
      org.dispatch_region || ''
    )
  }

  async function saveSettings() {

    if (!organization) return

    const { error } =
      await supabase
        .from('Organizations')
        .update({

          name,

          contact_email:
            email,

          phone,

          dispatch_region:
            dispatchRegion,
        })

        .eq(
          'id',
          organization.id
        )

    const {
      error: profileError,
    } = await supabase
      .from('Profiles')
      .update({

        theme,
      })

      .eq(
        'id',
        profile.id
      )

    if (
      error ||
      profileError
    ) {

      toast.error(
        'Error saving settings'
      )

    } else {

      localStorage.setItem(
        'proveops-theme',
        theme
      )

      toast.success(
        'Settings updated'
      )

      window.location.reload()
    }
  }

  return (

    <ProtectedRoute>

      <div className="container">

        <h1>
          Settings
        </h1>

        <br />

        <div
          className="card"
          style={{
            maxWidth:
              '700px',
          }}
        >

          <h2>
            Organization Settings
          </h2>

          <br />

          <label>
            Company Name
          </label>

          "Meters"
            value={name}
            onChange={(e) =>
              setName(
                e.target.value
              )
            }
          />

          <label>
            Contact Email
          </label>

          "Meters"
            value={email}
            onChange={(e) =>
              setEmail(
                e.target.value
              )
            }
          />

          <label>
            Phone
          </label>

          "Meters"
            value={phone}
            onChange={(e) =>
              setPhone(
                e.target.value
              )
            }
          />

          <label>
            Dispatch Region
          </label>

          "Meters"
            value={dispatchRegion}
            onChange={(e) =>
              setDispatchRegion(
                e.target.value
              )
            }
          />

          <br />
          <br />

          <h2>
            Theme Preferences
          </h2>

          <br />

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

          <button
            type="button"
            onClick={
              saveSettings
            }
          >

            Save Settings

          </button>

        </div>

      </div>

    </ProtectedRoute>
  )
}