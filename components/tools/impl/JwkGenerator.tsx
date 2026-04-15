'use client'
import { useState } from 'react'
import { exportPublicJwk, exportPrivateJwk, toBase64url, copyToClipboard } from '@/utils/toolCrypto'

export default function JwkGenerator() {
  const [type, setType] = useState('ec-p256')
  const [kid, setKid] = useState('key-2024-01')
  const [use, setUse] = useState('sig')
  const [pasteVal, setPasteVal] = useState('')
  const [output, setOutput] = useState<React.ReactNode>(<span className="tl-out-placeholder">// JWK output will appear here</span>)

  async function generate() {
    try {
      let kp: CryptoKeyPair
      if (type === 'ec-p256') kp = await crypto.subtle.generateKey({ name: 'ECDSA', namedCurve: 'P-256' }, true, ['sign', 'verify'])
      else if (type === 'ec-p384') kp = await crypto.subtle.generateKey({ name: 'ECDSA', namedCurve: 'P-384' }, true, ['sign', 'verify'])
      else kp = await crypto.subtle.generateKey(
        { name: 'RSASSA-PKCS1-v1_5', modulusLength: type === 'rsa-4096' ? 4096 : 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' },
        true, ['sign', 'verify']
      )

      const pub = await exportPublicJwk(kp.publicKey) as Record<string, unknown>
      const priv = await exportPrivateJwk(kp.privateKey) as Record<string, unknown>
      pub.kid = priv.kid = kid
      pub.use = priv.use = use

      const jwks = { keys: [pub] }

      setOutput(
        <div>
          <div className="tl-ok">✓ {type.toUpperCase()} KEY PAIR GENERATED</div>
          <div className="tl-lbl" style={{ marginTop: 12 }}>PUBLIC JWK</div>
          <pre style={{ fontSize: 10, color: 'var(--em)', margin: '4px 0 8px', whiteSpace: 'pre-wrap' }}>{JSON.stringify(pub, null, 2)}</pre>
          <button className="tl-btn-ghost" style={{ fontSize: 10, marginBottom: 14 }}
            onClick={() => copyToClipboard(JSON.stringify(pub, null, 2))}>⊡ COPY PUBLIC JWK</button>
          <div className="tl-lbl">PRIVATE JWK (keep secret)</div>
          <pre style={{ fontSize: 10, color: 'var(--amber)', margin: '4px 0 8px', whiteSpace: 'pre-wrap' }}>{JSON.stringify(priv, null, 2)}</pre>
          <button className="tl-btn-ghost" style={{ fontSize: 10, marginBottom: 14 }}
            onClick={() => copyToClipboard(JSON.stringify(priv, null, 2))}>⊡ COPY PRIVATE JWK</button>
          <div className="tl-lbl">JWKS (public keys endpoint)</div>
          <pre style={{ fontSize: 10, color: 'var(--blue)', margin: '4px 0 8px', whiteSpace: 'pre-wrap' }}>{JSON.stringify(jwks, null, 2)}</pre>
          <button className="tl-btn-ghost" style={{ fontSize: 10 }}
            onClick={() => copyToClipboard(JSON.stringify(jwks, null, 2))}>⊡ COPY JWKS</button>
        </div>
      )
    } catch (e) { setOutput(<span className="tl-err">✕ Error: {String(e)}</span>) }
  }

  function analyzeJwk() {
    try {
      const jwk = JSON.parse(pasteVal) as JsonWebKey
      setOutput(
        <div>
          <div className="tl-ok">✓ JWK PARSED</div>
          {jwk.kty && <div style={{ marginTop: 8 }}>Type: {jwk.kty}</div>}
          {jwk.crv && <div>Curve: {jwk.crv}</div>}
          {jwk.alg && <div>Algorithm: {jwk.alg}</div>}
          {jwk.use && <div>Use: {jwk.use}</div>}
          {!!(jwk as Record<string,unknown>).kid && <div>Key ID: {String((jwk as Record<string,unknown>).kid)}</div>}
          {jwk.n && <div>RSA modulus length: ~{Math.round(jwk.n.length * 0.75 * 8)} bits</div>}
          {jwk.d ? <div className="tl-warn">⚠ Contains private key material (d parameter)</div>
            : <div className="tl-ok">✓ Public key only</div>}
        </div>
      )
    } catch (e) { setOutput(<span className="tl-err">✕ Invalid JWK JSON: {String(e)}</span>) }
  }

  return (
    <div className="tl">
      <div className="tl-grid2">
        <div>
          <div className="tl-lbl">Generate New Key Pair</div>
          <select className="tl-sel" value={type} style={{ marginBottom: 8 }} onChange={e => setType(e.target.value)}>
            <option value="ec-p256">EC P-256 (recommended, compact)</option>
            <option value="ec-p384">EC P-384</option>
            <option value="rsa-2048">RSA 2048-bit</option>
            <option value="rsa-4096">RSA 4096-bit</option>
          </select>
          <input className="tl-inp" placeholder="Key ID (kid)" value={kid} style={{ marginBottom: 8 }}
            onChange={e => setKid(e.target.value)} />
          <select className="tl-sel" value={use} style={{ marginBottom: 8 }} onChange={e => setUse(e.target.value)}>
            <option value="sig">sig — signing</option>
            <option value="enc">enc — encryption</option>
          </select>
          <button className="tl-btn" style={{ width: '100%' }} onClick={generate}>▷ GENERATE KEY PAIR</button>
        </div>
        <div>
          <div className="tl-lbl">Or Analyze Existing JWK</div>
          <textarea className="tl-inp" rows={6} placeholder={'{"kty":"EC","crv":"P-256","x":"...","y":"..."}'}
            value={pasteVal} onChange={e => setPasteVal(e.target.value)} />
          <button className="tl-btn-ghost" style={{ marginTop: 8, width: '100%' }} onClick={analyzeJwk}>▷ ANALYZE JWK</button>
        </div>
      </div>
      <div className="tl-out">{output}</div>
    </div>
  )
}
