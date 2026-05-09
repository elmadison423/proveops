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

  const [name, setName] =
    useState('')

  const [
    contactEmail,
    setContactEmail,
  ] = useState('')

  const [phone, setPhone] =
    useState('')

  async function addCompany() {

    const user =
      (
        await supabase.auth
          .getUser()
      ).data.user

    const { error } =
      await supabase
        .from('Companies')
        .insert([
          {
            name,
            contact_email:
              contactEmail,
            phone,
            user_id:
              user.id,
          },
        ])

    if (!error) {

      alert(
        'Company added'
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
              Contact Email
            </label>

            <input
              value={
                contactEmail
              }
              onChange={(e) =>
                setContactEmail(
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
              addCompany
            }
          >

            Save Company

          </button>

        </form>

      </div>

    </ProtectedRoute>
  )
}