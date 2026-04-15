'use client'

import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

const SPECIALTIES = [
  '', 'IAM Architect', 'Security Engineer', 'Policy Engineer',
  'Identity Developer', 'Compliance / GRC', 'DevSecOps', 'Student / Learning',
]

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

  async function attemptSignup() {
    if (!firstName || !lastName || !email || !username || !specialty) {
      setError('All fields are required'); return
    }
    if (password.length < 6) {
      setError('ACCESS_KEY must be at least 6 characters'); return
    }
    if (password !== confirm) {
      setError('ACCESS_KEY and CONFIRM_KEY do not match'); return
    }
    setError('')
    setLoading(true)

    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          full_name: `${firstName} ${lastName}`,
          specialty,
        },
      },
    })

    setLoading(false)
    if (authError) {
      setError(authError.message)
    } else {
      setSubmitted(true)
    }
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

      {/* Signup panel */}
      <div style={{ width: 480, maxWidth: '94vw', animation: 'authFadeIn 0.4s ease', position: 'relative', zIndex: 1, maxHeight: '95vh', overflowY: 'auto' }}>

        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontFamily: 'var(--display)', fontSize: 32, letterSpacing: 4, color: 'var(--text)', lineHeight: 1 }}>IAMHUB</div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text3)', letterSpacing: 2, marginTop: 4 }}>REQUEST OPERATOR ACCESS</div>
        </div>

        {/* Card */}
        <div style={{ background: 'var(--panel)', border: '1px solid var(--border)', clipPath: 'polygon(0 0,calc(100% - 16px) 0,100% 16px,100% 100%,0 100%)', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, right: 0, borderTop: '16px solid var(--border2)', borderLeft: '16px solid transparent' }} />

          {/* Card header */}
          <div style={{ padding: '18px 24px 14px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 7, height: 7, background: 'var(--blue)', boxShadow: '0 0 8px rgba(0,170,255,0.5)' }} />
            <span style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: 2, color: 'var(--text3)' }}>// NEW_OPERATOR_REGISTRATION</span>
          </div>

          <div style={{ padding: '22px 24px' }}>
            {submitted ? (
              /* Success state */
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>✦</div>
                <div style={{ fontFamily: 'var(--display)', fontSize: 22, letterSpacing: 3, color: 'var(--em)', marginBottom: 8 }}>VERIFY YOUR EMAIL</div>
                <div style={{ fontFamily: 'var(--sans)', fontSize: 13, color: 'var(--text2)', lineHeight: 1.7, marginBottom: 20 }}>
                  A verification link has been sent to <strong style={{ color: 'var(--text)' }}>{email}</strong>.<br />
                  Click the link to activate your operator account.
                </div>
                <Link
                  href="/login"
                  style={{ display: 'inline-block', padding: '10px 24px', background: 'none', border: '1px solid var(--em-dim)', color: 'var(--em)', fontFamily: 'var(--mono)', fontSize: 11, cursor: 'pointer', clipPath: 'polygon(0 0,calc(100% - 7px) 0,100% 7px,100% 100%,0 100%)', textDecoration: 'none' }}
                >
                  ← BACK TO LOGIN
                </Link>
              </div>
            ) : (
              <>
                {/* Name row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                  <div>
                    <div className="auth-field-label">GIVEN_NAME</div>
                    <input type="text" placeholder="Jane" value={firstName} onChange={e => setFirstName(e.target.value)}
                      style={{ width: '100%', background: 'var(--void)', border: '1px solid var(--border)', color: 'var(--text)', fontFamily: 'var(--mono)', fontSize: 12, padding: '10px 12px', outline: 'none', transition: 'border-color 0.15s', clipPath: 'polygon(0 0,calc(100% - 7px) 0,100% 7px,100% 100%,0 100%)' }}
                      onFocus={e => (e.currentTarget.style.borderColor = 'var(--em-dim)')}
                      onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
                    />
                  </div>
                  <div>
                    <div className="auth-field-label">FAMILY_NAME</div>
                    <input type="text" placeholder="Smith" value={lastName} onChange={e => setLastName(e.target.value)}
                      style={{ width: '100%', background: 'var(--void)', border: '1px solid var(--border)', color: 'var(--text)', fontFamily: 'var(--mono)', fontSize: 12, padding: '10px 12px', outline: 'none', transition: 'border-color 0.15s', clipPath: 'polygon(0 0,calc(100% - 7px) 0,100% 7px,100% 100%,0 100%)' }}
                      onFocus={e => (e.currentTarget.style.borderColor = 'var(--em-dim)')}
                      onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
                    />
                  </div>
                </div>

                {/* Email */}
                <div style={{ marginBottom: 14 }}>
                  <div className="auth-field-label">WORK_EMAIL</div>
                  <input type="email" placeholder="jane.smith@company.com" value={email} onChange={e => setEmail(e.target.value)}
                    style={{ width: '100%', background: 'var(--void)', border: '1px solid var(--border)', color: 'var(--text)', fontFamily: 'var(--mono)', fontSize: 12, padding: '10px 12px', outline: 'none', transition: 'border-color 0.15s', clipPath: 'polygon(0 0,calc(100% - 7px) 0,100% 7px,100% 100%,0 100%)' }}
                    onFocus={e => (e.currentTarget.style.borderColor = 'var(--em-dim)')}
                    onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
                  />
                </div>

                {/* Username */}
                <div style={{ marginBottom: 14 }}>
                  <div className="auth-field-label">OPERATOR_ID&nbsp;<span style={{ color: 'var(--text4)' }}>(username)</span></div>
                  <input type="text" placeholder="jane.smith" value={username} onChange={e => setUsername(e.target.value)}
                    style={{ width: '100%', background: 'var(--void)', border: '1px solid var(--border)', color: 'var(--text)', fontFamily: 'var(--mono)', fontSize: 12, padding: '10px 12px', outline: 'none', transition: 'border-color 0.15s', clipPath: 'polygon(0 0,calc(100% - 7px) 0,100% 7px,100% 100%,0 100%)' }}
                    onFocus={e => (e.currentTarget.style.borderColor = 'var(--em-dim)')}
                    onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
                  />
                </div>

                {/* Specialty */}
                <div style={{ marginBottom: 14 }}>
                  <div className="auth-field-label">SPECIALTY</div>
                  <select value={specialty} onChange={e => setSpecialty(e.target.value)}
                    style={{ width: '100%', background: 'var(--void)', border: '1px solid var(--border)', color: specialty ? 'var(--text)' : 'var(--text3)', fontFamily: 'var(--mono)', fontSize: 12, padding: '10px 12px', outline: 'none', transition: 'border-color 0.15s', clipPath: 'polygon(0 0,calc(100% - 7px) 0,100% 7px,100% 100%,0 100%)' }}
                    onFocus={e => (e.currentTarget.style.borderColor = 'var(--em-dim)')}
                    onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
                  >
                    {SPECIALTIES.map(s => (
                      <option key={s} value={s} style={{ background: 'var(--void)' }}>{s || '-- select specialty --'}</option>
                    ))}
                  </select>
                </div>

                {/* Password row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>
                  <div>
                    <div className="auth-field-label">ACCESS_KEY</div>
                    <div className="auth-input-wrap">
                      <input
                        className="auth-input"
                        type={showPw ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                      />
                      <button onClick={() => setShowPw(v => !v)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text4)' }}>
                        {showPw ? 'HIDE' : 'SHOW'}
                      </button>
                    </div>
                  </div>
                  <div>
                    <div className="auth-field-label">CONFIRM_KEY</div>
                    <input type="password" placeholder="••••••••" value={confirm} onChange={e => setConfirm(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && attemptSignup()}
                      style={{ width: '100%', background: 'var(--void)', border: '1px solid var(--border)', color: 'var(--text)', fontFamily: 'var(--mono)', fontSize: 12, padding: '10px 12px', outline: 'none', transition: 'border-color 0.15s', clipPath: 'polygon(0 0,calc(100% - 7px) 0,100% 7px,100% 100%,0 100%)' }}
                      onFocus={e => (e.currentTarget.style.borderColor = 'var(--em-dim)')}
                      onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
                    />
                  </div>
                </div>

                {/* Validation error */}
                {error && (
                  <div style={{ marginBottom: 14, padding: '10px 14px', background: 'rgba(255,51,68,0.1)', border: '1px solid rgba(255,51,68,0.3)', fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--red)', clipPath: 'polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,0 100%)' }}>
                    ✕ {error}
                  </div>
                )}

                {/* Submit */}
                <button
                  onClick={attemptSignup}
                  disabled={loading}
                  style={{ width: '100%', padding: 12, background: loading ? 'var(--border2)' : 'var(--blue)', color: 'var(--void)', border: 'none', fontFamily: 'var(--mono)', fontSize: 12, fontWeight: 700, letterSpacing: 2, cursor: loading ? 'not-allowed' : 'pointer', clipPath: 'polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,0 100%)', transition: 'opacity 0.2s' }}
                  onMouseOver={e => { if (!loading) e.currentTarget.style.opacity = '0.88' }}
                  onMouseOut={e => { if (!loading) e.currentTarget.style.opacity = '1' }}
                >
                  {loading ? 'REGISTERING...' : 'REQUEST ACCESS →'}
                </button>

                <div style={{ textAlign: 'center', marginTop: 16, fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text3)' }}>
                  Already have access?&nbsp;
                  <Link href="/login" style={{ color: 'var(--em)', textDecoration: 'underline' }}>SIGN IN →</Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
