'use client'

import { useState } from 'react'
import { ArtifactDrawer, type ArtifactData } from '@/components/artifacts/ArtifactDrawer'

const TYPE_FILTERS = ['All', 'Scripts', 'Policies', 'Templates', 'Configs', 'Tools', 'Designs', 'Diagrams', 'Docs']
const TYPE_KEYS    = ['all', 'script', 'policy', 'template', 'config', 'tool', 'design', 'diagram', 'document']

const BADGE_CLS: Record<string, string> = {
  policy: 'badge-em', script: 'badge-amber', tool: 'badge-amber',
  template: 'badge-purple', config: 'badge-blue', design: 'badge-purple',
  diagram: 'badge-blue', image: 'badge-red', document: 'badge-red',
}

interface ArtifactCardDef { data: ArtifactData; downloads: string; remixes: string; featured?: boolean }

const ALL_ARTIFACTS: ArtifactCardDef[] = [
  { featured: true, data: { langId: 'xacml', name: 'zero-trust-xacml-library', type: 'policy', desc: 'Production-grade XACML policy library implementing zero-trust principles. Includes ABAC policies for multi-cloud environments, temporal restrictions, and geo-fencing rules.', author: 'marcus.johnson', version: 'v2.4.1', license: 'MIT', avatarInitials: 'MJ', avatarBg: '#005530', tags: ['#XACML','#ZeroTrust','#ABAC'], files: ['policy-set.xml','entities.json','test-suite.xml'] }, downloads: '1,204', remixes: '87' },
  { featured: true, data: { langId: 'python', name: 'jwt-debugger-cli', type: 'script', desc: 'Full-featured JWT inspection CLI in Python. Decodes header/payload, verifies signatures against JWKS endpoints, checks expiry, and flags security misconfigurations.', author: 'priya.lee', version: 'v2.0.1', license: 'MIT', avatarInitials: 'PL', avatarBg: '#552200', tags: ['#JWT','#Python','#JWKS'], files: ['jwt_debug.py','validators.py','requirements.txt'] }, downloads: '1,876', remixes: '134' },
  { data: { langId: 'javascript', name: 'pkce-helper-js', type: 'script', desc: 'Minimal JS PKCE implementation. Generates code_verifier and code_challenge using Web Crypto API. Zero dependencies, browser-native.', author: 'alex.kim', version: 'v1.3.0', license: 'MIT', avatarInitials: 'AK', avatarBg: '#007744', tags: ['#PKCE','#JavaScript','#OAuth2'], files: ['pkce.js'] }, downloads: '743', remixes: '56' },
  { data: { langId: 'yaml', name: 'okta-oidc-terraform', type: 'config', desc: 'Terraform module for provisioning Okta OIDC apps with best-practice defaults. PKCE enforced, refresh token rotation, MFA policies baked in.', author: 'tanya.chen', version: 'v1.8.0', license: 'Apache-2', avatarInitials: 'TC', avatarBg: '#cc2200', tags: ['#Terraform','#Okta','#OIDC'], files: ['main.tf','variables.tf'] }, downloads: '876', remixes: '43' },
  { data: { langId: 'python', name: 'cedar-schema-validator', type: 'tool', desc: 'CLI tool that validates Cedar policy schemas against entity definitions. Catches type errors, missing namespaces, and unreachable policy branches pre-deployment.', author: 'david.wu', version: 'v0.9.3', license: 'MIT', avatarInitials: 'DW', avatarBg: '#003355', tags: ['#Cedar','#validation','#CLI'], files: ['validator.py','schema.cedar'] }, downloads: '654', remixes: '31' },
  { data: { langId: 'xml', name: 'saml-response-decoder', type: 'tool', desc: 'Decode and inspect SAML 2.0 responses. Extracts NameID, attributes, conditions, and signature details. Highlights common misconfiguration patterns.', author: 'sarah.rahman', version: 'v3.1.0', license: 'MIT', avatarInitials: 'SR', avatarBg: '#cc2200', tags: ['#SAML','#XML','#debugging'], files: ['decode.py','sample_response.xml'] }, downloads: '512', remixes: '28' },
  { data: { langId: 'python', name: 'scim-provisioning-template', type: 'template', desc: 'Complete SCIM 2.0 provisioning workflow in Python. User create, group assign, attribute sync, and deprovision flows with error handling and audit logging.', author: 'raj.okonkwo', version: 'v1.2.0', license: 'MIT', avatarInitials: 'RO', avatarBg: '#330055', tags: ['#SCIM','#Python','#provisioning'], files: ['scim_client.py','workflows.py'] }, downloads: '388', remixes: '19' },
  { data: { langId: 'rego', name: 'opa-kubernetes-rbac', type: 'policy', desc: 'OPA/Rego policy bundle for Kubernetes admission control. Enforces namespace isolation, pod security standards, and service account restrictions.', author: 'david.wu', version: 'v1.0.0', license: 'Apache-2', avatarInitials: 'DW', avatarBg: '#003355', tags: ['#OPA','#Kubernetes','#RBAC'], files: ['rbac.rego','pod_security.rego'] }, downloads: '334', remixes: '22' },
  { data: { langId: 'typescript', name: 'token-refresh-handler-ts', type: 'script', desc: 'TypeScript class for OAuth 2.0 token lifecycle. Proactive refresh before expiry, rotation detection, concurrent request queuing, and auto-retry on 401.', author: 'alex.kim', version: 'v2.1.0', license: 'MIT', avatarInitials: 'AK', avatarBg: '#007744', tags: ['#TypeScript','#OAuth2','#tokens'], files: ['TokenManager.ts'] }, downloads: '298', remixes: '17' },
  { data: { langId: 'toml', name: 'auth-server-toml-template', type: 'template', desc: 'Production-ready auth server config in TOML. Covers OIDC endpoints, client registration, token lifetimes, MFA policies, rate limiting, and TLS settings.', author: 'priya.lee', version: 'v1.0.0', license: 'MIT', avatarInitials: 'PL', avatarBg: '#552200', tags: ['#TOML','#config','#OIDC'], files: ['auth_server.toml'] }, downloads: '241', remixes: '11' },
  { data: { langId: 'bash', name: 'ldap-audit-bash', type: 'script', desc: 'Bash scripts for LDAP/AD security auditing. Finds stale accounts, privileged group membership drift, password age violations, and MFA enrollment gaps.', author: 'marcus.johnson', version: 'v1.1.0', license: 'MIT', avatarInitials: 'MJ', avatarBg: '#005530', tags: ['#LDAP','#Bash','#audit'], files: ['ad_audit.sh','stale_accounts.sh'] }, downloads: '187', remixes: '9' },
  { data: { langId: '', name: 'zero-trust-architecture-figma', type: 'design', desc: 'Figma component library for Zero Trust architecture diagrams. Includes actor, trust zone, policy enforcement point, and data flow primitives.', author: 'raj.okonkwo', version: 'v1.0.0', license: 'CC BY 4.0', avatarInitials: 'RO', avatarBg: '#330055', tags: ['#ZeroTrust','#Figma','#design'], files: ['zt-components.fig'] }, downloads: '421', remixes: '38' },
  { data: { langId: '', name: 'oidc-auth-code-flow-diagram', type: 'diagram', desc: 'Full sequence diagram of the OIDC Authorization Code + PKCE flow. Mermaid source included. Shows all actors, redirects, token exchanges, and error paths.', author: 'david.wu', version: 'v2.0.0', license: 'MIT', avatarInitials: 'DW', avatarBg: '#003355', tags: ['#OIDC','#PKCE','#Mermaid'], files: ['auth-code-flow.mmd','auth-code-flow.svg'] }, downloads: '318', remixes: '27' },
  { data: { langId: '', name: 'zero-trust-rfc-internal', type: 'document', desc: 'Internal RFC document proposing a Zero Trust adoption roadmap. 28-page PDF covering threat model, phased rollout plan, tooling evaluation, and success metrics.', author: 'tanya.chen', version: 'v3.0', license: 'All rights reserved', avatarInitials: 'TC', avatarBg: '#cc2200', tags: ['#ZeroTrust','#RFC','#strategy'], files: ['zt-rfc-v3.pdf'] }, downloads: '567', remixes: '' },
]

