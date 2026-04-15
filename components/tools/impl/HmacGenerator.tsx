'use client'
import { useState } from 'react'
import { hmacSign, copyToClipboard } from '@/utils/toolCrypto'

const SAMPLES: Record<string, { key: string; msg: string }> = {
  github: { key: 'my-github-webhook-secret', msg: '{"action":"push","ref":"refs/heads/main","repository":{"name":"my-repo"}}' },
  stripe: { key: 'whsec_test_secret_key_here', msg: '{"id":"evt_001","type":"payment_intent.succeeded","data":{"object":{"id":"pi_001","amount":2000}}}' },
}

export default function HmacGenerator() {
  const [alg, setAlg] = useState('SHA-256')
  const [enc, setEnc] = useState<'hex' | 'base64' | 'base64url'>('hex')
  const [key, setKey] = useState('my-webhook-secret-key')
  const [msg, setMsg] = useState('{"event":"user.created","id":"usr-001","timestamp":1700000000}')
  const [expected, setExpected] = useState('')
  const [output, setOutput] = useState<React.ReactNode>(<span className="tl-out-placeholder">// HMAC signature will appear here</span>)
  const [verifyOut, setVerifyOut] = useState<React.ReactNode>(<span className="tl-out-placeholder">// Verification result will appear here</span>)

  async function generate() {
    try {
      const sig = await hmacSign(alg, key, msg, enc)
      setOutput(
        <div>
          <div className="tl-ok">✓ HMAC-{alg} ({enc})</div>
          <div style={{ marginTop: 8, wordBreak: 'break-all', color: 'var(--em)', fontSize: 12 }}>{sig}</div>
          {alg === 'SHA-256' && <div style={{ marginTop: 6, fontSize: 10, color: 'var(--text3)' }}>
            GitHub format: sha256={sig}
          </div>}
          <button className="tl-btn-ghost" style={{ marginTop: 10, fontSize: 10 }} onClick={() => copyToClipboard(sig)}>⊡ COPY</button>
        </div>
      )
    } catch (e) { setOutput(<span className="tl-err">✕ Error: {String(e)}</span>) }
  }

  async function verify() {
    if (!expected) { setVerifyOut(<span className="tl-err">✕ Enter expected signature</span>); return }
    try {
      const computed = await hmacSign(alg, key, msg, enc)
      const norm = expected.replace(/^sha256=/i, '')
      const match = computed === norm || computed.toLowerCase() === norm.toLowerCase()
      setVerifyOut(
        match
          ? <div className="tl-ok">✓ SIGNATURE MATCHES — webhook authentic</div>
          : <div className="tl-err">✕ SIGNATURE MISMATCH — computed: {computed}</div>
      )
    } catch (e) { setVerifyOut(<span className="tl-err">✕ Error: {String(e)}</span>) }
  }

  function loadSample(type: string) {
    const s = SAMPLES[type]
    if (s) { setKey(s.key); setMsg(s.msg) }
  }

  return (
    <div className="tl">
      <div className="tl-grid2">
        <div>
          <div className="tl-lbl">Algorithm</div>
          <select className="tl-sel" value={alg} onChange={e => setAlg(e.target.value)}>
            <option>SHA-256</option><option>SHA-384</option><option>SHA-512</option><option>SHA-1</option>
          </select>
        </div>
        <div>
          <div className="tl-lbl">Output Encoding</div>
          <select className="tl-sel" value={enc} onChange={e => setEnc(e.target.value as 'hex' | 'base64' | 'base64url')}>
            <option value="hex">Hex</option><option value="base64">Base64</option><option value="base64url">Base64url</option>
          </select>
        </div>
      </div>
      <div>
        <div className="tl-lbl">Secret Key</div>
        <input className="tl-inp" value={key} onChange={e => setKey(e.target.value)} />
      </div>
      <div>
        <div className="tl-lbl">Message / Payload</div>
        <textarea className="tl-inp" rows={5} value={msg} onChange={e => setMsg(e.target.value)} />
      </div>
      <div className="tl-row-btns">
        <button className="tl-btn" onClick={generate}>▷ GENERATE HMAC</button>
        <button className="tl-btn-ghost" onClick={() => loadSample('github')}>GitHub Sample</button>
        <button className="tl-btn-ghost" onClick={() => loadSample('stripe')}>Stripe Sample</button>
      </div>
      <div className="tl-out">{output}</div>
      <div className="tl-sep" />
      <div>
        <div className="tl-lbl">Verify — paste expected signature to compare</div>
        <div className="tl-row">
          <input className="tl-inp" placeholder="Expected signature…" style={{ flex: 1 }}
            value={expected} onChange={e => setExpected(e.target.value)} />
          <button className="tl-btn" style={{ flexShrink: 0 }} onClick={verify}>▷ VERIFY</button>
        </div>
        <div className="tl-out" style={{ marginTop: 8, minHeight: 36 }}>{verifyOut}</div>
      </div>
    </div>
  )
}
