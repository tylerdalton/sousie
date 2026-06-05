import Link from 'next/link'
import Logo from '@/components/Logo'
import './home.css'

export default function MarketingPage() {
  return (
    <div className="mkt-page">

      {/* Nav */}
      <nav className="mkt-nav">
        <Logo size={28} color="#2d7a4f" />
        <div className="mkt-nav-links">
          <Link href="/dietary-counsel" className="mkt-nav-link mkt-nav-link--green">
            Dietary Counsel
          </Link>
          <Link href="/login" className="mkt-nav-link">
            Sign In
          </Link>
          <Link href="/register" className="mkt-nav-cta">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="mkt-hero">
        <div className="mkt-hero-inner">
          <span className="mkt-hero-emoji">👩‍🍳</span>
          <h1>Your personal sous chef</h1>
          <p className="mkt-hero-sub">
            Plan a week of meals in minutes. Sousie uses AI to generate recipes tailored to your family, builds your shopping list, and keeps you on budget — all in one place.
          </p>
          <p className="mkt-hero-fine">No spreadsheets. No Pinterest rabbit holes. Just dinner, sorted.</p>
          <div className="mkt-hero-btns">
            <Link href="/register" className="mkt-hero-btn-primary">
              Get Started — $5/mo
            </Link>
            <Link href="/demo" className="mkt-hero-btn-ghost">
              Try Demo →
            </Link>
          </div>
          <p className="mkt-hero-note">Demo requires a free account · Cancel anytime</p>
        </div>
      </section>

      {/* Value pills */}
      <section className="mkt-pills">
        <div className="mkt-pills-inner">
          {[
            { icon: '🤖', text: 'AI-generated meal plans' },
            { icon: '🛒', text: 'Automatic shopping list' },
            { icon: '💰', text: 'Weekly budget tracking' },
            { icon: '🔄', text: 'Ingredient substitutions' },
            { icon: '📱', text: 'Works offline (PWA)' },
          ].map(({ icon, text }) => (
            <span key={text} className="mkt-pill">{icon} {text}</span>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="mkt-section">
        <h2 className="mkt-section-h2">From blank week to full fridge in 4 steps</h2>
        <p className="mkt-section-sub">No learning curve. You&apos;ll have your first week planned in minutes.</p>

        <div className="mkt-steps">
          {[
            { step: '1', icon: '📅', title: 'Create a new week', desc: 'Name your week, set a start date, and add dietary notes — or load your saved preferences with one tap.' },
            { step: '2', icon: '✨', title: 'Let AI plan your meals', desc: 'Tell Sousie how many breakfasts, lunches, and dinners you want. It builds an AI prompt you paste into Claude or ChatGPT. The result: full recipes with ingredients, steps, timing, and tips — tuned to your family.' },
            { step: '3', icon: '🗓️', title: 'Review and customize', desc: "Meals appear pre-assigned across the week. Swap any meal, type in a quick note, or leave a slot blank. You're always in control." },
            { step: '4', icon: '🛒', title: 'Shopping list — done', desc: "Every ingredient from every recipe, consolidated, deduplicated, sorted by category, and priced. You'll know you're under budget before you hit the store." },
          ].map(({ step, icon, title, desc }) => (
            <div key={step} className="mkt-step">
              <div className="mkt-step-num">{step}</div>
              <div className="mkt-step-body">
                <div className="mkt-step-title">
                  <span className="mkt-step-icon">{icon}</span>
                  {title}
                </div>
                <p className="mkt-step-desc">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mkt-section-cta">
          <Link href="/demo" className="btn btn-primary" style={{ padding: '11px 28px', fontSize: '0.9rem' }}>
            See a live demo →
          </Link>
          <p className="mkt-section-cta-note">Free preview · sign-in required</p>
        </div>
      </section>

      {/* Feature grid */}
      <section className="mkt-section--white">
        <div className="mkt-section-inner" style={{ padding: '56px 24px' }}>
          <h2 className="mkt-section-h2">Everything in one app</h2>
          <p className="mkt-section-sub">No more cross-referencing recipes, apps, and spreadsheets.</p>
          <div className="mkt-features">
            {[
              { icon: '🍽️', title: 'Recipe library', desc: 'Save and organize your favorite recipes with full ingredients, instructions, and tips.' },
              { icon: '🔄', title: 'Ingredient swaps', desc: 'Built-in substitution guide for common dietary swaps — with verdict ratings.' },
              { icon: '💵', title: 'Budget tracking', desc: 'Cost estimates per item, totals per category, and a running weekly budget.' },
              { icon: '✅', title: 'Shop as you go', desc: 'Check off items at the store. Already-have items stay visible but struck through.' },
              { icon: '🖨️', title: 'Print-ready', desc: 'One-tap print view for your shopping list, meal plan, or both.' },
              { icon: '📱', title: 'Works offline', desc: 'Installable as a PWA — use it at the grocery store without a signal.' },
              { icon: '🥗', title: 'Dietary counsel', desc: 'Guides on gluten-free living, budget dining, and more — always available, even without a subscription.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="mkt-feature-card">
                <span className="mkt-feature-icon">{icon}</span>
                <span className="mkt-feature-title">{title}</span>
                <span className="mkt-feature-desc">{desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="mkt-pricing">
        <div className="mkt-pricing-inner">
          <h2 className="mkt-section-h2">Simple, honest pricing</h2>
          <p className="mkt-section-sub">One plan. Everything included. Cancel anytime.</p>

          <div className="mkt-pricing-grid">
            <div className="mkt-pricing-card">
              <div className="mkt-pricing-label">Monthly</div>
              <div className="mkt-pricing-price">$5</div>
              <div className="mkt-pricing-period">per month, billed monthly</div>
              <Link href="/register" className="mkt-pricing-btn mkt-pricing-btn--ghost">Get Started</Link>
            </div>

            <div className="mkt-pricing-card mkt-pricing-card--featured">
              <div className="mkt-pricing-badge">BEST VALUE — 2 MONTHS FREE</div>
              <div className="mkt-pricing-label">Annual</div>
              <div className="mkt-pricing-price">$50</div>
              <div className="mkt-pricing-period">per year · $4.17/mo</div>
              <Link href="/register" className="mkt-pricing-btn mkt-pricing-btn--solid">Get Started</Link>
            </div>
          </div>

          <p className="mkt-pricing-note">Cancel anytime from your account settings. Secure payment via Stripe.</p>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="mkt-cta">
        <div className="mkt-cta-inner">
          <span className="mkt-cta-emoji">🥦</span>
          <h2>Ready to eat well this week?</h2>
          <p className="mkt-cta-sub">
            Start your first week in minutes. Try the demo to see exactly what you get, or jump straight in for $5/month.
          </p>
          <div className="mkt-cta-btns">
            <Link href="/register" className="mkt-hero-btn-primary">Get Started</Link>
            <Link href="/demo" className="mkt-hero-btn-ghost">Try Demo →</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mkt-footer">
        Sousie · A digital sous chef for your kitchen.
      </footer>

    </div>
  )
}
