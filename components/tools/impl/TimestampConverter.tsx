'use client'
import { useState } from 'react'

function nowLocalDatetime(): string {
  const n = new Date()
  return new Date(n.getTime() - n.getTimezoneOffset() * 60000).toISOString().slice(0, 16)
}

export default function TimestampConverter() {
  const [unix, setUnix] = useState('')
  const [dt, setDt] = useState(nowLocalDatetime)
  const [dateOut, setDateOut] = useState<React.ReactNode>(<span className="tl-out-placeholder">// Date will appear here</span>)
  const [unixOut, setUnixOut] = useState<React.ReactNode>(<span className="tl-out-placeholder">// Timestamp will appear here</span>)
  const [claims, setClaims] = useState('')
  const [claimsOut, setClaimsOut] = useState<React.ReactNode>(<span className="tl-out-placeholder">// Claim analysis will appear here</span>)

  function toDate() {
    const n = parseInt(unix)
    if (isNaN(n)) { setDateOut(<span className="tl-err">✕ Invalid timestamp</span>); return }
    const d = new Date(n * 1000)
    setDateOut(
      <div>
        <div><span className="tl-lbl">UTC: </span>{d.toUTCString()}</div>
        <div><span className="tl-lbl">ISO: </span>{d.toISOString()}</div>
        <div><span className="tl-lbl">Local: </span>{d.toLocaleString()}</div>
        <div><span className="tl-lbl">Relative: </span>{relativeTime(n)}</div>
      </div>
    )
  }

  function dateToTs() {
    const d = new Date(dt)
    if (isNaN(d.getTime())) { setUnixOut(<span className="tl-err">✕ Invalid date</span>); return }
    const ts = Math.floor(d.getTime() / 1000)
    setUnixOut(<span className="tl-ok">{ts}</span>)
  }

  function relativeTime(ts: number): string {
    const now = Math.floor(Date.now() / 1000)
    const diff = ts - now
    const abs = Math.abs(diff)
    const past = diff < 0
    if (abs < 60) return `${abs}s ${past ? 'ago' : 'from now'}`
    if (abs < 3600) return `${Math.floor(abs / 60)}m ${past ? 'ago' : 'from now'}`
    if (abs < 86400) return `${Math.floor(abs / 3600)}h ${past ? 'ago' : 'from now'}`
    return `${Math.floor(abs / 86400)}d ${past ? 'ago' : 'from now'}`
  }

  function analyzeClaims() {
    try {
      const p = JSON.parse(claims)
      const now = Math.floor(Date.now() / 1000)
      const rows: React.ReactNode[] = []

      const claimNames = ['iat', 'exp', 'nbf', 'auth_time']
      for (const c of claimNames) {
        if (p[c] == null) continue
        const ts = p[c] as number
        const d = new Date(ts * 1000)
        let status: React.ReactNode = null
        if (c === 'exp') status = now > ts ? <span className="tl-err"> ✕ EXPIRED</span> : <span className="tl-ok"> ✓ VALID</span>
        if (c === 'nbf') status = now < ts ? <span className="tl-warn"> ⚠ NOT YET VALID</span> : <span className="tl-ok"> ✓ OK</span>
        rows.push(
          <div key={c} style={{ marginBottom: 6 }}>
            <span style={{ color: 'var(--amber)' }}>{c}</span>: {ts} → {d.toUTCString()} · {relativeTime(ts)}{status}
          </div>
        )
      }

      if (rows.length === 0) { setClaimsOut(<span className="tl-warn">⚠ No timestamp claims found (iat/exp/nbf/auth_time)</span>); return }
      setClaimsOut(<div>{rows}</div>)
    } catch (e) {
      setClaimsOut(<span className="tl-err">✕ Invalid JSON: {String(e)}</span>)
    }
  }

  return (
    <div className="tl">
      <div className="tl-grid2">
        <div>
          <div className="tl-lbl">Unix Timestamp → Human Date</div>
          <div className="tl-row">
            <input className="tl-inp" style={{ flex: 1 }} placeholder="e.g. 1700000000"
              value={unix} onChange={e => setUnix(e.target.value)} />
            <button className="tl-btn" style={{ flexShrink: 0 }} onClick={toDate}>▷</button>
          </div>
          <div className="tl-out" style={{ marginTop: 8, minHeight: 52 }}>{dateOut}</div>
        </div>
        <div>
          <div className="tl-lbl">Date / Time → Unix Timestamp</div>
          <div className="tl-row">
            <input className="tl-inp" type="datetime-local" style={{ flex: 1 }}
              value={dt} onChange={e => setDt(e.target.value)} />
            <button className="tl-btn" style={{ flexShrink: 0 }} onClick={dateToTs}>▷</button>
          </div>
          <div className="tl-out" style={{ marginTop: 8, minHeight: 52 }}>{unixOut}</div>
        </div>
      </div>
      <div className="tl-sep" />
      <div>
        <div className="tl-lbl">JWT Claims Timestamp Analyzer — paste payload JSON</div>
        <textarea className="tl-inp" rows={3}
          placeholder={'{"iat":1700000000,"exp":1700003600,"nbf":1699999000}'}
          value={claims} onChange={e => setClaims(e.target.value)} />
      </div>
      <button className="tl-btn" onClick={analyzeClaims}>▷ ANALYZE CLAIMS</button>
      <div className="tl-out">{claimsOut}</div>
    </div>
  )
}
