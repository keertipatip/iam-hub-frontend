'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'

type ToolCat = 'all' | 'jwt' | 'saml' | 'oauth' | 'crypto' | 'mfa' | 'directory' | 'util'

interface Tool {
  id: string
  name: string
  icon: string
  iconColor: string
  desc: string
  badgeLabel: string
  badgeClass: string
  cats: ToolCat[]
}

const TOOLS: Tool[] = [
  { id: 'jwt-decoder',       name: 'JWT Decoder',               icon: '{ }',    iconColor: 'var(--amber)',  desc: 'Decode and inspect JSON Web Tokens — header, payload, expiry, and claims.', badgeLabel: 'JWT',     badgeClass: 'badge-amber',  cats: ['all','jwt'] },
  { id: 'jwt-generator',     name: 'JWT Generator',             icon: '✎',      iconColor: 'var(--amber)',  desc: 'Create and sign JWTs with custom claims for testing and development.',          badgeLabel: 'JWT',     badgeClass: 'badge-amber',  cats: ['all','jwt'] },
  { id: 'token-verifier',    name: 'Token Signature Verifier',  icon: '✓',      iconColor: 'var(--accent)', desc: 'Verify JWT signatures using public keys or JWKS endpoints.',                   badgeLabel: 'JWT',     badgeClass: 'badge-em',     cats: ['all','jwt','crypto'] },
  { id: 'saml-decoder',      name: 'SAML Decoder',              icon: '</>',    iconColor: 'var(--amber)',  desc: 'Decode SAML assertions and responses. Debug enterprise SSO integrations.',     badgeLabel: 'SAML',    badgeClass: 'badge-amber',  cats: ['all','saml'] },
  { id: 'saml-generator',    name: 'SAML Generator',            icon: '✎</>',   iconColor: 'var(--amber)',  desc: 'Generate SAML responses and assertions for testing SP integrations.',           badgeLabel: 'SAML',    badgeClass: 'badge-amber',  cats: ['all','saml'] },
  { id: 'x509',              name: 'X.509 Certificate Decoder', icon: '⊡',      iconColor: 'var(--blue)',   desc: 'Parse and analyze X.509 certificates. Check expiration and certificate details.', badgeLabel: 'PKI',   badgeClass: 'badge-blue',   cats: ['all','saml','crypto'] },
  { id: 'x509-generator',    name: 'X.509 Certificate Generator', icon:'⊞',    iconColor: 'var(--blue)',   desc: 'Generate self-signed certificates for testing. Create RSA or ECDSA key pairs.', badgeLabel: 'PKI',    badgeClass: 'badge-blue',   cats: ['all','saml','crypto'] },
  { id: 'claims-mapper',     name: 'Claims Mapper',             icon: '→',      iconColor: 'var(--purple)', desc: 'Simulate IdP to SP claims/attribute mapping with various transformations.',    badgeLabel: 'SAML',    badgeClass: 'badge-purple', cats: ['all','saml'] },
  { id: 'pkce',              name: 'PKCE Generator',            icon: 'P',      iconColor: 'var(--accent)', desc: 'Generate PKCE code verifier and code challenge for OAuth 2.0 public clients.', badgeLabel: 'OAuth',  badgeClass: 'badge-em',     cats: ['all','oauth'] },
  { id: 'oauth-url',         name: 'OAuth URL Builder',         icon: '⊕',      iconColor: 'var(--accent)', desc: 'Build OAuth 2.0 and OIDC authorization URLs with all parameters.',             badgeLabel: 'OAuth',   badgeClass: 'badge-em',     cats: ['all','oauth'] },
  { id: 'oidc-discovery',    name: 'OIDC Discovery Viewer',     icon: '◎',      iconColor: 'var(--accent)', desc: 'Fetch and analyze OpenID Connect discovery documents (.well-known).',           badgeLabel: 'OIDC',    badgeClass: 'badge-em',     cats: ['all','oauth'] },
  { id: 'state-nonce-debugger', name: 'OAuth State/Nonce Debugger', icon: '#', iconColor: 'var(--blue)',   desc: 'Generate, parse, and validate OAuth state and nonce parameters.',              badgeLabel: 'OAuth',   badgeClass: 'badge-blue',   cats: ['all','oauth'] },
  { id: 'introspection-tester', name: 'Introspection Tester',  icon: '?',      iconColor: 'var(--blue)',   desc: 'Generate RFC 7662 Token Introspection requests for opaque tokens.',             badgeLabel: 'OAuth',   badgeClass: 'badge-blue',   cats: ['all','oauth'] },
  { id: 'dpop',              name: 'DPoP Proof Generator',      icon: 'D',      iconColor: 'var(--purple)', desc: 'Generate RFC 9449 DPoP proofs for sender-constrained access tokens.',          badgeLabel: 'OAuth',   badgeClass: 'badge-purple', cats: ['all','oauth'] },
  { id: 'logout-url',        name: 'Logout URL Builder',        icon: '⏻',      iconColor: 'var(--red)',    desc: 'Build OIDC RP-Initiated Logout URLs with all standard parameters.',            badgeLabel: 'OIDC',    badgeClass: 'badge-red',    cats: ['all','oauth'] },
  { id: 'session-cookie-analyzer', name: 'Session Cookie Analyzer', icon: '🍪', iconColor: 'var(--red)',  desc: 'Analyze session cookie security attributes and identify vulnerabilities.',      badgeLabel: 'Session', badgeClass: 'badge-red',    cats: ['all','oauth'] },
  { id: 'jwk',               name: 'JWK Generator & Viewer',   icon: '⚿',      iconColor: 'var(--accent)', desc: 'Generate RSA/EC key pairs in JWK format. Analyze existing JSON Web Keys.',    badgeLabel: 'Crypto',  badgeClass: 'badge-em',     cats: ['all','crypto'] },
  { id: 'hmac',              name: 'HMAC Generator',            icon: 'H',      iconColor: 'var(--accent)', desc: 'Generate and verify HMAC signatures. Validate webhook signatures and API auth.', badgeLabel: 'Crypto', badgeClass: 'badge-em',    cats: ['all','crypto'] },
  { id: 'password-hash',     name: 'Password Hash Generator',  icon: '#',      iconColor: 'var(--amber)',  desc: 'Generate PBKDF2 password hashes. Secure password storage and verification.',  badgeLabel: 'Crypto',  badgeClass: 'badge-amber',  cats: ['all','crypto'] },
  { id: 'random-string',     name: 'Random String Generator',  icon: '∿',      iconColor: 'var(--purple)', desc: 'Generate cryptographically secure random strings for secrets and tokens.',    badgeLabel: 'Crypto',  badgeClass: 'badge-purple', cats: ['all','crypto'] },
  { id: 'api-key-analyzer',  name: 'API Key Analyzer',         icon: '⚑',      iconColor: 'var(--amber)',  desc: 'Identify API key types, assess security risks, and get best practices.',       badgeLabel: 'Crypto',  badgeClass: 'badge-amber',  cats: ['all','crypto'] },
  { id: 'password-policy-tester', name: 'Password Policy Tester', icon: '✓',  iconColor: 'var(--amber)',  desc: 'Test passwords against configurable security policies with strength estimation.', badgeLabel:'Crypto', badgeClass: 'badge-amber',  cats: ['all','crypto'] },
  { id: 'otp-generator',     name: 'OTP Generator',            icon: 'OTP',    iconColor: 'var(--accent)', desc: 'Generate and verify TOTP/HOTP one-time passwords for MFA testing.',           badgeLabel: 'MFA',     badgeClass: 'badge-em',     cats: ['all','mfa'] },
  { id: 'qr-code',           name: 'QR Code Generator',        icon: '⊡',      iconColor: 'var(--accent)', desc: 'Generate QR codes for MFA setup and otpauth:// URIs.',                        badgeLabel: 'MFA',     badgeClass: 'badge-em',     cats: ['all','mfa'] },
  { id: 'webauthn-debugger', name: 'WebAuthn / Passkey Debugger', icon: '🔑',  iconColor: 'var(--blue)',   desc: 'Parse and analyze WebAuthn registration and authentication responses.',        badgeLabel: 'Passkeys',badgeClass: 'badge-blue',   cats: ['all','mfa'] },
  { id: 'ldap-filter',       name: 'LDAP Filter Builder',      icon: 'L',      iconColor: 'var(--amber)',  desc: 'Build and test LDAP/Active Directory filter expressions for directory queries.', badgeLabel:'Directory',badgeClass: 'badge-amber',  cats: ['all','directory'] },
  { id: 'scim-filter',       name: 'SCIM Filter Builder',      icon: 'S',      iconColor: 'var(--purple)', desc: 'Build and test SCIM 2.0 filter expressions for user provisioning queries.',   badgeLabel: 'SCIM',    badgeClass: 'badge-purple', cats: ['all','directory'] },
  { id: 'policy-evaluator',  name: 'Policy Evaluator',         icon: '⊛',      iconColor: 'var(--accent)', desc: 'Simulate RBAC and ABAC access control policy evaluation.',                    badgeLabel: 'Policy',  badgeClass: 'badge-em',     cats: ['all','directory'] },
  { id: 'uuid',              name: 'UUID Generator',           icon: 'id',     iconColor: 'var(--text-3)', desc: 'Generate and decode UUIDs (v4, v7). Create unique identifiers for users and sessions.', badgeLabel:'Utils', badgeClass: '',          cats: ['all','directory'] },
  { id: 'timestamp',         name: 'Timestamp Converter',      icon: '⏱',      iconColor: 'var(--blue)',   desc: 'Convert between Unix timestamps and human-readable dates. Essential for token expiry analysis.', badgeLabel:'Utils', badgeClass:'badge-blue', cats: ['all','util'] },
  { id: 'base64',            name: 'Base64 Encoder/Decoder',   icon: 'B64',    iconColor: 'var(--blue)',   desc: 'Encode and decode Base64, URL-safe Base64. Essential for SAML and OIDC debugging.', badgeLabel:'Utils',  badgeClass: 'badge-blue',   cats: ['all','util'] },
  { id: 'url-encoder',       name: 'URL Encoder/Decoder',      icon: '%',      iconColor: 'var(--blue)',   desc: 'Encode and decode URL strings. Handle query parameters and special characters.', badgeLabel:'Utils',   badgeClass: 'badge-blue',   cats: ['all','util'] },
  { id: 'json-formatter',    name: 'JSON Formatter',           icon: '{ }',    iconColor: 'var(--amber)',  desc: 'Format, validate, and minify JSON. Analyze JSON structure and statistics.',   badgeLabel: 'Utils',   badgeClass: 'badge-amber',  cats: ['all','util'] },
  { id: 'regex-tester',      name: 'Regex Tester',             icon: '.*',     iconColor: 'var(--purple)', desc: 'Test and validate regular expressions with real-time matching and highlighting.', badgeLabel:'Utils',  badgeClass: 'badge-purple', cats: ['all','util'] },
]

