import type { Metadata } from 'next'
import './globals.css'
import { Sidebar } from '@/components/Sidebar'
import { Topbar } from '@/components/Topbar'
import { ToastProvider } from '@/components/ToastProvider'
import { ThemeProvider } from '@/components/ThemeProvider'
import { AuthGuard } from '@/components/AuthGuard'
import { ConditionalAppShell } from '@/components/ConditionalAppShell'

export const metadata: Metadata = {
  title: 'IAMHUB // Identity Access Management Platform',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" id="html-root">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500;600&family=IBM+Plex+Sans:wght@300;400;500;600;700&family=Bebas+Neue&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ThemeProvider>
          <ToastProvider>
            <AuthGuard>
              <ConditionalAppShell>{children}</ConditionalAppShell>
            </AuthGuard>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
