'use client'

import { useEffect } from 'react'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    try {
      const saved = localStorage.getItem('iamhub-theme')
      if (saved === 'light') {
        document.documentElement.setAttribute('data-theme', 'light')
      } else {
        document.documentElement.removeAttribute('data-theme')
      }
      const btn = document.getElementById('theme-toggle')
      if (btn) btn.textContent = saved === 'light' ? '🌙' : '☀'
    } catch (_) {}
  }, [])

  return <>{children}</>
}
