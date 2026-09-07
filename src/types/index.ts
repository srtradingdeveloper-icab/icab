// ── USER ──
export interface VyasaUser {
  uid: string
  email: string
  displayName: string
  mobile: string
  city?: string
  address?: string
  createdAt: Date
  tier: 'new' | 'bronze' | 'silver' | 'gold' | 'platinum'
  rewardPoints: number
  totalTrips: number
  totalSpent: number
  isAdmin: boolean
}

// ── ENQUIRY (Phase 1 core — Capture & Call) ──
export interface Enquiry {
  id?: string
  type: 'cab' | 'bus' | 'train' | 'tour' | 'monthly'
  customerName: string
  customerEmail: string
  customerMobile: string
  userId?: string          // null if submitted without login

  // Cab fields
  from?: string
  to?: string
  vehicle?: 'dzire' | 'ertiga' | 'innova' | 'suv'
  tripType?: 'one-way' | 'round-trip'
  travelDate?: string      // ISO date string
  pickupTime?: string

  // Bus/Train fields
  passengers?: number
  trainClass?: string
  busOperator?: string

  estimatedFare?: number
  status: 'new' | 'called' | 'confirmed' | 'rejected'
  agentNotes?: string
  createdAt: Date
  updatedAt?: Date
}

// ── BOOKING (confirmed enquiry) ──
export interface Booking {
  id?: string
  enquiryId?: string
  bookingRef: string       // e.g. BKG-2094
  type: Enquiry['type']
  userId: string
  customerName: string
  customerMobile: string
  from: string
  to: string
  vehicle: string
  tripType: string
  travelDate: string
  pickupTime: string
  amount: number
  amountPaid: number
  driverId?: string
  driverName?: string
  driverMobile?: string
  vehicleNumber?: string
  status: 'confirmed' | 'completed' | 'cancelled'
  createdAt: Date
  completedAt?: Date
}

// ── DRIVER ──
export interface Driver {
  id?: string
  name: string
  mobile: string
  email?: string
  vehicle: string
  vehicleNumber: string
  vehicleType: 'dzire' | 'ertiga' | 'innova' | 'suv'
  licenseNumber: string
  experience: number       // years
  totalTrips: number
  rating: number           // 0–5
  dues: number             // ₹ owed to agency
  status: 'available' | 'on-trip' | 'off-duty' | 'inactive'
  joinedAt: Date
}

// ── COMMUNITY POST ──
export interface Post {
  id?: string
  userId: string
  authorName: string
  authorInitials: string
  caption: string
  imageUrl?: string
  emoji?: string
  destination?: string
  likes: number
  comments: number
  status: 'pending' | 'live' | 'removed'
  createdAt: Date
}

// ── FARE TABLE ──
export interface FareTable {
  [destination: string]: {
    dzire: number
    ertiga: number
    innova: number
    suv: number
  }
}

// ── REWARDS ──
export const POINTS_PER_RUPEE = 0.1   // 1 point per ₹10 spent
export const POINT_VALUE = 0.1        // 1 point = ₹0.10

export const TIER_THRESHOLDS = {
  bronze:   { trips: 1,  points: 0    },
  silver:   { trips: 5,  points: 500  },
  gold:     { trips: 10, points: 1000 },
  platinum: { trips: 20, points: 2000 },
}
