'use client'
import { useState } from 'react'
import { randomHex, copyToClipboard } from '@/utils/toolCrypto'

export default function StateNonceDebugger() {
  const [stateVal, setStateVal] = useState('—')
  const [nonceVal, setNonceVal] = useState('—')
  const [orig, setOrig] = useState('')
  const [returned, setReturned] = useState('')
  const [result, setResult] = useState<React.ReactNode>(<span className="tl-out-placeholder">// Validation result</span>)

  function genState() { setStateVal(randomHex(16)) }
  function genNonce() { setNonceVal(randomHex(16)) }
  function genBoth() { setStateVal(randomHex(16)); setNonceVal(randomHex(16)) }

  function validate() {
    if (!orig || !returned) { setResult(<span className="tl-err">✕ Both fields required</span>); return }
    if (orig === returned) {
      setResult(
        <div className="tl-ok">
          ✓ STATE MATCH — CSRF check passed<br />
          <span style={{ fontSize: 10, color: 'var(--text3)' }}>State matches the original sent in /authorize. Safe to proceed.</span>
        </div>
      )
    } else {
      setResult(
        <div className="tl-err">
          ✕ STATE MISMATCH — possible CSRF attack<br />
          <span style={{ fontSize: 10 }}>Expected: {orig}<br />Received: {returned}</span>
        </div>
      )
    }
  }

  return (
    <div className="tl">
      <div className="tl-grid2">
        <div className="tl-col">
          <div className="tl-lbl">Generate</div>
          <div className="tl-row-btns">
            <button className="tl-btn" onClick={genState}>▷ STATE</button>
            <button className="tl-btn-ghost" onClick={genNonce}>▷ NONCE</button>
            <button className="tl-btn-ghost" onClick={genBoth}>▷ BOTH</button>
          </div>
          <div className="tl-card" style={{ marginTop: 8 }}>
            <div className="tl-card-lbl">state</div>
            <div className="tl-card-val tl-ok">{stateVal}</div>
            <button className="tl-btn-ghost" style={{ marginTop: 6, fontSize: 10 }}
              onClick={() => copyToClipboard(stateVal)}>⊡ COPY</button>
          </div>
          <div className="tl-card" style={{ marginTop: 8 }}>
            <div className="tl-card-lbl">nonce</div>
            <div className="tl-card-val tl-warn">{nonceVal}</div>
            <button className="tl-btn-ghost" style={{ marginTop: 6, fontSize: 10 }}
              onClick={() => copyToClipboard(nonceVal)}>⊡ COPY</button>
          </div>
        </div>
        <div className="tl-col">
          <div className="tl-lbl">Validate State (CSRF check)</div>
          <div style={{ marginBottom: 6 }}>
            <div className="tl-lbl" style={{ fontSize: 8, marginBottom: 3 }}>Original state (stored in session)</div>
            <input className="tl-inp" placeholder="State you sent in /authorize…" value={orig} onChange={e => setOrig(e.target.value)} />
          </div>
          <div style={{ marginBottom: 8 }}>
            <div className="tl-lbl" style={{ fontSize: 8, marginBottom: 3 }}>Returned state (from callback)</div>
            <input className="tl-inp" placeholder="State returned in callback…" value={returned} onChange={e => setReturned(e.target.value)} />
          </div>
          <button className="tl-btn" onClick={validate}>▷ VALIDATE</button>
          <div className="tl-out" style={{ marginTop: 8, minHeight: 48 }}>{result}</div>
        </div>
      </div>
    </div>
  )
}
