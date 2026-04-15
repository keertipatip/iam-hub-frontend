'use client'
import { useState } from 'react'

const DEFAULT_POLICY = `{
  "version": "1.0",
  "rules": [
    {
      "id": "admin-full-access",
      "effect": "allow",
      "conditions": { "role": "admin" }
    },
    {
      "id": "user-read-own",
      "effect": "allow",
      "conditions": { "role": "user", "action": "read" }
    },
    {
      "id": "deny-delete",
      "effect": "deny",
      "conditions": { "action": "delete", "role": "viewer" }
    }
  ],
  "default": "deny"
}`

const DEFAULT_CTX = `{
  "subject": {
    "id": "user-123",
    "role": "admin",
    "groups": ["engineering", "iam-team"]
  },
  "resource": {
    "type": "document",
    "id": "doc-456",
    "owner": "user-123"
  },
  "action": "read",
  "environment": {
    "ip": "10.0.0.1",
    "time": "2024-01-01T09:00:00Z"
  }
}`

function evaluate(policy: unknown, ctx: Record<string, unknown>): { effect: string; matchedRule: string | null; trace: string[] } {
  const p = policy as { rules?: Array<{ id: string; effect: string; conditions: Record<string, unknown> }>; default?: string }
  const trace: string[] = []
  const subject = ctx.subject as Record<string, unknown> || {}
  const resource = ctx.resource as Record<string, unknown> || {}

  for (const rule of (p.rules || [])) {
    const conds = rule.conditions || {}
    let match = true
    for (const [k, v] of Object.entries(conds)) {
      const subjectVal = subject[k]
      const ctxVal = (ctx as Record<string, unknown>)[k]
      const actual = subjectVal ?? ctxVal
      if (actual !== v) { match = false; trace.push(`  rule "${rule.id}": ${k} = "${actual}" ≠ "${v}" — SKIP`); break }
    }
    if (match) {
      trace.push(`  rule "${rule.id}": all conditions match → ${rule.effect.toUpperCase()}`)
      return { effect: rule.effect, matchedRule: rule.id, trace }
    }
  }
  trace.push(`  no rules matched → default: ${p.default || 'deny'}`)
  return { effect: p.default || 'deny', matchedRule: null, trace }
}

export default function PolicyEvaluator() {
  const [policy, setPolicy] = useState(DEFAULT_POLICY)
  const [ctx, setCtx] = useState(DEFAULT_CTX)
  const [output, setOutput] = useState<React.ReactNode>(<span className="tl-out-placeholder">// Evaluation result will appear here</span>)

  function evaluate_() {
    try {
      const p = JSON.parse(policy)
      const c = JSON.parse(ctx)
      const { effect, matchedRule, trace } = evaluate(p, c)
      const isAllow = effect === 'allow'
      setOutput(
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: isAllow ? 'var(--em)' : '#ff3344' }}>
            {isAllow ? '✓ ALLOW' : '✕ DENY'}
          </div>
          {matchedRule && <div style={{ marginTop: 4, fontSize: 11 }}>Matched rule: <span style={{ color: 'var(--amber)' }}>{matchedRule}</span></div>}
          <div className="tl-lbl" style={{ marginTop: 12 }}>EVALUATION TRACE</div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, marginTop: 6, lineHeight: 1.8, color: 'var(--text2)' }}>
            {trace.map((t, i) => <div key={i}>{t}</div>)}
          </div>
        </div>
      )
    } catch (e) { setOutput(<span className="tl-err">✕ Invalid JSON: {String(e)}</span>) }
  }

  return (
    <div className="tl">
      <div className="tl-grid2">
        <div>
          <div className="tl-lbl">Policy (JSON)</div>
          <textarea className="tl-inp" rows={14} value={policy} onChange={e => setPolicy(e.target.value)} />
        </div>
        <div>
          <div className="tl-lbl">Request Context (JSON)</div>
          <textarea className="tl-inp" rows={14} value={ctx} onChange={e => setCtx(e.target.value)} />
        </div>
      </div>
      <button className="tl-btn" onClick={evaluate_}>▷ EVALUATE POLICY</button>
      <div className="tl-out">{output}</div>
    </div>
  )
}
