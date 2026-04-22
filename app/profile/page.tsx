'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

function getInitials(name: string) {
  return name.split(' ').map(w => w[0] ?? '').join('').toUpperCase().slice(0, 2)
}

function formatJoinDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
}

const expertise = [
  { label: 'OIDC / OAuth 2.0',          pct: 95 },
  { label: 'SAML 2.0',                   pct: 88 },
  { label: 'Zero Trust Architecture',    pct: 72 },
  { label: 'Cedar / XACML Policies',     pct: 65 },
  { label: 'FIDO2 / Passkeys',           pct: 48 },
]

const certifications = [
  { title: 'Certified Identity Professional', sub: 'Issued 2023 · Expires 2026', color: 'var(--green)' },
  { title: 'AWS Security Specialty',          sub: 'Issued 2024 · Expires 2027', color: 'var(--blue)' },
]

const badges = [
  { label: 'Early Adopter', cls: 'badge-em' },
  { label: 'Contributor',   cls: 'badge-blue' },
  { label: 'Mentor',        cls: 'badge-amber' },
  { label: 'Author',        cls: 'badge-purple' },
  { label: 'Verified',      cls: 'badge-em' },
]

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => { setUser(user); setLoading(false) })
  }, [])

  const meta       = user?.user_metadata ?? {}
  const fullName   = meta.full_name || meta.name || user?.email?.split('@')[0] || 'User'
  const username   = meta.username  || user?.email?.split('@')[0] || 'user'
  const specialty  = meta.specialty || 'IAM User'
  const location   = meta.location  || ''
  const bio        = meta.bio       || ''
  const initials   = getInitials(fullName)
  const joinDate   = user?.created_at ? formatJoinDate(user.created_at) : ''
  const verified   = !!user?.email_confirmed_at

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50vh', color: 'var(--text-3)', fontSize: 13, fontFamily: 'var(--sans)' }}>
        Loading…
      </div>
    )
  }

  return (
    <>
      {/* Hero */}
      <div style={{ padding: '32px 32px 28px', background: 'var(--bg)', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20 }}>

          {/* Avatar */}
          <div style={{ width: 68, height: 68, borderRadius: 16, background: 'linear-gradient(135deg,var(--accent),var(--purple))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
            {initials}
          </div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <div style={{ fontSize: 22, fontWeight: 600, color: 'var(--text)', letterSpacing: '-.3px' }}>{fullName}</div>
              {verified && <span className="badge badge-em" style={{ fontSize: 10 }}>Verified</span>}
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 6, fontFamily: 'var(--mono)' }}>
              @{username} · {specialty}{location ? ` · ${location}` : ''}{joinDate ? ` · Joined ${joinDate}` : ''}
            </div>
            {bio && <div style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6, maxWidth: 560 }}>{bio}</div>}

            {/* Stats row */}
            <div style={{ display: 'flex', gap: 24, marginTop: 14 }}>
              {[
                { val: '—', label: 'Followers' },
                { val: '—', label: 'Posts' },
                { val: '—', label: 'Artifacts' },
                { val: '—', label: 'Rep score' },
              ].map(s => (
                <div key={s.label}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--mono)', lineHeight: 1 }}>{s.val}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 3 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <Link href="/profile/edit" style={{ padding: '8px 18px', background: 'none', border: '1px solid var(--border)', borderRadius: 10, fontFamily: 'var(--sans)', fontSize: 13, color: 'var(--text-2)', textDecoration: 'none', flexShrink: 0, transition: 'all .15s' }}>
            Edit profile
          </Link>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '28px 32px', overflowY: 'auto', flex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 28, maxWidth: 1100 }}>

          {/* Left column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

            {/* Account details */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>Account details</span>
                <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
              </div>
              <div style={{ border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', background: 'var(--bg)' }}>
                {[
                  { key: 'Username', val: username },
                  { key: 'Email',    val: user?.email ?? '—' },
                  { key: 'Specialty', val: specialty },
                  { key: 'Account status', val: verified ? 'Verified' : 'Unverified', highlight: verified },
                ].map((row, i, arr) => (
                  <div key={row.key} style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--text-3)', minWidth: 140 }}>{row.key}</span>
                    <span style={{ fontSize: 13, color: row.highlight ? 'var(--green)' : 'var(--text)', fontWeight: row.highlight ? 500 : 400 }}>{row.val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Expertise */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>Expertise</span>
                <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {expertise.map(e => {
                  const color = e.pct >= 85 ? 'var(--green)' : e.pct >= 60 ? 'var(--amber)' : 'var(--red)'
                  return (
                    <div key={e.label}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 7 }}>
                        <span style={{ color: 'var(--text-2)' }}>{e.label}</span>
                        <span style={{ fontFamily: 'var(--mono)', fontWeight: 600, color }}>{e.pct}%</span>
                      </div>
                      <div style={{ height: 6, background: 'var(--bg-tertiary)', borderRadius: 9999, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${e.pct}%`, background: color, borderRadius: 9999, transition: 'width .4s' }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

          </div>

          {/* Right column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Certifications */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>Certifications</span>
                <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {certifications.map(c => (
                  <div key={c.title} style={{ padding: '12px 14px', border: '1px solid var(--border)', borderRadius: 10, borderLeft: `3px solid ${c.color}`, background: 'var(--bg)' }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: c.color, marginBottom: 3 }}>{c.title}</div>
                    <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text-3)' }}>{c.sub}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Badges */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>Badges</span>
                <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {badges.map(b => <span key={b.label} className={`badge ${b.cls}`}>{b.label}</span>)}
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}
