'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { Week, MealSlot, Recipe, ShoppingItem, ShoppingCategory } from '@/lib/types'
import { DAY_NAMES, CATEGORY_LABELS, CATEGORY_ORDER } from '@/lib/types'
import RecipePicker from '../RecipePicker'

interface Props {
  week: Week
  slots: (MealSlot & { recipe: Recipe | null })[]
  items: ShoppingItem[]
  recipes: Recipe[]
}

type MealType = 'breakfast' | 'lunch' | 'dinner'

export default function EditWeekForm({ week, slots: initialSlots, items: initialItems, recipes }: Props) {
  const supabase = createClient()

  const [label, setLabel] = useState(week.label)
  const [startDate, setStartDate] = useState(week.start_date ?? '')
  const [notes, setNotes] = useState(week.notes ?? '')
  const [prepAheadText, setPrepAheadText] = useState((week.prep_ahead ?? []).join('\n'))
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const [slots, setSlots] = useState(initialSlots)
  const [pickingSlotId, setPickingSlotId] = useState<string | null>(null)

  const [items, setItems] = useState(initialItems)
  const [addingItem, setAddingItem] = useState(false)
  const [newItem, setNewItem] = useState<{ category: ShoppingCategory; name: string; qty: string; cost: string }>({
    category: 'produce', name: '', qty: '', cost: '',
  })

  const getSlot = (dayIndex: number, mealType: MealType) =>
    slots.find(s => s.day_index === dayIndex && s.meal_type === mealType)

  const saveDetails = async () => {
    if (!label.trim()) return
    setSaving(true)
    const prepAhead = prepAheadText.split('\n').map(t => t.trim()).filter(Boolean)
    await supabase.from('weeks').update({
      label: label.trim(),
      start_date: startDate || null,
      notes: notes || null,
      prep_ahead: prepAhead,
    }).eq('id', week.id)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const assignRecipe = useCallback(async (slotId: string, recipe: Recipe | null) => {
    setSlots(prev => prev.map(s =>
      s.id === slotId ? { ...s, recipe_id: recipe?.id ?? null, recipe: recipe ?? null, free_text: null } : s
    ))
    await supabase.from('meal_slots').update({ recipe_id: recipe?.id ?? null, free_text: null }).eq('id', slotId)
    setPickingSlotId(null)
  }, [supabase])

  const updateSlotFreeText = (slotId: string, text: string) => {
    setSlots(prev => prev.map(s =>
      s.id === slotId ? { ...s, free_text: text, recipe_id: null, recipe: null } : s
    ))
  }

  const saveSlotFreeText = async (slotId: string, text: string) => {
    await supabase.from('meal_slots').update({ recipe_id: null, free_text: text || null }).eq('id', slotId)
  }

  const addShoppingItem = async () => {
    if (!newItem.name.trim()) return
    const { data } = await supabase
      .from('shopping_items')
      .insert({
        week_id: week.id,
        category: newItem.category,
        name: newItem.name.trim(),
        qty: newItem.qty || null,
        cost: parseFloat(newItem.cost) || 0,
        source: 'manual',
        sort_order: 999,
      })
      .select()
      .single()
    if (data) setItems(prev => [...prev, data])
    setNewItem({ category: 'produce', name: '', qty: '', cost: '' })
    setAddingItem(false)
  }

  const deleteItem = async (itemId: string) => {
    await supabase.from('shopping_items').delete().eq('id', itemId)
    setItems(prev => prev.filter(i => i.id !== itemId))
  }

  const activeSlot = pickingSlotId ? slots.find(s => s.id === pickingSlotId) : null

  return (
    <div>
      <header className="app-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Link href={`/week/${week.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: '1.3rem' }}>👩‍🍳</span>
                <span style={{ opacity: 0.7, fontWeight: 400, fontSize: '1rem' }}>Sousie</span>
              </Link>
              <span style={{ opacity: 0.4, fontWeight: 300 }}>—</span>
              Edit Week
            </h1>
            <p>Make changes to any part of your week.</p>
          </div>
          <Link
            href={`/week/${week.id}`}
            style={{ background: 'rgba(255,255,255,0.18)', color: 'white', borderRadius: 8, padding: '5px 10px', fontSize: '0.73rem', textDecoration: 'none', fontWeight: 600 }}
          >
            ← Back
          </Link>
        </div>
      </header>

      <div className="panel">

        {/* ── Week Details ── */}
        <section style={{ marginBottom: 28 }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--gray)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>
            Week Details
          </div>

          <label className="form-label">Week Name</label>
          <input className="form-input" value={label} onChange={e => setLabel(e.target.value)} />

          <label className="form-label">Start Date</label>
          <input className="form-input" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />

          <label className="form-label">Notes</label>
          <textarea
            className="form-textarea"
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Dietary notes, budget, family size…"
          />

          <label className="form-label">🧺 Prep Ahead (optional, one per line)</label>
          <textarea
            className="form-textarea"
            value={prepAheadText}
            onChange={e => setPrepAheadText(e.target.value)}
            placeholder="Thaw the chicken tonight&#10;Cook a batch of rice"
          />

          <button
            className="btn btn-primary"
            onClick={saveDetails}
            disabled={saving || !label.trim()}
          >
            {saving ? 'Saving…' : saved ? '✓ Saved' : 'Save Details'}
          </button>
        </section>

        {/* ── Meal Plan ── */}
        <section style={{ marginBottom: 28 }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--gray)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
            Meal Plan
          </div>
          <div className="info-box" style={{ marginBottom: 12 }}>
            Tap ✏️ to swap a recipe. Changes save immediately.
          </div>

          {DAY_NAMES.map((day, dayIndex) => (
            <div key={day} className="meal-day">
              <div className="meal-day-header">{day}</div>
              {(['breakfast', 'lunch', 'dinner'] as MealType[]).map(mealType => {
                const slot = getSlot(dayIndex, mealType)
                return (
                  <div key={mealType} className="meal-row">
                    <div className="meal-label">{mealType}</div>
                    <div style={{ flex: 1 }}>
                      {slot?.recipe ? (
                        <span style={{ color: 'var(--green)', fontSize: '0.82rem' }}>
                          {slot.recipe.emoji} {slot.recipe.title}
                        </span>
                      ) : slot?.free_text ? (
                        <input
                          value={slot.free_text}
                          onChange={e => updateSlotFreeText(slot.id, e.target.value)}
                          onBlur={e => saveSlotFreeText(slot.id, e.target.value)}
                          style={{ border: 'none', outline: 'none', fontSize: '0.82rem', width: '100%', background: 'transparent' }}
                          placeholder="Describe meal…"
                        />
                      ) : (
                        <span style={{ color: 'var(--gray)', fontSize: '0.78rem', fontStyle: 'italic' }}>No meal planned</span>
                      )}
                    </div>
                    {slot && (
                      <button
                        onClick={() => setPickingSlotId(slot.id)}
                        style={{ background: 'none', border: 'none', color: 'var(--gray)', cursor: 'pointer', fontSize: '0.75rem', padding: '2px 6px' }}
                      >
                        ✏️
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          ))}
        </section>

        {/* ── Shopping List ── */}
        <section>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--gray)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>
            Shopping List
          </div>

          {items.length === 0 && !addingItem && (
            <p style={{ color: 'var(--gray)', fontSize: '0.82rem', fontStyle: 'italic', marginBottom: 12 }}>No items yet.</p>
          )}

          {CATEGORY_ORDER.map(cat => {
            const catItems = items.filter(i => i.category === cat)
            if (catItems.length === 0) return null
            return (
              <div key={cat} style={{ marginBottom: 14 }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--gray)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
                  {CATEGORY_LABELS[cat]}
                </div>
                {catItems.map(item => (
                  <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0', borderBottom: '1px solid var(--gray-mid)' }}>
                    <span style={{ flex: 1, fontSize: '0.83rem' }}>{item.name}</span>
                    {item.qty && <span style={{ fontSize: '0.75rem', color: 'var(--gray)' }}>{item.qty}</span>}
                    {item.cost > 0 && <span style={{ fontSize: '0.75rem', color: 'var(--gray)' }}>${item.cost.toFixed(2)}</span>}
                    <button
                      onClick={() => deleteItem(item.id)}
                      style={{ background: 'none', border: 'none', color: 'var(--gray)', cursor: 'pointer', fontSize: '1rem', padding: '0 4px', lineHeight: 1 }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )
          })}

          {addingItem ? (
            <div style={{ background: 'white', borderRadius: 'var(--radius)', padding: '12px 14px', boxShadow: 'var(--shadow)', marginBottom: 10 }}>
              <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                <select
                  className="form-input"
                  value={newItem.category}
                  onChange={e => setNewItem(p => ({ ...p, category: e.target.value as ShoppingCategory }))}
                  style={{ flex: '0 0 140px' }}
                >
                  {CATEGORY_ORDER.map(cat => (
                    <option key={cat} value={cat}>{CATEGORY_LABELS[cat]}</option>
                  ))}
                </select>
                <input
                  className="form-input"
                  placeholder="Item name"
                  value={newItem.name}
                  onChange={e => setNewItem(p => ({ ...p, name: e.target.value }))}
                  style={{ flex: 1 }}
                  autoFocus
                  onKeyDown={e => { if (e.key === 'Enter') addShoppingItem() }}
                />
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  className="form-input"
                  placeholder="Qty (e.g. 2 lbs)"
                  value={newItem.qty}
                  onChange={e => setNewItem(p => ({ ...p, qty: e.target.value }))}
                  style={{ flex: 1 }}
                />
                <input
                  className="form-input"
                  placeholder="Est. cost $"
                  type="number"
                  min="0"
                  step="0.25"
                  value={newItem.cost}
                  onChange={e => setNewItem(p => ({ ...p, cost: e.target.value }))}
                  style={{ flex: '0 0 100px' }}
                />
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <button className="btn btn-primary" onClick={addShoppingItem} disabled={!newItem.name.trim()}>Add</button>
                <button
                  className="btn btn-secondary"
                  onClick={() => { setAddingItem(false); setNewItem({ category: 'produce', name: '', qty: '', cost: '' }) }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button className="btn btn-secondary" onClick={() => setAddingItem(true)} style={{ width: '100%', justifyContent: 'center' }}>
              + Add Item
            </button>
          )}
        </section>

      </div>

      {pickingSlotId && activeSlot && (
        <RecipePicker
          recipes={recipes}
          onSelect={recipe => assignRecipe(pickingSlotId, recipe)}
          onClose={() => setPickingSlotId(null)}
        />
      )}
    </div>
  )
}
