'use client'

import { useState } from 'react'
import { ArtifactDrawer, type ArtifactData } from '@/components/artifacts/ArtifactDrawer'

const FILTER_TABS = ['ALL', 'SCRIPTS', 'POLICIES', 'TEMPLATES', 'CONFIGS', 'TOOLS', 'DESIGNS', 'DIAGRAMS', 'IMAGES', 'DOCS']
const FILTER_KEYS = ['all', 'script', 'policy', 'template', 'config', 'tool', 'design', 'diagram', 'image', 'document']

const FEATURED: ArtifactData[] = [
  {
    langId: 'xacml', name: 'zero-trust-xacml-library', type: 'policy',
    desc: 'Production-grade XACML policy library implementing zero-trust principles. Includes ABAC policies for multi-cloud environments, temporal restrictions, and geo-fencing rules. Battle-tested at Fortune 500 scale.',
    author: 'marcus.johnson', version: 'v2.4.1', license: 'MIT',
    avatarInitials: 'MJ', avatarBg: '#005530',
    tags: ['#XACML', '#ZeroTrust', '#ABAC', '#multi-cloud'],
    files: ['policy-set.xml', 'entities.json', 'test-suite.xml'],
  },
  {
    langId: 'python', name: 'jwt-debugger-cli', type: 'script',
    desc: 'Full-featured JWT inspection CLI in Python. Decodes header/payload, verifies signatures against JWKS endpoints, checks expiry, validates claims, and flags security misconfigurations. Supports RS256, ES256, HS256.',
    author: 'priya.lee', version: 'v2.0.1', license: 'MIT',
    avatarInitials: 'PL', avatarBg: '#552200',
    tags: ['#JWT', '#Python', '#JWKS', '#debugging'],
    files: ['jwt_debug.py', 'validators.py', 'requirements.txt'],
  },
]

interface ArtifactCardDef {
  data: ArtifactData
  downloads: string
  remixes: string
  badgeCls: string
  featured?: boolean
}

