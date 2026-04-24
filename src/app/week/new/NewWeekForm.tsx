'use client'

import { useState, type CSSProperties } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { Recipe, RecipeGroup } from '@/lib/types'
import { DAY_NAMES, CATEGORY_LABELS, CATEGORY_ORDER, type ShoppingCategory } from '@/lib/types'

interface Props {
  recipes: Recipe[]
  defaultLabel: string
  weekId?: string
  initialNotes?: string
  initialStartDate?: string
}

type MealType = 'breakfast' | 'lunch' | 'dinner'

interface AiRecipeDraft {
  title: string
  emoji: string
  sub: string | null
  tags: string[]
  recipe_group: RecipeGroup
  ingredients: string[]
  instructions: string[]
  dressings: string[]
  tips: string[]
}

interface SlotPlan {
  dayIndex: number
  mealType: MealType
  recipeId: string | null
  freeText: string
  aiRecipe?: AiRecipeDraft | null
}

interface ShoppingItemDraft {
  category: ShoppingCategory
  name: string
  qty: string
  cost: string
  note: string
}

const STEPS = ['Week Details', 'AI Generator', 'Meal Plan', 'Shopping List']

const DEFAULT_WEEK_NOTES = 'Gluten and refined sugar free. Prefer vegetarian/vegan, but enjoy fish and occasionally ground turkey or chicken. Family of 4, budget under $100.'

