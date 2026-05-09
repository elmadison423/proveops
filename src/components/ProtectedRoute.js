'use client'

import {
  useEffect,
  useState,
} from 'react'

import { useRouter }
from 'next/navigation'

import { supabase }
from '../lib/supabase'

export default function ProtectedRoute({
  children,
}) {

  const router = useRouter()

  const [loading, setLoading] =
    useState(true)

  useEffect(() => {

    checkUser()

  }, [])

  async function checkUser() {

    const {
      data,
    } = await supabase.auth.getSession()

    if (!data.session) {

      router.push('/login')

    } else {

      setLoading(false)
    }
  }

  if (loading) {

    return <p>Loading...</p>
  }

  return children
}