const ALL_ARTIFACTS: ArtifactCardDef[] = [
  {
    data: { langId: 'javascript', name: 'pkce-helper-js', type: 'script', desc: 'Minimal JS PKCE implementation. Generates code_verifier and code_challenge using Web Crypto API. Zero dependencies, browser-native.', author: 'alex.kim', version: 'v1.3.0', license: 'MIT', avatarInitials: 'AK', avatarBg: '#007744', tags: ['#PKCE', '#JavaScript', '#OAuth2'], files: ['pkce.js'] },
    downloads: '743', remixes: '56', badgeCls: 'badge-amber',
  },
  {
    data: { langId: 'yaml', name: 'okta-oidc-terraform', type: 'config', desc: 'Terraform module for provisioning Okta OIDC apps with best-practice defaults. PKCE enforced, refresh token rotation, MFA policies baked in.', author: 'tanya.chen', version: 'v1.8.0', license: 'Apache-2', avatarInitials: 'TC', avatarBg: '#cc2200', tags: ['#Terraform', '#Okta', '#OIDC'], files: ['main.tf', 'variables.tf'] },
    downloads: '876', remixes: '43', badgeCls: 'badge-blue',
  },
  {
    data: { langId: 'python', name: 'cedar-schema-validator', type: 'tool', desc: 'CLI tool that validates Cedar policy schemas against entity definitions. Catches type errors, missing namespaces, and unreachable policy branches pre-deployment.', author: 'david.wu', version: 'v0.9.3', license: 'MIT', avatarInitials: 'DW', avatarBg: '#003355', tags: ['#Cedar', '#validation', '#CLI'], files: ['validator.py', 'schema.cedar'] },
    downloads: '654', remixes: '31', badgeCls: 'badge-amber',
  },
  {
    data: { langId: 'xml', name: 'saml-response-decoder', type: 'tool', desc: 'Decode and inspect SAML 2.0 responses. Extracts NameID, attributes, conditions, and signature details. Highlights common misconfiguration patterns.', author: 'sarah.rahman', version: 'v3.1.0', license: 'MIT', avatarInitials: 'SR', avatarBg: '#cc2200', tags: ['#SAML', '#XML', '#debugging'], files: ['decode.py', 'sample_response.xml'] },
    downloads: '512', remixes: '28', badgeCls: 'badge-amber',
  },
  {
    data: { langId: 'python', name: 'scim-provisioning-template', type: 'template', desc: 'Complete SCIM 2.0 provisioning workflow in Python. User create, group assign, attribute sync, and deprovision flows with error handling and audit logging.', author: 'raj.okonkwo', version: 'v1.2.0', license: 'MIT', avatarInitials: 'RO', avatarBg: '#330055', tags: ['#SCIM', '#Python', '#provisioning'], files: ['scim_client.py', 'workflows.py'] },
    downloads: '388', remixes: '19', badgeCls: 'badge-purple',
  },
  {
    data: { langId: 'rego', name: 'opa-kubernetes-rbac', type: 'policy', desc: 'OPA/Rego policy bundle for Kubernetes admission control. Enforces namespace isolation, pod security standards, and service account restrictions.', author: 'david.wu', version: 'v1.0.0', license: 'Apache-2', avatarInitials: 'DW', avatarBg: '#003355', tags: ['#OPA', '#Kubernetes', '#RBAC'], files: ['rbac.rego', 'pod_security.rego'] },
    downloads: '334', remixes: '22', badgeCls: 'badge-em',
  },
  {
    data: { langId: 'typescript', name: 'token-refresh-handler-ts', type: 'script', desc: 'TypeScript class for OAuth 2.0 token lifecycle. Proactive refresh before expiry, rotation detection, concurrent request queuing, and auto-retry on 401.', author: 'alex.kim', version: 'v2.1.0', license: 'MIT', avatarInitials: 'AK', avatarBg: '#007744', tags: ['#TypeScript', '#OAuth2', '#tokens'], files: ['TokenManager.ts'] },
    downloads: '298', remixes: '17', badgeCls: 'badge-amber',
  },
  {
    data: { langId: 'toml', name: 'auth-server-toml-template', type: 'template', desc: 'Production-ready auth server config in TOML. Covers OIDC endpoints, client registration, token lifetimes, MFA policies, rate limiting, and TLS settings.', author: 'priya.lee', version: 'v1.0.0', license: 'MIT', avatarInitials: 'PL', avatarBg: '#552200', tags: ['#TOML', '#config', '#OIDC'], files: ['auth_server.toml'] },
    downloads: '241', remixes: '11', badgeCls: 'badge-purple',
  },
  {
    data: { langId: 'bash', name: 'ldap-audit-bash', type: 'script', desc: 'Bash scripts for LDAP/AD security auditing. Finds stale accounts, privileged group membership drift, password age violations, and MFA enrollment gaps.', author: 'marcus.johnson', version: 'v1.1.0', license: 'MIT', avatarInitials: 'MJ', avatarBg: '#005530', tags: ['#LDAP', '#Bash', '#audit'], files: ['ad_audit.sh', 'stale_accounts.sh'] },
    downloads: '187', remixes: '9', badgeCls: 'badge-amber',
  },
  {
    data: { langId: '', name: 'zero-trust-architecture-figma', type: 'design', desc: 'Figma component library for Zero Trust architecture diagrams. Includes actor, trust zone, policy enforcement point, and data flow primitives.', author: 'raj.okonkwo', version: 'v1.0.0', license: 'CC BY 4.0', avatarInitials: 'RO', avatarBg: '#330055', tags: ['#ZeroTrust', '#Figma', '#design'], files: ['zt-components.fig'] },
    downloads: '421', remixes: '38', badgeCls: 'badge-purple',
  },
  {
    data: { langId: '', name: 'oidc-auth-code-flow-diagram', type: 'diagram', desc: 'Full sequence diagram of the OIDC Authorization Code + PKCE flow. Mermaid source included. Shows all actors, redirects, token exchanges, and error paths.', author: 'david.wu', version: 'v2.0.0', license: 'MIT', avatarInitials: 'DW', avatarBg: '#003355', tags: ['#OIDC', '#PKCE', '#Mermaid'], files: ['auth-code-flow.mmd', 'auth-code-flow.svg'] },
    downloads: '318', remixes: '27', badgeCls: 'badge-blue',
  },
  {
    data: { langId: '', name: 'iam-reference-poster-2025', type: 'image', desc: 'High-resolution IAM reference poster. Covers OAuth 2.0, OIDC, SAML 2.0, SCIM, FIDO2, and Zero Trust on a single A0-sized cheat sheet. Print-ready PDF + PNG.', author: 'sarah.rahman', version: 'v2025.1', license: 'CC BY-NC', avatarInitials: 'SR', avatarBg: '#cc2200', tags: ['#reference', '#cheatsheet', '#print'], files: ['iam-poster-2025.png', 'iam-poster-2025.pdf'] },
    downloads: '892', remixes: '', badgeCls: 'badge-red',
  },
  {
    data: { langId: '', name: 'zero-trust-rfc-internal', type: 'document', desc: 'Internal RFC document proposing a Zero Trust adoption roadmap. 28-page PDF covering threat model, phased rollout plan, tooling evaluation, and success metrics.', author: 'tanya.chen', version: 'v3.0', license: 'All rights reserved', avatarInitials: 'TC', avatarBg: '#cc2200', tags: ['#ZeroTrust', '#RFC', '#strategy'], files: ['zt-rfc-v3.pdf'] },
    downloads: '567', remixes: '', badgeCls: 'badge-red',
  },
]

