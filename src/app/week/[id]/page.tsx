import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import WeekDetail from './WeekDetail'
import type { MealSlot, Recipe } from '@/lib/types'

interface Props {
  params: Promise<{ id: string }>
}

export default async function WeekPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Fetch week
  const { data: week } = await supabase.from('weeks').select('*').eq('id', id).single()
  if (!week) notFound()

  // Fetch shopping items
  const { data: items } = await supabase
    .from('shopping_items')
    .select('*')
    .eq('week_id', id)
    .order('sort_order', { ascending: true })

  // Fetch meal slots with recipe data
  const { data: slots } = await supabase
    .from('meal_slots')
    .select('*, recipe:recipe_id(*)')
    .eq('week_id', id)
    .order('day_index', { ascending: true })

  // Fetch all recipes for recipe library tab + meal slot picker
  const { data: recipes } = await supabase
    .from('recipes')
    .select('*')
    .order('recipe_group', { ascending: true })
    .order('sort_order', { ascending: true })

  // Fetch substitutions
  const { data: substitutions } = await supabase
    .from('substitutions')
    .select('*')
    .order('sort_order', { ascending: true })

  return (
    <WeekDetail
      week={week}
      items={items ?? []}
      slots={(slots ?? []) as (MealSlot & { recipe: Recipe | null })[]}
      recipes={(recipes ?? []) as Recipe[]}
      substitutions={substitutions ?? []}
    />
  )
}
