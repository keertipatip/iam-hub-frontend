'use client'
import { useState } from 'react'
import { copyToClipboard } from '@/utils/toolCrypto'

const KNOWN: Record<string, Record<string, string>> = {
  google: {
    issuer: 'https://accounts.google.com',
    authorization_endpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
    token_endpoint: 'https://oauth2.googleapis.com/token',
    userinfo_endpoint: 'https://openidconnect.googleapis.com/v1/userinfo',
    jwks_uri: 'https://www.googleapis.com/oauth2/v3/certs',
    end_session_endpoint: 'https://accounts.google.com/logout',
    scopes_supported: 'openid email profile',
    response_types_supported: 'code token id_token',
    grant_types_supported: 'authorization_code implicit refresh_token',
    id_token_signing_alg_values_supported: 'RS256',
  },
  microsoft: {
    issuer: 'https://login.microsoftonline.com/{tenant}/v2.0',
    authorization_endpoint: 'https://login.microsoftonline.com/{tenant}/oauth2/v2.0/authorize',
    token_endpoint: 'https://login.microsoftonline.com/{tenant}/oauth2/v2.0/token',
    userinfo_endpoint: 'https://graph.microsoft.com/oidc/userinfo',
    jwks_uri: 'https://login.microsoftonline.com/{tenant}/discovery/v2.0/keys',
    end_session_endpoint: 'https://login.microsoftonline.com/{tenant}/oauth2/v2.0/logout',
    scopes_supported: 'openid email profile offline_access',
    id_token_signing_alg_values_supported: 'RS256',
  },
  okta: {
    issuer: 'https://{domain}/oauth2/default',
    authorization_endpoint: 'https://{domain}/oauth2/default/v1/authorize',
    token_endpoint: 'https://{domain}/oauth2/default/v1/token',
    userinfo_endpoint: 'https://{domain}/oauth2/default/v1/userinfo',
    jwks_uri: 'https://{domain}/oauth2/default/v1/keys',
    end_session_endpoint: 'https://{domain}/oauth2/default/v1/logout',
    introspection_endpoint: 'https://{domain}/oauth2/default/v1/introspect',
    revocation_endpoint: 'https://{domain}/oauth2/default/v1/revoke',
  },
  auth0: {
    issuer: 'https://{domain}/',
    authorization_endpoint: 'https://{domain}/authorize',
    token_endpoint: 'https://{domain}/oauth/token',
    userinfo_endpoint: 'https://{domain}/userinfo',
    jwks_uri: 'https://{domain}/.well-known/jwks.json',
    end_session_endpoint: 'https://{domain}/v2/logout',
    mfa_challenge_endpoint: 'https://{domain}/mfa/challenge',
  },
}

const KEY_HIGHLIGHTS = ['authorization_endpoint', 'token_endpoint', 'userinfo_endpoint', 'jwks_uri', 'end_session_endpoint', 'introspection_endpoint', 'issuer']

export default function OidcDiscoveryViewer() {
  const [url, setUrl] = useState('https://accounts.google.com')
  const [output, setOutput] = useState<React.ReactNode>(<span className="tl-out-placeholder">// Discovery document will appear here</span>)

  const discoveryUrl = `${url.replace(/\/$/, '')}/.well-known/openid-configuration`

  function render(doc: Record<string, unknown>) {
    const rows = Object.entries(doc).map(([k, v]) => {
      const isHighlight = KEY_HIGHLIGHTS.includes(k)
      return (
        <div key={k} style={{ display: 'flex', gap: 12, padding: '3px 0', borderBottom: '1px solid var(--border)', fontSize: 11 }}>
          <span style={{ color: isHighlight ? 'var(--em)' : 'var(--text3)', minWidth: 260, flexShrink: 0 }}>{k}</span>
          <span style={{ color: isHighlight ? 'var(--text)' : 'var(--text2)', wordBreak: 'break-all' }}>{JSON.stringify(v)}</span>
        </div>
      )
    })
    setOutput(
      <div>
        <div className="tl-ok" style={{ marginBottom: 10 }}>✓ Discovery document loaded ({Object.keys(doc).length} fields)</div>
        {rows}
        <button className="tl-btn-ghost" style={{ marginTop: 12, fontSize: 10 }}
          onClick={() => copyToClipboard(JSON.stringify(doc, null, 2))}>⊡ COPY JSON</button>
      </div>
    )
  }

  function load(provider: string) {
    const doc = KNOWN[provider]
    if (doc) render(doc as Record<string, unknown>)
  }

  async function fetchDoc() {
    setOutput(<span style={{ color: 'var(--text3)', fontFamily: 'var(--mono)', fontSize: 11 }}>// Fetching…</span>)
    try {
      const resp = await fetch(discoveryUrl)
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
      const doc = await resp.json()
      render(doc)
    } catch (e) {
      setOutput(
        <div>
          <div className="tl-warn">⚠ CORS blocked live fetch (browser security)</div>
          <div style={{ marginTop: 8, fontSize: 10, color: 'var(--text3)' }}>
            Run manually: <code style={{ color: 'var(--em)' }}>curl {discoveryUrl} | jq .</code>
          </div>
          <div style={{ fontSize: 10, color: 'var(--text4)', marginTop: 4 }}>Error: {String(e)}</div>
          <div style={{ marginTop: 12 }}>Use a pre-loaded provider above instead.</div>
        </div>
      )
    }
  }

  return (
    <div className="tl">
      <div>
        <div className="tl-lbl">Issuer URL</div>
        <div className="tl-row">
          <input className="tl-inp" value={url} style={{ flex: 1 }} onChange={e => setUrl(e.target.value)} />
          <button className="tl-btn" style={{ flexShrink: 0 }} onClick={fetchDoc}>▷ FETCH</button>
        </div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--blue)', marginTop: 6, wordBreak: 'break-all' }}>
          {discoveryUrl}
        </div>
      </div>
      <div>
        <div className="tl-lbl" style={{ marginTop: 4 }}>Known providers (pre-loaded)</div>
        <div className="tl-row-btns">
          {Object.keys(KNOWN).map(p => (
            <button key={p} className="tl-btn-ghost" onClick={() => load(p)}>
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <div className="tl-out" style={{ minHeight: 200 }}>{output}</div>
    </div>
  )
}
