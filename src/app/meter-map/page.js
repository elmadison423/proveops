'use client'

import {
  useEffect,
  useState,
} from 'react'

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from 'react-leaflet'

import 'leaflet/dist/leaflet.css'

import { supabase }
from '../../lib/supabase'

import ProtectedRoute
from '../../components/ProtectedRoute'

export default function MeterMap() {

  const [meters, setMeters] =
    useState([])

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

    return today >= nextProve
      ? 'DUE'
      : 'OK'
  }

  return (

    <ProtectedRoute>

      <div
        style={{
          height: '100vh',
          width: '100%',
        }}
      >

        <MapContainer
          center={[

            32.3182,

            -102.5457,
          ]}
          zoom={8}
          style={{
            height: '100%',
            width: '100%',
          }}
        >

          <TileLayer
            attribution='&copy; OpenStreetMap'
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          />

          {
            meters.map(
              meter => {

                if (
                  !meter.latitude ||
                  !meter.longitude
                ) {

                  return null
                }

                return (

                  <Marker
                    key={meter.id}
                    position={[
                      meter.latitude,
                      meter.longitude,
                    ]}
                  >

                    <Popup>

                      <strong>
                        {meter.name}
                      </strong>

                      <br />

                      {
                        meter.location
                      }

                      <br />

                      Status:

                      {' '}

                      {
                        getStatus(
                          meter
                        )
                      }

                    </Popup>

                  </Marker>
                )
              }
            )
          }

        </MapContainer>

      </div>

    </ProtectedRoute>
  )
}