'use client'
import { useState } from 'react'

const SAMPLE_SAML = 'PHNhbWxwOlJlc3BvbnNlIHhtbG5zOnNhbWxwPSJ1cm46b2FzaXM6bmFtZXM6dGM6U0FNTDoyLjA6cHJvdG9jb2wiIHhtbG5zOnNhbWw9InVybjpvYXNpczpuYW1lczp0YzpTQU1MOjIuMDphc3NlcnRpb24iIElEPSJfYWJjMTIzIiBWZXJzaW9uPSIyLjAiIElzc3VlSW5zdGFudD0iMjAyNC0wMS0wMVQwMDowMDowMFoiIERlc3RpbmF0aW9uPSJodHRwczovL2FwcC5leGFtcGxlLmNvbS9zYW1sL2FjcyI+PHNhbWw6SXNzdWVyPmh0dHBzOi8vaWRwLmV4YW1wbGUuY29tL3NhbWwyPC9zYW1sOklzc3Vlcj48L3NhbWxwOlJlc3BvbnNlPg=='

export default function SamlDecoder() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState<React.ReactNode>(<span className="tl-out-placeholder">// Decoded fields will appear here</span>)

  function decode() {
    const raw = input.trim()
    if (!raw) { setOutput(<span className="tl-err">✕ Paste a SAML response</span>); return }

    let xmlStr = raw
    // Try base64 decode if needed
    if (!raw.trim().startsWith('<')) {
      try {
        const urlDecoded = decodeURIComponent(raw.replace(/\+/g, ' '))
        const padded = urlDecoded.padEnd(urlDecoded.length + (4 - urlDecoded.length % 4) % 4, '=')
        xmlStr = atob(padded.replace(/-/g, '+').replace(/_/g, '/'))
      } catch {
        try { xmlStr = atob(raw) } catch { xmlStr = raw }
      }
    }

    try {
      const parser = new DOMParser()
      const doc = parser.parseFromString(xmlStr, 'text/xml')
      if (doc.querySelector('parsererror')) {
        setOutput(<span className="tl-err">✕ Invalid XML in SAML response</span>); return
      }

      const ns = { saml: 'urn:oasis:names:tc:SAML:2.0:assertion', samlp: 'urn:oasis:names:tc:SAML:2.0:protocol' }
      const get = (tag: string) => doc.getElementsByTagNameNS('urn:oasis:names:tc:SAML:2.0:assertion', tag)[0]?.textContent ||
        doc.getElementsByTagNameNS('urn:oasis:names:tc:SAML:2.0:protocol', tag)[0]?.textContent || 'N/A'

      const root = doc.documentElement
      const issueInstant = root.getAttribute('IssueInstant') || 'N/A'
      const dest = root.getAttribute('Destination') || 'N/A'
      const status = doc.getElementsByTagNameNS('urn:oasis:names:tc:SAML:2.0:protocol', 'StatusCode')[0]?.getAttribute('Value') || 'N/A'

      const issuerEl = doc.getElementsByTagNameNS('urn:oasis:names:tc:SAML:2.0:assertion', 'Issuer')[0]
      const nameIdEl = doc.getElementsByTagNameNS('urn:oasis:names:tc:SAML:2.0:assertion', 'NameID')[0]

      const attrs: { name: string; value: string }[] = []
      const attrEls = doc.getElementsByTagNameNS('urn:oasis:names:tc:SAML:2.0:assertion', 'Attribute')
      for (const attr of Array.from(attrEls)) {
        const name = attr.getAttribute('Name') || attr.getAttribute('FriendlyName') || 'unknown'
        const values = Array.from(attr.getElementsByTagNameNS('urn:oasis:names:tc:SAML:2.0:assertion', 'AttributeValue')).map(v => v.textContent || '')
        attrs.push({ name, value: values.join(', ') })
      }

      setOutput(
        <div>
          <div className="tl-ok">✓ SAML RESPONSE DECODED</div>
          <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6, fontSize: 11 }}>
            <div><span style={{ color: 'var(--amber)' }}>Issuer:</span> {issuerEl?.textContent || 'N/A'}</div>
            <div><span style={{ color: 'var(--amber)' }}>Destination:</span> {dest}</div>
            <div><span style={{ color: 'var(--amber)' }}>Issue Instant:</span> {issueInstant}</div>
            <div><span style={{ color: 'var(--amber)' }}>Status:</span> {status.split(':').pop()}</div>
            {nameIdEl && <div><span style={{ color: 'var(--amber)' }}>NameID:</span> {nameIdEl.textContent} <span style={{ color: 'var(--text3)' }}>({nameIdEl.getAttribute('Format')?.split(':').pop()})</span></div>}
            {attrs.length > 0 && <>
              <div style={{ color: 'var(--em)', marginTop: 8 }}>ATTRIBUTES ({attrs.length})</div>
              {attrs.map(a => <div key={a.name}><span style={{ color: 'var(--blue)' }}>{a.name}:</span> {a.value}</div>)}
            </>}
          </div>
          <div className="tl-lbl" style={{ marginTop: 12 }}>RAW XML</div>
          <pre style={{ fontSize: 9, color: 'var(--text3)', marginTop: 4, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
            {new XMLSerializer().serializeToString(doc).replace(/></g, '>\n<').slice(0, 2000)}
          </pre>
        </div>
      )
    } catch (e) { setOutput(<span className="tl-err">✕ Error: {String(e)}</span>) }
  }

  return (
    <div className="tl">
      <div>
        <div className="tl-lbl">SAMLResponse <span style={{ color: 'var(--text4)' }}>(Base64-encoded or raw XML)</span></div>
        <textarea className="tl-inp" rows={7} placeholder="Paste Base64-encoded SAMLResponse or raw XML…"
          value={input} onChange={e => setInput(e.target.value)} />
      </div>
      <div className="tl-row-btns">
        <button className="tl-btn" onClick={decode}>▷ DECODE</button>
        <button className="tl-btn-ghost" onClick={() => setInput(SAMPLE_SAML)}>LOAD SAMPLE</button>
      </div>
      <div className="tl-out">{output}</div>
    </div>
  )
}
