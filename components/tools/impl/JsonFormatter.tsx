'use client'
import { useState } from 'react'
import { copyToClipboard } from '@/utils/toolCrypto'

function sortKeys(obj: unknown): unknown {
  if (Array.isArray(obj)) return obj.map(sortKeys)
  if (obj && typeof obj === 'object') {
    return Object.fromEntries(Object.keys(obj as object).sort().map(k => [k, sortKeys((obj as Record<string,unknown>)[k])]))
  }
  return obj
}

export default function JsonFormatter() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [stats, setStats] = useState<React.ReactNode>(<span className="tl-out-placeholder">// Stats will appear here</span>)

  function doFormat() {
    try {
      const parsed = JSON.parse(input)
      const result = JSON.stringify(parsed, null, 2)
      setOutput(result)
      const keys = JSON.stringify(parsed).match(/"[^"]+"\s*:/g)?.length ?? 0
      setStats(<span className="tl-ok">✓ Valid JSON — {result.split('\n').length} lines · {keys} keys · {result.length} chars</span>)
    } catch (e) { setStats(<span className="tl-err">✕ Invalid JSON: {String(e)}</span>) }
  }

  function doMinify() {
    try {
      const result = JSON.stringify(JSON.parse(input))
      setOutput(result)
      setStats(<span className="tl-ok">✓ Minified — {result.length} chars</span>)
    } catch (e) { setStats(<span className="tl-err">✕ Invalid JSON: {String(e)}</span>) }
  }

  function doValidate() {
    try { JSON.parse(input); setStats(<span className="tl-ok">✓ Valid JSON</span>) }
    catch (e) { setStats(<span className="tl-err">✕ Invalid JSON: {String(e)}</span>) }
  }

  function doSortKeys() {
    try {
      const result = JSON.stringify(sortKeys(JSON.parse(input)), null, 2)
      setOutput(result)
      setStats(<span className="tl-ok">✓ Keys sorted alphabetically</span>)
    } catch (e) { setStats(<span className="tl-err">✕ Invalid JSON: {String(e)}</span>) }
  }

  return (
    <div className="tl">
      <div className="tl-row-btns">
        <button className="tl-btn" onClick={doFormat}>▷ FORMAT / PRETTY PRINT</button>
        <button className="tl-btn-ghost" onClick={doMinify}>MINIFY</button>
        <button className="tl-btn-ghost" onClick={doValidate}>VALIDATE</button>
        <button className="tl-btn-ghost" onClick={doSortKeys}>SORT KEYS</button>
        <button className="tl-btn-ghost" onClick={() => { setInput(''); setOutput(''); setStats(<span className="tl-out-placeholder">// Stats will appear here</span>) }}>CLEAR</button>
      </div>
      <div className="tl-grid2" style={{ alignItems: 'start' }}>
        <div>
          <div className="tl-lbl">Input JSON</div>
          <textarea className="tl-inp" rows={16} placeholder={'Paste JSON here…\n{"key":"value","nested":{"a":1}}'}
            value={input} onChange={e => setInput(e.target.value)} />
        </div>
        <div>
          <div className="tl-lbl">Output</div>
          <textarea className="tl-inp" rows={16} readOnly value={output}
            style={{ color: 'var(--em)', cursor: 'default' }} />
          {output && <button className="tl-btn-ghost" style={{ marginTop: 6, fontSize: 10 }}
            onClick={() => copyToClipboard(output)}>⊡ COPY</button>}
        </div>
      </div>
      <div className="tl-out" style={{ minHeight: 34 }}>{stats}</div>
    </div>
  )
}
