'use client'

import { useState } from 'react'
import { useToast } from '../ToastProvider'

interface SimStep { Class: string; Text: string }
interface SimConfigField { Label: string; Type: string; Opts: string[]; Val: string }
interface SimData {
  Title: string
  Protocol: string
  Config: SimConfigField[]
  Attacks: string[]
  Steps: SimStep[]
}

interface Props {
  simKey: string
  simData: SimData
  onBack: () => void
}

export function SimRunner({ simKey, simData, onBack }: Props) {
  const { toast } = useToast()
  const [status, setStatus] = useState<'READY' | 'RUNNING...' | 'COMPLETE'>('READY')
  const [traceLines, setTraceLines] = useState<SimStep[]>([])

  async function runSim() {
    setStatus('RUNNING...')
    setTraceLines([])
    try {
      const res = await fetch(`/api/simulations/${simKey}/run`, { method: 'POST' })
      const data = await res.json()
      setTraceLines(data.steps ?? [])
    } catch {
      setTraceLines([{ Class: 'err', Text: 'ERROR // failed to connect to API' }])
    }
    setStatus('COMPLETE')
  }

  return (
    <>
      <div className="pg-toolbar">
        <button className="c-tool" style={{ color: 'var(--text3)' }} onClick={onBack}>← BACK</button>
        <div className="pg-sep"></div>
        <div className="pg-toolbar-title"><div className="pg-dot"></div>{simData.Title}</div>
        <div className="pg-sep"></div>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text3)' }}>{simData.Protocol}</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
          <button className="c-tool" onClick={() => toast('SCENARIO_SAVED')}>💾 SAVE</button>
          <button className="c-tool" onClick={() => toast('SCENARIO_SHARED // artifact_published')}>↑ SHARE</button>
        </div>
      </div>

      <div className="sim-layout">
        <div className="sim-config">
          <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--text4)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 14 }}>// CONFIGURATION</div>
          {simData.Config.map(field => (
            <div key={field.Label} className="s-field">
              <div className="s-label">{field.Label}</div>
              {field.Type === 'select' ? (
                <select className="s-select" defaultValue={field.Opts[0]}>
                  {field.Opts.map(o => <option key={o}>{o}</option>)}
                </select>
              ) : (
                <input className="s-input" defaultValue={field.Val} />
              )}
            </div>
          ))}
          <div style={{ marginTop: 8 }}>
            <button className="sim-run-btn" onClick={runSim}>▷ EXECUTE_SIMULATION</button>
          </div>
          {simData.Attacks && simData.Attacks.length > 0 && (
            <div style={{ marginTop: 12, borderTop: '1px solid var(--border)', paddingTop: 10 }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--text4)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>// INJECT SCENARIO</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {simData.Attacks.map(a => (
                  <button
                    key={a}
                    style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text3)', border: '1px solid var(--border)', padding: '5px 8px', background: 'none', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' }}
                    onMouseOver={e => (e.currentTarget.style.color = 'var(--amber)')}
                    onMouseOut={e => (e.currentTarget.style.color = 'var(--text3)')}
                    onClick={() => toast(`SCENARIO: ${a} injected`)}
                  >
                    ⚠ {a}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="sim-trace">
          <div className="sim-trace-head">
            <div className="pg-dot"></div>EXECUTION_TRACE
            <span style={{ marginLeft: 'auto', color: 'var(--em)', fontFamily: 'var(--mono)', fontSize: 10 }}>{status}</span>
          </div>
          <div className="sim-trace-body">
            {traceLines.length === 0 ? (
              <>
                <div className="t-line t-mute">// Simulation loaded: {simData.Title}</div>
                <div className="t-line t-mute">// Press EXECUTE to run step-through trace</div>
              </>
            ) : (
              traceLines.map((l, i) => (
                <div key={i} className={`t-line t-${l.Class}`}>{l.Text}</div>
              ))
            )}
          </div>
          <div className="sim-bottom">
            <div className="tok-panel">
              <div className="tok-label em">// JWT HEADER</div>
              <div className="tok-content">
                {'{ "alg": '}<span style={{ color: 'var(--amber)' }}>"RS256"</span>{',\n "typ": '}<span style={{ color: 'var(--amber)' }}>"JWT"</span>{',\n "kid": '}<span style={{ color: 'var(--amber)' }}>"key-2025-01"</span>{' }'}
              </div>
            </div>
            <div className="tok-panel">
              <div className="tok-label amb">// JWT PAYLOAD</div>
              <div className="tok-content">
                {'{ "sub": '}<span style={{ color: 'var(--amber)' }}>"alice@org"</span>{',\n "iss": '}<span style={{ color: 'var(--amber)' }}>"https://idp.org"</span>{',\n "exp": '}<span style={{ color: 'var(--blue)' }}>1738000000</span>{',\n "amr": '}<span style={{ color: 'var(--amber)' }}>["mfa","totp"]</span>{' }'}
              </div>
            </div>
            <div className="tok-panel">
              <div className="tok-label bl">// SIGNATURE</div>
              <div className="tok-content">
                RSASSA-PKCS1-v1_5(<br />
                &nbsp;SHA256(<br />
                &nbsp;&nbsp;b64u(hdr)+"."<br />
                &nbsp;&nbsp;+b64u(payload)<br />
                &nbsp;), privateKey)
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
