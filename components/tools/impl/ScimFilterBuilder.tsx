'use client'
import { useState } from 'react'
import { copyToClipboard } from '@/utils/toolCrypto'

type Comp = 'eq' | 'ne' | 'co' | 'sw' | 'ew' | 'gt' | 'lt' | 'ge' | 'le' | 'pr'
interface Cond { attr: string; op: Comp; val: string }

const ATTRS = ['userName', 'emails.value', 'displayName', 'active', 'id', 'externalId', 'groups.value', 'title', 'department', 'meta.resourceType', 'meta.lastModified']
const OPS: { val: Comp; label: string }[] = [
  { val: 'eq', label: 'eq — equal' }, { val: 'ne', label: 'ne — not equal' },
  { val: 'co', label: 'co — contains' }, { val: 'sw', label: 'sw — starts with' },
  { val: 'ew', label: 'ew — ends with' }, { val: 'gt', label: 'gt — greater' },
  { val: 'lt', label: 'lt — less' }, { val: 'ge', label: 'ge — ≥' },
  { val: 'le', label: 'le — ≤' }, { val: 'pr', label: 'pr — present (no value)' },
]

function buildFilter(conds: Cond[], logic: 'and' | 'or'): string {
  const parts = conds.filter(c => c.attr && (c.op === 'pr' || c.val)).map(c => {
    if (c.op === 'pr') return `${c.attr} pr`
    const needsQuote = !/^\d+$/.test(c.val) && c.val !== 'true' && c.val !== 'false'
    return `${c.attr} ${c.op} ${needsQuote ? `"${c.val}"` : c.val}`
  })
  if (parts.length === 0) return ''
  if (parts.length === 1) return parts[0]
  return parts.map(p => `(${p})`).join(` ${logic} `)
}

const TEMPLATES: Cond[][] = [
  [{ attr: 'userName', op: 'sw', val: 'alice' }],
  [{ attr: 'active', op: 'eq', val: 'true' }, { attr: 'emails.value', op: 'co', val: '@example.com' }],
  [{ attr: 'groups.value', op: 'eq', val: 'admin-group-id' }],
  [{ attr: 'meta.lastModified', op: 'gt', val: '2024-01-01T00:00:00Z' }],
]

export default function ScimFilterBuilder() {
  const [conds, setConds] = useState<Cond[]>([{ attr: 'userName', op: 'eq', val: '' }])
  const [logic, setLogic] = useState<'and' | 'or'>('and')
  const [endpoint, setEndpoint] = useState('https://api.example.com/scim/v2/Users')
  const [output, setOutput] = useState<React.ReactNode>(<span className="tl-out-placeholder">// SCIM filter + URL will appear here</span>)

  function addRow() { setConds(c => [...c, { attr: 'userName', op: 'eq', val: '' }]) }
  function removeRow(i: number) { setConds(c => c.filter((_, idx) => idx !== i)) }
  function update(i: number, f: keyof Cond, v: string) { setConds(c => c.map((r, idx) => idx === i ? { ...r, [f]: v } : r)) }

  function build() {
    const filter = buildFilter(conds, logic)
    if (!filter) { setOutput(<span className="tl-err">✕ Add at least one condition</span>); return }
    const url = `${endpoint}?filter=${encodeURIComponent(filter)}&count=100`
    setOutput(
      <div>
        <div className="tl-ok">✓ SCIM FILTER</div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--em)', margin: '8px 0' }}>{filter}</div>
        <div className="tl-lbl" style={{ marginTop: 8 }}>Request URL</div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--blue)', wordBreak: 'break-all', margin: '4px 0 8px' }}>{url}</div>
        <div className="tl-row-btns">
          <button className="tl-btn-ghost" style={{ fontSize: 10 }} onClick={() => copyToClipboard(filter)}>⊡ COPY FILTER</button>
          <button className="tl-btn-ghost" style={{ fontSize: 10 }} onClick={() => copyToClipboard(url)}>⊡ COPY URL</button>
        </div>
      </div>
    )
  }

  return (
    <div className="tl">
      <div>
        <div className="tl-lbl">SCIM API Endpoint</div>
        <input className="tl-inp" value={endpoint} onChange={e => setEndpoint(e.target.value)} />
      </div>
      <div>
        <div className="tl-row-btns" style={{ marginBottom: 8 }}>
          <div className="tl-lbl" style={{ marginBottom: 0 }}>Logic:</div>
          {(['and', 'or'] as const).map(l => (
            <label key={l} style={{ fontFamily: 'var(--mono)', fontSize: 11, cursor: 'pointer', color: logic === l ? 'var(--em)' : 'var(--text2)', marginLeft: 8 }}>
              <input type="radio" name="logic" checked={logic === l} onChange={() => setLogic(l)} /> {l.toUpperCase()}
            </label>
          ))}
        </div>
        {conds.map((c, i) => (
          <div key={i} className="tl-row" style={{ marginBottom: 6, alignItems: 'center' }}>
            <select className="tl-sel" style={{ flex: 2 }} value={c.attr} onChange={e => update(i, 'attr', e.target.value)}>
              {ATTRS.map(a => <option key={a}>{a}</option>)}
            </select>
            <select className="tl-sel" style={{ flex: 1.5 }} value={c.op} onChange={e => update(i, 'op', e.target.value as Comp)}>
              {OPS.map(o => <option key={o.val} value={o.val}>{o.label}</option>)}
            </select>
            {c.op !== 'pr' && <input className="tl-inp" style={{ flex: 2 }} value={c.val}
              onChange={e => update(i, 'val', e.target.value)} placeholder="value" />}
            {conds.length > 1 && <button className="tl-btn-ghost" style={{ flexShrink: 0 }} onClick={() => removeRow(i)}>✕</button>}
          </div>
        ))}
      </div>
      <div className="tl-row-btns">
        <button className="tl-btn" onClick={build}>▷ BUILD FILTER</button>
        <button className="tl-btn-ghost" onClick={addRow}>+ ADD CONDITION</button>
      </div>
      <div className="tl-out">{output}</div>
      <div>
        <div className="tl-lbl" style={{ marginTop: 8 }}>Quick templates</div>
        <div className="tl-row-btns">
          {TEMPLATES.map((t, i) => (
            <button key={i} className="tl-btn-ghost" onClick={() => setConds(t)}>Template {i + 1}</button>
          ))}
        </div>
      </div>
    </div>
  )
}
