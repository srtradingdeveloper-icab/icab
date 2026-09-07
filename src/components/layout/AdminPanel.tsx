'use client'
import { useState, useEffect } from 'react'
import { getEnquiries, updateEnquiryStatus, getAllBookings, getDrivers, addDriver, getPosts, updatePostStatus, getFares, saveFares } from '@/lib/firestore'
import type { Enquiry, Booking, Driver, Post } from '@/types'
import { logOut } from '@/lib/auth'
import { DEFAULT_FARES, formatINR } from '@/lib/fares'
import Link from 'next/link'

type Tab = 'enquiries' | 'bookings' | 'drivers' | 'community' | 'fares'

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-yellow-100 text-yellow-700',
  called: 'bg-blue-100 text-blue-700',
  confirmed: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  live: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  removed: 'bg-red-100 text-red-700',
  completed: 'bg-blue-100 text-blue-700',
  cancelled: 'bg-red-100 text-red-700',
}

export default function AdminPanel() {
  const [tab, setTab] = useState<Tab>('enquiries')
  const [enquiries, setEnquiries] = useState<Enquiry[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [posts, setPosts] = useState<Post[]>([])
  const [fares, setFares] = useState<Record<string, Record<string, number>>>(DEFAULT_FARES)
  const [loading, setLoading] = useState(false)
  const [notes, setNotes] = useState<Record<string, string>>({})
  const [driverForm, setDriverForm] = useState({ name: '', mobile: '', vehicle: '', vehicleNumber: '', vehicleType: 'dzire', licenseNumber: '', experience: '' })
  const [faresSaved, setFaresSaved] = useState(false)

  useEffect(() => { loadTab() }, [tab])

  async function loadTab() {
    setLoading(true)
    try {
      if (tab === 'enquiries') setEnquiries(await getEnquiries())
      if (tab === 'bookings') setBookings(await getAllBookings(50))
      if (tab === 'drivers') setDrivers(await getDrivers())
      if (tab === 'community') setPosts(await getPosts())
      if (tab === 'fares') { const f = await getFares(); if (f) setFares(f) }
    } finally { setLoading(false) }
  }

  async function updateEnquiry(id: string, status: Enquiry['status']) {
    await updateEnquiryStatus(id, status, notes[id])
    setEnquiries(e => e.map(x => x.id === id ? { ...x, status } : x))
  }

  async function updatePost(id: string, status: Post['status']) {
    await updatePostStatus(id, status)
    setPosts(p => p.map(x => x.id === id ? { ...x, status } : x))
  }

  async function handleAddDriver(e: React.FormEvent) {
    e.preventDefault()
    await addDriver({ ...driverForm, experience: Number(driverForm.experience), totalTrips: 0, rating: 5, dues: 0, status: 'available', joinedAt: new Date().toISOString() })
    setDriverForm({ name: '', mobile: '', vehicle: '', vehicleNumber: '', vehicleType: 'dzire', licenseNumber: '', experience: '' })
    loadTab()
  }

  async function handleSaveFares() {
    await saveFares(fares)
    setFaresSaved(true)
    setTimeout(() => setFaresSaved(false), 3000)
  }

  const inputCls = "w-full border border-black/15 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F5C518]"

  const TABS: { key: Tab; label: string; icon: string }[] = [
    { key: 'enquiries', label: 'Enquiries', icon: '📋' },
    { key: 'bookings', label: 'Bookings', icon: '🎫' },
    { key: 'drivers', label: 'Drivers', icon: '🚕' },
    { key: 'community', label: 'Community', icon: '❤️' },
    { key: 'fares', label: 'Fares', icon: '💰' },
  ]

  return (
    <div className="min-h-screen bg-[#0F0E0B] text-white">
      {/* Top bar */}
      <div className="bg-[#1A1916] border-b border-white/5 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <Link href="/" className="font-syne font-extrabold text-[#F5C518] text-lg flex items-center gap-2">🚕 i Cab</Link>
          <span className="text-xs text-white/20">Admin Panel</span>
        </div>
        <button onClick={() => logOut()} className="text-xs text-white/40 hover:text-white transition-colors">Logout →</button>
      </div>

      {/* Stat pills */}
      <div className="bg-[#1A1916] border-b border-white/5 px-6 py-3 flex gap-4 overflow-x-auto">
        {[
          { label: 'New Enquiries', val: enquiries.filter(e => e.status === 'new').length, color: 'text-[#F5C518]' },
          { label: 'Total Enquiries', val: enquiries.length, color: 'text-white' },
          { label: 'Active Drivers', val: drivers.filter(d => d.status === 'available').length, color: 'text-green-400' },
          { label: 'Pending Posts', val: posts.filter(p => p.status === 'pending').length, color: 'text-blue-400' },
        ].map(s => (
          <div key={s.label} className="flex-shrink-0 bg-white/5 rounded-lg px-4 py-2">
            <div className={`font-syne font-bold text-xl ${s.color}`}>{s.val}</div>
            <div className="text-xs text-white/30">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="bg-[#1A1916] border-b border-white/5 px-6 flex gap-0">
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 px-4 py-3.5 text-sm font-bold border-b-2 transition-colors ${tab === t.key ? 'border-[#F5C518] text-[#F5C518]' : 'border-transparent text-white/30 hover:text-white/60'}`}>
            {t.icon} <span className="hidden sm:inline">{t.label}</span>
          </button>
        ))}
      </div>

      <div className="p-6 max-w-5xl mx-auto">
        {loading && <div className="text-center py-20 text-white/30">Loading…</div>}

        {/* ENQUIRIES */}
        {!loading && tab === 'enquiries' && (
          <div className="space-y-4">
            <h2 className="font-syne font-bold text-xl">Enquiries ({enquiries.length})</h2>
            {enquiries.length === 0 && <p className="text-white/30 text-sm">No enquiries yet</p>}
            {enquiries.map(e => (
              <div key={e.id} className="bg-[#1A1916] rounded-xl p-5 border border-white/5">
                <div className="flex items-start justify-between mb-3 flex-wrap gap-2">
                  <div>
                    <div className="font-bold">{e.customerName} <span className="text-white/40 font-normal text-sm">· {e.type}</span></div>
                    <div className="text-sm text-white/50">
                      <a href={`tel:${e.customerMobile}`} className="text-[#F5C518] hover:underline">{e.customerMobile}</a>
                      {e.from && e.to && <span> · {e.from} → {e.to}</span>}
                      {e.vehicle && <span> · {e.vehicle}</span>}
                    </div>
                    {e.travelDate && <div className="text-xs text-white/30 mt-1">📅 {e.travelDate} {e.pickupTime && `at ${e.pickupTime}`}</div>}
                    {e.estimatedFare && <div className="text-xs text-[#F5C518] mt-1">Est. {formatINR(e.estimatedFare)}</div>}
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${STATUS_COLORS[e.status]}`}>{e.status}</span>
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <input value={notes[e.id!] || ''} onChange={ev => setNotes(n => ({ ...n, [e.id!]: ev.target.value }))}
                    placeholder="Add note…" className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs flex-1 min-w-40 focus:outline-none focus:border-[#F5C518]/50 text-white" />
                  {(['called', 'confirmed', 'rejected'] as Enquiry['status'][]).map(s => (
                    <button key={s} onClick={() => updateEnquiry(e.id!, s)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${e.status === s ? 'bg-[#F5C518] text-brand-black' : 'bg-white/10 hover:bg-white/20'}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* BOOKINGS */}
        {!loading && tab === 'bookings' && (
          <div className="space-y-4">
            <h2 className="font-syne font-bold text-xl">Bookings</h2>
            {bookings.length === 0 && <p className="text-white/30 text-sm">No bookings yet</p>}
            {bookings.map(b => (
              <div key={b.id} className="bg-[#1A1916] rounded-xl p-5 border border-white/5">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-bold">{b.from} → {b.to}</div>
                    <div className="text-sm text-white/50">{b.customerName} · {b.customerMobile}</div>
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${STATUS_COLORS[b.status]}`}>{b.status}</span>
                </div>
                <div className="text-xs text-white/30">{b.travelDate} · {b.vehicle} · {formatINR(b.amount)}</div>
                {b.driverName && <div className="text-xs text-[#F5C518] mt-1">Driver: {b.driverName} ({b.driverMobile})</div>}
              </div>
            ))}
          </div>
        )}

        {/* DRIVERS */}
        {!loading && tab === 'drivers' && (
          <div className="space-y-6">
            {/* Add driver form */}
            <div className="bg-[#1A1916] rounded-xl p-5 border border-white/5">
              <h3 className="font-syne font-bold mb-4">Add Driver</h3>
              <form onSubmit={handleAddDriver} className="grid grid-cols-2 gap-3">
                {[
                  { key: 'name', placeholder: 'Full Name' },
                  { key: 'mobile', placeholder: 'Mobile' },
                  { key: 'vehicle', placeholder: 'Vehicle Name (e.g. Swift Dzire)' },
                  { key: 'vehicleNumber', placeholder: 'OD-XX-XXXX' },
                  { key: 'licenseNumber', placeholder: 'License Number' },
                  { key: 'experience', placeholder: 'Years of Experience', type: 'number' },
                ].map(f => (
                  <input key={f.key} placeholder={f.placeholder} type={f.type || 'text'} required
                    value={(driverForm as any)[f.key]} onChange={e => setDriverForm(d => ({ ...d, [f.key]: e.target.value }))}
                    className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#F5C518]/50 placeholder:text-white/20" />
                ))}
                <select value={driverForm.vehicleType} onChange={e => setDriverForm(d => ({ ...d, vehicleType: e.target.value }))}
                  className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none">
                  <option value="dzire">Dzire</option>
                  <option value="ertiga">Ertiga</option>
                  <option value="innova">Innova</option>
                  <option value="suv">SUV</option>
                </select>
                <button type="submit" className="bg-[#F5C518] text-brand-black font-bold py-2 rounded-lg text-sm hover:bg-[#C9990A] transition-colors">Add Driver</button>
              </form>
            </div>

            {/* Driver list */}
            <div className="space-y-3">
              <h3 className="font-syne font-bold">All Drivers ({drivers.length})</h3>
              {drivers.map(d => (
                <div key={d.id} className="bg-[#1A1916] rounded-xl p-4 border border-white/5 flex items-start justify-between">
                  <div>
                    <div className="font-bold">{d.name}</div>
                    <div className="text-sm text-white/50">{d.vehicle} · {d.vehicleNumber}</div>
                    <div className="text-xs text-white/30 mt-1">⭐ {d.rating} · {d.totalTrips} trips · {d.experience}y exp</div>
                    <a href={`tel:${d.mobile}`} className="text-xs text-[#F5C518] hover:underline">{d.mobile}</a>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${d.status === 'available' ? 'bg-green-900/50 text-green-400' : 'bg-white/10 text-white/40'}`}>
                    {d.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* COMMUNITY */}
        {!loading && tab === 'community' && (
          <div className="space-y-4">
            <h2 className="font-syne font-bold text-xl">Community Posts</h2>
            {posts.map(p => (
              <div key={p.id} className="bg-[#1A1916] rounded-xl p-5 border border-white/5">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="font-bold text-sm">{p.authorName} <span className="text-2xl ml-1">{p.emoji}</span></div>
                    <p className="text-sm text-white/60 mt-1">{p.caption}</p>
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0 ml-3 ${STATUS_COLORS[p.status]}`}>{p.status}</span>
                </div>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => updatePost(p.id!, 'live')} className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${p.status === 'live' ? 'bg-green-600 text-white' : 'bg-white/10 hover:bg-white/20'}`}>Approve</button>
                  <button onClick={() => updatePost(p.id!, 'removed')} className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${p.status === 'removed' ? 'bg-red-600 text-white' : 'bg-white/10 hover:bg-white/20'}`}>Remove</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* FARES */}
        {!loading && tab === 'fares' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-syne font-bold text-xl">Fare Management</h2>
              <button onClick={handleSaveFares} className="bg-[#F5C518] text-brand-black font-bold px-5 py-2 rounded-xl text-sm hover:bg-[#C9990A] transition-colors">
                {faresSaved ? '✅ Saved!' : 'Save Fares'}
              </button>
            </div>
            <p className="text-sm text-white/40">Edit one-way fares per vehicle. Round-trip = ×1.85</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-white/40 text-xs">
                    <th className="text-left py-2 pr-4">Destination</th>
                    <th className="py-2 px-2">Dzire</th>
                    <th className="py-2 px-2">Ertiga</th>
                    <th className="py-2 px-2">Innova</th>
                    <th className="py-2 px-2">SUV</th>
                  </tr>
                </thead>
                <tbody className="space-y-2">
                  {Object.keys(fares).map(dest => (
                    <tr key={dest} className="border-t border-white/5">
                      <td className="py-2 pr-4 font-medium text-white/70">{dest}</td>
                      {['dzire', 'ertiga', 'innova', 'suv'].map(v => (
                        <td key={v} className="py-2 px-2">
                          <input type="number" value={fares[dest]?.[v] ?? 0}
                            onChange={e => setFares(f => ({ ...f, [dest]: { ...f[dest], [v]: Number(e.target.value) } }))}
                            className="w-20 bg-white/5 border border-white/10 rounded px-2 py-1 text-center text-white focus:outline-none focus:border-[#F5C518]/50 text-xs" />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
