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
  uses: string
  badgeLabel: string
  badgeClass: string
  cats: ToolCat[]
}

const TOOLS: Tool[] = [
  // JWT
  { id: 'jwt-decoder', name: 'JWT Decoder', icon: '{ }', iconColor: 'var(--amber)', desc: 'Decode and inspect JSON Web Tokens. View header, payload, and verify signatures.', uses: 'Debug OAuth 2.0/OIDC tokens · analyze access_token and id_token claims · verify expiry (exp/iat/nbf) · inspect API Gateway tokens', badgeLabel: 'JWT', badgeClass: 'badge-amber', cats: ['all', 'jwt'] },
  { id: 'jwt-generator', name: 'JWT Generator', icon: '✎{ }', iconColor: 'var(--amber)', desc: 'Create and sign JWTs with custom claims. Generate tokens for testing and development.', uses: 'Mock OAuth tokens for API testing · create test id_tokens · generate service-to-service auth tokens · prototype custom claims', badgeLabel: 'JWT', badgeClass: 'badge-amber', cats: ['all', 'jwt'] },
  { id: 'token-verifier', name: 'Token Signature Verifier', icon: '✓sig', iconColor: 'var(--em)', desc: 'Verify JWT signatures using public keys or JWKS endpoints.', uses: 'Validate token signatures · test RS256/ES256 verification · debug signature failures · security audits', badgeLabel: 'JWT', badgeClass: 'badge-em', cats: ['all', 'jwt', 'crypto'] },
  // SAML
  { id: 'saml-decoder', name: 'SAML Decoder', icon: '</>', iconColor: 'var(--amber)', desc: 'Decode SAML assertions and responses. Debug enterprise SSO integrations.', uses: 'Troubleshoot SAML SSO failures · inspect IdP assertions · verify attribute mappings · debug SP vs IdP-initiated flows', badgeLabel: 'SAML', badgeClass: 'badge-amber', cats: ['all', 'saml'] },
  { id: 'saml-generator', name: 'SAML Generator', icon: '✎</>', iconColor: 'var(--amber)', desc: 'Generate SAML responses and assertions for testing SP integrations.', uses: 'Test SP SAML integration without IdP · mock SAML responses · prototype attribute statements · simulate SSO login flows', badgeLabel: 'SAML', badgeClass: 'badge-amber', cats: ['all', 'saml'] },
  { id: 'x509', name: 'X.509 Certificate Decoder', icon: 'cert', iconColor: 'var(--blue)', desc: 'Parse and analyze X.509 certificates. Check expiration and certificate details.', uses: 'Debug SAML signing certs · verify mTLS client certs · check certificate expiry · analyze PKI chains', badgeLabel: 'PKI', badgeClass: 'badge-blue', cats: ['all', 'saml', 'crypto'] },
  { id: 'x509-generator', name: 'X.509 Certificate Generator', icon: '✎cert', iconColor: 'var(--blue)', desc: 'Generate self-signed certificates for testing. Create RSA or ECDSA key pairs.', uses: 'SAML signing/encryption testing · mTLS development · local HTTPS setup · JWT RS256/ES256 key generation', badgeLabel: 'PKI', badgeClass: 'badge-blue', cats: ['all', 'saml', 'crypto'] },
  { id: 'claims-mapper', name: 'Claims Mapper', icon: '→attr', iconColor: 'var(--purple)', desc: 'Simulate IdP to SP claims/attribute mapping with various transformations.', uses: 'Test attribute mappings · debug SAML assertions · prototype OIDC claims · configure provisioning rules', badgeLabel: 'SAML', badgeClass: 'badge-purple', cats: ['all', 'saml'] },
  // OAuth / OIDC
  { id: 'pkce', name: 'PKCE Generator', icon: 'PKCE', iconColor: 'var(--em)', desc: 'Generate PKCE code verifier and code challenge for OAuth 2.0 public clients.', uses: 'Secure mobile/SPA OAuth flows · generate code_verifier and code_challenge · test PKCE implementations · OAuth 2.1 compliance', badgeLabel: 'OAuth', badgeClass: 'badge-em', cats: ['all', 'oauth'] },
  { id: 'oauth-url', name: 'OAuth URL Builder', icon: 'URL⚙', iconColor: 'var(--em)', desc: 'Build OAuth 2.0 and OIDC authorization URLs with all parameters.', uses: 'Test OAuth flows · configure authorization requests · debug OIDC integration · prototype OAuth implementations', badgeLabel: 'OAuth', badgeClass: 'badge-em', cats: ['all', 'oauth'] },
  { id: 'oidc-discovery', name: 'OIDC Discovery Viewer', icon: '.well', iconColor: 'var(--em)', desc: 'Fetch and analyze OpenID Connect discovery documents (.well-known/openid-configuration).', uses: 'Explore IdP capabilities · find OAuth endpoints · verify OIDC configuration · compare provider features', badgeLabel: 'OIDC', badgeClass: 'badge-em', cats: ['all', 'oauth'] },
  { id: 'state-nonce-debugger', name: 'OAuth State/Nonce Debugger', icon: 'nonce', iconColor: 'var(--blue)', desc: 'Generate, parse, and validate OAuth state and nonce parameters.', uses: 'Debug state mismatch errors · generate CSRF tokens · validate OAuth callback params · test replay protection', badgeLabel: 'OAuth', badgeClass: 'badge-blue', cats: ['all', 'oauth'] },
  { id: 'introspection-tester', name: 'OAuth Introspection Tester', icon: 'RFC7662', iconColor: 'var(--blue)', desc: 'Generate RFC 7662 Token Introspection requests for opaque tokens.', uses: 'Test introspection endpoints · debug opaque tokens · generate cURL/Python/Node code · validate token status', badgeLabel: 'OAuth', badgeClass: 'badge-blue', cats: ['all', 'oauth'] },
  { id: 'dpop', name: 'DPoP Proof Generator', icon: 'DPoP', iconColor: 'var(--purple)', desc: 'Generate RFC 9449 DPoP proofs for sender-constrained access tokens.', uses: 'Test DPoP-protected APIs · debug sender-constrained tokens · implement OAuth 2.0 DPoP · secure token binding', badgeLabel: 'OAuth', badgeClass: 'badge-purple', cats: ['all', 'oauth'] },
  { id: 'logout-url', name: 'Logout URL Builder', icon: '⏻URL', iconColor: 'var(--red)', desc: 'Build OIDC RP-Initiated Logout URLs with all standard parameters.', uses: 'Configure SSO logout · test end_session_endpoint · debug logout redirect issues · implement federated logout', badgeLabel: 'OIDC', badgeClass: 'badge-red', cats: ['all', 'oauth'] },
  { id: 'session-cookie-analyzer', name: 'Session Cookie Analyzer', icon: 'cookie', iconColor: 'var(--red)', desc: 'Analyze session cookie security attributes and identify vulnerabilities.', uses: 'Audit cookie security · check Secure/HttpOnly/SameSite flags · validate cookie prefixes · security reviews', badgeLabel: 'Session', badgeClass: 'badge-red', cats: ['all', 'oauth'] },
  // Crypto / Keys
  { id: 'jwk', name: 'JWK Generator & Viewer', icon: 'JWK', iconColor: 'var(--em)', desc: 'Generate RSA/EC key pairs in JWK format. Analyze existing JSON Web Keys.', uses: 'Create JWT signing keys · set up JWKS endpoints · analyze IdP public keys · configure OIDC providers', badgeLabel: 'Crypto', badgeClass: 'badge-em', cats: ['all', 'crypto'] },
  { id: 'hmac', name: 'HMAC Generator', icon: 'HMAC', iconColor: 'var(--em)', desc: 'Generate and verify HMAC signatures. Validate webhook signatures and API authentication.', uses: 'Verify GitHub/Stripe/Slack webhook signatures · validate API request authenticity · debug OAuth 1.0 signatures · test SCIM webhooks', badgeLabel: 'Crypto', badgeClass: 'badge-em', cats: ['all', 'crypto'] },
  { id: 'password-hash', name: 'Password Hash Generator', icon: 'hash', iconColor: 'var(--amber)', desc: 'Generate PBKDF2 password hashes. Secure password storage and verification.', uses: 'Generate hashes for user provisioning · verify password migration data · test auth systems · create test user credentials', badgeLabel: 'Crypto', badgeClass: 'badge-amber', cats: ['all', 'crypto'] },
  { id: 'random-string', name: 'Random String Generator', icon: 'rand', iconColor: 'var(--purple)', desc: 'Generate cryptographically secure random strings for secrets and tokens.', uses: 'Create API keys · generate client secrets · produce session IDs · create PKCE verifiers · generate state/nonce values', badgeLabel: 'Crypto', badgeClass: 'badge-purple', cats: ['all', 'crypto'] },
  { id: 'api-key-analyzer', name: 'API Key Analyzer', icon: 'key⚑', iconColor: 'var(--amber)', desc: 'Identify API key types, assess security risks, and get best practices.', uses: 'Detect leaked keys · identify key providers · assess key entropy · security incident response', badgeLabel: 'Crypto', badgeClass: 'badge-amber', cats: ['all', 'crypto'] },
  { id: 'password-policy-tester', name: 'Password Policy Tester', icon: 'pw✓', iconColor: 'var(--amber)', desc: 'Test passwords against configurable security policies with strength estimation.', uses: 'Validate password compliance · test NIST 800-63B policies · estimate crack time · configure password rules', badgeLabel: 'Crypto', badgeClass: 'badge-amber', cats: ['all', 'crypto'] },
  // MFA / Passkeys
  { id: 'otp-generator', name: 'OTP Generator', icon: 'OTP', iconColor: 'var(--em)', desc: 'Generate and verify TOTP/HOTP one-time passwords for MFA testing.', uses: 'Test MFA enrollment · verify OTP implementation · debug authenticator app issues · validate 2FA flows', badgeLabel: 'MFA', badgeClass: 'badge-em', cats: ['all', 'mfa'] },
  { id: 'qr-code', name: 'QR Code Generator', icon: 'QR', iconColor: 'var(--em)', desc: 'Generate QR codes for MFA setup and otpauth:// URIs.', uses: 'Create TOTP enrollment QR codes · test authenticator app scanning · MFA setup testing · device registration', badgeLabel: 'MFA', badgeClass: 'badge-em', cats: ['all', 'mfa'] },
  { id: 'webauthn-debugger', name: 'WebAuthn / Passkey Debugger', icon: 'FIDO2', iconColor: 'var(--blue)', desc: 'Parse and analyze WebAuthn registration and authentication responses.', uses: 'Debug passkey implementations · analyze authenticatorData · parse CBOR public keys · troubleshoot FIDO2 flows', badgeLabel: 'Passkeys', badgeClass: 'badge-blue', cats: ['all', 'mfa'] },
  // Directory
  { id: 'ldap-filter', name: 'LDAP Filter Builder', icon: 'LDAP', iconColor: 'var(--amber)', desc: 'Build and test LDAP/Active Directory filter expressions for directory queries.', uses: 'Query AD users/groups · build memberOf filters · test LDAP search expressions · debug directory sync', badgeLabel: 'Directory', badgeClass: 'badge-amber', cats: ['all', 'directory'] },
  { id: 'scim-filter', name: 'SCIM Filter Builder', icon: 'SCIM', iconColor: 'var(--purple)', desc: 'Build and test SCIM 2.0 filter expressions for user provisioning queries.', uses: 'Query users by attribute · filter provisioning sync · test SCIM search expressions · debug user lookup issues', badgeLabel: 'SCIM', badgeClass: 'badge-purple', cats: ['all', 'directory'] },
  { id: 'policy-evaluator', name: 'Policy Evaluator (RBAC/ABAC)', icon: 'RBAC', iconColor: 'var(--em)', desc: 'Simulate RBAC and ABAC access control policy evaluation.', uses: 'Test authorization policies · debug access decisions · prototype zero trust rules · validate role assignments', badgeLabel: 'Policy', badgeClass: 'badge-em', cats: ['all', 'directory'] },
  { id: 'uuid', name: 'UUID Generator', icon: 'UUID', iconColor: 'var(--text2)', desc: 'Generate and decode UUIDs (v4, v7). Create unique identifiers for users and sessions.', uses: 'Generate user IDs · create session identifiers · produce client_id for OAuth apps · assign unique tenant IDs', badgeLabel: 'Utils', badgeClass: '', cats: ['all', 'directory'] },
  // Utilities
  { id: 'timestamp', name: 'Timestamp Converter', icon: 'unix', iconColor: 'var(--blue)', desc: 'Convert between Unix timestamps and human-readable dates. Essential for token expiry analysis.', uses: 'Analyze JWT exp/iat/nbf claims · debug OAuth token lifetimes · investigate session timeout issues · verify SAML validity periods', badgeLabel: 'Utils', badgeClass: 'badge-blue', cats: ['all', 'util'] },
  { id: 'base64', name: 'Base64 Encoder / Decoder', icon: 'b64', iconColor: 'var(--blue)', desc: 'Encode and decode Base64, URL-safe Base64. Essential for SAML and OIDC debugging.', uses: 'Decode SAML assertions · debug OAuth state parameters · analyze Basic Auth headers · inspect URL-encoded JWT segments', badgeLabel: 'Utils', badgeClass: 'badge-blue', cats: ['all', 'util'] },
  { id: 'url-encoder', name: 'URL Encoder / Decoder', icon: '%enc', iconColor: 'var(--blue)', desc: 'Encode and decode URL strings. Handle query parameters and special characters.', uses: 'Encode OAuth redirect_uri · decode SAML RelayState · debug query string issues · fix URL encoding problems', badgeLabel: 'Utils', badgeClass: 'badge-blue', cats: ['all', 'util'] },
  { id: 'json-formatter', name: 'JSON Formatter', icon: '{ }✓', iconColor: 'var(--amber)', desc: 'Format, validate, and minify JSON. Analyze JSON structure and statistics.', uses: 'Format API responses · validate SCIM payloads · debug JWT claims · pretty-print OIDC discovery documents', badgeLabel: 'Utils', badgeClass: 'badge-amber', cats: ['all', 'util'] },
  { id: 'regex-tester', name: 'Regex Tester', icon: '/.*/i', iconColor: 'var(--purple)', desc: 'Test and validate regular expressions with real-time matching and highlighting.', uses: 'Validate username patterns · test email regex · debug password policies · create input validation rules', badgeLabel: 'Utils', badgeClass: 'badge-purple', cats: ['all', 'util'] },
]

