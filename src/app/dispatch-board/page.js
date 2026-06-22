'use client'

import {
  useEffect,
  useState,
} from 'react'

import { supabase }
from '../../lib/supabase'

import ProtectedRoute
from '../../components/ProtectedRoute'

import { useRouter } from 'next/navigation'

export default function DispatchBoard() {

  const router = useRouter()

  const [search, setSearch] =
  useState('')

const [sortBy, setSortBy] =
  useState('priority')

  const [meters, setMeters] =
    useState([])

    const [filter, setFilter] =
  useState('ALL')

  const [
    technicians,
    setTechnicians,
  ] = useState([])

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

  function getPriority(
    meter
  ) {

    const today = new Date()

const nextWeek =
  new Date(today)

nextWeek.setDate(
  today.getDate() + 7
)

    const nextProve =
      getNextProveDate(
        meter
      )

    const volumeUsed =

      (meter.current_volume || 0)

      -

      (meter.last_prove_volume || 0)

    const volumeDue =
  meter.volume_interval &&
  meter.current_volume &&
  meter.current_volume >= meter.volume_interval
  
    if (
      nextProve < today ||
      volumeDue
    ) {

      return 'CRITICAL'
    }

    if (
      nextProve <= nextWeek
    ) {

      return 'HIGH'
    }

    return 'NORMAL'
  }

  const sortedMeters =

    [...meters].sort(
      (a, b) => {

        const priorityOrder = {

          CRITICAL: 1,

          HIGH: 2,

          NORMAL: 3,
        }

        return (

          priorityOrder[
            getPriority(a)
          ]

          -

          priorityOrder[
            getPriority(b)
          ]
        )
      }
    )

    const filteredMeters =
  [...meters]

    .filter(meter => {

      const matchesFilter =
        filter === 'ALL'
        ||
        getPriority(meter)
        === filter

      const searchText = `
  ${meter.meter_id_tag || ''}
  ${meter.name || ''}
  ${meter.location || ''}
`
.toLowerCase()

      const matchesSearch =
        searchText.includes(
          search.toLowerCase()
        )

      return (
        matchesFilter
        &&
        matchesSearch
      )
    })

    .sort((a, b) => {

      if (sortBy === 'dueDate') {

        return (
          getNextProveDate(a)
          -
          getNextProveDate(b)
        )
      }

      if (sortBy === 'serial') {

        return (
          (a.serial_number || '')
          .localeCompare(
            b.serial_number || ''
          )
        )
      }

      const priorityOrder = {
        CRITICAL: 1,
        HIGH: 2,
        NORMAL: 3,
      }

      return (
        priorityOrder[
          getPriority(a)
        ]
        -
        priorityOrder[
          getPriority(b)
        ]
      )
    })

  return (

    <ProtectedRoute>

      <div className="container">

        <h1>
          Dispatch Board
        </h1>

        <br />

        <div className="dispatch-toolbar">

  "Meters"
    type="text"
    placeholder="Search meters..."
    value={search}
    onChange={e =>
      setSearch(
        e.target.value
      )
    }
    className="dispatch-search"
  />

  <select
    value={sortBy}
    onChange={e =>
      setSortBy(
        e.target.value
      )
    }
    className="dispatch-sort"
  >

    <option value="priority">
      Sort by Priority
    </option>

    <option value="dueDate">
      Sort by Due Date
    </option>

    <option value="serial">
      Sort by Serial
    </option>

  </select>

</div>

<div className="dispatch-filters">

  {
    [
      'ALL',
      'CRITICAL',
      'HIGH',
      'NORMAL',
    ].map(type => (

      <button
        key={type}
        className={
          filter === type
          ? 'dispatch-filter active'
          : 'dispatch-filter'
        }
        onClick={() =>
          setFilter(type)
        }
      >

        {type}

      </button>
    ))
  }

</div>

<br />

        <br />

        <div className="cards">

  {
    filteredMeters.map(
      meter => {

        const priority =
          getPriority(meter)

        const technician =
          technicians.find(
            tech =>
              tech.id ===
              meter.technician_id
          )

        return (

          <div
  key={meter.id}
  className={`dispatch-card ${priority.toLowerCase()}`}
  onClick={() => router.push(`/meter-detail?id=${meter.id}`)}
  style={{ cursor: 'pointer' }}
>
           <h2>
            {meter.meter_id_tag}
           </h2>

            <p>
              {meter.name}
            </p>

            <p>
              {meter.location}
            </p>

            <p>
              Technician:
              {' '}
              {
                technician?.name ||
                'Unassigned'
              }
            </p>

            <div
              className={`priority-badge ${priority.toLowerCase()}`}
            >
              {priority}
            </div>

            <p
              style={{
                marginTop: '14px'
              }}
            >
              Due Date:
              {' '}
              {
                getNextProveDate(meter)
                .toLocaleDateString()
              }
            </p>

          </div>
        )
      }
    )
  }

</div>

        </div>

    </ProtectedRoute>
  )
}