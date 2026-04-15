'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

function getInitials(name: string) {
  return name.split(' ').map(w => w[0] ?? '').join('').toUpperCase().slice(0, 2)
}

function formatRole(specialty: string) {
  return specialty.toUpperCase().replace(/\s+\/?\s*/g, '_').replace(/\s+/g, '_')
}

function formatJoinDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
}

const expertise = [
  { label: 'OIDC / OAuth 2.0', pct: 95, cls: '' },
  { label: 'SAML 2.0', pct: 88, cls: '' },
  { label: 'Zero Trust Architecture', pct: 72, cls: 'amber' },
  { label: 'Cedar / XACML Policies', pct: 65, cls: 'amber' },
  { label: 'FIDO2 / Passkeys', pct: 48, cls: 'red' },
]

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      setLoading(false)
    })
  }, [])

  const meta = user?.user_metadata ?? {}
  const fullName: string = meta.full_name || meta.name || user?.email?.split('@')[0] || 'Operator'
  const username: string = meta.username || user?.email?.split('@')[0] || 'operator'
  const specialty: string = meta.specialty || 'IAM User'
  const location: string = meta.location || ''
  const bio: string = meta.bio || ''
  const initials = getInitials(fullName)
  const role = formatRole(specialty)
  const joinDate = user?.created_at ? formatJoinDate(user.created_at) : ''

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
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div className="hex-avatar" style={{ width: 64, height: 64, background: 'linear-gradient(135deg,var(--em-dim),#007744)', fontSize: 20 }}>
              {initials}
            </div>
            <div>
              <div className="ph-title">{fullName.toUpperCase()}</div>
              <div className="ph-sub">
                // {role}
                {joinDate && <> · Joined {joinDate}</>}
                {location && <> · {location}</>}
              </div>
              {bio && (
                <div style={{ fontFamily: 'var(--sans)', fontSize: 12, color: 'var(--text3)', marginTop: 4, maxWidth: 520 }}>{bio}</div>
              )}
            </div>
          </div>
          <div className="ph-actions">
            <Link href="/profile/edit" className="btn-sec btn-ghost">✎ EDIT PROFILE</Link>
          </div>
        </div>
      </div>

      <div className="inner-page">
        <div className="two-col">
          <div>
            <div className="sec-divider">OPERATOR INFO</div>
            <div style={{ marginBottom: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { key: 'OPERATOR_ID', val: username },
                { key: 'EMAIL', val: user?.email ?? '—' },
                { key: 'SPECIALTY', val: specialty },
                { key: 'STATUS', val: user?.email_confirmed_at ? 'VERIFIED' : 'UNVERIFIED' },
              ].map(row => (
                <div key={row.key} style={{ display: 'flex', gap: 16, fontFamily: 'var(--mono)', fontSize: 11, padding: '8px 12px', background: 'var(--void)', border: '1px solid var(--border)' }}>
                  <span style={{ color: 'var(--text4)', minWidth: 120 }}>{row.key}</span>
                  <span style={{ color: row.key === 'STATUS' && row.val === 'VERIFIED' ? 'var(--em)' : 'var(--text)' }}>{row.val}</span>
                </div>
              ))}
            </div>

            <div className="sec-divider">REPUTATION</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginBottom: 20 }}>
              <div className="stat-cell"><div className="stat-val">—</div><div className="stat-key">followers</div></div>
              <div className="stat-cell"><div className="stat-val">—</div><div className="stat-key">posts</div></div>
              <div className="stat-cell"><div className="stat-val">—</div><div className="stat-key">artifacts</div></div>
              <div className="stat-cell"><div className="stat-val amb">—</div><div className="stat-key">rep_score</div></div>
            </div>

            <div className="sec-divider">EXPERTISE</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
              {expertise.map(e => (
                <div key={e.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--mono)', fontSize: 11, marginBottom: 5 }}>
                    <span style={{ color: 'var(--text2)' }}>{e.label}</span>
                    <span style={{ color: e.cls === 'red' ? 'var(--red)' : e.cls === 'amber' ? 'var(--amber)' : 'var(--em)' }}>{e.pct}%</span>
                  </div>
                  <div className="prog-bar">
                    <div className={`prog-fill${e.cls ? ' ' + e.cls : ''}`} style={{ width: `${e.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="widget">
              <div className="w-head"><div className="w-lead"></div><span className="w-title">CERTIFICATIONS</span></div>
              <div className="w-body">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ border: '1px solid rgba(0,255,136,0.3)', padding: '8px 12px', background: 'rgba(0,255,136,0.05)' }}>
                    <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--em)' }}>CERTIFIED IDENTITY PROFESSIONAL</div>
                    <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text3)' }}>Issued 2023 · Expires 2026</div>
                  </div>
                  <div style={{ border: '1px solid rgba(0,170,255,0.3)', padding: '8px 12px', background: 'rgba(0,170,255,0.05)' }}>
                    <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--blue)' }}>AWS SECURITY SPECIALTY</div>
                    <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text3)' }}>Issued 2024 · Expires 2027</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="widget">
              <div className="w-head"><div className="w-lead amber"></div><span className="w-title">BADGES</span></div>
              <div className="w-body" style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                <span className="badge badge-em">EARLY_ADOPTER</span>
                <span className="badge badge-blue">CONTRIBUTOR</span>
                <span className="badge badge-amber">MENTOR</span>
                <span className="badge badge-purple">ARTIFACT_AUTHOR</span>
                <span className="badge badge-em">VERIFIED</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
