import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ valid: false }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')?.trim()
  if (!code) return NextResponse.json({ valid: false })

  const { data } = await supabase
    .from('coupons')
    .select('stripe_promo_code_id, discount_display, active')
    .eq('code', code.toUpperCase())
    .single()

  if (!data || !data.active) {
    return NextResponse.json({ valid: false })
  }

  return NextResponse.json({
    valid: true,
    discount_display: data.discount_display,
    promoCodeId: data.stripe_promo_code_id,
  })
}
