'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

const SPECIALTIES = [
  '', 'IAM Architect', 'Security Engineer', 'Policy Engineer',
  'Identity Developer', 'Compliance / GRC', 'DevSecOps', 'Student / Learning',
]

const inputStyle: React.CSSProperties = {
  width: '100%', background: 'var(--void)', border: '1px solid var(--border)',
  color: 'var(--text)', fontFamily: 'var(--mono)', fontSize: 12,
  padding: '10px 12px', outline: 'none', transition: 'border-color 0.15s',
  clipPath: 'polygon(0 0,calc(100% - 7px) 0,100% 7px,100% 100%,0 100%)',
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: 1.5, color: 'var(--text4)', marginBottom: 6 }}>
        {label}{hint && <span style={{ color: 'var(--text4)', fontWeight: 400, letterSpacing: 0 }}> — {hint}</span>}
      </div>
      {children}
    </div>
  )
}

export default function EditProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [username, setUsername] = useState('')
  const [specialty, setSpecialty] = useState('')
  const [location, setLocation] = useState('')
  const [bio, setBio] = useState('')

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.replace('/login'); return }
      setUser(user)
      const meta = user.user_metadata ?? {}
      const fullName: string = meta.full_name || ''
      const parts = fullName.trim().split(' ')
      setFirstName(parts[0] ?? '')
      setLastName(parts.slice(1).join(' '))
      setUsername(meta.username || '')
      setSpecialty(meta.specialty || '')
      setLocation(meta.location || '')
      setBio(meta.bio || '')
      setLoading(false)
    })
  }, [router])

  async function handleSave() {
    if (!firstName.trim()) { setError('GIVEN_NAME is required'); return }
    setError('')
    setSaving(true)
    setSaved(false)

    const { error: updateError } = await supabase.auth.updateUser({
      data: {
        full_name: `${firstName.trim()} ${lastName.trim()}`.trim(),
        username: username.trim(),
        specialty,
        location: location.trim(),
        bio: bio.trim(),
      },
    })

    setSaving(false)
    if (updateError) {
      setError(updateError.message)
    } else {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '40vh', fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--text3)', letterSpacing: 2 }}>
        LOADING_PROFILE...
      </div>
    )
  }

  return (
    <>
      <div className="page-header">
        <div className="ph-row">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Link href="/profile" style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text3)', textDecoration: 'none' }}>← PROFILE</Link>
            <span style={{ color: 'var(--border2)' }}>/</span>
            <div className="ph-title">EDIT PROFILE</div>
          </div>
          <div className="ph-actions">
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-sec"
              style={{ background: saving ? 'var(--border2)' : 'var(--em)', color: 'var(--void)', cursor: saving ? 'not-allowed' : 'pointer', border: 'none', fontWeight: 700 }}
            >
              {saving ? 'SAVING...' : saved ? '✓ SAVED' : '✦ SAVE CHANGES'}
            </button>
          </div>
        </div>
      </div>

      <div className="inner-page">
        <div style={{ maxWidth: 640 }}>

          {/* Error / success banner */}
          {error && (
            <div style={{ marginBottom: 20, padding: '10px 14px', background: 'rgba(255,51,68,0.1)', border: '1px solid rgba(255,51,68,0.3)', fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--red)', clipPath: 'polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,0 100%)' }}>
              ✕ {error}
            </div>
          )}
          {saved && (
            <div style={{ marginBottom: 20, padding: '10px 14px', background: 'rgba(0,255,136,0.07)', border: '1px solid rgba(0,255,136,0.25)', fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--em)', clipPath: 'polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,0 100%)' }}>
              ✓ Profile updated successfully
            </div>
          )}

          {/* Section: Identity */}
          <div className="sec-divider">IDENTITY</div>
          <div className="profile-name-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <Field label="GIVEN_NAME">
              <input
                style={inputStyle} type="text" placeholder="Jane"
                value={firstName} onChange={e => setFirstName(e.target.value)}
                onFocus={e => (e.currentTarget.style.borderColor = 'var(--em-dim)')}
                onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
              />
            </Field>
            <Field label="FAMILY_NAME">
              <input
                style={inputStyle} type="text" placeholder="Smith"
                value={lastName} onChange={e => setLastName(e.target.value)}
                onFocus={e => (e.currentTarget.style.borderColor = 'var(--em-dim)')}
                onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
              />
            </Field>
          </div>

          <Field label="OPERATOR_ID" hint="username">
            <input
              style={inputStyle} type="text" placeholder="jane.smith"
              value={username} onChange={e => setUsername(e.target.value)}
              onFocus={e => (e.currentTarget.style.borderColor = 'var(--em-dim)')}
              onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
            />
          </Field>

          {/* Read-only email */}
          <Field label="EMAIL" hint="managed by Supabase Auth — not editable here">
            <div style={{ ...inputStyle, color: 'var(--text3)', cursor: 'default' }}>
              {user?.email}
            </div>
          </Field>

          {/* Section: Role */}
          <div className="sec-divider" style={{ marginTop: 8 }}>ROLE &amp; FOCUS</div>

          <Field label="SPECIALTY">
            <select
              value={specialty} onChange={e => setSpecialty(e.target.value)}
              style={{ ...inputStyle, color: specialty ? 'var(--text)' : 'var(--text3)' }}
              onFocus={e => (e.currentTarget.style.borderColor = 'var(--em-dim)')}
              onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
            >
              {SPECIALTIES.map(s => (
                <option key={s} value={s} style={{ background: 'var(--void)' }}>{s || '-- select specialty --'}</option>
              ))}
            </select>
          </Field>

          {/* Section: About */}
          <div className="sec-divider" style={{ marginTop: 8 }}>ABOUT</div>

          <Field label="LOCATION" hint="optional">
            <input
              style={inputStyle} type="text" placeholder="San Francisco, CA"
              value={location} onChange={e => setLocation(e.target.value)}
              onFocus={e => (e.currentTarget.style.borderColor = 'var(--em-dim)')}
              onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
            />
          </Field>

          <Field label="BIO" hint="short description · optional">
            <textarea
              rows={3}
              placeholder="IAM architect focused on zero-trust and federated identity..."
              value={bio} onChange={e => setBio(e.target.value)}
              style={{ ...inputStyle, resize: 'vertical', minHeight: 72 }}
              onFocus={e => (e.currentTarget.style.borderColor = 'var(--em-dim)')}
              onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
            />
          </Field>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <button
              onClick={handleSave}
              disabled={saving}
              style={{ padding: '11px 28px', background: saving ? 'var(--border2)' : 'var(--em)', color: 'var(--void)', border: 'none', fontFamily: 'var(--mono)', fontSize: 12, fontWeight: 700, letterSpacing: 1.5, cursor: saving ? 'not-allowed' : 'pointer', clipPath: 'polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,0 100%)', boxShadow: saving ? 'none' : '0 0 16px rgba(0,255,136,0.2)', transition: 'box-shadow 0.2s' }}
              onMouseOver={e => { if (!saving) e.currentTarget.style.boxShadow = '0 0 28px rgba(0,255,136,0.4)' }}
              onMouseOut={e => { if (!saving) e.currentTarget.style.boxShadow = '0 0 16px rgba(0,255,136,0.2)' }}
            >
              {saving ? 'SAVING...' : '✦ SAVE CHANGES'}
            </button>
            <Link
              href="/profile"
              style={{ padding: '11px 22px', background: 'none', border: '1px solid var(--border)', color: 'var(--text2)', fontFamily: 'var(--mono)', fontSize: 12, cursor: 'pointer', clipPath: 'polygon(0 0,calc(100% - 9px) 0,100% 9px,100% 100%,0 100%)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}
            >
              CANCEL
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
