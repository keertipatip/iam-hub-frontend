'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

const FEATURES = [
  { icon: '▦', label: 'Feed', desc: 'Community posts, articles, Q&A and announcements from IAM practitioners.' },
  { icon: '◎', label: 'Explore', desc: 'Browse topics, roadmaps, and learning paths across IAM domains.' },
  { icon: '⚒', label: 'Tools', desc: '34 free client-side tools — JWT decoder, PKCE, SAML, HMAC, OTP and more.' },
  { icon: '▷', label: 'Playground', desc: 'Interactive policy IDE for testing RBAC, ABAC and XACML rules.' },
  { icon: '◻', label: 'Flow Canvas', desc: 'Visual canvas for designing authentication and authorization flows.' },
  { icon: '⬡', label: 'Simulations', desc: 'Run attack simulations and verify your defenses.' },
]

const STATS = [
  { val: '34', label: 'IAM tools', color: 'var(--em)' },
  { val: '100%', label: 'client-side', color: 'var(--em)' },
  { val: '0', label: 'data sent', color: 'var(--blue)' },
  { val: 'free', label: 'forever', color: 'var(--amber)' },
]

export default function HomePage() {
  const router = useRouter()

  // Redirect already-authenticated users straight to the feed
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.replace('/feed')
    })
  }, [router])

  return (
    <div style={{ minHeight: '100dvh', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>

      {/* ── Hero ── */}
      <section style={{ padding: 'clamp(32px,6vw,72px) clamp(20px,5vw,48px) clamp(28px,4vw,48px)', maxWidth: 900, margin: '0 auto', width: '100%' }}>
        <div style={{
          fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: 3,
          color: 'var(--em)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span style={{ color: 'var(--em)' }}>●</span> IAMHUB // IDENTITY &amp; ACCESS MANAGEMENT
        </div>

        <h1 style={{
          fontFamily: 'var(--mono)', fontSize: 'clamp(26px,5vw,42px)', fontWeight: 600,
          color: 'var(--text)', lineHeight: 1.15, margin: '0 0 16px',
          letterSpacing: -1,
        }}>
          The platform for<br />
          <span style={{ color: 'var(--em)' }}>IAM professionals</span>
        </h1>

        <p style={{
          fontFamily: 'var(--mono)', fontSize: 13, color: 'var(--text2)',
          lineHeight: 1.8, maxWidth: 560, margin: '0 0 36px',
        }}>
          Community, tools, and learning resources for identity &amp; access management engineers.
          All tools run entirely in your browser — no data leaves your machine.
        </p>

        <div className="landing-cta-row" style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link
            href="/signup"
            style={{
              fontFamily: 'var(--mono)', fontSize: 12, fontWeight: 600,
              background: 'var(--em)', color: '#000', padding: '11px 28px',
              textDecoration: 'none', letterSpacing: 1,
              clipPath: 'polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,0 100%)',
              transition: 'opacity .15s', display: 'inline-block',
            }}
          >
            GET STARTED FREE →
          </Link>
          <Link
            href="/tools"
            style={{
              fontFamily: 'var(--mono)', fontSize: 12,
              background: 'none', color: 'var(--text)', padding: '11px 28px',
              textDecoration: 'none', letterSpacing: 1,
              border: '1px solid var(--border)', display: 'inline-block',
              clipPath: 'polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,0 100%)',
            }}
          >
            ⚒ BROWSE TOOLS
          </Link>
          <Link
            href="/login"
            style={{
              fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--text3)',
              padding: '11px 18px', textDecoration: 'none', letterSpacing: 1,
              alignSelf: 'center', display: 'inline-block',
            }}
          >
            Sign in →
          </Link>
        </div>
      </section>

      {/* ── Stats row ── */}
      <section style={{ padding: '0 clamp(20px,5vw,48px) clamp(20px,3vw,40px)', maxWidth: 900, margin: '0 auto', width: '100%' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 2 }}>
          {STATS.map(s => (
            <div key={s.label} style={{
              padding: '14px 16px',
              background: 'var(--panel)', border: '1px solid var(--border)',
              fontFamily: 'var(--mono)',
            }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: s.color }}>{s.val}</div>
              <div style={{ fontSize: 9, letterSpacing: 2, color: 'var(--text3)', marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features grid ── */}
      <section style={{ padding: '0 clamp(20px,5vw,48px) clamp(32px,5vw,56px)', maxWidth: 900, margin: '0 auto', width: '100%' }}>
        <div style={{
          fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: 3,
          color: 'var(--text4)', marginBottom: 20,
        }}>
          // WHAT&apos;S INSIDE
        </div>
        <div className="landing-features-grid">
          {FEATURES.map(f => (
            <div key={f.label} style={{
              padding: '18px 20px',
              background: 'var(--panel)', border: '1px solid var(--border)',
              clipPath: 'polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,0 100%)',
            }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 16, color: 'var(--em)', marginBottom: 8 }}>
                {f.icon}
              </div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>
                {f.label}
              </div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text3)', lineHeight: 1.7 }}>
                {f.desc}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{
        marginTop: 'auto', padding: 'clamp(14px,2vw,20px) clamp(20px,5vw,48px)',
        borderTop: '1px solid var(--border)',
        fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: 1,
        color: 'var(--text4)', display: 'flex', gap: 'clamp(12px,3vw,24px)', alignItems: 'center',
        flexWrap: 'wrap',
        maxWidth: 900, margin: '0 auto', width: '100%',
      }}>
        <span style={{ color: 'var(--em)' }}>IAMHUB</span>
        <Link href="/tools" style={{ color: 'var(--text4)', textDecoration: 'none' }}>Tools</Link>
        <Link href="/explore" style={{ color: 'var(--text4)', textDecoration: 'none' }}>Explore</Link>
        <Link href="/login" style={{ color: 'var(--text4)', textDecoration: 'none' }}>Sign in</Link>
        <Link href="/signup" style={{ color: 'var(--text4)', textDecoration: 'none' }}>Sign up</Link>
        <span style={{ marginLeft: 'auto' }}>// v3.1.4</span>
      </footer>
    </div>
  )
}
