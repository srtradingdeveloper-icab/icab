const STATS = [
  { value: '4,200+', label: 'Happy Travelers' },
  { value: '15+', label: 'Destinations' },
  { value: '₹0', label: 'Surge Pricing' },
  { value: '30 min', label: 'Avg Response' },
]

export default function StatsBar() {
  return (
    <section className="bg-[#FFFBEB] py-10 px-6 border-b border-black/5">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
        {STATS.map(s => (
          <div key={s.label} className="text-center">
            <div className="font-syne font-extrabold text-3xl text-brand-black">{s.value}</div>
            <div className="text-sm text-brand-black/50 font-medium mt-1">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
