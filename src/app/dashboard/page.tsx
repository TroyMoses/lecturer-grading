'use client'

import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Dashboard() {
  const { user, isLoaded } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (isLoaded && user) {
      // Check user role and redirect accordingly
      // For now, we'll assume all users are lecturers
      // You'll need to implement role checking logic later
      router.push('/lecturer-dashboard')
    }
  }, [isLoaded, user, router])

  if (!isLoaded) {
    return <div>Loading...</div>
  }

  return null
}
