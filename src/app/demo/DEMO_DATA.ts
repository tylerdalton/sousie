import type { Week, MealSlot, ShoppingItem, Recipe, Substitution } from '@/lib/types'

export const DEMO_WEEK: Week = {
  id: 'demo-week-000',
  label: 'Sample Week — May 5',
  start_date: '2025-05-05',
  notes: 'Vegetarian-forward · gluten-free · under $95',
  prep_ahead: [
    'Cook a batch of quinoa — it holds well and covers two meals this week.',
    'Whisk up the tahini-lemon dressing tonight so it just needs a shake before serving.',
  ],
  created_at: '2025-05-01T00:00:00Z',
}

export const DEMO_RECIPES: Recipe[] = [
  {
    id: 'demo-r1',
    slug: null,
    title: 'Lemon-Herb Salmon',
    emoji: '🐟',
    sub: '10 min prep · 15 min cook',
    tags: ['Fish', 'Gluten-Free', 'High Protein'],
    recipe_group: 'dinner',
    sort_order: 1,
    created_at: '2025-01-01T00:00:00Z',
    ingredients: [
      { text: '4 salmon fillets (6 oz each)' },
      { text: '2 lemons, zested and juiced' },
      { text: '3 tbsp fresh dill, chopped' },
      { text: '2 tbsp olive oil' },
      { text: '3 garlic cloves, minced' },
      { text: 'Salt and pepper to taste' },
    ],
    instructions: [
      { text: 'Preheat oven to 400°F. Line a baking sheet with parchment.' },
      { text: 'Mix lemon zest, juice, dill, olive oil, and garlic in a small bowl.' },
      { text: 'Place salmon fillets on the baking sheet. Spoon marinade over each fillet.' },
      { text: 'Bake 12–15 minutes until salmon flakes easily with a fork.' },
      { text: 'Season with salt and pepper. Serve with roasted vegetables.' },
    ],
    dressings: ['Serve with extra lemon wedges', 'Pairs well with steamed rice or quinoa'],
    tips: ['Don\'t overcook — salmon is done when it just begins to flake', 'Skin-on fillets hold together better in the oven'],
    subsections: [],
  },
  {
    id: 'demo-r2',
    slug: null,
    title: 'Black Bean Tacos',
    emoji: '🌮',
    sub: '15 min prep · 10 min cook',
    tags: ['Vegetarian', 'Gluten-Free', 'Budget-Friendly'],
    recipe_group: 'dinner',
    sort_order: 2,
    created_at: '2025-01-01T00:00:00Z',
    ingredients: [
      { text: '2 cans black beans, drained and rinsed' },
      { text: '1 tsp cumin' },
      { text: '1 tsp smoked paprika' },
      { text: '1/2 tsp garlic powder' },
      { text: '8 corn tortillas' },
      { text: '1 avocado, sliced' },
      { text: '1/2 cup salsa' },
      { text: 'Fresh cilantro and lime wedges' },
    ],
    instructions: [
      { text: 'Heat beans in a saucepan with cumin, paprika, garlic powder, and a splash of water.' },
      { text: 'Mash lightly with a fork — you want texture, not a paste.' },
      { text: 'Warm tortillas in a dry skillet, about 30 seconds per side.' },
      { text: 'Assemble: beans, avocado, salsa, and cilantro. Squeeze lime over top.' },
    ],
    dressings: ['Top with a dollop of plain Greek yogurt as a sour cream swap'],
    tips: ['Char the tortillas directly over a gas flame for smoky flavor', 'Add a fried egg on top for extra protein'],
    subsections: [],
  },
  {
    id: 'demo-r3',
    slug: null,
    title: 'Overnight Oats',
    emoji: '🥣',
    sub: '5 min prep · no cook',
    tags: ['Breakfast', 'Vegetarian', 'Meal-Prep'],
    recipe_group: 'breakfast',
    sort_order: 3,
    created_at: '2025-01-01T00:00:00Z',
    ingredients: [
      { text: '1/2 cup rolled oats (use certified GF if needed)' },
      { text: '1/2 cup milk (or oat milk)' },
      { text: '1/4 cup Greek yogurt' },
      { text: '1 tbsp chia seeds' },
      { text: '1 tbsp maple syrup or honey' },
      { text: 'Toppings: berries, banana slices, nut butter' },
    ],
    instructions: [
      { text: 'Combine oats, milk, yogurt, chia seeds, and sweetener in a jar.' },
      { text: 'Stir well, seal, and refrigerate overnight (or at least 4 hours).' },
      { text: 'In the morning, stir again and add your toppings.' },
    ],
    dressings: [],
    tips: ['Make 5 jars on Sunday for a full week of breakfasts', 'Keeps refrigerated for up to 5 days'],
    subsections: [],
  },
  {
    id: 'demo-r4',
    slug: null,
    title: 'Roasted Veggie Bowl',
    emoji: '🥗',
    sub: '15 min prep · 30 min cook',
    tags: ['Vegetarian', 'Vegan', 'Gluten-Free'],
    recipe_group: 'dinner',
    sort_order: 4,
    created_at: '2025-01-01T00:00:00Z',
    ingredients: [
      { text: '2 cups chickpeas, drained (or 1 can)' },
      { text: '2 sweet potatoes, cubed' },
      { text: '1 red bell pepper, sliced' },
      { text: '1 zucchini, sliced' },
      { text: '3 tbsp olive oil' },
      { text: '1 tsp cumin, 1 tsp smoked paprika' },
      { text: '2 cups cooked quinoa' },
      { text: 'Tahini dressing to serve' },
    ],
    instructions: [
      { text: 'Preheat oven to 425°F. Toss chickpeas and sweet potato with 2 tbsp oil and spices.' },
      { text: 'Spread on one baking sheet; toss pepper and zucchini with remaining oil on another.' },
      { text: 'Roast 25–30 min, flipping once, until edges are caramelized.' },
      { text: 'Serve over quinoa and drizzle with tahini dressing.' },
    ],
    dressings: ['Tahini dressing: 2 tbsp tahini + 1 lemon juiced + 1 tbsp water + 1 garlic clove, blended'],
    tips: ['Pat chickpeas very dry before roasting for maximum crispiness', 'Swap any vegetables you have on hand'],
    subsections: [],
  },
]

