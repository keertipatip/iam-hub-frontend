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


export function Topbar() {
  const bc = useBreadcrumb()
  const { toast } = useToast()

  function openMobileSidebar() {
    ;(window as unknown as Record<string, unknown> & { toggleMobileSidebar?: () => void })
      .toggleMobileSidebar?.()
  }

  return (
    <header className="topbar">
      {/* Hamburger — visible only on mobile via CSS */}
      <button
        className="mobile-menu-btn"
        onClick={openMobileSidebar}
        aria-label="Open navigation"
      >
        ☰
      </button>
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
