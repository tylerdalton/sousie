import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import type { Week } from '@/lib/types'
import WeekActions from '../WeekActions'
import Logo from '@/components/Logo'

export default async function WeeksPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('user_id', user.id)
    .single()

  const isAdmin = profile?.role === 'admin'

  const { data: weeks } = await supabase
    .from('weeks')
    .select('*')
    .order('created_at', { ascending: true })

  const weekIds = (weeks ?? []).map((w: Week) => w.id)
  const { data: items } = weekIds.length > 0
    ? await supabase
        .from('shopping_items')
        .select('week_id, cost, checked')
        .in('week_id', weekIds)
    : { data: [] }

  type ItemRow = { week_id: string; cost: number; checked: boolean }
  const itemsByWeek: Record<string, ItemRow[]> = {}
  for (const item of (items ?? []) as ItemRow[]) {
    if (!itemsByWeek[item.week_id]) itemsByWeek[item.week_id] = []
    itemsByWeek[item.week_id].push(item)
  }

  async function logout() {
    'use server'
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/')
  }

  return (
    <div>
      <header className="app-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <Link href="/weeks" style={{ textDecoration: 'none', color: 'inherit' }}>
              <Logo size={30} color="white" />
            </Link>
            <p>A digital butler for your pantry.</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            <Link href="/dietary-counsel" style={{ background: 'rgba(255,255,255,0.18)', color: 'white', borderRadius: 8, padding: '5px 10px', fontSize: '0.73rem', textDecoration: 'none', fontWeight: 600 }}>
              🥗 Counsel
            </Link>
            <Link href="/account" style={{ background: 'rgba(255,255,255,0.18)', color: 'white', borderRadius: 8, padding: '5px 10px', fontSize: '0.73rem', textDecoration: 'none', fontWeight: 600 }}>
              Account
            </Link>
            {isAdmin && (
              <Link href="/admin" style={{ background: 'rgba(255,255,255,0.18)', color: 'white', borderRadius: 8, padding: '5px 10px', fontSize: '0.73rem', textDecoration: 'none', fontWeight: 600 }}>
                ⚙️ Admin
              </Link>
            )}
            <form action={logout}>
              <button type="submit" style={{ background: 'rgba(255,255,255,0.18)', border: 'none', color: 'white', borderRadius: 8, padding: '5px 10px', fontSize: '0.73rem', cursor: 'pointer' }}>
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="panel">
        <div className="toolbar">
          <Link href="/week/new" className="btn btn-primary">+ Add New Week</Link>
          <Link href="/recipes" className="btn btn-secondary">📖 Recipe Library</Link>
        </div>

        {(!weeks || weeks.length === 0) ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--gray)' }}>
            <div style={{ fontSize: '3rem', marginBottom: 12 }}>📅</div>
            <p style={{ fontSize: '0.9rem', marginBottom: 16 }}>No weeks yet. Start with Week 1!</p>
            <Link href="/week/new" className="btn btn-primary">Create Your First Week</Link>
          </div>
        ) : (
          <div>
            {(weeks as Week[]).map(week => {
              const weekItems: ItemRow[] = itemsByWeek[week.id] ?? []
              const needed = weekItems.filter(i => !i.checked)
              const totalCost = needed.reduce((s, i) => s + Number(i.cost), 0)
              const checkedCount = weekItems.filter(i => i.checked).length

              return (
                <div key={week.id} className="week-card" style={{ display: 'block' }}>
                  <Link href={`/week/${week.id}`} style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}>
                    <div className="week-card-title">{week.label}</div>
                    {week.start_date && (
                      <div className="week-card-meta">
                        Starting {new Date(week.start_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </div>
                    )}
                    {week.notes && (
                      <div style={{ fontSize: '0.74rem', color: 'var(--gray)', marginBottom: 8 }}>{week.notes}</div>
                    )}
                    <div className="week-card-stats">
                      {weekItems.length > 0 && (
                        <>
                          <span className="week-stat">{needed.length} items to buy</span>
                          {checkedCount > 0 && <span className="week-stat" style={{ background: '#d1fae5', color: '#065f46' }}>{checkedCount} already have</span>}
                          <span className="week-stat">Est. ${totalCost.toFixed(2)}</span>
                        </>
                      )}
                      <span className="week-stat">→ View week</span>
                    </div>
                  </Link>
                  <WeekActions weekId={week.id} weekLabel={week.label} />
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
