import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'i Cab — Odisha\'s Trusted Travel Partner',
  description: 'Intercity cab booking, bus, train enquiries & tour packages from Jajpur / Vyasanagar, Odisha. Fixed fares, trusted drivers.',
  keywords: 'cab booking jajpur, vyasanagar cab, odisha travel, puri cab, intercity taxi',
  openGraph: {
    title: 'i Cab — Travel from Jajpur made easy',
    description: 'Fixed-fare intercity cabs, tour packages & travel enquiries from Vyasanagar, Odisha.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
