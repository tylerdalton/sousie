import { createAdminClient } from '@/lib/supabase/admin'
import UserActions from './UserActions'

interface UserRow {
  id: string
  user_id: string
  role: string
  subscription_status: string
  subscription_period_end: string | null
  stripe_customer_id: string | null
  created_at: string
  email: string | null
}

const STATUS_COLORS: Record<string, string> = {
  active:   '#059669',
  trialing: '#2563eb',
  past_due: '#d97706',
  canceled: '#6b7280',
  none:     '#9ca3af',
}

export default async function AdminUsersPage() {
  const admin = createAdminClient()

  // Fetch profiles with email via admin auth API
  const { data: profiles } = await admin
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  // Enrich with emails from auth.users
  const { data: { users: authUsers } } = await admin.auth.admin.listUsers({ perPage: 1000 })
  const emailMap = Object.fromEntries(authUsers.map(u => [u.id, u.email ?? null]))

  const rows: UserRow[] = (profiles ?? []).map(p => ({
    ...p,
    email: emailMap[p.user_id] ?? null,
  }))

  return (
    <div>
      <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1f2937', marginBottom: 24, letterSpacing: '-0.02em' }}>
        Users ({rows.length})
      </h1>

      <div style={{ background: 'white', borderRadius: 14, boxShadow: '0 1px 3px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
            <thead>
              <tr style={{ background: '#f9fafb' }}>
                {['Email', 'Role', 'Subscription', 'Period End', 'Joined', ''].map(h => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: 'left', color: '#6b7280', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(row => (
                <tr key={row.id} style={{ borderTop: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '12px 16px', color: '#1f2937', fontWeight: 500 }}>{row.email ?? '—'}</td>
                  <td style={{ padding: '12px 16px' }}>
                    {row.role === 'admin' ? (
                      <span style={{ background: '#fef3c7', color: '#92400e', borderRadius: 20, padding: '3px 10px', fontSize: '0.72rem', fontWeight: 700 }}>Admin</span>
                    ) : (
                      <span style={{ color: '#6b7280', fontSize: '0.78rem' }}>User</span>
                    )}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      background: row.subscription_status === 'active' || row.subscription_status === 'trialing' ? '#d1fae5' : '#f3f4f6',
                      color: STATUS_COLORS[row.subscription_status] ?? '#6b7280',
                      borderRadius: 20, padding: '3px 10px', fontSize: '0.72rem', fontWeight: 700,
                    }}>
                      {row.subscription_status}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#6b7280', whiteSpace: 'nowrap' }}>
                    {row.subscription_period_end
                      ? new Date(row.subscription_period_end).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                      : '—'}
                  </td>
                  <td style={{ padding: '12px 16px', color: '#6b7280', whiteSpace: 'nowrap' }}>
                    {new Date(row.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <UserActions
                      userId={row.user_id}
                      currentRole={row.role}
                      currentStatus={row.subscription_status}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {rows.length === 0 && (
          <p style={{ padding: '20px', color: '#6b7280', fontSize: '0.83rem' }}>No users yet.</p>
        )}
      </div>
    </div>
  )
}
