'use client'

import { useState } from 'react'

interface Props {
  monthlyPriceCents: number
  annualPriceCents: number
  monthlyPriceId: string | null
  annualPriceId: string | null
  couponDescription: string
}

export default function SubscribeForm({ monthlyPriceCents, annualPriceCents, monthlyPriceId, annualPriceId, couponDescription }: Props) {
  const [plan, setPlan] = useState<'monthly' | 'annual'>('annual')
  const [couponCode, setCouponCode] = useState('')
  const [couponApplied, setCouponApplied] = useState<{ display: string; promoCodeId: string } | null>(null)
  const [couponError, setCouponError] = useState('')
  const [validating, setValidating] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const monthlyDisplay = `$${(monthlyPriceCents / 100).toFixed(0)}/mo`
  const annualDisplay = `$${(annualPriceCents / 100).toFixed(0)}/yr`
  const annualPerMonth = `$${(annualPriceCents / 100 / 12).toFixed(2)}/mo`

  async function applyCode() {
    if (!couponCode.trim()) return
    setValidating(true)
    setCouponError('')
    setCouponApplied(null)
    try {
      const res = await fetch(`/api/stripe/validate-coupon?code=${encodeURIComponent(couponCode.trim())}`)
      const data = await res.json()
      if (data.valid) {
        setCouponApplied({ display: data.discount_display, promoCodeId: data.promoCodeId })
      } else {
        setCouponError('Invalid or expired coupon code.')
      }
    } catch {
      setCouponError('Could not validate code. Try again.')
    } finally {
      setValidating(false)
    }
  }

  async function handleSubscribe() {
    const priceId = plan === 'monthly' ? monthlyPriceId : annualPriceId
    if (!priceId) {
      setError('Subscription is not yet configured. Please try again soon.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId, promoCodeId: couponApplied?.promoCodeId ?? null }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setError(data.error ?? 'Something went wrong. Please try again.')
        setLoading(false)
      }
    } catch {
      setError('Network error. Please try again.')
      setLoading(false)
    }
  }

  const cardBase: React.CSSProperties = {
    border: '2px solid var(--gray-mid)',
    borderRadius: 12,
    padding: '20px',
    cursor: 'pointer',
    transition: 'border-color 0.15s',
    background: 'white',
    position: 'relative',
  }
  const cardSelected: React.CSSProperties = {
    ...cardBase,
    borderColor: '#2d7a4f',
    boxShadow: '0 0 0 3px rgba(45,122,79,0.12)',
  }

  return (
    <div>
      {/* Plan selection */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
        {/* Monthly */}
        <div style={plan === 'monthly' ? cardSelected : cardBase} onClick={() => setPlan('monthly')}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <div style={{
              width: 18, height: 18, borderRadius: '50%',
              border: plan === 'monthly' ? '5px solid #2d7a4f' : '2px solid var(--gray-mid)',
              flexShrink: 0,
            }} />
            <span style={{ fontWeight: 700, fontSize: '0.92rem', color: '#1f2937' }}>Monthly</span>
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#2d7a4f', letterSpacing: '-0.02em' }}>
            {monthlyDisplay}
          </div>
          <div style={{ fontSize: '0.74rem', color: '#6b7280', marginTop: 4 }}>Billed monthly</div>
        </div>

        {/* Annual */}
        <div style={plan === 'annual' ? cardSelected : cardBase} onClick={() => setPlan('annual')}>
          <div style={{
            position: 'absolute', top: -11, right: 12,
            background: '#2d7a4f', color: 'white',
            fontSize: '0.64rem', fontWeight: 700,
            padding: '3px 8px', borderRadius: 20,
          }}>
            BEST VALUE
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <div style={{
              width: 18, height: 18, borderRadius: '50%',
              border: plan === 'annual' ? '5px solid #2d7a4f' : '2px solid var(--gray-mid)',
              flexShrink: 0,
            }} />
            <span style={{ fontWeight: 700, fontSize: '0.92rem', color: '#1f2937' }}>Annual</span>
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#2d7a4f', letterSpacing: '-0.02em' }}>
            {annualDisplay}
          </div>
          <div style={{ fontSize: '0.74rem', color: '#6b7280', marginTop: 4 }}>{annualPerMonth} · {couponDescription}</div>
        </div>
      </div>

      {/* Coupon code */}
      <div style={{ background: 'white', borderRadius: 10, padding: '14px 16px', marginBottom: 16, border: '1px solid var(--gray-mid)' }}>
        <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#1f2937', marginBottom: 8 }}>Have a coupon code?</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            value={couponCode}
            onChange={e => { setCouponCode(e.target.value); setCouponError(''); setCouponApplied(null) }}
            onKeyDown={e => e.key === 'Enter' && applyCode()}
            placeholder="Enter code"
            style={{ flex: 1, border: '1px solid var(--gray-mid)', borderRadius: 8, padding: '8px 12px', fontSize: '0.83rem', outline: 'none' }}
            disabled={!!couponApplied}
          />
          <button
            onClick={applyCode}
            disabled={validating || !!couponApplied || !couponCode.trim()}
            style={{ background: couponApplied ? '#d1fae5' : '#f3f4f6', border: 'none', borderRadius: 8, padding: '8px 14px', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', color: couponApplied ? '#065f46' : '#374151' }}
          >
            {validating ? '…' : couponApplied ? '✓ Applied' : 'Apply'}
          </button>
        </div>
        {couponApplied && (
          <div style={{ marginTop: 8, fontSize: '0.76rem', color: '#059669', fontWeight: 600 }}>
            ✓ {couponApplied.display}
          </div>
        )}
        {couponError && (
          <div style={{ marginTop: 8, fontSize: '0.76rem', color: '#dc2626' }}>{couponError}</div>
        )}
      </div>

      {/* Subscribe button */}
      {error && (
        <div style={{ marginBottom: 12, padding: '10px 14px', background: '#fee2e2', color: '#dc2626', borderRadius: 8, fontSize: '0.8rem' }}>
          {error}
        </div>
      )}

      <button
        onClick={handleSubscribe}
        disabled={loading}
        style={{
          width: '100%',
          background: loading ? '#9ca3af' : '#2d7a4f',
          color: 'white',
          border: 'none',
          borderRadius: 10,
          padding: '14px',
          fontSize: '1rem',
          fontWeight: 700,
          cursor: loading ? 'not-allowed' : 'pointer',
          letterSpacing: '-0.01em',
        }}
      >
        {loading ? 'Redirecting to checkout…' : `Subscribe — ${plan === 'monthly' ? monthlyDisplay : annualDisplay}`}
      </button>
    </div>
  )
}
