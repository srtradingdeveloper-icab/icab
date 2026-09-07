'use client'
import { useState, useEffect } from 'react'
import type { User } from 'firebase/auth'
import type { VyasaUser, Post } from '@/types'
import { getUserBookings, getPosts, submitPost } from '@/lib/firestore'
import { logOut, getInitials } from '@/lib/auth'
import { TIER_THRESHOLDS, POINTS_PER_RUPEE } from '@/types'
import Link from 'next/link'

type Tab = 'overview' | 'bookings' | 'community' | 'account'

function getTierInfo(points: number) {
  if (points >= TIER_THRESHOLDS.platinum) return { label: 'Platinum', color: 'bg-purple-100 text-purple-700', next: null }
  if (points >= TIER_THRESHOLDS.gold) return { label: 'Gold', color: 'bg-[#F5C518]/30 text-[#8B6D00]', next: TIER_THRESHOLDS.platinum }
  if (points >= TIER_THRESHOLDS.silver) return { label: 'Silver', color: 'bg-gray-100 text-gray-600', next: TIER_THRESHOLDS.gold }
  return { label: 'Bronze', color: 'bg-orange-100 text-orange-700', next: TIER_THRESHOLDS.silver }
}

export default function UserDashboard({ user, profile }: { user: User; profile: VyasaUser | null }) {
  const [tab, setTab] = useState<Tab>('overview')
  const [bookings, setBookings] = useState<any[]>([])
  const [posts, setPosts] = useState<Post[]>([])
  const [caption, setCaption] = useState('')
  const [emoji, setEmoji] = useState('🚕')
  const [posting, setPosting] = useState(false)
  const [postDone, setPostDone] = useState(false)

  const displayName = profile?.displayName || user.displayName || user.email?.split('@')[0] || 'Traveler'
  const initials = getInitials(displayName)
  const points = profile?.rewardPoints ?? 0
  const tier = getTierInfo(points)

  useEffect(() => {
    if (tab === 'bookings') getUserBookings(user.uid).then(setBookings).catch(() => {})
    if (tab === 'community') getPosts('live').then(setPosts).catch(() => {})
  }, [tab, user.uid])

  async function handlePost(e: React.FormEvent) {
    e.preventDefault()
    if (!caption.trim()) return
    setPosting(true)
    await submitPost({ userId: user.uid, authorName: displayName, authorInitials: initials, caption, emoji, likes: 0, comments: 0, status: 'pending' })
    setCaption(''); setPostDone(true); setPosting(false)
    setTimeout(() => setPostDone(false), 4000)
  }

  const TABS: { key: Tab; label: string; icon: string }[] = [
    { key: 'overview', label: 'Overview', icon: '🏠' },
    { key: 'bookings', label: 'My Trips', icon: '🧳' },
    { key: 'community', label: 'Community', icon: '❤️' },
    { key: 'account', label: 'Account', icon: '👤' },
  ]

  return (
    <div className="min-h-screen bg-[#F0EDE8]">
      {/* Top bar */}
      <div className="bg-[#F5C518] px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-syne font-extrabold text-xl text-brand-black flex items-center gap-2">🚕 i Cab</Link>
        <div className="flex items-center gap-3">
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${tier.color}`}>{tier.label}</span>
          <div className="w-9 h-9 bg-brand-black text-[#F5C518] rounded-full flex items-center justify-center font-bold text-sm">{initials}</div>
        </div>
      </div>

      {/* Tab nav */}
      <div className="bg-white border-b border-black/5 px-6">
        <div className="flex gap-0 max-w-3xl mx-auto">
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-4 py-4 text-sm font-bold border-b-2 transition-colors ${tab === t.key ? 'border-[#F5C518] text-brand-black' : 'border-transparent text-black/40 hover:text-black/70'}`}>
              <span>{t.icon}</span><span className="hidden sm:inline">{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">

        {/* OVERVIEW */}
        {tab === 'overview' && (
          <div className="space-y-6">
            {/* Welcome card */}
            <div className="bg-brand-black text-white rounded-2xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-white/50 text-sm">Welcome back</p>
                  <h2 className="font-syne font-bold text-2xl">{displayName}</h2>
                </div>
                <div className={`text-xs font-bold px-3 py-1 rounded-full ${tier.color}`}>{tier.label}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white/10 rounded-xl p-3 text-center">
                  <div className="font-syne font-bold text-xl text-[#F5C518]">{points}</div>
                  <div className="text-xs text-white/50">i Cab Points</div>
                </div>
                <div className="bg-white/10 rounded-xl p-3 text-center">
                  <div className="font-syne font-bold text-xl text-[#F5C518]">{profile?.totalTrips ?? 0}</div>
                  <div className="text-xs text-white/50">Total Trips</div>
                </div>
                <div className="bg-white/10 rounded-xl p-3 text-center">
                  <div className="font-syne font-bold text-xl text-[#F5C518]">₹{((profile?.totalSpent ?? 0)).toLocaleString('en-IN')}</div>
                  <div className="text-xs text-white/50">Total Spent</div>
                </div>
              </div>
            </div>

            {/* Quick actions */}
            <div className="grid grid-cols-2 gap-4">
              <Link href="/" className="bg-[#F5C518] rounded-2xl p-5 font-syne font-bold text-brand-black hover:bg-[#C9990A] transition-colors text-center">
                <div className="text-3xl mb-2">🚕</div>
                <div>Book a Ride</div>
              </Link>
              <a href="https://wa.me/917008000000" className="bg-[#25D366] rounded-2xl p-5 font-syne font-bold text-white text-center hover:opacity-90 transition-opacity">
                <div className="text-3xl mb-2">💬</div>
                <div>WhatsApp Us</div>
              </a>
            </div>

            {/* Points info */}
            {tier.next && (
              <div className="bg-white rounded-2xl p-5">
                <h3 className="font-bold text-sm mb-3">Your Rewards Progress</h3>
                <div className="h-2 bg-black/5 rounded-full overflow-hidden mb-2">
                  <div className="h-full bg-[#F5C518] rounded-full transition-all" style={{ width: `${Math.min(100, (points / tier.next) * 100)}%` }} />
                </div>
                <p className="text-xs text-black/50">{tier.next - points} more points to next tier · Earn {POINTS_PER_RUPEE} point per ₹1 spent</p>
              </div>
            )}
          </div>
        )}

        {/* BOOKINGS */}
        {tab === 'bookings' && (
          <div className="space-y-4">
            <h2 className="font-syne font-bold text-xl">My Trips</h2>
            {bookings.length === 0 ? (
              <div className="bg-white rounded-2xl p-10 text-center">
                <div className="text-5xl mb-4">🧳</div>
                <p className="font-bold mb-1">No trips yet</p>
                <p className="text-sm text-black/50 mb-5">Your bookings will appear here after confirmation</p>
                <Link href="/" className="bg-[#F5C518] font-bold px-6 py-3 rounded-xl inline-block hover:bg-[#C9990A] transition-colors">
                  Book Your First Ride →
                </Link>
              </div>
            ) : (
              bookings.map((b: any) => (
                <div key={b.id} className="bg-white rounded-2xl p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="font-bold">{b.from} → {b.to}</div>
                      <div className="text-xs text-black/40 mt-1">{b.travelDate} · {b.vehicle}</div>
                    </div>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${b.status === 'confirmed' ? 'bg-green-100 text-green-700' : b.status === 'completed' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>
                      {b.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-black/60">
                    <span>₹{b.amount?.toLocaleString('en-IN')}</span>
                    {b.driverName && <span>Driver: {b.driverName}</span>}
                    {b.driverMobile && <a href={`tel:${b.driverMobile}`} className="text-[#C9990A] font-bold">{b.driverMobile}</a>}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* COMMUNITY */}
        {tab === 'community' && (
          <div className="space-y-6">
            {/* Post form */}
            <div className="bg-white rounded-2xl p-5">
              <h3 className="font-syne font-bold mb-4">Share Your Story</h3>
              {postDone ? (
                <div className="bg-green-50 text-green-700 rounded-xl px-4 py-3 text-sm font-bold">
                  ✅ Your story is under review and will appear soon!
                </div>
              ) : (
                <form onSubmit={handlePost} className="space-y-3">
                  <div className="flex gap-2">
                    {['🚕','🏖️','🛕','🐬','💼','🎉'].map(e => (
                      <button type="button" key={e} onClick={() => setEmoji(e)}
                        className={`w-9 h-9 rounded-lg text-lg flex items-center justify-center transition-colors ${emoji === e ? 'bg-[#F5C518]' : 'bg-black/5 hover:bg-black/10'}`}>
                        {e}
                      </button>
                    ))}
                  </div>
                  <textarea value={caption} onChange={e => setCaption(e.target.value)} placeholder="Tell us about your trip…"
                    rows={3} className="w-full border-2 border-black/10 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:border-[#F5C518]" required />
                  <button type="submit" disabled={posting} className="bg-[#F5C518] font-bold px-6 py-2.5 rounded-xl text-sm hover:bg-[#C9990A] transition-colors disabled:opacity-50">
                    {posting ? 'Posting…' : 'Share Story'}
                  </button>
                </form>
              )}
            </div>

            {/* Feed */}
            <div className="space-y-4">
              {posts.map(p => (
                <div key={p.id} className="bg-white rounded-2xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 bg-[#F5C518]/30 text-brand-black rounded-full flex items-center justify-center font-bold text-xs">{p.authorInitials}</div>
                    <div>
                      <div className="font-bold text-sm">{p.authorName}</div>
                      <div className="text-xs text-black/40">{new Date(p.createdAt?.seconds ? p.createdAt.seconds * 1000 : p.createdAt).toLocaleDateString('en-IN')}</div>
                    </div>
                    <span className="ml-auto text-xl">{p.emoji}</span>
                  </div>
                  <p className="text-sm text-black/70 leading-relaxed">{p.caption}</p>
                  <div className="flex items-center gap-3 mt-3">
                    <span className="text-xs text-black/40">❤️ {p.likes}</span>
                  </div>
                </div>
              ))}
              {posts.length === 0 && <p className="text-center text-black/40 text-sm py-8">No posts yet. Be the first to share!</p>}
            </div>
          </div>
        )}

        {/* ACCOUNT */}
        {tab === 'account' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-brand-black text-[#F5C518] rounded-full flex items-center justify-center font-bold text-xl">{initials}</div>
                <div>
                  <div className="font-syne font-bold text-lg">{displayName}</div>
                  <div className="text-sm text-black/50">{user.email}</div>
                </div>
              </div>
              <div className="space-y-3 text-sm">
                {profile?.mobile && <div className="flex items-center gap-3"><span className="text-black/40">📞</span><span>{profile.mobile}</span></div>}
                {profile?.city && <div className="flex items-center gap-3"><span className="text-black/40">📍</span><span>{profile.city}, Odisha</span></div>}
                <div className="flex items-center gap-3"><span className="text-black/40">🎖️</span><span className={`font-bold px-2 py-0.5 rounded-full text-xs ${tier.color}`}>{tier.label} Member</span></div>
              </div>
            </div>

            <div className="bg-white rounded-2xl divide-y divide-black/5">
              {[
                { label: 'Privacy Policy', href: '#' },
                { label: 'Terms of Service', href: '#' },
                { label: 'Help & Support', href: 'https://wa.me/917008000000' },
              ].map(item => (
                <a key={item.label} href={item.href} className="flex items-center justify-between px-5 py-4 hover:bg-black/2 transition-colors text-sm font-medium">
                  {item.label} <span className="text-black/30">→</span>
                </a>
              ))}
            </div>

            <button onClick={() => logOut()} className="w-full bg-red-50 text-red-600 font-bold py-3 rounded-xl hover:bg-red-100 transition-colors text-sm">
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
