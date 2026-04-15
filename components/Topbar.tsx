'use client'

import { usePathname } from 'next/navigation'
import { useToast } from './ToastProvider'

const breadcrumbMap: Record<string, string> = {
  feed: 'FEED',
  explore: 'EXPLORE',
  articles: 'ARTICLES',
  artifacts: 'ARTIFACTS',
  channels: 'CHANNELS',
  events: 'EVENTS',
  mentorship: 'MENTORSHIP',
  ide: 'PLAYGROUND',
  canvas: 'FLOW_CANVAS',
  simulator: 'AUTH_SIMULATOR',
  profile: 'PROFILE',
  tools: 'IAM_TOOLS',
}

function useBreadcrumb(): string {
  const pathname = usePathname()
  const segment = pathname.replace(/^\//, '').split('/')[0]
  return breadcrumbMap[segment] ?? segment.toUpperCase()
}

function toggleTheme() {
  const html = document.documentElement
  const isLight = html.getAttribute('data-theme') === 'light'
  if (isLight) {
    html.removeAttribute('data-theme')
    try { localStorage.setItem('iamhub-theme', 'dark') } catch (_) {}
  } else {
    html.setAttribute('data-theme', 'light')
    try { localStorage.setItem('iamhub-theme', 'light') } catch (_) {}
  }
  // update button text via DOM since it's a plain button
  const btn = document.getElementById('theme-toggle')
  if (btn) btn.textContent = isLight ? '☀' : '🌙'
}

export function Topbar() {
  const bc = useBreadcrumb()
  const { toast } = useToast()

  return (
    <header className="topbar">
      <div className="breadcrumb">
        IAMHUB <span style={{ opacity: 0.3, margin: '0 4px' }}>/</span>
        <span className="bc-active" id="bc">{bc}</span>
      </div>
      <div className="topbar-divider"></div>
      <div className="threat-meter">
        THREAT_LEVEL
        <div className="threat-bars">
          <div className="threat-bar active"></div>
          <div className="threat-bar active"></div>
          <div className="threat-bar active amber"></div>
          <div className="threat-bar"></div>
          <div className="threat-bar"></div>
        </div>
        <span>MED</span>
      </div>
      <div className="search-wrap">
        <span className="search-prefix">$&gt;</span>
        <input type="text" placeholder="search nodes, protocols, artifacts..." />
        <span className="search-kbd">⌘K</span>
      </div>
      <div className="topbar-right">
        <div className="ico-btn alert">⚑</div>
        <button
          className="theme-toggle"
          id="theme-toggle"
          onClick={toggleTheme}
          title="Toggle light/dark theme"
        >
          ☀
        </button>
        <div className="ico-btn">⚙</div>
        <button
          className="btn-sec btn-em"
          onClick={() => toast('POST_PUBLISHED // queued for review')}
        >
          + POST
        </button>
      </div>
    </header>
  )
}
