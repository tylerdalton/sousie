'use client'

import { useState } from 'react'
import type { PricingConfig } from '@/lib/types'

export default function PricingForm({ pricing }: { pricing: PricingConfig }) {
  const [monthlyCents, setMonthlyCents] = useState(String(pricing.monthly_price_cents))
  const [annualCents, setAnnualCents] = useState(String(pricing.annual_price_cents))
  const [monthlyPriceId, setMonthlyPriceId] = useState(pricing.stripe_monthly_price_id ?? '')
  const [annualPriceId, setAnnualPriceId] = useState(pricing.stripe_annual_price_id ?? '')
  const [couponDesc, setCouponDesc] = useState(pricing.coupon_description)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMessage('')
    try {
      const res = await fetch('/api/admin/pricing', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          monthly_price_cents: parseInt(monthlyCents, 10),
          annual_price_cents: parseInt(annualCents, 10),
          stripe_monthly_price_id: monthlyPriceId.trim() || null,
          stripe_annual_price_id: annualPriceId.trim() || null,
          coupon_description: couponDesc.trim(),
        }),
      })
      const data = await res.json()
      setMessage(res.ok ? '✓ Saved successfully' : data.error ?? 'Save failed')
    } catch {
      setMessage('Network error')
    } finally {
      setSaving(false)
    }
  }

  const labelStyle: React.CSSProperties = { display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#374151', marginBottom: 5, marginTop: 16 }
  const inputStyle: React.CSSProperties = { width: '100%', border: '1px solid #e5e7eb', borderRadius: 8, padding: '9px 12px', fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box' }
  const hintStyle: React.CSSProperties = { fontSize: '0.7rem', color: '#9ca3af', marginTop: 4 }

  return (
    <form onSubmit={handleSave} style={{ background: 'white', borderRadius: 14, padding: '28px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', maxWidth: 540 }}>
      <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#1f2937', marginBottom: 4 }}>Subscription Pricing</h2>
      <p style={{ fontSize: '0.78rem', color: '#6b7280', marginBottom: 8 }}>
        Set up prices in <a href="https://dashboard.stripe.com/products" target="_blank" rel="noreferrer" style={{ color: '#2d7a4f' }}>Stripe Dashboard</a> first, then paste the Price IDs here.
      </p>

      <label style={labelStyle}>Monthly price (cents)</label>
      <input style={inputStyle} type="number" min={0} value={monthlyCents} onChange={e => setMonthlyCents(e.target.value)} required />
      <p style={hintStyle}>Current: ${(parseInt(monthlyCents || '0', 10) / 100).toFixed(2)}/mo</p>

      <label style={labelStyle}>Stripe Monthly Price ID</label>
      <input style={inputStyle} type="text" value={monthlyPriceId} onChange={e => setMonthlyPriceId(e.target.value)} placeholder="price_..." />

      <label style={labelStyle}>Annual price (cents)</label>
      <input style={inputStyle} type="number" min={0} value={annualCents} onChange={e => setAnnualCents(e.target.value)} required />
      <p style={hintStyle}>Current: ${(parseInt(annualCents || '0', 10) / 100).toFixed(2)}/yr · ${(parseInt(annualCents || '0', 10) / 100 / 12).toFixed(2)}/mo</p>

      <label style={labelStyle}>Stripe Annual Price ID</label>
      <input style={inputStyle} type="text" value={annualPriceId} onChange={e => setAnnualPriceId(e.target.value)} placeholder="price_..." />

      <label style={labelStyle}>Annual plan description</label>
      <input style={inputStyle} type="text" value={couponDesc} onChange={e => setCouponDesc(e.target.value)} placeholder="2 months free" required />
      <p style={hintStyle}>Shown on the subscribe page under the annual price (e.g. "2 months free")</p>

      {message && (
        <p style={{ marginTop: 14, fontSize: '0.8rem', color: message.startsWith('✓') ? '#059669' : '#dc2626' }}>{message}</p>
      )}

      <button
        type="submit"
        disabled={saving}
        style={{ marginTop: 20, background: saving ? '#9ca3af' : '#2d7a4f', color: 'white', border: 'none', borderRadius: 8, padding: '10px 22px', fontSize: '0.88rem', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer' }}
      >
        {saving ? 'Saving…' : 'Save Changes'}
      </button>
    </form>
  )
}
