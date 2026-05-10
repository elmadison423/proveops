'use client'

import {
  useEffect,
  useState,
} from 'react'

import { supabase }
from '../../lib/supabase'

import ProtectedRoute
from '../../components/ProtectedRoute'

export default function TechnicianSchedule() {

  const [meters, setMeters] =
    useState([])

  const [
    technician,
    setTechnician,
  ] = useState(null)

  const [search, setSearch] =
    useState('')

  useEffect(() => {

    fetchSchedule()

  }, [])

  async function fetchSchedule() {

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
      data: tech,
    } = await supabase
      .from('Technicians')
      .select('*')
      .eq(
        'organization_id',
        profile.organization_id
      )
      .limit(1)
      .single()

    setTechnician(tech)

    if (!tech) return

    const {
      data: meterData,
    } = await supabase
      .from('Meters')
      .select('*')
      .eq(
        'technician_id',
        tech.id
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

  const sortedMeters =
    [...meters]

      .filter(meter =>

        meter.name
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          )

        ||

        meter.location
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          )

        ||

        meter.meter_id_tag
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          )
      )

      .sort(
        (a, b) => {

          const priorityOrder = {

            OVERDUE: 1,

            DUE_THIS_WEEK: 2,

            UPCOMING: 3,
          }

          return (

            priorityOrder[
              getPriority(a)
            ]

            -

            priorityOrder[
              getPriority(b)
            ]
          )
        }
      )

  return (

    <ProtectedRoute>

      <div className="container">

        <h1>
          Technician Schedule
        </h1>

        <br />

        <h2>

          {
            technician
              ?.name
          }

        </h2>

        <p>

          <strong>
            Role:
          </strong>

          {' '}

          {
            technician?.role || 'N/A'
          }

        </p>

        <br />

        <input
          placeholder="Search schedule..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
        />

        <br />
        <br />

        {
          sortedMeters.length === 0
          ? (

            <p>
              No assigned work
            </p>

          ) : (

            sortedMeters.map(
              meter => {

                const priority =
                  getPriority(
                    meter
                  )

                return (

                  <div
                    key={meter.id}
                    className="card"
                    style={{
                      marginBottom:
                        '15px',

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

                    <h2>

                      {
                        meter.meter_id_tag
                      }

                    </h2>

                    <p>

                      {
                        meter.name
                      }

                    </p>

                    <p>

                      {
                        meter.location
                      }

                    </p>

                    <p>

                      Priority:

                      {' '}

                      <strong>

                        {priority}

                      </strong>

                    </p>

                    <p>

                      Due:

                      {' '}

                      {
                        getNextProveDate(
                          meter
                        )
                        .toLocaleDateString()
                      }

                    </p>

                  </div>
                )
              }
            )
          )
        }

      </div>

    </ProtectedRoute>
  )
}