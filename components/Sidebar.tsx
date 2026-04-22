'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

type UserProfile = {
  initials: string
  name: string
  role: string
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(w => w[0] ?? '')
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

type AuthState = { user: UserProfile; loggedIn: boolean }

function useAuthState(): AuthState {
  const [state, setState] = useState<AuthState>({
    user: { initials: '??', name: 'Operator', role: 'IAM_USER' },
    loggedIn: false,
  })

  useEffect(() => {
    function applySession(session: import('@supabase/supabase-js').Session | null) {
      if (!session?.user) {
        setState({ user: { initials: '??', name: 'Guest', role: 'NOT_SIGNED_IN' }, loggedIn: false })
        return
      }
      const meta = session.user.user_metadata ?? {}
      const fullName: string = meta.full_name || meta.name || session.user.email?.split('@')[0] || 'Operator'
      const specialty: string = meta.specialty || 'IAM_USER'
      setState({
        user: {
          initials: getInitials(fullName),
          name: fullName,
          role: specialty.toUpperCase().replace(/\s+\/?\s*/g, '_').replace(/\s+/g, '_'),
        },
        loggedIn: true,
      })
    }

    supabase.auth.getSession().then(({ data: { session } }) => applySession(session))

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      applySession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  return state
}

const navGroups = [
  {
    label: 'Discover',
    items: [
      { page: 'feed',      href: '/feed',      icon: '⊞', label: 'Feed' },
      { page: 'explore',   href: '/explore',   icon: '⊙', label: 'Explore' },
      { page: 'articles',  href: '/articles',  icon: '≡',  label: 'Articles',  badge: '12', badgeClass: '' },
      { page: 'artifacts', href: '/artifacts', icon: '◈',  label: 'Artifacts' },
    ],
  },
  {
    label: 'Community',
    items: [
      { page: 'channels',   href: '/channels',   icon: '#',  label: 'Channels',   badge: '3', badgeClass: 'red' },
      { page: 'events',     href: '/events',     icon: '◷',  label: 'Events',     badge: '2', badgeClass: 'em' },
      { page: 'mentorship', href: '/mentorship', icon: '△',  label: 'Mentorship' },
    ],
  },
  {
    label: 'Dev Tools',
    items: [
      { page: 'ide',       href: '/ide',       icon: '▷', label: 'Playground' },
      { page: 'canvas',    href: '/canvas',    icon: '□',  label: 'Flow Canvas' },
      { page: 'simulator', href: '/simulator', icon: '⬡',  label: 'Simulations' },
      { page: 'tools',     href: '/tools',     icon: '⚙',  label: 'Tools' },
    ],
  },
]

function pageFromPathname(pathname: string): string {
  return pathname.replace(/^\//, '').split('/')[0] || ''
}

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const activePage = pageFromPathname(pathname)
  const { user, loggedIn } = useAuthState()

  return (
    <aside className="sidebar" id="sidebar">
      <div className="sidebar-head">
        <div className="logo-row">
          <div className="logo-mark">
            <svg viewBox="0 0 16 16" fill="none" width="16" height="16">
              <path d="M8 1.5L13.5 4.5V10C13.5 12.5 11 14.5 8 15C5 14.5 2.5 12.5 2.5 10V4.5L8 1.5Z" fill="white"/>
              <path d="M5.5 8L7 9.5L10.5 6" stroke="#111" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="logo-wordmark">IAMHUB</div>
        </div>
        <div className="logo-sub">Identity &amp; Access Management</div>
      </div>

      {navGroups.map(group => (
        <div className="nav-group" key={group.label}>
          <div className="nav-group-label">{group.label}</div>
          {group.items.map(item => (
            <Link
              key={item.page}
              href={item.href}
              className={`nav-item${activePage === item.page ? ' active' : ''}`}
              data-page={item.page}
            >
              <span className="nav-ico">{item.icon}</span>
              {item.label}
              {item.badge && (
                <span className={`nav-badge${item.badgeClass ? ' ' + item.badgeClass : ''}`}>
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </div>
      ))}

      <div className="sidebar-foot">
        {loggedIn ? (
          <>
            <Link href="/profile" className={`user-block${activePage === 'profile' ? ' active' : ''}`} data-page="profile">
              <div className="user-hex">{user.initials}</div>
              <div>
                <div className="u-name">{user.name}</div>
                <div className="u-role" style={{ fontSize: 11, color: 'var(--text-3)' }}>{user.role}</div>
              </div>
            </Link>
            <button
              type="button"
              onClick={async () => { await supabase.auth.signOut(); router.replace('/login') }}
              style={{
                width: '100%', padding: '7px 12px',
                background: 'none', border: '1px solid var(--border)',
                borderRadius: 'var(--r-md)',
                fontFamily: 'var(--sans)', fontSize: 13, color: 'var(--text-3)',
                cursor: 'pointer', transition: 'all .15s', textAlign: 'center' as const,
              }}
              onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--red-soft)'; e.currentTarget.style.color = 'var(--red)'; e.currentTarget.style.background = 'var(--red-soft)' }}
              onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-3)'; e.currentTarget.style.background = 'none' }}
            >
              Sign out
            </button>
          </>
        ) : (
          <>
            <div className="user-block" style={{ cursor: 'default', opacity: 0.45 }}>
              <div className="user-hex" style={{ fontSize: 10 }}>?</div>
              <div>
                <div className="u-name">Guest</div>
                <div className="u-role">Not signed in</div>
              </div>
            </div>
            <Link
              href="/login"
              style={{
                display: 'block', textAlign: 'center', padding: '8px 12px',
                background: 'var(--text)', color: 'var(--bg)',
                borderRadius: 'var(--r-md)', fontFamily: 'var(--sans)',
                fontSize: 13, fontWeight: 500, textDecoration: 'none', transition: 'opacity .15s',
              }}
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              style={{
                display: 'block', textAlign: 'center', padding: '7px 12px',
                background: 'none', border: '1px solid var(--border)',
                color: 'var(--text-2)', borderRadius: 'var(--r-md)',
                fontFamily: 'var(--sans)', fontSize: 13, fontWeight: 400,
                textDecoration: 'none', transition: 'all .15s',
              }}
            >
              Create account
            </Link>
          </>
        )}
      </div>
    </aside>
  )
}
