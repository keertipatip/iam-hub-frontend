'use client'
import { useState } from 'react'

const SAMPLES: Record<string, [string, string]> = {
  redirect: ['https://app.example.com/callback?code=abc&state=xyz123', ''],
  saml: ['', 'PHNhbWxwOlJlc3BvbnNlIHhtbG5zOnNhbWxwPSJ1cm46b2FzaXM6bmFtZXM6dGM6U0FNTDoyLjA6cHJvdG9jb2wiPjwvc2FtbHA6UmVzcG9uc2U%2B'],
  query: ['user_id=alice smith&email=alice@example.com&roles[]=admin&roles[]=viewer', ''],
}

export default function UrlEncoder() {
  const [plain, setPlain] = useState('')
  const [encoded, setEncoded] = useState('')

  function doEncode(text: string) {
    setEncoded(encodeURIComponent(text))
  }

  function doDecode(enc: string) {
    try { setPlain(decodeURIComponent(enc)) }
    catch { setPlain('✕ Invalid URL-encoded string') }
  }

  function loadSample(key: string) {
    const [p, e] = SAMPLES[key]
    if (p) { setPlain(p); setEncoded(encodeURIComponent(p)) }
    else { setEncoded(e); try { setPlain(decodeURIComponent(e)) } catch { setPlain('') } }
  }

  return (
    <div className="tl">
      <div className="tl-grid2">
        <div>
          <div className="tl-lbl">Decoded → Encode</div>
          <textarea className="tl-inp" rows={8} placeholder="Paste URL or string to encode…"
            value={plain} onChange={e => { setPlain(e.target.value); doEncode(e.target.value) }} />
          <button className="tl-btn" style={{ marginTop: 8, width: '100%' }} onClick={() => doEncode(plain)}>▷ ENCODE</button>
        </div>
        <div>
          <div className="tl-lbl">Encoded → Decode</div>
          <textarea className="tl-inp" rows={8} placeholder="Paste URL-encoded string…"
            value={encoded} onChange={e => { setEncoded(e.target.value); doDecode(e.target.value) }} />
          <button className="tl-btn-ghost" style={{ marginTop: 8, width: '100%' }} onClick={() => doDecode(encoded)}>▷ DECODE</button>
        </div>
      </div>
      <div>
        <div className="tl-lbl" style={{ marginTop: 4 }}>Quick samples</div>
        <div className="tl-row-btns">
          <button className="tl-btn-ghost" onClick={() => loadSample('redirect')}>OAuth redirect_uri</button>
          <button className="tl-btn-ghost" onClick={() => loadSample('saml')}>SAML RelayState</button>
          <button className="tl-btn-ghost" onClick={() => loadSample('query')}>Query string</button>
        </div>
      </div>
    </div>
  )
}
