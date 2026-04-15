import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Only these paths require authentication.
const PROTECTED_PREFIXES = ['/feed', '/profile']
// These pages should redirect logged-in users to /feed.
const AUTH_ONLY_PAGES = ['/', '/login', '/signup']

function isProtected(pathname: string): boolean {
  return PROTECTED_PREFIXES.some(
    p => pathname === p || pathname.startsWith(p + '/')
  )
}

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh the session cookie on every request.
  const { data: { user } } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  // Protected pages: require authentication.
  if (!user && isProtected(pathname)) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Auth/landing pages: logged-in users should go to /feed.
  if (user && AUTH_ONLY_PAGES.includes(pathname)) {
    return NextResponse.redirect(new URL('/feed', request.url))
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
