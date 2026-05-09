'use client'

import {
  useEffect,
  useState,
} from 'react'

import {
  useRouter,
} from 'next/navigation'

import { supabase }
from '../../lib/supabase'

import ProtectedRoute
from '../../components/ProtectedRoute'

export default function AddMeter() {

  const router =
    useRouter()

  const [name, setName] =
    useState('')

  const [
    location,
    setLocation,
  ] = useState('')

  const [
    lastProveDate,
    setLastProveDate,
  ] = useState('')

  const [
    timeIntervalDays,
    setTimeIntervalDays,
  ] = useState('30')

  const [
    technicians,
    setTechnicians,
  ] = useState([])

  const [
    technicianId,
    setTechnicianId,
  ] = useState('')

  useEffect(() => {

    fetchTechnicians()

  }, [])

  async function fetchTechnicians() {

    const user =
      (
        await supabase.auth
          .getUser()
      ).data.user

    if (!user) return

    const {
      data: profile,
    } = await supabase
      .from('Profiles')
      .select('*')
      .eq(
        'user_id',
        user.id
      )
      .single()

    const {
      data,
    } = await supabase
      .from('Technicians')
      .select('*')
      .eq(
        'organization_id',
        profile.organization_id
      )

    setTechnicians(
      data || []
    )
  }

  async function addMeter() {

    const user =
      (
        await supabase.auth
          .getUser()
      ).data.user

    if (!user) return

    const {
      data: profile,
    } = await supabase
      .from('Profiles')
      .select('*')
      .eq(
        'user_id',
        user.id
      )
      .single()

    const { error } =
      await supabase
        .from('Meters')
        .insert([
          {
            name,
            location,

            last_prove_date:
              lastProveDate,

            time_interval_days:
              Number(
                timeIntervalDays
              ),

            organization_id:
              profile.organization_id,

            technician_id:
              Number(
                technicianId
              ),
          },
        ])

    if (!error) {

      alert(
        'Meter added successfully'
      )

      router.push(
        '/meters'
      )
    }
  }

  return (

    <ProtectedRoute>

      <div className="container">

        <h1>
          Add Meter
        </h1>

        <div>

          <label>
            Meter Name
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
            Location
          </label>

          <input
            value={location}
            onChange={(e) =>
              setLocation(
                e.target.value
              )
            }
          />

        </div>

        <div>

          <label>
            Last Prove Date
          </label>

          <input
            type="date"
            value={
              lastProveDate
            }
            onChange={(e) =>
              setLastProveDate(
                e.target.value
              )
            }
          />

        </div>

        <div>

          <label>
            Time Interval
            (Days)
          </label>

          <input
            type="number"
            value={
              timeIntervalDays
            }
            onChange={(e) =>
              setTimeIntervalDays(
                e.target.value
              )
            }
          />

        </div>

        <div>

          <label>
            Assigned Technician
          </label>

          <select
            value={
              technicianId
            }
            onChange={(e) =>
              setTechnicianId(
                e.target.value
              )
            }
          >

            <option value="">
              Select Technician
            </option>

            {
              technicians.map(
                tech => (

                  <option
                    key={tech.id}
                    value={tech.id}
                  >

                    {tech.name}

                  </option>

                )
              )
            }

          </select>

        </div>

        <button
          type="button"
          onClick={addMeter}
        >

          Save Meter

        </button>

      </div>

    </ProtectedRoute>
  )
}