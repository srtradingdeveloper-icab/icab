'use client'
import { useState, useRef, useEffect } from 'react'

type Msg = { role: 'user' | 'ai'; text: string }

const FAQS: Record<string, string> = {
  'price': 'Our fares are fixed! Cuttack starts at ₹1,800, Bhubaneswar at ₹2,500, and Puri at ₹7,500. No surge, ever. Want to see the full fare list?',
  'fare': 'Our fares are fixed! Cuttack starts at ₹1,800, Bhubaneswar at ₹2,500, and Puri at ₹7,500. No surge, ever.',
  'cost': 'Our fares are fixed and transparent. Type "fare list" to see all prices.',
  'puri': '🏖️ Puri trip: Dzire ₹7,500 · Ertiga ₹9,000 · Innova ₹11,000 · SUV ₹13,500. Round-trip adds ~85%. Want to book?',
  'bhubaneswar': '🌆 Bhubaneswar: Dzire ₹2,500 · Ertiga ₹3,200 · Innova ₹3,800 · SUV ₹4,500.',
  'cuttack': '🌉 Cuttack: Dzire ₹1,800 · Ertiga ₹2,400 · Innova ₹3,000 · SUV ₹3,600.',
  'konark': '🛕 Konark: Dzire ₹3,500 · Ertiga ₹4,500 · Innova ₹5,500 · SUV ₹6,500.',
  'chilika': '🐬 Chilika Lake: Dzire ₹4,000 · Ertiga ₹5,200 · Innova ₹6,500 · SUV ₹8,000.',
  'book': '📱 To book: fill the form above, WhatsApp us at +91 70080 00000, or sign up for instant booking. Our team confirms within 30 minutes!',
  'booking': '📱 Easy! Submit the form on this page with your destination & details. We call you within 30 minutes to confirm.',
  'driver': '✅ All drivers are verified, licensed and local. You get their name, number and vehicle details once confirmed.',
  'cancel': '🔄 Cancellations accepted up to 2 hours before pickup. Contact us via WhatsApp for immediate assistance.',
  'payment': '💳 Pay after your trip — cash or UPI accepted. Online payments coming in Phase 2!',
  'tour': '🗺️ We have 1-day to 5-day tour packages covering Puri, Konark, Chilika & more. Want details?',
  'monthly': '📅 Monthly passes for office commuters! Vyasanagar → BBSR/Cuttack. Contact us for bulk pricing.',
  'train': '🚆 We help with IRCTC tatkal & regular ticket booking. Submit an enquiry and we guide you through.',
  'bus': '🚌 We book sleeper, semi-sleeper & Volvo seats on all major operators from Jajpur Road.',
  'hello': '👋 Hello! I\'m i Cab AI, your travel assistant. Ask me about fares, destinations, booking, or anything i Cab!',
  'hi': '👋 Hi there! I\'m i Cab AI. How can I help you plan your trip today?',
  'help': '💡 I can help with: fare quotes, destinations, booking process, payment, cancellation, driver info, tour packages. What do you need?',
}

function getReply(input: string): string {
  const lower = input.toLowerCase()
  for (const [key, reply] of Object.entries(FAQS)) {
    if (lower.includes(key)) return reply
  }
  return `I can help with cab fares, destinations, booking process and more! Try asking about "Puri fare", "how to book", or "payment options". For urgent help, WhatsApp us at +91 70080 00000 🚕`
}

const QUICK = ['Puri fare?', 'How to book?', 'Bhubaneswar price', 'Cancel policy']

export default function AIWidget() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [msgs, setMsgs] = useState<Msg[]>([{ role: 'ai', text: '👋 Hi! I\'m i Cab AI. Ask me about fares, destinations or how to book!' }])
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [msgs])

  function send(text?: string) {
    const q = text || input.trim()
    if (!q) return
    setInput('')
    setMsgs(m => [...m, { role: 'user', text: q }])
    setTimeout(() => setMsgs(m => [...m, { role: 'ai', text: getReply(q) }]), 400)
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-24 right-6 z-50 bg-brand-black text-[#F5C518] w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
        aria-label="i Cab AI Chat"
      >
        {open ? '✕' : '🤖'}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-44 right-6 z-50 w-80 bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-black/10" style={{ height: 420 }}>
          {/* Header */}
          <div className="bg-brand-black text-white px-4 py-3 flex items-center gap-3">
            <div className="w-8 h-8 bg-[#F5C518] rounded-full flex items-center justify-center text-sm">🤖</div>
            <div>
              <div className="font-syne font-bold text-sm">i Cab AI</div>
              <div className="text-xs text-white/40">Travel Assistant · Always on</div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {msgs.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] text-sm px-3 py-2 rounded-2xl leading-relaxed ${m.role === 'user' ? 'bg-[#F5C518] text-brand-black rounded-br-sm' : 'bg-black/5 text-brand-black rounded-bl-sm'}`}>
                  {m.text}
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>

          {/* Quick replies */}
          <div className="px-3 py-2 flex gap-2 overflow-x-auto border-t border-black/5">
            {QUICK.map(q => (
              <button key={q} onClick={() => send(q)}
                className="flex-shrink-0 text-xs bg-black/5 hover:bg-[#F5C518]/30 px-3 py-1.5 rounded-full font-medium transition-colors">
                {q}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-black/5 flex gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="Ask anything…"
              className="flex-1 bg-black/5 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F5C518]"
            />
            <button onClick={() => send()} className="bg-[#F5C518] px-3 py-2 rounded-xl text-sm font-bold hover:bg-[#C9990A] transition-colors">→</button>
          </div>
        </div>
      )}
    </>
  )
}
