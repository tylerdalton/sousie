import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// No auth needed at all
const PUBLIC_PATHS = ['/', '/login', '/register', '/api/stripe/webhook']
const PUBLIC_PREFIXES = ['/dietary-counsel', '/api/stripe/webhook', '/auth/callback']

// Auth required but no subscription needed
const SUBSCRIPTION_FREE_PREFIXES = ['/demo', '/subscribe', '/account']

// Requires admin role
const ADMIN_PREFIXES = ['/admin']

function isPublicPath(pathname: string): boolean {
  if (PUBLIC_PATHS.includes(pathname)) return true
  return PUBLIC_PREFIXES.some(p => pathname.startsWith(p))
}

function isSubscriptionFree(pathname: string): boolean {
  return SUBSCRIPTION_FREE_PREFIXES.some(p => pathname.startsWith(p))
}

function isAdminPath(pathname: string): boolean {
  return ADMIN_PREFIXES.some(p => pathname.startsWith(p))
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (isPublicPath(pathname)) {
    return NextResponse.next({ request })
  }

  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Fetch profile once — used for both admin and subscription checks
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, subscription_status')
    .eq('user_id', user.id)
    .single()

  const isAdmin = profile?.role === 'admin'
  const isSubscribed =
    profile?.subscription_status === 'active' ||
    profile?.subscription_status === 'trialing'

  // Admin-only routes
  if (isAdminPath(pathname)) {
    if (!isAdmin) {
      const url = request.nextUrl.clone()
      url.pathname = '/weeks'
      return NextResponse.redirect(url)
    }
    return supabaseResponse
  }

  // Routes that don't need a paid subscription
  if (isSubscriptionFree(pathname)) {
    return supabaseResponse
  }

  // All remaining routes require an active subscription (admins are always exempt)
  if (!isSubscribed && !isAdmin) {
    const url = request.nextUrl.clone()
    url.pathname = '/subscribe'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icons|manifest.json|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
