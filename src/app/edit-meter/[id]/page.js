'use client'

import {
  useEffect,
  useState,
} from 'react'

import {
  useParams,
  useRouter,
} from 'next/navigation'

import { supabase }
from '../../../lib/supabase'

import ProtectedRoute
from '../../../components/ProtectedRoute'

export default function EditMeter() {

  const params =
    useParams()

  const router =
    useRouter()

  const meterId =
    params.id

  const [name, setName] =
    useState('')

  const [
    meterIdTag,
    setMeterIdTag,
  ] = useState('')

  const [
    federalId,
    setFederalId,
  ] = useState('')

  const [
    meterMake,
    setMeterMake,
  ] = useState('')

  const [
    meterModel,
    setMeterModel,
  ] = useState('')

  const [
    meterType,
    setMeterType,
  ] = useState('')

  const [
    serialNumber,
    setSerialNumber,
  ] = useState('')

  const [
    location,
    setLocation,
  ] = useState('')

  const [
    latitude,
    setLatitude,
  ] = useState('')

  const [
    longitude,
    setLongitude,
  ] = useState('')

  const [
    lastProveDate,
    setLastProveDate,
  ] = useState('')

  const [
    timeIntervalDays,
    setTimeIntervalDays,
  ] = useState('')

  const [
    provingMethod,
    setProvingMethod,
  ] = useState('TIME')

  const [
    volumeInterval,
    setVolumeInterval,
  ] = useState('')

  const [
    currentVolume,
    setCurrentVolume,
  ] = useState('')

  const [
    lastProveVolume,
    setLastProveVolume,
  ] = useState('')

  const [
    technicians,
    setTechnicians,
  ] = useState([])

  const [
    technicianId,
    setTechnicianId,
  ] = useState('')

  useEffect(() => {

    fetchMeter()

    fetchTechnicians()

  }, [])

  function handleEnterKey(
    e
  ) {

    if (
      e.key === 'Enter'
    ) {

      e.preventDefault()

      const form =
        e.target.form

      const index =
        Array.prototype.indexOf.call(
          form,
          e.target
        )

      form.elements[
        index + 1
      ]?.focus()
    }
  }

  async function fetchMeter() {

    const {
      data,
    } = await supabase
      .from('Meters')
      .select('*')
      .eq(
        'id',
        meterId
      )
      .single()

    if (!data) return

    setName(data.name || '')

    setMeterIdTag(
      data.meter_id_tag || ''
    )

    setFederalId(
      data.federal_id || ''
    )

    setMeterMake(
      data.meter_make || ''
    )

    setMeterModel(
      data.meter_model || ''
    )

    setMeterType(
      data.meter_type || ''
    )

    setSerialNumber(
      data.serial_number || ''
    )

    setLocation(
      data.location || ''
    )

    setLatitude(
      data.latitude || ''
    )

    setLongitude(
      data.longitude || ''
    )

    setLastProveDate(
      data.last_prove_date || ''
    )

    setTimeIntervalDays(
      data.time_interval_days || ''
    )

    setProvingMethod(
      data.proving_method || 'TIME'
    )

    setVolumeInterval(
      data.volume_interval || ''
    )

    setCurrentVolume(
      data.current_volume || ''
    )

    setLastProveVolume(
      data.last_prove_volume || ''
    )

    setTechnicianId(
      data.technician_id || ''
    )
  }

  async function fetchTechnicians() {

    const {
      data,
    } = await supabase
      .from('Technicians')
      .select('*')

    setTechnicians(
      data || []
    )
  }

  async function updateMeter() {

    const { error } =
      await supabase
        .from('Meters')
        .update({

          name,

          meter_id_tag:
            meterIdTag,

          federal_id:
            federalId,

          meter_make:
            meterMake,

          meter_model:
            meterModel,

          meter_type:
            meterType,

          serial_number:
            serialNumber,

          location,

          latitude:
            latitude
              ? Number(latitude)
              : null,

          longitude:
            longitude
              ? Number(longitude)
              : null,

          last_prove_date:
            lastProveDate,

          time_interval_days:
            Number(
              timeIntervalDays
            ),

          proving_method:
            provingMethod,

          volume_interval:
            volumeInterval
              ? Number(
                  volumeInterval
                )
              : null,

          current_volume:
            currentVolume
              ? Number(
                  currentVolume
                )
              : 0,

          last_prove_volume:
            lastProveVolume
              ? Number(
                  lastProveVolume
                )
              : 0,

          technician_id:
            technicianId
              ? Number(
                  technicianId
                )
              : null,
        })

        .eq(
          'id',
          meterId
        )

    if (error) {

      console.log(error)

      alert(
        'Error updating meter'
      )

    } else {

      alert(
        'Meter updated successfully'
      )

      router.push('/meters')
    }
  }

  return (

    <ProtectedRoute>

      <div className="container">

        <h1>
          Edit Meter
        </h1>

        <form>

          <div>

            <label>
              Meter ID
            </label>

            <input
              value={meterIdTag}
              onChange={(e) =>
                setMeterIdTag(
                  e.target.value
                )
              }
              onKeyDown={
                handleEnterKey
              }
            />

          </div>

          <div>

            <label>
              Federal ID
            </label>

            <input
              value={federalId}
              onChange={(e) =>
                setFederalId(
                  e.target.value
                )
              }
              onKeyDown={
                handleEnterKey
              }
            />

          </div>

          <div>

            <label>
              Meter Name
            </label>

            <input
              value={name}
              onChange={(e) =>
                setName(
                  e.target.value
                )
              }
              onKeyDown={
                handleEnterKey
              }
            />

          </div>

          <div>

            <label>
              Meter Make
            </label>

            <input
              value={meterMake}
              onChange={(e) =>
                setMeterMake(
                  e.target.value
                )
              }
              onKeyDown={
                handleEnterKey
              }
            />

          </div>

          <div>

            <label>
              Meter Model
            </label>

            <input
              value={meterModel}
              onChange={(e) =>
                setMeterModel(
                  e.target.value
                )
              }
              onKeyDown={
                handleEnterKey
              }
            />

          </div>

          <div>

            <label>
              Meter Type
            </label>

            <select
              value={meterType}
              onChange={(e) =>
                setMeterType(
                  e.target.value
                )
              }
              onKeyDown={
                handleEnterKey
              }
            >

              <option value="">
                Select Type
              </option>

              <option value="Positive Displacement">
                Positive Displacement
              </option>

              <option value="Coriolis">
                Coriolis
              </option>

              <option value="Turbine">
                Turbine
              </option>

            </select>

          </div>

          <div>

            <label>
              Serial Number
            </label>

            <input
              value={serialNumber}
              onChange={(e) =>
                setSerialNumber(
                  e.target.value
                )
              }
              onKeyDown={
                handleEnterKey
              }
            />

          </div>

          <div>

            <label>
              Location
            </label>

            <input
              value={location}
              onChange={(e) =>
                setLocation(
                  e.target.value
                )
              }
              onKeyDown={
                handleEnterKey
              }
            />

          </div>

          <div>

            <label>
              Latitude
            </label>

            <input
              type="number"
              value={latitude}
              onChange={(e) =>
                setLatitude(
                  e.target.value
                )
              }
              onKeyDown={
                handleEnterKey
              }
            />

          </div>

          <div>

            <label>
              Longitude
            </label>

            <input
              type="number"
              value={longitude}
              onChange={(e) =>
                setLongitude(
                  e.target.value
                )
              }
              onKeyDown={
                handleEnterKey
              }
            />

          </div>

          <div>

            <label>
              Last Prove Date
            </label>

            <input
              type="date"
              value={lastProveDate}
              onChange={(e) =>
                setLastProveDate(
                  e.target.value
                )
              }
              onKeyDown={
                handleEnterKey
              }
            />

          </div>

          <div>

            <label>
              Proving Method
            </label>

            <select
              value={provingMethod}
              onChange={(e) =>
                setProvingMethod(
                  e.target.value
                )
              }
              onKeyDown={
                handleEnterKey
              }
            >

              <option value="TIME">
                Time
              </option>

              <option value="VOLUME">
                Volume
              </option>

              <option value="WHICHEVER_COMES_FIRST">
                Whichever Comes First
              </option>

            </select>

          </div>

          <div>

            <label>
              Time Interval
              (Days)
            </label>

            <input
              type="number"
              value={timeIntervalDays}
              onChange={(e) =>
                setTimeIntervalDays(
                  e.target.value
                )
              }
              onKeyDown={
                handleEnterKey
              }
            />

          </div>

          <div>

            <label>
              Volume Interval
            </label>

            <input
              type="number"
              value={volumeInterval}
              onChange={(e) =>
                setVolumeInterval(
                  e.target.value
                )
              }
              onKeyDown={
                handleEnterKey
              }
            />

          </div>

          <div>

            <label>
              Current Volume
            </label>

            <input
              type="number"
              value={currentVolume}
              onChange={(e) =>
                setCurrentVolume(
                  e.target.value
                )
              }
              onKeyDown={
                handleEnterKey
              }
            />

          </div>

          <div>

            <label>
              Last Prove Volume
            </label>

            <input
              type="number"
              value={lastProveVolume}
              onChange={(e) =>
                setLastProveVolume(
                  e.target.value
                )
              }
              onKeyDown={
                handleEnterKey
              }
            />

          </div>

          <div>

            <label>
              Assigned Technician
            </label>

            <select
              value={technicianId}
              onChange={(e) =>
                setTechnicianId(
                  e.target.value
                )
              }
              onKeyDown={
                handleEnterKey
              }
            >

              <option value="">
                Select Technician
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

          </div>

          <button
            type="button"
            onClick={updateMeter}
          >

            Update Meter

          </button>

        </form>

      </div>

    </ProtectedRoute>
  )
}