'use client'

import {
  useEffect,
  useState,
} from 'react'

import {
  useParams,
  useRouter,
} from 'next/navigation'

import { supabase }
from '../../../lib/supabase'

import ProtectedRoute
from '../../../components/ProtectedRoute'

import toast from 'react-hot-toast'

export default function EditTechnician() {

  const params =
    useParams()

  const router =
    useRouter()

  const technicianId =
    params.id

  const [name, setName] =
    useState('')

  const [email, setEmail] =
    useState('')

  const [phone, setPhone] =
    useState('')

  const [role, setRole] =
    useState('')

  const [organizationId, setOrganizationId] =
    useState(null)

  const [loading, setLoading] =
    useState(true)

  useEffect(() => {

    fetchTechnician()

  }, [technicianId])

  function handleEnterKey(
    e
  ) {

    if (
      e.key === 'Enter'
    ) {

      e.preventDefault()

      const form =
        e.target.form

      const index =
        Array.prototype.indexOf.call(
          form,
          e.target
        )

      form.elements[
        index + 1
      ]?.focus()
    }
  }

  async function fetchTechnician() {

    setLoading(true)

    const {
      data: {
        user,
      },
    } = await supabase.auth.getUser()

    if (!user) {

      toast.error(
        'You must be logged in.'
      )

      setLoading(false)

      return
    }

    const {
      data: profile,
      error: profileError,
    } = await supabase
      .from('Profiles')
      .select('organization_id')
      .eq(
        'user_id',
        user.id
      )
      .maybeSingle()

    if (
      profileError ||
      !profile
    ) {

      console.error(
        'PROFILE ERROR:',
        profileError
      )

      toast.error(
        'Unable to load your organization.'
      )

      setLoading(false)

      return
    }

    setOrganizationId(
      profile.organization_id
    )

    const {
      data,
      error,
    } = await supabase
      .from('Technicians')
      .select('*')
      .eq(
        'id',
        technicianId
      )
      .eq(
        'organization_id',
        profile.organization_id
      )
      .maybeSingle()

    if (
      error
    ) {

      console.error(
        'TECHNICIAN ERROR:',
        error
      )

      toast.error(
        'Unable to load technician.'
      )

      setLoading(false)

      return
    }

    if (!data) {

      toast.error(
        'Technician not found.'
      )

      setLoading(false)

      return
    }

    setName(
      data.name || ''
    )

    setEmail(
      data.email || ''
    )

    setPhone(
      data.phone || ''
    )

    setRole(
      data.role || ''
    )

    setLoading(false)
  }

  async function updateTechnician() {

    if (!organizationId) {

      toast.error(
        'Unable to verify organization.'
      )

      return
    }

    const {
      error,
    } = await supabase
      .from('Technicians')
      .update({
        name,
        email,
        phone,
        role,
      })
      .eq(
        'id',
        technicianId
      )
      .eq(
        'organization_id',
        organizationId
      )

    if (error) {

      console.error(
        'UPDATE TECHNICIAN ERROR:',
        error
      )

      toast.error(
        'Error updating technician.'
      )

      return
    }

    toast.success(
      'Technician updated successfully'
    )

    router.push(
      '/technician-dashboard'
    )
  }

  if (loading) {

    return (

      <ProtectedRoute
  allowedRoles={[
    "Organization Admin",
  ]}
>

        <div className="container">

          <h1>
            Edit Technician
          </h1>

          <p>
            Loading technician...
          </p>

        </div>

      </ProtectedRoute>

    )
  }
return (

  <ProtectedRoute
    allowedRoles={[
      "Organization Admin",
    ]}
  >

    <div className="container">

      <h1>
        Edit Technician
      </h1>


        <form>

          <div>

            <label>
              Name
            </label>

            <input
              value={name}
              onChange={(e) =>
                setName(
                  e.target.value
                )
              }
              onKeyDown={
                handleEnterKey
              }
            />

          </div>

          <div>

            <label>
              Email
            </label>

            <input
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
              onKeyDown={
                handleEnterKey
              }
            />

          </div>

          <div>

            <label>
              Phone
            </label>

            <input
              type="text"
              value={phone}
              onChange={(e) =>
                setPhone(
                  e.target.value
                )
              }
              onKeyDown={
                handleEnterKey
              }
            />

          </div>

          <div>

            <label>
              Role
            </label>

            <select
              value={role}
              onChange={(e) =>
                setRole(
                  e.target.value
                )
              }
              onKeyDown={
                handleEnterKey
              }
            >

              <option value="">
                Select Role
              </option>

              <option value="Technician">
                Technician
              </option>

              <option value="Lead Technician">
                Lead Technician
              </option>

              <option value="Supervisor">
                Supervisor
              </option>

              <option value="Dispatcher">
                Dispatcher
              </option>

              <option value="Admin">
                Admin
              </option>

            </select>

          </div>

          <button
            type="button"
            onClick={
              updateTechnician
            }
          >

            Update Technician

          </button>

        </form>

      </div>

    </ProtectedRoute>
  )
}