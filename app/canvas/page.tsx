'use client'

import { useRef, useState, useCallback } from 'react'
import { useToast } from '@/components/ToastProvider'

interface Node {
  id: number
  type: 'n-idp' | 'n-sp' | 'n-usr' | 'n-tok' | 'n-mfa'
  typeName: string
  name: string
  sub: string
  x: number
  y: number
}

const INITIAL_NODES: Node[] = [
  { id: 1, type: 'n-usr', typeName: 'USER_AGENT', name: 'Browser / App', sub: 'PKCE Client', x: 40, y: 68 },
  { id: 2, type: 'n-idp', typeName: 'IDENTITY_PROVIDER', name: 'Okta / Entra ID', sub: 'OIDC + SAML 2.0', x: 360, y: 68 },
  { id: 3, type: 'n-tok', typeName: 'AUTH_SERVER', name: 'Token Endpoint', sub: 'OAuth 2.0 / PKCE', x: 680, y: 68 },
  { id: 4, type: 'n-sp', typeName: 'RESOURCE_SERVER', name: 'Protected API', sub: 'Scope Validation', x: 40, y: 228 },
  { id: 5, type: 'n-mfa', typeName: 'MFA_PROVIDER', name: 'TOTP / Passkey', sub: 'FIDO2 / WebAuthn', x: 360, y: 228 },
  { id: 6, type: 'n-tok', typeName: 'TOKEN_STORE', name: 'JWT Registry', sub: 'RS256 · Rotation', x: 680, y: 228 },
]

const NODE_PALETTE = [
  { type: 'n-idp' as const, label: '⬡ IDENTITY_PROVIDER', color: 'rgba(0,255,136,0.3)', textColor: 'var(--em)', bg: 'rgba(0,255,136,0.05)', typeName: 'IDENTITY_PROVIDER', name: 'New IdP', sub: '' },
  { type: 'n-sp' as const, label: '◻ SERVICE_PROVIDER', color: 'rgba(0,170,255,0.3)', textColor: 'var(--blue)', bg: 'rgba(0,170,255,0.05)', typeName: 'SERVICE_PROVIDER', name: 'New SP', sub: '' },
  { type: 'n-usr' as const, label: '△ USER_AGENT', color: 'rgba(255,183,0,0.3)', textColor: 'var(--amber)', bg: 'rgba(255,183,0,0.05)', typeName: 'USER_AGENT', name: 'New User', sub: '' },
  { type: 'n-tok' as const, label: '⬢ TOKEN_STORE', color: 'rgba(255,51,68,0.3)', textColor: 'var(--red)', bg: 'rgba(255,51,68,0.05)', typeName: 'TOKEN_STORE', name: 'New Token Store', sub: '' },
  { type: 'n-mfa' as const, label: '◈ MFA_PROVIDER', color: 'rgba(170,85,255,0.3)', textColor: 'var(--purple)', bg: 'rgba(170,85,255,0.05)', typeName: 'MFA_PROVIDER', name: 'New MFA', sub: '' },
  { type: 'n-idp' as const, label: '▷ AUTH_SERVER', color: 'var(--border)', textColor: 'var(--text2)', bg: 'transparent', typeName: 'AUTH_SERVER', name: 'Auth Server', sub: '' },
  { type: 'n-sp' as const, label: '⊡ RESOURCE_SERVER', color: 'var(--border)', textColor: 'var(--text2)', bg: 'transparent', typeName: 'RESOURCE_SERVER', name: 'Resource Server', sub: '' },
  { type: 'n-idp' as const, label: '◎ POLICY_ENGINE', color: 'var(--border)', textColor: 'var(--text2)', bg: 'transparent', typeName: 'POLICY_ENGINE', name: 'Policy Engine', sub: '' },
]

const TEMPLATES = [
  { label: 'OIDC + PKCE', msg: 'TEMPLATE_LOADED // OIDC_PKCE' },
  { label: 'SAML 2.0 SSO', msg: 'TEMPLATE_LOADED // SAML_SSO' },
  { label: 'Zero Trust', msg: 'TEMPLATE_LOADED // ZERO_TRUST' },
  { label: 'Device Flow', msg: 'TEMPLATE_LOADED // DEVICE_FLOW' },
]

