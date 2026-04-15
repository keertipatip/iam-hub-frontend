'use client'

import { usePathname } from 'next/navigation'
import { Sidebar } from '@/components/Sidebar'
import { Topbar } from '@/components/Topbar'

export function ConditionalAppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAuthPage = pathname === '/login' || pathname === '/signup' || pathname === '/'

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
      <div className="app">
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
