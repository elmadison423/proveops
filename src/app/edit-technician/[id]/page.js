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

  useEffect(() => {

    fetchTechnician()

  }, [])

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

    const {
      data,
    } = await supabase
      .from('Technicians')
      .select('*')
      .eq(
        'id',
        technicianId
      )
      .single()

    if (!data) return

    setName(data.name || '')

    setEmail(data.email || '')

    setPhone(data.phone || '')

    setRole(data.role || '')
  }

  async function updateTechnician() {

    const { error } =
      await supabase
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

    if (error) {

      console.log(error)

      alert(
        'Error updating technician'
      )

    } else {

      alert(
        'Technician updated successfully'
      )

      router.push(
        '/technician-dashboard'
      )
    }
  }

  return (

    <ProtectedRoute>

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