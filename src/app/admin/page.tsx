'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import AdminPanel from '@/components/layout/AdminPanel'

export default function AdminPage() {
  const { user, loading, isAdmin } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user) router.replace('/auth')
      else if (!isAdmin) router.replace('/dashboard')
    }
  }, [user, loading, isAdmin, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F0E0B] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#F5C518]/30 border-t-[#F5C518] rounded-full animate-spin" />
      </div>
    )
  }

  if (!user || !isAdmin) return null

  return <AdminPanel />
}
