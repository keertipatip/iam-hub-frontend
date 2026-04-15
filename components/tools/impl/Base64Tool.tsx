'use client'
import { useState } from 'react'

function encode(text: string, urlSafe: boolean): string {
  try {
    const b64 = btoa(unescape(encodeURIComponent(text)))
    return urlSafe ? b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '') : b64
  } catch { return '' }
}

function decode(b64: string): string {
  try {
    const normalized = b64.replace(/-/g, '+').replace(/_/g, '/')
    return decodeURIComponent(escape(atob(normalized)))
  } catch { return '✕ Invalid Base64' }
}

export default function Base64Tool() {
  const [urlSafe, setUrlSafe] = useState(false)
  const [plain, setPlain] = useState('')
  const [encoded, setEncoded] = useState('')
  const [status, setStatus] = useState<React.ReactNode>(
    <span className="tl-out-placeholder">// Status will appear here</span>
  )

  function doEncode(text: string) {
    const result = encode(text, urlSafe)
    setEncoded(result)
    setStatus(<span className="tl-ok">✓ Encoded ({urlSafe ? 'URL-safe' : 'Standard'}): {result.length} chars</span>)
  }

  function doDecode(b64: string) {
    const result = decode(b64)
    if (result.startsWith('✕')) {
      setStatus(<span className="tl-err">{result}</span>)
    } else {
      setPlain(result)
      setStatus(<span className="tl-ok">✓ Decoded: {result.length} chars</span>)
    }
  }

  return (
    <div className="tl">
      <div>
        <div className="tl-lbl">Encoding Mode</div>
        <div className="tl-row-btns" style={{ marginBottom: 4 }}>
          <label style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text2)', cursor: 'pointer' }}>
            <input type="radio" name="b64mode" checked={!urlSafe} onChange={() => setUrlSafe(false)} /> Standard
          </label>
          <label style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text2)', cursor: 'pointer', marginLeft: 12 }}>
            <input type="radio" name="b64mode" checked={urlSafe} onChange={() => setUrlSafe(true)} /> URL-safe (no padding)
          </label>
        </div>
      </div>
      <div className="tl-grid2">
        <div>
          <div className="tl-lbl">Plain Text → Encode</div>
          <textarea className="tl-inp" rows={7} placeholder="Type or paste plain text…"
            value={plain} onChange={e => { setPlain(e.target.value); doEncode(e.target.value) }} />
          <button className="tl-btn" style={{ marginTop: 8, width: '100%' }} onClick={() => doEncode(plain)}>▷ ENCODE</button>
        </div>
        <div>
          <div className="tl-lbl">Base64 → Decode</div>
          <textarea className="tl-inp" rows={7} placeholder="Paste Base64 to decode…"
            value={encoded} onChange={e => { setEncoded(e.target.value); doDecode(e.target.value) }} />
          <button className="tl-btn-ghost" style={{ marginTop: 8, width: '100%' }} onClick={() => doDecode(encoded)}>▷ DECODE</button>
        </div>
      </div>
      <div>
        <div className="tl-lbl" style={{ marginTop: 4 }}>Status</div>
        <div className="tl-out" style={{ minHeight: 36 }}>{status}</div>
      </div>
    </div>
  )
}
