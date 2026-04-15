'use client'

import { useToast } from '../ToastProvider'

interface SimCard {
  key: string
  badge: string
  badgeCls: string
  diff: string
  diffCls: string
  runs: string
  title: string
  desc: string
  pills: string[]
  by: string
  byCls: string
  steps: number
  tag: 'official' | 'community' | 'mine'
}

const SIMS: SimCard[] = [
  { key: 'oidc-pkce', badge: 'OIDC', badgeCls: 'badge-em', diff: 'BEGINNER', diffCls: 'diff-beginner', runs: '342 runs', title: 'OIDC Authorization Code + PKCE', desc: 'Step-through the full PKCE flow with code verifier generation, authorization redirect, MFA challenge, and token exchange. Includes JWT decoder.', pills: ['#PKCE', '#JWT', '#MFA'], by: 'IAMHUB_CORE', byCls: 'var(--em)', steps: 14, tag: 'official' },
  { key: 'saml-sso', badge: 'SAML', badgeCls: 'badge-amber', diff: 'INTERMEDIATE', diffCls: 'diff-intermediate', runs: '218 runs', title: 'SAML 2.0 Web SSO', desc: 'Trace the SP-initiated SSO flow with AuthnRequest construction, IdP assertion validation, and attribute mapping. XML assertion breakdown included.', pills: ['#SAML', '#SSO', '#XML'], by: 'IAMHUB_CORE', byCls: 'var(--em)', steps: 11, tag: 'official' },
  { key: 'client-credentials', badge: 'OAUTH2', badgeCls: 'badge-blue', diff: 'BEGINNER', diffCls: 'diff-beginner', runs: '189 runs', title: 'OAuth 2.0 Client Credentials', desc: 'Machine-to-machine flow without user context. Client secret exchange, scope validation, opaque token introspection, and refresh patterns.', pills: ['#M2M', '#ClientCredentials'], by: 'IAMHUB_CORE', byCls: 'var(--em)', steps: 9, tag: 'official' },
  { key: 'device-flow', badge: 'OAUTH2', badgeCls: 'badge-blue', diff: 'INTERMEDIATE', diffCls: 'diff-intermediate', runs: '97 runs', title: 'Device Authorization Grant', desc: 'TV/IoT device flow: device_code issuance, polling loop, user approval on secondary device, and final token exchange walkthrough.', pills: ['#DeviceFlow', '#IoT'], by: 'IAMHUB_CORE', byCls: 'var(--em)', steps: 12, tag: 'official' },
  { key: 'fido2-webauthn', badge: 'FIDO2', badgeCls: 'badge-purple', diff: 'ADVANCED', diffCls: 'diff-advanced', runs: '156 runs', title: 'FIDO2 / WebAuthn Registration + Auth', desc: 'Full passkey lifecycle: credential creation, authenticator attestation, challenge verification, and assertion validation with UV flags.', pills: ['#passkeys', '#WebAuthn', '#CBOR'], by: 'IAMHUB_CORE', byCls: 'var(--em)', steps: 18, tag: 'official' },
  { key: 'token-refresh', badge: 'OAUTH2', badgeCls: 'badge-blue', diff: 'BEGINNER', diffCls: 'diff-beginner', runs: '134 runs', title: 'Token Refresh + Rotation', desc: 'Access token expiry handling, refresh token grant, token rotation policies, and detection of replay attacks on stale refresh tokens.', pills: ['#refresh', '#rotation', '#security'], by: 'IAMHUB_CORE', byCls: 'var(--em)', steps: 8, tag: 'official' },
  { key: 'mfa-bypass', badge: 'ATTACK', badgeCls: 'badge-red', diff: 'ADVANCED', diffCls: 'diff-advanced', runs: '88 runs', title: 'MFA Bypass — TOTP Interception', desc: 'Red-team scenario: AiTM proxy intercepts TOTP code, replays auth session. Includes detection signals and countermeasures walkthrough.', pills: ['#redteam', '#AiTM', '#TOTP'], by: 'sarah.rahman', byCls: 'var(--amber)', steps: 16, tag: 'community' },
  { key: 'scim-lifecycle', badge: 'SCIM', badgeCls: 'badge-purple', diff: 'INTERMEDIATE', diffCls: 'diff-intermediate', runs: '74 runs', title: 'SCIM Provisioning Lifecycle', desc: 'User create → group assignment → attribute sync → deprovisioning via SCIM 2.0. Covers filtering, patch ops, and bulk endpoints.', pills: ['#SCIM', '#provisioning'], by: 'raj.okonkwo', byCls: 'var(--amber)', steps: 13, tag: 'community' },
  { key: 'jwt-multiregion', badge: 'JWT', badgeCls: 'badge-em', diff: 'ADVANCED', diffCls: 'diff-advanced', runs: '12 runs', title: 'JWT Rotation in Multi-Region', desc: 'Simulates cross-region JWKS cache TTL mismatch leading to 401s. Shows cache invalidation strategy and edge-region key sync patterns.', pills: ['#JWT', '#JWKS', '#multi-region'], by: 'alex.kim ✦', byCls: 'var(--em)', steps: 10, tag: 'mine' },
]

