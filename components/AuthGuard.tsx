'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'

// Routes that require an active session.
const PROTECTED_PREFIXES = ['/feed', '/profile']

// Routes where a logged-in user should be bounced to /feed.
const AUTH_ONLY_PAGES = ['/', '/login', '/signup']

function isProtected(p: string): boolean {
  return PROTECTED_PREFIXES.some(
    prefix => p === prefix || p.startsWith(prefix + '/')
  )
}

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // PUBLIC pages (e.g. /tools, /explore, /channels …) need zero auth logic.
    // Return immediately so we never touch Supabase and never redirect.
    const needsAuthLogic = isProtected(pathname) || AUTH_ONLY_PAGES.includes(pathname)
    if (!needsAuthLogic) return

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        // Logged-in users should leave auth/landing pages.
        if (AUTH_ONLY_PAGES.includes(pathname)) {
          router.replace('/feed')
        }
      } else {
        // Unauthenticated users must not access protected pages.
        if (isProtected(pathname)) {
          router.replace('/login')
        }
      }
    })

    // While sitting on a protected page, listen for explicit sign-out.
    if (!isProtected(pathname)) return
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        router.replace('/login')
      }
    })
    return () => subscription.unsubscribe()
  }, [pathname, router])

  return <>{children}</>
}