function ArtifactCard({ card, onView }: { card: ArtifactCardDef; onView: (d: ArtifactData) => void }) {
  const { data, downloads, remixes } = card
  return (
    <div className="artifact-card" style={{ cursor: 'pointer' }} onClick={() => onView(data)}>
      <div style={{ padding: '18px 20px', flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className={`badge ${BADGE_CLS[data.type] || 'badge-amber'}`}>{data.type}</span>
          {card.featured && <span className="badge badge-amber" style={{ fontSize: 10 }}>Featured</span>}
          <span style={{ marginLeft: 'auto', fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text-3)' }}>
            ↓ {downloads}{remixes ? ` · ⌥ ${remixes}` : ''}
          </span>
        </div>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', fontFamily: 'var(--mono)', letterSpacing: '.2px' }}>{data.name}</div>
        <div style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6, flex: 1 }}>{data.desc}</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 4 }}>
          {data.tags.map(t => <span key={t} className="topic-pill">{t}</span>)}
        </div>
      </div>
      <div style={{ padding: '10px 20px', borderTop: '1px solid var(--border)', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <div style={{ width: 22, height: 22, borderRadius: 6, background: data.avatarBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: '#fff' }}>{data.avatarInitials}</div>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text-3)' }}>{data.author} · {data.version}</span>
        </div>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text-3)' }}>{data.license}</span>
      </div>
    </div>
  )
}

