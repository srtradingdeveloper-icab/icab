'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AuthFlow from '@/components/auth/AuthFlow'
import { useAuth } from '@/hooks/useAuth'

export default function AuthPage() {
  const { user, loading, isAdmin } = useAuth()
  const router = useRouter()

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && user) {
      router.replace(isAdmin ? '/admin' : '/dashboard')
    }
  }, [user, loading, isAdmin, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5C518] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-black/30 border-t-black rounded-full animate-spin" />
      </div>
    )
  }

  return <AuthFlow />
}
