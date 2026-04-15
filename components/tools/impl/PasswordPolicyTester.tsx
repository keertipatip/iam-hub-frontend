'use client'
import { useState } from 'react'

interface Rule { id: string; name: string; desc: string; test: (p: string) => boolean }

const RULES: Record<string, Rule[]> = {
  NIST: [
    { id: 'n1', name: 'Min 8 chars', desc: '≥ 8 characters', test: p => p.length >= 8 },
    { id: 'n2', name: 'Min 12 recommended', desc: 'NIST SP 800-63B recommends 12+', test: p => p.length >= 12 },
    { id: 'n3', name: 'Max 64 chars', desc: 'Must allow up to 64 characters', test: p => p.length <= 64 },
    { id: 'n4', name: 'No leading/trailing spaces', desc: 'Spaces allowed in middle only', test: p => p === p.trim() },
    { id: 'n5', name: 'Not common password', desc: 'Must not be "password", "123456" etc.', test: p => !['password','123456','qwerty','abc123','letmein','admin'].includes(p.toLowerCase()) },
  ],
  OWASP: [
    { id: 'o1', name: 'Min 12 chars', desc: 'OWASP recommends ≥ 12 characters', test: p => p.length >= 12 },
    { id: 'o2', name: 'Uppercase letter', desc: 'At least one uppercase (A-Z)', test: p => /[A-Z]/.test(p) },
    { id: 'o3', name: 'Lowercase letter', desc: 'At least one lowercase (a-z)', test: p => /[a-z]/.test(p) },
    { id: 'o4', name: 'Digit', desc: 'At least one digit (0-9)', test: p => /\d/.test(p) },
    { id: 'o5', name: 'Special char', desc: 'At least one special char (!@#$%^&*)', test: p => /[^A-Za-z0-9]/.test(p) },
    { id: 'o6', name: 'No sequences', desc: 'No keyboard walks (qwerty, 1234)', test: p => !/(?:abcd|bcde|cdef|defg|1234|2345|3456|4567|qwer|wert|erty|asdf|zxcv)/i.test(p) },
  ],
  PCI: [
    { id: 'p1', name: 'Min 7 chars (legacy PCI 3.2)', desc: '≥ 7 chars for PCI DSS 3.2', test: p => p.length >= 7 },
    { id: 'p2', name: 'Min 12 chars (PCI 4.0)', desc: '≥ 12 chars for PCI DSS 4.0', test: p => p.length >= 12 },
    { id: 'p3', name: 'Numeric + alpha', desc: 'Mix of letters and numbers', test: p => /[A-Za-z]/.test(p) && /\d/.test(p) },
  ],
  HIPAA: [
    { id: 'h1', name: 'Min 8 chars', desc: 'Min 8 characters', test: p => p.length >= 8 },
    { id: 'h2', name: 'Uppercase letter', desc: 'At least one uppercase', test: p => /[A-Z]/.test(p) },
    { id: 'h3', name: 'Lowercase letter', desc: 'At least one lowercase', test: p => /[a-z]/.test(p) },
    { id: 'h4', name: 'Digit', desc: 'At least one digit', test: p => /\d/.test(p) },
    { id: 'h5', name: 'Special char', desc: 'At least one special char', test: p => /[^A-Za-z0-9]/.test(p) },
  ],
}

function entropy(p: string): number {
  let pool = 0
  if (/[a-z]/.test(p)) pool += 26
  if (/[A-Z]/.test(p)) pool += 26
  if (/\d/.test(p)) pool += 10
  if (/[^A-Za-z0-9]/.test(p)) pool += 32
  return Math.round(p.length * Math.log2(pool || 1))
}

export default function PasswordPolicyTester() {
  const [pass, setPass] = useState('')
  const [show, setShow] = useState(false)
  const [profile, setProfile] = useState<keyof typeof RULES>('OWASP')
  const [output, setOutput] = useState<React.ReactNode>(<span className="tl-out-placeholder">// Policy check results will appear here</span>)

  function test(p = pass) {
    if (!p) { setOutput(<span className="tl-out-placeholder">// Enter a password to test</span>); return }
    const rules = RULES[profile]
    const results = rules.map(r => ({ ...r, pass: r.test(p) }))
    const passed = results.filter(r => r.pass).length
    const ent = entropy(p)
    const strength = ent < 30 ? ['VERY WEAK', '#ff3344'] : ent < 50 ? ['WEAK', 'var(--amber)'] : ent < 80 ? ['MODERATE', 'var(--blue)'] : ent < 120 ? ['STRONG', 'var(--em)'] : ['VERY STRONG', 'var(--em)']
    setOutput(
      <div>
        <div style={{ marginBottom: 10 }}>
          <span style={{ color: passed === rules.length ? 'var(--em)' : 'var(--amber)' }}>
            {passed}/{rules.length} rules passed
          </span>
          <span style={{ marginLeft: 16, color: 'var(--text3)' }}>{ent} bits entropy</span>
          <span style={{ marginLeft: 16, color: strength[1] }}>{strength[0]}</span>
        </div>
        {results.map(r => (
          <div key={r.id} style={{ display: 'flex', gap: 10, marginBottom: 4, fontSize: 11 }}>
            <span style={{ color: r.pass ? 'var(--em)' : '#ff3344', minWidth: 14 }}>{r.pass ? '✓' : '✕'}</span>
            <span style={{ color: r.pass ? 'var(--text)' : 'var(--text3)' }}>{r.name}</span>
            <span style={{ color: 'var(--text4)', fontSize: 10 }}>— {r.desc}</span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="tl">
      <div className="tl-grid2">
        <div>
          <div className="tl-lbl">Password to test</div>
          <div className="tl-row">
            <input className="tl-inp" type={show ? 'text' : 'password'} style={{ flex: 1 }}
              placeholder="Enter password…" value={pass} onChange={e => { setPass(e.target.value); test(e.target.value) }} />
            <button className="tl-btn-ghost" style={{ flexShrink: 0 }} onClick={() => setShow(!show)}>{show ? 'HIDE' : 'SHOW'}</button>
          </div>
        </div>
        <div>
          <div className="tl-lbl">Policy Profile</div>
          <select className="tl-sel" value={profile} onChange={e => { setProfile(e.target.value as keyof typeof RULES); test(pass) }}>
            <option value="NIST">NIST SP 800-63B</option>
            <option value="OWASP">OWASP</option>
            <option value="PCI">PCI DSS 4.0</option>
            <option value="HIPAA">HIPAA</option>
          </select>
        </div>
      </div>
      <button className="tl-btn" onClick={() => test()}>▷ TEST PASSWORD</button>
      <div className="tl-out">{output}</div>
    </div>
  )
}