interface Props {
  onLaunch: (key: string) => void
  onCreate: () => void
  filter: string
  onFilter: (f: string) => void
}

export function SimLibrary({ onLaunch, onCreate, filter, onFilter }: Props) {
  const { toast } = useToast()
  const visible = SIMS.filter(s => filter === 'all' || s.tag === filter)
  const official = visible.filter(s => s.tag === 'official')
  const community = visible.filter(s => s.tag === 'community')
  const mine = visible.filter(s => s.tag === 'mine')

  return (
    <>
      <div className="pg-toolbar">
        <div className="pg-toolbar-title"><div className="pg-dot"></div>SIMULATION_LIBRARY</div>
        <div className="pg-sep"></div>
        <div id="sim-lib-tabs" style={{ display: 'flex', gap: 2 }}>
          {['all', 'official', 'community', 'mine'].map(f => (
            <button
              key={f}
              className={`c-tool${filter === f ? ' active' : ''}`}
              onClick={() => onFilter(f)}
            >
              {f === 'mine' ? 'MY_SIMS' : f.toUpperCase()}
            </button>
          ))}
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 6, alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, border: '1px solid var(--border)', background: 'var(--panel)', padding: '5px 10px', fontFamily: 'var(--mono)', fontSize: 11, clipPath: 'polygon(0 0,calc(100% - 6px) 0,100% 6px,100% 100%,0 100%)' }}>
            <span style={{ color: 'var(--text3)' }}>$&gt;</span>
            <input type="text" placeholder="search simulations..." style={{ background: 'none', border: 'none', outline: 'none', fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text)', width: 180 }} />
          </div>
          <button className="btn-sec btn-em" style={{ padding: '7px 14px', fontSize: 11 }} onClick={onCreate}>+ CREATE SIM</button>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px', background: 'var(--base)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 24 }}>
          <div className="stat-cell"><div className="stat-val">24</div><div className="stat-key">total sims</div></div>
          <div className="stat-cell"><div className="stat-val amb">8</div><div className="stat-key">community</div></div>
          <div className="stat-cell"><div className="stat-val">3</div><div className="stat-key">mine</div></div>
          <div className="stat-cell"><div className="stat-val blue">1.4K</div><div className="stat-key">total runs</div></div>
        </div>

        {(filter === 'all' || filter === 'official') && official.length > 0 && (
          <>
            <div className="sec-divider">OFFICIAL SIMULATIONS</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 28 }}>
              {official.map(s => <SimCardEl key={s.key} sim={s} onLaunch={onLaunch} />)}
            </div>
          </>
        )}

        {(filter === 'all' || filter === 'community') && community.length > 0 && (
          <>
            <div className="sec-divider">COMMUNITY SIMULATIONS</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 28 }}>
              {community.map(s => <SimCardEl key={s.key} sim={s} onLaunch={onLaunch} />)}
            </div>
          </>
        )}

        {(filter === 'all' || filter === 'mine') && mine.length > 0 && (
          <>
            <div className="sec-divider">MY SIMULATIONS</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 28 }}>
              {mine.map(s => <SimCardEl key={s.key} sim={s} onLaunch={onLaunch} />)}
            </div>
          </>
        )}
      </div>
    </>
  )
}

function SimCardEl({ sim, onLaunch }: { sim: SimCard; onLaunch: (k: string) => void }) {
  return (
    <div className="sim-card" data-tag={sim.tag}>
      <div className="sim-card-inner">
        <div className="sim-card-head">
          <span className={`badge ${sim.badgeCls}`} style={{ fontSize: 9 }}>{sim.badge}</span>
          <span className={`sim-diff ${sim.diffCls}`}>{sim.diff}</span>
          <span style={{ marginLeft: 'auto', fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text3)' }}>↑ {sim.runs}</span>
        </div>
        <div className="sim-card-title">{sim.title}</div>
        <div className="sim-card-desc">{sim.desc}</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 10 }}>
          {sim.pills.map(p => <span key={p} className="topic-pill">{p}</span>)}
        </div>
      </div>
      <div className="sim-card-foot">
        <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text3)' }}>
          by <span style={{ color: sim.byCls }}>{sim.by}</span> · {sim.steps} steps
        </div>
        <button className="sim-launch-btn" onClick={() => onLaunch(sim.key)}>▷ LAUNCH</button>
      </div>
    </div>
  )
}
