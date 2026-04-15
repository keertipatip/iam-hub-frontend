'use client'
import { useState } from 'react'

const PATTERNS: Record<string, [string, string]> = {
  email: ['^[\\w.+\\-]+@[\\w\\-]+\\.[a-z]{2,}$', 'gi'],
  uuid: ['^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$', 'gi'],
  jwt: ['^eyJ[A-Za-z0-9_\\-]+\\.eyJ[A-Za-z0-9_\\-]+\\.[A-Za-z0-9_\\-]+$', 'g'],
  ipv4: ['^((25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(25[0-5]|2[0-4]\\d|[01]?\\d\\d?)$', 'g'],
  url: ['https?:\\/\\/[\\w\\-]+(\\.[\\w\\-]+)+[\\/\\w\\-._~:/?#\\[\\]@!$&\'()*+,;=%]*', 'gi'],
  username: ['^[a-zA-Z][a-zA-Z0-9._\\-]{2,30}$', 'gi'],
}

export default function RegexTester() {
  const [pattern, setPattern] = useState('')
  const [flags, setFlags] = useState('gi')
  const [testStr, setTestStr] = useState('')
  const [output, setOutput] = useState<React.ReactNode>(<span className="tl-out-placeholder">// Matches will appear here</span>)

  function test(p = pattern, f = flags, s = testStr) {
    if (!p) { setOutput(<span className="tl-out-placeholder">// Enter a pattern to test</span>); return }
    try {
      const rx = new RegExp(p, f)
      const matches = [...s.matchAll(new RegExp(p, f.includes('g') ? f : f + 'g'))]
      if (matches.length === 0) {
        setOutput(<span className="tl-warn">⚠ No matches found</span>)
      } else {
        setOutput(
          <div>
            <div className="tl-ok">✓ {matches.length} match{matches.length !== 1 ? 'es' : ''}</div>
            <div style={{ marginTop: 8 }}>
              {matches.map((m, i) => (
                <div key={i} style={{ marginBottom: 4 }}>
                  <span style={{ color: 'var(--amber)' }}>[{i + 1}]</span> &quot;{m[0]}&quot;
                  {m.index != null && <span style={{ color: 'var(--text3)' }}> @ pos {m.index}</span>}
                  {m.length > 1 && <div style={{ fontSize: 10, color: 'var(--text3)', marginLeft: 16 }}>
                    Groups: {m.slice(1).map((g, j) => `$${j + 1}="${g}"`).join(', ')}
                  </div>}
                </div>
              ))}
            </div>
          </div>
        )
      }
    } catch (e) {
      setOutput(<span className="tl-err">✕ Invalid regex: {String(e)}</span>)
    }
  }

  function load(key: string) {
    const [p, f] = PATTERNS[key]
    setPattern(p); setFlags(f)
    test(p, f, testStr)
  }

  return (
    <div className="tl">
      <div className="tl-row">
        <div className="tl-col">
          <div className="tl-lbl">Pattern</div>
          <input className="tl-inp" value={pattern}
            placeholder="e.g. ^[\\w.+-]+@[\\w-]+\\.[a-z]{2,}$"
            onChange={e => { setPattern(e.target.value); test(e.target.value, flags, testStr) }} />
        </div>
        <div style={{ width: 90 }}>
          <div className="tl-lbl">Flags</div>
          <input className="tl-inp" value={flags}
            onChange={e => { setFlags(e.target.value); test(pattern, e.target.value, testStr) }} />
        </div>
      </div>
      <div>
        <div className="tl-lbl">Test String</div>
        <textarea className="tl-inp" rows={5} placeholder="Enter text to test…"
          value={testStr} onChange={e => { setTestStr(e.target.value); test(pattern, flags, e.target.value) }} />
      </div>
      <div className="tl-out" style={{ minHeight: 52 }}>{output}</div>
      <div>
        <div className="tl-lbl">Common patterns</div>
        <div className="tl-row-btns">
          {Object.keys(PATTERNS).map(k => (
            <button key={k} className="tl-btn-ghost" onClick={() => load(k)}>{k.charAt(0).toUpperCase() + k.slice(1)}</button>
          ))}
        </div>
      </div>
    </div>
  )
}
