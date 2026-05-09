'use client'

import {
  useEffect,
  useState,
} from 'react'

import { supabase }
from '../../lib/supabase'

import ProtectedRoute
from '../../components/ProtectedRoute'

export default function History() {

  const [history, setHistory] =
    useState([])

  useEffect(() => {

    fetchHistory()

  }, [])

  async function fetchHistory() {

    const { data, error } =
      await supabase
        .from('ProveHistory')
        .select('*')
        .order('prove_date', {
          ascending: false,
        })

    if (!error) {

      setHistory(data)
    }
  }

  return (

    <ProtectedRoute>

      <div className="container">

        <h1>
          Prove History
        </h1>

        <div className="table-wrapper">

          <table>

            <thead>

              <tr>

                <th>
                  Meter Name
                </th>

                <th>
                  Location
                </th>

                <th>
                  Prove Date
                </th>

              </tr>

            </thead>

            <tbody>

              {history.map(item => (

                <tr key={item.id}>

                  <td>
                    {item.meter_name}
                  </td>

                  <td>
                    {item.location}
                  </td>

                  <td>
                    {item.prove_date}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </ProtectedRoute>
  )
}