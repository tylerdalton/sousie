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
          <Link href="/login" style={{ background: '#2d7a4f', color: 'white', borderRadius: 8, padding: '7px 16px', fontSize: '0.82rem', fontWeight: 600, textDecoration: 'none' }}>
            Sign In
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, #2d7a4f 0%, #1e5436 100%)', color: 'white', padding: '64px 24px 72px', textAlign: 'center' }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <div style={{ fontSize: '4rem', marginBottom: 16, lineHeight: 1 }}>👩‍🍳</div>
          <h1 style={{ fontSize: 'clamp(2rem, 6vw, 3rem)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 18 }}>
            Meet Sousie
          </h1>
          <p style={{ fontSize: 'clamp(1rem, 3vw, 1.2rem)', opacity: 0.88, lineHeight: 1.6, marginBottom: 32 }}>
            Your personal sous chef. Plan meals for the week, generate AI-powered recipes tailored to your family, build your shopping list, and stay on budget — all in one place.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/login" style={{ background: 'white', color: '#2d7a4f', borderRadius: 10, padding: '12px 28px', fontSize: '0.95rem', fontWeight: 700, textDecoration: 'none', display: 'inline-block' }}>
              Get Started
            </Link>
            <a href="#how-it-works" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', borderRadius: 10, padding: '12px 28px', fontSize: '0.95rem', fontWeight: 600, textDecoration: 'none', display: 'inline-block', border: '1.5px solid rgba(255,255,255,0.3)' }}>
              How it works
            </a>
          </div>
        </div>
      </section>

      {/* Feature pills */}
      <section style={{ background: 'white', padding: '24px', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: 640, margin: '0 auto', display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
          {[
            { icon: '🌱', text: 'Vegetarian-forward' },
            { icon: '🐟', text: 'Fish & light protein' },
            { icon: '🚫🌾', text: 'Gluten-free friendly' },
            { icon: '💰', text: 'Budget under $100/week' },
            { icon: '👨‍👩‍👧‍👦', text: 'Family of 4' },
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
          How Sousie works
        </h2>
        <p style={{ textAlign: 'center', color: '#6b7280', fontSize: '0.88rem', marginBottom: 40 }}>
          From blank week to full fridge in four steps.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[
            {
              step: '1',
              icon: '📅',
              title: 'Create a new week',
              desc: 'Name your week, set a start date, and add any dietary notes — or tap "Use default" to load your saved preferences.',
            },
            {
              step: '2',
              icon: '✨',
              title: 'Let AI plan your meals',
              desc: 'Choose how many breakfasts, lunches, and dinners you want AI to generate. Sousie builds a prompt you paste into any AI chat (Claude, ChatGPT, etc.). The AI returns detailed recipes — full ingredient lists, step-by-step instructions, timing, and tips.',
            },
            {
              step: '3',
              icon: '🗓️',
              title: 'Review your meal plan',
              desc: 'AI meals appear pre-assigned across the week. Swap any meal for one from your recipe library, type in a quick note, or leave it blank to fill in later.',
            },
            {
              step: '4',
              icon: '🛒',
              title: 'Shopping list — done',
              desc: 'Sousie consolidates every ingredient from every recipe into one deduplicated shopping list, already sorted by category (produce, protein, pantry, spices) with cost estimates so you know you\'re under budget before you hit the store.',
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
              { icon: '🥗', title: 'Dietary counsel', desc: 'Guides on gluten-free living, budget dining, and more — interactive and always available.' },
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

      {/* CTA */}
      <section style={{ padding: '64px 24px', textAlign: 'center', background: 'linear-gradient(135deg, #2d7a4f 0%, #1e5436 100%)', color: 'white' }}>
        <div style={{ maxWidth: 480, margin: '0 auto' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🥦</div>
          <h2 style={{ fontSize: '1.7rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 12 }}>
            Ready to eat well this week?
          </h2>
          <p style={{ opacity: 0.85, fontSize: '0.9rem', lineHeight: 1.6, marginBottom: 28 }}>
            Sousie is a private tool for our family — sign in to get started.
          </p>
          <Link href="/login" style={{ background: 'white', color: '#2d7a4f', borderRadius: 10, padding: '13px 32px', fontSize: '0.95rem', fontWeight: 700, textDecoration: 'none', display: 'inline-block' }}>
            Sign In
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#1e5436', color: 'rgba(255,255,255,0.5)', padding: '20px 24px', textAlign: 'center', fontSize: '0.72rem' }}>
        👩‍🍳 Sousie · A digital butler for your pantry.
      </footer>

    </div>
  )
}
