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
      position: 'fixed', inset: 0, zIndex: 500,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg)', overflow: 'hidden',
    }}>
      {/* Subtle dot-grid background */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(var(--border) 1px, transparent 1px)', backgroundSize: '28px 28px', opacity: .5, pointerEvents: 'none' }} />
      {/* Soft gradient orbs */}
      <div style={{ position: 'absolute', top: -120, right: -120, width: 400, height: 400, background: 'radial-gradient(circle, var(--accent-soft) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -80, left: -80, width: 300, height: 300, background: 'radial-gradient(circle, var(--blue-soft) 0%, transparent 70%)', pointerEvents: 'none' }} />

      {/* Login panel */}
      <div style={{ width: 380, maxWidth: '94vw', position: 'relative', zIndex: 1, animation: 'slideUp 0.3s ease' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div style={{ width: 36, height: 36, background: 'var(--text)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
                <path d="M8 1.5L13.5 4.5V10C13.5 12.5 11 14.5 8 15C5 14.5 2.5 12.5 2.5 10V4.5L8 1.5Z" fill="white"/>
                <path d="M5.5 8L7 9.5L10.5 6" stroke="#111" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)', letterSpacing: '-.3px', fontFamily: 'var(--sans)' }}>IAMHUB</div>
          </div>
          <div style={{ fontSize: 24, fontWeight: 600, color: 'var(--text)', letterSpacing: '-.4px', marginBottom: 8, fontFamily: 'var(--sans)' }}>Welcome back</div>
          <div style={{ fontSize: 14, color: 'var(--text-3)', fontFamily: 'var(--sans)' }}>Sign in to your IAM workspace</div>
        </div>

        {/* Card */}
        <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 18, padding: '28px', boxShadow: 'var(--shadow-xl)' }}>

          {/* Error */}
          {error && (
            <div style={{ marginBottom: 16, padding: '10px 14px', background: 'var(--red-soft)', border: '1px solid var(--red)', borderRadius: 10, fontSize: 13, color: 'var(--red)', fontFamily: 'var(--sans)' }}>
              {error}
            </div>
          )}

          {/* Email */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: 1, color: 'var(--text-3)', marginBottom: 6 }}>EMAIL</div>
            <input
              type="email"
              placeholder="you@company.com"
              autoComplete="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && document.getElementById('login-pw')?.focus()}
              style={{
                width: '100%', padding: '10px 14px',
                border: '1px solid var(--border)', borderRadius: 10,
                background: 'var(--bg-secondary)',
                fontFamily: 'var(--sans)', fontSize: 14, color: 'var(--text)',
                outline: 'none', transition: 'border-color .15s', boxSizing: 'border-box',
              }}
              onFocus={e => (e.currentTarget.style.borderColor = 'var(--border-strong)')}
              onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: 1, color: 'var(--text-3)', marginBottom: 6 }}>PASSWORD</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, border: '1px solid var(--border)', borderRadius: 10, background: 'var(--bg-secondary)', padding: '0 14px', transition: 'border-color .15s' }}
              onFocusCapture={e => (e.currentTarget.style.borderColor = 'var(--border-strong)')}
              onBlurCapture={e => (e.currentTarget.style.borderColor = 'var(--border)')}
            >
              <input
                id="login-pw"
                type={showPw ? 'text' : 'password'}
                placeholder="••••••••"
                autoComplete="current-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && attemptLogin()}
                style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontFamily: 'var(--sans)', fontSize: 14, color: 'var(--text)', padding: '10px 0' }}
              />
              <button
                type="button"
                onClick={() => setShowPw(v => !v)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text-4)', padding: 0, flexShrink: 0 }}
              >
                {showPw ? 'HIDE' : 'SHOW'}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="button"
            onClick={attemptLogin}
            disabled={loading}
            style={{
              width: '100%', padding: 11,
              background: loading ? 'var(--border-med)' : 'var(--text)',
              color: 'var(--bg)', border: 'none', borderRadius: 10,
              fontFamily: 'var(--sans)', fontSize: 14, fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'opacity .15s', marginTop: 4,
            }}
            onMouseOver={e => { if (!loading) e.currentTarget.style.opacity = '.85' }}
            onMouseOut={e => { e.currentTarget.style.opacity = '1' }}
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>

          {/* Signup link */}
          <div style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--text-3)', fontFamily: 'var(--sans)' }}>
            Don&apos;t have an account?&nbsp;
            <Link href="/signup" style={{ color: 'var(--text)', fontWeight: 500, textDecoration: 'underline' }}>Create one</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