const CAT_FILTERS: { id: ToolCat; label: string }[] = [
  { id: 'all',       label: 'All tools' },
  { id: 'jwt',       label: 'JWT' },
  { id: 'saml',      label: 'SAML' },
  { id: 'oauth',     label: 'OAuth / OIDC' },
  { id: 'crypto',    label: 'Crypto & Keys' },
  { id: 'mfa',       label: 'MFA & Passkeys' },
  { id: 'directory', label: 'Directory' },
  { id: 'util',      label: 'Utilities' },
]

const SECTIONS: { id: ToolCat; label: string }[] = [
  { id: 'jwt',       label: 'JWT — JSON Web Tokens' },
  { id: 'saml',      label: 'SAML 2.0' },
  { id: 'oauth',     label: 'OAuth 2.0 / OIDC' },
  { id: 'crypto',    label: 'Crypto & Keys' },
  { id: 'mfa',       label: 'MFA & Passkeys' },
  { id: 'directory', label: 'Directory & Provisioning' },
  { id: 'util',      label: 'Utilities & Encoding' },
]

export default function ToolsPage() {
  const [activeCat, setActiveCat] = useState<ToolCat>('all')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return TOOLS.filter(t => {
      const catMatch = t.cats.includes(activeCat)
      const searchMatch = !q || t.name.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q)
      return catMatch && searchMatch
    })
  }, [activeCat, search])

  function isSectionVisible(id: ToolCat) {
    return filtered.some(t => t.cats.includes(id))
  }

  return (
    <>
      {/* Page header */}
      <div style={{ padding: '28px 32px 0', background: 'var(--bg)', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 600, color: 'var(--text)', letterSpacing: '-.3px', marginBottom: 4 }}>Tools</div>
            <div style={{ fontSize: 13, color: 'var(--text-3)' }}>34 free IAM utilities — 100% client-side, no data leaves your browser</div>
          </div>
        </div>

        {/* Search bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, height: 38, border: '1px solid var(--border)', borderRadius: 10, background: 'var(--bg-secondary)', padding: '0 14px' }}>
            <span style={{ fontSize: 14, color: 'var(--text-3)' }}>⌕</span>
            <input
              type="text"
              placeholder="Search tools..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontFamily: 'var(--sans)', fontSize: 14, color: 'var(--text)' }}
            />
            {search && (
              <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', fontSize: 16, padding: 0, lineHeight: 1 }}>×</button>
            )}
          </div>
        </div>

        {/* Filter chips */}
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: 1 }}>
          {CAT_FILTERS.map(f => (
            <button
              key={f.id}
              onClick={() => setActiveCat(f.id)}
              style={{
                padding: '5px 14px', borderRadius: 9999, border: '1px solid',
                borderColor: activeCat === f.id ? 'var(--text)' : 'var(--border)',
                background: activeCat === f.id ? 'var(--text)' : 'transparent',
                color: activeCat === f.id ? 'var(--bg)' : 'var(--text-2)',
                fontFamily: 'var(--sans)', fontSize: 13, fontWeight: activeCat === f.id ? 500 : 400,
                cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all .15s', flexShrink: 0,
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '28px 32px', overflowY: 'auto', flex: 1 }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{ fontSize: 32, marginBottom: 12, opacity: .3 }}>⚙</div>
            <div style={{ fontSize: 15, color: 'var(--text-3)' }}>No tools match &ldquo;{search}&rdquo;</div>
            <button onClick={() => setSearch('')} style={{ marginTop: 12, background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: 13 }}>Clear search</button>
          </div>
        ) : activeCat !== 'all' ? (
          /* Single category view — flat grid */
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
            {filtered.map(tool => <ToolCard key={tool.id} tool={tool} />)}
          </div>
        ) : (
          /* All — sectioned */
          SECTIONS.map(section => {
            if (!isSectionVisible(section.id)) return null
            const sectionTools = filtered.filter(t => t.cats.includes(section.id))
            return (
              <div key={section.id} style={{ marginBottom: 40 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>{section.label}</span>
                  <span style={{ fontSize: 12, color: 'var(--text-3)', fontFamily: 'var(--mono)' }}>{sectionTools.length}</span>
                  <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
                  {sectionTools.map(tool => <ToolCard key={tool.id} tool={tool} />)}
                </div>
              </div>
            )
          })
        )}

        <div style={{ marginTop: 24, padding: '14px 18px', border: '1px solid var(--border)', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 10, background: 'var(--bg-secondary)', fontSize: 13, color: 'var(--text-3)' }}>
          <span style={{ fontSize: 16 }}>🔒</span>
          All tools run entirely in your browser — no data is ever transmitted to any server.
        </div>
      </div>
    </>
  )
}

function ToolCard({ tool }: { tool: Tool }) {
  return (
    <div className="tool-card">
      <div style={{ padding: '18px 20px', flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <span className={`badge ${tool.badgeClass}`}>{tool.badgeLabel}</span>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 13, color: tool.iconColor, fontWeight: 600 }}>{tool.icon}</span>
        </div>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', lineHeight: 1.3 }}>{tool.name}</div>
        <div style={{ fontSize: 13, color: 'var(--text-3)', lineHeight: 1.6, flex: 1 }}>{tool.desc}</div>
      </div>
      <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
        <Link
          href={`/tools/${tool.id}`}
          style={{ display: 'block', textAlign: 'center', padding: '7px 14px', background: 'var(--text)', color: 'var(--bg)', borderRadius: 8, fontFamily: 'var(--sans)', fontSize: 13, fontWeight: 500, textDecoration: 'none', transition: 'opacity .15s' }}
        >
          Open tool
        </Link>
      </div>
    </div>
  )
}
