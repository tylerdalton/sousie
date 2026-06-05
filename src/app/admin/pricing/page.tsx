import { createAdminClient } from '@/lib/supabase/admin'
import type { PricingConfig } from '@/lib/types'
import PricingForm from './PricingForm'

export default async function AdminPricingPage() {
  const admin = createAdminClient()
  const { data: pricing } = await admin
    .from('pricing_config')
    .select('*')
    .single() as { data: PricingConfig | null }

  return (
    <div>
      <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1f2937', marginBottom: 24, letterSpacing: '-0.02em' }}>
        Pricing Configuration
      </h1>
      {pricing
        ? <PricingForm pricing={pricing} />
        : <p style={{ color: '#dc2626', fontSize: '0.88rem' }}>No pricing config found. Run the database migration first.</p>
      }
    </div>
  )
}
