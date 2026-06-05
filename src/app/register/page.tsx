'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const supabase = createClient()

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signUp({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setDone(true)
    }
  }

  async function handleGoogleSignUp() {
    setGoogleLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
    if (error) {
      setError(error.message)
      setGoogleLoading(false)
    }
  }

  if (done) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f4f1', padding: '20px' }}>
        <div style={{ background: 'white', borderRadius: 16, padding: '32px 28px', width: '100%', maxWidth: 380, boxShadow: '0 4px 20px rgba(0,0,0,0.1)', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: 12 }}>📬</div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1f2937', marginBottom: 10 }}>Check your inbox</h2>
          <p style={{ fontSize: '0.82rem', color: '#6b7280', lineHeight: 1.6, marginBottom: 20 }}>
            We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account, then sign in.
          </p>
          <Link href="/login" style={{ background: '#2d7a4f', color: 'white', borderRadius: 8, padding: '10px 24px', fontSize: '0.85rem', fontWeight: 700, textDecoration: 'none', display: 'inline-block' }}>
            Go to Sign In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f4f1', padding: '20px' }}>
      <div style={{ background: 'white', borderRadius: 16, padding: '32px 28px', width: '100%', maxWidth: 380, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: '3rem', marginBottom: 8, lineHeight: 1 }}>👩‍🍳</div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#2d7a4f', letterSpacing: '-0.02em' }}>Create account</h1>
          <p style={{ fontSize: '0.72rem', color: '#9ca3af', marginTop: 3, fontStyle: 'italic' }}>
            Start your free demo, then subscribe for full access.
          </p>
        </div>

        {/* Google */}
        <button
          onClick={handleGoogleSignUp}
          disabled={googleLoading || loading}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            background: 'white', border: '1.5px solid #e5e7eb', borderRadius: 8, padding: '10px 16px',
            fontSize: '0.88rem', fontWeight: 600, color: '#374151', cursor: 'pointer',
            opacity: googleLoading || loading ? 0.6 : 1, marginBottom: 18,
          }}
        >
          <GoogleIcon />
          {googleLoading ? 'Redirecting…' : 'Sign up with Google'}
        </button>

        <Divider />

        <form onSubmit={handleRegister}>
          <label className="form-label">Email</label>
          <input
            className="form-input"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            autoComplete="email"
          />

          <label className="form-label" style={{ marginTop: 14 }}>Password</label>
          <input
            className="form-input"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="At least 8 characters"
            required
            autoComplete="new-password"
          />

          <label className="form-label" style={{ marginTop: 14 }}>Confirm password</label>
          <input
            className="form-input"
            type="password"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            placeholder="••••••••"
            required
            autoComplete="new-password"
          />

          {error && (
            <div style={{ marginTop: 12, padding: '8px 12px', background: '#fee2e2', color: '#dc2626', borderRadius: 8, fontSize: '0.78rem' }}>
              {error}
            </div>
          )}

          <button
            className="btn btn-primary"
            type="submit"
            disabled={loading || googleLoading}
            style={{ width: '100%', justifyContent: 'center', marginTop: 20, padding: '10px' }}
          >
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '0.76rem', color: '#9ca3af', marginTop: 16 }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: '#2d7a4f' }}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  )
}

function Divider() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
      <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
      <span style={{ fontSize: '0.72rem', color: '#9ca3af', fontWeight: 500 }}>or</span>
      <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
    </div>
  )
}
