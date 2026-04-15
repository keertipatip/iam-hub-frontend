'use client'
import { useState } from 'react'
import { base64urlDecode } from '@/utils/toolCrypto'

const SAMPLE_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyLTEyMyIsIm5hbWUiOiJBbGljZSIsImlhdCI6MTcwMDAwMDAwMH0.zWQAlJH4gMEp5BM2XL3FMWmqHhVXHiRbWfgVTzm6AaI'
const SAMPLE_KEY = 'my-super-secret-key-2024'

const ALG_MAP: Record<string, string> = { HS256: 'SHA-256', HS384: 'SHA-384', HS512: 'SHA-512' }

export default function TokenVerifier() {
  const [token, setToken] = useState('')
  const [alg, setAlg] = useState('HS256')
  const [key, setKey] = useState('')
  const [output, setOutput] = useState<React.ReactNode>(<span className="tl-out-placeholder">// Verification result will appear here</span>)

  async function verify() {
    const t = token.trim()
    if (!t || !key) { setOutput(<span className="tl-err">✕ Token and key are required</span>); return }
    const parts = t.split('.')
    if (parts.length !== 3) { setOutput(<span className="tl-err">✕ Invalid JWT format</span>); return }
    try {
      const te = new TextEncoder()
      const hashAlg = ALG_MAP[alg]
      const sigInput = `${parts[0]}.${parts[1]}`
      const sigBytes = base64urlDecode(parts[2])
      const cryptoKey = await crypto.subtle.importKey('raw', te.encode(key).buffer as ArrayBuffer, { name: 'HMAC', hash: hashAlg }, false, ['verify'])
      const valid = await crypto.subtle.verify('HMAC', cryptoKey, sigBytes.buffer as ArrayBuffer, te.encode(sigInput).buffer as ArrayBuffer)

      let payload: Record<string, unknown> = {}
      try {
        const raw = parts[1].replace(/-/g, '+').replace(/_/g, '/').padEnd(parts[1].length + (4 - parts[1].length % 4) % 4, '=')
        payload = JSON.parse(decodeURIComponent(escape(atob(raw))))
      } catch { /* ignore */ }

      const now = Math.floor(Date.now() / 1000)
      const expired = payload.exp ? now > (payload.exp as number) : false

      setOutput(
        <div>
          {valid
            ? <div className="tl-ok">✓ SIGNATURE VALID ({alg})</div>
            : <div className="tl-err">✕ SIGNATURE INVALID — key mismatch or tampered token</div>}
          {payload.sub ? <div style={{ marginTop: 8 }}>sub: {String(payload.sub)}</div> : null}
          {payload.iss ? <div>iss: {String(payload.iss)}</div> : null}
          {payload.exp ? <div className={expired ? 'tl-err' : 'tl-ok'}>
            exp: {new Date((payload.exp as number) * 1000).toUTCString()} {expired ? '✕ EXPIRED' : '✓ VALID'}
          </div> : null}
        </div>
      )
    } catch (e) {
      setOutput(<span className="tl-err">✕ Error: {String(e)}</span>)
    }
  }

  function loadSample() { setToken(SAMPLE_TOKEN); setKey(SAMPLE_KEY) }

  return (
    <div className="tl">
      <div>
        <div className="tl-lbl">JWT Token</div>
        <textarea className="tl-inp" rows={3} placeholder="Paste JWT to verify…"
          value={token} onChange={e => setToken(e.target.value)} />
      </div>
      <div>
        <div className="tl-lbl">Algorithm</div>
        <select className="tl-sel" style={{ maxWidth: 180 }} value={alg} onChange={e => setAlg(e.target.value)}>
          <option>HS256</option><option>HS384</option><option>HS512</option>
        </select>
      </div>
      <div>
        <div className="tl-lbl">HMAC Secret Key</div>
        <input className="tl-inp" placeholder="Paste HMAC secret key…" value={key} onChange={e => setKey(e.target.value)} />
      </div>
      <div className="tl-row-btns">
        <button className="tl-btn" onClick={verify}>▷ VERIFY SIGNATURE</button>
        <button className="tl-btn-ghost" onClick={loadSample}>LOAD SAMPLE</button>
      </div>
      <div className="tl-out">{output}</div>
    </div>
  )
}
