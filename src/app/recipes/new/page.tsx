import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import RecipeForm from '../RecipeForm'

export default async function NewRecipePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return <RecipeForm recipe={null} />
}
