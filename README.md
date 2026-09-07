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
NEXT_PUBLIC_ADMIN_EMAILS=connect.tradinghark@gmail.com
NEXT_PUBLIC_WHATSAPP_NUMBER=917008000000
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

Built with ❤️ for Vyasanagar, Odisha.
