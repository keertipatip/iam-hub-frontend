'use client'

import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function attemptLogin() {
    if (!email || !password) { setError('Email and password are required'); return }
    setError('')
    setLoading(true)
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
    if (authError) {
      setError(authError.message)
      setLoading(false)
    }
    // On success, onAuthStateChange fires SIGNED_IN → AuthGuard redirects to /feed
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 500, display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      background: 'var(--void)', overflow: 'hidden',
    }}>
      {/* Ambient overlays */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 50% at 50% 40%, rgba(0,255,136,0.04) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '10%', left: '8%', width: 320, height: 320, background: 'radial-gradient(circle, rgba(0,255,136,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '15%', right: '10%', width: 240, height: 240, background: 'radial-gradient(circle, rgba(0,170,255,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />

      {/* Login panel */}
      <div style={{ width: 420, maxWidth: '94vw', animation: 'authFadeIn 0.4s ease', position: 'relative', zIndex: 1 }}>

        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 52, height: 52, border: '1px solid var(--em-dim)', marginBottom: 14, background: 'rgba(0,255,136,0.06)', clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
            <svg width="24" height="24" viewBox="0 0 16 16" fill="none">
              <path d="M8 1L14 4V9C14 12 11 14.5 8 15.5C5 14.5 2 12 2 9V4L8 1Z" stroke="#00ff88" strokeWidth="1.2" fill="none"/>
              <path d="M5.5 8L7 9.5L10.5 6" stroke="#00ff88" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
          </div>
          <div style={{ fontFamily: 'var(--display)', fontSize: 32, letterSpacing: 4, color: 'var(--text)', lineHeight: 1 }}>IAMHUB</div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text3)', letterSpacing: 2, marginTop: 5 }}>IDENTITY &amp; ACCESS MANAGEMENT</div>
        </div>

        {/* Card */}
        <div style={{ background: 'var(--panel)', border: '1px solid var(--border)', clipPath: 'polygon(0 0,calc(100% - 16px) 0,100% 16px,100% 100%,0 100%)', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, right: 0, borderTop: '16px solid var(--border2)', borderLeft: '16px solid transparent' }} />

          {/* Card header */}
          <div style={{ padding: '20px 24px 14px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 7, height: 7, background: 'var(--em)', boxShadow: '0 0 8px rgba(0,255,136,0.5)' }} />
            <span style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: 2, color: 'var(--text3)' }}>// OPERATOR_AUTH</span>
            <span style={{ marginLeft: 'auto', fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--text4)' }}>v3.1.4</span>
          </div>

          <div style={{ padding: 24 }}>
            {/* Error */}
            {error && (
              <div style={{ marginBottom: 16, padding: '10px 14px', background: 'rgba(255,51,68,0.1)', border: '1px solid rgba(255,51,68,0.3)', fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--red)', clipPath: 'polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,0 100%)' }}>
                ✕ {error}
              </div>
            )}

            {/* Email */}
            <div style={{ marginBottom: 16 }}>
              <div className="auth-field-label">EMAIL</div>
              <div className="auth-input-wrap">
                <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text4)' }}>$&gt;</span>
                <input
                  className="auth-input"
                  type="email"
                  placeholder="operator@example.com"
                  autoComplete="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && document.getElementById('login-pw')?.focus()}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: 20 }}>
              <div className="auth-field-label">ACCESS_KEY</div>
              <div className="auth-input-wrap">
                <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text4)' }}>🔑</span>
                <input
                  id="login-pw"
                  className="auth-input"
                  type={showPw ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && attemptLogin()}
                />
                <button
                  onClick={() => setShowPw(v => !v)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text4)', padding: 0 }}
                >
                  {showPw ? 'HIDE' : 'SHOW'}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              onClick={attemptLogin}
              disabled={loading}
              style={{ width: '100%', padding: 12, background: loading ? 'var(--border2)' : 'var(--em)', color: 'var(--void)', border: 'none', fontFamily: 'var(--mono)', fontSize: 12, fontWeight: 700, letterSpacing: 2, cursor: loading ? 'not-allowed' : 'pointer', clipPath: 'polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,0 100%)', boxShadow: loading ? 'none' : '0 0 20px rgba(0,255,136,0.2)', transition: 'box-shadow 0.2s' }}
              onMouseOver={e => { if (!loading) e.currentTarget.style.boxShadow = '0 0 36px rgba(0,255,136,0.4)' }}
              onMouseOut={e => { if (!loading) e.currentTarget.style.boxShadow = '0 0 20px rgba(0,255,136,0.2)' }}
            >
              {loading ? 'AUTHENTICATING...' : 'AUTHENTICATE →'}
            </button>

            {/* Signup link */}
            <div style={{ textAlign: 'center', marginTop: 18, fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text3)' }}>
              No account?&nbsp;
              <Link href="/signup" style={{ color: 'var(--em)', textDecoration: 'underline' }}>REQUEST_ACCESS →</Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: 20, fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--text4)', letterSpacing: 1 }}>
          IAMHUB // SECURE OPERATOR PORTAL // ALL ACCESS LOGGED
        </div>
      </div>
    </div>
  )
}
