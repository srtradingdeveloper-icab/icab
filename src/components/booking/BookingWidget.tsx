'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { calcFare, formatINR, DEFAULT_DESTINATIONS } from '@/lib/fares'

type Vehicle = 'dzire' | 'ertiga' | 'innova' | 'suv'
type TripType = 'one-way' | 'round-trip'

const VEHICLES: { key: Vehicle; label: string; seats: number; icon: string }[] = [
  { key: 'dzire', label: 'Dzire', seats: 4, icon: '🚗' },
  { key: 'ertiga', label: 'Ertiga', seats: 6, icon: '🚐' },
  { key: 'innova', label: 'Innova', seats: 7, icon: '🚙' },
  { key: 'suv', label: 'SUV', seats: 8, icon: '🛻' },
]

export default function BookingWidget() {
  const router = useRouter()
  const [dest, setDest] = useState('')
  const [vehicle, setVehicle] = useState<Vehicle>('dzire')
  const [tripType, setTripType] = useState<TripType>('one-way')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [name, setName] = useState('')
  const [mobile, setMobile] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [step, setStep] = useState<1 | 2>(1)

  const fare = dest ? calcFare(dest, vehicle) : null
  const displayFare = fare ? (tripType === 'one-way' ? fare.oneWay : fare.roundTrip) : null

  const today = new Date().toISOString().split('T')[0]

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'cab',
          customerName: name,
          customerMobile: mobile,
          from: 'Vyasanagar',
          to: dest,
          vehicle,
          tripType,
          travelDate: date,
          pickupTime: time,
          estimatedFare: displayFare,
        }),
      })
      if (!res.ok) throw new Error('Submission failed')
      setSuccess(true)
    } catch {
      setError('Something went wrong. Please try via WhatsApp.')
    } finally { setLoading(false) }
  }

  if (success) {
    return (
      <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
        <div className="text-5xl mb-4">✅</div>
        <h3 className="font-syne font-bold text-xl mb-2">Enquiry Received!</h3>
        <p className="text-black/60 text-sm mb-1">Our team will call you within <strong>30 minutes</strong></p>
        <p className="text-black/40 text-xs mb-6">Booking ref will be shared via SMS</p>
        <button onClick={() => { setSuccess(false); setStep(1); setName(''); setMobile(''); setDest('') }}
          className="w-full bg-[#F5C518] font-bold py-3 rounded-xl hover:bg-[#C9990A] transition-colors">
          Book Another Ride
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-brand-black px-6 pt-6 pb-4">
        <h3 className="font-syne font-bold text-white text-lg">Book Your Ride</h3>
        <p className="text-white/40 text-xs mt-0.5">From Vyasanagar · Fixed Fare · No Surge</p>
        {/* Step indicator */}
        <div className="flex gap-2 mt-4">
          {[1, 2].map(s => (
            <div key={s} className={`h-1 flex-1 rounded-full transition-colors ${s <= step ? 'bg-[#F5C518]' : 'bg-white/20'}`} />
          ))}
        </div>
      </div>

      <div className="p-6">
        {step === 1 ? (
          <div className="space-y-4">
            {/* Destination */}
            <div>
              <label className="text-xs font-bold text-black/50 uppercase tracking-wider block mb-1.5">Destination</label>
              <select value={dest} onChange={e => setDest(e.target.value)} className="w-full border-2 border-black/10 rounded-xl px-4 py-3 text-sm focus:border-[#F5C518] focus:outline-none bg-white">
                <option value="">Select destination…</option>
                {DEFAULT_DESTINATIONS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            {/* Trip type */}
            <div>
              <label className="text-xs font-bold text-black/50 uppercase tracking-wider block mb-1.5">Trip Type</label>
              <div className="grid grid-cols-2 gap-2">
                {(['one-way', 'round-trip'] as TripType[]).map(t => (
                  <button key={t} type="button" onClick={() => setTripType(t)}
                    className={`py-2.5 rounded-xl text-sm font-bold border-2 transition-colors ${tripType === t ? 'border-[#F5C518] bg-[#F5C518]/10 text-brand-black' : 'border-black/10 text-black/50'}`}>
                    {t === 'one-way' ? '→ One Way' : '⇄ Round Trip'}
                  </button>
                ))}
              </div>
            </div>

            {/* Vehicle */}
            <div>
              <label className="text-xs font-bold text-black/50 uppercase tracking-wider block mb-1.5">Vehicle</label>
              <div className="grid grid-cols-2 gap-2">
                {VEHICLES.map(v => (
                  <button key={v.key} type="button" onClick={() => setVehicle(v.key)}
                    className={`py-2.5 px-3 rounded-xl text-sm font-bold border-2 transition-colors flex items-center gap-2 ${vehicle === v.key ? 'border-[#F5C518] bg-[#F5C518]/10' : 'border-black/10 text-black/50'}`}>
                    <span>{v.icon}</span>
                    <span>{v.label}</span>
                    <span className="ml-auto text-xs text-black/30">×{v.seats}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Fare display */}
            {displayFare && (
              <div className="bg-[#F5C518]/15 rounded-xl px-4 py-3 flex items-center justify-between">
                <span className="text-sm font-bold text-brand-black/70">Estimated Fare</span>
                <span className="font-syne font-extrabold text-xl text-brand-black">{formatINR(displayFare)}</span>
              </div>
            )}

            <button onClick={() => setStep(2)} disabled={!dest}
              className="w-full bg-[#F5C518] font-bold py-3 rounded-xl hover:bg-[#C9990A] transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
              Continue →
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-black/50 uppercase tracking-wider block mb-1.5">Travel Date</label>
              <input type="date" min={today} value={date} onChange={e => setDate(e.target.value)} required
                className="w-full border-2 border-black/10 rounded-xl px-4 py-3 text-sm focus:border-[#F5C518] focus:outline-none" />
            </div>
            <div>
              <label className="text-xs font-bold text-black/50 uppercase tracking-wider block mb-1.5">Pickup Time</label>
              <input type="time" value={time} onChange={e => setTime(e.target.value)} required
                className="w-full border-2 border-black/10 rounded-xl px-4 py-3 text-sm focus:border-[#F5C518] focus:outline-none" />
            </div>
            <div>
              <label className="text-xs font-bold text-black/50 uppercase tracking-wider block mb-1.5">Your Name</label>
              <input type="text" placeholder="Full name" value={name} onChange={e => setName(e.target.value)} required
                className="w-full border-2 border-black/10 rounded-xl px-4 py-3 text-sm focus:border-[#F5C518] focus:outline-none" />
            </div>
            <div>
              <label className="text-xs font-bold text-black/50 uppercase tracking-wider block mb-1.5">Mobile Number</label>
              <input type="tel" placeholder="+91 XXXXX XXXXX" value={mobile} onChange={e => setMobile(e.target.value)} required
                className="w-full border-2 border-black/10 rounded-xl px-4 py-3 text-sm focus:border-[#F5C518] focus:outline-none" />
            </div>
            {error && <p className="text-red-500 text-sm bg-red-50 rounded-xl px-4 py-3">{error}</p>}
            <div className="flex gap-2">
              <button type="button" onClick={() => setStep(1)} className="flex-1 border-2 border-black/10 font-bold py-3 rounded-xl text-sm hover:bg-black/5 transition-colors">← Back</button>
              <button type="submit" disabled={loading} className="flex-1 bg-[#F5C518] font-bold py-3 rounded-xl hover:bg-[#C9990A] transition-colors disabled:opacity-50">
                {loading ? 'Booking…' : 'Confirm Enquiry'}
              </button>
            </div>
            <p className="text-center text-xs text-black/40">Our team calls within 30 mins to confirm</p>
          </form>
        )}
      </div>
    </div>
  )
}
