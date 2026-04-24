import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import NewWeekForm from '../../new/NewWeekForm'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditWeekPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: week } = await supabase
    .from('weeks')
    .select('*')
    .eq('id', id)
    .single()

  if (!week) notFound()

  const { data: recipes } = await supabase
    .from('recipes')
    .select('*')
    .order('recipe_group', { ascending: true })
    .order('sort_order', { ascending: true })

  return (
    <NewWeekForm
      recipes={recipes ?? []}
      defaultLabel={week.label}
      weekId={week.id}
      initialNotes={week.notes ?? ''}
      initialStartDate={week.start_date ?? ''}
    />
  )
}
