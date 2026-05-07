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

    if (!error) {
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

  const dueMeters = meters.filter(
    meter =>
      getStatus(meter) === 'DUE'
  )

  const okMeters = meters.filter(
    meter =>
      getStatus(meter) === 'OK'
  )

  return (
    <div className="container">
      <h1>ProveOps Dashboard</h1>

      <div className="cards">
        <div className="card">
          <h2>Total Meters</h2>

          <h1>{meters.length}</h1>
        </div>

        <div className="card">
          <h2>Due Meters</h2>

          <h1 style={{ color: 'red' }}>
            {dueMeters.length}
          </h1>
        </div>

        <div className="card">
          <h2>OK Meters</h2>

          <h1 style={{ color: 'green' }}>
            {okMeters.length}
          </h1>
        </div>
      </div>
    </div>
  )
}