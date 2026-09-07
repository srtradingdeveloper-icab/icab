'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import UserDashboard from '@/components/layout/UserDashboard'

export default function DashboardPage() {
  const { user, profile, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) router.replace('/auth')
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F0EDE8] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#C9990A]/30 border-t-[#C9990A] rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) return null

  return <UserDashboard user={user} profile={profile} />
}
