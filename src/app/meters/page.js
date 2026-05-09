'use client'

import {
  useEffect,
  useState,
} from 'react'

import jsPDF from 'jspdf'

import { supabase }
from '../../lib/supabase'

import ProtectedRoute
from '../../components/ProtectedRoute'

export default function Meters() {

  const [meters, setMeters] =
    useState([])

  const [search, setSearch] =
    useState('')

  const [
    statusFilter,
    setStatusFilter,
  ] = useState('ALL')

  useEffect(() => {

    fetchMeters()

  }, [])

  async function fetchMeters() {

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

    if (!profile) return

    const {
      data,
      error,
    } = await supabase
      .from('Meters')
      .select('*')
      .eq(
        'organization_id',
        profile.organization_id
      )

    if (!error) {

      setMeters(data || [])
    }
  }

  function getStatus(meter) {

    const today =
      new Date()

    const lastProve =
      new Date(
        meter.last_prove_date
      )

    const nextProve =
      new Date(lastProve)

    nextProve.setDate(
      lastProve.getDate() +
      meter.time_interval_days
    )

    if (
      today >= nextProve
    ) {

      return 'DUE'
    }

    return 'OK'
  }

  function getNextProveDate(
    meter
  ) {

    const lastProve =
      new Date(
        meter.last_prove_date
      )

    lastProve.setDate(
      lastProve.getDate() +
      meter.time_interval_days
    )

    return lastProve
      .toLocaleDateString()
  }

  function generatePDF(
    meter
  ) {

    const doc =
      new jsPDF()

    doc.text(
      'Prove Report',
      20,
      20
    )

    doc.text(
      `Meter: ${meter.name}`,
      20,
      40
    )

    doc.text(
      `Location: ${meter.location}`,
      20,
      50
    )

    doc.save(
      `${meter.name}.pdf`
    )
  }

  async function logProve(
    meter
  ) {

    const today =
      new Date()
        .toISOString()
        .split('T')[0]

    const { error } =
      await supabase
        .from('Meters')
        .update({
          last_prove_date:
            today,
        })
        .eq(
          'id',
          meter.id
        )

    if (!error) {

      alert(
        'Prove logged successfully'
      )

      fetchMeters()
    }
  }

  async function deleteMeter(
    id
  ) {

    const confirmed =
      confirm(
        'Delete this meter?'
      )

    if (!confirmed) {
      return
    }

    const { error } =
      await supabase
        .from('Meters')
        .delete()
        .eq('id', id)

    if (!error) {

      fetchMeters()
    }
  }

  return (

    <ProtectedRoute>

      <div className="container">

        <h1>
          Meters
        </h1>

        <input
          placeholder="Search meters..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
        />

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(
              e.target.value
            )
          }
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

        <table>

          <thead>

            <tr>

              <th>Name</th>

              <th>Location</th>

              <th>Status</th>

              <th>
                Next Prove
              </th>

              <th>
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {
              meters
                .filter(m => {

                  const matchesSearch =
                    m.name
                      .toLowerCase()
                      .includes(
                        search.toLowerCase()
                      )

                  const matchesStatus =
                    statusFilter
                    === 'ALL'
                    ||
                    getStatus(m)
                    === statusFilter

                  return (
                    matchesSearch
                    &&
                    matchesStatus
                  )
                })
                .map(m => (

                  <tr
                    key={m.id}
                  >

                    <td>
                      {m.name}
                    </td>

                    <td>
                      {m.location}
                    </td>

                    <td>

                      <span
                        style={{
                          color:
                            getStatus(m)
                            === 'DUE'
                              ? 'red'
                              : 'green',

                          fontWeight:
                            'bold',
                        }}
                      >

                        {
                          getStatus(m)
                        }

                      </span>

                    </td>

                    <td>

                      {
                        getNextProveDate(m)
                      }

                    </td>

                    <td>

                      <button
                        type="button"
                        onClick={() =>
                          logProve(m)
                        }
                      >

                        Log Prove

                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          generatePDF(m)
                        }
                      >

                        PDF Report

                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          deleteMeter(
                            m.id
                          )
                        }
                      >

                        Delete

                      </button>

                    </td>

                  </tr>

                ))
            }

          </tbody>

        </table>

      </div>

    </ProtectedRoute>
  )
}