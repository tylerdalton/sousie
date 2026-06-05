import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import WeekDetail from '@/app/week/[id]/WeekDetail'
import { DEMO_WEEK, DEMO_SLOTS, DEMO_ITEMS, DEMO_RECIPES, DEMO_SUBSTITUTIONS } from './DEMO_DATA'

export default async function DemoPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?next=/demo')

  return (
    <div>
      <div style={{
        background: '#fff8e7',
        borderBottom: '2px solid #e07b39',
        padding: '10px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#92400e' }}>
          📋 Sample week — subscribe to create and manage your own
        </span>
        <Link
          href="/subscribe"
          style={{
            background: '#2d7a4f',
            color: 'white',
            borderRadius: 8,
            padding: '6px 14px',
            fontSize: '0.78rem',
            fontWeight: 700,
            textDecoration: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          Subscribe — $5/mo →
        </Link>
      </div>

      <WeekDetail
        week={DEMO_WEEK}
        items={DEMO_ITEMS}
        slots={DEMO_SLOTS}
        recipes={DEMO_RECIPES}
        substitutions={DEMO_SUBSTITUTIONS}
        readOnly
      />
    </div>
  )
}
