'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

import { useOrganization } from '../context/OrganizationContext'

export default function ProtectedRoute({
  children,
}) {

  const router = useRouter()

  const {
    user,
    loading,
  } = useOrganization()

  useEffect(() => {

    if (!loading && !user) {

      router.replace('/login')

    }

  }, [user, loading, router])

  if (loading) {

    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "18px",
        }}
      >
        Loading...
      </div>
    )
  }

  if (!user) {

    return null
  }

  return children
}