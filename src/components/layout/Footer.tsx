import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-brand-black text-white py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="font-syne font-extrabold text-2xl text-[#F5C518] mb-3">🚕 i Cab</div>
            <p className="text-white/50 text-sm leading-relaxed">
              Intercity travel from Jajpur & Vyasanagar. Fixed fares, no surge pricing — ever.
            </p>
            <div className="flex gap-3 mt-5">
              <a href="https://wa.me/917008000000" className="bg-[#25D366] text-white w-9 h-9 rounded-full flex items-center justify-center hover:scale-110 transition-transform" aria-label="WhatsApp">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.117 1.528 5.847L.057 23.943l6.264-1.449A11.939 11.939 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.946a9.931 9.931 0 0 1-5.064-1.382l-.363-.215-3.761.869.946-3.654-.236-.374A9.93 9.93 0 0 1 2.054 12C2.054 6.509 6.509 2.054 12 2.054S21.946 6.509 21.946 12 17.491 21.946 12 21.946z"/></svg>
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-syne font-bold text-sm tracking-widest uppercase text-[#F5C518] mb-4">Services</h4>
            <ul className="space-y-2 text-sm text-white/50">
              <li><Link href="/auth" className="hover:text-white transition-colors">Cab Booking</Link></li>
              <li><Link href="/auth" className="hover:text-white transition-colors">Bus Tickets</Link></li>
              <li><Link href="/auth" className="hover:text-white transition-colors">Train Booking</Link></li>
              <li><Link href="/auth" className="hover:text-white transition-colors">Tour Packages</Link></li>
              <li><Link href="/auth" className="hover:text-white transition-colors">Monthly Pass</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-syne font-bold text-sm tracking-widest uppercase text-[#F5C518] mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-white/50">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Driver Partner</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-syne font-bold text-sm tracking-widest uppercase text-[#F5C518] mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-white/50">
              <li>📍 Vyasanagar, Jajpur, Odisha</li>
              <li>📞 <a href="tel:+917008000000" className="hover:text-white transition-colors">+91 70080 00000</a></li>
              <li>✉️ <a href="mailto:hello@icab.in" className="hover:text-white transition-colors">hello@icab.in</a></li>
              <li className="pt-2 text-white/30 text-xs">Mon–Sat, 7am–9pm</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-white/30">
          <p>© {new Date().getFullYear()} i Cab. All rights reserved.</p>
          <div className="flex gap-5">
            <a href="#" className="hover:text-white/60 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white/60 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
