'use client'
import { useState } from 'react'
import { toHex, toBase64, toBase64url, copyToClipboard } from '@/utils/toolCrypto'

const PRESETS: Record<string, { len: number; fmt: string; count: number }> = {
  apikey: { len: 32, fmt: 'hex', count: 1 },
  secret: { len: 48, fmt: 'b64url', count: 1 },
  state: { len: 32, fmt: 'b64url', count: 1 },
  session: { len: 64, fmt: 'hex', count: 1 },
}

const ALPHANUM = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
const ALPHASYMS = ALPHANUM + '!@#$%^&*-_+=<>?'

function genString(len: number, fmt: string): string {
  const bytes = crypto.getRandomValues(new Uint8Array(len))
  switch (fmt) {
    case 'hex': return toHex(bytes.buffer)
    case 'b64': return toBase64(bytes.buffer)
    case 'b64url': return toBase64url(bytes.buffer)
    case 'alpha': return Array.from(bytes).map(b => ALPHANUM[b % ALPHANUM.length]).join('').slice(0, len)
    case 'alphasyms': return Array.from(bytes).map(b => ALPHASYMS[b % ALPHASYMS.length]).join('').slice(0, len)
    default: return toHex(bytes.buffer)
  }
}

export default function RandomStringGenerator() {
  const [len, setLen] = useState(32)
  const [fmt, setFmt] = useState('b64url')
  const [count, setCount] = useState(6)
  const [strings, setStrings] = useState<string[]>([])
  const [output, setOutput] = useState<React.ReactNode>(<span className="tl-out-placeholder">// Random strings will appear here</span>)

  function generate(l = len, f = fmt, c = count) {
    const results = Array.from({ length: c }, () => genString(l, f))
    setStrings(results)
    setOutput(
      <div>
        {results.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ color: 'var(--em)', fontFamily: 'var(--mono)', fontSize: 11, flex: 1, wordBreak: 'break-all' }}>{s}</span>
            <button className="tl-btn-ghost" style={{ fontSize: 9, flexShrink: 0 }}
              onClick={() => copyToClipboard(s)}>⊡</button>
          </div>
        ))}
      </div>
    )
  }

  function loadPreset(key: string) {
    const p = PRESETS[key]
    setLen(p.len); setFmt(p.fmt); setCount(p.count)
    generate(p.len, p.fmt, p.count)
  }

  return (
    <div className="tl">
      <div className="tl-grid3">
        <div>
          <div className="tl-lbl">Length (chars)</div>
          <input className="tl-inp" type="number" value={len} min={4} max={256}
            onChange={e => setLen(Number(e.target.value))} />
        </div>
        <div>
          <div className="tl-lbl">Format</div>
          <select className="tl-sel" value={fmt} onChange={e => setFmt(e.target.value)}>
            <option value="hex">Hex</option>
            <option value="b64url">Base64url</option>
            <option value="b64">Base64</option>
            <option value="alpha">Alphanumeric</option>
            <option value="alphasyms">Alpha + Symbols</option>
          </select>
        </div>
        <div>
          <div className="tl-lbl">Count</div>
          <input className="tl-inp" type="number" value={count} min={1} max={20}
            onChange={e => setCount(Number(e.target.value))} />
        </div>
      </div>
      <button className="tl-btn" onClick={() => generate()}>▷ GENERATE</button>
      <div className="tl-out" style={{ lineHeight: 2.2 }}>{output}</div>
      <div>
        <div className="tl-lbl" style={{ marginTop: 8 }}>Common presets</div>
        <div className="tl-row-btns">
          <button className="tl-btn-ghost" onClick={() => loadPreset('apikey')}>API Key (32 hex)</button>
          <button className="tl-btn-ghost" onClick={() => loadPreset('secret')}>Client Secret (48 b64url)</button>
          <button className="tl-btn-ghost" onClick={() => loadPreset('state')}>OAuth State (32 b64url)</button>
          <button className="tl-btn-ghost" onClick={() => loadPreset('session')}>Session ID (64 hex)</button>
        </div>
      </div>
    </div>
  )
}
