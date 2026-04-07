import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import NewWeekForm from './NewWeekForm'

export default async function NewWeekPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: recipes } = await supabase
    .from('recipes')
    .select('*')
    .order('recipe_group', { ascending: true })
    .order('sort_order', { ascending: true })

  // Get the last week to suggest a label
  const { data: lastWeek } = await supabase
    .from('weeks')
    .select('label')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  const nextLabel = lastWeek
    ? `Week ${parseInt(lastWeek.label.replace(/\D/g, '') || '1') + 1}`
    : 'Week 1'

  return <NewWeekForm recipes={recipes ?? []} defaultLabel={nextLabel} />
}
