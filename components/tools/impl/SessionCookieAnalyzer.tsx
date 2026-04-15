'use client'
import { useState } from 'react'

const SAMPLE_HEADERS = `Set-Cookie: sessionid=abc123xyz; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=3600
Set-Cookie: csrf_token=def456; Path=/; SameSite=Strict
Set-Cookie: remember_me=true; Path=/; Max-Age=2592000
Set-Cookie: access_token=eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyIn0.sig; Path=/api; HttpOnly`

interface ParsedCookie {
  name: string; value: string; httpOnly: boolean; secure: boolean;
  sameSite: string; maxAge: number | null; expires: string | null;
  path: string; domain: string; issues: string[]
}

function parseCookie(header: string): ParsedCookie | null {
  const trimmed = header.replace(/^Set-Cookie:\s*/i, '').trim()
  if (!trimmed) return null
  const parts = trimmed.split(';').map(p => p.trim())
  const [nameVal, ...attrs] = parts
  const eqIdx = nameVal.indexOf('=')
  const name = eqIdx >= 0 ? nameVal.slice(0, eqIdx) : nameVal
  const value = eqIdx >= 0 ? nameVal.slice(eqIdx + 1) : ''

  const c: ParsedCookie = { name, value: value.slice(0, 20) + (value.length > 20 ? '…' : ''), httpOnly: false, secure: false, sameSite: 'None', maxAge: null, expires: null, path: '/', domain: '', issues: [] }
  for (const attr of attrs) {
    const lower = attr.toLowerCase()
    if (lower === 'httponly') c.httpOnly = true
    else if (lower === 'secure') c.secure = true
    else if (lower.startsWith('samesite=')) c.sameSite = attr.split('=')[1]
    else if (lower.startsWith('max-age=')) c.maxAge = parseInt(attr.split('=')[1])
    else if (lower.startsWith('expires=')) c.expires = attr.split('=').slice(1).join('=')
    else if (lower.startsWith('path=')) c.path = attr.split('=')[1]
    else if (lower.startsWith('domain=')) c.domain = attr.split('=')[1]
  }

  if (!c.httpOnly) c.issues.push('Missing HttpOnly — accessible via JavaScript (XSS risk)')
  if (!c.secure) c.issues.push('Missing Secure — will be sent over HTTP')
  if (c.sameSite === 'None' && c.secure) c.issues.push('SameSite=None — CSRF risk unless cross-site is intentional')
  if (!c.sameSite || c.sameSite === 'None') c.issues.push('SameSite not set or None — consider Lax or Strict')
  if (c.maxAge && c.maxAge > 86400 * 30) c.issues.push(`Long session: ${Math.floor(c.maxAge / 86400)} days — consider shorter lifetime`)
  if (value.startsWith('eyJ')) c.issues.push('Value looks like a JWT — consider validating server-side')
  return c
}

export default function SessionCookieAnalyzer() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState<React.ReactNode>(<span className="tl-out-placeholder">// Cookie analysis will appear here</span>)

  function analyze() {
    const lines = input.split('\n').filter(l => l.trim())
    if (!lines.length) { setOutput(<span className="tl-err">✕ Paste Set-Cookie header(s)</span>); return }
    const cookies = lines.map(parseCookie).filter(Boolean) as ParsedCookie[]
    if (!cookies.length) { setOutput(<span className="tl-err">✕ No valid Set-Cookie headers found</span>); return }
    setOutput(
      <div>
        <div className="tl-ok">✓ {cookies.length} COOKIE{cookies.length !== 1 ? 'S' : ''} ANALYZED</div>
        {cookies.map((c, i) => (
          <div key={i} style={{ marginTop: 14 }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--amber)' }}>{c.name}</div>
            <div style={{ fontSize: 11, marginTop: 4, lineHeight: 1.7 }}>
              <div><span style={{ color: c.httpOnly ? 'var(--em)' : 'var(--text3)' }}>{c.httpOnly ? '✓' : '✕'}</span> HttpOnly</div>
              <div><span style={{ color: c.secure ? 'var(--em)' : 'var(--text3)' }}>{c.secure ? '✓' : '✕'}</span> Secure</div>
              <div>SameSite: <span style={{ color: c.sameSite === 'Strict' ? 'var(--em)' : c.sameSite === 'Lax' ? 'var(--blue)' : 'var(--amber)' }}>{c.sameSite}</span></div>
              {c.maxAge !== null && <div>Max-Age: {c.maxAge}s ({Math.round(c.maxAge / 3600)}h)</div>}
              {c.expires && <div>Expires: {c.expires}</div>}
              <div>Path: {c.path} {c.domain ? `Domain: ${c.domain}` : ''}</div>
            </div>
            {c.issues.length > 0 && (
              <div style={{ marginTop: 6 }}>
                {c.issues.map((iss, j) => <div key={j} className="tl-warn" style={{ fontSize: 10, marginBottom: 2 }}>⚠ {iss}</div>)}
              </div>
            )}
            {c.issues.length === 0 && <div className="tl-ok" style={{ fontSize: 10, marginTop: 4 }}>✓ No issues found</div>}
            {i < cookies.length - 1 && <div className="tl-sep" style={{ marginTop: 10 }} />}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="tl">
      <div>
        <div className="tl-lbl">Set-Cookie Header(s) <span style={{ color: 'var(--text4)' }}>(one per line, with or without &quot;Set-Cookie:&quot; prefix)</span></div>
        <textarea className="tl-inp" rows={7} placeholder="Set-Cookie: sessionid=abc; HttpOnly; Secure; SameSite=Lax"
          value={input} onChange={e => setInput(e.target.value)} />
      </div>
      <div className="tl-row-btns">
        <button className="tl-btn" onClick={analyze}>▷ ANALYZE COOKIES</button>
        <button className="tl-btn-ghost" onClick={() => setInput(SAMPLE_HEADERS)}>LOAD SAMPLES</button>
      </div>
      <div className="tl-out">{output}</div>
    </div>
  )
}
