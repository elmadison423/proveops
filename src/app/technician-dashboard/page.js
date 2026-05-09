'use client'

import {
  useEffect,
  useState,
} from 'react'

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

  function getStatus(meter) {

    const today =
      new Date()

    const nextProve =
      getNextProveDate(
        meter
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

  function isDueThisWeek(
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

    return (
      nextProve >= today
      &&
      nextProve <= nextWeek
    )
  }

  return (

    <ProtectedRoute>

      <div className="container">

        <h1>
          Technician Dashboard
        </h1>

        <div className="cards">

          {
            technicians.map(
              tech => {

                const assignedMeters =
                  meters.filter(

                    meter =>

                      meter.technician_id
                      === tech.id
                  )

                const dueMeters =
                  assignedMeters.filter(

                    meter =>

                      getStatus(
                        meter
                      )
                      === 'DUE'
                  )

                const weekMeters =
                  assignedMeters.filter(

                    meter =>

                      isDueThisWeek(
                        meter
                      )
                  )

                return (

                  <div
                    key={tech.id}
                    className="card"
                    style={{
                      minWidth:
                        '400px',
                    }}
                  >

                    <h2>
                      {tech.name}
                    </h2>

                    <br />

                    <p>

                      Assigned Meters:

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
                          dueMeters.length
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
                          weekMeters.length
                        }

                      </strong>

                    </p>

                    <br />

                    <h3>
                      Priority Work
                    </h3>

                    <br />

                    {
                      weekMeters
                        .length === 0
                      ? (
                        <p>
                          No upcoming work
                        </p>
                      )
                      : (
                        weekMeters.map(
                          meter => (

                            <div
                              key={
                                meter.id
                              }
                              style={{
                                marginBottom:
                                  '10px',
                                padding:
                                  '10px',
                                border:
                                  '1px solid #ddd',
                                borderRadius:
                                  '6px',
                              }}
                            >

                              <strong>
                                {meter.name}
                              </strong>

                              <br />

                              {
                                meter.location
                              }

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