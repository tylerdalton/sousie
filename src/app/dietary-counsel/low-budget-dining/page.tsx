'use client'

import { useState } from 'react'
import Link from 'next/link'

// ── Types ────────────────────────────────────────────────────────────────────

type Tab = 'learn' | 'proteins' | 'checklist'

type Section = {
  id: string
  emoji: string
  title: string
  subtitle: string
  content: React.ReactNode
}

// ── Content ──────────────────────────────────────────────────────────────────

const LEARN_SECTIONS: Section[] = [
  {
    id: 'meal-planning',
    emoji: '📅',
    title: 'Plan before you shop',
    subtitle: 'The single biggest money-saver',
    content: (
      <div style={{ fontSize: '0.84rem', color: '#374151', lineHeight: 1.7 }}>
        <p>Unplanned grocery shopping is the fastest way to overspend. A 20-minute planning session each week pays for itself many times over.</p>
        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 9 }}>
          {[
            { num: '1', tip: 'Check your fridge first', detail: 'Note what you already have — especially things that are about to expire. Build at least one meal around them before writing your list.' },
            { num: '2', tip: 'Plan 5–6 dinners, not 7', detail: 'One leftovers night and one simple pantry meal (eggs, pasta, beans) frees up budget and reduces waste without feeling restrictive.' },
            { num: '3', tip: 'Pick 1–2 "anchor" proteins', detail: 'Buy a larger pack of chicken thighs or ground beef and plan 2–3 meals around it. You get a bulk discount and simpler shopping.' },
            { num: '4', tip: 'Write your list by store section', detail: 'Produce → proteins → dairy → canned/dry goods → frozen. You spend less time (and impulse-buy less) when you move through the store with purpose.' },
            { num: '5', tip: 'Set a per-meal budget target', detail: 'Aiming for $3–4/person per dinner is very achievable with whole ingredients. Track it once or twice to calibrate your sense of what things cost.' },
          ].map(({ num, tip, detail }) => (
            <div key={num} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{ flexShrink: 0, width: 24, height: 24, borderRadius: '50%', background: '#e07b39', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.72rem' }}>
                {num}
              </div>
              <div>
                <div style={{ fontWeight: 700 }}>{tip}</div>
                <div style={{ color: '#6b7280', fontSize: '0.79rem' }}>{detail}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 'pantry-staples',
    emoji: '🏠',
    title: 'Pantry staples under $5',
    subtitle: 'The backbone of budget cooking',
    content: (
      <div style={{ fontSize: '0.84rem', color: '#374151', lineHeight: 1.7 }}>
        <p>A stocked pantry means you can always make a solid meal even when your fresh ingredients are low. These items have long shelf lives and stretch far:</p>
        <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {[
            ['Dried lentils', 'Protein + fiber, cooks in 20 min'],
            ['Canned chickpeas', 'Soups, salads, roasted snacks'],
            ['Canned diced tomatoes', 'Sauce, chili, shakshuka base'],
            ['Rice (5 lb bag)', 'Foundation of hundreds of meals'],
            ['Rolled oats', 'Breakfast + baking + granola'],
            ['Dried pasta', '1 lb feeds 4 for under $1.50'],
            ['Olive oil (store brand)', 'Cooking + finishing + dressings'],
            ['Canned coconut milk', 'Curries, soups, smoothies'],
            ['Low-sodium stock', 'Braising, soups, risotto'],
            ['Dried beans (black/pinto)', 'Cheaper per serving than canned'],
            ['Corn tortillas', 'Tacos, tostadas, quesadillas'],
            ['Vinegar (apple cider)', 'Dressings, marinades, pickling'],
          ].map(([item, use]) => (
            <div key={item} style={{ background: '#fdf3ec', borderRadius: 8, padding: '8px 10px' }}>
              <div style={{ fontWeight: 700, fontSize: '0.78rem', color: '#1f2937' }}>{item}</div>
              <div style={{ fontSize: '0.7rem', color: '#6b7280' }}>{use}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 12, background: '#fffbeb', borderLeft: '3px solid #f59e0b', padding: '9px 12px', borderRadius: '0 6px 6px 0', fontSize: '0.78rem' }}>
          <strong>Buying tip:</strong> Dry beans cost 3–5× less per serving than canned. The trade-off is a 1-hour soak + 90-minute cook. A Sunday batch covers the whole week.
        </div>
      </div>
    ),
  },
  {
    id: 'batch-cooking',
    emoji: '🍲',
    title: 'Batch cooking & leftovers',
    subtitle: 'Cook once, eat three times',
    content: (
      <div style={{ fontSize: '0.84rem', color: '#374151', lineHeight: 1.7 }}>
        <p>Batch cooking is the highest-leverage skill in budget dining. Spend 1–2 hours on Sunday and you solve 3–4 weeknight dinners.</p>
        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ background: '#fdf3ec', borderRadius: 8, padding: '10px 13px' }}>
            <div style={{ fontWeight: 700, color: '#e07b39', marginBottom: 4 }}>Anchor items worth batching</div>
            <ul style={{ paddingLeft: 16 }}>
              {[
                'A big pot of grains (rice, farro, quinoa) — keeps 5 days refrigerated',
                'Roasted vegetables (sheet pan) — endlessly versatile for bowls, wraps, pasta',
                'A protein base (ground meat, shredded chicken, roasted chickpeas)',
                'A sauce or dressing — homemade costs a fraction of store-bought',
              ].map(item => <li key={item} style={{ marginBottom: 4 }}>{item}</li>)}
            </ul>
          </div>
          <div style={{ background: '#fdf3ec', borderRadius: 8, padding: '10px 13px' }}>
            <div style={{ fontWeight: 700, color: '#e07b39', marginBottom: 4 }}>The "remix" mindset</div>
            <p>Monday: roast chicken + rice + vegetables. Tuesday: the same chicken shredded in tacos. Wednesday: chicken + broth + noodles = soup. Same ingredient, three different meals, zero boredom.</p>
          </div>
          <div style={{ background: '#fdf3ec', borderRadius: 8, padding: '10px 13px' }}>
            <div style={{ fontWeight: 700, color: '#e07b39', marginBottom: 4 }}>Smart storage</div>
            <p>Label containers with the date. Cooked grains: 5 days. Cooked beans: 5 days. Cooked meat: 3–4 days. Soups and stews: 4–5 days. Freeze anything you won&apos;t eat within that window.</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'smart-shopping',
    emoji: '🛒',
    title: 'Shopping smarter',
    subtitle: 'Where your money actually goes',
    content: (
      <div style={{ fontSize: '0.84rem', color: '#374151', lineHeight: 1.7 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          {[
            { icon: '🏷️', title: 'Store brands over name brands', body: 'For pantry staples — canned goods, flour, oil, pasta — store-brand quality is nearly identical. Switching to store brands on staples alone can cut $15–25/week from a typical family grocery bill.' },
            { icon: '📍', title: 'Shop the perimeter last', body: 'Fresh produce, meat, and dairy are perishable — buy them last so they stay cold. Start in the dry-goods aisle where the budget stretchers live.' },
            { icon: '🥶', title: 'Frozen vegetables are your friend', body: 'Frozen vegetables are flash-frozen at peak ripeness, often more nutritious than "fresh" produce that\'s been in transit for days, and usually 40–60% cheaper.' },
            { icon: '📊', title: 'Price per unit, not per package', body: 'The bigger package is usually cheaper per ounce — but not always. Most store shelf tags show the unit price. Compare that number, not the sticker price.' },
            { icon: '🌿', title: 'Buy produce that\'s in season', body: 'Out-of-season produce is imported, more expensive, and less flavorful. Seasonal produce is the exact opposite. A rough guide: berries in summer, squash in fall, citrus in winter, asparagus in spring.' },
            { icon: '🏪', title: 'Ethnic grocery stores', body: 'Asian, Latin, and Middle Eastern grocery stores consistently beat large chain prices on spices, produce, rice, and pantry staples — sometimes by 50–70%.' },
          ].map(({ icon, title, body }) => (
            <div key={title} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>{icon}</span>
              <div>
                <div style={{ fontWeight: 700 }}>{title}</div>
                <div style={{ color: '#6b7280', fontSize: '0.79rem', lineHeight: 1.5 }}>{body}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 'waste-reduction',
    emoji: '♻️',
    title: 'Reducing food waste',
    subtitle: 'The hidden drain on your food budget',
    content: (
      <div style={{ fontSize: '0.84rem', color: '#374151', lineHeight: 1.7 }}>
        <p>The average American household throws away <strong>$1,500+ of food per year</strong>. Cutting waste is as powerful as cutting prices.</p>
        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { action: 'FIFO in your fridge', note: '"First In, First Out" — older items at the front, newer items behind. You always reach for what needs to be used first.' },
            { action: 'Wilting vegetables → soup or stir-fry', note: 'Slightly soft vegetables have lost water, not nutrition or flavor. One weekly "clean-out" soup or stir-fry uses them up before they spoil.' },
            { action: 'Herb stems and vegetable scraps', note: 'Save onion skins, carrot tops, celery ends, and herb stems in a bag in the freezer. Once full, simmer into vegetable stock for free.' },
            { action: 'Overripe fruit → smoothies or baking', note: 'Soft berries blend perfectly. Brown bananas are sweeter than fresh ones in banana bread. Don\'t throw them away.' },
            { action: 'Parmesan rinds in soups', note: 'Toss a Parmesan rind into minestrone or bean soup while it simmers. It melts into the broth and adds incredible depth.' },
            { action: 'Buy bread day-old', note: 'Day-old bread from a bakery or grocery bakery section is 30–50% cheaper and perfect for toast, sandwiches, croutons, or bread pudding.' },
          ].map(({ action, note }) => (
            <div key={action} style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 8, padding: '10px 12px' }}>
              <div style={{ fontWeight: 700, color: '#1f2937', marginBottom: 3 }}>{action}</div>
              <div style={{ color: '#6b7280', fontSize: '0.78rem' }}>{note}</div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
]

const PROTEINS = [
  { name: 'Eggs', cost: '~$0.25–0.40 each', protein: '6g/egg', ideas: 'Scrambled, frittata, shakshuka, fried rice, egg sandwiches', tag: 'Best value' },
  { name: 'Canned tuna / sardines', cost: '$1–2 per can', protein: '20–25g/can', ideas: 'Pasta, salads, grain bowls, tuna melts, fish cakes', tag: 'Best value' },
  { name: 'Dried lentils', cost: '$0.20–0.30 per serving', protein: '18g per cooked cup', ideas: 'Dal, soup, tacos, bolognese substitute, salads', tag: 'Plant-based' },
  { name: 'Chicken thighs (bone-in)', cost: '$1–2 per lb', protein: '~25g per thigh', ideas: 'Roasted, braised, curried, shredded for tacos or soup', tag: 'Best value' },
  { name: 'Canned chickpeas', cost: '$0.80–1.20 per can', protein: '15g per cup', ideas: 'Roasted, curried, hummus, salads, pasta e ceci', tag: 'Plant-based' },
  { name: 'Ground beef (80/20)', cost: '$4–6 per lb', protein: '~22g per 3 oz', ideas: 'Tacos, bolognese, stuffed peppers, meatballs, chili', tag: 'Versatile' },
  { name: 'Black or pinto beans', cost: '$0.15–0.25 per serving (dry)', protein: '15g per cup', ideas: 'Burritos, soups, rice bowls, burgers, refried beans', tag: 'Plant-based' },
  { name: 'Tofu (firm)', cost: '$2–3 per block', protein: '10g per 3 oz', ideas: 'Stir-fry, scrambled, baked, soups, tacos', tag: 'Plant-based' },
  { name: 'Whole chicken', cost: '$5–8 total', protein: 'Feeds 4–5', ideas: 'Roast once → chicken salad, tacos, soup from carcass. Best value per pound of any protein.', tag: 'Best value' },
  { name: 'Cottage cheese', cost: '$3–4 per tub', protein: '14g per ½ cup', ideas: 'Bowls, dips, pancakes, pasta sauce, smoothies', tag: 'Versatile' },
]

const CHECKLIST_ITEMS = [
  { id: 'b1', category: 'Planning', text: 'Write a weekly meal plan before shopping — even a rough one' },
  { id: 'b2', category: 'Planning', text: 'Check fridge for near-expiry items and plan at least one meal around them' },
  { id: 'b3', category: 'Planning', text: 'Set a weekly grocery budget and track it this week' },
  { id: 'b4', category: 'Shopping', text: 'Shop with a written list — no browsing' },
  { id: 'b5', category: 'Shopping', text: 'Compare unit prices, not package prices' },
  { id: 'b6', category: 'Shopping', text: 'Try one store-brand swap for a regular name-brand item' },
  { id: 'b7', category: 'Shopping', text: 'Check the freezer section for a vegetable you usually buy fresh' },
  { id: 'b8', category: 'Shopping', text: 'Visit or try an ethnic grocery store for spices, grains, or produce' },
  { id: 'b9', category: 'Cooking', text: 'Batch cook one staple this week (grain, bean, roasted veg, or protein)' },
  { id: 'b10', category: 'Cooking', text: 'Plan a "remix" meal from planned leftovers' },
  { id: 'b11', category: 'Cooking', text: 'Start a scrap bag in the freezer for future stock' },
  { id: 'b12', category: 'Pantry', text: 'Have at least 3 protein-rich pantry items stocked (canned beans, tuna, lentils)' },
  { id: 'b13', category: 'Pantry', text: 'Stocked rice or dried pasta to anchor 2+ meals this week' },
  { id: 'b14', category: 'Habits', text: 'Cooked one meal this week under $3/person' },
  { id: 'b15', category: 'Habits', text: 'Wasted less food this week than the week before' },
]

// ── Component ─────────────────────────────────────────────────────────────────

export default function LowBudgetDiningPage() {
  const [activeTab, setActiveTab] = useState<Tab>('learn')
  const [openSection, setOpenSection] = useState<string | null>('meal-planning')
  const [openProtein, setOpenProtein] = useState<string | null>(null)
  const [checked, setChecked] = useState<Set<string>>(new Set())

  const toggleSection = (id: string) =>
    setOpenSection(prev => (prev === id ? null : id))

  const toggleProtein = (name: string) =>
    setOpenProtein(prev => (prev === name ? null : name))

  const toggleCheck = (id: string) =>
    setChecked(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  const checklistByCategory = CHECKLIST_ITEMS.reduce<Record<string, typeof CHECKLIST_ITEMS>>(
    (acc, item) => {
      acc[item.category] = acc[item.category] ?? []
      acc[item.category].push(item)
      return acc
    },
    {}
  )

  const tagColor = (tag: string) => {
    if (tag === 'Best value') return { background: '#e8f5ee', color: '#2d7a4f' }
    if (tag === 'Plant-based') return { background: '#dbeafe', color: '#1e40af' }
    return { background: '#fdf3ec', color: '#e07b39' }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4f1', fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>

      {/* Nav */}
      <nav style={{ background: 'white', borderBottom: '1px solid #e5e7eb', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 10, position: 'sticky', top: 0, zIndex: 50 }}>
        <Link href="/dietary-counsel" style={{ color: '#6b7280', fontSize: '0.82rem', textDecoration: 'none', fontWeight: 500 }}>
          ← Dietary Counsel
        </Link>
        <span style={{ color: '#d1d5db' }}>·</span>
        <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#e07b39' }}>Low-Budget Dining</span>
      </nav>

      {/* Header */}
      <header style={{ background: 'linear-gradient(135deg, #e07b39 0%, #c4682c 100%)', color: 'white', padding: '36px 20px 40px' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <div style={{ fontSize: '2.6rem', marginBottom: 10 }}>💰</div>
          <h1 style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: 10 }}>
            Low-Budget Dining
          </h1>
          <p style={{ fontSize: '0.88rem', opacity: 0.88, lineHeight: 1.7, maxWidth: 520 }}>
            Practical strategies to slash your grocery bill without sacrificing nutrition, flavor, or the joy of eating well.
          </p>
          <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
            {['5 strategy topics', '10 budget proteins', '15-point habit checklist'].map(tag => (
              <span key={tag} style={{ background: 'rgba(255,255,255,0.18)', borderRadius: 20, padding: '4px 12px', fontSize: '0.73rem', fontWeight: 600 }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div style={{ background: 'white', borderBottom: '2px solid #e5e7eb', position: 'sticky', top: 45, zIndex: 40, boxShadow: '0 2px 6px rgba(0,0,0,0.06)' }}>
        <div style={{ maxWidth: 680, margin: '0 auto', display: 'flex' }}>
          {([
            { id: 'learn', label: '📚 Strategies', desc: '5 topics' },
            { id: 'proteins', label: '🥩 Proteins', desc: 'Budget guide' },
            { id: 'checklist', label: '✅ Habits', desc: `${checked.size}/${CHECKLIST_ITEMS.length} done` },
          ] as { id: Tab; label: string; desc: string }[]).map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1, padding: '11px 6px', border: 'none', background: 'none',
                borderBottom: `3px solid ${activeTab === tab.id ? '#e07b39' : 'transparent'}`,
                color: activeTab === tab.id ? '#e07b39' : '#6b7280',
                cursor: 'pointer', textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '0.8rem', fontWeight: 700 }}>{tab.label}</div>
              <div style={{ fontSize: '0.65rem', opacity: 0.7, marginTop: 1 }}>{tab.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '16px 16px 80px' }}>

        {/* ── LEARN TAB ── */}
        {activeTab === 'learn' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {LEARN_SECTIONS.map(section => (
              <div key={section.id} style={{ background: 'white', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
                <button
                  onClick={() => toggleSection(section.id)}
                  style={{
                    width: '100%', padding: '14px 16px', border: 'none', background: 'none',
                    display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', textAlign: 'left',
                    borderBottom: openSection === section.id ? '1px solid #e5e7eb' : 'none',
                  }}
                >
                  <span style={{ fontSize: '1.3rem', flexShrink: 0 }}>{section.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1f2937' }}>{section.title}</div>
                    <div style={{ fontSize: '0.72rem', color: '#9ca3af', marginTop: 1 }}>{section.subtitle}</div>
                  </div>
                  <span style={{ color: '#9ca3af', fontSize: '0.75rem', transform: openSection === section.id ? 'rotate(90deg)' : 'none', transition: 'transform 0.18s' }}>▶</span>
                </button>
                {openSection === section.id && (
                  <div style={{ padding: '14px 16px 16px' }}>
                    {section.content}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ── PROTEINS TAB ── */}
        {activeTab === 'proteins' && (
          <div>
            <p style={{ fontSize: '0.78rem', color: '#6b7280', marginBottom: 14, lineHeight: 1.6 }}>
              Protein is usually the most expensive part of a meal. These options deliver the most nutrition per dollar. Tap any for meal ideas.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {PROTEINS.map(protein => (
                <div key={protein.name} style={{ background: 'white', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
                  <button
                    onClick={() => toggleProtein(protein.name)}
                    style={{
                      width: '100%', padding: '13px 15px', border: 'none', background: 'none',
                      display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', textAlign: 'left',
                      borderBottom: openProtein === protein.name ? '1px solid #e5e7eb' : 'none',
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 3 }}>
                        <span style={{ fontWeight: 700, fontSize: '0.88rem', color: '#1f2937' }}>{protein.name}</span>
                        <span style={{ fontSize: '0.65rem', fontWeight: 700, padding: '2px 8px', borderRadius: 10, ...tagColor(protein.tag) }}>
                          {protein.tag}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: 12 }}>
                        <span style={{ fontSize: '0.74rem', color: '#e07b39', fontWeight: 600 }}>{protein.cost}</span>
                        <span style={{ fontSize: '0.74rem', color: '#6b7280' }}>· {protein.protein}</span>
                      </div>
                    </div>
                    <span style={{ color: '#9ca3af', fontSize: '0.75rem', transform: openProtein === protein.name ? 'rotate(90deg)' : 'none', transition: 'transform 0.18s' }}>▶</span>
                  </button>
                  {openProtein === protein.name && (
                    <div style={{ padding: '11px 15px 13px', background: '#fafafa' }}>
                      <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 5 }}>Meal ideas</div>
                      <div style={{ fontSize: '0.81rem', color: '#374151', lineHeight: 1.6 }}>{protein.ideas}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── CHECKLIST TAB ── */}
        {activeTab === 'checklist' && (
          <div>
            <div style={{ background: '#e07b39', borderRadius: 12, padding: '14px 16px', marginBottom: 16, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: '1rem' }}>Your budget habits</div>
                <div style={{ fontSize: '0.78rem', opacity: 0.85, marginTop: 2 }}>{checked.size} of {CHECKLIST_ITEMS.length} in practice</div>
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 900 }}>
                {Math.round((checked.size / CHECKLIST_ITEMS.length) * 100)}%
              </div>
            </div>
            {Object.entries(checklistByCategory).map(([cat, items]) => (
              <div key={cat} style={{ marginBottom: 16 }}>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6, paddingLeft: 2 }}>
                  {cat}
                </div>
                <div style={{ background: 'white', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
                  {items.map((item, i) => (
                    <button
                      key={item.id}
                      onClick={() => toggleCheck(item.id)}
                      style={{
                        width: '100%', padding: '12px 14px', border: 'none',
                        background: checked.has(item.id) ? '#fdf3ec' : 'white',
                        display: 'flex', alignItems: 'center', gap: 12,
                        cursor: 'pointer', textAlign: 'left',
                        borderBottom: i < items.length - 1 ? '1px solid #e5e7eb' : 'none',
                        transition: 'background 0.15s',
                      }}
                    >
                      <div style={{
                        flexShrink: 0, width: 22, height: 22, borderRadius: 6,
                        border: `2px solid ${checked.has(item.id) ? '#e07b39' : '#d1d5db'}`,
                        background: checked.has(item.id) ? '#e07b39' : 'white',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.15s',
                      }}>
                        {checked.has(item.id) && <span style={{ color: 'white', fontSize: '0.65rem', fontWeight: 900 }}>✓</span>}
                      </div>
                      <span style={{
                        fontSize: '0.83rem', lineHeight: 1.4,
                        color: checked.has(item.id) ? '#6b7280' : '#1f2937',
                        textDecoration: checked.has(item.id) ? 'line-through' : 'none',
                        transition: 'all 0.15s',
                      }}>
                        {item.text}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
            {checked.size === CHECKLIST_ITEMS.length && (
              <div style={{ background: 'linear-gradient(135deg, #e07b39, #c4682c)', borderRadius: 12, padding: '20px', textAlign: 'center', color: 'white', marginTop: 8 }}>
                <div style={{ fontSize: '2rem', marginBottom: 8 }}>🎉</div>
                <div style={{ fontWeight: 800, fontSize: '1rem', marginBottom: 6 }}>Budget master unlocked!</div>
                <div style={{ fontSize: '0.8rem', opacity: 0.85 }}>You&apos;re planning smart, shopping with intention, and wasting less. These habits compound fast.</div>
              </div>
            )}
          </div>
        )}

      </div>

      {/* Footer */}
      <footer style={{ background: '#1e5436', color: 'rgba(255,255,255,0.5)', padding: '20px 24px', textAlign: 'center', fontSize: '0.72rem' }}>
        👩‍🍳 Sousie · A digital butler for your pantry.
      </footer>

    </div>
  )
}
