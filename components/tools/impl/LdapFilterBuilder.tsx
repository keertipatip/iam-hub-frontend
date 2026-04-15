'use client'
import { useState } from 'react'
import { copyToClipboard } from '@/utils/toolCrypto'

type Op = '=' | '~=' | '>=' | '<=' | '!='
interface Condition { attr: string; op: string; val: string }

const COMMON_ATTRS = ['cn', 'uid', 'mail', 'sn', 'givenName', 'objectClass', 'memberOf', 'sAMAccountName', 'userPrincipalName', 'department', 'title']

const TEMPLATES: Record<string, Condition[]> = {
  user: [{ attr: 'objectClass', op: '=', val: 'person' }, { attr: 'mail', op: '=', val: '*@example.com' }],
  group: [{ attr: 'objectClass', op: '=', val: 'groupOfNames' }, { attr: 'cn', op: '=', val: 'admins' }],
  disabled: [{ attr: 'objectClass', op: '=', val: 'user' }, { attr: 'userAccountControl', op: '=', val: '514' }],
  active_dir: [{ attr: 'objectClass', op: '=', val: 'user' }, { attr: 'sAMAccountName', op: '=', val: '*' }],
}

function buildFilter(conditions: Condition[], combiner: 'AND' | 'OR'): string {
  if (conditions.length === 0) return ''
  const parts = conditions.map(c => {
    const escaped = c.val.replace(/\\/g, '\\5c').replace(/\*/g, '\\2a').replace(/\(/g, '\\28').replace(/\)/g, '\\29')
    if (c.op === '!=') return `(!(${c.attr}=${escaped}))`
    return `(${c.attr}${c.op}${escaped})`
  })
  if (parts.length === 1) return parts[0]
  const op = combiner === 'AND' ? '&' : '|'
  return `(${op}${parts.join('')})`
}

export default function LdapFilterBuilder() {
  const [conditions, setConditions] = useState<Condition[]>([{ attr: 'objectClass', op: '=', val: 'person' }])
  const [combiner, setCombiner] = useState<'AND' | 'OR'>('AND')
  const [output, setOutput] = useState<React.ReactNode>(<span className="tl-out-placeholder">// Filter will appear here</span>)

  function addRow() { setConditions(c => [...c, { attr: 'cn', op: '=', val: '' }]) }
  function removeRow(i: number) { setConditions(c => c.filter((_, idx) => idx !== i)) }
  function update(i: number, field: keyof Condition, val: string) {
    setConditions(c => c.map((row, idx) => idx === i ? { ...row, [field]: val } : row))
  }

  function build() {
    const filter = buildFilter(conditions, combiner)
    if (!filter) { setOutput(<span className="tl-err">✕ Add at least one condition</span>); return }
    setOutput(
      <div>
        <div className="tl-ok">✓ LDAP FILTER</div>
        <div style={{ fontSize: 14, color: 'var(--em)', margin: '10px 0', fontFamily: 'var(--mono)', wordBreak: 'break-all' }}>{filter}</div>
        <div style={{ fontSize: 10, color: 'var(--text3)', marginBottom: 8 }}>
          ldapsearch usage:<br />
          <code style={{ color: 'var(--blue)' }}>ldapsearch -H ldap://ldap.example.com -b &quot;dc=example,dc=com&quot; &apos;{filter}&apos;</code>
        </div>
        <button className="tl-btn-ghost" style={{ fontSize: 10 }} onClick={() => copyToClipboard(filter)}>⊡ COPY FILTER</button>
      </div>
    )
  }

  function loadTemplate(key: string) {
    setConditions(TEMPLATES[key] || [{ attr: 'objectClass', op: '=', val: '' }])
  }

  return (
    <div className="tl">
      <div>
        <div className="tl-lbl">Combiner</div>
        <div className="tl-row-btns">
          <label style={{ fontFamily: 'var(--mono)', fontSize: 11, cursor: 'pointer', color: combiner === 'AND' ? 'var(--em)' : 'var(--text2)' }}>
            <input type="radio" name="combiner" checked={combiner === 'AND'} onChange={() => setCombiner('AND')} /> AND (&amp;)
          </label>
          <label style={{ fontFamily: 'var(--mono)', fontSize: 11, cursor: 'pointer', color: combiner === 'OR' ? 'var(--em)' : 'var(--text2)', marginLeft: 16 }}>
            <input type="radio" name="combiner" checked={combiner === 'OR'} onChange={() => setCombiner('OR')} /> OR (|)
          </label>
        </div>
      </div>
      <div>
        {conditions.map((c, i) => (
          <div key={i} className="tl-row" style={{ marginBottom: 6, alignItems: 'center' }}>
            <select className="tl-sel" style={{ flex: 2 }} value={c.attr}
              onChange={e => update(i, 'attr', e.target.value)}>
              {COMMON_ATTRS.map(a => <option key={a}>{a}</option>)}
              <option value={c.attr}>{COMMON_ATTRS.includes(c.attr) ? undefined : c.attr}</option>
            </select>
            <select className="tl-sel" style={{ flex: 1 }} value={c.op} onChange={e => update(i, 'op', e.target.value as Op)}>
              <option value="=">= (equals)</option>
              <option value="~=">~= (approx)</option>
              <option value=">=">≥</option>
              <option value="<=">≤</option>
              <option value="!=">!= (not)</option>
            </select>
            <input className="tl-inp" style={{ flex: 3 }} value={c.val}
              onChange={e => update(i, 'val', e.target.value)} placeholder="value (* for any)" />
            {conditions.length > 1 && <button className="tl-btn-ghost" style={{ flexShrink: 0 }} onClick={() => removeRow(i)}>✕</button>}
          </div>
        ))}
      </div>
      <div className="tl-row-btns">
        <button className="tl-btn" onClick={build}>▷ BUILD FILTER</button>
        <button className="tl-btn-ghost" onClick={addRow}>+ ADD CONDITION</button>
      </div>
      <div className="tl-out">{output}</div>
      <div>
        <div className="tl-lbl" style={{ marginTop: 8 }}>Templates</div>
        <div className="tl-row-btns">
          {Object.keys(TEMPLATES).map(k => (
            <button key={k} className="tl-btn-ghost" onClick={() => loadTemplate(k)}>
              {k.charAt(0).toUpperCase() + k.slice(1).replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
