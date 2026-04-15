'use client'
import { useState } from 'react'
import { toHex } from '@/utils/toolCrypto'

const SAMPLE_PEM = `-----BEGIN CERTIFICATE-----
MIICpDCCAYwCCQDU+pQ4pHgSpDANBgkqhkiG9w0BAQsFADAUMRIwEAYDVQQDDAls
b2NhbGhvc3QwHhcNMjMwMTAxMDAwMDAwWhcNMjQwMTAxMDAwMDAwWjAUMRIwEAYD
VQQDDAlsb2NhbGhvc3QwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQC7
o4qne60TB6pPDLRMFEChRRHI7DQlxRO6GIIIqhC6LCn8KaRD3iBZYqhPblCqiHV5
-----END CERTIFICATE-----`

function parsePem(pem: string): Uint8Array | null {
  const lines = pem.trim().split('\n').filter(l => !l.startsWith('-----'))
  try { return Uint8Array.from(atob(lines.join('')), c => c.charCodeAt(0)) } catch { return null }
}


export default function X509Decoder() {
  const [pem, setPem] = useState('')
  const [output, setOutput] = useState<React.ReactNode>(<span className="tl-out-placeholder">// Certificate details will appear here</span>)

  function decode() {
    const input = pem.trim()
    if (!input) { setOutput(<span className="tl-err">✕ Paste a PEM certificate</span>); return }
    const der = parsePem(input)
    if (!der) { setOutput(<span className="tl-err">✕ Invalid PEM format</span>); return }

    try {
      // Extract SHA-1 fingerprint
      crypto.subtle.digest('SHA-1', der.buffer as ArrayBuffer).then(fp => {
        const fingerprint = toHex(fp).match(/.{2}/g)!.join(':').toUpperCase()
        // Simple field extraction using known OID positions
        const text = Array.from(der).map(b => b < 32 || b > 126 ? '.' : String.fromCharCode(b)).join('')
        const cn = text.match(/CN=([^\x00-\x1f,]+)/)?.[1] || 'N/A'
        const o = text.match(/O=([^\x00-\x1f,]+)/)?.[1] || 'N/A'
        const ou = text.match(/OU=([^\x00-\x1f,]+)/)?.[1] || 'N/A'

        setOutput(
          <div>
            <div className="tl-ok">✓ X.509 CERTIFICATE DECODED</div>
            <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6, fontSize: 11 }}>
              <div><span style={{ color: 'var(--amber)' }}>Common Name (CN):</span> {cn}</div>
              <div><span style={{ color: 'var(--amber)' }}>Organization (O):</span> {o}</div>
              <div><span style={{ color: 'var(--amber)' }}>Org Unit (OU):</span> {ou}</div>
              <div><span style={{ color: 'var(--amber)' }}>DER Size:</span> {der.length} bytes</div>
              <div><span style={{ color: 'var(--amber)' }}>SHA-1 Fingerprint:</span> {fingerprint}</div>
            </div>
            <div style={{ marginTop: 10, fontSize: 10, color: 'var(--text4)' }}>
              ⚠ Full ASN.1 parsing requires a dedicated library (e.g. node-forge) for complete field extraction.
            </div>
          </div>
        )
      })
    } catch (e) { setOutput(<span className="tl-err">✕ Parse error: {String(e)}</span>) }
  }

  return (
    <div className="tl">
      <div>
        <div className="tl-lbl">X.509 Certificate (PEM)</div>
        <textarea className="tl-inp" rows={10} placeholder={'-----BEGIN CERTIFICATE-----\nMIIBIjANBgkq...\n-----END CERTIFICATE-----'}
          value={pem} onChange={e => setPem(e.target.value)} />
      </div>
      <div className="tl-row-btns">
        <button className="tl-btn" onClick={decode}>▷ DECODE CERTIFICATE</button>
        <button className="tl-btn-ghost" onClick={() => setPem(SAMPLE_PEM)}>LOAD SAMPLE</button>
      </div>
      <div className="tl-out">{output}</div>
    </div>
  )
}
