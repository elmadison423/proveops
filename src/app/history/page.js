'use client'

import {
  useEffect,
  useState,
} from 'react'

import Link from 'next/link'

import { supabase }
from '../../lib/supabase'

import ProtectedRoute
from '../../components/ProtectedRoute'

export default function History() {

  const [history, setHistory] =
    useState([])

  const [search, setSearch] =
    useState('')

  useEffect(() => {

    fetchHistory()

  }, [])

  async function fetchHistory() {

    const {
      data: proveHistory,
    } = await supabase
      .from('ProveHistory')
      .select('*')
      .order(
        'prove_date',
        {
          ascending: false,
        }
      )

    const {
      data: meters,
    } = await supabase
      .from('Meters')
      .select('*')

    const combined =

      (proveHistory || []).map(
        prove => {

          const meter =
            meters?.find(

              m =>

                String(m.id)
                ===
                String(
                  prove.meter_id
                )
            )

          return {

            ...prove,

            meter_name:
              meter?.name || '',

            meter_id_tag:
              meter?.meter_id_tag || '',

            location:
              meter?.location || '',
          }
        }
      )

    setHistory(combined)
  }

  return (

    <ProtectedRoute>

      <div className="container">

        <h1>
          Prove History
        </h1>

        <input
          placeholder="Search prove history..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
        />

        <div className="table-wrapper">

          <table>

            <thead>

              <tr>

                <th>
                  Meter ID
                </th>

                <th>
                  Meter Name
                </th>

                <th>
                  Location
                </th>

                <th>
                  Prove Date
                </th>

                <th>
                  Status
                </th>

              </tr>

            </thead>

            <tbody>

              {
                history

                  .filter(item =>

                    item.meter_name
                      ?.toLowerCase()
                      .includes(
                        search.toLowerCase()
                      )

                    ||

                    item.location
                      ?.toLowerCase()
                      .includes(
                        search.toLowerCase()
                      )

                    ||

                    item.meter_id_tag
                      ?.toLowerCase()
                      .includes(
                        search.toLowerCase()
                      )
                  )

                  .map(
                    item => (

                      <tr
                        key={item.id}
                      >

                        <td>

                          {
                            item.meter_id_tag
                          }

                        </td>

                        <td>

                          <Link
                            href={`/meter-detail?meter=${item.meter_id}`}
                          >

                            {
                              item.meter_name
                            }

                          </Link>

                        </td>

                        <td>

                          {
                            item.location
                          }

                        </td>

                        <td>

                          {
                            item.prove_date
                          }

                        </td>

                        <td>

                          {
                            item.status
                          }

                        </td>

                      </tr>

                    )
                  )
              }

            </tbody>

          </table>

        </div>

      </div>

    </ProtectedRoute>
  )
}