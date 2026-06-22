'use client'

import {
  useEffect,
  useState,
} from 'react'

import L from 'leaflet'

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

const redIcon = new L.Icon({

  iconUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',

  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',

  iconSize: [25, 41],

  iconAnchor: [12, 41],
})

const yellowIcon = new L.Icon({

  iconUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-yellow.png',

  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',

  iconSize: [25, 41],

  iconAnchor: [12, 41],
})

const greenIcon = new L.Icon({

  iconUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',

  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',

  iconSize: [25, 41],

  iconAnchor: [12, 41],
})

export default function MapComponent() {

  const [meters, setMeters] =
    useState([])

  const [
    technicians,
    setTechnicians,
  ] = useState([])

  const [
    technicianFilter,
    setTechnicianFilter,
  ] = useState('ALL')

  const [
    statusFilter,
    setStatusFilter,
  ] = useState('ALL')

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

  function getMapIcon(
    meter
  ) {

    const status =
      getStatus(meter)

    const nextProve =
      getNextProveDate(
        meter
      )

    const today =
      new Date()

    const nextWeek =
      new Date()

    nextWeek.setDate(
      today.getDate() + 7
    )

    if (
      status === 'DUE'
    ) {

      return redIcon
    }

    if (
      nextProve <= nextWeek
    ) {

      return yellowIcon
    }

    return greenIcon
  }

  const filteredMeters =
    meters.filter(meter => {

      const technicianMatch =

        technicianFilter === 'ALL'

        ||

        String(
          meter.technician_id
        ) === technicianFilter

      const statusMatch =

        statusFilter === 'ALL'

        ||

        getStatus(meter)
        === statusFilter

      return (
        technicianMatch
        &&
        statusMatch
      )
    })

  return (

    <ProtectedRoute>

      <div className="container">

        <h1>
          Meter Map
        </h1>

        <div
          className="card"
          style={{
            marginBottom:
              '20px',
          }}
        >

          <select
            value={
              technicianFilter
            }
            onChange={(e) =>
              setTechnicianFilter(
                e.target.value
              )
            }
          >

            <option value="ALL">
              All Technicians
            </option>

            {
              technicians.map(
                tech => (

                  <option
                    key={tech.id}
                    value={tech.id}
                  >

                    {tech.name}

                  </option>

                )
              )
            }

          </select>

          <select
            value={
              statusFilter
            }
            onChange={(e) =>
              setStatusFilter(
                e.target.value
              )
            }
          >

            <option value="ALL">
              All Statuses
            </option>

            <option value="DUE">
              Due
            </option>

            <option value="OK">
              OK
            </option>

          </select>

        </div>

        <MapContainer
          center={[
            32.3182,
            -102.5457,
          ]}
          zoom={8}
          style={{
            height: '75vh',
            width: '100%',
            borderRadius: '18px',
          }}
        >

          <TileLayer
            attribution='&copy; OpenStreetMap'
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          />

          {
            filteredMeters.map(
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
                    icon={getMapIcon(meter)}
                  >

                    <Popup>

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

                      Status:

                      {' '}

                      {
                        getStatus(
                          meter
                        )
                      }

                      <br />
                      <br />

                      <a
                        href={

                          `https://www.google.com/maps/dir/?api=1&destination=${meter.latitude},${meter.longitude}`

                        }
                        target="_blank"
                        rel="noreferrer"
                      >

                        Navigate

                      </a>

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