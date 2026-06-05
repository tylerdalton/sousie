import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import EditWeekForm from './EditWeekForm'
import type { MealSlot, Recipe } from '@/lib/types'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditWeekPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: week } = await supabase.from('weeks').select('*').eq('id', id).single()
  if (!week) notFound()

  const [{ data: slots }, { data: items }, { data: recipes }] = await Promise.all([
    supabase
      .from('meal_slots')
      .select('*, recipe:recipe_id(*)')
      .eq('week_id', id)
      .order('day_index', { ascending: true }),
    supabase
      .from('shopping_items')
      .select('*')
      .eq('week_id', id)
      .order('sort_order', { ascending: true }),
    supabase
      .from('recipes')
      .select('*')
      .order('recipe_group', { ascending: true })
      .order('sort_order', { ascending: true }),
  ])

  return (
    <EditWeekForm
      week={week}
      slots={(slots ?? []) as (MealSlot & { recipe: Recipe | null })[]}
      items={items ?? []}
      recipes={(recipes ?? []) as Recipe[]}
    />
  )
}