// 7 days × 3 meals = 21 slots
export const DEMO_SLOTS: (MealSlot & { recipe: Recipe | null })[] = [
  // Monday (0)
  { id: 'ds-0-b', week_id: 'demo-week-000', day_index: 0, meal_type: 'breakfast', recipe_id: 'demo-r3', free_text: null, recipe: DEMO_RECIPES[2] },
  { id: 'ds-0-l', week_id: 'demo-week-000', day_index: 0, meal_type: 'lunch', recipe_id: null, free_text: 'Leftovers / Salad', recipe: null },
  { id: 'ds-0-d', week_id: 'demo-week-000', day_index: 0, meal_type: 'dinner', recipe_id: 'demo-r1', free_text: null, recipe: DEMO_RECIPES[0] },
  // Tuesday (1)
  { id: 'ds-1-b', week_id: 'demo-week-000', day_index: 1, meal_type: 'breakfast', recipe_id: 'demo-r3', free_text: null, recipe: DEMO_RECIPES[2] },
  { id: 'ds-1-l', week_id: 'demo-week-000', day_index: 1, meal_type: 'lunch', recipe_id: 'demo-r2', free_text: null, recipe: DEMO_RECIPES[1] },
  { id: 'ds-1-d', week_id: 'demo-week-000', day_index: 1, meal_type: 'dinner', recipe_id: 'demo-r4', free_text: null, recipe: DEMO_RECIPES[3] },
  // Wednesday (2)
  { id: 'ds-2-b', week_id: 'demo-week-000', day_index: 2, meal_type: 'breakfast', recipe_id: 'demo-r3', free_text: null, recipe: DEMO_RECIPES[2] },
  { id: 'ds-2-l', week_id: 'demo-week-000', day_index: 2, meal_type: 'lunch', recipe_id: null, free_text: 'Veggie wrap', recipe: null },
  { id: 'ds-2-d', week_id: 'demo-week-000', day_index: 2, meal_type: 'dinner', recipe_id: 'demo-r2', free_text: null, recipe: DEMO_RECIPES[1] },
  // Thursday (3)
  { id: 'ds-3-b', week_id: 'demo-week-000', day_index: 3, meal_type: 'breakfast', recipe_id: 'demo-r3', free_text: null, recipe: DEMO_RECIPES[2] },
  { id: 'ds-3-l', week_id: 'demo-week-000', day_index: 3, meal_type: 'lunch', recipe_id: 'demo-r4', free_text: null, recipe: DEMO_RECIPES[3] },
  { id: 'ds-3-d', week_id: 'demo-week-000', day_index: 3, meal_type: 'dinner', recipe_id: 'demo-r1', free_text: null, recipe: DEMO_RECIPES[0] },
  // Friday (4)
  { id: 'ds-4-b', week_id: 'demo-week-000', day_index: 4, meal_type: 'breakfast', recipe_id: null, free_text: 'Smoothie bowl', recipe: null },
  { id: 'ds-4-l', week_id: 'demo-week-000', day_index: 4, meal_type: 'lunch', recipe_id: 'demo-r2', free_text: null, recipe: DEMO_RECIPES[1] },
  { id: 'ds-4-d', week_id: 'demo-week-000', day_index: 4, meal_type: 'dinner', recipe_id: 'demo-r4', free_text: null, recipe: DEMO_RECIPES[3] },
  // Saturday (5)
  { id: 'ds-5-b', week_id: 'demo-week-000', day_index: 5, meal_type: 'breakfast', recipe_id: null, free_text: 'Weekend brunch — eggs & toast', recipe: null },
  { id: 'ds-5-l', week_id: 'demo-week-000', day_index: 5, meal_type: 'lunch', recipe_id: 'demo-r1', free_text: null, recipe: DEMO_RECIPES[0] },
  { id: 'ds-5-d', week_id: 'demo-week-000', day_index: 5, meal_type: 'dinner', recipe_id: 'demo-r2', free_text: null, recipe: DEMO_RECIPES[1] },
  // Sunday (6)
  { id: 'ds-6-b', week_id: 'demo-week-000', day_index: 6, meal_type: 'breakfast', recipe_id: 'demo-r3', free_text: null, recipe: DEMO_RECIPES[2] },
  { id: 'ds-6-l', week_id: 'demo-week-000', day_index: 6, meal_type: 'lunch', recipe_id: 'demo-r4', free_text: null, recipe: DEMO_RECIPES[3] },
  { id: 'ds-6-d', week_id: 'demo-week-000', day_index: 6, meal_type: 'dinner', recipe_id: 'demo-r1', free_text: null, recipe: DEMO_RECIPES[0] },
]

