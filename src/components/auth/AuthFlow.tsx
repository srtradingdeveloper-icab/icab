'use client'
import { useState } from 'react'
import { signIn, signUp, signInWithGoogle, resetPassword } from '@/lib/auth'
import { createUser } from '@/lib/firestore'

type View = 'login' | 'signup' | 'forgot' | 'sent'

export default function AuthFlow() {
  const [view, setView] = useState<View>('login')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ name: '', email: '', mobile: '', password: '', confirm: '' })

  const set = (k: string, v: string) => { setForm(f => ({ ...f, [k]: v })); setError('') }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault(); setLoading(true); setError('')
    try { await signIn(form.email, form.password) }
    catch (err: any) { setError(err.message?.replace('Firebase: ', '') || 'Login failed') }
    finally { setLoading(false) }
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault(); setLoading(true); setError('')
    if (form.password !== form.confirm) { setError('Passwords do not match'); setLoading(false); return }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); setLoading(false); return }
    try {
      const cred = await signUp(form.email, form.password, form.name)
      await createUser(cred.user.uid, { email: form.email, displayName: form.name, mobile: form.mobile, city: 'Vyasanagar', address: '' })
    } catch (err: any) { setError(err.message?.replace('Firebase: ', '') || 'Signup failed') }
    finally { setLoading(false) }
  }

  async function handleForgot(e: React.FormEvent) {
    e.preventDefault(); setLoading(true); setError('')
    try { await resetPassword(form.email); setView('sent') }
    catch (err: any) { setError(err.message?.replace('Firebase: ', '') || 'Failed to send email') }
    finally { setLoading(false) }
  }

  async function handleGoogle() {
    setLoading(true); setError('')
    try { await signInWithGoogle() }
    catch (err: any) { setError(err.message?.replace('Firebase: ', '') || 'Google sign-in failed') }
    finally { setLoading(false) }
  }

  const inputCls = "w-full bg-white border border-black/15 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#F5C518] placeholder:text-black/30"

  return (
    <div className="min-h-screen bg-[#F5C518] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-black text-[#F5C518] px-5 py-2.5 rounded-full font-syne font-bold text-xl mb-3">
            <span>🚕</span> i Cab
          </div>
          <p className="text-black/60 text-sm font-medium">Travel Odisha, Your Way</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8">

          {/* SENT VIEW */}
          {view === 'sent' && (
            <div className="text-center py-6">
              <div className="text-5xl mb-4">📧</div>
              <h2 className="font-syne font-bold text-2xl mb-2">Check your inbox</h2>
              <p className="text-black/60 text-sm mb-6">We sent a password reset link to <strong>{form.email}</strong></p>
              <button onClick={() => setView('login')} className="w-full bg-[#F5C518] font-bold py-3 rounded-xl hover:bg-[#C9990A] transition-colors">
                Back to Login
              </button>
            </div>
          )}

          {/* FORGOT VIEW */}
          {view === 'forgot' && (
            <form onSubmit={handleForgot}>
              <h2 className="font-syne font-bold text-2xl mb-1">Reset Password</h2>
              <p className="text-black/50 text-sm mb-6">We'll send a reset link to your email</p>
              {error && <p className="bg-red-50 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">{error}</p>}
              <div className="space-y-4">
                <input type="email" placeholder="Email address" value={form.email} onChange={e => set('email', e.target.value)} required className={inputCls} />
                <button type="submit" disabled={loading} className="w-full bg-[#F5C518] font-bold py-3 rounded-xl hover:bg-[#C9990A] transition-colors disabled:opacity-50">
                  {loading ? 'Sending…' : 'Send Reset Link'}
                </button>
              </div>
              <p className="text-center text-sm mt-4 text-black/50">
                <button type="button" onClick={() => setView('login')} className="text-[#C9990A] font-bold hover:underline">← Back to Login</button>
              </p>
            </form>
          )}

          {/* LOGIN VIEW */}
          {view === 'login' && (
            <form onSubmit={handleLogin}>
              <h2 className="font-syne font-bold text-2xl mb-1">Welcome back</h2>
              <p className="text-black/50 text-sm mb-6">Login to your i Cab account</p>
              {error && <p className="bg-red-50 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">{error}</p>}
              <div className="space-y-4">
                <input type="email" placeholder="Email address" value={form.email} onChange={e => set('email', e.target.value)} required className={inputCls} />
                <input type="password" placeholder="Password" value={form.password} onChange={e => set('password', e.target.value)} required className={inputCls} />
                <div className="text-right">
                  <button type="button" onClick={() => setView('forgot')} className="text-xs text-[#C9990A] font-bold hover:underline">Forgot password?</button>
                </div>
                <button type="submit" disabled={loading} className="w-full bg-[#F5C518] font-bold py-3 rounded-xl hover:bg-[#C9990A] transition-colors disabled:opacity-50">
                  {loading ? 'Logging in…' : 'Login'}
                </button>
              </div>
              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px bg-black/10" /><span className="text-xs text-black/40">OR</span><div className="flex-1 h-px bg-black/10" />
              </div>
              <button type="button" onClick={handleGoogle} disabled={loading} className="w-full border-2 border-black/10 font-bold py-3 rounded-xl hover:bg-black/5 transition-colors flex items-center justify-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                Continue with Google
              </button>
              <p className="text-center text-sm mt-5 text-black/50">
                Don't have an account?{' '}
                <button type="button" onClick={() => setView('signup')} className="text-[#C9990A] font-bold hover:underline">Sign up</button>
              </p>
            </form>
          )}

          {/* SIGNUP VIEW */}
          {view === 'signup' && (
            <form onSubmit={handleSignup}>
              <h2 className="font-syne font-bold text-2xl mb-1">Create account</h2>
              <p className="text-black/50 text-sm mb-6">Join thousands of travelers from Vyasanagar</p>
              {error && <p className="bg-red-50 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">{error}</p>}
              <div className="space-y-4">
                <input type="text" placeholder="Full name" value={form.name} onChange={e => set('name', e.target.value)} required className={inputCls} />
                <input type="email" placeholder="Email address" value={form.email} onChange={e => set('email', e.target.value)} required className={inputCls} />
                <input type="tel" placeholder="Mobile number" value={form.mobile} onChange={e => set('mobile', e.target.value)} required className={inputCls} />
                <input type="password" placeholder="Password (min 6 chars)" value={form.password} onChange={e => set('password', e.target.value)} required className={inputCls} />
                <input type="password" placeholder="Confirm password" value={form.confirm} onChange={e => set('confirm', e.target.value)} required className={inputCls} />
                <button type="submit" disabled={loading} className="w-full bg-[#F5C518] font-bold py-3 rounded-xl hover:bg-[#C9990A] transition-colors disabled:opacity-50">
                  {loading ? 'Creating account…' : 'Create Account'}
                </button>
              </div>
              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px bg-black/10" /><span className="text-xs text-black/40">OR</span><div className="flex-1 h-px bg-black/10" />
              </div>
              <button type="button" onClick={handleGoogle} disabled={loading} className="w-full border-2 border-black/10 font-bold py-3 rounded-xl hover:bg-black/5 transition-colors flex items-center justify-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                Continue with Google
              </button>
              <p className="text-center text-sm mt-5 text-black/50">
                Already have an account?{' '}
                <button type="button" onClick={() => setView('login')} className="text-[#C9990A] font-bold hover:underline">Login</button>
              </p>
            </form>
          )}
        </div>
        <p className="text-center text-xs text-black/40 mt-6">By continuing, you agree to our Terms of Service & Privacy Policy</p>
      </div>
    </div>
  )
}
