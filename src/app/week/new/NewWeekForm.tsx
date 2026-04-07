'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Recipe } from '@/lib/types'
import { DAY_NAMES, CATEGORY_LABELS, CATEGORY_ORDER, type ShoppingCategory } from '@/lib/types'

interface Props {
  recipes: Recipe[]
  defaultLabel: string
}

type MealType = 'breakfast' | 'lunch' | 'dinner'

interface SlotPlan {
  dayIndex: number
  mealType: MealType
  recipeId: string | null
  freeText: string
}

interface ShoppingItemDraft {
  category: ShoppingCategory
  name: string
  qty: string
  cost: string
  note: string
}

const EMPTY_ITEMS: ShoppingItemDraft[] = []

export default function NewWeekForm({ recipes, defaultLabel }: Props) {
  const [step, setStep] = useState(1)
  const [label, setLabel] = useState(defaultLabel)
  const [startDate, setStartDate] = useState('')
  const [notes, setNotes] = useState('')
  const [slots, setSlots] = useState<SlotPlan[]>(() =>
    DAY_NAMES.flatMap((_, dayIndex) =>
      (['breakfast', 'lunch', 'dinner'] as MealType[]).map(mealType => ({
        dayIndex,
        mealType,
        recipeId: null,
        freeText: '',
      }))
    )
  )
  const [shoppingItems, setShoppingItems] = useState<ShoppingItemDraft[]>(EMPTY_ITEMS)
  const [saving, setSaving] = useState(false)
  const [pickingSlot, setPickingSlot] = useState<{ dayIndex: number; mealType: MealType } | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const getSlot = (dayIndex: number, mealType: MealType) =>
    slots.find(s => s.dayIndex === dayIndex && s.mealType === mealType)

  const setSlotRecipe = (dayIndex: number, mealType: MealType, recipeId: string | null) => {
    setSlots(prev => prev.map(s =>
      s.dayIndex === dayIndex && s.mealType === mealType
        ? { ...s, recipeId, freeText: recipeId ? '' : s.freeText }
        : s
    ))
  }

  const setSlotText = (dayIndex: number, mealType: MealType, text: string) => {
    setSlots(prev => prev.map(s =>
      s.dayIndex === dayIndex && s.mealType === mealType
        ? { ...s, freeText: text, recipeId: null }
        : s
    ))
  }

  const addShoppingItem = () => {
    setShoppingItems(prev => [...prev, { category: 'produce', name: '', qty: '', cost: '', note: '' }])
  }

  const updateShoppingItem = (i: number, field: keyof ShoppingItemDraft, value: string) => {
    setShoppingItems(prev => prev.map((item, idx) => idx === i ? { ...item, [field]: value } : item))
  }

  const removeShoppingItem = (i: number) => {
    setShoppingItems(prev => prev.filter((_, idx) => idx !== i))
  }

  const handleSave = async () => {
    if (!label.trim()) return
    setSaving(true)

    // Create week
    const { data: week, error } = await supabase
      .from('weeks')
      .insert({ label: label.trim(), start_date: startDate || null, notes: notes || null })
      .select()
      .single()

    if (error || !week) { setSaving(false); alert('Failed to create week: ' + error?.message); return }

    // Create meal slots (all 21)
    const slotInserts = slots.map(s => ({
      week_id: week.id,
      day_index: s.dayIndex,
      meal_type: s.mealType,
      recipe_id: s.recipeId || null,
      free_text: s.freeText || null,
    }))
    await supabase.from('meal_slots').insert(slotInserts)

    // Create shopping items
    if (shoppingItems.length > 0) {
      const itemInserts = shoppingItems
        .filter(i => i.name.trim())
        .map((item, idx) => ({
          week_id: week.id,
          category: item.category,
          name: item.name.trim(),
          qty: item.qty || null,
          cost: parseFloat(item.cost) || 0,
          note: item.note || null,
          source: 'manual',
          sort_order: idx,
        }))
      if (itemInserts.length > 0) await supabase.from('shopping_items').insert(itemInserts)
    }

    router.push(`/week/${week.id}`)
  }

  const getRecipeName = (recipeId: string | null) => {
    if (!recipeId) return null
    return recipes.find(r => r.id === recipeId)
  }

  return (
    <div>
      <header className="app-header">
        <h1 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: '1.3rem' }}>👩‍🍳</span> Sousie — Add New Week
        </h1>
        <p>Step {step} of 3 · Let&apos;s plan your week.</p>
      </header>

      {/* Step indicators */}
      <div style={{ display: 'flex', background: 'white', borderBottom: '2px solid var(--gray-mid)', padding: '10px 20px', gap: 8 }}>
        {['Week Details', 'Meal Plan', 'Shopping List'].map((s, i) => (
          <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1 }}>
            <div style={{
              width: 22, height: 22, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.72rem', fontWeight: 700,
              background: step > i + 1 ? 'var(--green)' : step === i + 1 ? 'var(--green)' : 'var(--gray-mid)',
              color: step >= i + 1 ? 'white' : 'var(--gray)',
            }}>
              {step > i + 1 ? '✓' : i + 1}
            </div>
            <span style={{ fontSize: '0.72rem', fontWeight: step === i + 1 ? 700 : 400, color: step === i + 1 ? 'var(--green)' : 'var(--gray)' }}>{s}</span>
          </div>
        ))}
      </div>

      <div className="panel">
        {/* ── Step 1: Week details ── */}
        {step === 1 && (
          <div>
            <label className="form-label">Week Name</label>
            <input className="form-input" value={label} onChange={e => setLabel(e.target.value)} placeholder="Week 2" />

            <label className="form-label">Start Date (optional)</label>
            <input className="form-input" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />

            <label className="form-label">Notes (optional)</label>
            <textarea
              className="form-textarea"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="e.g. Low-Gluten · Budget week · Fish-forward"
            />

            <div style={{ marginTop: 20, display: 'flex', gap: 10 }}>
              <button className="btn btn-primary" onClick={() => setStep(2)} disabled={!label.trim()}>
                Next: Meal Plan →
              </button>
              <a href="/" className="btn btn-secondary">Cancel</a>
            </div>
          </div>
        )}

        {/* ── Step 2: Meal plan ── */}
        {step === 2 && (
          <div>
            <div className="info-box">
              Tap ✏️ next to any meal to assign a recipe. Leave blank for simple meals you&apos;ll fill in later.
            </div>
            {DAY_NAMES.map((day, dayIndex) => (
              <div key={day} className="meal-day">
                <div className="meal-day-header">{day}</div>
                {(['breakfast', 'lunch', 'dinner'] as MealType[]).map(mealType => {
                  const slot = getSlot(dayIndex, mealType)
                  const recipe = getRecipeName(slot?.recipeId ?? null)
                  return (
                    <div key={mealType} className="meal-row">
                      <div className="meal-label">{mealType}</div>
                      <div style={{ flex: 1 }}>
                        {recipe ? (
                          <span style={{ color: 'var(--green)', fontSize: '0.82rem' }}>{recipe.emoji} {recipe.title}</span>
                        ) : slot?.freeText ? (
                          <input
                            value={slot.freeText}
                            onChange={e => setSlotText(dayIndex, mealType, e.target.value)}
                            style={{ border: 'none', outline: 'none', fontSize: '0.82rem', width: '100%', background: 'transparent' }}
                            placeholder="Describe meal…"
                          />
                        ) : (
                          <span style={{ color: 'var(--gray)', fontSize: '0.78rem', fontStyle: 'italic' }}>No meal planned</span>
                        )}
                      </div>
                      <button
                        onClick={() => setPickingSlot({ dayIndex, mealType })}
                        style={{ background: 'none', border: 'none', color: 'var(--gray)', cursor: 'pointer', fontSize: '0.75rem', padding: '2px 6px' }}
                      >
                        ✏️
                      </button>
                    </div>
                  )
                })}
              </div>
            ))}
            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              <button className="btn btn-secondary" onClick={() => setStep(1)}>← Back</button>
              <button className="btn btn-primary" onClick={() => setStep(3)}>Next: Shopping List →</button>
            </div>

            {/* Recipe picker overlay */}
            {pickingSlot && (
              <div className="modal-overlay open" onClick={e => { if (e.target === e.currentTarget) setPickingSlot(null) }}>
                <div className="modal">
                  <div className="modal-handle"></div>
                  <div className="modal-header">
                    <div className="modal-title">Pick a Recipe — {DAY_NAMES[pickingSlot.dayIndex]} {pickingSlot.mealType}</div>
                    <button className="modal-close" onClick={() => setPickingSlot(null)}>✕</button>
                  </div>
                  <div className="modal-body">
                    <button
                      style={{ display: 'block', width: '100%', textAlign: 'left', padding: '10px 4px', borderBottom: '1px solid var(--gray-mid)', fontSize: '0.83rem', color: 'var(--gray)', background: 'none', border: 'none', cursor: 'pointer' }}
                      onClick={() => { setSlotRecipe(pickingSlot.dayIndex, pickingSlot.mealType, null); setPickingSlot(null) }}
                    >
                      🗑️ Clear (no recipe)
                    </button>
                    {recipes.map(recipe => (
                      <button
                        key={recipe.id}
                        className="recipe-card"
                        onClick={() => { setSlotRecipe(pickingSlot.dayIndex, pickingSlot.mealType, recipe.id); setPickingSlot(null) }}
                        style={{ marginTop: 6 }}
                      >
                        <div className="recipe-card-inner">
                          <div className="recipe-emoji">{recipe.emoji}</div>
                          <div className="recipe-card-info">
                            <div className="recipe-card-title">{recipe.title}</div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Step 3: Shopping list ── */}
        {step === 3 && (
          <div>
            <div className="info-box">
              Add items you need to buy for this week. You can also add items later from the shopping list tab.
            </div>
            {shoppingItems.map((item, i) => (
              <div key={i} style={{ background: 'white', borderRadius: 'var(--radius)', padding: '12px 14px', marginBottom: 8, boxShadow: 'var(--shadow)' }}>
                <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  <select
                    className="form-input"
                    value={item.category}
                    onChange={e => updateShoppingItem(i, 'category', e.target.value)}
                    style={{ flex: '0 0 140px' }}
                  >
                    {CATEGORY_ORDER.map(cat => (
                      <option key={cat} value={cat}>{CATEGORY_LABELS[cat]}</option>
                    ))}
                  </select>
                  <input
                    className="form-input"
                    placeholder="Item name"
                    value={item.name}
                    onChange={e => updateShoppingItem(i, 'name', e.target.value)}
                    style={{ flex: 1 }}
                  />
                  <button onClick={() => removeShoppingItem(i)} style={{ background: 'none', border: 'none', color: 'var(--gray)', cursor: 'pointer', fontSize: '1.1rem' }}>✕</button>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    className="form-input"
                    placeholder="Qty (e.g. 2 lbs)"
                    value={item.qty}
                    onChange={e => updateShoppingItem(i, 'qty', e.target.value)}
                    style={{ flex: 1 }}
                  />
                  <input
                    className="form-input"
                    placeholder="Est. cost $"
                    type="number"
                    min="0"
                    step="0.25"
                    value={item.cost}
                    onChange={e => updateShoppingItem(i, 'cost', e.target.value)}
                    style={{ flex: '0 0 100px' }}
                  />
                </div>
              </div>
            ))}

            <button className="btn btn-secondary" onClick={addShoppingItem} style={{ width: '100%', justifyContent: 'center', marginBottom: 16 }}>
              + Add Item
            </button>

            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-secondary" onClick={() => setStep(2)}>← Back</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? 'Creating…' : '✓ Create Week'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