export const DEMO_ITEMS: ShoppingItem[] = [
  // Produce
  { id: 'di-1', week_id: 'demo-week-000', category: 'produce', name: 'Lemons', qty: '4', cost: 2.50, note: null, source: 'ai', checked: false, sort_order: 1, created_at: '2025-01-01T00:00:00Z' },
  { id: 'di-2', week_id: 'demo-week-000', category: 'produce', name: 'Avocados', qty: '3', cost: 4.50, note: null, source: 'ai', checked: false, sort_order: 2, created_at: '2025-01-01T00:00:00Z' },
  { id: 'di-3', week_id: 'demo-week-000', category: 'produce', name: 'Sweet potatoes', qty: '2 large', cost: 3.00, note: null, source: 'ai', checked: false, sort_order: 3, created_at: '2025-01-01T00:00:00Z' },
  { id: 'di-4', week_id: 'demo-week-000', category: 'produce', name: 'Red bell pepper', qty: '2', cost: 3.50, note: null, source: 'ai', checked: false, sort_order: 4, created_at: '2025-01-01T00:00:00Z' },
  { id: 'di-5', week_id: 'demo-week-000', category: 'produce', name: 'Zucchini', qty: '2 medium', cost: 2.00, note: null, source: 'ai', checked: false, sort_order: 5, created_at: '2025-01-01T00:00:00Z' },
  { id: 'di-6', week_id: 'demo-week-000', category: 'produce', name: 'Mixed berries', qty: '1 lb bag', cost: 5.99, note: 'for overnight oats toppings', source: 'ai', checked: false, sort_order: 6, created_at: '2025-01-01T00:00:00Z' },
  { id: 'di-7', week_id: 'demo-week-000', category: 'produce', name: 'Fresh dill', qty: '1 bunch', cost: 1.99, note: null, source: 'ai', checked: false, sort_order: 7, created_at: '2025-01-01T00:00:00Z' },
  { id: 'di-8', week_id: 'demo-week-000', category: 'produce', name: 'Fresh cilantro', qty: '1 bunch', cost: 0.99, note: null, source: 'ai', checked: false, sort_order: 8, created_at: '2025-01-01T00:00:00Z' },
  // Protein
  { id: 'di-9', week_id: 'demo-week-000', category: 'protein', name: 'Salmon fillets', qty: '1.5 lbs (4 pieces)', cost: 18.00, note: 'wild-caught if possible', source: 'ai', checked: false, sort_order: 1, created_at: '2025-01-01T00:00:00Z' },
  { id: 'di-10', week_id: 'demo-week-000', category: 'protein', name: 'Black beans, canned', qty: '3 cans', cost: 3.00, note: null, source: 'ai', checked: false, sort_order: 2, created_at: '2025-01-01T00:00:00Z' },
  { id: 'di-11', week_id: 'demo-week-000', category: 'protein', name: 'Chickpeas, canned', qty: '2 cans', cost: 2.00, note: null, source: 'ai', checked: false, sort_order: 3, created_at: '2025-01-01T00:00:00Z' },
  { id: 'di-12', week_id: 'demo-week-000', category: 'protein', name: 'Greek yogurt', qty: '32 oz', cost: 6.99, note: null, source: 'ai', checked: false, sort_order: 4, created_at: '2025-01-01T00:00:00Z' },
  // Pantry
  { id: 'di-13', week_id: 'demo-week-000', category: 'pantry', name: 'Rolled oats (GF certified)', qty: '18 oz canister', cost: 4.99, note: null, source: 'ai', checked: false, sort_order: 1, created_at: '2025-01-01T00:00:00Z' },
  { id: 'di-14', week_id: 'demo-week-000', category: 'pantry', name: 'Quinoa', qty: '1 lb', cost: 5.49, note: null, source: 'ai', checked: false, sort_order: 2, created_at: '2025-01-01T00:00:00Z' },
  { id: 'di-15', week_id: 'demo-week-000', category: 'pantry', name: 'Corn tortillas', qty: '30 count', cost: 3.50, note: 'certified GF', source: 'ai', checked: false, sort_order: 3, created_at: '2025-01-01T00:00:00Z' },
  { id: 'di-16', week_id: 'demo-week-000', category: 'pantry', name: 'Tahini', qty: '1 jar', cost: 6.99, note: null, source: 'ai', checked: false, sort_order: 4, created_at: '2025-01-01T00:00:00Z' },
  { id: 'di-17', week_id: 'demo-week-000', category: 'pantry', name: 'Chia seeds', qty: '8 oz bag', cost: 4.99, note: null, source: 'ai', checked: false, sort_order: 5, created_at: '2025-01-01T00:00:00Z' },
  { id: 'di-18', week_id: 'demo-week-000', category: 'pantry', name: 'Olive oil', qty: '1 bottle', cost: 7.99, note: 'check if you have this already', source: 'ai', checked: true, sort_order: 6, created_at: '2025-01-01T00:00:00Z' },
  { id: 'di-19', week_id: 'demo-week-000', category: 'pantry', name: 'Salsa', qty: '16 oz jar', cost: 3.99, note: null, source: 'ai', checked: false, sort_order: 7, created_at: '2025-01-01T00:00:00Z' },
  // Spices
  { id: 'di-20', week_id: 'demo-week-000', category: 'spices', name: 'Smoked paprika', qty: '2 oz', cost: 2.49, note: null, source: 'ai', checked: false, sort_order: 1, created_at: '2025-01-01T00:00:00Z' },
  { id: 'di-21', week_id: 'demo-week-000', category: 'spices', name: 'Ground cumin', qty: '2 oz', cost: 2.49, note: null, source: 'ai', checked: true, sort_order: 2, created_at: '2025-01-01T00:00:00Z' },
  { id: 'di-22', week_id: 'demo-week-000', category: 'spices', name: 'Garlic powder', qty: '2 oz', cost: 2.29, note: null, source: 'ai', checked: true, sort_order: 3, created_at: '2025-01-01T00:00:00Z' },
]

