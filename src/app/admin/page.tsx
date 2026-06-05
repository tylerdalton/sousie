import { createAdminClient } from '@/lib/supabase/admin'

export default async function AdminDashboard() {
  const admin = createAdminClient()

  const { count: subscriberCount } = await admin
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .in('subscription_status', ['active', 'trialing'])

  const { data: pricing } = await admin
    .from('pricing_config')
    .select('monthly_price_cents')
    .single()

  const mrr = ((subscriberCount ?? 0) * (pricing?.monthly_price_cents ?? 500)) / 100

  const statCard: React.CSSProperties = {
    background: 'white',
    borderRadius: 14,
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
  }

  return (
    <div>
      <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1f2937', marginBottom: 24, letterSpacing: '-0.02em' }}>
        Dashboard
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
        <div style={statCard}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
            Active Subscribers
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#2d7a4f', letterSpacing: '-0.03em' }}>
            {subscriberCount ?? 0}
          </div>
        </div>

        <div style={statCard}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
            Est. Monthly Revenue
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#2d7a4f', letterSpacing: '-0.03em' }}>
            ${mrr.toFixed(2)}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#9ca3af', marginTop: 4 }}>based on monthly price × subscribers</div>
        </div>
      </div>

      <div style={{ background: 'white', borderRadius: 14, padding: '20px 24px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1f2937', marginBottom: 12 }}>Quick links</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {[
            { href: '/admin/pricing', label: '💰 Configure pricing' },
            { href: '/admin/coupons', label: '🎟️ Manage coupons' },
            { href: '/admin/users', label: '👥 View subscribers' },
          ].map(({ href, label }) => (
            <a key={href} href={href} style={{ background: '#e8f5ee', color: '#2d7a4f', borderRadius: 8, padding: '7px 14px', fontSize: '0.8rem', fontWeight: 600, textDecoration: 'none' }}>
              {label}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
