import Link from 'next/link'

export default function MarketingPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#f0f4f1', fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>

      {/* Nav */}
      <nav style={{ background: 'white', borderBottom: '1px solid #e5e7eb', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: '1.4rem' }}>👩‍🍳</span>
          <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#2d7a4f', letterSpacing: '-0.02em' }}>Sousie</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href="/dietary-counsel" style={{ color: '#2d7a4f', fontSize: '0.82rem', fontWeight: 600, textDecoration: 'none' }}>
            Dietary Counsel
          </Link>
          <Link href="/login" style={{ color: '#4b5563', fontSize: '0.82rem', fontWeight: 600, textDecoration: 'none' }}>
            Sign In
          </Link>
          <Link href="/register" style={{ background: '#2d7a4f', color: 'white', borderRadius: 8, padding: '7px 16px', fontSize: '0.82rem', fontWeight: 600, textDecoration: 'none' }}>
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, #2d7a4f 0%, #1e5436 100%)', color: 'white', padding: '64px 24px 72px', textAlign: 'center' }}>
        <div style={{ maxWidth: 580, margin: '0 auto' }}>
          <div style={{ fontSize: '4rem', marginBottom: 16, lineHeight: 1 }}>👩‍🍳</div>
          <h1 style={{ fontSize: 'clamp(2rem, 6vw, 3rem)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 18 }}>
            Your personal sous chef
          </h1>
          <p style={{ fontSize: 'clamp(1rem, 3vw, 1.18rem)', opacity: 0.88, lineHeight: 1.65, marginBottom: 14 }}>
            Plan a week of meals in minutes. Sousie uses AI to generate recipes tailored to your family, builds your shopping list, and keeps you on budget — all in one place.
          </p>
          <p style={{ fontSize: '0.84rem', opacity: 0.7, marginBottom: 36 }}>
            No spreadsheets. No Pinterest rabbit holes. Just dinner, sorted.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/register" style={{ background: 'white', color: '#2d7a4f', borderRadius: 10, padding: '12px 28px', fontSize: '0.95rem', fontWeight: 700, textDecoration: 'none', display: 'inline-block' }}>
              Get Started — $5/mo
            </Link>
            <Link href="/demo" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', borderRadius: 10, padding: '12px 28px', fontSize: '0.95rem', fontWeight: 600, textDecoration: 'none', display: 'inline-block', border: '1.5px solid rgba(255,255,255,0.3)' }}>
              Try Demo →
            </Link>
          </div>
          <p style={{ fontSize: '0.72rem', opacity: 0.55, marginTop: 14 }}>
            Demo requires a free account · Cancel anytime
          </p>
        </div>
      </section>

      {/* Value pills */}
      <section style={{ background: 'white', padding: '22px', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: 640, margin: '0 auto', display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
          {[
            { icon: '🤖', text: 'AI-generated meal plans' },
            { icon: '🛒', text: 'Automatic shopping list' },
            { icon: '💰', text: 'Weekly budget tracking' },
            { icon: '🔄', text: 'Ingredient substitutions' },
            { icon: '📱', text: 'Works offline (PWA)' },
          ].map(({ icon, text }) => (
            <span key={text} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#e8f5ee', color: '#2d7a4f', borderRadius: 20, padding: '6px 14px', fontSize: '0.8rem', fontWeight: 600 }}>
              {icon} {text}
            </span>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" style={{ padding: '56px 24px', maxWidth: 680, margin: '0 auto' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1f2937', textAlign: 'center', marginBottom: 8, letterSpacing: '-0.02em' }}>
          From blank week to full fridge in 4 steps
        </h2>
        <p style={{ textAlign: 'center', color: '#6b7280', fontSize: '0.88rem', marginBottom: 40 }}>
          No learning curve. You'll have your first week planned in minutes.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[
            {
              step: '1',
              icon: '📅',
              title: 'Create a new week',
              desc: 'Name your week, set a start date, and add dietary notes — or load your saved preferences with one tap.',
            },
            {
              step: '2',
              icon: '✨',
              title: 'Let AI plan your meals',
              desc: 'Tell Sousie how many breakfasts, lunches, and dinners you want. It builds an AI prompt you paste into Claude or ChatGPT. The result: full recipes with ingredients, steps, timing, and tips — tuned to your family.',
            },
            {
              step: '3',
              icon: '🗓️',
              title: 'Review and customize',
              desc: 'Meals appear pre-assigned across the week. Swap any meal, type in a quick note, or leave a slot blank. You\'re always in control.',
            },
            {
              step: '4',
              icon: '🛒',
              title: 'Shopping list — done',
              desc: 'Every ingredient from every recipe, consolidated, deduplicated, sorted by category, and priced. You\'ll know you\'re under budget before you hit the store.',
            },
          ].map(({ step, icon, title, desc }) => (
            <div key={step} style={{ display: 'flex', gap: 16, background: 'white', borderRadius: 12, padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
              <div style={{ flexShrink: 0, width: 36, height: 36, borderRadius: '50%', background: '#2d7a4f', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem' }}>
                {step}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 5 }}>
                  <span style={{ fontSize: '1.1rem' }}>{icon}</span>
                  <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1f2937' }}>{title}</span>
                </div>
                <p style={{ fontSize: '0.82rem', color: '#6b7280', lineHeight: 1.6 }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 36 }}>
          <Link href="/demo" style={{ background: '#2d7a4f', color: 'white', borderRadius: 10, padding: '11px 28px', fontSize: '0.9rem', fontWeight: 700, textDecoration: 'none', display: 'inline-block' }}>
            See a live demo →
          </Link>
          <p style={{ fontSize: '0.72rem', color: '#9ca3af', marginTop: 10 }}>Free preview · sign-in required</p>
        </div>
      </section>

      {/* Feature grid */}
      <section style={{ background: 'white', padding: '56px 24px', borderTop: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1f2937', textAlign: 'center', marginBottom: 8, letterSpacing: '-0.02em' }}>
            Everything in one app
          </h2>
          <p style={{ textAlign: 'center', color: '#6b7280', fontSize: '0.88rem', marginBottom: 36 }}>
            No more cross-referencing recipes, apps, and spreadsheets.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
            {[
              { icon: '🍽️', title: 'Recipe library', desc: 'Save and organize your favorite recipes with full ingredients, instructions, and tips.' },
              { icon: '🔄', title: 'Ingredient swaps', desc: 'Built-in substitution guide for common dietary swaps — with verdict ratings.' },
              { icon: '💵', title: 'Budget tracking', desc: 'Cost estimates per item, totals per category, and a running weekly budget.' },
              { icon: '✅', title: 'Shop as you go', desc: 'Check off items at the store. Already-have items stay visible but struck through.' },
              { icon: '🖨️', title: 'Print-ready', desc: 'One-tap print view for your shopping list, meal plan, or both.' },
              { icon: '📱', title: 'Works offline', desc: 'Installable as a PWA — use it at the grocery store without a signal.' },
              { icon: '🥗', title: 'Dietary counsel', desc: 'Guides on gluten-free living, budget dining, and more — always available, even without a subscription.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} style={{ background: '#f0f4f1', borderRadius: 10, padding: '16px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={{ fontSize: '1.4rem' }}>{icon}</span>
                <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#1f2937' }}>{title}</span>
                <span style={{ fontSize: '0.76rem', color: '#6b7280', lineHeight: 1.5 }}>{desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section style={{ padding: '56px 24px', background: '#f0f4f1' }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1f2937', textAlign: 'center', marginBottom: 8, letterSpacing: '-0.02em' }}>
            Simple, honest pricing
          </h2>
          <p style={{ textAlign: 'center', color: '#6b7280', fontSize: '0.88rem', marginBottom: 36 }}>
            One plan. Everything included. Cancel anytime.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
            {/* Monthly */}
            <div style={{ background: 'white', borderRadius: 14, padding: '28px 24px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', border: '2px solid #e5e7eb' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>Monthly</div>
              <div style={{ fontSize: '2.6rem', fontWeight: 900, color: '#2d7a4f', letterSpacing: '-0.04em', lineHeight: 1, marginBottom: 4 }}>$5</div>
              <div style={{ fontSize: '0.82rem', color: '#6b7280', marginBottom: 20 }}>per month, billed monthly</div>
              <Link href="/register" style={{ display: 'block', textAlign: 'center', background: '#e8f5ee', color: '#2d7a4f', borderRadius: 8, padding: '10px', fontSize: '0.88rem', fontWeight: 700, textDecoration: 'none' }}>
                Get Started
              </Link>
            </div>

            {/* Annual */}
            <div style={{ background: 'white', borderRadius: 14, padding: '28px 24px', boxShadow: '0 2px 12px rgba(45,122,79,0.15)', border: '2px solid #2d7a4f', position: 'relative' }}>
              <div style={{ position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)', background: '#2d7a4f', color: 'white', borderRadius: 20, padding: '4px 14px', fontSize: '0.68rem', fontWeight: 700, whiteSpace: 'nowrap' }}>
                BEST VALUE — 2 MONTHS FREE
              </div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#2d7a4f', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>Annual</div>
              <div style={{ fontSize: '2.6rem', fontWeight: 900, color: '#2d7a4f', letterSpacing: '-0.04em', lineHeight: 1, marginBottom: 4 }}>$50</div>
              <div style={{ fontSize: '0.82rem', color: '#6b7280', marginBottom: 20 }}>per year · $4.17/mo</div>
              <Link href="/register" style={{ display: 'block', textAlign: 'center', background: '#2d7a4f', color: 'white', borderRadius: 8, padding: '10px', fontSize: '0.88rem', fontWeight: 700, textDecoration: 'none' }}>
                Get Started
              </Link>
            </div>
          </div>

          <p style={{ textAlign: 'center', fontSize: '0.76rem', color: '#9ca3af', marginTop: 20 }}>
            Cancel anytime from your account settings. Secure payment via Stripe.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '64px 24px', textAlign: 'center', background: 'linear-gradient(135deg, #2d7a4f 0%, #1e5436 100%)', color: 'white' }}>
        <div style={{ maxWidth: 480, margin: '0 auto' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🥦</div>
          <h2 style={{ fontSize: '1.7rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 12 }}>
            Ready to eat well this week?
          </h2>
          <p style={{ opacity: 0.85, fontSize: '0.9rem', lineHeight: 1.6, marginBottom: 28 }}>
            Start your first week in minutes. Try the demo to see exactly what you get, or jump straight in for $5/month.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/register" style={{ background: 'white', color: '#2d7a4f', borderRadius: 10, padding: '13px 28px', fontSize: '0.95rem', fontWeight: 700, textDecoration: 'none', display: 'inline-block' }}>
              Get Started
            </Link>
            <Link href="/demo" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', borderRadius: 10, padding: '13px 28px', fontSize: '0.95rem', fontWeight: 600, textDecoration: 'none', display: 'inline-block', border: '1.5px solid rgba(255,255,255,0.3)' }}>
              Try Demo →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#1e5436', color: 'rgba(255,255,255,0.5)', padding: '20px 24px', textAlign: 'center', fontSize: '0.72rem' }}>
        👩‍🍳 Sousie · A digital sous chef for your kitchen.
      </footer>

    </div>
  )
}
