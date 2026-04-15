'use client'
import { useState, useEffect } from 'react'
import { copyToClipboard } from '@/utils/toolCrypto'

function b64url(obj: unknown): string {
  return btoa(unescape(encodeURIComponent(JSON.stringify(obj))))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

const ALG_MAP: Record<string, string> = { HS256: 'SHA-256', HS384: 'SHA-384', HS512: 'SHA-512' }

function defaultPayload(): string {
  const now = Math.floor(Date.now() / 1000)
  return JSON.stringify({
    sub: 'user-abc-123', name: 'Alice Smith', email: 'alice@example.com',
    roles: ['iam_admin', 'viewer'], iat: now, exp: now + 3600,
  }, null, 2)
}

export default function JwtGenerator() {
  const [alg, setAlg] = useState('HS256')
  const [secret, setSecret] = useState('my-super-secret-key-2024')
  const [payload, setPayload] = useState(defaultPayload)
  const [output, setOutput] = useState<React.ReactNode>(
    <span className="tl-out-placeholder">// Generated JWT will appear here</span>
  )

  function refreshTs() {
    try {
      const p = JSON.parse(payload)
      const now = Math.floor(Date.now() / 1000)
      p.iat = now; p.exp = now + 3600
      setPayload(JSON.stringify(p, null, 2))
    } catch { /* ignore */ }
  }

  async function generate() {
    try {
      const pld = JSON.parse(payload)
      const hdr64 = b64url({ alg, typ: 'JWT' })
      const pld64 = b64url(pld)
      const sigInput = `${hdr64}.${pld64}`
      const te = new TextEncoder()
      const key = await crypto.subtle.importKey(
        'raw', te.encode(secret || 'secret').buffer as ArrayBuffer,
        { name: 'HMAC', hash: ALG_MAP[alg] }, false, ['sign']
      )
      const sig = await crypto.subtle.sign('HMAC', key, te.encode(sigInput).buffer as ArrayBuffer)
      const sig64 = btoa(String.fromCharCode(...new Uint8Array(sig)))
        .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
      const jwt = `${sigInput}.${sig64}`
      setOutput(
        <div>
          <div className="tl-ok">✓ JWT GENERATED ({alg})</div>
          <div style={{ margin: '10px 0 4px', fontSize: 11 }}>
            <span style={{ color: 'var(--amber)' }}>{hdr64}</span>
            <span style={{ color: 'var(--text3)' }}>.</span>
            <span style={{ color: 'var(--em)' }}>{pld64}</span>
            <span style={{ color: 'var(--text3)' }}>.</span>
            <span style={{ color: 'var(--blue)' }}>{sig64}</span>
          </div>
          <div style={{ marginTop: 10, wordBreak: 'break-all', fontSize: 11, color: 'var(--text)' }}>{jwt}</div>
          <button className="tl-btn-ghost" style={{ marginTop: 10, fontSize: 10 }}
            onClick={() => copyToClipboard(jwt)}>⊡ COPY TOKEN</button>
        </div>
      )
    } catch (e) {
      setOutput(<span className="tl-err">✕ {String(e)}</span>)
    }
  }

  return (
    <div className="tl">
      <div className="tl-grid2">
        <div>
          <div className="tl-lbl">Algorithm</div>
          <select className="tl-sel" value={alg} onChange={e => setAlg(e.target.value)}>
            <option>HS256</option><option>HS384</option><option>HS512</option>
          </select>
        </div>
        <div>
          <div className="tl-lbl">Secret Key</div>
          <input className="tl-inp" value={secret} onChange={e => setSecret(e.target.value)} />
        </div>
      </div>
      <div>
        <div className="tl-lbl">Payload JSON</div>
        <textarea className="tl-inp" rows={7} value={payload} onChange={e => setPayload(e.target.value)} />
      </div>
      <div className="tl-row-btns">
        <button className="tl-btn" onClick={generate}>▷ GENERATE JWT</button>
        <button className="tl-btn-ghost" onClick={refreshTs}>REFRESH TIMESTAMPS</button>
      </div>
      <div className="tl-out">{output}</div>
    </div>
  )
}
