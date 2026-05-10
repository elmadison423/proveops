'use client'

import {
  useEffect,
  useState,
} from 'react'

import Link from 'next/link'

import { supabase }
from '../../lib/supabase'

import ProtectedRoute
from '../../components/ProtectedRoute'

export default function TechnicianDashboard() {

  const [
    technicians,
    setTechnicians,
  ] = useState([])

  const [meters, setMeters] =
    useState([])

  const [search, setSearch] =
    useState('')

  useEffect(() => {

    fetchData()

  }, [])

  async function fetchData() {

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
      data: techs,
    } = await supabase
      .from('Technicians')
      .select('*')
      .eq(
        'organization_id',
        profile.organization_id
      )

    const {
      data: meterData,
    } = await supabase
      .from('Meters')
      .select('*')
      .eq(
        'organization_id',
        profile.organization_id
      )

    setTechnicians(
      techs || []
    )

    setMeters(
      meterData || []
    )
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
  }

  function getPriority(
    meter
  ) {

    const today =
      new Date()

    const nextWeek =
      new Date()

    nextWeek.setDate(
      today.getDate() + 7
    )

    const nextProve =
      getNextProveDate(
        meter
      )

    const volumeUsed =

      (meter.current_volume || 0)

      -

      (meter.last_prove_volume || 0)

    const volumeDue =

      volumeUsed >=
      (meter.volume_interval || 0)

    if (
      nextProve < today ||
      volumeDue
    ) {

      return 'OVERDUE'
    }

    if (
      nextProve <= nextWeek
    ) {

      return 'DUE_THIS_WEEK'
    }

    return 'UPCOMING'
  }

  return (

    <ProtectedRoute>

      <div className="container">

        <h1>
          Technician Dashboard
        </h1>

        <input
          placeholder="Search technicians..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
        />

        <br />
        <br />

        <div className="cards">

          {
            technicians

              .filter(tech =>

                tech.name
                  ?.toLowerCase()
                  .includes(
                    search.toLowerCase()
                  )

                ||

                tech.role
                  ?.toLowerCase()
                  .includes(
                    search.toLowerCase()
                  )
              )

              .map(
                tech => {

                  const assignedMeters =
                    meters.filter(

                      meter =>

                        meter.technician_id
                        === tech.id
                    )

                  const overdue =
                    assignedMeters.filter(

                      meter =>

                        getPriority(
                          meter
                        )
                        === 'OVERDUE'
                    )

                  const dueThisWeek =
                    assignedMeters.filter(

                      meter =>

                        getPriority(
                          meter
                        )
                        === 'DUE_THIS_WEEK'
                    )

                  return (

                    <div
                      key={tech.id}
                      className="card"
                      style={{
                        minWidth:
                          '420px',
                      }}
                    >

                      <h2>
                        {tech.name}
                      </h2>

                      <p>

                        <strong>
                          Role:
                        </strong>

                        {' '}

                        {
                          tech.role || 'N/A'
                        }

                      </p>

                      <br />

                      <Link
                        href={`/edit-technician/${tech.id}`}
                      >

                        <button
                          type="button"
                        >

                          Edit Tech

                        </button>

                      </Link>

                      <br />
                      <br />

                      <p>

                        Assigned:

                        {' '}

                        {
                          assignedMeters.length
                        }

                      </p>

                      <p>

                        Overdue:

                        {' '}

                        <strong
                          style={{
                            color:
                              'red',
                          }}
                        >

                          {
                            overdue.length
                          }

                        </strong>

                      </p>

                      <p>

                        Due This Week:

                        {' '}

                        <strong
                          style={{
                            color:
                              'orange',
                          }}
                        >

                          {
                            dueThisWeek.length
                          }

                        </strong>

                      </p>

                      <br />

                      <h3>
                        Priority Work
                      </h3>

                      <br />

                      {
                        assignedMeters
                          .length === 0
                        ? (
                          <p>
                            No assigned work
                          </p>
                        )
                        : (
                          assignedMeters.map(
                            meter => {

                              const priority =
                                getPriority(
                                  meter
                                )

                              return (

                                <div
                                  key={
                                    meter.id
                                  }
                                  style={{
                                    marginBottom:
                                      '12px',

                                    padding:
                                      '12px',

                                    border:
                                      '1px solid #ddd',

                                    borderRadius:
                                      '8px',

                                    background:
                                      priority
                                      === 'OVERDUE'
                                        ? '#ffe5e5'
                                        : priority
                                        === 'DUE_THIS_WEEK'
                                          ? '#fff4e5'
                                          : '#f4f4f4',
                                  }}
                                >

                                  <strong>

                                    {
                                      meter.meter_id_tag
                                    }

                                  </strong>

                                  <br />

                                  {
                                    meter.name
                                  }

                                  <br />

                                  {
                                    meter.location
                                  }

                                  <br />

                                  Priority:

                                  {' '}

                                  <strong>

                                    {priority}

                                  </strong>

                                  <br />

                                  Due:

                                  {' '}

                                  {
                                    getNextProveDate(
                                      meter
                                    )
                                    .toLocaleDateString()
                                  }

                                </div>
                              )
                            }
                          )
                        )
                      }

                    </div>
                  )
                }
              )
          }

        </div>

      </div>

    </ProtectedRoute>
  )
}