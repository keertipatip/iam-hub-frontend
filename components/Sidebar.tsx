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
    label: '// discover',
    items: [
      { page: 'feed', href: '/feed', icon: '▦', label: 'Feed' },
      { page: 'explore', href: '/explore', icon: '◎', label: 'Explore' },
      { page: 'articles', href: '/articles', icon: '≡', label: 'Articles', badge: '12', badgeClass: '' },
      { page: 'artifacts', href: '/artifacts', icon: '⬢', label: 'Artifacts' },
    ],
  },
  {
    label: '// community',
    items: [
      { page: 'channels', href: '/channels', icon: '#', label: 'Channels', badge: '3', badgeClass: 'red' },
      { page: 'events', href: '/events', icon: '◈', label: 'Events', badge: '2', badgeClass: 'em' },
      { page: 'mentorship', href: '/mentorship', icon: '△', label: 'Mentorship' },
    ],
  },
  {
    label: '// dev tools',
    items: [
      { page: 'ide', href: '/ide', icon: '▷', label: 'Playground' },
      { page: 'canvas', href: '/canvas', icon: '◻', label: 'Flow Canvas' },
      { page: 'simulator', href: '/simulator', icon: '⬡', label: 'Simulations' },
      { page: 'tools', href: '/tools', icon: '⚒', label: 'Tools' },
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

  const btnBase: React.CSSProperties = {
    display: 'block', background: 'none', border: '1px solid var(--border)',
    fontFamily: 'var(--mono)', fontSize: 10, padding: '5px 10px', cursor: 'pointer',
    marginTop: 8, width: '100%',
    clipPath: 'polygon(0 0,calc(100% - 6px) 0,100% 6px,100% 100%,0 100%)',
    transition: 'all 0.15s', textAlign: 'center' as const,
  }

  return (
    <aside className="sidebar" id="sidebar">
      <div className="sidebar-head">
        <div className="logo-row">
          <div className="logo-shield">
            <svg viewBox="0 0 16 16" fill="none">
              <path d="M8 1L14 4V9C14 12 11 14.5 8 15.5C5 14.5 2 12 2 9V4L8 1Z" stroke="#00ff88" strokeWidth="1.2" fill="none"/>
              <path d="M5.5 8L7 9.5L10.5 6" stroke="#00ff88" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="logo-wordmark">IAMHUB</div>
        </div>
        <div className="logo-sub">Identity &amp; Access Management</div>
        <div className="sys-status">
          <div className="dot"></div>SYS_OPERATIONAL // v3.1.4
        </div>
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
                <div className="u-role">{user.role}</div>
              </div>
            </Link>
            <button
              type="button"
              onClick={async () => { await supabase.auth.signOut(); router.replace('/login') }}
              title="Sign out"
              style={{ ...btnBase, color: 'var(--text3)' }}
              onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--red-dim)'; e.currentTarget.style.color = 'var(--red)' }}
              onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text3)' }}
            >
              ⏻ SIGN OUT
            </button>
          </>
        ) : (
          <>
            <div className="user-block" style={{ cursor: 'default', opacity: 0.5 }}>
              <div className="user-hex" style={{ fontSize: 10 }}>?</div>
              <div>
                <div className="u-name">Guest</div>
                <div className="u-role">NOT_SIGNED_IN</div>
              </div>
            </div>
            <Link
              href="/login"
              style={{
                ...btnBase,
                color: 'var(--em)',
                borderColor: 'var(--em-dim)',
                textDecoration: 'none',
                display: 'block',
                textAlign: 'center',
              }}
            >
              → SIGN IN
            </Link>
            <Link
              href="/signup"
              style={{
                ...btnBase,
                color: 'var(--text3)',
                textDecoration: 'none',
                display: 'block',
                textAlign: 'center',
                marginTop: 4,
              }}
            >
              + SIGN UP
            </Link>
          </>
        )}
      </div>
    </aside>
  )
}
