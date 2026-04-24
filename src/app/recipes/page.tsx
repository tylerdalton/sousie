import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import type { Recipe } from '@/lib/types'
import { RECIPE_GROUP_LABELS } from '@/lib/types'

export default async function RecipesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: recipes } = await supabase
    .from('recipes')
    .select('*')
    .order('recipe_group', { ascending: true })
    .order('sort_order', { ascending: true })

  const groups = [
    { key: 'dinner', label: RECIPE_GROUP_LABELS.dinner, items: (recipes ?? []).filter((r: Recipe) => r.recipe_group === 'dinner') },
    { key: 'breakfast', label: RECIPE_GROUP_LABELS.breakfast, items: (recipes ?? []).filter((r: Recipe) => r.recipe_group === 'breakfast') },
    { key: 'dressing', label: RECIPE_GROUP_LABELS.dressing, items: (recipes ?? []).filter((r: Recipe) => r.recipe_group === 'dressing') },
  ]

  return (
    <div>
      <header className="app-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Link href="/weeks" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: '1.3rem' }}>👩‍🍳</span>
                <span style={{ opacity: 0.7, fontWeight: 400, fontSize: '1rem' }}>Sousie</span>
              </Link>
              <span style={{ opacity: 0.4, fontWeight: 300 }}>·</span>
              Sousie&apos;s Recipes
            </h1>
            <p>{(recipes ?? []).length} recipes in your library</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Link href="/dietary-counsel" style={{ background: 'rgba(255,255,255,0.18)', color: 'white', borderRadius: 8, padding: '5px 10px', fontSize: '0.73rem', textDecoration: 'none', fontWeight: 600 }}>
              🥗 Counsel
            </Link>
            <Link href="/weeks" style={{ background: 'rgba(255,255,255,0.18)', border: 'none', color: 'white', borderRadius: 8, padding: '5px 10px', fontSize: '0.73rem', cursor: 'pointer', textDecoration: 'none' }}>
              ← Home
            </Link>
          </div>
        </div>
      </header>

      <div className="panel">
        <div className="toolbar">
          <Link href="/recipes/new" className="btn btn-primary">+ Add Recipe</Link>
        </div>

        {groups.map(group => group.items.length > 0 && (
          <div key={group.key}>
            <div className="recipe-section-label">{group.label}</div>
            {group.items.map((recipe: Recipe) => (
              <Link key={recipe.id} href={`/recipes/${recipe.id}/edit`} className="recipe-card" style={{ display: 'block', textDecoration: 'none' }}>
                <div className="recipe-card-inner">
                  <div className="recipe-emoji">{recipe.emoji}</div>
                  <div className="recipe-card-info">
                    <div className="recipe-card-title">{recipe.title}</div>
                    {recipe.sub && <div className="recipe-card-sub">{recipe.sub}</div>}
                    <div className="recipe-card-tags">
                      {recipe.tags.map((tag: string) => <span key={tag} className="recipe-tag">{tag}</span>)}
                    </div>
                  </div>
                  <div className="recipe-chevron">✏️</div>
                </div>
              </Link>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
