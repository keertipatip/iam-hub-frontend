'use client'
import { useState, useRef, useEffect } from 'react'
import QRCode from 'qrcode'

type ErrorLevel = 'L' | 'M' | 'Q' | 'H'

export default function QrCodeGenerator() {
  const [text, setText] = useState('https://app.example.com')
  const [size, setSize] = useState(300)
  const [errLevel, setErrLevel] = useState<ErrorLevel>('M')
  const [darkColor, setDarkColor] = useState('#000000')
  const [lightColor, setLightColor] = useState('#ffffff')
  const [output, setOutput] = useState<React.ReactNode>(<span className="tl-out-placeholder">// QR code will appear here</span>)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  async function generate(val = text) {
    if (!val.trim()) { setOutput(<span className="tl-err">✕ Enter text or URL</span>); return }
    try {
      const dataUrl = await QRCode.toDataURL(val, {
        width: size, errorCorrectionLevel: errLevel,
        color: { dark: darkColor, light: lightColor },
        margin: 2,
      })
      setOutput(
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <img src={dataUrl} alt="QR Code" style={{ maxWidth: size, imageRendering: 'pixelated', border: '2px solid var(--border)' }} />
          <div className="tl-ok">✓ QR Code generated — {val.length} chars</div>
          <a href={dataUrl} download="qrcode.png" className="tl-btn-ghost" style={{ fontSize: 10, textDecoration: 'none', display: 'inline-block', padding: '6px 14px' }}>
            ⬇ DOWNLOAD PNG
          </a>
        </div>
      )
    } catch (e) { setOutput(<span className="tl-err">✕ Error: {String(e)}</span>) }
  }

  function totp() {
    setText(`otpauth://totp/Example:alice@example.com?secret=JBSWY3DPEHPK3PXP&issuer=Example&algorithm=SHA1&digits=6&period=30`)
  }

  return (
    <div className="tl">
      <div>
        <div className="tl-lbl">Text / URL to encode</div>
        <textarea className="tl-inp" rows={3} placeholder="https://…  or  any text"
          value={text} onChange={e => setText(e.target.value)} />
      </div>
      <div className="tl-grid3">
        <div>
          <div className="tl-lbl">Size (px)</div>
          <input className="tl-inp" type="number" value={size} min={100} max={800} step={50}
            onChange={e => setSize(Number(e.target.value))} />
        </div>
        <div>
          <div className="tl-lbl">Error Correction</div>
          <select className="tl-sel" value={errLevel} onChange={e => setErrLevel(e.target.value as ErrorLevel)}>
            <option value="L">L — Low (7%)</option>
            <option value="M">M — Medium (15%)</option>
            <option value="Q">Q — Quartile (25%)</option>
            <option value="H">H — High (30%)</option>
          </select>
        </div>
        <div>
          <div className="tl-lbl">Colors</div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input type="color" value={darkColor} onChange={e => setDarkColor(e.target.value)}
              style={{ width: 36, height: 36, background: 'none', border: '1px solid var(--border)', cursor: 'pointer' }} />
            <input type="color" value={lightColor} onChange={e => setLightColor(e.target.value)}
              style={{ width: 36, height: 36, background: 'none', border: '1px solid var(--border)', cursor: 'pointer' }} />
          </div>
        </div>
      </div>
      <div className="tl-row-btns">
        <button className="tl-btn" onClick={() => generate()}>▷ GENERATE QR</button>
        <button className="tl-btn-ghost" onClick={totp}>TOTP URI sample</button>
        <button className="tl-btn-ghost" onClick={() => { setText('BEGIN:VCARD\nVERSION:3.0\nFN:Alice Smith\nEMAIL:alice@example.com\nEND:VCARD') }}>vCard sample</button>
      </div>
      <div className="tl-out" style={{ minHeight: 200, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>{output}</div>
    </div>
  )
}
