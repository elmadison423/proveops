'use client'

import {
  useEffect,
  useState,
} from 'react'

import jsPDF from 'jspdf'

import { supabase }
from '../lib/supabase'

import ProtectedRoute
from '../components/ProtectedRoute'

export default function Home() {

  const [meters, setMeters] =
    useState([])

  const [
    organization,
    setOrganization,
  ] = useState(null)

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

    if (!profile) return

    const {
      data: org,
    } = await supabase
      .from('Organizations')
      .select('*')
      .eq(
        'id',
        profile.organization_id
      )
      .single()

    setOrganization(org)

    const {
      data,
      error,
    } = await supabase
      .from('Meters')
      .select('*')
      .eq(
        'organization_id',
        profile.organization_id
      )

    if (!error) {

      setMeters(data || [])
    }
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

    if (today >= nextProve) {

      return 'DUE'
    }

    return 'OK'
  }

  const dueMeters =
    meters.filter(
      meter =>
        getStatus(meter)
        === 'DUE'
    )

  const okMeters =
    meters.filter(
      meter =>
        getStatus(meter)
        === 'OK'
    )

  const nextMonthMeters =
    meters.filter(meter => {

      const nextProve =
        getNextProveDate(
          meter
        )

      const today =
        new Date()

      const nextMonth =
        new Date(
          today.getFullYear(),
          today.getMonth() + 1,
          1
        )

      const monthAfter =
        new Date(
          today.getFullYear(),
          today.getMonth() + 2,
          1
        )

      return (
        nextProve >= nextMonth
        &&
        nextProve < monthAfter
      )
    })

  function generateMonthlyReport() {

    const doc =
      new jsPDF()

    doc.setFontSize(22)

    doc.text(

      organization?.name
      || 'Organization',

      20,

      20
    )

    doc.setFontSize(18)

    doc.text(
      'Upcoming Meter Schedule',
      20,
      35
    )

    doc.setFontSize(12)

    doc.text(

      `Generated: ${
        new Date()
          .toLocaleDateString()
      }`,

      20,

      45
    )

    let y = 65

    if (
      nextMonthMeters.length
      === 0
    ) {

      doc.text(
        'No meters due next month',
        20,
        y
      )

    } else {

      nextMonthMeters.forEach(
        meter => {

          doc.text(

            `${meter.name} — ${meter.location} — Due ${getNextProveDate(
              meter
            ).toLocaleDateString()}`,

            20,

            y
          )

          y += 10
        }
      )
    }

    doc.save(
      'monthly-meter-schedule.pdf'
    )
  }

  return (

    <ProtectedRoute>

      <div className="container">

        <h1>

          {
            organization?.name
            || 'ProveOps Dashboard'
          }

        </h1>

        <div className="cards">

          <div className="card">

            <h2>
              Total Meters
            </h2>

            <h1>
              {meters.length}
            </h1>

          </div>

          <div className="card">

            <h2>
              Due Meters
            </h2>

            <h1
              style={{
                color: 'red',
              }}
            >

              {dueMeters.length}

            </h1>

          </div>

          <div className="card">

            <h2>
              OK Meters
            </h2>

            <h1
              style={{
                color: 'green',
              }}
            >

              {okMeters.length}

            </h1>

          </div>

        </div>

        <br />

        <div className="card">

          <h2>
            Upcoming Due Next Month
          </h2>

          <br />

          <button
            type="button"
            onClick={
              generateMonthlyReport
            }
          >

            Generate PDF Report

          </button>

          <br />
          <br />

          {
            nextMonthMeters
              .length === 0
            ? (
              <p>
                No meters due
                next month
              </p>
            )
            : (
              nextMonthMeters.map(
                meter => (

                  <div
                    key={meter.id}
                    style={{
                      marginBottom:
                        '12px',
                    }}
                  >

                    <strong>
                      {meter.name}
                    </strong>

                    {' — '}

                    {meter.location}

                    {' — Due: '}

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

      </div>

    </ProtectedRoute>
  )
}