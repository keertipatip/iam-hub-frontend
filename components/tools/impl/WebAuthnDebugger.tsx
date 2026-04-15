'use client'
import { useState } from 'react'
import { toBase64url, copyToClipboard } from '@/utils/toolCrypto'

export default function WebAuthnDebugger() {
  const [rpId, setRpId] = useState(typeof window !== 'undefined' ? window.location.hostname : 'localhost')
  const [username, setUsername] = useState('alice@example.com')
  const [displayName, setDisplayName] = useState('Alice Smith')
  const [tab, setTab] = useState<'register' | 'json'>('register')
  const [jsonInput, setJsonInput] = useState('')
  const [output, setOutput] = useState<React.ReactNode>(<span className="tl-out-placeholder">// Results will appear here</span>)

  async function doRegister() {
    const challenge = crypto.getRandomValues(new Uint8Array(32))
    const userId = crypto.getRandomValues(new Uint8Array(16))
    const options: PublicKeyCredentialCreationOptions = {
      challenge,
      rp: { name: rpId, id: rpId },
      user: { id: userId, name: username, displayName },
      pubKeyCredParams: [
        { type: 'public-key', alg: -7 },   // ES256
        { type: 'public-key', alg: -257 },  // RS256
      ],
      authenticatorSelection: { residentKey: 'preferred', userVerification: 'preferred' },
      timeout: 60000,
    }

    try {
      const cred = await navigator.credentials.create({ publicKey: options }) as PublicKeyCredential
      const ar = cred.response as AuthenticatorAttestationResponse
      const info = {
        id: cred.id,
        rawId: toBase64url(cred.rawId),
        type: cred.type,
        clientDataJSON: JSON.parse(new TextDecoder().decode(ar.clientDataJSON)),
        attestationObject_length: ar.attestationObject.byteLength,
        publicKeyAlg: ar.getPublicKeyAlgorithm ? ar.getPublicKeyAlgorithm() : 'N/A',
      }
      setOutput(
        <div>
          <div className="tl-ok">✓ WEBAUTHN REGISTRATION SUCCESS</div>
          <pre style={{ fontSize: 10, color: 'var(--em)', margin: '8px 0', whiteSpace: 'pre-wrap' }}>{JSON.stringify(info, null, 2)}</pre>
          <button className="tl-btn-ghost" style={{ fontSize: 10 }}
            onClick={() => copyToClipboard(JSON.stringify(info, null, 2))}>⊡ COPY</button>
        </div>
      )
    } catch (e) {
      const msg = String(e)
      if (msg.includes('NotAllowedError') || msg.includes('cancelled')) {
        setOutput(<div className="tl-warn">⚠ Cancelled by user or timed out</div>)
      } else if (msg.includes('NotSupportedError')) {
        setOutput(<div className="tl-err">✕ WebAuthn not supported on this device/browser</div>)
      } else {
        setOutput(<div className="tl-err">✕ {msg}</div>)
      }
    }
  }

  async function doAuthenticate() {
    const challenge = crypto.getRandomValues(new Uint8Array(32))
    const options: PublicKeyCredentialRequestOptions = {
      challenge,
      rpId,
      userVerification: 'preferred',
      timeout: 60000,
    }
    try {
      const cred = await navigator.credentials.get({ publicKey: options }) as PublicKeyCredential
      const ar = cred.response as AuthenticatorAssertionResponse
      const info = {
        id: cred.id,
        rawId: toBase64url(cred.rawId),
        clientDataJSON: JSON.parse(new TextDecoder().decode(ar.clientDataJSON)),
        signature_length: ar.signature.byteLength,
        userHandle: ar.userHandle ? toBase64url(ar.userHandle) : null,
      }
      setOutput(
        <div>
          <div className="tl-ok">✓ WEBAUTHN AUTHENTICATION SUCCESS</div>
          <pre style={{ fontSize: 10, color: 'var(--em)', margin: '8px 0', whiteSpace: 'pre-wrap' }}>{JSON.stringify(info, null, 2)}</pre>
        </div>
      )
    } catch (e) { setOutput(<div className="tl-err">✕ {String(e)}</div>) }
  }

  function analyzeJson() {
    try {
      const obj = JSON.parse(jsonInput)
      const rows: React.ReactNode[] = []
      if (obj.id) rows.push(<div key="id"><span style={{ color: 'var(--amber)' }}>Credential ID:</span> {obj.id}</div>)
      if (obj.type) rows.push(<div key="type"><span style={{ color: 'var(--amber)' }}>Type:</span> {obj.type}</div>)
      if (obj.clientDataJSON?.type) rows.push(<div key="ctype"><span style={{ color: 'var(--amber)' }}>ClientData type:</span> {obj.clientDataJSON.type}</div>)
      if (obj.clientDataJSON?.origin) rows.push(<div key="origin"><span style={{ color: 'var(--amber)' }}>Origin:</span> {obj.clientDataJSON.origin}</div>)
      if (obj.publicKeyAlg) rows.push(<div key="alg"><span style={{ color: 'var(--amber)' }}>Algorithm:</span> {obj.publicKeyAlg === -7 ? '-7 (ES256)' : obj.publicKeyAlg === -257 ? '-257 (RS256)' : obj.publicKeyAlg}</div>)
      setOutput(rows.length > 0 ? <div className="tl-ok" style={{ gap: 4, display: 'flex', flexDirection: 'column' }}>✓ {rows}</div> : <span className="tl-warn">⚠ No recognizable WebAuthn fields found</span>)
    } catch (e) { setOutput(<span className="tl-err">✕ Invalid JSON: {String(e)}</span>) }
  }

  const tabStyle = (t: 'register' | 'json') => ({
    fontFamily: 'var(--mono)', fontSize: 10, padding: '5px 14px', cursor: 'pointer',
    borderBottom: tab === t ? '2px solid var(--em)' : '2px solid transparent',
    color: tab === t ? 'var(--em)' : 'var(--text3)', background: 'none', border: 'none',
    borderBottomStyle: 'solid' as const, borderBottomWidth: 2, borderBottomColor: tab === t ? 'var(--em)' : 'transparent',
  })

  return (
    <div className="tl">
      <div style={{ borderBottom: '1px solid var(--border)', marginBottom: 14 }}>
        <button style={tabStyle('register')} onClick={() => setTab('register')}>BROWSER TEST</button>
        <button style={tabStyle('json')} onClick={() => setTab('json')}>PARSE JSON</button>
      </div>
      {tab === 'register' ? (
        <>
          <div className="tl-grid2">
            <div><div className="tl-lbl">RP ID (domain)</div><input className="tl-inp" value={rpId} onChange={e => setRpId(e.target.value)} /></div>
            <div><div className="tl-lbl">Username</div><input className="tl-inp" value={username} onChange={e => setUsername(e.target.value)} /></div>
            <div><div className="tl-lbl">Display Name</div><input className="tl-inp" value={displayName} onChange={e => setDisplayName(e.target.value)} /></div>
          </div>
          <div className="tl-row-btns">
            <button className="tl-btn" onClick={doRegister}>▷ TEST REGISTRATION (create())</button>
            <button className="tl-btn-ghost" onClick={doAuthenticate}>▷ TEST AUTHENTICATION (get())</button>
          </div>
        </>
      ) : (
        <div>
          <div className="tl-lbl">Paste credential JSON to analyze</div>
          <textarea className="tl-inp" rows={8} placeholder={'{"id":"...","type":"public-key","clientDataJSON":{"type":"webauthn.create",...}}'}
            value={jsonInput} onChange={e => setJsonInput(e.target.value)} />
          <button className="tl-btn" style={{ marginTop: 8 }} onClick={analyzeJson}>▷ ANALYZE</button>
        </div>
      )}
      <div className="tl-out">{output}</div>
    </div>
  )
}
