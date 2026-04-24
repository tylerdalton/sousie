import Link from 'next/link'

export default function DietaryCounselPage() {
  const guides = [
    {
      href: '/dietary-counsel/gluten-free',
      emoji: '🌾',
      emojiAlt: '🚫',
      title: 'Gluten-Free Living',
      description:
        'Learn what gluten is, where it hides, how to read labels, safe grain alternatives, and how to eat out with confidence.',
      tags: ['Hidden sources', 'Safe swaps', 'Label reading', 'Eating out'],
      color: '#2d7a4f',
      bg: '#e8f5ee',
    },
    {
      href: '/dietary-counsel/low-budget-dining',
      emoji: '💰',
      title: 'Low-Budget Dining',
      description:
        'Stretch every dollar without sacrificing nutrition or flavor. Covers pantry staples, batch cooking, cheap proteins, and smart shopping habits.',
      tags: ['Pantry staples', 'Batch cooking', 'Budget proteins', 'Shopping tips'],
      color: '#e07b39',
      bg: '#fdf3ec',
    },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4f1', fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>

      {/* Nav */}
      <nav style={{ background: 'white', borderBottom: '1px solid #e5e7eb', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <span style={{ fontSize: '1.4rem' }}>👩‍🍳</span>
          <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#2d7a4f', letterSpacing: '-0.02em' }}>Sousie</span>
        </Link>
        <Link href="/login" style={{ background: '#2d7a4f', color: 'white', borderRadius: 8, padding: '7px 16px', fontSize: '0.82rem', fontWeight: 600, textDecoration: 'none' }}>
          Sign In
        </Link>
      </nav>

      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, #2d7a4f 0%, #1e5436 100%)', color: 'white', padding: '52px 24px 60px', textAlign: 'center' }}>
        <div style={{ maxWidth: 520, margin: '0 auto' }}>
          <div style={{ fontSize: '3rem', marginBottom: 14, lineHeight: 1 }}>🥗</div>
          <h1 style={{ fontSize: 'clamp(1.7rem, 5vw, 2.4rem)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 14 }}>
            Dietary Counsel
          </h1>
          <p style={{ fontSize: '0.95rem', opacity: 0.88, lineHeight: 1.7 }}>
            Practical guides to help you eat well — whatever your dietary goals or constraints. Pick a topic to get started.
          </p>
        </div>
      </section>

      {/* Guides */}
      <section style={{ padding: '40px 24px 64px', maxWidth: 680, margin: '0 auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {guides.map((guide) => (
            <Link
              key={guide.href}
              href={guide.href}
              style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
            >
              <div style={{
                background: 'white',
                borderRadius: 14,
                padding: '24px',
                boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                border: '1.5px solid #e5e7eb',
                transition: 'box-shadow 0.15s',
                cursor: 'pointer',
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: 12, background: guide.bg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.7rem', flexShrink: 0,
                  }}>
                    {guide.emoji}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                      <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1f2937', letterSpacing: '-0.01em' }}>
                        {guide.title}
                      </h2>
                      <span style={{ color: '#9ca3af', fontSize: '1rem' }}>→</span>
                    </div>
                    <p style={{ fontSize: '0.82rem', color: '#6b7280', lineHeight: 1.6, marginBottom: 12 }}>
                      {guide.description}
                    </p>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {guide.tags.map((tag) => (
                        <span
                          key={tag}
                          style={{
                            fontSize: '0.68rem', fontWeight: 600,
                            padding: '3px 9px', borderRadius: 20,
                            background: guide.bg, color: guide.color,
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <p style={{ textAlign: 'center', fontSize: '0.76rem', color: '#9ca3af', marginTop: 36 }}>
          More guides coming soon.
        </p>
      </section>

      {/* Footer */}
      <footer style={{ background: '#1e5436', color: 'rgba(255,255,255,0.5)', padding: '20px 24px', textAlign: 'center', fontSize: '0.72rem' }}>
        👩‍🍳 Sousie · A digital butler for your pantry.
      </footer>

    </div>
  )
}
