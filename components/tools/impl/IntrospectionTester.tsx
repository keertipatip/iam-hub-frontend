'use client'
import { useState } from 'react'
import { copyToClipboard } from '@/utils/toolCrypto'

export default function IntrospectionTester() {
  const [ep, setEp] = useState('https://auth.example.com/oauth/introspect')
  const [token, setToken] = useState('')
  const [cid, setCid] = useState('resource-server-001')
  const [secret, setSecret] = useState('')
  const [output, setOutput] = useState<React.ReactNode>(<span className="tl-out-placeholder">// curl + code snippets will appear here</span>)

  function build() {
    const basicAuth = btoa(`${cid}:${secret || 'client_secret'}`)
    const curl = `curl -X POST ${ep} \\
  -H "Authorization: Basic ${basicAuth}" \\
  -H "Content-Type: application/x-www-form-urlencoded" \\
  -d "token=${token || '<token>'}&token_type_hint=access_token"`

    const jsCode = `const resp = await fetch('${ep}', {
  method: 'POST',
  headers: {
    'Authorization': 'Basic ${basicAuth}',
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  body: new URLSearchParams({ token: '${token || '<token>'}', token_type_hint: 'access_token' }),
});
const data = await resp.json();
// Active token: { "active": true, "sub": "user-123", "exp": 1700003600, ... }
// Inactive:     { "active": false }`

    setOutput(
      <div>
        <div className="tl-lbl">cURL</div>
        <pre style={{ fontSize: 10, color: 'var(--em)', margin: '4px 0 10px', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{curl}</pre>
        <button className="tl-btn-ghost" style={{ fontSize: 10, marginBottom: 14 }} onClick={() => copyToClipboard(curl)}>⊡ COPY CURL</button>
        <div className="tl-lbl">JavaScript (fetch)</div>
        <pre style={{ fontSize: 10, color: 'var(--blue)', margin: '4px 0 10px', whiteSpace: 'pre-wrap' }}>{jsCode}</pre>
        <button className="tl-btn-ghost" style={{ fontSize: 10 }} onClick={() => copyToClipboard(jsCode)}>⊡ COPY JS</button>
      </div>
    )
  }

  return (
    <div className="tl">
      <div className="tl-grid2">
        <div>
          <div className="tl-lbl">Introspection Endpoint</div>
          <input className="tl-inp" value={ep} onChange={e => setEp(e.target.value)} />
        </div>
        <div>
          <div className="tl-lbl">Token to Introspect</div>
          <input className="tl-inp" placeholder="opaque or JWT token" value={token} onChange={e => setToken(e.target.value)} />
        </div>
        <div>
          <div className="tl-lbl">Client ID</div>
          <input className="tl-inp" value={cid} onChange={e => setCid(e.target.value)} />
        </div>
        <div>
          <div className="tl-lbl">Client Secret</div>
          <input className="tl-inp" type="password" placeholder="client_secret (for Basic auth)"
            value={secret} onChange={e => setSecret(e.target.value)} />
        </div>
      </div>
      <button className="tl-btn" onClick={build}>▷ GENERATE REQUEST SNIPPETS</button>
      <div className="tl-out" style={{ minHeight: 200 }}>{output}</div>
    </div>
  )
}
