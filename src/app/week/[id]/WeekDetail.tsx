'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { Week, ShoppingItem, MealSlot, Recipe, Substitution, ShoppingCategory } from '@/lib/types'
import {
  CATEGORY_LABELS,
  CATEGORY_ORDER,
  DAY_NAMES,
  DAY_SHORT,
  RECIPE_GROUP_LABELS,
} from '@/lib/types'
import RecipeModal from './RecipeModal'
import RecipePicker from './RecipePicker'

type Tab = 'list' | 'meals' | 'recipes' | 'swaps' | 'print'

interface Props {
  week: Week
  items: ShoppingItem[]
  slots: (MealSlot & { recipe: Recipe | null })[]
  recipes: Recipe[]
  substitutions: Substitution[]
  readOnly?: boolean
}

export default function WeekDetail({ week, items: initialItems, slots: initialSlots, recipes, substitutions, readOnly = false }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('list')
  const [items, setItems] = useState<ShoppingItem[]>(initialItems)
  const [slots, setSlots] = useState<(MealSlot & { recipe: Recipe | null })[]>(initialSlots)
  const [collapsedCats, setCollapsedCats] = useState<Set<string>>(new Set())
  const [startDay, setStartDay] = useState(0)
  const [openRecipe, setOpenRecipe] = useState<Recipe | null>(null)
  const [openSwaps, setOpenSwaps] = useState<Set<string>>(new Set())
  const [swapSearch, setSwapSearch] = useState('')
  const [printOpt, setPrintOpt] = useState<'list' | 'meals' | 'both'>('list')
  const [editingSlot, setEditingSlot] = useState<{ slotId: string; dayIndex: number; mealType: string } | null>(null)
  const [addingItem, setAddingItem] = useState<ShoppingCategory | null>(null)
  const [newItemName, setNewItemName] = useState('')
  const supabase = createClient()

  // ── Shopping list helpers ──────────────────────────────────────
  const totalCost = items.filter(i => !i.checked).reduce((s, i) => s + Number(i.cost), 0)
  const checkedCount = items.filter(i => i.checked).length
  const neededCount = items.filter(i => !i.checked).length

  const toggleItem = useCallback(async (itemId: string) => {
    const item = items.find(i => i.id === itemId)
    if (!item) return
    const newChecked = !item.checked
    // Optimistic update
    setItems(prev => prev.map(i => i.id === itemId ? { ...i, checked: newChecked } : i))
    await supabase.from('shopping_items').update({ checked: newChecked }).eq('id', itemId)
  }, [items, supabase])

  const clearAll = useCallback(async () => {
    setItems(prev => prev.map(i => ({ ...i, checked: false })))
    await supabase.from('shopping_items').update({ checked: false }).eq('week_id', week.id)
  }, [supabase, week.id])

  const toggleCat = (catId: string) => {
    setCollapsedCats(prev => {
      const next = new Set(prev)
      if (next.has(catId)) next.delete(catId); else next.add(catId)
      return next
    })
  }

  const addItem = useCallback(async (category: ShoppingCategory) => {
    if (!newItemName.trim()) return
    const { data } = await supabase
      .from('shopping_items')
      .insert({ week_id: week.id, category, name: newItemName.trim(), cost: 0, source: 'manual', sort_order: 999 })
      .select()
      .single()
    if (data) setItems(prev => [...prev, data])
    setNewItemName('')
    setAddingItem(null)
  }, [newItemName, supabase, week.id])

  const deleteItem = useCallback(async (itemId: string) => {
    await supabase.from('shopping_items').delete().eq('id', itemId)
    setItems(prev => prev.filter(i => i.id !== itemId))
  }, [supabase])

  // ── Meal plan helpers ──────────────────────────────────────────
  const rotatedSlots = [...Array(7)].map((_, di) => {
    const dayIndex = (di + startDay) % 7
    return {
      dayIndex,
      dayName: DAY_NAMES[dayIndex],
      breakfast: slots.find(s => s.day_index === dayIndex && s.meal_type === 'breakfast'),
      lunch: slots.find(s => s.day_index === dayIndex && s.meal_type === 'lunch'),
      dinner: slots.find(s => s.day_index === dayIndex && s.meal_type === 'dinner'),
    }
  })

  const getDayBadge = (dayIndex: number) => {
    const dinner = slots.find(s => s.day_index === dayIndex && s.meal_type === 'dinner')
    const tags = dinner?.recipe?.tags ?? []
    if (tags.includes('Fish')) return '🐟 Fish'
    if (tags.includes('Poultry')) return '🍗 Poultry'
    if (tags.includes('Vegetarian')) return '🌱 Vegetarian'
    return ''
  }

  const getMealText = (slot: (MealSlot & { recipe: Recipe | null }) | undefined) => {
    if (!slot) return ''
    if (slot.recipe) return `${slot.recipe.emoji} ${slot.recipe.title}`
    return slot.free_text ?? ''
  }

  const assignRecipe = useCallback(async (slotId: string, recipe: Recipe | null) => {
    setSlots(prev => prev.map(s => s.id === slotId ? { ...s, recipe_id: recipe?.id ?? null, recipe } : s))
    await supabase.from('meal_slots').update({ recipe_id: recipe?.id ?? null, free_text: null }).eq('id', slotId)
    setEditingSlot(null)
  }, [supabase])

  // ── Recipes tab helpers ────────────────────────────────────────
  const recipeGroups = [
    { key: 'dinner' as const, label: RECIPE_GROUP_LABELS.dinner, recipes: recipes.filter(r => r.recipe_group === 'dinner') },
    { key: 'breakfast' as const, label: RECIPE_GROUP_LABELS.breakfast, recipes: recipes.filter(r => r.recipe_group === 'breakfast') },
    { key: 'dressing' as const, label: RECIPE_GROUP_LABELS.dressing, recipes: recipes.filter(r => r.recipe_group === 'dressing') },
  ]

  // ── Swaps tab helpers ──────────────────────────────────────────
  const filteredSubs = swapSearch
    ? substitutions.filter(s =>
        s.ingredient.toLowerCase().includes(swapSearch.toLowerCase()) ||
        (s.tag ?? '').toLowerCase().includes(swapSearch.toLowerCase())
      )
    : substitutions

  const swapGroups: { label: string; subs: Substitution[] }[] = []
  for (const sub of filteredSubs) {
    const existing = swapGroups.find(g => g.label === sub.group_label)
    if (existing) existing.subs.push(sub)
    else swapGroups.push({ label: sub.group_label, subs: [sub] })
  }

  const toggleSwap = (id: string) => {
    setOpenSwaps(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id); else next.add(id)
      return next
    })
  }

  // ── Print helpers ──────────────────────────────────────────────
  const printNow = () => window.print()

  // ── Render ────────────────────────────────────────────────────
  return (
    <div>
      <header className="app-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <Link href="/weeks" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: 7 }}>
                <span style={{ fontSize: '1.3rem' }}>👩‍🍳</span>
                <span style={{ opacity: 0.7, fontWeight: 400, fontSize: '1rem' }}>Sousie</span>
              </Link>
              <span style={{ opacity: 0.4, fontWeight: 300 }}>·</span>
              {week.label}
            </h1>
            <p>{week.notes ?? 'A digital butler for your pantry.'}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            <Link href="/dietary-counsel" style={{ background: 'rgba(255,255,255,0.18)', color: 'white', borderRadius: 8, padding: '5px 10px', fontSize: '0.73rem', textDecoration: 'none', fontWeight: 600 }}>
              🥗 Counsel
            </Link>
            <Link href="/weeks" style={{ background: 'rgba(255,255,255,0.18)', color: 'white', borderRadius: 8, padding: '5px 10px', fontSize: '0.73rem', textDecoration: 'none' }}>
              ← Weeks
            </Link>
          </div>
        </div>
        <div className="header-stats">
          <div className="stat-pill">To buy: <span>{neededCount}</span> items</div>
          <div className="stat-pill">Est: <span>${totalCost.toFixed(2)}</span></div>
          <div className="stat-pill">🥚 Eggs FREE!</div>
        </div>
      </header>

      <div className="tabs no-print">
        {(['list', 'meals', 'recipes', 'swaps', 'print'] as Tab[]).map(tab => (
          <button
            key={tab}
            className={`tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'list' && '✏️ Shopping'}
            {tab === 'meals' && '🗓️ Meal Plan'}
            {tab === 'recipes' && '📖 Recipes'}
            {tab === 'swaps' && '🔄 Swaps'}
            {tab === 'print' && '🖨️ Print'}
          </button>
        ))}
      </div>

      {/* ══ TAB: SHOPPING LIST ══ */}
      {activeTab === 'list' && (
        <div className="panel">
          <div className="info-box no-print">
            <strong>Check off what you already have</strong> — checked items are crossed out and removed from your print list. Cost updates automatically.
          </div>
          <div className="toolbar no-print">
            <button className="btn btn-secondary" onClick={() => setCollapsedCats(new Set())}>Expand All</button>
            <button className="btn btn-secondary" onClick={() => setCollapsedCats(new Set(CATEGORY_ORDER))}>Collapse All</button>
            {!readOnly && <button className="btn btn-danger" onClick={clearAll}>Clear All</button>}
          </div>

          {CATEGORY_ORDER.map(catId => {
            const catItems = items.filter(i => i.category === catId)
            if (catItems.length === 0) return null
            const doneCount = catItems.filter(i => i.checked).length
            const allDone = doneCount === catItems.length
            const isCollapsed = collapsedCats.has(catId)

            return (
              <div key={catId} className={`category ${isCollapsed ? 'collapsed' : ''}`}>
                <button className="category-header" onClick={() => toggleCat(catId)}>
                  <div className="category-title">
                    {CATEGORY_LABELS[catId]}
                    <span className={`cat-count ${allDone ? 'all-done' : ''}`}>{doneCount}/{catItems.length}</span>
                  </div>
                  <span className="chevron">▼</span>
                </button>

                {!isCollapsed && (
                  <div className="category-body">
                    {catItems.map(item => (
                      <div key={item.id} className={`item ${item.checked ? 'have-it' : ''}`}>
                        <div
                          className={`checkbox-wrap ${item.checked ? 'checked' : ''}`}
                          onClick={() => !readOnly && toggleItem(item.id)}
                        >
                          {item.checked && '✓'}
                        </div>
                        <div className="item-info" onClick={() => !readOnly && toggleItem(item.id)}>
                          <div className="item-name">{item.name}</div>
                          {item.qty && <div className="item-qty">{item.qty}</div>}
                          {item.note && <div className="item-note">{item.note}</div>}
                        </div>
                        <div className="item-cost">${Number(item.cost).toFixed(2)}</div>
                        {!readOnly && (
                          <button
                            onClick={() => deleteItem(item.id)}
                            className="no-print"
                            style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', padding: '0 4px', fontSize: '0.8rem' }}
                            title="Remove item"
                          >✕</button>
                        )}
                      </div>
                    ))}
                    {/* Add item inline */}
                    {!readOnly && addingItem === catId ? (
                      <div style={{ display: 'flex', gap: 8, padding: '8px 15px', borderTop: '1px dashed var(--gray-mid)', alignItems: 'center' }}>
                        <input
                          autoFocus
                          value={newItemName}
                          onChange={e => setNewItemName(e.target.value)}
                          onKeyDown={e => {
                            if (e.key === 'Enter') addItem(catId)
                            if (e.key === 'Escape') { setAddingItem(null); setNewItemName('') }
                          }}
                          placeholder="Item name…"
                          style={{ flex: 1, border: 'none', outline: 'none', fontSize: '0.83rem', background: 'transparent' }}
                        />
                        <button className="btn btn-primary" style={{ padding: '4px 10px' }} onClick={() => addItem(catId)}>Add</button>
                        <button className="btn btn-secondary" style={{ padding: '4px 10px' }} onClick={() => { setAddingItem(null); setNewItemName('') }}>Cancel</button>
                      </div>
                    ) : !readOnly ? (
                      <button
                        className="no-print"
                        onClick={() => setAddingItem(catId)}
                        style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 15px', borderTop: '1px dashed var(--gray-mid)', width: '100%', background: 'none', border: 'none', color: 'var(--gray)', cursor: 'pointer', fontSize: '0.78rem' }}
                      >
                        + Add item to {CATEGORY_LABELS[catId].replace(/^.+ /, '')}
                      </button>
                    ) : null}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* ══ TAB: MEAL PLAN ══ */}
      {activeTab === 'meals' && (
        <div className="panel">
          <div className="day-picker-wrap no-print">
            <div className="day-picker-label">Start week on:</div>
            <div className="day-picker">
              {DAY_SHORT.map((d, i) => (
                <button key={d} className={`day-btn ${startDay === i ? 'active' : ''}`} onClick={() => setStartDay(i)}>{d}</button>
              ))}
            </div>
          </div>

          {rotatedSlots.map(({ dayIndex, dayName, breakfast, lunch, dinner }) => (
            <div key={dayIndex} className="meal-day">
              <div className="meal-day-header">
                {dayName}
                <span className="meal-day-badge">{getDayBadge(dayIndex)}</span>
              </div>
              {([['Breakfast', breakfast], ['Lunch', lunch], ['Dinner', dinner]] as const).map(([label, slot]) => (
                <div key={label} className="meal-row">
                  <div className="meal-label">{label}</div>
                  <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                    <button
                      className={`meal-link ${slot?.recipe ? 'has-recipe' : ''}`}
                      onClick={() => slot?.recipe && setOpenRecipe(slot.recipe)}
                    >
                      {getMealText(slot) || <span style={{ color: 'var(--gray)', fontStyle: 'italic' }}>No meal planned</span>}
                      {slot?.recipe && <span className="recipe-arrow">→ view recipe</span>}
                    </button>
                    {slot && !readOnly && (
                      <button
                        className="no-print"
                        onClick={() => setEditingSlot({ slotId: slot.id, dayIndex, mealType: label.toLowerCase() })}
                        style={{ background: 'none', border: 'none', color: 'var(--gray)', cursor: 'pointer', fontSize: '0.7rem', flexShrink: 0, padding: '2px 4px' }}
                        title="Change meal"
                      >
                        ✏️
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))}

          <div className="dressings-bar">
            <strong>🧴 Dressings this week</strong>
            Mon/Wed → Lime-Cumin · Tue/Thu → Tahini-Lemon · Thu/Fri → Ginger-Tamari · Fri → Peanut Sauce
          </div>
        </div>
      )}

      {/* ══ TAB: RECIPES ══ */}
      {activeTab === 'recipes' && (
        <div className="panel">
          {!readOnly && (
            <div className="toolbar no-print">
              <Link href="/recipes/new" className="btn btn-primary">+ Add Recipe</Link>
              <Link href="/recipes" className="btn btn-secondary">Full Library</Link>
            </div>
          )}
          {recipeGroups.map(group => (
            <div key={group.key}>
              <div className="recipe-section-label">{group.label}</div>
              {group.recipes.map(recipe => (
                <button key={recipe.id} className="recipe-card" onClick={() => setOpenRecipe(recipe)}>
                  <div className="recipe-card-inner">
                    <div className="recipe-emoji">{recipe.emoji}</div>
                    <div className="recipe-card-info">
                      <div className="recipe-card-title">{recipe.title}</div>
                      {recipe.sub && <div className="recipe-card-sub">{recipe.sub}</div>}
                      <div className="recipe-card-tags">
                        {recipe.tags.map(tag => <span key={tag} className="recipe-tag">{tag}</span>)}
                      </div>
                    </div>
                    <div className="recipe-chevron">›</div>
                  </div>
                </button>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* ══ TAB: SWAPS ══ */}
      {activeTab === 'swaps' && (
        <div className="panel">
          <div className="swap-search-wrap">
            <span className="swap-search-icon">🔍</span>
            <input
              className="swap-search"
              type="search"
              placeholder="Search an ingredient… e.g. oat flour, salmon"
              value={swapSearch}
              onChange={e => setSwapSearch(e.target.value)}
            />
          </div>
          <div className="swap-hint">Tap any ingredient to see substitution options.</div>

          {swapGroups.map(group => (
            <div key={group.label}>
              <div className="swap-group-label">{group.label}</div>
              {group.subs.map(sub => {
                const isOpen = openSwaps.has(sub.id)
                return (
                  <button key={sub.id} className={`swap-card ${isOpen ? 'open' : ''}`} onClick={() => toggleSwap(sub.id)}>
                    <div className="swap-card-header">
                      <span className="swap-ingredient">{sub.ingredient}</span>
                      {sub.tag && <span className="swap-tag">{sub.tag}</span>}
                      <span className="swap-arrow">›</span>
                    </div>
                    {isOpen && (
                      <div className="swap-body">
                        {sub.subs.map((s, i) => (
                          <div key={i} className="swap-sub">
                            <div className="swap-sub-name">{s.name}</div>
                            <div className="swap-sub-detail">{s.detail}</div>
                            <span className={`swap-sub-verdict verdict-${s.verdict}`}>
                              {s.verdict === 'great' ? '✓ Works great' : s.verdict === 'good' ? '✓ Works well' : '~ Works in a pinch'}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          ))}

          {swapGroups.length === 0 && (
            <div style={{ textAlign: 'center', padding: '20px', color: 'var(--gray)', fontSize: '0.83rem' }}>
              No substitutions found for &ldquo;{swapSearch}&rdquo;
            </div>
          )}
        </div>
      )}

      {/* ══ TAB: PRINT ══ */}
      {activeTab === 'print' && (
        <div className="panel">
          <div className="no-print">
            <div className="info-box">Choose what you want to print, then hit <strong>Print Now</strong>.</div>
            <div className="print-options">
              {(['list', 'meals', 'both'] as const).map(opt => (
                <div
                  key={opt}
                  className={`print-opt ${printOpt === opt ? 'selected' : ''}`}
                  onClick={() => setPrintOpt(opt)}
                >
                  <span className="opt-icon">{opt === 'list' ? '🛒' : opt === 'meals' ? '🗓️' : '📋'}</span>
                  <div className="opt-label">{opt === 'list' ? 'Shopping List' : opt === 'meals' ? 'Meal Plan' : 'Both'}</div>
                  <div className="opt-desc">{opt === 'list' ? 'Items still needed' : opt === 'meals' ? 'Full week at a glance' : 'Shopping list + meal plan'}</div>
                </div>
              ))}
            </div>
            <div className="toolbar">
              <button className="btn btn-orange" onClick={printNow}>🖨️ Print Now</button>
              <button className="btn btn-secondary" onClick={() => setActiveTab('list')}>← Back to List</button>
            </div>
          </div>

          {(printOpt === 'list' || printOpt === 'both') && (
            <div className="print-preview">
              <h3>🛒 {week.label} Shopping List — Items Needed</h3>
              {CATEGORY_ORDER.map(catId => {
                const needed = items.filter(i => i.category === catId && !i.checked)
                if (!needed.length) return null
                return (
                  <div key={catId}>
                    <div className="print-cat-label">{CATEGORY_LABELS[catId]}</div>
                    {needed.map(item => (
                      <div key={item.id} className="print-item-row">
                        <span className="pi-name">{item.name}</span>
                        <span className="pi-qty">{item.qty}</span>
                        <span className="pi-cost">${Number(item.cost).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                )
              })}
              <div className="print-total">
                <span>{neededCount} items</span>
                <span>Est. Total: ${totalCost.toFixed(2)}</span>
              </div>
            </div>
          )}

          {(printOpt === 'meals' || printOpt === 'both') && (
            <div className="print-preview">
              <h3>🗓️ {week.label} Meal Plan</h3>
              {rotatedSlots.map(({ dayName, dayIndex, breakfast, lunch, dinner }) => (
                <div key={dayIndex} style={{ marginBottom: 14, paddingBottom: 12, borderBottom: '1px solid var(--gray-mid)' }}>
                  <div style={{ fontWeight: 700, color: 'var(--green)', marginBottom: 6 }}>{dayName}</div>
                  {[['Breakfast', breakfast], ['Lunch', lunch], ['Dinner', dinner]].map(([label, slot]) => (
                    <div key={label as string} style={{ display: 'flex', gap: 8, fontSize: '0.78rem', padding: '2px 0' }}>
                      <div style={{ width: 65, color: 'var(--gray)', fontWeight: 700, fontSize: '0.68rem', textTransform: 'uppercase', paddingTop: 2, flexShrink: 0 }}>{label as string}</div>
                      <div>{getMealText(slot as (MealSlot & { recipe: Recipe | null }) | undefined)}</div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Fixed summary bar (shopping tab only) ── */}
      {activeTab === 'list' && (
        <div className="summary-bar no-print">
          <div>
            <div className="summary-text">{neededCount} items to buy · {checkedCount} already have</div>
            <div className="summary-saved">Skipping: ${items.filter(i => i.checked).reduce((s, i) => s + Number(i.cost), 0).toFixed(2)}</div>
          </div>
          <div className="summary-cost">${totalCost.toFixed(2)} to buy</div>
        </div>
      )}

      {/* ── Recipe modal ── */}
      {openRecipe && (
        <RecipeModal recipe={openRecipe} onClose={() => setOpenRecipe(null)} />
      )}

      {/* ── Recipe picker modal (for meal plan editing) ── */}
      {editingSlot && (
        <RecipePicker
          recipes={recipes}
          onSelect={(recipe) => assignRecipe(editingSlot.slotId, recipe)}
          onClose={() => setEditingSlot(null)}
        />
      )}
    </div>
  )
}
