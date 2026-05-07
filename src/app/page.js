'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Home() {
  const [meters, setMeters] = useState([])

  useEffect(() => {
    fetchMeters()
  }, [])

  async function fetchMeters() {
    const { data, error } = await supabase
      .from('Meters')
      .select('*')

    if (error) {
      console.error(error)
    } else {
      setMeters(data)
    }
  }

  function getStatus(meter) {
    const today = new Date()

    const lastProve = new Date(
      meter.last_prove_date
    )

    const nextProve = new Date(lastProve)

    nextProve.setDate(
      lastProve.getDate() +
        meter.time_interval_days
    )

    if (today >= nextProve) {
      return 'DUE'
    }

    return 'OK'
  }

  const totalMeters = meters.length

  const dueMeters = meters.filter(
    m => getStatus(m) === 'DUE'
  ).length

  const okMeters = meters.filter(
    m => getStatus(m) === 'OK'
  ).length

  return (
    <div style={{ padding: '20px' }}>
      <h1>ProveOps Dashboard</h1>

      <div
        style={{
          display: 'flex',
          gap: '20px',
          marginTop: '30px',
        }}
      >
        <div
          style={{
            border: '1px solid black',
            padding: '20px',
            width: '200px',
          }}
        >
          <h2>Total Meters</h2>

          <p
            style={{
              fontSize: '32px',
            }}
          >
            {totalMeters}
          </p>
        </div>

        <div
          style={{
            border: '1px solid black',
            padding: '20px',
            width: '200px',
          }}
        >
          <h2>Due Meters</h2>

          <p
            style={{
              fontSize: '32px',
              color: 'red',
            }}
          >
            {dueMeters}
          </p>
        </div>

        <div
          style={{
            border: '1px solid black',
            padding: '20px',
            width: '200px',
          }}
        >
          <h2>OK Meters</h2>

          <p
            style={{
              fontSize: '32px',
              color: 'green',
            }}
          >
            {okMeters}
          </p>
        </div>
      </div>
    </div>
  )
}