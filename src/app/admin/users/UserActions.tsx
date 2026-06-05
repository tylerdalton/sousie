'use client'

import { useState } from 'react'

interface Props {
  userId: string
  currentRole: string
  currentStatus: string
}

export default function UserActions({ userId, currentRole, currentStatus }: Props) {
  const [role, setRole] = useState(currentRole)
  const [status, setStatus] = useState(currentStatus)
  const [loading, setLoading] = useState(false)

  async function promote() {
    setLoading(true)
    const res = await fetch(`/api/admin/users/${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: 'admin', subscription_status: 'active' }),
    })
    if (res.ok) { setRole('admin'); setStatus('active') }
    setLoading(false)
  }

  async function demote() {
    setLoading(true)
    const res = await fetch(`/api/admin/users/${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: 'user' }),
    })
    if (res.ok) setRole('user')
    setLoading(false)
  }

  const btnStyle: React.CSSProperties = {
    background: 'none',
    border: '1px solid #e5e7eb',
    borderRadius: 6,
    padding: '4px 10px',
    fontSize: '0.72rem',
    cursor: loading ? 'not-allowed' : 'pointer',
    color: '#6b7280',
    opacity: loading ? 0.5 : 1,
  }

  return (
    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
      {role !== 'admin' ? (
        <button
          onClick={promote}
          disabled={loading}
          style={{ ...btnStyle, color: '#2d7a4f', borderColor: '#2d7a4f' }}
          title="Grant admin role + free access"
        >
          {loading ? '…' : 'Make Admin'}
        </button>
      ) : (
        <button
          onClick={demote}
          disabled={loading}
          style={btnStyle}
          title="Remove admin role"
        >
          {loading ? '…' : 'Remove Admin'}
        </button>
      )}
      {role === 'admin' && status !== 'active' && (
        <span style={{ fontSize: '0.7rem', color: '#9ca3af' }}>no sub</span>
      )}
    </div>
  )
}
