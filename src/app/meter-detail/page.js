'use client'

import {
  useEffect,
  useState,
} from 'react'

import {
  useSearchParams,
} from 'next/navigation'

import { supabase }
from '../../lib/supabase'

import ProtectedRoute
from '../../components/ProtectedRoute'

export default function MeterDetail() {

  const searchParams =
    useSearchParams()

  const meterId =
    searchParams.get('meter')

  const [meter, setMeter] =
    useState(null)

  const [
    proveHistory,
    setProveHistory,
  ] = useState([])

  useEffect(() => {

    fetchData()

  }, [])

  async function fetchData() {

    const {
      data: meterData,
    } = await supabase
      .from('Meters')
      .select('*')
      .eq(
        'id',
        meterId
      )
      .single()

    setMeter(meterData)

    const {
      data: historyData,
    } = await supabase
      .from('ProveHistory')
.select('*')
.eq(
  'meter_id',
  meterId
)
      .order(
        'prove_date',
        {
          ascending: false,
        }
      )

    setProveHistory(
      historyData || []
    )
  }

  return (

    <ProtectedRoute>

      <div className="container">

        {
          meter && (

            <div
              className="card"
              style={{
                marginBottom:
                  '20px',
              }}
            >

              <h1>
                {meter.name}
              </h1>

              <br />

              <p>

                <strong>
                  Serial:
                </strong>

                {' '}

                {
                  meter.serial_number
                }

              </p>

              <p>

                <strong>
                  Location:
                </strong>

                {' '}

                {
                  meter.location
                }

              </p>

              <p>

                <strong>
                  Proving Method:
                </strong>

                {' '}

                {
                  meter.proving_method
                }

              </p>

            </div>
          )
        }

        <h2>
          Prove History
        </h2>

        <br />

        {
          proveHistory.length === 0
          ? (

            <p>
              No prove history
            </p>

          ) : (

            proveHistory.map(
              prove => (

                <div
                  key={prove.id}
                  className="card"
                  style={{
                    marginBottom:
                      '15px',
                  }}
                >

                  <p>

                    <strong>
                      Date:
                    </strong>

                    {' '}

                    {
                      prove.prove_date
                    }

                  </p>

                  <p>

                    <strong>
                      Status:
                    </strong>

                    {' '}

                    {
                      prove.status
                    }

                  </p>

                  <p>

                    <strong>
                      Meter Factor:
                    </strong>

                    {' '}

                    {
                      prove.meter_factor
                    }

                  </p>

                  <p>

                    <strong>
                      Flow Rate:
                    </strong>

                    {' '}

                    {
                      prove.flow_rate
                    }

                  </p>

                  <p>

                    <strong>
                      Totalizer:
                    </strong>

                    {' '}

                    {
                      prove.totalizer
                    }

                  </p>

                  <p>

                    <strong>
                      Meter Temp:
                    </strong>

                    {' '}

                    {
                      prove.meter_temp
                    }

                  </p>

                  <p>

                    <strong>
                      Certified Temp:
                    </strong>

                    {' '}

                    {
                      prove.certified_temp
                    }

                  </p>

                  <p>

                    <strong>
                      Seals:
                    </strong>

                    {' '}

                    {
                      prove.seals
                    }

                  </p>

                  <p>

                    <strong>
                      Notes:
                    </strong>

                    {' '}

                    {
                      prove.notes
                    }

                  </p>

                </div>
              )
            )
          )
        }

      </div>

    </ProtectedRoute>
  )
}