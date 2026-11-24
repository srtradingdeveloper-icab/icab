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
"use client";

import React, { useState } from "react";

export function BookingWidget() {
  const [step, setStep] = useState<1 | 2>(1);
  const [destination, setDestination] = useState("");
  const [tripType, setTripType] = useState("One Way");
  const [vehicle, setVehicle] = useState("Dzire");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination) {
      alert("Please select a destination");
      return;
    }
    setStep(2);
  };

  const handleConfirmWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    const message =
      "🚕 *New i Cab Booking Request* 🚕\n\n" +
      "📍 *From:* Vyasanagar / Jajpur\n" +
      "🏁 *Destination:* " + destination + "\n" +
      "⇄ *Trip Type:* " + tripType + "\n" +
      "🚗 *Vehicle:* " + vehicle + "\n" +
      "📅 *Date:* " + date + "\n" +
      "⏰ *Pickup Time:* " + time + "\n" +
      "👤 *Name:* " + name + "\n" +
      "📞 *Mobile:* " + phone + "\n\n" +
      "Please confirm my cab booking.";

    const url = "https://wa.me" + encodeURIComponent(message);
    window.open(url, "_blank");
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full border border-gray-100">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-900">Book Your Ride</h3>
        <p className="text-xs text-gray-500">From Vyasanagar · Fixed Fare · No Surge</p>
      </div>

      {step === 1 ? (
        <form onSubmit={handleContinue} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
            <select
              required
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2.5 text-sm bg-white"
            >
              <option value="">Select destination…</option>
              <option value="Bhubaneswar Airport">Bhubaneswar Airport</option>
              <option value="Bhubaneswar City">Bhubaneswar City</option>
              <option value="Cuttack">Cuttack</option>
              <option value="Puri">Puri</option>
              <option value="Konark">Konark</option>
              <option value="Jajpur Local / Biraja Temple">Jajpur Local / Biraja Temple</option>
              <option value="Kalinga Nagar">Kalinga Nagar</option>
              <option value="Other Odisha Location">Other Odisha Location</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Trip Type</label>
            <div className="grid grid-cols-2 gap-2">
              {["One Way", "Round Trip"].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setTripType(type)}
                  className={`py-2 px-3 rounded-lg text-sm font-medium border ${
                    tripType === type
                      ? "bg-amber-500 text-white border-amber-500"
                      : "bg-gray-50 text-gray-700 border-gray-300"
                  }`}
                >
                  {type === "One Way" ? "→ One Way" : "⇄ Round Trip"}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { name: "Dzire", seats: "×4", icon: "🚗" },
                { name: "Ertiga", seats: "×6", icon: "🚐" },
                { name: "Innova", seats: "×7", icon: "🚙" },
                { name: "SUV", seats: "×8", icon: "🛻" },
              ].map((car) => (
                <button
                  key={car.name}
                  type="button"
                  onClick={() => setVehicle(car.name)}
                  className={`p-2.5 rounded-lg border text-left flex items-center justify-between text-sm ${
                    vehicle === car.name
                      ? "border-amber-500 bg-amber-50 font-semibold"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <span>{car.icon} {car.name}</span>
                  <span className="text-xs text-gray-500">{car.seats}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg transition"
          >
            Continue →
          </button>
        </form>
      ) : (
        <form onSubmit={handleConfirmWhatsApp} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Travel Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Time</label>
              <input
                type="time"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full border border-gray-300 rounded-lg p-2.5 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter 10-digit mobile number"
              className="w-full border border-gray-300 rounded-lg p-2.5 text-sm"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-1/3 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg text-sm"
            >
              ← Back
            </button>
            <button
              type="submit"
              className="w-2/3 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition text-sm"
            >
              Confirm on WhatsApp →
            </button>
          </div>
          <p className="text-center text-xs text-gray-500">
            Instant booking confirmation via WhatsApp (+91 99374 04945)
          </p>
        </form>
      )}
    </div>
  );
}

export default BookingWidget;


export default BookingWidget;
