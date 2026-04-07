import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import RecipeForm from '../../RecipeForm'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditRecipePage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: recipe } = await supabase.from('recipes').select('*').eq('id', id).single()
  if (!recipe) notFound()

  return <RecipeForm recipe={recipe} />
}