const BADGE_CLS: Record<string, string> = {
  policy: 'badge-em', script: 'badge-amber', tool: 'badge-amber',
  template: 'badge-purple', config: 'badge-blue', design: 'badge-purple',
  diagram: 'badge-blue', image: 'badge-red', document: 'badge-red',
}

function ArtifactCard({ card, onView }: { card: ArtifactCardDef; onView: (d: ArtifactData) => void }) {
  const { data, downloads, remixes, badgeCls } = card
  return (
    <div className="artifact-card" data-type={data.type}>
      <div className="artifact-card-inner">
        <div className="artifact-card-head">
          <span className={`badge ${BADGE_CLS[data.type] || 'badge-amber'}`}>{data.type.toUpperCase()}</span>
          <span style={{ marginLeft: 'auto', fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text3)' }}>
            ⬇ {downloads}{remixes ? ` · ⌥ ${remixes} remixes` : ''}
          </span>
        </div>
        <div className="artifact-title">{data.name}</div>
        <div className="artifact-desc">{data.desc}</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 8 }}>
          {data.tags.map(t => <span key={t} className="topic-pill">{t}</span>)}
        </div>
        <div className="artifact-meta-row">
          {data.files.map(f => <div key={f} className="artifact-file">▷ {f}</div>)}
        </div>
      </div>
      <div className="artifact-foot">
        <div className="artifact-author">
          <div className="u-sm-hex" style={{ width: 26, height: 26, fontSize: 9, background: `linear-gradient(135deg,${data.avatarBg},${data.avatarBg}88)` }}>
            {data.avatarInitials}
          </div>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text3)' }}>
            {data.author} · {data.version} · {data.license}
          </span>
        </div>
        <button className="av-view-btn" onClick={() => onView(data)}>VIEW →</button>
      </div>
    </div>
  )
}

