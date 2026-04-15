'use client'
import { useState } from 'react'
import { pkceVerifier, pkceChallenge, copyToClipboard } from '@/utils/toolCrypto'

export default function PkceGenerator() {
  const [len, setLen] = useState(64)
  const [verifier, setVerifier] = useState('')
  const [challenge, setChallenge] = useState('')
  const [output, setOutput] = useState<React.ReactNode>(<span className="tl-out-placeholder">// PKCE pair will appear here</span>)

  async function generate() {
    const v = pkceVerifier(len)
    const c = await pkceChallenge(v)
    setVerifier(v)
    setChallenge(c)
    setOutput(
      <div>
        <div className="tl-ok">✓ Generated {len}-byte verifier</div>
        <div style={{ marginTop: 8, fontSize: 10, color: 'var(--text3)' }}>
          code_challenge_method: S256 | verifier length: {v.length} chars
        </div>
      </div>
    )
  }

  return (
    <div className="tl">
      <div style={{ maxWidth: 260 }}>
        <div className="tl-lbl">Code Verifier Length (bytes)</div>
        <input className="tl-inp" type="number" value={len} min={32} max={96}
          onChange={e => setLen(Number(e.target.value))} />
      </div>
      <button className="tl-btn" onClick={generate}>▷ GENERATE PKCE PAIR</button>

      {verifier && (
        <div className="tl-grid2">
          <div className="tl-card">
            <div className="tl-card-lbl">code_verifier <span style={{ color: 'var(--text4)' }}>(keep secret — send in POST /token)</span></div>
            <div className="tl-card-val tl-warn">{verifier}</div>
            <button className="tl-btn-ghost" style={{ marginTop: 8, fontSize: 10 }}
              onClick={() => copyToClipboard(verifier)}>⊡ COPY</button>
          </div>
          <div className="tl-card">
            <div className="tl-card-lbl">code_challenge <span style={{ color: 'var(--text4)' }}>(S256 — send in GET /authorize)</span></div>
            <div className="tl-card-val tl-ok">{challenge}</div>
            <button className="tl-btn-ghost" style={{ marginTop: 8, fontSize: 10 }}
              onClick={() => copyToClipboard(challenge)}>⊡ COPY</button>
          </div>
        </div>
      )}

      <div className="tl-out">{output}</div>
    </div>
  )
}
