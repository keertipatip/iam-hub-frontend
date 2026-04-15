'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Sidebar } from '@/components/Sidebar'
import { Topbar } from '@/components/Topbar'

export function ConditionalAppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAuthPage = pathname === '/login' || pathname === '/signup' || pathname === '/'
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    // Expose toggle to Topbar hamburger button via a stable window function
    ;(window as unknown as Record<string, unknown>).toggleMobileSidebar = () =>
      setSidebarOpen(v => !v)
    return () => {
      delete (window as unknown as Record<string, unknown>).toggleMobileSidebar
    }
  }, [])

  // Close sidebar on route change
  useEffect(() => { setSidebarOpen(false) }, [pathname])

  if (isAuthPage) {
    return (
      <>
        <div className="glow-orb" />
        <div className="glow-orb2" />
        {children}
      </>
    )
  }

  return (
    <>
      <div className="glow-orb" />
      <div className="glow-orb2" />
      <div className={`app${sidebarOpen ? ' sidebar-mobile-open' : ''}`}>
        {/* Backdrop — tapping it closes the sidebar on mobile */}
        <div
          className="sidebar-backdrop"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
        <Sidebar />
        <div className="main-area">
          <Topbar />
          <div className="page-container" id="page-container">
            {children}
          </div>
        </div>
      </div>
    </>
  )
}
