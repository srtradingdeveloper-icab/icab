'use client'
import { useEffect, useState } from 'react'
import { onAuthStateChanged, User } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { getUser } from '@/lib/firestore'
import { isAdmin } from '@/lib/auth'
import type { VyasaUser } from '@/types'

export function useAuth() {
  const [user, setUser]         = useState<User | null>(null)
  const [profile, setProfile]   = useState<VyasaUser | null>(null)
  const [loading, setLoading]   = useState(true)
  const [admin, setAdmin]       = useState(false)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)
      setAdmin(isAdmin(firebaseUser?.email))
      if (firebaseUser) {
        const p = await getUser(firebaseUser.uid)
        setProfile(p)
      } else {
        setProfile(null)
      }
      setLoading(false)
    })
    return unsub
  }, [])

  return { user, profile, loading, isAdmin: admin }
}
