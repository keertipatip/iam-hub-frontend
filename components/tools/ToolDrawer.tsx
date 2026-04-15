'use client'

import { useEffect, lazy, Suspense } from 'react'

// Lazy-load each tool component
const TOOL_COMPONENTS: Record<string, React.LazyExoticComponent<() => React.ReactElement>> = {
  'jwt-decoder':             lazy(() => import('./impl/JwtDecoder')),
  'jwt-generator':           lazy(() => import('./impl/JwtGenerator')),
  'base64':                  lazy(() => import('./impl/Base64Tool')),
  'url-encoder':             lazy(() => import('./impl/UrlEncoder')),
  'timestamp':               lazy(() => import('./impl/TimestampConverter')),
  'pkce':                    lazy(() => import('./impl/PkceGenerator')),
  'uuid':                    lazy(() => import('./impl/UuidGenerator')),
  'random-string':           lazy(() => import('./impl/RandomStringGenerator')),
  'json-formatter':          lazy(() => import('./impl/JsonFormatter')),
  'regex-tester':            lazy(() => import('./impl/RegexTester')),
  'hmac':                    lazy(() => import('./impl/HmacGenerator')),
  'oauth-url':               lazy(() => import('./impl/OAuthUrlBuilder')),
  'logout-url':              lazy(() => import('./impl/LogoutUrlBuilder')),
  'claims-mapper':           lazy(() => import('./impl/ClaimsMapper')),
  'state-nonce-debugger':    lazy(() => import('./impl/StateNonceDebugger')),
  'session-cookie-analyzer': lazy(() => import('./impl/SessionCookieAnalyzer')),
  'saml-decoder':            lazy(() => import('./impl/SamlDecoder')),
  'scim-filter':             lazy(() => import('./impl/ScimFilterBuilder')),
  'token-verifier':          lazy(() => import('./impl/TokenVerifier')),
  'password-hash':           lazy(() => import('./impl/PasswordHashGenerator')),
  'api-key-analyzer':        lazy(() => import('./impl/ApiKeyAnalyzer')),
  'introspection-tester':    lazy(() => import('./impl/IntrospectionTester')),
  'dpop':                    lazy(() => import('./impl/DpopProofGenerator')),
  'saml-generator':          lazy(() => import('./impl/SamlGenerator')),
  'oidc-discovery':          lazy(() => import('./impl/OidcDiscoveryViewer')),
  'password-policy-tester':  lazy(() => import('./impl/PasswordPolicyTester')),
  'jwk':                     lazy(() => import('./impl/JwkGenerator')),
  'x509':                    lazy(() => import('./impl/X509Decoder')),
  'x509-generator':          lazy(() => import('./impl/X509Generator')),
  'otp-generator':           lazy(() => import('./impl/OtpGenerator')),
  'qr-code':                 lazy(() => import('./impl/QrCodeGenerator')),
  'webauthn-debugger':       lazy(() => import('./impl/WebAuthnDebugger')),
  'ldap-filter':             lazy(() => import('./impl/LdapFilterBuilder')),
  'policy-evaluator':        lazy(() => import('./impl/PolicyEvaluator')),
}

