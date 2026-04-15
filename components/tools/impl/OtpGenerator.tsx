'use client'
import { useState, useEffect, useRef } from 'react'
import { base32ToBytes, hmacSignRaw, copyToClipboard } from '@/utils/toolCrypto'

async function hotpCode(secretB32: string, counter: number, digits = 6): Promise<string> {
  const key = base32ToBytes(secretB32)
  const counterBuf = new Uint8Array(8)
  const view = new DataView(counterBuf.buffer)
  view.setUint32(4, counter, false)
  const sig = await hmacSignRaw('SHA-1', key, counterBuf)
  const arr = new Uint8Array(sig)
  const offset = arr[19] & 0xf
  const code = ((arr[offset] & 0x7f) << 24 | arr[offset + 1] << 16 | arr[offset + 2] << 8 | arr[offset + 3]) % Math.pow(10, digits)
  return String(code).padStart(digits, '0')
}

function newSecret(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
  return Array.from(crypto.getRandomValues(new Uint8Array(16))).map(b => chars[b % 32]).join('')
}

export default function OtpGenerator() {
  const [secret, setSecret] = useState('JBSWY3DPEHPK3PXP')
  const [mode, setMode] = useState<'totp' | 'hotp'>('totp')
  const [counter, setCounter] = useState(0)
  const [digits, setDigits] = useState(6)
  const [code, setCode] = useState('——')
  const [ttl, setTtl] = useState('')
  const [info, setInfo] = useState<React.ReactNode>(<span className="tl-out-placeholder">// Details</span>)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  function stopLoop() { if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null } }

  async function generate() {
    stopLoop()
    try {
      if (mode === 'totp') {
        const tick = async () => {
          const now = Math.floor(Date.now() / 1000)
          const step = Math.floor(now / 30)
          const remaining = 30 - (now % 30)
          const c = await hotpCode(secret, step, digits)
          setCode(c)
          setTtl(`Refreshes in ${remaining}s`)
          setInfo(
            <div>
              <div>Counter (step): {step}</div>
              <div>Valid for: {remaining}s</div>
              <div style={{ marginTop: 6, fontSize: 10, color: 'var(--text4)' }}>Auto-updates every second</div>
            </div>
          )
        }
        await tick()
        intervalRef.current = setInterval(tick, 1000)
      } else {
        const c = await hotpCode(secret, counter, digits)
        setCode(c)
        setTtl('')
        setInfo(<div>Counter: {counter} | HOTP code (static until counter incremented)</div>)
      }
    } catch (e) {
      setCode('ERROR'); setInfo(<span className="tl-err">✕ {String(e)}</span>)
    }
  }

  useEffect(() => () => stopLoop(), [])

  return (
    <div className="tl">
      <div className="tl-grid2">
        <div>
          <div className="tl-lbl">Secret Key (Base32)</div>
          <div className="tl-row" style={{ marginBottom: 8 }}>
            <input className="tl-inp" value={secret} style={{ flex: 1, letterSpacing: 2 }}
              onChange={e => setSecret(e.target.value.toUpperCase())} />
            <button className="tl-btn-ghost" style={{ flexShrink: 0 }} onClick={() => { stopLoop(); setSecret(newSecret()); setCode('——') }}>NEW</button>
          </div>
          <div className="tl-lbl">Mode</div>
          <select className="tl-sel" value={mode} style={{ marginBottom: 8 }}
            onChange={e => { stopLoop(); setMode(e.target.value as 'totp' | 'hotp'); setCode('——') }}>
            <option value="totp">TOTP (time-based, RFC 6238)</option>
            <option value="hotp">HOTP (counter-based, RFC 4226)</option>
          </select>
          {mode === 'hotp' && (
            <div>
              <div className="tl-lbl">Counter (HOTP only)</div>
              <input className="tl-inp" type="number" value={counter} style={{ maxWidth: 140 }}
                onChange={e => setCounter(Number(e.target.value))} />
            </div>
          )}
          <div className="tl-lbl" style={{ marginTop: 8 }}>Digits</div>
          <select className="tl-sel" value={digits} style={{ maxWidth: 140, marginBottom: 8 }}
            onChange={e => setDigits(Number(e.target.value))}>
            <option value={6}>6 digits</option>
            <option value={8}>8 digits</option>
          </select>
          <button className="tl-btn" style={{ width: '100%' }} onClick={generate}>▷ GENERATE OTP</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div className="tl-card" style={{ textAlign: 'center', padding: '28px 16px' }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: 2, color: 'var(--text3)', marginBottom: 10 }}>CURRENT OTP</div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 44, letterSpacing: 10, color: 'var(--em)', minHeight: 54 }}>{code}</div>
            {ttl && <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text3)', marginTop: 8 }}>{ttl}</div>}
            {code !== '——' && code !== 'ERROR' && (
              <button className="tl-btn-ghost" style={{ marginTop: 8, fontSize: 10 }} onClick={() => copyToClipboard(code)}>⊡ COPY</button>
            )}
          </div>
          <div className="tl-out" style={{ minHeight: 60 }}>{info}</div>
        </div>
      </div>
    </div>
  )
}
