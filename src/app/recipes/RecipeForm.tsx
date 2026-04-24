'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { Recipe, RecipeGroup } from '@/lib/types'

interface Props {
  recipe: Recipe | null
}

export default function RecipeForm({ recipe }: Props) {
  const isNew = !recipe
  const router = useRouter()
  const supabase = createClient()

  const [emoji, setEmoji] = useState(recipe?.emoji ?? '🍽️')
  const [title, setTitle] = useState(recipe?.title ?? '')
  const [sub, setSub] = useState(recipe?.sub ?? '')
  const [recipeGroup, setRecipeGroup] = useState<RecipeGroup>(recipe?.recipe_group ?? 'dinner')
  const [tags, setTags] = useState(recipe?.tags.join(', ') ?? '')
  const [ingredients, setIngredients] = useState(
    recipe?.ingredients.map(i => i.text).join('\n') ?? ''
  )
  const [instructions, setInstructions] = useState(
    recipe?.instructions.map(i => i.text).join('\n') ?? ''
  )
  const [dressings, setDressings] = useState(recipe?.dressings.join('\n') ?? '')
  const [tips, setTips] = useState(recipe?.tips.join('\n') ?? '')
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleSave = async () => {
    if (!title.trim()) return
    setSaving(true)

    const payload = {
      emoji: emoji.trim() || '🍽️',
      title: title.trim(),
      sub: sub.trim() || null,
      recipe_group: recipeGroup,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      ingredients: ingredients.split('\n').map(t => t.trim()).filter(Boolean).map(text => ({ text })),
      instructions: instructions.split('\n').map(t => t.trim()).filter(Boolean).map(text => ({ text })),
      dressings: dressings.split('\n').map(t => t.trim()).filter(Boolean),
      tips: tips.split('\n').map(t => t.trim()).filter(Boolean),
    }

    if (isNew) {
      const { error } = await supabase.from('recipes').insert(payload)
      if (error) { alert('Error: ' + error.message); setSaving(false); return }
    } else {
      const { error } = await supabase.from('recipes').update(payload).eq('id', recipe!.id)
      if (error) { alert('Error: ' + error.message); setSaving(false); return }
    }

    router.push('/recipes')
    router.refresh()
  }

  const handleDelete = async () => {
    if (!confirm(`Delete "${recipe!.title}"? This cannot be undone.`)) return
    setDeleting(true)
    await supabase.from('recipes').delete().eq('id', recipe!.id)
    router.push('/recipes')
    router.refresh()
  }

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
              {isNew ? 'Add Recipe' : 'Edit Recipe'}
            </h1>
            <p>{isNew ? "Add to Sousie's recipe library" : recipe.title}</p>
          </div>
          <Link href="/dietary-counsel" style={{ background: 'rgba(255,255,255,0.18)', color: 'white', borderRadius: 8, padding: '5px 10px', fontSize: '0.73rem', textDecoration: 'none', fontWeight: 600 }}>
            🥗 Counsel
          </Link>
        </div>
      </header>

      <div className="panel">
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
          <div style={{ flex: '0 0 70px' }}>
            <label className="form-label">Emoji</label>
            <input
              className="form-input"
              value={emoji}
              onChange={e => setEmoji(e.target.value)}
              style={{ fontSize: '1.4rem', textAlign: 'center' }}
              maxLength={4}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label className="form-label">Recipe Name</label>
            <input
              className="form-input"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Sheet Pan Tilapia"
            />
          </div>
        </div>

        <label className="form-label">Subtitle / Timing</label>
        <input
          className="form-input"
          value={sub}
          onChange={e => setSub(e.target.value)}
          placeholder="e.g. Monday dinner · 15 min prep · 35 min total"
        />

        <label className="form-label">Recipe Type</label>
        <select className="form-input" value={recipeGroup} onChange={e => setRecipeGroup(e.target.value as RecipeGroup)}>
          <option value="dinner">🌙 Dinner</option>
          <option value="breakfast">🌅 Breakfast</option>
          <option value="dressing">🧴 Dressing / Sauce</option>
        </select>

        <label className="form-label">Tags (comma-separated)</label>
        <input
          className="form-input"
          value={tags}
          onChange={e => setTags(e.target.value)}
          placeholder="e.g. Fish, GF, Sheet Pan"
        />

        <label className="form-label">Ingredients (one per line)</label>
        <textarea
          className="form-textarea"
          value={ingredients}
          onChange={e => setIngredients(e.target.value)}
          placeholder={'4–5 tilapia fillets\n2 large sweet potatoes\n3 tbsp olive oil'}
          style={{ minHeight: 140 }}
        />

        <label className="form-label">Instructions (one step per line)</label>
        <textarea
          className="form-textarea"
          value={instructions}
          onChange={e => setInstructions(e.target.value)}
          placeholder={'Preheat oven to 425°F.\nToss sweet potatoes with oil and season.\nRoast 15 minutes...'}
          style={{ minHeight: 160 }}
        />

        <label className="form-label">Serving Options / Use It For (one per line)</label>
        <textarea
          className="form-textarea"
          value={dressings}
          onChange={e => setDressings(e.target.value)}
          placeholder="Option A: Extra lemon + parsley&#10;Option B: Tahini drizzle"
        />

        <label className="form-label">Tips (one per line)</label>
        <textarea
          className="form-textarea"
          value={tips}
          onChange={e => setTips(e.target.value)}
          placeholder="Make extra sweet potatoes for tomorrow's rice bowl."
        />

        <div style={{ display: 'flex', gap: 10, marginTop: 20, flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving || !title.trim()}>
            {saving ? 'Saving…' : isNew ? '✓ Create Recipe' : '✓ Save Changes'}
          </button>
          <button className="btn btn-secondary" onClick={() => router.back()}>Cancel</button>
          {!isNew && (
            <button className="btn btn-danger" onClick={handleDelete} disabled={deleting} style={{ marginLeft: 'auto' }}>
              {deleting ? 'Deleting…' : '🗑️ Delete Recipe'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
