import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createAdminClient } from '@/lib/supabase/admin'
import type Stripe from 'stripe'

// Raw body is required for Stripe signature verification.
// Do not add any body parser or call request.json() before constructEvent.
export async function POST(request: Request) {
  const rawBody = await request.text()
  const sig = request.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 })
  }

  const admin = createAdminClient()

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      if (session.mode !== 'subscription') break

      const subscription = await stripe.subscriptions.retrieve(session.subscription as string)
      const periodEnd = new Date((subscription as Stripe.Subscription).current_period_end * 1000).toISOString()

      await admin
        .from('profiles')
        .update({
          stripe_subscription_id: subscription.id,
          subscription_status: subscription.status,
          subscription_period_end: periodEnd,
        })
        .eq('stripe_customer_id', session.customer as string)
      break
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription
      const periodEnd = new Date(subscription.current_period_end * 1000).toISOString()

      await admin
        .from('profiles')
        .update({
          subscription_status: subscription.status,
          subscription_period_end: periodEnd,
        })
        .eq('stripe_subscription_id', subscription.id)
      break
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription

      await admin
        .from('profiles')
        .update({
          subscription_status: 'canceled',
          subscription_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        })
        .eq('stripe_subscription_id', subscription.id)
      break
    }
  }

  return NextResponse.json({ received: true })
}
