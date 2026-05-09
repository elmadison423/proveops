'use client'

import dynamic from 'next/dynamic'

const MeterMapComponent =
  dynamic(

    () =>
      import(
        './MapComponent'
      ),

    {
      ssr: false,
    }
  )

export default function MeterMapPage() {

  return <MeterMapComponent />
}