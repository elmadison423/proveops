'use client'

import {
  useEffect,
  useState,
} from 'react'

import Link from 'next/link'

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
    } = await supabase
      .from('Meters')
      .select('*')
      .eq(
        'organization_id',
        profile.organization_id
      )

    setMeters(data || [])
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

    const timeDue =
      today >= nextProve

    const volumeUsed =

      (meter.current_volume || 0)

      -

      (meter.last_prove_volume || 0)

    const volumeDue =

      volumeUsed >=
      (meter.volume_interval || 0)

    if (
      meter.proving_method
      === 'TIME'
    ) {

      return timeDue
        ? 'DUE'
        : 'OK'
    }

    if (
      meter.proving_method
      === 'VOLUME'
    ) {

      return volumeDue
        ? 'DUE'
        : 'OK'
    }

    if (
      meter.proving_method
      === 'WHICHEVER_COMES_FIRST'
    ) {

      return (
        timeDue ||
        volumeDue
      )
        ? 'DUE'
        : 'OK'
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

    await supabase
      .from('Meters')
      .update({

        last_prove_date:
          today,

        last_prove_volume:
          meter.current_volume,
      })
      .eq(
        'id',
        meter.id
      )

    alert(
      'Prove logged successfully'
    )

    fetchMeters()
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

    await supabase
      .from('Meters')
      .delete()
      .eq('id', id)

    fetchMeters()
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

        <div className="table-wrapper">

          <table>

            <thead>

              <tr>
<th>
  Meter ID
</th>
                <th>Name</th>

                <th>Location</th>

                <th>Status</th>

                <th>
                  Volume Used
                </th>

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

  {
    m.meter_id_tag
  }

</td>
                      <td>

  <Link
    href={`/meter-detail?meter=${m.id}`}
  >

    {m.name}

  </Link>

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

                          (m.current_volume || 0)

                          -

                          (m.last_prove_volume || 0)

                        }

                      </td>

                      <td>

                        {
                          getNextProveDate(m)
                        }

                      </td>

                      <td>

                        <Link
                          href={`/edit-meter/${m.id}`}
                        >

                          <button
                            type="button"
                          >

                            Edit

                          </button>

                        </Link>

                        <Link
  href={`/log-prove?meter=${m.id}`}
>

  <button
    type="button"
  >

    Log Prove

  </button>

</Link>

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

      </div>

    </ProtectedRoute>
  )
}