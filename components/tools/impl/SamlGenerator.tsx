'use client'
import { useState } from 'react'
import { randomHex, copyToClipboard } from '@/utils/toolCrypto'

export default function SamlGenerator() {
  const [idp, setIdp] = useState('https://idp.example.com/saml2')
  const [sp, setSp] = useState('https://app.example.com/saml/acs')
  const [nameId, setNameId] = useState('alice@example.com')
  const [ttl, setTtl] = useState(3600)
  const [attrs, setAttrs] = useState('email=alice@example.com\nfirstName=Alice\nlastName=Smith\ngroups=admin,viewer\ndepartment=Engineering')
  const [output, setOutput] = useState<React.ReactNode>(<span className="tl-out-placeholder">// SAML Response XML will appear here</span>)

  function generate() {
    const id = '_' + randomHex(20)
    const assertionId = '_a' + randomHex(20)
    const now = new Date()
    const notBefore = now.toISOString()
    const notOnOrAfter = new Date(now.getTime() + ttl * 1000).toISOString()

    const attrLines = attrs.trim().split('\n').filter(l => l.includes('=')).map(line => {
      const [name, ...rest] = line.split('=')
      const value = rest.join('=')
      return `        <saml:Attribute Name="${name.trim()}">
          <saml:AttributeValue>${value.trim()}</saml:AttributeValue>
        </saml:Attribute>`
    }).join('\n')

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<samlp:Response xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol"
  xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion"
  ID="${id}" Version="2.0"
  IssueInstant="${notBefore}"
  Destination="${sp}">
  <saml:Issuer>${idp}</saml:Issuer>
  <samlp:Status>
    <samlp:StatusCode Value="urn:oasis:names:tc:SAML:2.0:status:Success"/>
  </samlp:Status>
  <saml:Assertion ID="${assertionId}" Version="2.0" IssueInstant="${notBefore}">
    <saml:Issuer>${idp}</saml:Issuer>
    <saml:Subject>
      <saml:NameID Format="urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress">${nameId}</saml:NameID>
      <saml:SubjectConfirmation Method="urn:oasis:names:tc:SAML:2.0:cm:bearer">
        <saml:SubjectConfirmationData NotOnOrAfter="${notOnOrAfter}" Recipient="${sp}"/>
      </saml:SubjectConfirmation>
    </saml:Subject>
    <saml:Conditions NotBefore="${notBefore}" NotOnOrAfter="${notOnOrAfter}">
      <saml:AudienceRestriction>
        <saml:Audience>${sp}</saml:Audience>
      </saml:AudienceRestriction>
    </saml:Conditions>
    <saml:AuthnStatement AuthnInstant="${notBefore}">
      <saml:AuthnContext>
        <saml:AuthnContextClassRef>urn:oasis:names:tc:SAML:2.0:ac:classes:Password</saml:AuthnContextClassRef>
      </saml:AuthnContext>
    </saml:AuthnStatement>
    <saml:AttributeStatement>
${attrLines}
    </saml:AttributeStatement>
  </saml:Assertion>
</samlp:Response>`

    const b64 = btoa(unescape(encodeURIComponent(xml)))

    setOutput(
      <div>
        <div className="tl-ok">✓ SAML RESPONSE GENERATED</div>
        <div className="tl-lbl" style={{ marginTop: 10 }}>XML</div>
        <pre style={{ fontSize: 10, color: 'var(--em)', margin: '4px 0 8px', whiteSpace: 'pre-wrap' }}>{xml}</pre>
        <button className="tl-btn-ghost" style={{ fontSize: 10, marginBottom: 14 }}
          onClick={() => copyToClipboard(xml)}>⊡ COPY XML</button>
        <div className="tl-lbl">SAMLResponse (Base64)</div>
        <div style={{ fontSize: 10, wordBreak: 'break-all', color: 'var(--amber)', margin: '4px 0 8px' }}>{b64}</div>
        <button className="tl-btn-ghost" style={{ fontSize: 10 }}
          onClick={() => copyToClipboard(b64)}>⊡ COPY BASE64</button>
      </div>
    )
  }

  return (
    <div className="tl">
      <div className="tl-grid2">
        <div><div className="tl-lbl">IdP Entity ID</div><input className="tl-inp" value={idp} onChange={e => setIdp(e.target.value)} /></div>
        <div><div className="tl-lbl">SP Entity ID / ACS URL</div><input className="tl-inp" value={sp} onChange={e => setSp(e.target.value)} /></div>
        <div><div className="tl-lbl">NameID (email)</div><input className="tl-inp" value={nameId} onChange={e => setNameId(e.target.value)} /></div>
        <div><div className="tl-lbl">Session TTL (seconds)</div><input className="tl-inp" type="number" value={ttl} onChange={e => setTtl(Number(e.target.value))} /></div>
      </div>
      <div>
        <div className="tl-lbl">Attributes <span style={{ color: 'var(--text4)' }}>(Name=Value, one per line)</span></div>
        <textarea className="tl-inp" rows={5} value={attrs} onChange={e => setAttrs(e.target.value)} />
      </div>
      <button className="tl-btn" onClick={generate}>▷ GENERATE SAML RESPONSE</button>
      <div className="tl-out" style={{ minHeight: 160 }}>{output}</div>
    </div>
  )
}
