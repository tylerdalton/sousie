export type RecipeGroup = 'dinner' | 'breakfast' | 'dressing'
export type MealType = 'breakfast' | 'lunch' | 'dinner'
export type ShoppingCategory = 'produce' | 'protein' | 'pantry' | 'spices'
export type Verdict = 'great' | 'good' | 'ok'

export interface Ingredient {
  text: string
}

export interface Instruction {
  text: string
}

export interface Subsection {
  title: string
  items: string[]
}

export interface Sub {
  name: string
  detail: string
  verdict: Verdict
}

export interface Recipe {
  id: string
  slug: string | null
  title: string
  emoji: string
  sub: string | null
  tags: string[]
  ingredients: Ingredient[]
  instructions: Instruction[]
  dressings: string[]
  tips: string[]
  subsections: Subsection[]
  recipe_group: RecipeGroup | null
  sort_order: number
  created_at: string
}

export interface Week {
  id: string
  label: string
  start_date: string | null
  notes: string | null
  created_at: string
}

export interface MealSlot {
  id: string
  week_id: string
  day_index: number
  meal_type: MealType
  recipe_id: string | null
  free_text: string | null
  recipe?: Recipe | null
}

export interface ShoppingItem {
  id: string
  week_id: string
  category: ShoppingCategory
  name: string
  qty: string | null
  cost: number
  note: string | null
  source: string
  checked: boolean
  sort_order: number
  created_at: string
}

export interface Substitution {
  id: string
  group_label: string
  ingredient: string
  tag: string | null
  subs: Sub[]
  sort_order: number
}

// Grouped shopping items for display
export const CATEGORY_LABELS: Record<ShoppingCategory, string> = {
  produce: '🥦 Produce',
  protein: '🐟 Fish & Light Protein',
  pantry: '🌾 Grains & Pantry',
  spices: '🧂 Spices',
}

export const CATEGORY_ORDER: ShoppingCategory[] = ['produce', 'protein', 'pantry', 'spices']

export const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
export const DAY_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export const RECIPE_GROUP_LABELS: Record<RecipeGroup, string> = {
  dinner: '🌙 Dinners',
  breakfast: '🌅 Breakfasts',
  dressing: '🧴 Dressings',
}

// ── Subscription / Billing ─────────────────────────────────
export type SubscriptionStatus = 'active' | 'trialing' | 'past_due' | 'canceled' | 'none'
export type UserRole = 'admin' | 'user'

export interface Profile {
  id: string
  user_id: string
  role: UserRole
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  subscription_status: SubscriptionStatus
  subscription_period_end: string | null
  created_at: string
}

export interface PricingConfig {
  id: string
  monthly_price_cents: number
  annual_price_cents: number
  stripe_monthly_price_id: string | null
  stripe_annual_price_id: string | null
  coupon_description: string
  updated_at: string
}

export interface Coupon {
  id: string
  code: string
  stripe_coupon_id: string | null
  stripe_promo_code_id: string | null
  description: string | null
  discount_display: string
  active: boolean
  created_at: string
}
