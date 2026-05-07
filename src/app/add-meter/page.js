'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function AddMeter() {
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

  async function addMeter(e) {
    e.preventDefault()

    const { error } = await supabase
      .from('Meters')
      .insert([
        {
          name,
          location,
          last_prove_date:
            lastProveDate,
          time_interval_days:
            Number(intervalDays),
        },
      ])

    if (error) {
      alert(error.message)
    } else {
      alert('Meter added!')

      setName('')
      setLocation('')
      setLastProveDate('')
      setIntervalDays('')
    }
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Add Meter</h1>

      <form onSubmit={addMeter}>
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
          Add Meter
        </button>
      </form>
    </div>
  )
}