'use client'

import { useState } from 'react'
import type { Coupon } from '@/lib/types'

export default function CouponManager({ initialCoupons }: { initialCoupons: Coupon[] }) {
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons)
  const [code, setCode] = useState('')
  const [discountDisplay, setDiscountDisplay] = useState('')
  const [description, setDescription] = useState('')
  const [stripeCouponId, setStripeCouponId] = useState('')
  const [stripePromoId, setStripePromoId] = useState('')
  const [creating, setCreating] = useState(false)
  const [message, setMessage] = useState('')

  async function createCoupon(e: React.FormEvent) {
    e.preventDefault()
    setCreating(true)
    setMessage('')
    try {
      const res = await fetch('/api/admin/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: code.trim().toUpperCase(),
          discount_display: discountDisplay.trim(),
          description: description.trim() || null,
          stripe_coupon_id: stripeCouponId.trim() || null,
          stripe_promo_code_id: stripePromoId.trim() || null,
        }),
      })
      const data = await res.json()
      if (res.ok && data.coupon) {
        setCoupons(prev => [data.coupon, ...prev])
        setCode(''); setDiscountDisplay(''); setDescription(''); setStripeCouponId(''); setStripePromoId('')
        setMessage('✓ Coupon created')
      } else {
        setMessage(data.error ?? 'Failed to create coupon')
      }
    } catch {
      setMessage('Network error')
    } finally {
      setCreating(false)
    }
  }

  async function deactivate(id: string) {
    const res = await fetch(`/api/admin/coupons/${id}`, { method: 'PATCH' })
    if (res.ok) {
      setCoupons(prev => prev.map(c => c.id === id ? { ...c, active: false } : c))
    }
  }

  const inputStyle: React.CSSProperties = { border: '1px solid #e5e7eb', borderRadius: 8, padding: '8px 12px', fontSize: '0.83rem', outline: 'none', width: '100%', boxSizing: 'border-box' }

  return (
    <div>
      {/* Create form */}
      <div style={{ background: 'white', borderRadius: 14, padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', marginBottom: 24 }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#1f2937', marginBottom: 4 }}>Create Coupon</h2>
        <p style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: 16 }}>
          Create the coupon in <a href="https://dashboard.stripe.com/coupons" target="_blank" rel="noreferrer" style={{ color: '#2d7a4f' }}>Stripe Dashboard</a> first, then add it here.
        </p>
        <form onSubmit={createCoupon}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ fontSize: '0.76rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 4 }}>Code *</label>
              <input style={inputStyle} value={code} onChange={e => setCode(e.target.value)} placeholder="FAMILY50" required />
            </div>
            <div>
              <label style={{ fontSize: '0.76rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 4 }}>Discount display *</label>
              <input style={inputStyle} value={discountDisplay} onChange={e => setDiscountDisplay(e.target.value)} placeholder="50% off first month" required />
            </div>
            <div>
              <label style={{ fontSize: '0.76rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 4 }}>Stripe Coupon ID</label>
              <input style={inputStyle} value={stripeCouponId} onChange={e => setStripeCouponId(e.target.value)} placeholder="co_..." />
            </div>
            <div>
              <label style={{ fontSize: '0.76rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 4 }}>Stripe Promo Code ID</label>
              <input style={inputStyle} value={stripePromoId} onChange={e => setStripePromoId(e.target.value)} placeholder="promo_..." />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontSize: '0.76rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 4 }}>Internal description</label>
              <input style={inputStyle} value={description} onChange={e => setDescription(e.target.value)} placeholder="Family plan — free for Dalton family" />
            </div>
          </div>
          {message && (
            <p style={{ marginTop: 10, fontSize: '0.78rem', color: message.startsWith('✓') ? '#059669' : '#dc2626' }}>{message}</p>
          )}
          <button
            type="submit"
            disabled={creating}
            style={{ marginTop: 16, background: creating ? '#9ca3af' : '#2d7a4f', color: 'white', border: 'none', borderRadius: 8, padding: '9px 20px', fontSize: '0.85rem', fontWeight: 700, cursor: creating ? 'not-allowed' : 'pointer' }}
          >
            {creating ? 'Creating…' : 'Create Coupon'}
          </button>
        </form>
      </div>

      {/* Coupon list */}
      <div style={{ background: 'white', borderRadius: 14, boxShadow: '0 1px 3px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb', fontSize: '0.88rem', fontWeight: 700, color: '#1f2937' }}>
          All Coupons ({coupons.length})
        </div>
        {coupons.length === 0 ? (
          <p style={{ padding: '20px', color: '#6b7280', fontSize: '0.83rem' }}>No coupons yet.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
            <thead>
              <tr style={{ background: '#f9fafb' }}>
                {['Code', 'Discount', 'Description', 'Status', ''].map(h => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: 'left', color: '#6b7280', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {coupons.map(c => (
                <tr key={c.id} style={{ borderTop: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 700, fontFamily: 'monospace', color: '#1f2937' }}>{c.code}</td>
                  <td style={{ padding: '12px 16px', color: '#059669', fontWeight: 600 }}>{c.discount_display}</td>
                  <td style={{ padding: '12px 16px', color: '#6b7280' }}>{c.description ?? '—'}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ background: c.active ? '#d1fae5' : '#f3f4f6', color: c.active ? '#065f46' : '#6b7280', borderRadius: 20, padding: '3px 10px', fontSize: '0.72rem', fontWeight: 700 }}>
                      {c.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    {c.active && (
                      <button
                        onClick={() => deactivate(c.id)}
                        style={{ background: 'none', border: '1px solid #e5e7eb', borderRadius: 6, padding: '4px 10px', fontSize: '0.72rem', color: '#6b7280', cursor: 'pointer' }}
                      >
                        Deactivate
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