export default function NewWeekForm({ recipes, defaultLabel, weekId, initialNotes = '', initialStartDate = '' }: Props) {
  const isEditing = !!weekId
  const [step, setStep] = useState(1)
  const [label, setLabel] = useState(defaultLabel)
  const [startDate, setStartDate] = useState(initialStartDate)
  const [notes, setNotes] = useState(initialNotes)
  const [slots, setSlots] = useState<SlotPlan[]>(() =>
    DAY_NAMES.flatMap((_, dayIndex) =>
      (['breakfast', 'lunch', 'dinner'] as MealType[]).map(mealType => ({
        dayIndex,
        mealType,
        recipeId: null,
        freeText: '',
        aiRecipe: null,
      }))
    )
  )
  const [shoppingItems, setShoppingItems] = useState<ShoppingItemDraft[]>([])
  const [saving, setSaving] = useState(false)
  const [pickingSlot, setPickingSlot] = useState<{ dayIndex: number; mealType: MealType } | null>(null)

  // AI Generator state
  const [aiBreakfasts, setAiBreakfasts] = useState(0)
  const [aiLunches, setAiLunches] = useState(0)
  const [aiDinners, setAiDinners] = useState(0)
  const [generatedPrompt, setGeneratedPrompt] = useState('')
  const [aiResponse, setAiResponse] = useState('')
  const [aiParsed, setAiParsed] = useState(false)
  const [aiError, setAiError] = useState('')
  const [copied, setCopied] = useState(false)

  // Reuse existing recipes state
  const [reuseBreakfastIds, setReuseBreakfastIds] = useState<string[]>([])
  const [reuseLunchIds, setReuseLunchIds] = useState<string[]>([])
  const [reuseDinnerIds, setReuseDinnerIds] = useState<string[]>([])
  const [reuseOpen, setReuseOpen] = useState<Record<string, boolean>>({})

  const breakfastRecipes = recipes.filter(r => r.recipe_group === 'breakfast')
  const dinnerRecipes = recipes.filter(r => r.recipe_group === 'dinner')

  const router = useRouter()
  const supabase = createClient()

  const totalAiMeals = aiBreakfasts + aiLunches + aiDinners

  const getSlot = (dayIndex: number, mealType: MealType) =>
    slots.find(s => s.dayIndex === dayIndex && s.mealType === mealType)

  const setSlotRecipe = (dayIndex: number, mealType: MealType, recipeId: string | null) => {
    setSlots(prev => prev.map(s =>
      s.dayIndex === dayIndex && s.mealType === mealType
        ? { ...s, recipeId, freeText: recipeId ? '' : s.freeText, aiRecipe: null }
        : s
    ))
  }

  const setSlotText = (dayIndex: number, mealType: MealType, text: string) => {
    setSlots(prev => prev.map(s =>
      s.dayIndex === dayIndex && s.mealType === mealType
        ? { ...s, freeText: text, recipeId: null, aiRecipe: null }
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

  const buildPrompt = () => {
    const requests: string[] = []
    if (aiBreakfasts > 0) requests.push(`- ${aiBreakfasts} breakfast${aiBreakfasts > 1 ? 's' : ''}`)
    if (aiLunches > 0) requests.push(`- ${aiLunches} lunch${aiLunches > 1 ? 'es' : ''}`)
    if (aiDinners > 0) requests.push(`- ${aiDinners} dinner${aiDinners > 1 ? 's' : ''}`)

    const notesLine = notes.trim() ? `\nWeek theme / dietary notes: ${notes.trim()}` : ''

    const prompt = `You are helping me plan meals for a week. Generate exactly ${totalAiMeals} meal${totalAiMeals > 1 ? 's' : ''} with full recipes AND a consolidated shopping list in JSON format.${notesLine}

Generate:
${requests.join('\n')}

Spread meals across the week (Monday–Sunday). Aim for variety — avoid repeating similar dishes back-to-back.

Return ONLY valid JSON in this exact format, no markdown fences, no extra text:

{
  "meals": [
    {
      "day_index": 0,
      "meal_type": "breakfast",
      "recipe": {
        "title": "Overnight Oats",
        "emoji": "🥣",
        "sub": "5 min prep · overnight soak",
        "recipe_group": "breakfast",
        "tags": ["GF", "Vegetarian", "Meal Prep"],
        "ingredients": ["1 cup rolled oats", "1 cup milk", "2 tbsp chia seeds", "1 tbsp honey"],
        "instructions": ["Combine oats, milk, and chia seeds in a jar.", "Stir well, seal, and refrigerate overnight.", "Top with fruit and drizzle with honey before serving."],
        "dressings": ["Serve with fresh berries", "Try with almond butter"],
        "tips": ["Use full-fat coconut milk for a richer texture.", "Keeps in the fridge for up to 3 days."]
      }
    }
  ],
  "shopping_items": [
    { "category": "produce", "name": "Baby spinach", "qty": "1 bag", "cost": 3.99, "note": null },
    { "category": "protein", "name": "Salmon fillets", "qty": "1.5 lbs", "cost": 14.50, "note": "wild-caught preferred" },
    { "category": "pantry", "name": "Rolled oats", "qty": "1 cup", "cost": 1.50, "note": null },
    { "category": "spices", "name": "Smoked paprika", "qty": null, "cost": 2.00, "note": null }
  ]
}

Recipe quality requirements — every recipe must meet ALL of these:
- ingredients: minimum 6 items, each with exact quantity and unit (e.g. "2 cloves garlic, minced" not just "garlic"). Include seasonings, oils, and anything needed to actually cook the dish.
- instructions: minimum 5 steps, each a full sentence describing what to do, how long, and what to look for. Do not write one-liners like "Heat sauce." — write "Heat the tomato sauce in a small saucepan over medium-low heat for 5–7 minutes, stirring occasionally, until warmed through and slightly thickened."
- sub: always include realistic prep and cook times (e.g. "10 min prep · 25 min cook")
- tags: include relevant dietary tags (GF, Vegan, Vegetarian, Dairy-Free, etc.) and style tags (Sheet Pan, One-Pot, Meal Prep, 30-Min, etc.)
- tips: minimum 2 tips that are specific and useful (substitutions, make-ahead notes, technique tips)
- dressings: at least 1 serving suggestion or variation

Structural rules:
- day_index: 0=Monday 1=Tuesday 2=Wednesday 3=Thursday 4=Friday 5=Saturday 6=Sunday
- meal_type must be "breakfast", "lunch", or "dinner"
- recipe_group: use "breakfast" for breakfasts, "dinner" for lunches and dinners
- ingredients and instructions are plain strings (no bullets, no numbering)
- Do not use the same day_index + meal_type pair twice
- shopping_items: consolidate all ingredients across every recipe into a single deduplicated list — combine quantities when the same ingredient appears in multiple recipes
- shopping_items category must be one of: "produce", "protein", "pantry", "spices"
- shopping_items cost is a number in USD (e.g. 3.99) — estimate a realistic grocery store price for the quantity listed; do not use 0
- shopping_items qty and note can be null if not applicable
- Return ONLY the JSON object`

    setGeneratedPrompt(prompt)
    setAiParsed(false)
    setAiError('')
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPrompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const parseAiResponse = () => {
    setAiError('')
    try {
      let json = aiResponse.trim()
      // Strip markdown code fences if present
      json = json.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim()

      const data = JSON.parse(json)

      if (!data.meals || !Array.isArray(data.meals)) {
        throw new Error('Expected a "meals" array in the response. Make sure you copied the full JSON.')
      }

      let imported = 0
      const updated = slots.map(s => ({ ...s }))

      for (const meal of data.meals) {
        const { day_index, meal_type, recipe } = meal
        if (typeof day_index !== 'number' || day_index < 0 || day_index > 6) continue
        if (!['breakfast', 'lunch', 'dinner'].includes(meal_type)) continue

        const idx = updated.findIndex(s => s.dayIndex === day_index && s.mealType === meal_type)
        if (idx === -1) continue

        if (recipe && recipe.title) {
          updated[idx] = {
            ...updated[idx],
            recipeId: null,
            freeText: '',
            aiRecipe: {
              title: recipe.title,
              emoji: recipe.emoji || '🍽️',
              sub: recipe.sub || null,
              tags: Array.isArray(recipe.tags) ? recipe.tags : [],
              recipe_group: recipe.recipe_group === 'breakfast' ? 'breakfast' : 'dinner',
              ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients : [],
              instructions: Array.isArray(recipe.instructions) ? recipe.instructions : [],
              dressings: Array.isArray(recipe.dressings) ? recipe.dressings : [],
              tips: Array.isArray(recipe.tips) ? recipe.tips : [],
            },
          }
          imported++
        } else if (meal.free_text) {
          updated[idx] = {
            ...updated[idx],
            recipeId: null,
            freeText: meal.free_text,
            aiRecipe: null,
          }
          imported++
        }
      }

      if (imported === 0) {
        throw new Error('No valid meals found in the response. Check that the JSON format matches what was requested.')
      }

      setSlots(updated)

      // Import shopping items if present
      const validCategories = ['produce', 'protein', 'pantry', 'spices']
      if (Array.isArray(data.shopping_items) && data.shopping_items.length > 0) {
        const importedItems: ShoppingItemDraft[] = data.shopping_items
          .filter((item: { category?: string; name?: string }) =>
            item.name && typeof item.name === 'string' &&
            validCategories.includes(item.category)
          )
          .map((item: { category: ShoppingCategory; name: string; qty?: string | null; cost?: number | null; note?: string | null }) => ({
            category: item.category,
            name: item.name.trim(),
            qty: item.qty ?? '',
            cost: item.cost != null ? String(item.cost) : '',
            note: item.note ?? '',
          }))
        if (importedItems.length > 0) setShoppingItems(importedItems)
      }

      setAiParsed(true)
    } catch (e) {
      setAiError(e instanceof Error ? e.message : 'Invalid JSON. Check the response and try again.')
    }
  }

  const toggleReuse = (id: string, ids: string[], setIds: (v: string[]) => void) => {
    setIds(ids.includes(id) ? ids.filter(x => x !== id) : [...ids, id])
  }

  const applyReuseRecipes = (currentSlots: SlotPlan[]): SlotPlan[] => {
    const updated = currentSlots.map(s => ({ ...s }))

    const assignToSlots = (ids: string[], mealType: MealType) => {
      if (ids.length === 0) return
      // Find empty slots of this type (no recipe, no AI recipe, no free text)
      const emptyIdxs = updated
        .map((s, i) => ({ s, i }))
        .filter(({ s }) => s.mealType === mealType && !s.recipeId && !s.aiRecipe && !s.freeText)
        .map(({ i }) => i)
      // Shuffle for random distribution
      for (let i = emptyIdxs.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [emptyIdxs[i], emptyIdxs[j]] = [emptyIdxs[j], emptyIdxs[i]]
      }
      ids.forEach((recipeId, i) => {
        if (i < emptyIdxs.length) {
          updated[emptyIdxs[i]] = { ...updated[emptyIdxs[i]], recipeId, freeText: '', aiRecipe: null }
        }
      })
    }

    assignToSlots(reuseBreakfastIds, 'breakfast')
    assignToSlots(reuseLunchIds, 'lunch')
    assignToSlots(reuseDinnerIds, 'dinner')
    return updated
  }

  const handleSave = async () => {
    if (!label.trim()) return
    setSaving(true)

    // Insert AI-generated recipes first to get their real IDs
    const aiRecipeIdMap = new Map<string, string>() // "dayIndex_mealType" -> recipe.id
    for (const slot of slots.filter(s => s.aiRecipe)) {
      if (!slot.aiRecipe) continue
      const { data: recipe } = await supabase
        .from('recipes')
        .insert({
          title: slot.aiRecipe.title,
          emoji: slot.aiRecipe.emoji,
          sub: slot.aiRecipe.sub,
          tags: slot.aiRecipe.tags,
          recipe_group: slot.aiRecipe.recipe_group,
          ingredients: slot.aiRecipe.ingredients.map(text => ({ text })),
          instructions: slot.aiRecipe.instructions.map(text => ({ text })),
          dressings: slot.aiRecipe.dressings,
          tips: slot.aiRecipe.tips,
          subsections: [],
          sort_order: 0,
        })
        .select()
        .single()

      if (recipe) {
        aiRecipeIdMap.set(`${slot.dayIndex}_${slot.mealType}`, recipe.id)
      }
    }

    const slotInserts = (targetWeekId: string) => slots.map(s => {
      const aiRecipeId = aiRecipeIdMap.get(`${s.dayIndex}_${s.mealType}`) || null
      return {
        week_id: targetWeekId,
        day_index: s.dayIndex,
        meal_type: s.mealType,
        recipe_id: aiRecipeId || s.recipeId || null,
        free_text: !aiRecipeId && !s.recipeId ? (s.freeText || null) : null,
      }
    })

    const shoppingInserts = (targetWeekId: string) =>
      shoppingItems
        .filter(i => i.name.trim())
        .map((item, idx) => ({
          week_id: targetWeekId,
          category: item.category,
          name: item.name.trim(),
          qty: item.qty || null,
          cost: parseFloat(item.cost) || 0,
          note: item.note || null,
          source: 'manual',
          sort_order: idx,
        }))

    if (isEditing && weekId) {
      // Update existing week
      const { error } = await supabase
        .from('weeks')
        .update({ label: label.trim(), start_date: startDate || null, notes: notes || null })
        .eq('id', weekId)

      if (error) { setSaving(false); alert('Failed to update week: ' + error.message); return }

      // Replace all slots and shopping items
      await supabase.from('meal_slots').delete().eq('week_id', weekId)
      await supabase.from('shopping_items').delete().eq('week_id', weekId)
      await supabase.from('meal_slots').insert(slotInserts(weekId))
      const items = shoppingInserts(weekId)
      if (items.length > 0) await supabase.from('shopping_items').insert(items)

      router.push(`/week/${weekId}`)
    } else {
      // Create new week
      const { data: week, error } = await supabase
        .from('weeks')
        .insert({ label: label.trim(), start_date: startDate || null, notes: notes || null })
        .select()
        .single()

      if (error || !week) { setSaving(false); alert('Failed to create week: ' + error?.message); return }

      await supabase.from('meal_slots').insert(slotInserts(week.id))
      const items = shoppingInserts(week.id)
      if (items.length > 0) await supabase.from('shopping_items').insert(items)

      router.push(`/week/${week.id}`)
    }
  }

  const getRecipeName = (recipeId: string | null) => {
    if (!recipeId) return null
    return recipes.find(r => r.id === recipeId)
  }

  const counterBtn = (disabled: boolean): CSSProperties => ({
    width: 32, height: 32, borderRadius: 6,
    background: disabled ? 'var(--gray-mid)' : 'var(--green)',
    color: disabled ? 'var(--gray)' : 'white',
    border: 'none', cursor: disabled ? 'default' : 'pointer',
    fontSize: '1.1rem', fontWeight: 700,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  })

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
              <span style={{ opacity: 0.4, fontWeight: 300 }}>—</span>
              {isEditing ? 'Edit Week' : 'Add New Week'}
            </h1>
            <p>Step {step} of {STEPS.length} · {isEditing ? 'Update your week plan.' : 'Let\'s plan your week.'}</p>
          </div>
          <Link href="/dietary-counsel" style={{ background: 'rgba(255,255,255,0.18)', color: 'white', borderRadius: 8, padding: '5px 10px', fontSize: '0.73rem', textDecoration: 'none', fontWeight: 600 }}>
            🥗 Counsel
          </Link>
        </div>
      </header>

      {/* Step indicators */}
      <div style={{ display: 'flex', background: 'white', borderBottom: '2px solid var(--gray-mid)', padding: '10px 20px', gap: 8 }}>
        {STEPS.map((s, i) => (
          <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 4, flex: 1 }}>
            <div style={{
              width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.72rem', fontWeight: 700,
              background: step > i + 1 ? 'var(--green)' : step === i + 1 ? 'var(--green)' : 'var(--gray-mid)',
              color: step >= i + 1 ? 'white' : 'var(--gray)',
            }}>
              {step > i + 1 ? '✓' : i + 1}
            </div>
            <span style={{ fontSize: '0.68rem', fontWeight: step === i + 1 ? 700 : 400, color: step === i + 1 ? 'var(--green)' : 'var(--gray)', lineHeight: 1.2 }}>{s}</span>
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

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
              <label className="form-label" style={{ margin: 0 }}>Notes (optional)</label>
              <button
                type="button"
                onClick={() => setNotes(DEFAULT_WEEK_NOTES)}
                style={{ background: 'none', border: 'none', color: 'var(--green)', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', padding: '2px 0' }}
              >
                Use default
              </button>
            </div>
            <textarea
              className="form-textarea"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="e.g. Low-Gluten · Budget week · Fish-forward"
            />

            <div style={{ marginTop: 20, display: 'flex', gap: 10 }}>
              <button className="btn btn-primary" onClick={() => setStep(2)} disabled={!label.trim()}>
                Next: AI Generator →
              </button>
              <a href={isEditing ? `/week/${weekId}` : '/weeks'} className="btn btn-secondary">Cancel</a>
            </div>
          </div>
        )}

        {/* ── Step 2: AI Meal Generator ── */}
        {step === 2 && (
          <div>
            <div className="info-box">
              Choose how many meals you want AI to plan. You&apos;ll copy the prompt, paste it into any AI chat (Claude, ChatGPT, etc.), then paste the response back to auto-fill your meal plan. Or skip to plan manually.
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
              {([
                { label: '🌅 Breakfasts', count: aiBreakfasts, setCount: setAiBreakfasts },
                { label: '☀️ Lunches', count: aiLunches, setCount: setAiLunches },
                { label: '🌙 Dinners', count: aiDinners, setCount: setAiDinners },
              ]).map(({ label: typeLabel, count, setCount }) => (
                <div key={typeLabel} style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'white', borderRadius: 'var(--radius)', padding: '12px 16px', boxShadow: 'var(--shadow)' }}>
                  <span style={{ flex: 1, fontSize: '0.88rem', fontWeight: 600 }}>{typeLabel}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <button style={counterBtn(count === 0)} onClick={() => setCount(Math.max(0, count - 1))} disabled={count === 0}>−</button>
                    <span style={{ width: 24, textAlign: 'center', fontWeight: 700, fontSize: '1rem' }}>{count}</span>
                    <button style={counterBtn(count === 7)} onClick={() => setCount(Math.min(7, count + 1))} disabled={count === 7}>+</button>
                  </div>
                </div>
              ))}
            </div>

            {/* ── Reuse from library ── */}
            {(breakfastRecipes.length > 0 || dinnerRecipes.length > 0) && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <div style={{ flex: 1, height: 1, background: 'var(--gray-mid)' }} />
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--gray)', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
                    Reuse from library
                  </span>
                  <div style={{ flex: 1, height: 1, background: 'var(--gray-mid)' }} />
                </div>

                {([
                  { key: 'breakfast', label: '🌅 Breakfasts', pool: breakfastRecipes, ids: reuseBreakfastIds, setIds: setReuseBreakfastIds },
                  { key: 'lunch', label: '☀️ Lunches', pool: dinnerRecipes, ids: reuseLunchIds, setIds: setReuseLunchIds },
                  { key: 'dinner', label: '🌙 Dinners', pool: dinnerRecipes, ids: reuseDinnerIds, setIds: setReuseDinnerIds },
                ]).map(({ key, label, pool, ids, setIds }) => {
                  if (pool.length === 0) return null
                  const isOpen = !!reuseOpen[key]
                  return (
                    <div key={key} style={{ background: 'white', borderRadius: 'var(--radius)', marginBottom: 8, boxShadow: 'var(--shadow)', overflow: 'hidden' }}>
                      <button
                        onClick={() => setReuseOpen(prev => ({ ...prev, [key]: !prev[key] }))}
                        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                      >
                        <span style={{ flex: 1, fontSize: '0.88rem', fontWeight: 600 }}>{label}</span>
                        {ids.length > 0 && (
                          <span style={{ fontSize: '0.72rem', fontWeight: 700, background: 'var(--green-light)', color: 'var(--green)', borderRadius: 10, padding: '2px 9px' }}>
                            {ids.length} selected
                          </span>
                        )}
                        <span style={{ fontSize: '0.72rem', color: 'var(--gray)', transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s', display: 'inline-block' }}>▼</span>
                      </button>
                      {isOpen && (
                        <div style={{ borderTop: '1px solid var(--gray-mid)', padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: 4, maxHeight: 260, overflowY: 'auto' }}>
                          {pool.map(recipe => {
                            const selected = ids.includes(recipe.id)
                            return (
                              <button
                                key={recipe.id}
                                onClick={() => toggleReuse(recipe.id, ids, setIds)}
                                style={{
                                  display: 'flex', alignItems: 'center', gap: 10,
                                  padding: '8px 10px', borderRadius: 8, border: 'none', cursor: 'pointer', textAlign: 'left',
                                  background: selected ? 'var(--green-light)' : 'var(--gray-light)',
                                  transition: 'background 0.1s',
                                }}
                              >
                                <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>{recipe.emoji}</span>
                                <span style={{ flex: 1, fontSize: '0.82rem', fontWeight: 600, color: selected ? 'var(--green-dark)' : 'var(--text)' }}>{recipe.title}</span>
                                {recipe.sub && <span style={{ fontSize: '0.68rem', color: 'var(--gray)', flexShrink: 0 }}>{recipe.sub}</span>}
                                {selected && <span style={{ fontSize: '0.9rem', flexShrink: 0 }}>✓</span>}
                              </button>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            {totalAiMeals > 0 && (
              <button className="btn btn-primary" onClick={buildPrompt} style={{ width: '100%', justifyContent: 'center', marginBottom: 16 }}>
                ✨ Build Prompt ({totalAiMeals} meal{totalAiMeals > 1 ? 's' : ''})
              </button>
            )}

            {generatedPrompt && (
              <>
                <label className="form-label">1. Copy this prompt and paste it into an AI chat:</label>
                <div style={{ position: 'relative', marginBottom: 16 }}>
                  <textarea
                    readOnly
                    value={generatedPrompt}
                    className="form-textarea"
                    style={{ fontFamily: 'monospace', fontSize: '0.7rem', height: 160, paddingRight: 72, resize: 'none' }}
                  />
                  <button
                    onClick={handleCopy}
                    style={{
                      position: 'absolute', top: 8, right: 8,
                      background: copied ? 'var(--green)' : 'var(--gray-mid)',
                      color: copied ? 'white' : 'var(--gray)',
                      border: 'none', borderRadius: 6, padding: '4px 10px',
                      fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', transition: 'background 0.15s',
                    }}
                  >
                    {copied ? '✓ Copied' : 'Copy'}
                  </button>
                </div>

                <label className="form-label">2. Paste the AI response here:</label>
                <textarea
                  className="form-textarea"
                  value={aiResponse}
                  onChange={e => { setAiResponse(e.target.value); setAiParsed(false); setAiError('') }}
                  placeholder='Paste the JSON response from the AI here…'
                  style={{ fontFamily: 'monospace', fontSize: '0.7rem', height: 160, marginBottom: 8, resize: 'none' }}
                />

                {aiError && (
                  <div style={{ background: '#fff1f0', border: '1px solid #fca5a5', borderRadius: 8, padding: '10px 14px', fontSize: '0.82rem', color: '#b91c1c', marginBottom: 8 }}>
                    {aiError}
                  </div>
                )}

                {aiParsed && (
                  <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 8, padding: '10px 14px', fontSize: '0.82rem', color: '#15803d', marginBottom: 8 }}>
                    ✓ Meals and shopping list imported! Review and edit them in the next steps.
                  </div>
                )}

                {aiResponse.trim() && !aiParsed && (
                  <button className="btn btn-primary" onClick={parseAiResponse} style={{ width: '100%', justifyContent: 'center', marginBottom: 8 }}>
                    Import Meals →
                  </button>
                )}
              </>
            )}

            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              <button className="btn btn-secondary" onClick={() => setStep(1)}>← Back</button>
              <div style={{ flex: 1 }} />
              <button
                className={(aiParsed || reuseBreakfastIds.length + reuseLunchIds.length + reuseDinnerIds.length > 0) ? 'btn btn-primary' : 'btn btn-secondary'}
                onClick={() => { setSlots(prev => applyReuseRecipes(prev)); setStep(3) }}
              >
                {aiParsed ? 'Next: Review Meals →' : reuseBreakfastIds.length + reuseLunchIds.length + reuseDinnerIds.length > 0 ? 'Next: Review Meals →' : 'Skip →'}
              </button>
            </div>
          </div>
        )}

        {/* ── Step 3: Meal plan ── */}
        {step === 3 && (
          <div>
            <div className="info-box">
              {aiParsed
                ? 'AI meals are shown in orange (✨). Reused recipes are shown in green. Tap ✏️ to swap any meal or clear it.'
                : 'Tap ✏️ next to any meal to assign a recipe. Leave blank for simple meals you\'ll fill in later.'}
            </div>
            {DAY_NAMES.map((day, dayIndex) => (
              <div key={day} className="meal-day">
                <div className="meal-day-header">{day}</div>
                {(['breakfast', 'lunch', 'dinner'] as MealType[]).map(mealType => {
                  const slot = getSlot(dayIndex, mealType)
                  const recipe = getRecipeName(slot?.recipeId ?? null)
                  const aiRecipe = slot?.aiRecipe
                  return (
                    <div key={mealType} className="meal-row">
                      <div className="meal-label">{mealType}</div>
                      <div style={{ flex: 1 }}>
                        {recipe ? (
                          <span style={{ color: 'var(--green)', fontSize: '0.82rem' }}>{recipe.emoji} {recipe.title}</span>
                        ) : aiRecipe ? (
                          <span style={{ color: 'var(--orange)', fontSize: '0.82rem' }}>✨ {aiRecipe.emoji} {aiRecipe.title}</span>
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
              <button className="btn btn-secondary" onClick={() => setStep(2)}>← Back</button>
              <button className="btn btn-primary" onClick={() => setStep(4)}>Next: Shopping List →</button>
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

        {/* ── Step 4: Shopping list ── */}
        {step === 4 && (
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
              <button className="btn btn-secondary" onClick={() => setStep(3)}>← Back</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? (isEditing ? 'Saving…' : 'Creating…') : isEditing ? '✓ Save Changes' : '✓ Create Week'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
