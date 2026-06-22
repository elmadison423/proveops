'use client'

import {
  useEffect,
} from 'react'

export default function ThemeLoader() {

  useEffect(() => {

    const theme =
      localStorage.getItem(
        'proveops-theme'
      )

    document.body.classList.remove(
      'theme-carbon',
      'theme-emerald'
    )

    if (
      theme === 'carbon'
    ) {

      document.body.classList.add(
        'theme-carbon'
      )
    }

    if (
      theme === 'emerald'
    ) {

      document.body.classList.add(
        'theme-emerald'
      )
    }

  }, [])

  return null
}