import Link from 'next/link'

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', gap: 16, marginBottom: 28 }}>
      <div style={{ flexShrink: 0, width: 32, height: 32, borderRadius: '50%', background: '#2d7a4f', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem', marginTop: 2 }}>
        {n}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1f2937', marginBottom: 6 }}>{title}</div>
        <div style={{ fontSize: '0.83rem', color: '#4b5563', lineHeight: 1.7 }}>{children}</div>
      </div>
    </div>
  )
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code style={{ background: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: 5, padding: '2px 7px', fontFamily: 'monospace', fontSize: '0.82rem', color: '#1f2937' }}>
      {children}
    </code>
  )
}

function Section({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div style={{ background: 'white', borderRadius: 14, padding: '28px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', marginBottom: 24 }}>
      <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1f2937', letterSpacing: '-0.02em', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
        <span>{icon}</span> {title}
      </h2>
      {children}
    </div>
  )
}

function Note({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: '#fff8e7', border: '1px solid #fcd34d', borderRadius: 8, padding: '10px 14px', fontSize: '0.78rem', color: '#92400e', marginTop: 10, lineHeight: 1.6 }}>
      💡 {children}
    </div>
  )
}

function ExternalLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" style={{ color: '#2d7a4f', fontWeight: 600, textDecoration: 'underline' }}>
      {children}
    </a>
  )
}

