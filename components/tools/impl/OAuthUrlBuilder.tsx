'use client'
import { useState, useEffect } from 'react'
import { pkceVerifier, pkceChallenge, randomHex, copyToClipboard } from '@/utils/toolCrypto'

export default function OAuthUrlBuilder() {
  const [ep, setEp] = useState('https://auth.example.com/oauth/authorize')
  const [rt, setRt] = useState('code')
  const [cid, setCid] = useState('my-app-client-001')
  const [redir, setRedir] = useState('https://app.example.com/callback')
  const [scope, setScope] = useState('openid profile email')
  const [state, setState] = useState('')
  const [output, setOutput] = useState<React.ReactNode>(<span className="tl-out-placeholder">// Built URL will appear here</span>)

  useEffect(() => { genState() }, [])

  function genState() { setState(randomHex(16)) }

  function build(s = state) {
    try {
      const url = new URL(ep)
      url.searchParams.set('response_type', rt)
      url.searchParams.set('client_id', cid)
      url.searchParams.set('redirect_uri', redir)
      if (scope) url.searchParams.set('scope', scope)
      if (s) url.searchParams.set('state', s)
      const built = url.toString()
      setOutput(
        <div>
          <div className="tl-ok">✓ URL BUILT</div>
          <div style={{ marginTop: 10, wordBreak: 'break-all', color: 'var(--blue)', fontSize: 11 }}>{built}</div>
          <button className="tl-btn-ghost" style={{ marginTop: 10, fontSize: 10 }}
            onClick={() => copyToClipboard(built)}>⊡ COPY URL</button>
        </div>
      )
    } catch (e) { setOutput(<span className="tl-err">✕ Invalid endpoint URL: {String(e)}</span>) }
  }

  async function addPkce() {
    const v = pkceVerifier(64)
    const c = await pkceChallenge(v)
    setOutput(
      <div>
        <div className="tl-ok">✓ PKCE PARAMS GENERATED — add to your URL</div>
        <div style={{ marginTop: 8 }}>
          <div><span style={{ color: 'var(--amber)' }}>code_challenge=</span>{c}</div>
          <div><span style={{ color: 'var(--amber)' }}>code_challenge_method=</span>S256</div>
          <div style={{ marginTop: 8 }}><span style={{ color: 'var(--text3)' }}>code_verifier (store locally):</span></div>
          <div style={{ color: 'var(--text)', fontSize: 10, wordBreak: 'break-all' }}>{v}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="tl">
      <div className="tl-grid2">
        <div>
          <div className="tl-lbl">Authorization Endpoint</div>
          <input className="tl-inp" value={ep} onChange={e => setEp(e.target.value)} />
        </div>
        <div>
          <div className="tl-lbl">Response Type</div>
          <select className="tl-sel" value={rt} onChange={e => { setRt(e.target.value); build() }}>
            <option value="code">code</option>
            <option value="token">token</option>
            <option value="id_token">id_token</option>
            <option value="code id_token">code id_token</option>
          </select>
        </div>
        <div>
          <div className="tl-lbl">Client ID</div>
          <input className="tl-inp" value={cid} onChange={e => setCid(e.target.value)} />
        </div>
        <div>
          <div className="tl-lbl">Redirect URI</div>
          <input className="tl-inp" value={redir} onChange={e => setRedir(e.target.value)} />
        </div>
        <div>
          <div className="tl-lbl">Scopes</div>
          <input className="tl-inp" value={scope} onChange={e => setScope(e.target.value)} />
        </div>
        <div>
          <div className="tl-lbl">State</div>
          <div className="tl-row">
            <input className="tl-inp" value={state} style={{ flex: 1 }} onChange={e => setState(e.target.value)} />
            <button className="tl-btn-ghost" style={{ flexShrink: 0, fontSize: 10 }} onClick={genState}>GEN</button>
          </div>
        </div>
      </div>
      <div className="tl-row-btns">
        <button className="tl-btn" onClick={() => build()}>▷ BUILD URL</button>
        <button className="tl-btn-ghost" onClick={addPkce}>+ ADD PKCE PARAMS</button>
      </div>
      <div className="tl-out">{output}</div>
    </div>
  )
}
