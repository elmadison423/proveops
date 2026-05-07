'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function Meters() {
  const [meters, setMeters] = useState([])
  const [search, setSearch] =
    useState('')
  const [statusFilter, setStatusFilter] =
    useState('ALL')

  useEffect(() => {
    fetchMeters()
  }, [])

  async function fetchMeters() {
    const { data, error } = await supabase
      .from('Meters')
      .select('*')
      .order('id', { ascending: true })

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

  function getNextProveDate(meter) {
    const lastProve = new Date(
      meter.last_prove_date
    )

    lastProve.setDate(
      lastProve.getDate() +
        meter.time_interval_days
    )

    return lastProve.toLocaleDateString()
  }

  async function logProve(meter) {
    const today = new Date()
      .toISOString()
      .split('T')[0]

    const { error } = await supabase
      .from('Meters')
      .update({
        last_prove_date: today,
      })
      .eq('id', meter.id)

    if (error) {
      return
    }

    await supabase
      .from('ProveHistory')
      .insert([
        {
          meter_name: meter.name,
          location: meter.location,
          prove_date: today,
        },
      ])

    await fetchMeters()
  }

  async function deleteMeter(id) {
    const confirmed = confirm(
      'Delete this meter?'
    )

    if (!confirmed) {
      return
    }

    const { error } = await supabase
      .from('Meters')
      .delete()
      .eq('id', id)

    if (error) {
      alert(error.message)
    } else {
      fetchMeters()
    }
  }

  const filteredMeters = meters.filter(
    meter => {
      const matchesSearch =
        meter.name
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )

      const status = getStatus(meter)

      const matchesStatus =
        statusFilter === 'ALL' ||
        status === statusFilter

      return (
        matchesSearch &&
        matchesStatus
      )
    }
  )

  return (
    <div style={{ padding: '20px' }}>
      <h1>ProveOps - Meters</h1>

      <div
        style={{
          marginTop: '20px',
          marginBottom: '20px',
          display: 'flex',
          gap: '20px',
        }}
      >
        <input
          placeholder="Search meters..."
          value={search}
          onChange={e =>
            setSearch(e.target.value)
          }
          style={{
            padding: '10px',
            width: '250px',
          }}
        />

        <select
          value={statusFilter}
          onChange={e =>
            setStatusFilter(
              e.target.value
            )
          }
          style={{
            padding: '10px',
          }}
        >
          <option value="ALL">
            All Statuses
          </option>

          <option value="OK">
            OK
          </option>

          <option value="DUE">
            DUE
          </option>
        </select>
      </div>

      <table
        style={{
          borderCollapse: 'collapse',
          width: '100%',
        }}
      >
        <thead>
          <tr>
            <th style={{
              border: '1px solid black',
              padding: '10px',
            }}>
              Name
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
              Status
            </th>

            <th style={{
              border: '1px solid black',
              padding: '10px',
            }}>
              Next Prove Date
            </th>

            <th style={{
              border: '1px solid black',
              padding: '10px',
            }}>
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {filteredMeters.map(m => (
            <tr key={m.id}>
              <td style={{
                border: '1px solid black',
                padding: '10px',
              }}>
                {m.name}
              </td>

              <td style={{
                border: '1px solid black',
                padding: '10px',
              }}>
                {m.location}
              </td>

              <td style={{
                border: '1px solid black',
                padding: '10px',
              }}>
                <span style={{
                  color:
                    getStatus(m) === 'DUE'
                      ? 'red'
                      : 'green',
                  fontWeight: 'bold',
                }}>
                  {getStatus(m)}
                </span>
              </td>

              <td style={{
                border: '1px solid black',
                padding: '10px',
              }}>
                {getNextProveDate(m)}
              </td>

              <td style={{
                border: '1px solid black',
                padding: '10px',
              }}>
                <a
                  href={`/edit-meter/${m.id}`}
                >
                  <button
                    style={{
                      marginRight: '10px',
                    }}
                  >
                    Edit
                  </button>
                </a>

                <button
                  onClick={() =>
                    logProve(m)
                  }
                >
                  Log Prove
                </button>

                <button
                  onClick={() =>
                    deleteMeter(m.id)
                  }
                  style={{
                    marginLeft: '10px',
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}