export default function AdminSetupPage() {
  return (
    <div style={{ maxWidth: 740 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1f2937', letterSpacing: '-0.02em', marginBottom: 6 }}>
          Stripe Setup Guide
        </h1>
        <p style={{ fontSize: '0.83rem', color: '#6b7280', lineHeight: 1.6 }}>
          Everything you need to configure subscriptions, coupons, and the local webhook listener.
          This page is only visible to admins.
        </p>
      </div>

      {/* ── SECTION 1: First-time setup ── */}
      <Section title="First-time Stripe Setup" icon="🏦">
        <Step n={1} title="Create your Stripe account">
          Go to <ExternalLink href="https://dashboard.stripe.com/register">dashboard.stripe.com</ExternalLink> and
          sign up if you haven&apos;t already. Keep test mode on (toggle in the top-left) until you&apos;re
          ready to accept real payments.
        </Step>

        <Step n={2} title="Create a Product">
          In the Stripe Dashboard, go to <strong>Product catalog → + Add product</strong>.
          <ul style={{ marginTop: 8, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <li>Name it <strong>Sousie Subscription</strong></li>
            <li>Add two prices:</li>
          </ul>
          <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ background: '#f9fafb', borderRadius: 8, padding: '10px 14px', border: '1px solid #e5e7eb' }}>
              <strong>Monthly</strong> — Recurring · $5.00 · every 1 month
            </div>
            <div style={{ background: '#f9fafb', borderRadius: 8, padding: '10px 14px', border: '1px solid #e5e7eb' }}>
              <strong>Annual</strong> — Recurring · $50.00 · every 1 year
            </div>
          </div>
          <Note>
            After saving each price, copy its <Code>price_...</Code> ID from the price row.
            You&apos;ll paste these into <Link href="/admin/pricing" style={{ color: '#2d7a4f', fontWeight: 600 }}>Admin → Pricing</Link>.
          </Note>
        </Step>

        <Step n={3} title="Paste Price IDs into Admin → Pricing">
          Go to <Link href="/admin/pricing" style={{ color: '#2d7a4f', fontWeight: 600 }}>Admin → Pricing</Link> and
          paste the two <Code>price_...</Code> IDs into the Monthly and Annual fields. Hit Save.
          Until you do this, the Subscribe page will show an error when users try to check out.
        </Step>

        <Step n={4} title="Add your Stripe keys to .env.local">
          In the Stripe Dashboard go to <strong>Developers → API keys</strong>. Copy both keys and add them:
          <div style={{ background: '#1e293b', color: '#e2e8f0', borderRadius: 8, padding: '14px 16px', marginTop: 10, fontFamily: 'monospace', fontSize: '0.78rem', lineHeight: 1.8 }}>
            STRIPE_SECRET_KEY=sk_test_...<br />
            NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
          </div>
          <Note>Use <Code>sk_test_</Code> / <Code>pk_test_</Code> keys while testing. Switch to live keys when ready to charge real money.</Note>
        </Step>

        <Step n={5} title="Enable the Stripe Customer Portal">
          Go to <ExternalLink href="https://dashboard.stripe.com/settings/billing/portal">
            Dashboard → Settings → Billing → Customer Portal
          </ExternalLink> and toggle it on.
          This is required for the <strong>Account → Manage Subscription</strong> button to work —
          it lets subscribers cancel or update their payment method without you doing anything.
        </Step>
      </Section>

      {/* ── SECTION 2: Webhook ── */}
      <Section title="Webhook Setup" icon="🔗">
        <p style={{ fontSize: '0.83rem', color: '#4b5563', lineHeight: 1.6, marginBottom: 20 }}>
          The webhook is how Stripe tells Sousie when a payment succeeds. Without it, subscribers
          won&apos;t get access after checkout. You need two webhook secrets — one for local
          development and one for production.
        </p>

        <Step n={1} title="Install the Stripe CLI (for local testing)">
          Open Terminal.app and run:
          <div style={{ background: '#1e293b', color: '#e2e8f0', borderRadius: 8, padding: '12px 16px', marginTop: 10, fontFamily: 'monospace', fontSize: '0.8rem', lineHeight: 1.8 }}>
            brew install stripe/stripe-cli/stripe<br />
            stripe login
          </div>
          If you don&apos;t have Homebrew yet:
          <div style={{ background: '#1e293b', color: '#e2e8f0', borderRadius: 8, padding: '12px 16px', marginTop: 8, fontFamily: 'monospace', fontSize: '0.78rem', lineHeight: 1.8 }}>
            /bin/bash -c &quot;$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)&quot;
          </div>
        </Step>

        <Step n={2} title="Start the local webhook forwarder">
          While your dev server is running (<Code>npm run dev</Code>), open a second terminal tab and run:
          <div style={{ background: '#1e293b', color: '#e2e8f0', borderRadius: 8, padding: '12px 16px', marginTop: 10, fontFamily: 'monospace', fontSize: '0.8rem', lineHeight: 1.8 }}>
            stripe listen --forward-to localhost:3000/api/stripe/webhook
          </div>
          It will print a line like:<br />
          <div style={{ background: '#1e293b', color: '#86efac', borderRadius: 8, padding: '10px 14px', marginTop: 8, fontFamily: 'monospace', fontSize: '0.78rem' }}>
            &gt; Ready! Your webhook signing secret is whsec_abc123... (^C to quit)
          </div>
          Copy that <Code>whsec_...</Code> value and add it to <Code>.env.local</Code>:
          <div style={{ background: '#1e293b', color: '#e2e8f0', borderRadius: 8, padding: '12px 16px', marginTop: 8, fontFamily: 'monospace', fontSize: '0.78rem' }}>
            STRIPE_WEBHOOK_SECRET=whsec_...
          </div>
          <Note>Keep this terminal tab open while testing. You&apos;ll see each webhook event logged here as you go through checkout.</Note>
        </Step>

        <Step n={3} title="Production webhook (when you deploy to Vercel)">
          Go to <ExternalLink href="https://dashboard.stripe.com/webhooks">Dashboard → Developers → Webhooks</ExternalLink> and
          click <strong>+ Add endpoint</strong>.
          <ul style={{ marginTop: 8, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <li>URL: <Code>https://your-app.vercel.app/api/stripe/webhook</Code></li>
            <li>Events to listen for:</li>
          </ul>
          <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {['checkout.session.completed', 'customer.subscription.updated', 'customer.subscription.deleted'].map(e => (
              <div key={e} style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 6, padding: '6px 12px', fontFamily: 'monospace', fontSize: '0.78rem', color: '#1f2937' }}>
                {e}
              </div>
            ))}
          </div>
          After saving, click <strong>Reveal</strong> next to <strong>Signing secret</strong> — add that
          as <Code>STRIPE_WEBHOOK_SECRET</Code> in your Vercel environment variables (it&apos;s different
          from the local one).
        </Step>
      </Section>

      {/* ── SECTION 3: Coupons ── */}
      <Section title="Creating Coupon Codes" icon="🎟️">
        <p style={{ fontSize: '0.83rem', color: '#4b5563', lineHeight: 1.6, marginBottom: 20 }}>
          Stripe manages the actual discount logic. Sousie stores the codes so users can look them
          up at checkout. You always create in Stripe first, then register here.
        </p>

        <Step n={1} title="Create the coupon in Stripe">
          Go to <ExternalLink href="https://dashboard.stripe.com/coupons">Dashboard → Coupons → + Create</ExternalLink>.
          Choose your discount type:
          <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ background: '#f9fafb', borderRadius: 8, padding: '12px 14px', border: '1px solid #e5e7eb' }}>
              <strong>Free for family</strong> — Percentage · 100% off · Forever (or set duration)<br />
              <span style={{ fontSize: '0.76rem', color: '#6b7280' }}>Use this to give your wife and daughter free access</span>
            </div>
            <div style={{ background: '#f9fafb', borderRadius: 8, padding: '12px 14px', border: '1px solid #e5e7eb' }}>
              <strong>Discount code</strong> — Percentage or fixed amount · Once or repeating<br />
              <span style={{ fontSize: '0.76rem', color: '#6b7280' }}>For promotional discounts to new subscribers</span>
            </div>
          </div>
          After saving, copy the <strong>Coupon ID</strong> (looks like <Code>co_abc123</Code>).
        </Step>

        <Step n={2} title="Create a Promotion Code in Stripe">
          On the coupon you just created, click <strong>+ Create promotion code</strong>.
          Set the code to something memorable (e.g. <Code>FAMILY</Code> or <Code>LAUNCH50</Code>).
          Copy the <strong>Promotion Code ID</strong> (looks like <Code>promo_abc123</Code>).
          <Note>
            The code users type is the readable one (e.g. <Code>FAMILY</Code>).
            The Promotion Code ID is the internal Stripe reference — both go into the form below.
          </Note>
        </Step>

        <Step n={3} title="Register the code in Sousie">
          Go to <Link href="/admin/coupons" style={{ color: '#2d7a4f', fontWeight: 600 }}>Admin → Coupons</Link> and
          fill in the Create Coupon form:
          <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[
              { field: 'Code', desc: 'The human-readable code users type, e.g. FAMILY or LAUNCH50' },
              { field: 'Discount display', desc: 'What users see when the code is applied, e.g. "Free forever" or "50% off first month"' },
              { field: 'Stripe Coupon ID', desc: 'The co_... ID from the coupon page in Stripe' },
              { field: 'Stripe Promo Code ID', desc: 'The promo_... ID from the promotion code in Stripe' },
              { field: 'Internal description', desc: 'Optional note for your own reference, e.g. "Given to Dalton family"' },
            ].map(({ field, desc }) => (
              <div key={field} style={{ display: 'flex', gap: 10, fontSize: '0.8rem' }}>
                <div style={{ width: 160, flexShrink: 0, fontWeight: 700, color: '#1f2937' }}>{field}</div>
                <div style={{ color: '#6b7280' }}>{desc}</div>
              </div>
            ))}
          </div>
        </Step>

        <Step n={4} title="Share the code with your family">
          When your wife or daughter signs up at <Code>/register</Code>, they log in and land on the
          Subscribe page. They enter the code in the <strong>Have a coupon code?</strong> field,
          click Apply, and the discount shows before checkout. A 100% off coupon means Stripe still
          creates a subscription record (so access works) but charges $0.
        </Step>
      </Section>

      {/* ── SECTION 4: Going live ── */}
      <Section title="Going Live (Real Payments)" icon="🚀">
        <Step n={1} title="Switch to live Stripe keys">
          In the Stripe Dashboard, toggle from <strong>Test mode</strong> to <strong>Live mode</strong>
          (top-left corner). Go to <strong>Developers → API keys</strong> and copy the live keys.
          Update <Code>STRIPE_SECRET_KEY</Code> and <Code>NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</Code> in
          your Vercel environment variables to the live versions.
        </Step>

        <Step n={2} title="Re-create your Product and prices in live mode">
          Products and prices in test mode don&apos;t carry over to live mode. Repeat the product
          setup in live mode and paste the new live <Code>price_...</Code> IDs into
          <Link href="/admin/pricing" style={{ color: '#2d7a4f', fontWeight: 600, marginLeft: 4 }}>Admin → Pricing</Link>.
        </Step>

        <Step n={3} title="Add the production webhook endpoint">
          Follow the production webhook step above (Section 2, Step 3) using your live Vercel URL,
          and update <Code>STRIPE_WEBHOOK_SECRET</Code> in Vercel to the live signing secret.
        </Step>

        <Note>
          Test cards won&apos;t work in live mode — real cards only. Run a quick end-to-end test
          with a real card (you can refund it immediately from the Stripe Dashboard).
        </Note>
      </Section>
    </div>
  )
}
