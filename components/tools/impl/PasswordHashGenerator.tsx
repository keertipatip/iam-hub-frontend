'use client'
import { useState } from 'react'
import { pbkdf2Hash, toHex, copyToClipboard } from '@/utils/toolCrypto'

export default function PasswordHashGenerator() {
  const [alg, setAlg] = useState('pbkdf2')
  const [iterations, setIterations] = useState(600000)
  const [pass, setPass] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [storedHash, setStoredHash] = useState('')
  const [output, setOutput] = useState<React.ReactNode>(<span className="tl-out-placeholder">// Hash will appear here</span>)
  const [verifyOut, setVerifyOut] = useState<React.ReactNode>(<span className="tl-out-placeholder">// Verification result</span>)

  async function hash() {
    if (!pass) { setOutput(<span className="tl-err">✕ Enter a password</span>); return }
    try {
      if (alg === 'pbkdf2') {
        const salt = crypto.getRandomValues(new Uint8Array(16))
        const bits = await pbkdf2Hash(pass, salt, iterations)
        const result = `pbkdf2:sha256:${iterations}:${toHex(salt.buffer)}:${toHex(bits)}`
        setOutput(
          <div>
            <div className="tl-ok">✓ PBKDF2-SHA256 hash</div>
            <div style={{ marginTop: 8, wordBreak: 'break-all', fontSize: 11 }}>{result}</div>
            <button className="tl-btn-ghost" style={{ marginTop: 8, fontSize: 10 }}
              onClick={() => copyToClipboard(result)}>⊡ COPY</button>
          </div>
        )
      } else {
        const te = new TextEncoder()
        const bits = await crypto.subtle.digest(alg === 'sha256' ? 'SHA-256' : 'SHA-512', te.encode(pass))
        const result = toHex(bits)
        setOutput(
          <div>
            <div className="tl-warn">⚠ {alg.toUpperCase()} hash (NOT suitable for passwords — use PBKDF2)</div>
            <div style={{ marginTop: 8, wordBreak: 'break-all', fontSize: 11 }}>{result}</div>
            <button className="tl-btn-ghost" style={{ marginTop: 8, fontSize: 10 }}
              onClick={() => copyToClipboard(result)}>⊡ COPY</button>
          </div>
        )
      }
    } catch (e) { setOutput(<span className="tl-err">✕ Error: {String(e)}</span>) }
  }

  async function verify() {
    if (!storedHash || !pass) { setVerifyOut(<span className="tl-err">✕ Both password and stored hash required</span>); return }
    try {
      const parts = storedHash.split(':')
      if (parts[0] !== 'pbkdf2' || parts.length !== 5) {
        setVerifyOut(<span className="tl-err">✕ Only pbkdf2:sha256:[iter]:[salt]:[hash] format supported</span>); return
      }
      const [, , iter, saltHex, expectedHash] = parts
      const salt = new Uint8Array(saltHex.match(/.{2}/g)!.map(h => parseInt(h, 16)))
      const bits = await pbkdf2Hash(pass, salt, parseInt(iter))
      const computed = toHex(bits)
      setVerifyOut(
        computed === expectedHash
          ? <div className="tl-ok">✓ PASSWORD MATCHES</div>
          : <div className="tl-err">✕ PASSWORD DOES NOT MATCH</div>
      )
    } catch (e) { setVerifyOut(<span className="tl-err">✕ Error: {String(e)}</span>) }
  }

  return (
    <div className="tl">
      <div className="tl-grid2">
        <div>
          <div className="tl-lbl">Algorithm</div>
          <select className="tl-sel" value={alg} onChange={e => setAlg(e.target.value)}>
            <option value="pbkdf2">PBKDF2-SHA256 (recommended)</option>
            <option value="sha256">SHA-256 (not for passwords)</option>
            <option value="sha512">SHA-512 (not for passwords)</option>
          </select>
        </div>
        <div>
          <div className="tl-lbl">PBKDF2 Iterations</div>
          <input className="tl-inp" type="number" value={iterations} min={10000}
            onChange={e => setIterations(Number(e.target.value))} />
        </div>
      </div>
      <div>
        <div className="tl-lbl">Password</div>
        <div className="tl-row">
          <input className="tl-inp" type={showPass ? 'text' : 'password'} placeholder="Enter password to hash…"
            style={{ flex: 1 }} value={pass} onChange={e => setPass(e.target.value)} />
          <button className="tl-btn-ghost" style={{ flexShrink: 0 }}
            onClick={() => setShowPass(!showPass)}>{showPass ? 'HIDE' : 'SHOW'}</button>
        </div>
      </div>
      <button className="tl-btn" onClick={hash}>▷ GENERATE HASH</button>
      <div className="tl-out">{output}</div>
      <div className="tl-sep" />
      <div>
        <div className="tl-lbl">Verify — paste stored hash to compare</div>
        <div className="tl-row">
          <input className="tl-inp" placeholder="Paste stored PBKDF2 hash…" style={{ flex: 1 }}
            value={storedHash} onChange={e => setStoredHash(e.target.value)} />
          <button className="tl-btn" style={{ flexShrink: 0 }} onClick={verify}>▷ VERIFY</button>
        </div>
        <div className="tl-out" style={{ marginTop: 8, minHeight: 36 }}>{verifyOut}</div>
      </div>
    </div>
  )
}
