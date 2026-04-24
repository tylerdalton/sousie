'use client'

import { useState } from 'react'
import Link from 'next/link'

// ── Types ────────────────────────────────────────────────────────────────────

type Section = {
  id: string
  emoji: string
  title: string
  content: React.ReactNode
}

type Tab = 'learn' | 'swaps' | 'checklist'

// ── Content ──────────────────────────────────────────────────────────────────

const LEARN_SECTIONS: Section[] = [
  {
    id: 'what-is-gluten',
    emoji: '🌾',
    title: 'What is gluten?',
    content: (
      <div style={{ fontSize: '0.84rem', color: '#374151', lineHeight: 1.7 }}>
        <p>
          Gluten is a family of proteins found in wheat, barley, rye, and triticale. It acts as a
          "glue" that gives bread its chewy texture and helps dough hold its shape. For most people
          it's harmless — but for those with <strong>celiac disease</strong> it triggers an immune
          attack on the small intestine, and for those with <strong>non-celiac gluten sensitivity
          (NCGS)</strong> it causes digestive discomfort, fatigue, and brain fog without the
          intestinal damage.
        </p>
        <ul style={{ marginTop: 10, paddingLeft: 18 }}>
          <li>Celiac disease affects ~1% of the population globally.</li>
          <li>NCGS is estimated at 6–10%, though figures vary.</li>
          <li>Wheat allergy is a separate immune response, usually IgE-mediated.</li>
        </ul>
        <div style={{ marginTop: 12, background: '#fffbeb', borderLeft: '3px solid #f59e0b', padding: '9px 12px', borderRadius: '0 6px 6px 0', fontSize: '0.78rem' }}>
          <strong>Tip:</strong> If you suspect celiac disease, get tested <em>before</em> going gluten-free — removing gluten first can make the blood test inaccurate.
        </div>
      </div>
    ),
  },
  {
    id: 'hidden-sources',
    emoji: '🔍',
    title: 'Hidden sources of gluten',
    content: (
      <div style={{ fontSize: '0.84rem', color: '#374151', lineHeight: 1.7 }}>
        <p>Gluten hides in many unexpected places. Always check the ingredient label.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 12 }}>
          {[
            ['Soy sauce', 'contains wheat'],
            ['Malt vinegar', 'made from barley'],
            ['Bouillon cubes', 'often contain wheat starch'],
            ['Oats (unclassified)', 'cross-contaminated at mill'],
            ['Deli meats', 'fillers & binders'],
            ['Imitation crab', 'starch extenders'],
            ['Salad dressings', 'thickeners & malt'],
            ['Licorice candy', 'wheat flour base'],
            ['Beer & ales', 'brewed from barley'],
            ['Flour tortillas', 'obvious but easy to miss'],
            ['Panko & breadcrumbs', 'always check GF label'],
            ['Communion wafers', 'traditionally wheat'],
          ].map(([item, reason]) => (
            <div key={item} style={{ background: '#fdf3ec', borderRadius: 8, padding: '8px 10px' }}>
              <div style={{ fontWeight: 700, fontSize: '0.78rem', color: '#1f2937' }}>{item}</div>
              <div style={{ fontSize: '0.7rem', color: '#6b7280' }}>{reason}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 12, background: '#fffbeb', borderLeft: '3px solid #f59e0b', padding: '9px 12px', borderRadius: '0 6px 6px 0', fontSize: '0.78rem' }}>
          <strong>Cross-contamination:</strong> Even gluten-free ingredients can be contaminated if processed on shared equipment. Look for a dedicated GF facility certification for strictest needs.
        </div>
      </div>
    ),
  },
  {
    id: 'safe-grains',
    emoji: '✅',
    title: 'Safe grains & starches',
    content: (
      <div style={{ fontSize: '0.84rem', color: '#374151', lineHeight: 1.7 }}>
        <p>These are naturally gluten-free when uncontaminated:</p>
        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { grain: 'Rice (all varieties)', note: 'Most versatile GF staple — white, brown, jasmine, basmati' },
            { grain: 'Quinoa', note: 'Complete protein, great for salads & bowls' },
            { grain: 'Buckwheat', note: 'Despite the name, it\'s not wheat — excellent for pancakes & noodles' },
            { grain: 'Millet', note: 'Mild flavor, works as porridge or a couscous substitute' },
            { grain: 'Sorghum', note: 'Nutty taste, good in baked goods & flatbreads' },
            { grain: 'Teff', note: 'Small but nutrient-dense; the base of Ethiopian injera' },
            { grain: 'Certified GF oats', note: 'Regular oats are cross-contaminated — only buy labelled GF' },
            { grain: 'Corn / cornmeal', note: 'Polenta, grits, and masa harina are all safe' },
            { grain: 'Cassava / tapioca', note: 'Excellent for wraps and as a thickener' },
            { grain: 'Arrowroot starch', note: 'Light thickener for sauces, gravies, and baking' },
          ].map(({ grain, note }) => (
            <div key={grain} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <span style={{ color: '#2d7a4f', fontWeight: 700, flexShrink: 0 }}>✓</span>
              <div>
                <span style={{ fontWeight: 600 }}>{grain}</span>
                <span style={{ color: '#6b7280' }}> — {note}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 'label-reading',
    emoji: '🏷️',
    title: 'Reading food labels',
    content: (
      <div style={{ fontSize: '0.84rem', color: '#374151', lineHeight: 1.7 }}>
        <p>In the US, the FDA requires products labeled "gluten-free" to contain &lt;20 ppm gluten — the level generally tolerated by people with celiac disease. Here's how to decode labels:</p>
        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ background: '#e8f5ee', borderRadius: 8, padding: '10px 13px' }}>
            <div style={{ fontWeight: 700, color: '#2d7a4f', marginBottom: 3 }}>Look for gluten-containing grains</div>
            <div>Scan for: <strong>wheat, barley, rye, triticale, spelt, kamut, farro, durum, einkorn</strong>. Also watch for "malt" (usually barley-derived) and "brewer's yeast."</div>
          </div>
          <div style={{ background: '#e8f5ee', borderRadius: 8, padding: '10px 13px' }}>
            <div style={{ fontWeight: 700, color: '#2d7a4f', marginBottom: 3 }}>Check "May contain" warnings</div>
            <div>Advisory statements like "may contain wheat" or "processed in a facility with wheat" are voluntary — but take them seriously if you have celiac disease.</div>
          </div>
          <div style={{ background: '#e8f5ee', borderRadius: 8, padding: '10px 13px' }}>
            <div style={{ fontWeight: 700, color: '#2d7a4f', marginBottom: 3 }}>Certifications to trust</div>
            <div>
              <strong>GFFS</strong> (Gluten-Free Food Service) · <strong>NSF Certified GF</strong> · <strong>Certified GF (GFCO)</strong> — these logos mean third-party testing, not just a label claim.
            </div>
          </div>
          <div style={{ background: '#fffbeb', borderLeft: '3px solid #f59e0b', padding: '9px 12px', borderRadius: '0 6px 6px 0' }}>
            <strong>Watch out:</strong> "Wheat-free" ≠ "gluten-free." A product can be wheat-free and still contain barley or rye.
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'eating-out',
    emoji: '🍽️',
    title: 'Eating out gluten-free',
    content: (
      <div style={{ fontSize: '0.84rem', color: '#374151', lineHeight: 1.7 }}>
        <p>Dining out is one of the trickiest parts of gluten-free living. Use these strategies:</p>
        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 9 }}>
          {[
            { num: '1', tip: 'Call ahead', detail: 'Phone the restaurant before you go. Ask if they have a gluten-free menu or if the kitchen can accommodate you. Staff are less rushed when you\'re not sitting at the table.' },
            { num: '2', tip: 'Be specific with staff', detail: 'Say "I have a medical need to avoid gluten" rather than "I prefer gluten-free." This communicates seriousness and reduces casual cross-contamination.' },
            { num: '3', tip: 'Ask about shared fryers', detail: 'Even GF items like fries become contaminated when fried in the same oil as breaded items.' },
            { num: '4', tip: 'Naturally GF cuisines', detail: 'Thai, Vietnamese, Mexican (corn-based), and Indian food tend to have many naturally GF options. Japanese (sashimi, rice dishes) and Ethiopian (teff injera) can also work well.' },
            { num: '5', tip: 'Avoid buffets', detail: 'Shared serving spoons carry crumbs between dishes. High cross-contamination risk.' },
            { num: '6', tip: 'Carry a card', detail: 'A "chef card" in the local language explaining celiac disease can be a lifesaver when traveling internationally.' },
          ].map(({ num, tip, detail }) => (
            <div key={num} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{ flexShrink: 0, width: 24, height: 24, borderRadius: '50%', background: '#2d7a4f', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.72rem' }}>
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
    id: 'nutrition',
    emoji: '🥦',
    title: 'Staying nutritious on a GF diet',
    content: (
      <div style={{ fontSize: '0.84rem', color: '#374151', lineHeight: 1.7 }}>
        <p>Many processed GF products compensate for texture by adding more sugar and fat. Eating whole, naturally GF foods keeps your nutrition on track.</p>
        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { nutrient: 'Fiber', risk: 'GF bread and pasta often have less fiber than their wheat counterparts.', fix: 'Load up on vegetables, legumes, quinoa, and brown rice.' },
            { nutrient: 'B vitamins (folate, B1, B3)', risk: 'Wheat flour is enriched; GF flours often aren\'t.', fix: 'Eat leafy greens, legumes, eggs, and look for enriched GF products.' },
            { nutrient: 'Iron', risk: 'Wheat is a common iron source in Western diets.', fix: 'Lean meats, lentils, pumpkin seeds, and cast-iron cooking all help.' },
            { nutrient: 'Calcium', risk: 'Celiac disease can impair calcium absorption.', fix: 'Prioritize dairy, fortified plant milks, sardines, kale, and bok choy.' },
          ].map(({ nutrient, risk, fix }) => (
            <div key={nutrient} style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 8, padding: '10px 12px' }}>
              <div style={{ fontWeight: 700, color: '#1f2937', marginBottom: 4 }}>{nutrient}</div>
              <div style={{ color: '#9ca3af', fontSize: '0.76rem', marginBottom: 3 }}>⚠ {risk}</div>
              <div style={{ color: '#2d7a4f', fontSize: '0.78rem' }}>✓ {fix}</div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
]

const SWAPS = [
  { from: 'Soy sauce', to: 'Tamari or coconut aminos', verdict: 'great', note: 'Nearly identical flavor. Tamari is the closest — most brands are naturally GF.' },
  { from: 'All-purpose flour (baking)', to: 'GF 1-to-1 flour blend', verdict: 'great', note: 'Bob\'s Red Mill and King Arthur both make reliable blends. Add ¼ tsp xanthan gum per cup if your blend doesn\'t include it.' },
  { from: 'Pasta', to: 'Rice or chickpea pasta', verdict: 'great', note: 'Rice pasta is closest in texture. Chickpea pasta has more protein. Both cook slightly faster — watch carefully to avoid mushiness.' },
  { from: 'Breadcrumbs', to: 'Crushed GF crackers or rice breadcrumbs', verdict: 'good', note: 'Works well for coatings and meatballs. Rice breadcrumbs can be slightly grittier.' },
  { from: 'Couscous', to: 'Millet or cauliflower rice', verdict: 'good', note: 'Millet has a similar light texture once fluffed. Cauliflower rice is much lighter in calories but has a different flavor profile.' },
  { from: 'Beer in cooking', to: 'GF beer or chicken stock + splash of cider vinegar', verdict: 'good', note: 'The acidity and depth of stock + vinegar replicates the braising effect well.' },
  { from: 'Flour as a thickener', to: 'Cornstarch or arrowroot', verdict: 'great', note: 'Use half the amount — these starches are twice as potent. Mix with cold water first to prevent clumping.' },
  { from: 'Regular oats', to: 'Certified GF oats', verdict: 'great', note: 'Exact same ingredient, just tested to <20 ppm. Always look for the GF certification label.' },
  { from: 'Wraps / flour tortillas', to: 'Corn tortillas or cassava wraps', verdict: 'good', note: 'Corn tortillas are widely available and authentic in Mexican cooking. Cassava wraps are more pliable for burritos.' },
  { from: 'Panko coating', to: 'Crushed GF cornflakes or almond flour', verdict: 'ok', note: 'GF cornflakes give a crispy crunch similar to panko. Almond flour browns beautifully but lacks the crispiness.' },
]

const CHECKLIST_ITEMS = [
  { id: 'c1', category: 'Kitchen', text: 'Got a dedicated GF cutting board and colander' },
  { id: 'c2', category: 'Kitchen', text: 'Replaced shared wooden utensils and scratched pans (gluten hides in pores)' },
  { id: 'c3', category: 'Kitchen', text: 'Using separate butter/condiment containers to avoid double-dipping crumbs' },
  { id: 'c4', category: 'Kitchen', text: 'Labeled my GF pantry shelf separately from other family members' },
  { id: 'c5', category: 'Pantry', text: 'Switched to tamari or coconut aminos instead of soy sauce' },
  { id: 'c6', category: 'Pantry', text: 'Have a reliable GF 1-to-1 flour blend on hand' },
  { id: 'c7', category: 'Pantry', text: 'Stocked GF oats (certified label)' },
  { id: 'c8', category: 'Pantry', text: 'Checked all condiments (ketchup, BBQ sauce, dressings) for hidden wheat' },
  { id: 'c9', category: 'Eating Out', text: 'Know at least 3 local restaurants with reliable GF options' },
  { id: 'c10', category: 'Eating Out', text: 'Have a chef card or know how to explain my needs clearly' },
  { id: 'c11', category: 'Eating Out', text: 'Always ask about shared fryer oil when ordering GF fried foods' },
  { id: 'c12', category: 'Nutrition', text: 'Tracking fiber intake — replacing wheat fiber with vegetables and legumes' },
  { id: 'c13', category: 'Nutrition', text: 'Aware of B-vitamin and iron sources to compensate for un-enriched GF products' },
]

// ── Component ─────────────────────────────────────────────────────────────────

export default function GlutenFreePage() {
  const [activeTab, setActiveTab] = useState<Tab>('learn')
  const [openSection, setOpenSection] = useState<string | null>('what-is-gluten')
  const [openSwap, setOpenSwap] = useState<string | null>(null)
  const [checked, setChecked] = useState<Set<string>>(new Set())

  const toggleSection = (id: string) =>
    setOpenSection(prev => (prev === id ? null : id))

  const toggleSwap = (from: string) =>
    setOpenSwap(prev => (prev === from ? null : from))

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

  const verdictStyle = (v: string) => {
    if (v === 'great') return { background: '#d1fae5', color: '#065f46' }
    if (v === 'good') return { background: '#dbeafe', color: '#1e40af' }
    return { background: '#fef9c3', color: '#713f12' }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4f1', fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>

      {/* Nav */}
      <nav style={{ background: 'white', borderBottom: '1px solid #e5e7eb', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 10, position: 'sticky', top: 0, zIndex: 50 }}>
        <Link href="/dietary-counsel" style={{ color: '#6b7280', fontSize: '0.82rem', textDecoration: 'none', fontWeight: 500 }}>
          ← Dietary Counsel
        </Link>
        <span style={{ color: '#d1d5db' }}>·</span>
        <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#2d7a4f' }}>Gluten-Free Living</span>
      </nav>

      {/* Header */}
      <header style={{ background: 'linear-gradient(135deg, #2d7a4f 0%, #1e5436 100%)', color: 'white', padding: '36px 20px 40px' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <div style={{ fontSize: '2.6rem', marginBottom: 10 }}>🌾</div>
          <h1 style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: 10 }}>
            Gluten-Free Living
          </h1>
          <p style={{ fontSize: '0.88rem', opacity: 0.88, lineHeight: 1.7, maxWidth: 520 }}>
            Everything you need to eat safely and confidently without gluten — from understanding the basics to eating out and staying nutritious.
          </p>
          <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
            {['6 topics', '10 swaps', '13-point checklist'].map(tag => (
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
            { id: 'learn', label: '📚 Learn', desc: 'Key topics' },
            { id: 'swaps', label: '🔄 Swaps', desc: 'Quick reference' },
            { id: 'checklist', label: '✅ Checklist', desc: `${checked.size}/${CHECKLIST_ITEMS.length} done` },
          ] as { id: Tab; label: string; desc: string }[]).map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1, padding: '11px 6px', border: 'none', background: 'none',
                borderBottom: `3px solid ${activeTab === tab.id ? '#2d7a4f' : 'transparent'}`,
                color: activeTab === tab.id ? '#2d7a4f' : '#6b7280',
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
                  <span style={{ flex: 1, fontWeight: 700, fontSize: '0.9rem', color: '#1f2937' }}>{section.title}</span>
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

        {/* ── SWAPS TAB ── */}
        {activeTab === 'swaps' && (
          <div>
            <p style={{ fontSize: '0.78rem', color: '#6b7280', marginBottom: 14, lineHeight: 1.6 }}>
              Tap any swap to see notes on how well it works and how to use it.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {SWAPS.map(swap => (
                <div key={swap.from} style={{ background: 'white', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
                  <button
                    onClick={() => toggleSwap(swap.from)}
                    style={{
                      width: '100%', padding: '13px 15px', border: 'none', background: 'none',
                      display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', textAlign: 'left',
                      borderBottom: openSwap === swap.from ? '1px solid #e5e7eb' : 'none',
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#6b7280', textDecoration: 'line-through' }}>{swap.from}</span>
                        <span style={{ color: '#9ca3af', fontSize: '0.75rem' }}>→</span>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#2d7a4f' }}>{swap.to}</span>
                      </div>
                    </div>
                    <span style={{
                      fontSize: '0.65rem', fontWeight: 700, padding: '2px 8px', borderRadius: 10, flexShrink: 0,
                      ...verdictStyle(swap.verdict),
                    }}>
                      {swap.verdict}
                    </span>
                  </button>
                  {openSwap === swap.from && (
                    <div style={{ padding: '11px 15px 13px', fontSize: '0.8rem', color: '#374151', lineHeight: 1.6, background: '#fafafa' }}>
                      {swap.note}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div style={{ marginTop: 14, display: 'flex', gap: 8, flexWrap: 'wrap', fontSize: '0.72rem' }}>
              {[['great', '#d1fae5', '#065f46'], ['good', '#dbeafe', '#1e40af'], ['ok', '#fef9c3', '#713f12']].map(([v, bg, color]) => (
                <span key={v} style={{ background: bg, color, borderRadius: 10, padding: '3px 10px', fontWeight: 700 }}>
                  {v} — {v === 'great' ? 'nearly identical' : v === 'good' ? 'minor differences' : 'noticeable change'}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ── CHECKLIST TAB ── */}
        {activeTab === 'checklist' && (
          <div>
            <div style={{ background: '#2d7a4f', borderRadius: 12, padding: '14px 16px', marginBottom: 16, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: '1rem' }}>Your GF readiness</div>
                <div style={{ fontSize: '0.78rem', opacity: 0.85, marginTop: 2 }}>{checked.size} of {CHECKLIST_ITEMS.length} completed</div>
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
                        background: checked.has(item.id) ? '#e8f5ee' : 'white',
                        display: 'flex', alignItems: 'center', gap: 12,
                        cursor: 'pointer', textAlign: 'left',
                        borderBottom: i < items.length - 1 ? '1px solid #e5e7eb' : 'none',
                        transition: 'background 0.15s',
                      }}
                    >
                      <div style={{
                        flexShrink: 0, width: 22, height: 22, borderRadius: 6,
                        border: `2px solid ${checked.has(item.id) ? '#2d7a4f' : '#d1d5db'}`,
                        background: checked.has(item.id) ? '#2d7a4f' : 'white',
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
              <div style={{ background: 'linear-gradient(135deg, #2d7a4f, #1e5436)', borderRadius: 12, padding: '20px', textAlign: 'center', color: 'white', marginTop: 8 }}>
                <div style={{ fontSize: '2rem', marginBottom: 8 }}>🎉</div>
                <div style={{ fontWeight: 800, fontSize: '1rem', marginBottom: 6 }}>You&apos;re fully GF-ready!</div>
                <div style={{ fontSize: '0.8rem', opacity: 0.85 }}>You&apos;ve set up your kitchen, restocked your pantry, and know how to navigate dining out safely.</div>
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
