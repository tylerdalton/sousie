import { createAdminClient } from '@/lib/supabase/admin'
import type { Coupon } from '@/lib/types'
import CouponManager from './CouponManager'

export default async function AdminCouponsPage() {
  const admin = createAdminClient()
  const { data: coupons } = await admin
    .from('coupons')
    .select('*')
    .order('created_at', { ascending: false }) as { data: Coupon[] | null }

  return (
    <div>
      <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1f2937', marginBottom: 24, letterSpacing: '-0.02em' }}>
        Coupon Codes
      </h1>
      <CouponManager initialCoupons={coupons ?? []} />
    </div>
  )
}
