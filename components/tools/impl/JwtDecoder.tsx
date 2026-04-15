'use client'
import { useState } from 'react'
import { copyToClipboard } from '@/utils/toolCrypto'

function b64urlDecode(s: string): string {
  try {
    const b64 = s.replace(/-/g, '+').replace(/_/g, '/').padEnd(s.length + (4 - s.length % 4) % 4, '=')
    return decodeURIComponent(escape(atob(b64)))
  } catch { return '' }
}

const SAMPLE = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyLTEyMyIsIm5hbWUiOiJBbGljZSBTbWl0aCIsImVtYWlsIjoiYWxpY2VAZXhhbXBsZS5jb20iLCJyb2xlcyI6WyJpYW1fYWRtaW4iLCJ2aWV3ZXIiXSwiaWF0IjoxNzAwMDAwMDAwLCJleHAiOjE3MDAwMDM2MDB9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'

export default function JwtDecoder() {
  const [token, setToken] = useState('')
  const [output, setOutput] = useState<React.ReactNode>(
    <span className="tl-out-placeholder">// Decoded header, payload and claims analysis will appear here</span>
  )

  function decode(raw = token) {
    const t = raw.trim()
    if (!t) { setOutput(<span className="tl-err">✕ No token provided</span>); return }
    const parts = t.split('.')
    if (parts.length !== 3) { setOutput(<span className="tl-err">✕ Invalid JWT — must have exactly 3 parts (header.payload.signature)</span>); return }
    try {
      const hdr = JSON.parse(b64urlDecode(parts[0]))
      const pld = JSON.parse(b64urlDecode(parts[1]))
      const now = Math.floor(Date.now() / 1000)

      const fmt = (o: unknown) => JSON.stringify(o, null, 2)
      const claimRows: React.ReactNode[] = []

      if (pld.iat) claimRows.push(<div key="iat">iat: {pld.iat} → {new Date(pld.iat * 1000).toUTCString()}</div>)
      if (pld.exp) {
        const expired = now > pld.exp
        claimRows.push(
          <div key="exp" className={expired ? 'tl-err' : 'tl-ok'}>
            exp: {pld.exp} → {new Date(pld.exp * 1000).toUTCString()} {expired ? '✕ EXPIRED' : '✓ VALID'}
          </div>
        )
      }
      if (pld.nbf) {
        const notYet = now < pld.nbf
        claimRows.push(
          <div key="nbf" className={notYet ? 'tl-warn' : 'tl-ok'}>
            nbf: {pld.nbf} → {new Date(pld.nbf * 1000).toUTCString()} {notYet ? '⚠ NOT YET VALID' : '✓ OK'}
          </div>
        )
      }
      if (pld.sub) claimRows.push(<div key="sub">sub: {pld.sub}</div>)
      if (pld.iss) claimRows.push(<div key="iss">iss: {pld.iss}</div>)
      if (pld.aud) claimRows.push(<div key="aud">aud: {JSON.stringify(pld.aud)}</div>)

      setOutput(
        <div>
          <div className="tl-ok">✓ VALID JWT STRUCTURE</div>
          <div className="tl-lbl" style={{ marginTop: 12 }}>HEADER</div>
          <pre style={{ margin: '4px 0 12px', color: 'var(--amber)', fontSize: 11 }}>{fmt(hdr)}</pre>
          <div className="tl-lbl">PAYLOAD</div>
          <pre style={{ margin: '4px 0 12px', color: 'var(--em)', fontSize: 11 }}>{fmt(pld)}</pre>
          {claimRows.length > 0 && <>
            <div className="tl-lbl">CLAIMS ANALYSIS</div>
            <div style={{ marginTop: 4, fontSize: 11 }}>{claimRows}</div>
          </>}
          <div className="tl-lbl" style={{ marginTop: 12 }}>SIGNATURE (raw)</div>
          <div style={{ color: 'var(--text3)', fontSize: 10, wordBreak: 'break-all', marginTop: 4 }}>{parts[2]}</div>
          <div style={{ marginTop: 8, fontSize: 10, color: 'var(--text4)' }}>
            ⚠ Signature is NOT cryptographically verified here. Use Token Verifier for that.
          </div>
        </div>
      )
    } catch (e) {
      setOutput(<span className="tl-err">✕ Parse error: {String(e)}</span>)
    }
  }

  return (
    <div className="tl">
      <div>
        <div className="tl-lbl">JWT Token</div>
        <textarea className="tl-inp" rows={4} placeholder="Paste your JWT here (eyJhbGc…)"
          value={token} onChange={e => setToken(e.target.value)} />
      </div>
      <div className="tl-row-btns">
        <button className="tl-btn" onClick={() => decode()}>▷ DECODE</button>
        <button className="tl-btn-ghost" onClick={() => { setToken(SAMPLE); decode(SAMPLE) }}>LOAD SAMPLE</button>
      </div>
      <div className="tl-out">{output}</div>
    </div>
  )
}
