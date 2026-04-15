'use client'
import { useState } from 'react'
import { copyToClipboard } from '@/utils/toolCrypto'

export default function LogoutUrlBuilder() {
  const [ep, setEp] = useState('https://auth.example.com/oidc/logout')
  const [redir, setRedir] = useState('https://app.example.com/loggedout')
  const [hint, setHint] = useState('')
  const [state, setState] = useState('')
  const [output, setOutput] = useState<React.ReactNode>(<span className="tl-out-placeholder">// Logout URL will appear here</span>)

  function build() {
    try {
      const url = new URL(ep)
      if (redir) url.searchParams.set('post_logout_redirect_uri', redir)
      if (hint) url.searchParams.set('id_token_hint', hint)
      if (state) url.searchParams.set('state', state)
      const built = url.toString()
      setOutput(
        <div>
          <div className="tl-ok">✓ LOGOUT URL BUILT</div>
          <div style={{ marginTop: 10, wordBreak: 'break-all', color: 'var(--blue)', fontSize: 11 }}>{built}</div>
          <button className="tl-btn-ghost" style={{ marginTop: 10, fontSize: 10 }}
            onClick={() => copyToClipboard(built)}>⊡ COPY URL</button>
        </div>
      )
    } catch (e) { setOutput(<span className="tl-err">✕ Invalid endpoint: {String(e)}</span>) }
  }

  return (
    <div className="tl">
      <div className="tl-grid2">
        <div>
          <div className="tl-lbl">end_session_endpoint</div>
          <input className="tl-inp" value={ep} onChange={e => setEp(e.target.value)} />
        </div>
        <div>
          <div className="tl-lbl">post_logout_redirect_uri</div>
          <input className="tl-inp" value={redir} onChange={e => setRedir(e.target.value)} />
        </div>
        <div>
          <div className="tl-lbl">id_token_hint (optional)</div>
          <input className="tl-inp" placeholder="Paste ID token…" value={hint} onChange={e => setHint(e.target.value)} />
        </div>
        <div>
          <div className="tl-lbl">state (optional)</div>
          <input className="tl-inp" placeholder="logout-csrf-state" value={state} onChange={e => setState(e.target.value)} />
        </div>
      </div>
      <button className="tl-btn" onClick={build}>▷ BUILD LOGOUT URL</button>
      <div className="tl-out">{output}</div>
    </div>
  )
}