export default function ArtifactsPage() {
  const [activeFilter, setActiveFilter] = useState(0)
  const [search, setSearch] = useState('')
  const [drawerArtifact, setDrawerArtifact] = useState<ArtifactData | null>(null)

  const filterKey = TYPE_KEYS[activeFilter]
  const filtered = ALL_ARTIFACTS.filter(c => {
    const matchesType = filterKey === 'all' || c.data.type === filterKey
    const matchesSearch = !search || c.data.name.toLowerCase().includes(search.toLowerCase()) || c.data.desc.toLowerCase().includes(search.toLowerCase())
    return matchesType && matchesSearch
  })

  const featured = filtered.filter(c => c.featured)
  const rest     = filtered.filter(c => !c.featured)

  return (
    <>
      {/* Header */}
      <div style={{ padding: '28px 32px 0', background: 'var(--bg)', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 600, color: 'var(--text)', letterSpacing: '-.3px', marginBottom: 4 }}>Artifacts</div>
            <div style={{ fontSize: 13, color: 'var(--text-3)' }}>Scripts, policies, templates &amp; tools — browse, remix, and share</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn-sec">Upload</button>
            <button style={{ padding: '7px 16px', background: 'var(--text)', color: 'var(--bg)', border: 'none', borderRadius: 10, fontFamily: 'var(--sans)', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>+ Publish</button>
          </div>
        </div>

        {/* Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, height: 38, border: '1px solid var(--border)', borderRadius: 10, background: 'var(--bg-secondary)', padding: '0 14px' }}>
            <span style={{ fontSize: 14, color: 'var(--text-3)' }}>⌕</span>
            <input
              type="text"
              placeholder="Search artifacts..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontFamily: 'var(--sans)', fontSize: 14, color: 'var(--text)' }}
            />
            {search && <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', fontSize: 16, padding: 0 }}>×</button>}
          </div>
          <select style={{ height: 38, padding: '0 12px', border: '1px solid var(--border)', borderRadius: 10, background: 'var(--bg-secondary)', fontFamily: 'var(--sans)', fontSize: 13, color: 'var(--text)', outline: 'none' }}>
            <option>Popular</option>
            <option>Newest</option>
            <option>Most remixed</option>
          </select>
        </div>

        {/* Filter chips */}
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: 1 }}>
          {TYPE_FILTERS.map((f, i) => (
            <button
              key={f}
              onClick={() => setActiveFilter(i)}
              style={{
                padding: '5px 14px', borderRadius: 9999, border: '1px solid',
                borderColor: activeFilter === i ? 'var(--text)' : 'var(--border)',
                background: activeFilter === i ? 'var(--text)' : 'transparent',
                color: activeFilter === i ? 'var(--bg)' : 'var(--text-2)',
                fontFamily: 'var(--sans)', fontSize: 13, fontWeight: activeFilter === i ? 500 : 400,
                cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all .15s', flexShrink: 0,
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '28px 32px', overflowY: 'auto', flex: 1 }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{ fontSize: 32, marginBottom: 12, opacity: .3 }}>◈</div>
            <div style={{ fontSize: 15, color: 'var(--text-3)' }}>No artifacts match your filter</div>
            <button onClick={() => { setSearch(''); setActiveFilter(0) }} style={{ marginTop: 12, background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: 13 }}>Clear filters</button>
          </div>
        ) : (
          <>
            {/* Featured */}
            {featured.length > 0 && filterKey === 'all' && !search && (
              <div style={{ marginBottom: 40 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>Featured</span>
                  <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  {featured.map(card => <ArtifactCard key={card.data.name} card={card} onView={setDrawerArtifact} />)}
                </div>
              </div>
            )}

            {/* All / filtered */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>
                  {filterKey === 'all' && !search ? 'All artifacts' : TYPE_FILTERS[activeFilter]}
                </span>
                <span style={{ fontSize: 12, color: 'var(--text-3)', fontFamily: 'var(--mono)' }}>{filtered.length}</span>
                <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
                {(filterKey === 'all' && !search ? rest : filtered).map(card => (
                  <ArtifactCard key={card.data.name} card={card} onView={setDrawerArtifact} />
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      <ArtifactDrawer artifact={drawerArtifact} onClose={() => setDrawerArtifact(null)} />
    </>
  )
}
