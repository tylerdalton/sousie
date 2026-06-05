import Link from 'next/link'

export default function SubscribeSuccessPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f4f1', padding: '20px', fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
      {/* Auto-redirect after 4 seconds once webhook activates the subscription */}
      <meta httpEquiv="refresh" content="4;url=/weeks" />

      <div style={{ background: 'white', borderRadius: 16, padding: '40px 32px', width: '100%', maxWidth: 420, boxShadow: '0 4px 20px rgba(0,0,0,0.1)', textAlign: 'center' }}>
        <div style={{ fontSize: '3.5rem', marginBottom: 16 }}>🎉</div>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#2d7a4f', letterSpacing: '-0.02em', marginBottom: 10 }}>
          You&apos;re all set!
        </h1>
        <p style={{ color: '#6b7280', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: 24 }}>
          Welcome to Sousie. Your subscription is activating — you&apos;ll be redirected to your dashboard in a moment.
        </p>
        <Link
          href="/weeks"
          style={{ background: '#2d7a4f', color: 'white', borderRadius: 10, padding: '12px 32px', fontSize: '0.95rem', fontWeight: 700, textDecoration: 'none', display: 'inline-block' }}
        >
          Go to Dashboard →
        </Link>
        <p style={{ fontSize: '0.72rem', color: '#9ca3af', marginTop: 16 }}>
          You&apos;ll receive a receipt via email from Stripe.
        </p>
      </div>
    </div>
  )
}
