import Link from 'next/link'

const FLEET = [
  {
    emoji: '🚗',
    name: 'Swift Dzire',
    tag: 'Economy',
    tagColor: 'bg-green-100 text-green-700',
    seats: 4,
    ac: true,
    desc: 'Perfect for couples & small families. Comfortable for up to 400 km.',
    startPrice: 1800,
  },
  {
    emoji: '🚐',
    name: 'Ertiga',
    tag: 'Comfort',
    tagColor: 'bg-blue-100 text-blue-700',
    seats: 6,
    ac: true,
    desc: 'Spacious for families of 6. Extra luggage space. Great for Puri & Konark.',
    startPrice: 2400,
  },
  {
    emoji: '🚙',
    name: 'Innova Crysta',
    tag: 'Premium',
    tagColor: 'bg-[#F5C518]/30 text-[#8B6D00]',
    seats: 7,
    ac: true,
    desc: 'Long-distance king. Plush seating, quiet ride. Best for overnight journeys.',
    startPrice: 3000,
  },
  {
    emoji: '🛻',
    name: 'SUV / Fortuner',
    tag: 'Luxury',
    tagColor: 'bg-purple-100 text-purple-700',
    seats: 8,
    ac: true,
    desc: 'Maximum space & prestige. Ideal for corporate travel & large group tours.',
    startPrice: 3600,
  },
]

export default function FleetCards() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      {FLEET.map(v => (
        <Link key={v.name} href="/auth" className="group bg-white rounded-2xl overflow-hidden border-2 border-black/5 hover:border-[#F5C518] hover:shadow-lg transition-all">
          {/* Car emoji display */}
          <div className="bg-gradient-to-br from-[#F5C518]/20 to-[#F5C518]/5 h-36 flex items-center justify-center text-7xl">
            {v.emoji}
          </div>
          <div className="p-5">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-syne font-bold">{v.name}</h3>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${v.tagColor}`}>{v.tag}</span>
            </div>
            <p className="text-xs text-black/50 mb-3 leading-relaxed">{v.desc}</p>
            <div className="flex items-center gap-3 text-xs text-black/40 mb-4">
              <span>👥 {v.seats} seats</span>
              {v.ac && <span>❄️ AC</span>}
            </div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-black/40">Starts at</span>
                <div className="font-syne font-bold text-brand-black">₹{v.startPrice.toLocaleString('en-IN')}</div>
              </div>
              <span className="text-xs font-bold text-[#C9990A] group-hover:underline">Book →</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
