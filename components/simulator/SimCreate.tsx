'use client'

import { useState } from 'react'
import { useToast } from '../ToastProvider'

interface Step { type: string; text: string }

interface Props {
  onBack: () => void
}

const ATTACK_SCENARIOS = [
  'MFA_BYPASS_ATTEMPT', 'TOKEN_REPLAY_ATTACK', 'PKCE_DOWNGRADE',
  'OPEN_REDIRECT', 'CSRF_ATTACK', 'JWKS_SPOOF',
]

const STEP_TYPES = ['ok', 'info', 'warn', 'err', 'mute']

export function SimCreate({ onBack }: Props) {
  const { toast } = useToast()
  const [title, setTitle] = useState('')
  const [steps, setSteps] = useState<Step[]>([
    { type: 'ok', text: '[STEP 1] Generate code_verifier (256-bit entropy)' },
    { type: 'info', text: '[STEP 2] GET /authorize with code_challenge' },
    { type: 'info', text: '[STEP 3] User authenticated at IdP' },
    { type: 'ok', text: '[STEP 4] Authorization code issued → redirect_uri' },
  ])
  const [preview, setPreview] = useState<Step[]>([])

  function addStep() {
    setSteps(s => [...s, { type: 'ok', text: '' }])
  }

  function delStep(i: number) {
    setSteps(s => s.filter((_, idx) => idx !== i))
  }

  function updateStep(i: number, field: keyof Step, val: string) {
    setSteps(s => s.map((st, idx) => idx === i ? { ...st, [field]: val } : st))
  }

  function addAttackStep(name: string) {
    setSteps(s => [...s, { type: 'warn', text: `[ATTACK] ${name} — injected scenario` }])
    toast(`ATTACK_STEP_ADDED // ${name}`)
  }

  function runPreview() {
    setPreview(steps)
  }

  function saveDraft() {
    toast(`DRAFT_SAVED // "${title || 'Untitled'}"`)
  }

  function publish() {
    if (!title.trim()) { toast('ERROR // title is required'); return }
    if (steps.length < 2) { toast('ERROR // add at least 2 steps'); return }
    toast(`PUBLISHED // "${title}" is now live in COMMUNITY`)
    setTimeout(onBack, 800)
  }

  return (
    <>
      <div className="pg-toolbar">
        <button className="c-tool" style={{ color: 'var(--text3)' }} onClick={onBack}>← BACK</button>
        <div className="pg-sep"></div>
        <div className="pg-toolbar-title"><div className="pg-dot"></div>CREATE_SIMULATION // NEW SCENARIO</div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
          <button className="c-tool" onClick={saveDraft}>💾 SAVE DRAFT</button>
          <button className="btn-sec btn-em" style={{ padding: '6px 14px', fontSize: 11 }} onClick={publish}>↑ PUBLISH</button>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', display: 'grid', gridTemplateColumns: '360px 1fr', background: 'var(--base)' }}>
        {/* Left: metadata */}
        <div style={{ borderRight: '1px solid var(--border)', padding: 24, background: 'var(--panel)', overflowY: 'auto' }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--text4)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 18 }}>// SIMULATION METADATA</div>
          <div className="s-field"><div className="s-label">TITLE</div><input className="s-input" id="new-sim-title" placeholder="e.g. OIDC + Step-Up Auth Pattern" value={title} onChange={e => setTitle(e.target.value)} /></div>
          <div className="s-field"><div className="s-label">DESCRIPTION</div><textarea className="s-input" rows={4} style={{ resize: 'vertical' }} placeholder="What does this simulation teach?" /></div>
          <div className="s-field"><div className="s-label">PROTOCOL</div>
            <select className="s-select">
              {['OIDC', 'SAML 2.0', 'OAuth 2.0', 'FIDO2 / WebAuthn', 'SCIM', 'JWT', 'Attack Scenario', 'Custom'].map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div className="s-field"><div className="s-label">DIFFICULTY</div>
            <select className="s-select">
              {['Beginner', 'Intermediate', 'Advanced'].map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div className="s-field"><div className="s-label">TAGS (comma-separated)</div><input className="s-input" placeholder="#PKCE, #JWT, #MFA" /></div>
          <div className="s-field"><div className="s-label">VISIBILITY</div>
            <select className="s-select">
              {['Community (public)', 'Private (only me)', 'Team only'].map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div className="s-field"><div className="s-label">CLIENT_ID</div><input className="s-input" defaultValue="my-app-client-001" /></div>
          <div className="s-field"><div className="s-label">SCOPES</div><input className="s-input" defaultValue="openid profile email" /></div>
          <div className="s-field"><div className="s-label">REDIRECT_URI</div><input className="s-input" defaultValue="https://app.example.com/cb" /></div>
          <div className="s-field"><div className="s-label">IDP_ENDPOINT</div><input className="s-input" defaultValue="https://idp.example.com" /></div>
          <div className="s-field"><div className="s-label">MFA_POLICY</div>
            <select className="s-select">
              {['TOTP Required', 'Passkey / FIDO2', 'SMS OTP', 'None'].map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
        </div>

        {/* Right: step builder */}
        <div style={{ padding: 24, overflowY: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--text4)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>// SIMULATION STEPS</div>
              <div style={{ fontFamily: 'var(--sans)', fontSize: 12, color: 'var(--text3)' }}>Define each step in your auth flow.</div>
            </div>
            <button className="btn-sec btn-ghost" style={{ padding: '6px 12px', fontSize: 11 }} onClick={addStep}>+ ADD STEP</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
            {steps.map((s, i) => (
              <div key={i} className="step-row">
                <div className="step-num">{String(i + 1).padStart(2, '0')}</div>
                <select
                  className="step-type-sel"
                  value={s.type}
                  onChange={e => updateStep(i, 'type', e.target.value)}
                >
                  {STEP_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
                <input
                  className="step-text-inp"
                  placeholder="Describe what happens in this step..."
                  value={s.text}
                  onChange={e => updateStep(i, 'text', e.target.value)}
                />
                <button className="step-del-btn" onClick={() => delStep(i)} title="Remove step">✕</button>
              </div>
            ))}
          </div>

          <div
            style={{ border: '1px dashed var(--border)', padding: 14, textAlign: 'center', cursor: 'pointer', fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text3)' }}
            onClick={addStep}
          >
            + ADD STEP
          </div>

          <div style={{ marginTop: 24, borderTop: '1px solid var(--border)', paddingTop: 20 }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--text4)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 14 }}>// INJECT ATTACK SCENARIOS</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {ATTACK_SCENARIOS.map(a => (
                <button key={a} className="c-tool" onClick={() => addAttackStep(a)}>⚠ {a.replace(/_/g, ' ').replace(/\b(\w)/g, c => c)}</button>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 24, borderTop: '1px solid var(--border)', paddingTop: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--text4)', letterSpacing: 2, textTransform: 'uppercase' }}>// PREVIEW</div>
              <button className="c-tool active" style={{ fontSize: 10 }} onClick={runPreview}>▷ RUN PREVIEW</button>
            </div>
            <div style={{ background: 'var(--void)', border: '1px solid var(--border)', padding: 14, minHeight: 80, fontFamily: 'var(--mono)', fontSize: 11 }}>
              {preview.length === 0 ? (
                <div className="t-line t-mute">// Press RUN PREVIEW to test your simulation</div>
              ) : (
                preview.map((l, i) => (
                  <div key={i} className={`t-line t-${l.type}`}>[{String(i + 1).padStart(3, '0')}] {l.text}</div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
