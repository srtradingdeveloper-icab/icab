import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth'
import { auth } from './firebase'
import { createUser } from './firestore'

export async function signUp(
  email: string,
  password: string,
  fullName: string,
  mobile: string
) {
  const cred = await createUserWithEmailAndPassword(auth, email, password)
  await updateProfile(cred.user, { displayName: fullName })
  // Save extra fields to Firestore
  await createUser(cred.user.uid, {
    uid: cred.user.uid,
    email,
    displayName: fullName,
    mobile,
  })
  return cred.user
}

export async function signIn(email: string, password: string) {
  const cred = await signInWithEmailAndPassword(auth, email, password)
  return cred.user
}

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider()
  const cred = await signInWithPopup(auth, provider)
  // Create user doc if first Google login
  await createUser(cred.user.uid, {
    uid: cred.user.uid,
    email: cred.user.email ?? '',
    displayName: cred.user.displayName ?? '',
    mobile: cred.user.phoneNumber ?? '',
  }).catch(() => {}) // doc may already exist — ignore
  return cred.user
}

export async function logOut() {
  await signOut(auth)
}

export async function resetPassword(email: string) {
  await sendPasswordResetEmail(auth, email)
}

export function getInitials(name: string) {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function isAdmin(email?: string | null) {
  if (!email) return false
  const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? '').split(',').map(e => e.trim())
  return adminEmails.includes(email)
}
