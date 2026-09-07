'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { logOut } from '@/lib/auth'

export default function Navbar() {
  const { user, isAdmin, loading } = useAuth()
  const [open, setOpen] = useState(false)

  return (
    <nav className="bg-[#F5C518] border-b-2 border-black/10 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-syne font-extrabold text-xl text-brand-black">
          <span className="text-2xl">🚕</span> i Cab
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6 text-sm font-bold text-brand-black/70">
          <Link href="/#services" className="hover:text-brand-black transition-colors">Services</Link>
          <Link href="/#fleet" className="hover:text-brand-black transition-colors">Fleet</Link>
          <Link href="/#how" className="hover:text-brand-black transition-colors">How It Works</Link>
          <Link href="/dashboard" className="hover:text-brand-black transition-colors">Community</Link>
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          {loading ? null : user ? (
            <>
              {isAdmin && (
                <Link href="/admin" className="text-sm font-bold text-brand-black/60 hover:text-brand-black">Admin</Link>
              )}
              <Link href="/dashboard" className="text-sm font-bold bg-white/60 px-4 py-2 rounded-full hover:bg-white transition-colors">
                Dashboard
              </Link>
              <button onClick={() => logOut()} className="text-sm font-bold text-brand-black/60 hover:text-brand-black">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/auth" className="text-sm font-bold text-brand-black/70 hover:text-brand-black">Login</Link>
              <Link href="/auth" className="bg-brand-black text-[#F5C518] font-bold px-5 py-2 rounded-full text-sm hover:scale-105 transition-transform">
                Book Now
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
          <div className="w-6 flex flex-col gap-1.5">
            <span className={`block h-0.5 bg-brand-black transition-all ${open ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block h-0.5 bg-brand-black transition-all ${open ? 'opacity-0' : ''}`} />
            <span className={`block h-0.5 bg-brand-black transition-all ${open ? '-rotate-45 -translate-y-2' : ''}`} />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-[#F5C518] border-t border-black/10 px-6 pb-6 space-y-3">
          <Link href="/#services" onClick={() => setOpen(false)} className="block py-2 font-bold text-brand-black/70 hover:text-brand-black">Services</Link>
          <Link href="/#fleet" onClick={() => setOpen(false)} className="block py-2 font-bold text-brand-black/70 hover:text-brand-black">Fleet</Link>
          <Link href="/dashboard" onClick={() => setOpen(false)} className="block py-2 font-bold text-brand-black/70 hover:text-brand-black">Community</Link>
          {user ? (
            <>
              <Link href="/dashboard" onClick={() => setOpen(false)} className="block py-2 font-bold">Dashboard</Link>
              {isAdmin && <Link href="/admin" onClick={() => setOpen(false)} className="block py-2 font-bold">Admin Panel</Link>}
              <button onClick={() => { logOut(); setOpen(false) }} className="block py-2 font-bold text-brand-black/60">Logout</button>
            </>
          ) : (
            <Link href="/auth" onClick={() => setOpen(false)} className="block bg-brand-black text-[#F5C518] font-bold text-center py-3 rounded-xl">
              Login / Sign Up
            </Link>
          )}
        </div>
      )}
    </nav>
  )
}
