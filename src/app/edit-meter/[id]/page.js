'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase'
import {
  useParams,
  useRouter,
} from 'next/navigation'

export default function EditMeter() {
  const params = useParams()
  const router = useRouter()

  const [name, setName] = useState('')
  const [location, setLocation] =
    useState('')
  const [
    lastProveDate,
    setLastProveDate,
  ] = useState('')
  const [
    intervalDays,
    setIntervalDays,
  ] = useState('')

  useEffect(() => {
    fetchMeter()
  }, [])

  async function fetchMeter() {
    const { data, error } =
      await supabase
        .from('Meters')
        .select('*')
        .eq('id', params.id)
        .single()

    if (error) {
      console.error(error)
    } else {
      setName(data.name)
      setLocation(data.location)
      setLastProveDate(
        data.last_prove_date
      )
      setIntervalDays(
        data.time_interval_days
      )
    }
  }

  async function updateMeter(e) {
    e.preventDefault()

    const { error } = await supabase
      .from('Meters')
      .update({
        name,
        location,
        last_prove_date:
          lastProveDate,
        time_interval_days:
          Number(intervalDays),
      })
      .eq('id', params.id)

    if (error) {
      alert(error.message)
    } else {
      alert('Meter updated!')

      router.push('/meters')
    }
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Edit Meter</h1>

      <form onSubmit={updateMeter}>
        <div style={{ marginBottom: '15px' }}>
          <label>Meter Name</label>
          <br />

          <input
            value={name}
            onChange={e =>
              setName(e.target.value)
            }
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Location</label>
          <br />

          <input
            value={location}
            onChange={e =>
              setLocation(e.target.value)
            }
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>
            Last Prove Date
          </label>
          <br />

          <input
            type="date"
            value={lastProveDate}
            onChange={e =>
              setLastProveDate(
                e.target.value
              )
            }
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>
            Time Interval Days
          </label>
          <br />

          <input
            type="number"
            value={intervalDays}
            onChange={e =>
              setIntervalDays(
                e.target.value
              )
            }
          />
        </div>

        <button type="submit">
          Update Meter
        </button>
      </form>
    </div>
  )
}