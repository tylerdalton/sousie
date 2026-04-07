'use client'

import { useState } from 'react'
import type { Recipe } from '@/lib/types'
import { RECIPE_GROUP_LABELS } from '@/lib/types'

interface Props {
  recipes: Recipe[]
  onSelect: (recipe: Recipe | null) => void
  onClose: () => void
}

export default function RecipePicker({ recipes, onSelect, onClose }: Props) {
  const [search, setSearch] = useState('')

  const filtered = search
    ? recipes.filter(r =>
        r.title.toLowerCase().includes(search.toLowerCase()) ||
        r.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
      )
    : recipes

  const groups = [
    { key: 'dinner', label: RECIPE_GROUP_LABELS.dinner, items: filtered.filter(r => r.recipe_group === 'dinner') },
    { key: 'breakfast', label: RECIPE_GROUP_LABELS.breakfast, items: filtered.filter(r => r.recipe_group === 'breakfast') },
    { key: 'dressing', label: RECIPE_GROUP_LABELS.dressing, items: filtered.filter(r => r.recipe_group === 'dressing') },
  ]

  return (
    <div className="modal-overlay open" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal">
        <div className="modal-handle"></div>
        <div className="modal-header">
          <div className="modal-title">Pick a Recipe</div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div style={{ padding: '10px 18px 0' }}>
          <input
            className="form-input"
            type="search"
            placeholder="Search recipes…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            autoFocus
          />
        </div>

        <div className="modal-body" style={{ paddingTop: 10 }}>
          <button
            style={{ display: 'block', width: '100%', textAlign: 'left', padding: '10px 4px', borderBottom: '1px solid var(--gray-mid)', fontSize: '0.83rem', color: 'var(--gray)', background: 'none', border: 'none', cursor: 'pointer', marginBottom: 4 }}
            onClick={() => onSelect(null)}
          >
            🗑️ Clear meal (no recipe)
          </button>

          {groups.map(group => group.items.length > 0 && (
            <div key={group.key}>
              <div className="recipe-section-label">{group.label}</div>
              {group.items.map(recipe => (
                <button
                  key={recipe.id}
                  className="recipe-card"
                  onClick={() => onSelect(recipe)}
                >
                  <div className="recipe-card-inner">
                    <div className="recipe-emoji">{recipe.emoji}</div>
                    <div className="recipe-card-info">
                      <div className="recipe-card-title">{recipe.title}</div>
                      {recipe.sub && <div className="recipe-card-sub">{recipe.sub}</div>}
                    </div>
                    <div className="recipe-chevron">›</div>
                  </div>
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
