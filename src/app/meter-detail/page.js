'use client'

import {
  useEffect,
  useState,
} from 'react'

import {
  useSearchParams,
} from 'next/navigation'

import { supabase }
from '../../lib/supabase'

import ProtectedRoute
from '../../components/ProtectedRoute'

export default function MeterDetail() {

  const searchParams =
    useSearchParams()

  const meterId =
  searchParams.get('id')

  const [meter, setMeter] =
    useState(null)

  const [
    proveHistory,
    setProveHistory,
  ] = useState([])

  useEffect(() => {

    fetchData()

  }, [])

  async function fetchData() {

    const {
      data: meterData,
    } = await supabase
      .from('Meters')
      .select('*')
      .eq(
        'id',
        meterId
      )
      .single()

    setMeter(meterData)

    const {
      data: historyData,
    } = await supabase
      .from('ProveHistory')
.select('*')
.eq(
  'meter_id',
  meterId
)
      .order(
        'prove_date',
        {
          ascending: false,
        }
      )

    setProveHistory(
      historyData || []
    )
  }

return (
  <ProtectedRoute>

    <div className="container">

      {meter && (
        <div
          className="card"
          style={{
            marginBottom: '20px',
            padding: '24px'
          }}
        >
          <h1>
            {meter.meter_id_tag}
          </h1>

          <br />

          <p>
            <strong>Name:</strong>{' '}
            {meter.name}
          </p>

          <p>
            <strong>Location:</strong>{' '}
            {meter.location}
          </p>

          <p>
            <strong>Status:</strong>{' '}
            {meter.status || 'ACTIVE'}
          </p>

          <p>
            <strong>Frequency:</strong>{' '}
            {meter.prove_frequency || '30 Days'}
          </p>

          <p>
            <strong>Next Due:</strong>{' '}
            {meter.next_due_date}
          </p>
        </div>
      )}

      <h2>
        Prove History
      </h2>

      <br />

      {
        proveHistory.length === 0
          ? (
            <p>No prove history</p>
          )
          : (
            proveHistory.map(prove => (
              <div
                key={prove.id}
                className="card"
                style={{
                  marginBottom: '12px'
                }}
              >
                <p>
                  {prove.date}
                </p>
              </div>
            ))
          )
      }

    </div>

  </ProtectedRoute>
)
}