# 🚕 i Cab — Travel Platform

**Intercity cab booking, bus/train enquiries, community & AI assistant — built for Jajpur/Vyasanagar, Odisha.**

## Tech Stack
- **Next.js 14** (App Router)
- **TypeScript** — strict mode
- **Tailwind CSS** — custom design tokens
- **Firebase** — Auth, Firestore, Storage
- **Resend** — transactional email (optional Phase 1)
- **Vercel** — hosting

---

## 🚀 Quick Start (Local Development)

### 1. Install dependencies
```bash
npm install
```

### 2. Set up Firebase
1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Create a new project called `icab`
3. Enable **Authentication** → Sign-in methods: **Email/Password** + **Google**
4. Enable **Firestore Database** (start in test mode → then apply security rules)
5. Go to Project Settings → Your apps → Web → Register app → Copy the config

### 3. Configure environment variables
```bash
cp .env.local.example .env.local
```
Edit `.env.local` with your Firebase config:
```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
NEXT_PUBLIC_ADMIN_EMAILS=connect.srtradingdeveloper@gmail.com
NEXT_PUBLIC_WHATSAPP_NUMBER=9937404945
```

### 4. Run locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

---

## 🔐 Admin Access

Set `NEXT_PUBLIC_ADMIN_EMAILS` in `.env.local` to your email.
Login with that email → auto-redirected to `/admin`.

---

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx          # Homepage
│   ├── auth/page.tsx     # Login / Sign Up
│   ├── dashboard/page.tsx # User Dashboard
│   ├── admin/page.tsx    # Admin Panel
│   └── api/enquiry/      # POST /api/enquiry
├── components/
│   ├── auth/AuthFlow.tsx
│   ├── booking/BookingWidget.tsx
│   ├── layout/ (Navbar, Footer, UserDashboard, AdminPanel)
│   ├── ui/ (StatsBar, ServiceCards, FleetCards, HowItWorks, AIWidget)
│   └── community/CommunityPreview.tsx
├── lib/
│   ├── firebase.ts       # Firebase init
│   ├── firestore.ts      # All DB operations
│   ├── auth.ts           # Auth helpers
│   └── fares.ts          # Fare table + calculator
├── hooks/useAuth.ts      # Auth hook
└── types/index.ts        # TypeScript types
```

---

## 🌐 Deploy to Vercel (Free)

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com) → Import repo
3. Add all environment variables from `.env.local` in Vercel dashboard
4. Deploy! Auto-deploys on every push to main.

---

## 🗺️ Phase Roadmap

| Phase | Status | Features |
|-------|--------|----------|
| **Phase 1** | ✅ Current | Full website, Firebase auth, booking enquiry, admin panel, community, AI widget |
| **Phase 2** | 🔜 Planned | Razorpay payments, Android/iOS app, live driver tracking, bus/train API |
| **Phase 3** | 🔮 Future | Claude AI integration, IRCTC direct API, iOS app |

---

## ⚠️ Important Notes

- `.env.local` is **gitignored** — never commit Firebase credentials to GitHub
- Firestore is in test mode initially — apply security rules before going live
- WhatsApp number: update `NEXT_PUBLIC_WHATSAPP_NUMBER` in `.env.local`

---

'use client';

import React, { useState } from 'react';

export interface BookingPayload {
  service: string;
  date: string;
  timeSlot: string;
  customerName: string;
  customerEmail: string;
}

interface BookingWidgetProps {
  services?: string[];
  availableSlots?: string[];
  onBook?: (data: BookingPayload) => Promise<void>;
}

export const BookingWidget: React.FC<BookingWidgetProps> = ({
  services = ['Consultation (30 min)', 'Full Session (60 min)', 'Follow-up (15 min)'],
  availableSlots = ['09:00 AM', '11:00 AM', '02:00 PM', '04:30 PM'],
  onBook,
}) => {
  const [formData, setFormData] = useState<BookingPayload>({
    service: services[0] || '',
    date: '',
    timeSlot: availableSlots[0] || '',
    customerName: '',
    customerEmail: '',
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      if (onBook) {
        await onBook(formData);
      }
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="p-6 max-w-md mx-auto bg-white border rounded-xl shadow-sm text-center space-y-3">
        <h3 className="text-lg font-semibold text-emerald-600">Reservation Confirmed</h3>
        <p className="text-sm text-gray-600">
          Booked <strong>{formData.service}</strong> on <strong>{formData.date}</strong> at{' '}
          <strong>{formData.timeSlot}</strong>.
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md"
        >
          Book Another Slot
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 max-w-md mx-auto bg-white border rounded-xl shadow-sm space-y-4">
      <h2 className="text-xl font-bold text-gray-900">Schedule an Appointment</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700">Service</label>
        <select
          value={formData.service}
          onChange={(e) => setFormData({ ...formData, service: e.target.value })}
          className="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm"
        >
          {services.map((srv) => (
            <option key={srv} value={srv}>{srv}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700">Date</label>
          <input
            type="date"
            required
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Time Slot</label>
          <select
            value={formData.timeSlot}
            onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
            className="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm"
          >
            {availableSlots.map((slot) => (
              <option key={slot} value={slot}>{slot}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Your Name</label>
        <input
          type="text"
          required
          placeholder="Alex Sharma"
          value={formData.customerName}
          onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
          className="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          required
          placeholder="alex@example.com"
          value={formData.customerEmail}
          onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
          className="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm"
        />
      </div>

      {status === 'error' && (
        <p className="text-xs text-red-600">Something went wrong. Please try again.</p>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="w-full py-2.5 px-4 bg-black text-white text-sm font-medium rounded-md hover:bg-gray-800 disabled:opacity-50"
      >
        {status === 'submitting' ? 'Confirming...' : 'Confirm Booking'}
      </button>
    </form>
  );
};