export default function CanvasPage() {
  const { toast } = useToast()
  const [nodes, setNodes] = useState<Node[]>(INITIAL_NODES)
  const [coords, setCoords] = useState('X:0 Y:0 // hover to track')
  const [activeTool, setActiveTool] = useState('SELECT')
  const canvasRef = useRef<HTMLDivElement>(null)
  const dragInfo = useRef<{ id: number; startX: number; startY: number; nodeX: number; nodeY: number } | null>(null)
  const nextId = useRef(INITIAL_NODES.length + 1)

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const r = canvasRef.current?.getBoundingClientRect()
    if (!r) return
    const x = Math.round(e.clientX - r.left)
    const y = Math.round(e.clientY - r.top)
    setCoords(`X:${x} Y:${y} // OIDC+PKCE FLOW`)
    if (dragInfo.current) {
      const { id, startX, startY, nodeX, nodeY } = dragInfo.current
      const dx = e.clientX - startX
      const dy = e.clientY - startY
      setNodes(prev => prev.map(n => n.id === id ? { ...n, x: nodeX + dx, y: nodeY + dy } : n))
    }
  }, [])

  function startDrag(e: React.MouseEvent, node: Node) {
    e.preventDefault()
    dragInfo.current = { id: node.id, startX: e.clientX, startY: e.clientY, nodeX: node.x, nodeY: node.y }
  }

  function stopDrag() {
    dragInfo.current = null
  }

  function addNode(palette: typeof NODE_PALETTE[0]) {
    const id = ++nextId.current
    setNodes(prev => [...prev, { id, type: palette.type, typeName: palette.typeName, name: palette.name, sub: palette.sub, x: 100 + (id * 20) % 300, y: 80 + (id * 15) % 200 }])
  }

  async function saveCanvas() {
    try {
      await fetch('/api/canvas/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'OIDC+PKCE Flow', data: JSON.stringify(nodes) }),
      })
      toast('DIAGRAM_SAVED // auto-versioned')
    } catch {
      toast('ERROR // save failed')
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden', height: '100%' }}>
      <div className="pg-toolbar">
        <div className="pg-toolbar-title"><div className="pg-dot"></div>FLOW_CANVAS // IAM_DIAGRAM_EDITOR</div>
        <div className="pg-sep"></div>
        {['SELECT', 'NODE', 'EDGE', 'LABEL', 'GROUP'].map(t => (
          <button key={t} className={`c-tool${activeTool === t ? ' active' : ''}`} onClick={() => setActiveTool(t)}>
            {t === 'SELECT' ? '▷ SELECT' : t === 'NODE' ? '◻ NODE' : t === 'EDGE' ? '— EDGE' : t === 'LABEL' ? '✎ LABEL' : '⟲ GROUP'}
          </button>
        ))}
        <div className="pg-sep"></div>
        <button className="c-tool">⟲ UNDO</button>
        <button className="c-tool">⟳ REDO</button>
        <button className="c-tool">↑ EXPORT SVG</button>
        <button className="c-tool">⊕ TEMPLATE</button>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
          <button className="c-tool" onClick={saveCanvas}>💾 SAVE</button>
          <button className="c-tool active" onClick={() => toast('FLOW_SIMULATION // running step-through...')}>▷ RUN_FLOW</button>
        </div>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Node palette */}
        <div style={{ width: 160, borderRight: '1px solid var(--border)', background: 'var(--panel)', padding: 12, overflowY: 'auto', flexShrink: 0 }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--text4)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>// NODES</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {NODE_PALETTE.map(p => (
              <div
                key={p.label}
                style={{ border: `1px solid ${p.color}`, padding: 8, fontFamily: 'var(--mono)', fontSize: 10, color: p.textColor, cursor: 'grab', background: p.bg }}
                onClick={() => addNode(p)}
              >
                {p.label}
              </div>
            ))}
          </div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--text4)', letterSpacing: 2, textTransform: 'uppercase', margin: '16px 0 8px' }}>// TEMPLATES</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {TEMPLATES.map(t => (
              <div
                key={t.label}
                style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text3)', padding: '6px 8px', border: '1px solid var(--border)', cursor: 'pointer' }}
                onClick={() => toast(t.msg)}
              >
                {t.label}
              </div>
            ))}
          </div>
        </div>

        {/* Canvas */}
        <div
          className="canvas-surface"
          id="canvas-surface"
          ref={canvasRef}
          data-coords={coords}
          onMouseMove={handleMouseMove}
          onMouseUp={stopDrag}
          onMouseLeave={stopDrag}
        >
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
            <defs>
              <marker id="ah" markerWidth="7" markerHeight="7" refX="5" refY="2.5" orient="auto"><polygon points="0,0 7,2.5 0,5" fill="rgba(0,255,136,0.5)" /></marker>
              <marker id="ab" markerWidth="7" markerHeight="7" refX="5" refY="2.5" orient="auto"><polygon points="0,0 7,2.5 0,5" fill="rgba(0,170,255,0.5)" /></marker>
              <marker id="aa" markerWidth="7" markerHeight="7" refX="5" refY="2.5" orient="auto"><polygon points="0,0 7,2.5 0,5" fill="rgba(255,183,0,0.5)" /></marker>
              <marker id="ap" markerWidth="7" markerHeight="7" refX="5" refY="2.5" orient="auto"><polygon points="0,0 7,2.5 0,5" fill="rgba(170,85,255,0.5)" /></marker>
            </defs>
            {nodes.length >= 2 && <>
              <line x1={nodes[0].x+160} y1={nodes[0].y+30} x2={nodes[1].x} y2={nodes[1].y+30} stroke="rgba(255,183,0,0.35)" strokeWidth="1" strokeDasharray="5,3" markerEnd="url(#aa)" />
              <text x={nodes[0].x+20} y={nodes[0].y+20} fill="rgba(255,183,0,0.5)" fontSize="9" fontFamily="IBM Plex Mono">AUTH_REQUEST</text>
            </>}
            {nodes.length >= 3 && <>
              <line x1={nodes[1].x+160} y1={nodes[1].y+30} x2={nodes[2].x} y2={nodes[2].y+30} stroke="rgba(0,255,136,0.35)" strokeWidth="1" strokeDasharray="5,3" markerEnd="url(#ah)" />
              <text x={nodes[1].x+20} y={nodes[1].y+20} fill="rgba(0,255,136,0.5)" fontSize="9" fontFamily="IBM Plex Mono">CODE_ISSUED</text>
            </>}
            {nodes.length >= 5 && <>
              <line x1={nodes[3].x+160} y1={nodes[3].y+30} x2={nodes[4].x} y2={nodes[4].y+30} stroke="rgba(0,255,136,0.35)" strokeWidth="1" strokeDasharray="5,3" markerEnd="url(#ah)" />
              <text x={nodes[3].x+20} y={nodes[3].y+20} fill="rgba(0,255,136,0.5)" fontSize="9" fontFamily="IBM Plex Mono">TOKEN_REQUEST</text>
            </>}
            {nodes.length >= 6 && <>
              <line x1={nodes[4].x+160} y1={nodes[4].y+30} x2={nodes[5].x} y2={nodes[5].y+30} stroke="rgba(0,170,255,0.35)" strokeWidth="1" strokeDasharray="5,3" markerEnd="url(#ab)" />
              <text x={nodes[4].x+20} y={nodes[4].y+20} fill="rgba(0,170,255,0.5)" fontSize="9" fontFamily="IBM Plex Mono">ACCESS_TOKEN</text>
            </>}
          </svg>

          {nodes.map(n => (
            <div
              key={n.id}
              className={`c-node ${n.type}`}
              style={{ left: n.x, top: n.y }}
              onMouseDown={e => startDrag(e, n)}
            >
              <div className="n-type">{n.typeName}</div>
              <div className="n-name">{n.name}</div>
              {n.sub && <div className="n-sub">{n.sub}</div>}
            </div>
          ))}

          <div style={{ position: 'absolute', top: 14, right: 14, background: 'var(--panel)', border: '1px solid var(--border)', padding: '10px 14px', fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text3)' }}>
            <div style={{ color: 'var(--em)', marginBottom: 4 }}>OIDC_AUTHORIZATION_CODE + PKCE</div>
            <div>{nodes.length} nodes</div>
            <div style={{ marginTop: 6, display: 'flex', gap: 8 }}>
              <span style={{ color: 'var(--em)' }}>■</span><span>IDP</span>
              <span style={{ color: 'var(--blue)' }}>■</span><span>SP</span>
              <span style={{ color: 'var(--amber)' }}>■</span><span>USER</span>
              <span style={{ color: 'var(--red)' }}>■</span><span>TOKEN</span>
              <span style={{ color: 'var(--purple)' }}>■</span><span>MFA</span>
            </div>
          </div>
        </div>

        {/* Properties panel */}
        <div style={{ width: 220, borderLeft: '1px solid var(--border)', background: 'var(--panel)', padding: 14, overflowY: 'auto', flexShrink: 0 }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--text4)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>// PROPERTIES</div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text3)', marginBottom: 8 }}>Select a node to edit properties</div>
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12, marginTop: 8 }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--text4)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>// CANVAS</div>
            <div className="s-field"><div className="s-label">ZOOM</div><input className="s-input" defaultValue="100%" /></div>
            <div className="s-field"><div className="s-label">GRID SIZE</div><input className="s-input" defaultValue="24px" /></div>
            <div className="s-field"><div className="s-label">SNAP TO GRID</div>
              <select className="s-select"><option>ENABLED</option><option>DISABLED</option></select>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
