'use client'
import { useState } from 'react'
import { copyToClipboard } from '@/utils/toolCrypto'

const DEFAULT_SRC = `{
  "email": "alice@corp.com",
  "given_name": "Alice",
  "family_name": "Smith",
  "groups": ["sg-admins","sg-viewers"],
  "department": "Engineering",
  "employee_id": "EMP-4421",
  "sub": "auth0|abc123"
}`

const DEFAULT_RULES = `email → mail
given_name → firstName
family_name → lastName
groups → roles
department → dept
sub → userId`

export default function ClaimsMapper() {
  const [src, setSrc] = useState(DEFAULT_SRC)
  const [rules, setRules] = useState(DEFAULT_RULES)
  const [output, setOutput] = useState<React.ReactNode>(<span className="tl-out-placeholder">// Mapped claims will appear here</span>)

  function map() {
    try {
      const srcObj = JSON.parse(src)
      const mapped: Record<string, unknown> = {}
      const unmapped: string[] = []

      for (const line of rules.split('\n')) {
        const trimmed = line.trim()
        if (!trimmed || !trimmed.includes('→')) continue
        const [from, to] = trimmed.split('→').map(s => s.trim())
        if (srcObj[from] !== undefined) {
          mapped[to] = srcObj[from]
        }
      }

      for (const k of Object.keys(srcObj)) {
        const hasMappingFrom = rules.split('\n').some(l => l.split('→')[0]?.trim() === k)
        if (!hasMappingFrom) unmapped.push(k)
      }

      const result = JSON.stringify(mapped, null, 2)
      setOutput(
        <div>
          <div className="tl-ok">✓ {Object.keys(mapped).length} CLAIMS MAPPED</div>
          <pre style={{ fontSize: 11, color: 'var(--em)', margin: '8px 0', whiteSpace: 'pre-wrap' }}>{result}</pre>
          {unmapped.length > 0 && (
            <div className="tl-warn" style={{ marginTop: 8, fontSize: 10 }}>
              ⚠ Unmapped source claims: {unmapped.join(', ')}
            </div>
          )}
          <button className="tl-btn-ghost" style={{ fontSize: 10, marginTop: 8 }}
            onClick={() => copyToClipboard(result)}>⊡ COPY JSON</button>
        </div>
      )
    } catch (e) { setOutput(<span className="tl-err">✕ Invalid JSON: {String(e)}</span>) }
  }

  return (
    <div className="tl">
      <div className="tl-grid2">
        <div>
          <div className="tl-lbl">Source Claims (IdP JSON)</div>
          <textarea className="tl-inp" rows={10} value={src} onChange={e => setSrc(e.target.value)} />
        </div>
        <div>
          <div className="tl-lbl">Mapping Rules <span style={{ color: 'var(--text4)', fontSize: 9 }}>(source → dest, one per line)</span></div>
          <textarea className="tl-inp" rows={10} value={rules} onChange={e => setRules(e.target.value)} />
        </div>
      </div>
      <button className="tl-btn" onClick={map}>▷ MAP CLAIMS</button>
      <div className="tl-out">{output}</div>
    </div>
  )
}