const SECTIONS: { id: ToolCat; label: string }[] = [
  { id: 'jwt', label: 'JWT — JSON Web Tokens' },
  { id: 'saml', label: 'SAML 2.0' },
  { id: 'oauth', label: 'OAuth 2.0 / OIDC' },
  { id: 'crypto', label: 'Crypto & Keys' },
  { id: 'mfa', label: 'MFA & Passkeys' },
  { id: 'directory', label: 'Directory & Provisioning' },
  { id: 'util', label: 'Utilities & Encoding' },
]

const TABS: { id: ToolCat; label: string }[] = [
  { id: 'all', label: 'ALL (34)' },
  { id: 'jwt', label: 'JWT' },
  { id: 'saml', label: 'SAML' },
  { id: 'oauth', label: 'OAuth / OIDC' },
  { id: 'crypto', label: 'Crypto / Keys' },
  { id: 'mfa', label: 'MFA / Passkeys' },
  { id: 'directory', label: 'Directory' },
  { id: 'util', label: 'Utilities' },
]

export default function ToolsPage() {
  const [activeCat, setActiveCat] = useState<ToolCat>('all')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return TOOLS.filter(t => {
      const catMatch = t.cats.includes(activeCat)
      const searchMatch = !q || t.name.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q) || t.uses.toLowerCase().includes(q)
      return catMatch && searchMatch
    })
  }, [activeCat, search])

  function isSectionVisible(sectionId: ToolCat) {
    return filtered.some(t => t.cats.includes(sectionId))
  }

  return (
    <>
      <div className="page-header">
        <div className="ph-row">
          <div>
            <div className="ph-title">TOOLS</div>
            <div className="ph-sub">// 34 free IAM utilities — 100% client-side, no data leaves your browser</div>
          </div>
          <div className="ph-actions">
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, border: '1px solid var(--border)', background: 'var(--panel)', padding: '5px 12px', fontFamily: 'var(--mono)', fontSize: 11, clipPath: 'polygon(0 0,calc(100% - 6px) 0,100% 6px,100% 100%,0 100%)' }}>
              <span style={{ color: 'var(--text3)' }}>$&gt;</span>
              <input
                type="text"
                placeholder="filter tools..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ background: 'none', border: 'none', outline: 'none', fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text)', width: 160 }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="inner-page">
        {/* Category filter tabs */}
        <div className="tab-bar" style={{ marginBottom: 20, flexWrap: 'wrap' }}>
          {TABS.map(tab => (
            <div
              key={tab.id}
              className={`tab${activeCat === tab.id ? ' active' : ''}`}
              onClick={() => setActiveCat(tab.id)}
            >
              {tab.label}
            </div>
          ))}
        </div>

        {/* Stats row */}
        <div className="tools-stats-grid">
          <div className="stat-cell"><div className="stat-val">34</div><div className="stat-key">total tools</div></div>
          <div className="stat-cell"><div className="stat-val em">100%</div><div className="stat-key">client-side</div></div>
          <div className="stat-cell"><div className="stat-val blue">0</div><div className="stat-key">data transmitted</div></div>
          <div className="stat-cell"><div className="stat-val amb">free</div><div className="stat-key">forever</div></div>
        </div>

        {/* Sections */}
        {SECTIONS.map(section => {
          if (!isSectionVisible(section.id)) return null
          const sectionTools = filtered.filter(t => t.cats.includes(section.id))
          return (
            <div key={section.id}>
              <div className="sec-divider">{section.label}</div>
              <div className="tools-section-grid">
                {sectionTools.map(tool => (
                  <div key={tool.id} className="tool-card">
                    <div className="tool-card-inner">
                      <div className="tool-icon" style={{ color: tool.iconColor }}>{tool.icon}</div>
                      <div className="tool-name">{tool.name}</div>
                      <div className="tool-desc">{tool.desc}</div>
                      <div className="tool-uses">{tool.uses}</div>
                    </div>
                    <div className="tool-foot">
                      <span className={`badge ${tool.badgeClass}`} style={{ fontSize: 9 }}>{tool.badgeLabel}</span>
                      <Link className="tool-open-btn" href={`/tools/${tool.id}`}>
                        OPEN TOOL →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}

        {/* Footer */}
        <div style={{ padding: '14px 18px', border: '1px solid var(--border)', background: 'var(--panel)', fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text3)', display: 'flex', alignItems: 'center', gap: 10, clipPath: 'polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,0 100%)' }}>
          <span style={{ color: 'var(--em)' }}>// IAM_TOOL_RUNNER</span>
          All tools run entirely in your browser — no data is transmitted.
          <span style={{ marginLeft: 'auto', color: 'var(--text4)' }}>34 tools · ● CLIENT-SIDE</span>
        </div>
      </div>

    </>
  )
}
