'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/weeks')
      router.refresh()
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f4f1', padding: '20px' }}>
      <div style={{ background: 'white', borderRadius: 16, padding: '32px 28px', width: '100%', maxWidth: 380, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: '3rem', marginBottom: 8, lineHeight: 1 }}>👩‍🍳</div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#2d7a4f', letterSpacing: '-0.02em' }}>Sousie</h1>
          <p style={{ fontSize: '0.72rem', color: '#9ca3af', marginTop: 3, fontStyle: 'italic' }}>
            Sousie says… it&apos;s time to eat well.
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <label className="form-label">Email</label>
          <input
            className="form-input"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="family@example.com"
            required
            autoComplete="email"
          />

          <label className="form-label" style={{ marginTop: 14 }}>Password</label>
          <input
            className="form-input"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            autoComplete="current-password"
          />

          {error && (
            <div style={{ marginTop: 12, padding: '8px 12px', background: '#fee2e2', color: '#dc2626', borderRadius: 8, fontSize: '0.78rem' }}>
              {error}
            </div>
          )}

          <button
            className="btn btn-primary"
            type="submit"
            disabled={loading}
            style={{ width: '100%', justifyContent: 'center', marginTop: 20, padding: '10px' }}
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
