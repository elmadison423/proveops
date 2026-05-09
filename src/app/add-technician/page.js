'use client'

import { useState } from 'react'

import { useRouter }
from 'next/navigation'

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
            organization_id:
              profile.organization_id,
          },
        ])

    if (error) {

      console.log(error)

      alert(
        'Error saving technician'
      )

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
          />

        </div>

        <button
          type="button"
          onClick={
            addTechnician
          }
        >

          Save Technician

        </button>

      </div>

    </ProtectedRoute>
  )
}