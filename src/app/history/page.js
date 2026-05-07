'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function History() {
  const [history, setHistory] = useState([])

  useEffect(() => {
    fetchHistory()
  }, [])

  async function fetchHistory() {
    const { data, error } = await supabase
      .from('ProveHistory')
      .select('*')
      .order('prove_date', {
        ascending: false,
      })

    if (error) {
      console.error(error)
    } else {
      setHistory(data)
    }
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>ProveOps - Prove History</h1>

      <table
        style={{
          borderCollapse: 'collapse',
          width: '100%',
          marginTop: '20px',
        }}
      >
        <thead>
          <tr>
            <th style={{
              border: '1px solid black',
              padding: '10px',
            }}>
              Meter Name
            </th>

            <th style={{
              border: '1px solid black',
              padding: '10px',
            }}>
              Location
            </th>

            <th style={{
              border: '1px solid black',
              padding: '10px',
            }}>
              Prove Date
            </th>
          </tr>
        </thead>

        <tbody>
          {history.map(h => (
            <tr key={h.id}>
              <td style={{
                border: '1px solid black',
                padding: '10px',
              }}>
                {h.meter_name}
              </td>

              <td style={{
                border: '1px solid black',
                padding: '10px',
              }}>
                {h.location}
              </td>

              <td style={{
                border: '1px solid black',
                padding: '10px',
              }}>
                {h.prove_date}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}