'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

import { useOrganization } from '../context/OrganizationContext'

export default function ProtectedRoute({
  children,
  allowedRoles = [],
}) {

  const router = useRouter()

  const {
    user,
    profile,
    loading,
  } = useOrganization()

  useEffect(() => {

    if (loading) {
      return
    }

    // Not logged in
    if (!user) {

      router.replace('/login')

      return
    }

    // No role restriction for this page
    if (allowedRoles.length === 0) {

      return
    }

    // User has no profile
    if (!profile) {

      router.replace('/')

      return
    }

    // Check role
    if (!allowedRoles.includes(profile.role)) {

      router.replace('/')

    }

  }, [
    user,
    profile,
    loading,
    allowedRoles,
    router,
  ])

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

  if (
    allowedRoles.length > 0 &&
    (
      !profile ||
      !allowedRoles.includes(profile.role)
    )
  ) {

    return null
  }

  return children
}