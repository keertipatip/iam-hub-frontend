'use client'
import { useState } from 'react'
import { copyToClipboard } from '@/utils/toolCrypto'

function uuidV4(): string { return crypto.randomUUID() }

function uuidV7(): string {
  const now = Date.now()
  const msHi = Math.floor(now / 0x10000)
  const msLo = now & 0xffff
  const msHex = msHi.toString(16).padStart(8, '0') + msLo.toString(16).padStart(4, '0')
  const rand = Array.from(crypto.getRandomValues(new Uint8Array(10))).map(b => b.toString(16).padStart(2, '0')).join('')
  const variant = ((parseInt(rand.slice(4, 6), 16) & 0x3f) | 0x80).toString(16).padStart(2, '0')
  return `${msHex.slice(0, 8)}-${msHex.slice(8, 12)}-7${rand.slice(0, 3)}-${variant}${rand.slice(6, 8)}-${rand.slice(8, 20)}`
}

function analyzeUuid(id: string): React.ReactNode {
  const clean = id.replace(/-/g, '')
  if (!/^[0-9a-f]{32}$/i.test(clean)) return <span className="tl-err">✕ Not a valid UUID</span>
  const ver = parseInt(clean[12], 16)
  const variant = parseInt(clean[16], 16)
  const variantStr = variant >= 14 ? 'Reserved' : variant >= 12 ? 'Microsoft' : variant >= 8 ? 'RFC 4122' : 'NCS'
  let extra = ''
  if (ver === 7) {
    const msHigh = parseInt(clean.slice(0, 8), 16) * 0x10000
    const msLow = parseInt(clean.slice(8, 12), 16)
    const ms = msHigh + msLow
    extra = ` (timestamp: ${new Date(ms).toISOString()})`
  }
  return (
    <div>
      <div className="tl-ok">✓ Valid UUID v{ver}</div>
      <div style={{ marginTop: 6, fontSize: 11 }}>Version: {ver}</div>
      <div style={{ fontSize: 11 }}>Variant: {variantStr}</div>
      {extra && <div style={{ fontSize: 11 }}>{extra}</div>}
    </div>
  )
}

export default function UuidGenerator() {
  const [ver, setVer] = useState('v4')
  const [count, setCount] = useState(10)
  const [uuids, setUuids] = useState<string[]>([])
  const [analyzeIn, setAnalyzeIn] = useState('')
  const [analyzeOut, setAnalyzeOut] = useState<React.ReactNode>(<span className="tl-out-placeholder">// Analysis will appear here</span>)

  function generate() {
    const gen = ver === 'v7' ? uuidV7 : uuidV4
    setUuids(Array.from({ length: count }, gen))
  }

  function copyAll() { copyToClipboard(uuids.join('\n')) }

  return (
    <div className="tl">
      <div className="tl-grid2">
        <div>
          <div className="tl-lbl">Version</div>
          <select className="tl-sel" value={ver} onChange={e => setVer(e.target.value)}>
            <option value="v4">v4 — Random</option>
            <option value="v7">v7 — Time-ordered (sortable)</option>
          </select>
        </div>
        <div>
          <div className="tl-lbl">Count</div>
          <input className="tl-inp" type="number" value={count} min={1} max={50}
            onChange={e => setCount(Number(e.target.value))} />
        </div>
      </div>
      <div className="tl-row-btns">
        <button className="tl-btn" onClick={generate}>▷ GENERATE</button>
        {uuids.length > 0 && <button className="tl-btn-ghost" onClick={copyAll}>⊡ COPY ALL</button>}
      </div>
      {uuids.length > 0 && (
        <div className="tl-out" style={{ lineHeight: 2 }}>
          {uuids.map((u, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ flex: 1, color: 'var(--em)', fontSize: 12 }}>{u}</span>
              <button className="tl-btn-ghost" style={{ fontSize: 9 }} onClick={() => copyToClipboard(u)}>⊡</button>
            </div>
          ))}
        </div>
      )}
      <div className="tl-sep" />
      <div>
        <div className="tl-lbl">Analyze a UUID</div>
        <div className="tl-row">
          <input className="tl-inp" placeholder="Paste UUID to analyze…" style={{ flex: 1 }}
            value={analyzeIn} onChange={e => setAnalyzeIn(e.target.value)} />
          <button className="tl-btn" style={{ flexShrink: 0 }} onClick={() => setAnalyzeOut(analyzeUuid(analyzeIn))}>▷</button>
        </div>
        <div className="tl-out" style={{ marginTop: 8 }}>{analyzeOut}</div>
      </div>
    </div>
  )
}
