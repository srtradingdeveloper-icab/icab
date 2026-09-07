/**
 * Firestore helper functions — all CRUD for i Cab collections
 */
import {
  collection, doc, addDoc, updateDoc, getDocs,
  getDoc, query, where, orderBy, limit,
  serverTimestamp, Timestamp,
} from 'firebase/firestore'
import { db } from './firebase'
import type { Enquiry, Booking, Driver, Post, VyasaUser } from '@/types'

// ── COLLECTION NAMES ──
const COL = {
  users:     'users',
  enquiries: 'enquiries',
  bookings:  'bookings',
  drivers:   'drivers',
  posts:     'posts',
  fares:     'fares',
} as const

// ── USERS ──
export async function getUser(uid: string) {
  const snap = await getDoc(doc(db, COL.users, uid))
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as VyasaUser) : null
}

export async function createUser(uid: string, data: Partial<VyasaUser>) {
  await updateDoc(doc(db, COL.users, uid), {
    ...data,
    createdAt: serverTimestamp(),
    tier: 'new',
    rewardPoints: 0,
    totalTrips: 0,
    totalSpent: 0,
    isAdmin: false,
  }).catch(() =>
    // doc doesn't exist yet — use setDoc
    import('firebase/firestore').then(({ setDoc }) =>
      setDoc(doc(db, COL.users, uid), {
        ...data,
        createdAt: serverTimestamp(),
        tier: 'new',
        rewardPoints: 0,
        totalTrips: 0,
        totalSpent: 0,
        isAdmin: false,
      })
    )
  )
}

// ── ENQUIRIES ──
export async function submitEnquiry(data: Omit<Enquiry, 'id' | 'createdAt' | 'status'>) {
  const ref = await addDoc(collection(db, COL.enquiries), {
    ...data,
    status: 'new',
    createdAt: serverTimestamp(),
  })
  return ref.id
}

export async function getEnquiries(statusFilter?: Enquiry['status']) {
  const q = statusFilter
    ? query(collection(db, COL.enquiries), where('status', '==', statusFilter), orderBy('createdAt', 'desc'))
    : query(collection(db, COL.enquiries), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Enquiry))
}

export async function updateEnquiryStatus(
  id: string,
  status: Enquiry['status'],
  agentNotes?: string
) {
  await updateDoc(doc(db, COL.enquiries, id), {
    status,
    agentNotes: agentNotes ?? '',
    updatedAt: serverTimestamp(),
  })
}

// ── BOOKINGS ──
export async function createBooking(data: Omit<Booking, 'id' | 'createdAt'>) {
  const ref = await addDoc(collection(db, COL.bookings), {
    ...data,
    createdAt: serverTimestamp(),
  })
  return ref.id
}

export async function getUserBookings(userId: string) {
  const q = query(
    collection(db, COL.bookings),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  )
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Booking))
}

export async function getAllBookings(limitCount = 50) {
  const q = query(collection(db, COL.bookings), orderBy('createdAt', 'desc'), limit(limitCount))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Booking))
}

// ── DRIVERS ──
export async function getDrivers() {
  const snap = await getDocs(collection(db, COL.drivers))
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Driver))
}

export async function addDriver(data: Omit<Driver, 'id' | 'joinedAt'>) {
  return addDoc(collection(db, COL.drivers), {
    ...data,
    totalTrips: 0,
    rating: 5.0,
    dues: 0,
    joinedAt: serverTimestamp(),
  })
}

// ── COMMUNITY POSTS ──
export async function getPosts(statusFilter: Post['status'] = 'live') {
  const q = query(
    collection(db, COL.posts),
    where('status', '==', statusFilter),
    orderBy('createdAt', 'desc'),
    limit(20)
  )
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Post))
}

export async function submitPost(data: Omit<Post, 'id' | 'createdAt' | 'likes' | 'comments' | 'status'>) {
  return addDoc(collection(db, COL.posts), {
    ...data,
    likes: 0,
    comments: 0,
    status: 'pending',   // admin reviews before going live
    createdAt: serverTimestamp(),
  })
}

export async function updatePostStatus(id: string, status: Post['status']) {
  await updateDoc(doc(db, COL.posts, id), { status })
}

// ── FARE TABLE ──
export async function getFares() {
  const snap = await getDoc(doc(db, COL.fares, 'intercity'))
  return snap.exists() ? snap.data() : null
}

export async function saveFares(fares: Record<string, Record<string, number>>) {
  const { setDoc } = await import('firebase/firestore')
  await setDoc(doc(db, COL.fares, 'intercity'), { ...fares, updatedAt: serverTimestamp() })
}
