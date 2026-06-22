'use client'

import {
  useState,
} from 'react'

import {
  useSearchParams,
  useRouter,
} from 'next/navigation'

import { supabase }
from '../../lib/supabase'

import ProtectedRoute
from '../../components/ProtectedRoute'

import toast from 'react-hot-toast'

export default function LogProve() {

  const router =
    useRouter()

  const searchParams =
    useSearchParams()

  const meterId =
  searchParams.get('id')

  const [
    meterFactor,
    setMeterFactor,
  ] = useState('')

  const [
    proverVolume,
    setProverVolume,
  ] = useState('')

  const [
    flowRate,
    setFlowRate,
  ] = useState('')

  const [
    totalizer,
    setTotalizer,
  ] = useState('')

  const [
    meterTemp,
    setMeterTemp,
  ] = useState('')

  const [
    certifiedTemp,
    setCertifiedTemp,
  ] = useState('')

  const [seals, setSeals] =
    useState('')

  const [notes, setNotes] =
    useState('')

  const [status, setStatus] =
    useState('PASS')

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

 async function saveProve() {
  const user =
    (await supabase.auth.getUser())
      .data.user

  if (!user) return

  const { data: profile } =
    await supabase
      .from('Profiles')
      .select('*')
      .eq('user_id', user.id)
      .single()

  const { data: meter, error: meterError } =
  await supabase
    .from('meters')
    .select('*')
    .eq('id', meterId)
    .single()

console.log('meterId =', meterId)
console.log('meter =', meter)
console.log('meterError =', meterError)

  if (!meter) {
    alert('Meter not found')
    return
  }

  const today = new Date()
    .toISOString()
    .split('T')[0]

  const { error } =
    await supabase
      .from('ProveHistory')
      .insert([
        {
          meter_id: meter.id,

          meter_name: meter.name,

          location: meter.location,

          technician_id: null,

          prove_date: today,

          meter_factor:
            Number(meterFactor),

          prover_volume:
            Number(proverVolume),

          flow_rate:
            Number(flowRate),

          totalizer:
            Number(totalizer),

          meter_temp:
            Number(meterTemp),

          certified_temp:
            Number(certifiedTemp),

          seals,

          notes,

          status,

          organization_id:
            profile.organization_id,
        },
      ])

  if (error) {
    console.log(error)
    alert('Error saving prove')
    return
  }

  const nextDueDate = new Date(today)

nextDueDate.setDate(
  nextDueDate.getDate() +
  Number(meter.time_interval_days || 30)
)

console.log(
  'today =',
  today
)

console.log(
  'interval =',
  meter.time_interval_days
)

console.log(
  'nextDueDate =',
  nextDueDate
)

console.log('meter.id =', meter.id)
console.log('typeof meter.id =', typeof meter.id)

const updateResult = await supabase
  .from("meters")
  .update({
    last_prove_date: today,
    next_due_date:
      nextDueDate
        .toISOString()
        .split('T')[0],
  })
  .eq('id', meter.id)
  .select()

console.log(
  'UPDATE RESULT =',
  updateResult
)

  alert(
    'Prove logged successfully'
  )

  router.push('/history')
}

  return (

    <ProtectedRoute>

      <div className="container">

        <h1>
          Log Prove
        </h1>

        <form>

          <div>

            <label>
              Meter Factor
            </label>

            <input
              type="number"
              value={meterFactor}
              onChange={(e) =>
                setMeterFactor(
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
              Prover Volume
            </label>

            <input
              type="number"
              value={proverVolume}
              onChange={(e) =>
                setProverVolume(
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
              Flow Rate
            </label>

            <input
              type="number"
              value={flowRate}
              onChange={(e) =>
                setFlowRate(
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
              Totalizer
            </label>

            <input
              type="number"
              value={totalizer}
              onChange={(e) =>
                setTotalizer(
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
              Meter Temp
            </label>

            <input
              type="number"
              value={meterTemp}
              onChange={(e) =>
                setMeterTemp(
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
              Certified Temp
            </label>

            <input
              type="number"
              value={certifiedTemp}
              onChange={(e) =>
                setCertifiedTemp(
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
              Seals
            </label>

            <input
              value={seals}
              onChange={(e) =>
                setSeals(
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
              Notes
            </label>

            <input
              value={notes}
              onChange={(e) =>
                setNotes(
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
              Status
            </label>

            <select
              value={status}
              onChange={(e) =>
                setStatus(
                  e.target.value
                )
              }
              onKeyDown={
                handleEnterKey
              }
            >

              <option value="PASS">
                PASS
              </option>

              <option value="FAIL">
                FAIL
              </option>

            </select>

          </div>

          <button
            type="button"
            onClick={saveProve}
          >

            Save Prove

          </button>

        </form>

      </div>

    </ProtectedRoute>
  )
}