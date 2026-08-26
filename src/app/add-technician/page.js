'use client'

import {
  useState,
} from 'react'

import {
  useRouter,
} from 'next/navigation'

import { supabase }
from '../../lib/supabase'

import ProtectedRoute
from '../../components/ProtectedRoute'

export default function AddTechnician() {

  const router =
    useRouter()

  const [name, setName] =
    useState('')

  const [email, setEmail] =
    useState('')

  const [phone, setPhone] =
    useState('')

  const [role, setRole] =
    useState('')

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

  async function addTechnician() {

    const user =
      (
        await supabase.auth
          .getUser()
      ).data.user

    if (!user) {

      alert(
        'No logged in user'
      )

      return
    }

    const {
      data: profile,
      error: profileError,
    } = await supabase
      .from('Profiles')
      .select('*')
      .eq(
        'user_id',
        user.id
      )
      .single()

    if (
      profileError ||
      !profile
    ) {

      alert(
        'Profile not found'
      )

      console.log(
        profileError
      )

      return
    }

    const { error } =
      await supabase
        .from('Technicians')
        .insert([
          {
            name,
            email,
            phone,
            role,

            organization_id:
              profile.organization_id,
          },
        ])

    if (error) {

      alert(
        'Error saving technician'
      )

      console.log(error)

    } else {

      alert(
        'Technician added successfully'
      )

      router.push('/')
    }
  }

  return (

    <ProtectedRoute>

      <div className="container">

        <h1>
          Add Technician
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
    setPhone(e.target.value)
  }
  onKeyDown={handleEnterKey}
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
              addTechnician
            }
          >

            Save Technician

          </button>

        </form>

      </div>

    </ProtectedRoute>
  )
}