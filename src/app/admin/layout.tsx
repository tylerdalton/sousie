import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('user_id', user.id)
    .single()

  if (profile?.role !== 'admin') redirect('/weeks')

  const navLink: React.CSSProperties = {
    color: 'rgba(255,255,255,0.85)',
    textDecoration: 'none',
    fontSize: '0.78rem',
    fontWeight: 600,
    padding: '4px 10px',
    borderRadius: 6,
    background: 'rgba(255,255,255,0.12)',
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4f1', fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
      <header style={{ background: '#1e5436', color: 'white', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link href="/admin" style={{ color: 'white', textDecoration: 'none', fontWeight: 800, fontSize: '1rem', letterSpacing: '-0.02em' }}>
            ⚙️ Admin
          </Link>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <Link href="/admin" style={navLink}>Dashboard</Link>
            <Link href="/admin/pricing" style={navLink}>Pricing</Link>
            <Link href="/admin/coupons" style={navLink}>Coupons</Link>
            <Link href="/admin/users" style={navLink}>Users</Link>
            <Link href="/admin/setup" style={navLink}>📖 Setup Guide</Link>
          </div>
        </div>
        <Link href="/weeks" style={{ ...navLink, background: 'rgba(255,255,255,0.18)' }}>← App</Link>
      </header>
      <main style={{ padding: '32px 20px', maxWidth: 900, margin: '0 auto' }}>
        {children}
      </main>
    </div>
  )
}