export default function ArtifactsPage() {
  const [activeFilter, setActiveFilter] = useState(0)
  const [search, setSearch] = useState('')
  const [drawerArtifact, setDrawerArtifact] = useState<ArtifactData | null>(null)

  const filterKey = FILTER_KEYS[activeFilter]
  const filtered = ALL_ARTIFACTS.filter(c => {
    const matchesType = filterKey === 'all' || c.data.type === filterKey
    const matchesSearch = !search || c.data.name.toLowerCase().includes(search.toLowerCase()) || c.data.desc.toLowerCase().includes(search.toLowerCase()) || c.data.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
    return matchesType && matchesSearch
  })

  return (
    <>
      <div className="page-header">
        <div className="ph-row">
          <div>
            <div className="ph-title">ARTIFACTS</div>
            <div className="ph-sub">// scripts, policies, templates &amp; tools — view then remix</div>
          </div>
          <div className="ph-actions">
            <button className="btn-sec btn-ghost">⬆ UPLOAD</button>
            <button className="btn-sec btn-em">+ PUBLISH ARTIFACT</button>
          </div>
        </div>
      </div>

      <div className="inner-page">
        {/* Filter + search bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
          <div className="tab-bar" style={{ marginBottom: 0, flexWrap: 'wrap' }}>
            {FILTER_TABS.map((t, i) => (
              <div key={t} className={`tab${activeFilter === i ? ' active' : ''}`} onClick={() => setActiveFilter(i)}>{t}</div>
            ))}
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, border: '1px solid var(--border)', background: 'var(--panel)', padding: '5px 10px', fontFamily: 'var(--mono)', fontSize: 11, clipPath: 'polygon(0 0,calc(100% - 6px) 0,100% 6px,100% 100%,0 100%)' }}>
            <span style={{ color: 'var(--text3)' }}>$&gt;</span>
            <input
              type="text"
              placeholder="search artifacts..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ background: 'none', border: 'none', outline: 'none', fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text)', width: 180 }}
            />
          </div>
          <select className="s-select" style={{ width: 140, fontSize: 11 }}>
            <option>SORT: POPULAR</option>
            <option>SORT: NEWEST</option>
            <option>SORT: REMIXED</option>
          </select>
        </div>

        {/* Stats */}
        <div className="artifacts-stats-grid">
          <div className="stat-cell"><div className="stat-val">48</div><div className="stat-key">total artifacts</div></div>
          <div className="stat-cell"><div className="stat-val amb">1.8K</div><div className="stat-key">remixes</div></div>
          <div className="stat-cell"><div className="stat-val">6.2K</div><div className="stat-key">downloads</div></div>
          <div className="stat-cell"><div className="stat-val blue">12</div><div className="stat-key">my artifacts</div></div>
          <div className="stat-cell"><div className="stat-val">94%</div><div className="stat-key">open source</div></div>
        </div>

        {/* Featured — only show when filter is 'all' and no search query */}
        {filterKey === 'all' && !search && (
          <>
            <div className="sec-divider">FEATURED</div>
            <div className="artifacts-featured-grid">
              {FEATURED.map(art => (
                <div key={art.name} className="artifact-card">
                  <div className="artifact-card-inner">
                    <div className="artifact-card-head">
                      <span className={`badge ${BADGE_CLS[art.type] || 'badge-em'}`}>{art.type.toUpperCase()}</span>
                      <span className="badge badge-amber" style={{ fontSize: 9 }}>★ FEATURED</span>
                      <span style={{ marginLeft: 'auto', fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text3)' }}>
                        ⬇ {art.name === 'zero-trust-xacml-library' ? '1,204 · ⌥ 87 remixes' : '1,876 · ⌥ 134 remixes'}
                      </span>
                    </div>
                    <div className="artifact-title">{art.name}</div>
                    <div className="artifact-desc">{art.desc}</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 10 }}>
                      {art.tags.map(t => <span key={t} className="topic-pill">{t}</span>)}
                    </div>
                    <div className="artifact-meta-row">
                      {art.files.map(f => <div key={f} className="artifact-file">▷ {f}</div>)}
                    </div>
                  </div>
                  <div className="artifact-foot">
                    <div className="artifact-author">
                      <div className="u-sm-hex" style={{ width: 26, height: 26, fontSize: 9, background: `linear-gradient(135deg,${art.avatarBg},${art.avatarBg}88)` }}>
                        {art.avatarInitials}
                      </div>
                      <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text3)' }}>
                        {art.author} · {art.version} · {art.license}
                      </span>
                    </div>
                    <button className="av-view-btn" onClick={() => setDrawerArtifact(art)}>VIEW →</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* All artifacts grid */}
        <div className="sec-divider">{filterKey === 'all' && !search ? 'ALL ARTIFACTS' : `${FILTER_TABS[activeFilter]}${search ? ` // "${search}"` : ''}`}</div>
        {filtered.length === 0 ? (
          <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text3)', padding: '24px 0' }}>
            // no artifacts match the current filter
          </div>
        ) : (
          <div id="artifact-grid" className="artifacts-main-grid">
            {filtered.map(card => (
              <ArtifactCard key={card.data.name} card={card} onView={setDrawerArtifact} />
            ))}
          </div>
        )}
      </div>

      <ArtifactDrawer artifact={drawerArtifact} onClose={() => setDrawerArtifact(null)} />
    </>
  )
}
