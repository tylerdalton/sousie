'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

interface Props {
  weekId: string
  weekLabel: string
}

export default function WeekActions({ weekId, weekLabel }: Props) {
  const [confirming, setConfirming] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleDelete = async () => {
    setDeleting(true)
    // Delete children first in case cascade isn't set on FK
    await supabase.from('meal_slots').delete().eq('week_id', weekId)
    await supabase.from('shopping_items').delete().eq('week_id', weekId)
    await supabase.from('weeks').delete().eq('id', weekId)
    router.refresh()
  }

  if (confirming) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }} onClick={e => e.preventDefault()}>
        <span style={{ fontSize: '0.75rem', color: 'var(--gray)' }}>Delete &ldquo;{weekLabel}&rdquo;?</span>
        <button
          onClick={handleDelete}
          disabled={deleting}
          style={{ fontSize: '0.72rem', fontWeight: 700, color: 'white', background: '#dc2626', border: 'none', borderRadius: 5, padding: '3px 10px', cursor: 'pointer' }}
        >
          {deleting ? 'Deleting…' : 'Yes, delete'}
        </button>
        <button
          onClick={() => setConfirming(false)}
          style={{ fontSize: '0.72rem', color: 'var(--gray)', background: 'none', border: 'none', cursor: 'pointer', padding: '3px 4px' }}
        >
          Cancel
        </button>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', gap: 6, marginTop: 8 }} onClick={e => e.preventDefault()}>
      <Link
        href={`/week/${weekId}/edit`}
        style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--green)', background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 5, padding: '3px 10px', textDecoration: 'none' }}
      >
        ✏️ Edit
      </Link>
      <button
        onClick={() => setConfirming(true)}
        style={{ fontSize: '0.72rem', fontWeight: 600, color: '#dc2626', background: '#fff1f0', border: '1px solid #fca5a5', borderRadius: 5, padding: '3px 10px', cursor: 'pointer' }}
      >
        🗑️ Delete
      </button>
    </div>
  )
}
