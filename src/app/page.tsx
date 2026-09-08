/**
 * i Cab Homepage — /
 * This is a React Server Component. The interactive booking widget
 * is a client component imported below.
 */
import type { Metadata } from 'next'
import Link from 'next/link'
import BookingWidget from '@/components/booking/BookingWidget'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import StatsBar from '@/components/ui/StatsBar'
import ServiceCards from '@/components/ui/ServiceCards'
import FleetCards from '@/components/ui/FleetCards'
import HowItWorks from '@/components/ui/HowItWorks'
import CommunityPreview from '@/components/community/CommunityPreview'
import AIWidget from '@/components/ui/AIWidget'

export const metadata: Metadata = {
  title: 'i Cab — Cab Booking from Jajpur | Intercity Travel Odisha',
}

export default function HomePage() {
  return (
    <>
      <Navbar />

      {/* ── HERO ── */}
      <section className="bg-[#F5C518] min-h-[90vh] flex flex-col justify-center relative overflow-hidden px-6 py-20">
        {/* Background decorative circles */}
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-white/10 pointer-events-none" />
        <div className="absolute -bottom-40 -left-20 w-[400px] h-[400px] rounded-full bg-black/5 pointer-events-none" />

        <div className="max-w-6xl mx-auto w-full relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: headline */}
            <div>
              <p className="text-xs font-bold tracking-[.2em] uppercase text-black/50 mb-4">
                Jajpur · Vyasanagar · Odisha
              </p>
              <h1 className="font-syne font-extrabold text-5xl lg:text-6xl leading-[1.05] tracking-tight text-brand-black mb-6 text-balance">
                Travel Odisha<br />
                <span className="relative">
                  Your Way
                  <svg className="absolute -bottom-2 left-0 w-full" height="6" viewBox="0 0 200 6" preserveAspectRatio="none">
                    <path d="M0 3 Q50 0 100 3 Q150 6 200 3" stroke="#0F0E0B" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                  </svg>
                </span>
              </h1>
              <p className="text-brand-black/70 text-lg font-medium leading-relaxed mb-8 max-w-md">
                Fixed-fare intercity cabs, tours & travel assistance — trusted by thousands from Vyasanagar. No surge pricing. Ever.
              </p>
              <div className="flex gap-3 flex-wrap">
                <Link href="/auth" className="bg-brand-black text-[#F5C518] font-syne font-bold px-7 py-3.5 rounded-full text-sm hover:scale-105 transition-transform inline-flex items-center gap-2">
                  Book Now →
                </Link>
                <a href="https://wa.me/919937404945" className="bg-white/80 text-brand-black font-bold px-7 py-3.5 rounded-full text-sm hover:bg-white transition-colors inline-flex items-center gap-2">
                  WhatsApp Us
                </a>
              </div>
            </div>

            {/* Right: booking widget */}
            <BookingWidget />
          </div>
        </div>
      </section>

      {/* Animated road strip */}
      <div className="h-10 bg-brand-black overflow-hidden flex items-center">
        <div className="flex animate-road whitespace-nowrap gap-8">
          {Array.from({ length: 40 }).map((_, i) => (
            <span key={i} className="inline-block w-12 h-1.5 bg-[#F5C518] rounded-full flex-shrink-0" />
          ))}
        </div>
      </div>

      {/* Stats */}
      <StatsBar />

      {/* Services */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-bold tracking-[.15em] uppercase text-brand-mid mb-3">What We Offer</p>
            <h2 className="font-syne font-extrabold text-4xl tracking-tight">All Your Travel Needs</h2>
          </div>
          <ServiceCards />
        </div>
      </section>

      {/* Fleet */}
      <section className="py-20 px-6 bg-[#FFFBEB]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-bold tracking-[.15em] uppercase text-brand-mid mb-3">Our Fleet</p>
            <h2 className="font-syne font-extrabold text-4xl tracking-tight">Choose Your Ride</h2>
          </div>
          <FleetCards />
        </div>
      </section>

      {/* How it Works */}
      <HowItWorks />

      {/* Community preview */}
      <section className="py-20 px-6 bg-[#FFFBEB]">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs font-bold tracking-[.15em] uppercase text-brand-mid mb-2">Community</p>
              <h2 className="font-syne font-extrabold text-3xl">Stories from Our Travelers</h2>
            </div>
            <Link href="/dashboard" className="text-sm font-bold text-[#C9990A] hover:underline">
              Share yours →
            </Link>
          </div>
          <CommunityPreview />
        </div>
      </section>

      {/* AI Widget */}
      <AIWidget />

      <Footer />

      {/* WhatsApp float button */}
      <a
        href="https://wa.me/919937404945"
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
        aria-label="WhatsApp"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.117 1.528 5.847L.057 23.943l6.264-1.449A11.939 11.939 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.946a9.931 9.931 0 0 1-5.064-1.382l-.363-.215-3.761.869.946-3.654-.236-.374A9.93 9.93 0 0 1 2.054 12C2.054 6.509 6.509 2.054 12 2.054S21.946 6.509 21.946 12 17.491 21.946 12 21.946z"/>
        </svg>
      </a>
    </>
  )
}
