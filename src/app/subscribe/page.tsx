import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { PricingConfig } from '@/lib/types'
import SubscribeForm from './SubscribeForm'

export default async function SubscribePage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?next=/subscribe')

  // Already subscribed — send to app
  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_status')
    .eq('user_id', user.id)
    .single()

  if (profile?.subscription_status === 'active' || profile?.subscription_status === 'trialing') {
    redirect('/weeks')
  }

  const { data: pricing } = await supabase
    .from('pricing_config')
    .select('*')
    .single() as { data: PricingConfig | null }

  const monthlyPriceCents = pricing?.monthly_price_cents ?? 500
  const annualPriceCents = pricing?.annual_price_cents ?? 5000
  const monthlyPriceId = pricing?.stripe_monthly_price_id ?? null
  const annualPriceId = pricing?.stripe_annual_price_id ?? null
  const couponDescription = pricing?.coupon_description ?? '2 months free'

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4f1', padding: '40px 20px', fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
      <div style={{ maxWidth: 560, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ fontSize: '3rem', marginBottom: 8 }}>👩‍🍳</div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#2d7a4f', letterSpacing: '-0.03em', marginBottom: 8 }}>
            Subscribe to Sousie
          </h1>
          <p style={{ color: '#6b7280', fontSize: '0.9rem', lineHeight: 1.6 }}>
            Full access to meal planning, your recipe library, AI-powered weeks, and shopping lists.
          </p>
        </div>

        <SubscribeForm
          monthlyPriceCents={monthlyPriceCents}
          annualPriceCents={annualPriceCents}
          monthlyPriceId={monthlyPriceId}
          annualPriceId={annualPriceId}
          couponDescription={couponDescription}
        />

        <p style={{ textAlign: 'center', fontSize: '0.74rem', color: '#9ca3af', marginTop: 20 }}>
          Cancel anytime from your account settings. Secure payment via Stripe.
        </p>
      </div>
    </div>
  )
}
