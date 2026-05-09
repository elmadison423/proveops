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

                return (

                  <div
                    key={tech.id}
                    className="card"
                    style={{
                      minWidth:
                        '350px',
                    }}
                  >

                    <h2>
                      {tech.name}
                    </h2>

                    <p>

                      Assigned Meters:

                      {' '}

                      {
                        assignedMeters.length
                      }

                    </p>

                    <p>

                      Due Meters:

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

                    <br />

                    <h3>
                      Assigned Meter List
                    </h3>

                    <br />

                    {
                      assignedMeters
                        .length === 0
                      ? (
                        <p>
                          No assigned meters
                        </p>
                      )
                      : (
                        assignedMeters.map(
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

                              {meter.location}

                              <br />

                              Status:

                              {' '}

                              <span
                                style={{
                                  color:
                                    getStatus(
                                      meter
                                    )
                                    === 'DUE'
                                      ? 'red'
                                      : 'green',

                                  fontWeight:
                                    'bold',
                                }}
                              >

                                {
                                  getStatus(
                                    meter
                                  )
                                }

                              </span>

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