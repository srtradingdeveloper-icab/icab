const STEPS = [
  { n: '01', icon: '📍', title: 'Select Destination', desc: 'Pick your destination from our fare list. See the fixed price instantly — no hidden charges.' },
  { n: '02', icon: '📞', title: 'Submit Enquiry', desc: 'Fill in your details online or WhatsApp us. Our team confirms your booking within 30 minutes.' },
  { n: '03', icon: '🚕', title: 'Driver Assigned', desc: 'A verified driver is assigned to your trip. You get their name, number & vehicle details.' },
  { n: '04', icon: '🎉', title: 'Travel & Enjoy', desc: 'Your driver arrives on time. Pay after the trip. Earn i Cab Points on every ride.' },
]

export default function HowItWorks() {
  return (
    <section id="how" className="py-20 px-6 bg-brand-black text-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-xs font-bold tracking-[.15em] uppercase text-[#F5C518]/60 mb-3">Simple Process</p>
          <h2 className="font-syne font-extrabold text-4xl">How i Cab Works</h2>
        </div>
        <div className="grid md:grid-cols-4 gap-8 relative">
          {/* Connector line (desktop) */}
          <div className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-px bg-[#F5C518]/20" />
          {STEPS.map((s, i) => (
            <div key={s.n} className="relative text-center">
              <div className="w-20 h-20 rounded-2xl bg-[#F5C518]/10 border border-[#F5C518]/20 flex flex-col items-center justify-center mx-auto mb-5 relative z-10">
                <span className="text-3xl">{s.icon}</span>
              </div>
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-[#F5C518] text-brand-black text-xs font-bold px-2 py-0.5 rounded-full z-20">{s.n}</div>
              <h3 className="font-syne font-bold text-lg mb-2 text-white">{s.title}</h3>
              <p className="text-sm text-white/40 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
