'use client'

import { useState } from 'react'

export default function ManageSubscriptionButton() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleClick() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/stripe/create-portal', { method: 'POST' })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setError(data.error ?? 'Could not open billing portal.')
        setLoading(false)
      }
    } catch {
      setError('Network error. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={loading}
        style={{
          background: loading ? '#9ca3af' : '#2d7a4f',
          color: 'white',
          border: 'none',
          borderRadius: 8,
          padding: '10px 22px',
          fontSize: '0.88rem',
          fontWeight: 700,
          cursor: loading ? 'not-allowed' : 'pointer',
        }}
      >
        {loading ? 'Opening…' : 'Manage Subscription'}
      </button>
      {error && (
        <p style={{ marginTop: 8, fontSize: '0.76rem', color: '#dc2626' }}>{error}</p>
      )}
    </div>
  )
}
