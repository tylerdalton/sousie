import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { Profile } from '@/lib/types'
import ManageSubscriptionButton from './ManageSubscriptionButton'

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  active:    { label: 'Active',      color: '#059669' },
  trialing:  { label: 'Trial',       color: '#2563eb' },
  past_due:  { label: 'Past due',    color: '#d97706' },
  canceled:  { label: 'Canceled',    color: '#6b7280' },
  none:      { label: 'No subscription', color: '#6b7280' },
}

export default async function AccountPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single() as { data: Profile | null }

  const status = profile?.subscription_status ?? 'none'
  const statusInfo = STATUS_LABELS[status] ?? STATUS_LABELS.none
  const periodEnd = profile?.subscription_period_end
    ? new Date(profile.subscription_period_end).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : null
  const isActive = status === 'active' || status === 'trialing'

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4f1', padding: '40px 20px', fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
      <div style={{ maxWidth: 520, margin: '0 auto' }}>
        <Link href="/weeks" style={{ fontSize: '0.8rem', color: '#6b7280', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: 24 }}>
          ← Back to dashboard
        </Link>

        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1f2937', letterSpacing: '-0.02em', marginBottom: 24 }}>
          Your Account
        </h1>

        {/* Subscription status card */}
        <div style={{ background: 'white', borderRadius: 14, padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', marginBottom: 16 }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
            Subscription
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <span style={{
              background: isActive ? '#d1fae5' : '#f3f4f6',
              color: statusInfo.color,
              borderRadius: 20,
              padding: '4px 12px',
              fontSize: '0.78rem',
              fontWeight: 700,
            }}>
              {statusInfo.label}
            </span>
          </div>
          {periodEnd && (
            <p style={{ fontSize: '0.82rem', color: '#6b7280', marginBottom: 16 }}>
              {status === 'canceled' ? 'Access until' : 'Renews'}: {periodEnd}
            </p>
          )}
          {!isActive && status !== 'canceled' && (
            <p style={{ fontSize: '0.82rem', color: '#6b7280', marginBottom: 16 }}>
              <Link href="/subscribe" style={{ color: '#2d7a4f', fontWeight: 600 }}>Subscribe now</Link> to get full access.
            </p>
          )}
          {isActive && <ManageSubscriptionButton />}
          {status === 'canceled' && periodEnd && (
            <Link href="/subscribe" style={{ display: 'inline-block', marginTop: 8, background: '#2d7a4f', color: 'white', borderRadius: 8, padding: '9px 18px', fontSize: '0.82rem', fontWeight: 700, textDecoration: 'none' }}>
              Re-subscribe
            </Link>
          )}
        </div>

        {/* Email card */}
        <div style={{ background: 'white', borderRadius: 14, padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
            Email
          </div>
          <p style={{ fontSize: '0.88rem', color: '#1f2937' }}>{user.email}</p>
        </div>
      </div>
    </div>
  )
}
