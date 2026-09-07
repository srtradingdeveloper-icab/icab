import Link from 'next/link'

const SERVICES = [
  {
    icon: '🚕',
    title: 'Cab Booking',
    desc: 'Fixed-fare intercity cabs from Vyasanagar. Dzire, Ertiga, Innova & SUV. Book online, confirm in 30 mins.',
    badge: 'Most Popular',
    badgeColor: 'bg-[#F5C518]',
    cta: 'Book a Cab',
  },
  {
    icon: '🚌',
    title: 'Bus Tickets',
    desc: 'Sleeper, semi-sleeper & Volvo from Jajpur Road. All major operators. Enquiry & seat confirmation.',
    badge: 'Enquiry Mode',
    badgeColor: 'bg-blue-100 text-blue-700',
    cta: 'Enquire Now',
  },
  {
    icon: '🚆',
    title: 'Train Booking',
    desc: 'IRCTC tatkal & regular booking assistance. We help you get confirmed seats with no hassle.',
    badge: 'Assisted Booking',
    badgeColor: 'bg-green-100 text-green-700',
    cta: 'Get Help',
  },
  {
    icon: '🏖️',
    title: 'Tour Packages',
    desc: 'Puri, Chilika, Konark circuits. 1-day to 5-day packages with driver + stay options.',
    badge: 'Curated',
    badgeColor: 'bg-orange-100 text-orange-700',
    cta: 'View Packages',
  },
  {
    icon: '📅',
    title: 'Monthly Pass',
    desc: 'Daily office commuters from Vyasanagar to Jajpur Road, Cuttack, BBSR. Fixed monthly rates.',
    badge: 'Save up to 30%',
    badgeColor: 'bg-purple-100 text-purple-700',
    cta: 'Know More',
  },
  {
    icon: '✈️',
    title: 'Airport Transfers',
    desc: 'Bhubaneswar Airport drops & pickups. Flight tracking included. Never miss a flight again.',
    badge: 'Punctual',
    badgeColor: 'bg-sky-100 text-sky-700',
    cta: 'Book Transfer',
  },
]

export default function ServiceCards() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {SERVICES.map(s => (
        <Link key={s.title} href="/auth" className="group bg-white rounded-2xl p-6 border-2 border-black/5 hover:border-[#F5C518] hover:shadow-lg transition-all">
          <div className="flex items-start justify-between mb-4">
            <span className="text-4xl">{s.icon}</span>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${s.badgeColor}`}>{s.badge}</span>
          </div>
          <h3 className="font-syne font-bold text-lg mb-2 group-hover:text-[#C9990A] transition-colors">{s.title}</h3>
          <p className="text-sm text-black/50 leading-relaxed mb-4">{s.desc}</p>
          <div className="text-sm font-bold text-[#C9990A] group-hover:underline">{s.cta} →</div>
        </Link>
      ))}
    </div>
  )
}
