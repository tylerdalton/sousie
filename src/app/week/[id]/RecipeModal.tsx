'use client'

import Link from 'next/link'
import type { Recipe } from '@/lib/types'

interface Props {
  recipe: Recipe
  onClose: () => void
}

export default function RecipeModal({ recipe, onClose }: Props) {
  const isDressing = recipe.recipe_group === 'dressing'
  const servingLabel = isDressing ? 'Use It For' : 'Serving Options'

  return (
    <div className="modal-overlay open" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal">
        <div className="modal-handle"></div>
        <div className="modal-header">
          <div>
            <div className="modal-title">{recipe.emoji} {recipe.title}</div>
            {recipe.sub && <div className="modal-sub">{recipe.sub}</div>}
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {/* Tags */}
          {recipe.tags.length > 0 && (
            <div style={{ display: 'flex', gap: 5, marginBottom: 14, flexWrap: 'wrap' }}>
              {recipe.tags.map(tag => <span key={tag} className="recipe-tag">{tag}</span>)}
            </div>
          )}

          {/* Ingredients */}
          {recipe.ingredients.length > 0 && (
            <div className="recipe-section">
              <h3>Ingredients</h3>
              <ul className="recipe-ingredients">
                {recipe.ingredients.map((ing, i) => <li key={i}>{ing.text}</li>)}
              </ul>
            </div>
          )}

          {/* Instructions */}
          {recipe.instructions.length > 0 && (
            <div className="recipe-section">
              <h3>Instructions</h3>
              <ol className="recipe-steps">
                {recipe.instructions.map((step, i) => <li key={i}>{step.text}</li>)}
              </ol>
            </div>
          )}

          {/* Subsections (oatmeal variations) */}
          {recipe.subsections.length > 0 && (
            <div className="recipe-section">
              <h3>Variations</h3>
              {recipe.subsections.map((sub, i) => (
                <div key={i} className="sub-section">
                  <h4>{sub.title}</h4>
                  <ul className="recipe-ingredients">
                    {sub.items.map((item, j) => <li key={j}>{item}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {/* Serving options / dressings */}
          {recipe.dressings.length > 0 && (
            <div className="recipe-section">
              <h3>{servingLabel}</h3>
              {recipe.dressings.map((d, i) => (
                <div key={i} className="recipe-dressing-opt">{d}</div>
              ))}
            </div>
          )}

          {/* Tips */}
          {recipe.tips.length > 0 && (
            <div className="recipe-section">
              <h3>Tips</h3>
              {recipe.tips.map((tip, i) => (
                <div key={i} className="recipe-tip">💡 {tip}</div>
              ))}
            </div>
          )}
        </div>

        <div className="modal-actions no-print">
          <Link href={`/recipes/${recipe.id}/edit`} className="btn btn-secondary">✏️ Edit Recipe</Link>
          <button className="btn btn-secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  )
}
