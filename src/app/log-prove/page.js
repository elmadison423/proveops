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

export default function LogProve() {

  const router =
    useRouter()

  const searchParams =
    useSearchParams()

  const meterId =
    searchParams.get('meter')

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

    const today =
      new Date()
        .toISOString()
        .split('T')[0]

    const { error } =
      await supabase
        .from('ProveHistory')
        .insert([
          {
            meter_id:
              meterId,

            technician_id:
              null,

            prove_date:
              today,

            meter_factor:
              Number(
                meterFactor
              ),

            prover_volume:
              Number(
                proverVolume
              ),

            flow_rate:
              Number(
                flowRate
              ),

            totalizer:
              Number(
                totalizer
              ),

            meter_temp:
              Number(
                meterTemp
              ),

            certified_temp:
              Number(
                certifiedTemp
              ),

            seals,

            notes,

            status,

            organization_id:
              profile.organization_id,
          },
        ])

    if (error) {

      console.log(error)

      alert(
        'Error saving prove'
      )

      return
    }

    await supabase
      .from('Meters')
      .update({
        last_prove_date:
          today,
      })
      .eq(
        'id',
        meterId
      )

    alert(
      'Prove logged successfully'
    )

    router.push('/meters')
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