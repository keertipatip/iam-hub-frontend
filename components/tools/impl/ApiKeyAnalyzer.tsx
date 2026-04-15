'use client'
import { useState } from 'react'

interface Pattern { name: string; re: RegExp; risk: string; provider: string; note: string }

const PATTERNS: Pattern[] = [
  { name: 'AWS Access Key ID', re: /^AKIA[0-9A-Z]{16}$/, risk: 'critical', provider: 'Amazon Web Services', note: 'Static IAM access key — rotate immediately if leaked' },
  { name: 'GitHub PAT (classic)', re: /^ghp_[A-Za-z0-9]{36}$/, risk: 'high', provider: 'GitHub', note: 'Personal access token with repo/org access' },
  { name: 'GitHub App token', re: /^ghs_[A-Za-z0-9]{36}$/, risk: 'high', provider: 'GitHub', note: 'GitHub Apps installation token' },
  { name: 'Stripe Secret Key (live)', re: /^sk_live_[0-9a-zA-Z]{24,}$/, risk: 'critical', provider: 'Stripe', note: 'Live Stripe secret — full payment API access' },
  { name: 'Stripe Secret Key (test)', re: /^sk_test_[0-9a-zA-Z]{24,}$/, risk: 'medium', provider: 'Stripe', note: 'Test Stripe key' },
  { name: 'Slack Bot Token', re: /^xoxb-[0-9]+-[0-9]+-[A-Za-z0-9]+$/, risk: 'high', provider: 'Slack', note: 'Bot user OAuth access token' },
  { name: 'Google API Key', re: /^AIza[0-9A-Za-z\-_]{35}$/, risk: 'high', provider: 'Google', note: 'Google Cloud API key' },
  { name: 'Twilio Auth Token', re: /^[0-9a-f]{32}$/, risk: 'medium', provider: 'Possible Twilio/generic', note: '32-char hex token — common format' },
  { name: 'OpenAI API Key', re: /^sk-[A-Za-z0-9]{48,}$/, risk: 'high', provider: 'OpenAI', note: 'OpenAI API key with billing access' },
  { name: 'Anthropic API Key', re: /^sk-ant-[A-Za-z0-9\-_]{40,}$/, risk: 'high', provider: 'Anthropic', note: 'Anthropic Claude API key' },
  { name: 'JWT Token', re: /^eyJ[A-Za-z0-9_-]+\.eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/, risk: 'info', provider: 'JWT (various)', note: 'JSON Web Token — decode with JWT Decoder' },
]

const SAMPLES: Record<string, string> = {
  aws: 'AKIAIOSFODNN7EXAMPLE',
  github: 'ghp_16C7e42F292c6912E7710c838347Ae178B4a',
  stripe: 'STRIPE_LIVE_KEY_EXAMPLE_PLACEHOLDER',
  jwt: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyLTEyMyJ9.abc',
  generic: '8f14e45fceea167a5a36dedd4bea2543',
}

function calcEntropy(s: string): number {
  const freq: Record<string, number> = {}
  for (const c of s) freq[c] = (freq[c] || 0) + 1
  return Object.values(freq).reduce((e, f) => {
    const p = f / s.length
    return e - p * Math.log2(p)
  }, 0) * s.length
}

const RISK_COLORS: Record<string, string> = { critical: '#ff3344', high: 'var(--amber)', medium: 'var(--blue)', info: 'var(--em)', low: 'var(--text2)' }

export default function ApiKeyAnalyzer() {
  const [key, setKey] = useState('')
  const [output, setOutput] = useState<React.ReactNode>(<span className="tl-out-placeholder">// Analysis will appear here — format, entropy, risk, provider detection</span>)

  function analyze(k = key) {
    const trimmed = k.trim()
    if (!trimmed) { setOutput(<span className="tl-err">✕ Enter a key to analyze</span>); return }

    const match = PATTERNS.find(p => p.re.test(trimmed))
    const entropy = calcEntropy(trimmed)
    const entropyBits = Math.round(entropy)
    const charSet = /^[0-9a-f]+$/i.test(trimmed) ? 'hex' : /^[A-Za-z0-9+/=]+$/.test(trimmed) ? 'base64' : 'mixed'

    setOutput(
      <div>
        {match ? (
          <>
            <div style={{ color: RISK_COLORS[match.risk], fontWeight: 700, fontSize: 12 }}>
              {match.risk.toUpperCase()} RISK — {match.name}
            </div>
            <div style={{ marginTop: 6, fontSize: 11 }}>Provider: {match.provider}</div>
            <div style={{ fontSize: 11 }}>Note: {match.note}</div>
          </>
        ) : (
          <div className="tl-warn">⚠ Unknown pattern — generic secret/token</div>
        )}
        <div className="tl-sep" style={{ margin: '10px 0' }} />
        <div style={{ fontSize: 11, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div>Length: {trimmed.length} chars</div>
          <div>Character set: {charSet}</div>
          <div>Estimated entropy: <span className={entropyBits > 100 ? 'tl-ok' : entropyBits > 60 ? 'tl-warn' : 'tl-err'}>{entropyBits} bits</span></div>
          <div>Strength: {entropyBits > 128 ? 'Very Strong' : entropyBits > 80 ? 'Strong' : entropyBits > 40 ? 'Moderate' : 'Weak'}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="tl">
      <div>
        <div className="tl-lbl">API Key / Token / Secret</div>
        <div className="tl-row">
          <input className="tl-inp" placeholder="Paste key to analyze…" style={{ flex: 1 }}
            value={key} onChange={e => setKey(e.target.value)} />
          <button className="tl-btn" style={{ flexShrink: 0 }} onClick={() => analyze()}>▷ ANALYZE</button>
        </div>
      </div>
      <div className="tl-out" style={{ minHeight: 160 }}>{output}</div>
      <div>
        <div className="tl-lbl" style={{ marginTop: 8 }}>Sample keys to test</div>
        <div className="tl-row-btns">
          {Object.entries(SAMPLES).map(([k, v]) => (
            <button key={k} className="tl-btn-ghost" onClick={() => { setKey(v); analyze(v) }}>
              {k.charAt(0).toUpperCase() + k.slice(1)} Key
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