export const DEMO_SUBSTITUTIONS: Substitution[] = [
  {
    id: 'dsub-1',
    group_label: 'Grains',
    ingredient: 'Rolled oats',
    tag: 'Gluten-Free',
    sort_order: 1,
    subs: [
      { name: 'Certified GF oats', detail: 'Identical flavor — just check the label', verdict: 'great' },
      { name: 'Quinoa flakes', detail: 'Slightly nuttier, same overnight prep method', verdict: 'good' },
      { name: 'Rice flakes', detail: 'Thinner texture, less protein', verdict: 'ok' },
    ],
  },
  {
    id: 'dsub-2',
    group_label: 'Protein',
    ingredient: 'Salmon',
    tag: 'Fish',
    sort_order: 2,
    subs: [
      { name: 'Trout', detail: 'Almost identical — same cook time', verdict: 'great' },
      { name: 'Cod or halibut', detail: 'Milder flavor, reduce cook time by 2–3 min', verdict: 'good' },
      { name: 'Firm tofu (pressed)', detail: 'Vegan option — marinate 30 min first', verdict: 'ok' },
    ],
  },
  {
    id: 'dsub-3',
    group_label: 'Dairy',
    ingredient: 'Greek yogurt',
    tag: 'Dairy',
    sort_order: 3,
    subs: [
      { name: 'Coconut yogurt', detail: 'Dairy-free, slight coconut flavor', verdict: 'great' },
      { name: 'Silken tofu (blended)', detail: 'Neutral flavor, same creamy texture', verdict: 'good' },
      { name: 'Cashew cream', detail: 'Rich and thick — soak cashews overnight', verdict: 'good' },
    ],
  },
]
