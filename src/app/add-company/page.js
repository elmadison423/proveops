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

export default function AddCompany() {

  const router =
    useRouter()

  const [
    companyName,
    setCompanyName,
  ] = useState('')

  const [
    contactEmail,
    setContactEmail,
  ] = useState('')

  const [phone, setPhone] =
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

  async function addCompany() {

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
      .from("Meters")('Profiles')
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
        .from("Meters")('Organizations')
        .insert([
          {
            name:
              companyName,

            contact_email:
              contactEmail,

            phone,

            owner_id:
              user.id,
          },
        ])

    if (error) {

      alert(
        'Error saving company'
      )

      console.log(error)

    } else {

      alert(
        'Company added successfully'
      )

      router.push('/')
    }
  }

  return (

    <ProtectedRoute>

      <div className="container">

        <h1>
          Add Company
        </h1>

        <form>

          <div>

            <label>
              Company Name
            </label>

            <input
              value={companyName}
              onChange={(e) =>
                setCompanyName(
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
              Contact Email
            </label>

            <input
              value={contactEmail}
              onChange={(e) =>
                setContactEmail(
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

          <button
            type="button"
            onClick={addCompany}
          >

            Save Company

          </button>

        </form>

      </div>

    </ProtectedRoute>
  )
}