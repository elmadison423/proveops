'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

import { supabase } from '../../lib/supabase'
import ProtectedRoute from '../../components/ProtectedRoute'
import { useOrganization } from '../../context/OrganizationContext'

export default function AddMeter() {

  const router = useRouter()

  const {
    organization,
    loading: organizationLoading,
  } = useOrganization()

  const [technicians, setTechnicians] = useState([])

  const [form, setForm] = useState({

    meterIdTag: '',
    federalId: '',
    name: '',

    meterMake: '',
    meterModel: '',
    meterType: '',

    serialNumber: '',

    location: '',
    latitude: '',
    longitude: '',

    lastProveDate: '',

    provingMethod: 'TIME',

    timeIntervalDays: 30,

    volumeInterval: '',
    currentVolume: '',
    lastProveVolume: '',

    technicianId: '',

  })

  useEffect(() => {

    if (organizationLoading) return

    if (!organization) return

    loadTechnicians()

  }, [organizationLoading, organization])

  async function loadTechnicians() {

    const { data, error } =
      await supabase
        .from('Technicians')
        .select('*')
        .eq(
          'organization_id',
          organization.id
        )
        .order('name')

    if (error) {

      console.error(error)

      toast.error(
        'Unable to load technicians.'
      )

      return

    }

    setTechnicians(data || [])

  }

  function updateField(
    field,
    value
  ) {

    setForm(prev => ({

      ...prev,

      [field]: value,

    }))

  }

  function handleEnterKey(e) {

    if (e.key !== 'Enter') return

    e.preventDefault()

    const formElement =
      e.target.form

    const index =
      Array.prototype.indexOf.call(
        formElement,
        e.target
      )

    formElement.elements[
      index + 1
    ]?.focus()

  }

  function calculateNextDueDate() {

    if (
      !form.lastProveDate ||
      !form.timeIntervalDays
    ) {

      return null

    }

    const due =
      new Date(form.lastProveDate)

    due.setDate(

      due.getDate() +

      Number(
        form.timeIntervalDays
      )

    )

    return due
      .toISOString()
      .split('T')[0]

  }

  function calculateVolumeThreshold() {

    if (

      form.lastProveVolume === '' ||

      form.volumeInterval === ''

    ) {

      return null

    }

    return (

      Number(form.lastProveVolume) +

      Number(form.volumeInterval)

    )

  }

  async function saveMeter() {

    if (

      organizationLoading

    ) {

      toast.error(
        'Please wait...'
      )

      return

    }

    if (!organization) {

      toast.error(
        'Organization not found.'
      )

      return

    }

    if (

      !form.meterIdTag ||

      !form.name ||

      !form.location ||

      !form.provingMethod

    ) {

      toast.error(

        'Please complete all required fields.'

      )

      return

    }

    const meter = {

      organization_id:
        organization.id,

      meter_id_tag:
        form.meterIdTag,

      federal_id:
        form.federalId,

      name:
        form.name,

      meter_make:
        form.meterMake,

      meter_model:
        form.meterModel,

      meter_type:
        form.meterType,

      serial_number:
        form.serialNumber,

      location:
        form.location,

      latitude:

        form.latitude

          ? Number(form.latitude)

          : null,

      longitude:

        form.longitude

          ? Number(form.longitude)

          : null,

      last_prove_date:
        form.lastProveDate,

      next_due_date:
        calculateNextDueDate(),

      proving_method:
        form.provingMethod,

      time_interval_days:
        Number(
          form.timeIntervalDays
        ),

      volume_interval:

        form.volumeInterval

          ? Number(
              form.volumeInterval
            )

          : null,

      current_volume:

        form.currentVolume

          ? Number(
              form.currentVolume
            )

          : 0,

      last_prove_volume:

        form.lastProveVolume

          ? Number(
              form.lastProveVolume
            )

          : 0,

      volume_threshold:
        calculateVolumeThreshold(),

      technician_id:

        form.technicianId

          ? Number(
              form.technicianId
            )

          : null,

    }

    const { error } =

      await supabase

        .from('meters')

        .insert([meter])

    if (error) {

      console.error(error)

      toast.error(
        'Unable to save meter.'
      )

      return

    }

    toast.success(
      'Meter added successfully.'
    )

    router.push('/meters')

  }

    return (

    <ProtectedRoute
  allowedRoles={[
    "Organization Admin",
    "Technician",
  ]}
>

      <div className="container">

        <h1>Add Meter</h1>

        <form>

{/* ===========================
   BASIC INFORMATION
=========================== */}

<div>

<label>Meter ID *</label>

<input

value={form.meterIdTag}

onChange={e=>updateField(
'meterIdTag',
e.target.value
)}

onKeyDown={handleEnterKey}

/>

</div>

<div>

<label>Federal ID</label>

<input

value={form.federalId}

onChange={e=>updateField(
'federalId',
e.target.value
)}

onKeyDown={handleEnterKey}

/>

</div>

<div>

<label>Meter Name *</label>

<input

value={form.name}

onChange={e=>updateField(
'name',
e.target.value
)}

onKeyDown={handleEnterKey}

/>

</div>

<div>

<label>Meter Make</label>

<input

value={form.meterMake}

onChange={e=>updateField(
'meterMake',
e.target.value
)}

onKeyDown={handleEnterKey}

/>

</div>

<div>

<label>Meter Model</label>

<input

value={form.meterModel}

onChange={e=>updateField(
'meterModel',
e.target.value
)}

onKeyDown={handleEnterKey}

/>

</div>

<div>

<label>Meter Type</label>

<select

value={form.meterType}

onChange={e=>updateField(
'meterType',
e.target.value
)}

onKeyDown={handleEnterKey}

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

<label>Serial Number</label>

<input

value={form.serialNumber}

onChange={e=>updateField(
'serialNumber',
e.target.value
)}

onKeyDown={handleEnterKey}

/>

</div>

<div>

<label>Location *</label>

<input

value={form.location}

onChange={e=>updateField(
'location',
e.target.value
)}

onKeyDown={handleEnterKey}

/>

</div>

<div>

<label>Latitude</label>

<input

type="number"

value={form.latitude}

onChange={e=>updateField(
'latitude',
e.target.value
)}

onKeyDown={handleEnterKey}

/>

</div>

<div>

<label>Longitude</label>

<input

type="number"

value={form.longitude}

onChange={e=>updateField(
'longitude',
e.target.value
)}

onKeyDown={handleEnterKey}

/>

</div>

<div>

<label>Last Prove Date</label>

<input

type="date"

value={form.lastProveDate}

onChange={e=>updateField(
'lastProveDate',
e.target.value
)}

onKeyDown={handleEnterKey}

/>

</div>

<div>

<label>Proving Method *</label>

<select

value={form.provingMethod}

onChange={e=>updateField(
'provingMethod',
e.target.value
)}

onKeyDown={handleEnterKey}

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

Time Interval (Days)

</label>

<input

type="number"

value={form.timeIntervalDays}

onChange={e =>
updateField(
'timeIntervalDays',
e.target.value
)}

onKeyDown={handleEnterKey}

/>

</div>

<div>

<label>

Volume Interval

</label>

<input

type="number"

value={form.volumeInterval}

onChange={e =>
updateField(
'volumeInterval',
e.target.value
)}

onKeyDown={handleEnterKey}

/>

</div>

<div>

<label>

Current Volume

</label>

<input

type="number"

value={form.currentVolume}

onChange={e =>
updateField(
'currentVolume',
e.target.value
)}

onKeyDown={handleEnterKey}

/>

</div>

<div>

<label>

Last Prove Volume

</label>

<input

type="number"

value={form.lastProveVolume}

onChange={e =>
updateField(
'lastProveVolume',
e.target.value
)}

onKeyDown={handleEnterKey}

/>

</div>

<div>

<label>

Assigned Technician

</label>

<select

value={form.technicianId}

onChange={e =>
updateField(
'technicianId',
e.target.value
)}

onKeyDown={handleEnterKey}

>

<option value="">

Select Technician

</option>

{technicians.map(tech => (

<option

key={tech.id}

value={tech.id}

>

{tech.name}

</option>

))}

</select>

</div>

<br />

<button

type="button"

onClick={saveMeter}

>

Save Meter

</button>

</form>

</div>

</ProtectedRoute>

)

}