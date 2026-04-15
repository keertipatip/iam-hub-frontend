'use client'
import { useState } from 'react'
import { toBase64url, ecdsaSign, derToRawEcdsa, sha256, copyToClipboard } from '@/utils/toolCrypto'

export default function DpopProofGenerator() {
  const [method, setMethod] = useState('POST')
  const [uri, setUri] = useState('https://api.example.com/resource')
  const [accessToken, setAccessToken] = useState('')
  const [nonce, setNonce] = useState('')
  const [output, setOutput] = useState<React.ReactNode>(<span className="tl-out-placeholder">// DPoP proof JWT (ES256) will appear here</span>)

  async function generate() {
    try {
      const kp = await crypto.subtle.generateKey({ name: 'ECDSA', namedCurve: 'P-256' }, true, ['sign', 'verify'])
      const pubJwk = await crypto.subtle.exportKey('jwk', kp.publicKey)

      const header = { typ: 'dpop+jwt', alg: 'ES256', jwk: pubJwk }
      const jti = crypto.randomUUID()
      const iat = Math.floor(Date.now() / 1000)

      const payload: Record<string, unknown> = { jti, htm: method, htu: uri, iat, exp: iat + 120 }
      if (nonce) payload.nonce = nonce
      if (accessToken) {
        const ath = await sha256(accessToken)
        payload.ath = toBase64url(Uint8Array.from(ath.match(/.{2}/g)!.map(h => parseInt(h, 16))).buffer)
      }

      const b64url = (o: unknown) => btoa(unescape(encodeURIComponent(JSON.stringify(o)))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
      const hdr64 = b64url(header)
      const pld64 = b64url(payload)
      const sigInput = `${hdr64}.${pld64}`

      const derSig = await ecdsaSign(kp.privateKey, sigInput)
      const rawSig = derToRawEcdsa(derSig)
      const sig64 = toBase64url(rawSig)
      const proof = `${sigInput}.${sig64}`

      setOutput(
        <div>
          <div className="tl-ok">✓ DPOP PROOF GENERATED (ES256, fresh ephemeral key)</div>
          <div className="tl-lbl" style={{ marginTop: 10 }}>HEADER</div>
          <pre style={{ fontSize: 10, color: 'var(--amber)', margin: '4px 0 10px' }}>{JSON.stringify(header, null, 2)}</pre>
          <div className="tl-lbl">PAYLOAD</div>
          <pre style={{ fontSize: 10, color: 'var(--em)', margin: '4px 0 10px' }}>{JSON.stringify(payload, null, 2)}</pre>
          <div className="tl-lbl">DPOP PROOF JWT</div>
          <div style={{ fontSize: 10, wordBreak: 'break-all', color: 'var(--text)', marginTop: 4 }}>{proof}</div>
          <button className="tl-btn-ghost" style={{ marginTop: 10, fontSize: 10 }} onClick={() => copyToClipboard(proof)}>⊡ COPY PROOF</button>
          <div style={{ marginTop: 10, fontSize: 10, color: 'var(--text4)' }}>
            ⚠ This proof is single-use. Regenerate for each request.
          </div>
        </div>
      )
    } catch (e) {
      setOutput(<span className="tl-err">✕ Error: {String(e)}</span>)
    }
  }

  return (
    <div className="tl">
      <div className="tl-grid2">
        <div>
          <div className="tl-lbl">HTTP Method</div>
          <select className="tl-sel" value={method} onChange={e => setMethod(e.target.value)}>
            <option>POST</option><option>GET</option><option>PUT</option><option>DELETE</option><option>PATCH</option>
          </select>
        </div>
        <div>
          <div className="tl-lbl">Request URI (htu)</div>
          <input className="tl-inp" value={uri} onChange={e => setUri(e.target.value)} />
        </div>
        <div>
          <div className="tl-lbl">Access Token (for ath claim, optional)</div>
          <input className="tl-inp" placeholder="Paste access token to bind…"
            value={accessToken} onChange={e => setAccessToken(e.target.value)} />
        </div>
        <div>
          <div className="tl-lbl">Server Nonce (optional)</div>
          <input className="tl-inp" placeholder="nonce from WWW-Authenticate header"
            value={nonce} onChange={e => setNonce(e.target.value)} />
        </div>
      </div>
      <button className="tl-btn" onClick={generate}>▷ GENERATE DPOP PROOF</button>
      <div className="tl-out" style={{ minHeight: 160 }}>{output}</div>
    </div>
  )
}