const TOOL_TITLES: Record<string, string> = {
  'jwt-decoder':             'JWT Decoder',
  'jwt-generator':           'JWT Generator',
  'base64':                  'Base64 Encoder / Decoder',
  'url-encoder':             'URL Encoder / Decoder',
  'timestamp':               'Timestamp Converter',
  'pkce':                    'PKCE Generator',
  'uuid':                    'UUID Generator',
  'random-string':           'Random String Generator',
  'json-formatter':          'JSON Formatter',
  'regex-tester':            'Regex Tester',
  'hmac':                    'HMAC Generator',
  'oauth-url':               'OAuth URL Builder',
  'logout-url':              'Logout URL Builder',
  'claims-mapper':           'Claims Mapper',
  'state-nonce-debugger':    'OAuth State / Nonce Debugger',
  'session-cookie-analyzer': 'Session Cookie Analyzer',
  'saml-decoder':            'SAML Decoder',
  'scim-filter':             'SCIM Filter Builder',
  'token-verifier':          'Token Signature Verifier',
  'password-hash':           'Password Hash Generator',
  'api-key-analyzer':        'API Key Analyzer',
  'introspection-tester':    'OAuth Introspection Tester',
  'dpop':                    'DPoP Proof Generator',
  'saml-generator':          'SAML Generator',
  'oidc-discovery':          'OIDC Discovery Viewer',
  'password-policy-tester':  'Password Policy Tester',
  'jwk':                     'JWK Generator & Viewer',
  'x509':                    'X.509 Certificate Decoder',
  'x509-generator':          'X.509 Certificate Generator',
  'otp-generator':           'OTP Generator',
  'qr-code':                 'QR Code Generator',
  'webauthn-debugger':       'WebAuthn / Passkey Debugger',
  'ldap-filter':             'LDAP Filter Builder',
  'policy-evaluator':        'Policy Evaluator (RBAC/ABAC)',
}

interface ToolDrawerProps {
  toolId: string | null
  onClose: () => void
}

export function ToolDrawer({ toolId, onClose }: ToolDrawerProps) {
  useEffect(() => {
    if (!toolId) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [toolId, onClose])

  if (!toolId) return null

  const ToolComponent = TOOL_COMPONENTS[toolId]
  const title = TOOL_TITLES[toolId] || toolId.replace(/-/g, ' ').toUpperCase()

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
          zIndex: 300, backdropFilter: 'blur(3px)',
        }}
      />

      {/* Sliding panel */}
      <div style={{
        position: 'fixed', top: 0, right: 0, width: 820, maxWidth: '96vw',
        height: '100vh', background: 'var(--base)', borderLeft: '1px solid var(--border)',
        zIndex: 301, display: 'flex', flexDirection: 'column', overflow: 'hidden',
        animation: 'slideInRight 0.22s ease',
      }}>
        {/* Toolbar */}
        <div style={{
          height: 50, background: 'var(--panel)', borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', padding: '0 16px', gap: 10, flexShrink: 0,
        }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: 2, color: 'var(--text4)' }}>
            // IAM_TOOL_RUNNER
          </div>
          <div className="pg-dot" />
          <span style={{
            fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: 1, color: 'var(--em)',
            border: '1px solid rgba(0,255,136,0.3)', padding: '2px 7px',
          }}>● CLIENT-SIDE</span>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text)', marginLeft: 4 }}>
            {title}
          </span>
          <div style={{ marginLeft: 'auto' }}>
            <button
              onClick={onClose}
              style={{
                background: 'none', border: '1px solid var(--border)', color: 'var(--text3)',
                fontFamily: 'var(--mono)', fontSize: 10, padding: '5px 12px', cursor: 'pointer',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { (e.target as HTMLElement).style.color = 'var(--em)'; (e.target as HTMLElement).style.borderColor = 'var(--em-dim)' }}
              onMouseLeave={e => { (e.target as HTMLElement).style.color = 'var(--text3)'; (e.target as HTMLElement).style.borderColor = 'var(--border)' }}
            >
              ✕ CLOSE
            </button>
          </div>
        </div>

        {/* Tool body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 24, background: 'var(--void)' }}>
          {ToolComponent ? (
            <Suspense fallback={
              <div style={{ fontFamily: 'var(--mono)', color: 'var(--text3)', fontSize: 11 }}>
                // Loading tool...
              </div>
            }>
              <ToolComponent />
            </Suspense>
          ) : (
            <div style={{ fontFamily: 'var(--mono)', color: 'var(--amber)', padding: 20 }}>
              // Tool <strong style={{ color: 'var(--em)' }}>{toolId}</strong> — not yet implemented.
            </div>
          )}
        </div>
      </div>
    </>
  )
}
