'use client'

import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

const SPECIALTIES = [
  '', 'IAM Architect', 'Security Engineer', 'Policy Engineer',
  'Identity Developer', 'Compliance / GRC', 'DevSecOps', 'Student / Learning',
]

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px', boxSizing: 'border-box',
  border: '1px solid var(--border)', borderRadius: 10,
  background: 'var(--bg-secondary)',
  fontFamily: 'var(--sans)', fontSize: 14, color: 'var(--text)',
  outline: 'none', transition: 'border-color .15s',
}

export default function SignupPage() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [specialty, setSpecialty] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  function focus(e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) {
    e.currentTarget.style.borderColor = 'var(--border-strong)'
    e.currentTarget.style.background = 'var(--bg)'
  }
  function blur(e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) {
    e.currentTarget.style.borderColor = 'var(--border)'
    e.currentTarget.style.background = 'var(--bg-secondary)'
  }

  async function attemptSignup() {
    if (!firstName || !lastName || !email || !username || !specialty) {
      setError('All fields are required'); return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters'); return
    }
    if (password !== confirm) {
      setError('Passwords do not match'); return
    }
    setError('')
    setLoading(true)

    const { error: authError } = await supabase.auth.signUp({
      email, password,
      options: {
        data: { username, full_name: `${firstName} ${lastName}`, specialty },
      },
    })

    setLoading(false)
    if (authError) { setError(authError.message) } else { setSubmitted(true) }
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 500,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg)', overflow: 'auto', padding: '20px 0',
    }}>
      {/* Subtle dot-grid background */}
      <div style={{ position: 'fixed', inset: 0, backgroundImage: 'radial-gradient(var(--border) 1px, transparent 1px)', backgroundSize: '28px 28px', opacity: .5, pointerEvents: 'none' }} />
      {/* Soft gradient orbs */}
      <div style={{ position: 'fixed', top: -120, right: -120, width: 400, height: 400, background: 'radial-gradient(circle, var(--accent-soft) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: -80, left: -80, width: 300, height: 300, background: 'radial-gradient(circle, var(--blue-soft) 0%, transparent 70%)', pointerEvents: 'none' }} />

      {/* Signup panel */}
      <div style={{ width: 440, maxWidth: '94vw', position: 'relative', zIndex: 1, animation: 'slideUp 0.3s ease', margin: 'auto' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <div style={{ width: 36, height: 36, background: 'var(--text)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
                <path d="M8 1.5L13.5 4.5V10C13.5 12.5 11 14.5 8 15C5 14.5 2.5 12.5 2.5 10V4.5L8 1.5Z" fill="white"/>
                <path d="M5.5 8L7 9.5L10.5 6" stroke="#111" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)', letterSpacing: '-.3px', fontFamily: 'var(--sans)' }}>IAMHUB</div>
          </div>
          <div style={{ fontSize: 22, fontWeight: 600, color: 'var(--text)', letterSpacing: '-.4px', marginBottom: 6, fontFamily: 'var(--sans)' }}>Create your account</div>
          <div style={{ fontSize: 14, color: 'var(--text-3)', fontFamily: 'var(--sans)' }}>Join the IAM professional community</div>
        </div>

        {/* Card */}
        <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 18, padding: '28px', boxShadow: 'var(--shadow-xl)' }}>

          {submitted ? (
            /* Success state */
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ fontSize: 40, marginBottom: 14 }}>✓</div>
              <div style={{ fontSize: 20, fontWeight: 600, color: 'var(--text)', marginBottom: 8, fontFamily: 'var(--sans)', letterSpacing: '-.3px' }}>Check your email</div>
              <div style={{ fontSize: 14, color: 'var(--text-3)', lineHeight: 1.7, marginBottom: 24, fontFamily: 'var(--sans)' }}>
                A verification link has been sent to{' '}
                <strong style={{ color: 'var(--text)' }}>{email}</strong>.<br />
                Click the link to activate your account.
              </div>
              <Link
                href="/login"
                style={{
                  display: 'inline-block', padding: '10px 24px',
                  background: 'var(--text)', color: 'var(--bg)',
                  borderRadius: 10, fontFamily: 'var(--sans)', fontSize: 14,
                  fontWeight: 500, textDecoration: 'none',
                }}
              >
                Back to sign in
              </Link>
            </div>
          ) : (
            <>
              {/* Error */}
              {error && (
                <div style={{ marginBottom: 16, padding: '10px 14px', background: 'var(--red-soft)', border: '1px solid var(--red)', borderRadius: 10, fontSize: 13, color: 'var(--red)', fontFamily: 'var(--sans)' }}>
                  {error}
                </div>
              )}

              {/* Name row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: 1, color: 'var(--text-3)', marginBottom: 6 }}>FIRST NAME</div>
                  <input type="text" placeholder="Jane" value={firstName} onChange={e => setFirstName(e.target.value)} style={inputStyle} onFocus={focus} onBlur={blur} />
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: 1, color: 'var(--text-3)', marginBottom: 6 }}>LAST NAME</div>
                  <input type="text" placeholder="Smith" value={lastName} onChange={e => setLastName(e.target.value)} style={inputStyle} onFocus={focus} onBlur={blur} />
                </div>
              </div>

              {/* Email */}
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: 1, color: 'var(--text-3)', marginBottom: 6 }}>EMAIL</div>
                <input type="email" placeholder="jane.smith@company.com" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} onFocus={focus} onBlur={blur} />
              </div>

              {/* Username */}
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: 1, color: 'var(--text-3)', marginBottom: 6 }}>USERNAME</div>
                <input type="text" placeholder="jane.smith" value={username} onChange={e => setUsername(e.target.value)} style={inputStyle} onFocus={focus} onBlur={blur} />
              </div>

              {/* Specialty */}
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: 1, color: 'var(--text-3)', marginBottom: 6 }}>SPECIALTY</div>
                <select value={specialty} onChange={e => setSpecialty(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}
                  onFocus={e => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.background = 'var(--bg)' }}
                  onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg-secondary)' }}
                >
                  {SPECIALTIES.map(s => (
                    <option key={s} value={s}>{s || '— select specialty —'}</option>
                  ))}
                </select>
              </div>

              {/* Password row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
                <div>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: 1, color: 'var(--text-3)', marginBottom: 6 }}>PASSWORD</div>
                  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border)', borderRadius: 10, background: 'var(--bg-secondary)', padding: '0 12px', transition: 'border-color .15s' }}
                    onFocusCapture={e => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.background = 'var(--bg)' }}
                    onBlurCapture={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg-secondary)' }}
                  >
                    <input type={showPw ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)}
                      style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontFamily: 'var(--sans)', fontSize: 14, color: 'var(--text)', padding: '10px 0' }}
                    />
                    <button type="button" onClick={() => setShowPw(v => !v)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text-4)', flexShrink: 0 }}>
                      {showPw ? 'HIDE' : 'SHOW'}
                    </button>
                  </div>
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: 1, color: 'var(--text-3)', marginBottom: 6 }}>CONFIRM</div>
                  <input type="password" placeholder="••••••••" value={confirm} onChange={e => setConfirm(e.target.value)} onKeyDown={e => e.key === 'Enter' && attemptSignup()} style={inputStyle} onFocus={focus} onBlur={blur} />
                </div>
              </div>

              {/* Submit */}
              <button
                type="button"
                onClick={attemptSignup}
                disabled={loading}
                style={{
                  width: '100%', padding: 11,
                  background: loading ? 'var(--border-med)' : 'var(--text)',
                  color: 'var(--bg)', border: 'none', borderRadius: 10,
                  fontFamily: 'var(--sans)', fontSize: 14, fontWeight: 600,
                  cursor: loading ? 'not-allowed' : 'pointer', transition: 'opacity .15s',
                }}
                onMouseOver={e => { if (!loading) e.currentTarget.style.opacity = '.85' }}
                onMouseOut={e => { e.currentTarget.style.opacity = '1' }}
              >
                {loading ? 'Creating account…' : 'Create account'}
              </button>

              <div style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--text-3)', fontFamily: 'var(--sans)' }}>
                Already have an account?&nbsp;
                <Link href="/login" style={{ color: 'var(--text)', fontWeight: 500, textDecoration: 'underline' }}>Sign in</Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
