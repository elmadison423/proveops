'use client'

import {
  useEffect,
  useState,
} from 'react'

import { supabase }
from '../../lib/supabase'

import ProtectedRoute
from '../../components/ProtectedRoute'

export default function DispatchBoard() {

  const [meters, setMeters] =
    useState([])

  const [
    technicians,
    setTechnicians,
  ] = useState([])

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
      data: meterData,
    } = await supabase
      .from('Meters')
      .select('*')
      .eq(
        'organization_id',
        profile.organization_id
      )

    const {
      data: techData,
    } = await supabase
      .from('Technicians')
      .select('*')
      .eq(
        'organization_id',
        profile.organization_id
      )

    setMeters(
      meterData || []
    )

    setTechnicians(
      techData || []
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

  function getTechnicianName(
    technicianId
  ) {

    const technician =
      technicians.find(

        tech =>

          tech.id ===
          technicianId
      )

    return technician
      ? technician.name
      : 'Unassigned'
  }

  const priorityMeters =
    meters.filter(

      meter =>

        getPriority(meter)
        !== 'UPCOMING'
    )

  return (

    <ProtectedRoute>

      <div className="container">

        <h1>
          Dispatch Board
        </h1>

        <br />

        {
          priorityMeters.length === 0
          ? (

            <p>
              No priority work
            </p>

          ) : (

            priorityMeters.map(
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
                          : '#fff4e5',
                    }}
                  >

                    <h2>
                      {meter.name}
                    </h2>

                    <p>
                      {
                        meter.location
                      }
                    </p>

                    <p>

                      Technician:

                      {' '}

                      <strong>

                        {
                          getTechnicianName(
                            meter.technician_id
                          )
                        }

                      </strong>

                    </p>

                    <p>

                      Priority:

                      {' '}

                      <strong>

                        {priority}

                      </strong>

                    </p>

                    <p>

                      Due Date:

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