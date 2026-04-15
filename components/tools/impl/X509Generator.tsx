'use client'
import { useState } from 'react'
import { exportSpkiPem, exportPkcs8Pem, copyToClipboard } from '@/utils/toolCrypto'

export default function X509Generator() {
  const [cn, setCn] = useState('app.example.com')
  const [org, setOrg] = useState('Example Corp')
  const [days, setDays] = useState(365)
  const [keyType, setKeyType] = useState('ec-p256')
  const [output, setOutput] = useState<React.ReactNode>(<span className="tl-out-placeholder">// Keys and openssl command will appear here</span>)

  async function generate() {
    try {
      let kp: CryptoKeyPair
      let keyAlg: string
      if (keyType === 'ec-p256') {
        kp = await crypto.subtle.generateKey({ name: 'ECDSA', namedCurve: 'P-256' }, true, ['sign', 'verify'])
        keyAlg = 'EC (P-256)'
      } else if (keyType === 'rsa-2048') {
        kp = await crypto.subtle.generateKey(
          { name: 'RSASSA-PKCS1-v1_5', modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' },
          true, ['sign', 'verify']
        )
        keyAlg = 'RSA-2048'
      } else {
        kp = await crypto.subtle.generateKey(
          { name: 'RSASSA-PKCS1-v1_5', modulusLength: 4096, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' },
          true, ['sign', 'verify']
        )
        keyAlg = 'RSA-4096'
      }

      const pubPem = await exportSpkiPem(kp.publicKey)
      const privPem = await exportPkcs8Pem(kp.privateKey)

      const opensslCmd = keyType === 'ec-p256'
        ? `openssl req -x509 -newkey ec -pkeyopt ec_paramgen_curve:P-256 \\
  -keyout key.pem -out cert.pem -days ${days} -nodes \\
  -subj "/CN=${cn}/O=${org}"`
        : `openssl req -x509 -newkey rsa:${keyType === 'rsa-2048' ? '2048' : '4096'} \\
  -keyout key.pem -out cert.pem -days ${days} -nodes \\
  -subj "/CN=${cn}/O=${org}"`

      setOutput(
        <div>
          <div className="tl-ok">✓ {keyAlg} KEY PAIR GENERATED (browser-side)</div>
          <div className="tl-lbl" style={{ marginTop: 12 }}>PUBLIC KEY (SPKI PEM)</div>
          <pre style={{ fontSize: 10, color: 'var(--em)', margin: '4px 0 8px', whiteSpace: 'pre-wrap' }}>{pubPem}</pre>
          <button className="tl-btn-ghost" style={{ fontSize: 10, marginBottom: 14 }}
            onClick={() => copyToClipboard(pubPem)}>⊡ COPY PUBLIC KEY</button>
          <div className="tl-lbl">PRIVATE KEY (PKCS#8 PEM) — keep secret</div>
          <pre style={{ fontSize: 10, color: 'var(--amber)', margin: '4px 0 8px', whiteSpace: 'pre-wrap' }}>{privPem}</pre>
          <button className="tl-btn-ghost" style={{ fontSize: 10, marginBottom: 14 }}
            onClick={() => copyToClipboard(privPem)}>⊡ COPY PRIVATE KEY</button>
          <div className="tl-lbl">EQUIVALENT OPENSSL COMMAND (generates self-signed cert)</div>
          <pre style={{ fontSize: 10, color: 'var(--blue)', margin: '4px 0 8px', whiteSpace: 'pre-wrap' }}>{opensslCmd}</pre>
          <button className="tl-btn-ghost" style={{ fontSize: 10 }}
            onClick={() => copyToClipboard(opensslCmd)}>⊡ COPY OPENSSL CMD</button>
        </div>
      )
    } catch (e) { setOutput(<span className="tl-err">✕ Error: {String(e)}</span>) }
  }

  return (
    <div className="tl">
      <div className="tl-grid2">
        <div>
          <div className="tl-lbl">Common Name (CN)</div>
          <input className="tl-inp" value={cn} onChange={e => setCn(e.target.value)} />
        </div>
        <div>
          <div className="tl-lbl">Organization (O)</div>
          <input className="tl-inp" value={org} onChange={e => setOrg(e.target.value)} />
        </div>
        <div>
          <div className="tl-lbl">Validity (days)</div>
          <input className="tl-inp" type="number" value={days} onChange={e => setDays(Number(e.target.value))} />
        </div>
        <div>
          <div className="tl-lbl">Key Type</div>
          <select className="tl-sel" value={keyType} onChange={e => setKeyType(e.target.value)}>
            <option value="ec-p256">EC P-256 (recommended)</option>
            <option value="rsa-2048">RSA 2048-bit</option>
            <option value="rsa-4096">RSA 4096-bit</option>
          </select>
        </div>
      </div>
      <button className="tl-btn" onClick={generate}>▷ GENERATE KEY PAIR + SELF-SIGNED CERT</button>
      <div className="tl-out">{output}</div>
    </div>
  )
}
