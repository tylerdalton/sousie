import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { stripe } from '@/lib/stripe'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { priceId, promoCodeId } = await request.json() as { priceId: string; promoCodeId?: string | null }
  if (!priceId) return NextResponse.json({ error: 'Missing priceId' }, { status: 400 })

  const admin = createAdminClient()

  // Get or create Stripe customer
  const { data: profile } = await admin
    .from('profiles')
    .select('stripe_customer_id')
    .eq('user_id', user.id)
    .single()

  let customerId = profile?.stripe_customer_id

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { user_id: user.id },
    })
    customerId = customer.id
    await admin
      .from('profiles')
      .update({ stripe_customer_id: customerId })
      .eq('user_id', user.id)
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    ...(promoCodeId ? { discounts: [{ promotion_code: promoCodeId }] } : { allow_promotion_codes: false }),
    success_url: `${appUrl}/subscribe/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/subscribe`,
  })

  return NextResponse.json({ url: session.url })
}
