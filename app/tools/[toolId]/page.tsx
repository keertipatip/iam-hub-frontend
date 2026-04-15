'use client'

import { use, lazy, Suspense } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

const TOOL_COMPONENTS: Record<string, React.LazyExoticComponent<() => React.ReactElement>> = {
  'jwt-decoder':             lazy(() => import('@/components/tools/impl/JwtDecoder')),
  'jwt-generator':           lazy(() => import('@/components/tools/impl/JwtGenerator')),
  'base64':                  lazy(() => import('@/components/tools/impl/Base64Tool')),
  'url-encoder':             lazy(() => import('@/components/tools/impl/UrlEncoder')),
  'timestamp':               lazy(() => import('@/components/tools/impl/TimestampConverter')),
  'pkce':                    lazy(() => import('@/components/tools/impl/PkceGenerator')),
  'uuid':                    lazy(() => import('@/components/tools/impl/UuidGenerator')),
  'random-string':           lazy(() => import('@/components/tools/impl/RandomStringGenerator')),
  'json-formatter':          lazy(() => import('@/components/tools/impl/JsonFormatter')),
  'regex-tester':            lazy(() => import('@/components/tools/impl/RegexTester')),
  'hmac':                    lazy(() => import('@/components/tools/impl/HmacGenerator')),
  'oauth-url':               lazy(() => import('@/components/tools/impl/OAuthUrlBuilder')),
  'logout-url':              lazy(() => import('@/components/tools/impl/LogoutUrlBuilder')),
  'claims-mapper':           lazy(() => import('@/components/tools/impl/ClaimsMapper')),
  'state-nonce-debugger':    lazy(() => import('@/components/tools/impl/StateNonceDebugger')),
  'session-cookie-analyzer': lazy(() => import('@/components/tools/impl/SessionCookieAnalyzer')),
  'saml-decoder':            lazy(() => import('@/components/tools/impl/SamlDecoder')),
  'scim-filter':             lazy(() => import('@/components/tools/impl/ScimFilterBuilder')),
  'token-verifier':          lazy(() => import('@/components/tools/impl/TokenVerifier')),
  'password-hash':           lazy(() => import('@/components/tools/impl/PasswordHashGenerator')),
  'api-key-analyzer':        lazy(() => import('@/components/tools/impl/ApiKeyAnalyzer')),
  'introspection-tester':    lazy(() => import('@/components/tools/impl/IntrospectionTester')),
  'dpop':                    lazy(() => import('@/components/tools/impl/DpopProofGenerator')),
  'saml-generator':          lazy(() => import('@/components/tools/impl/SamlGenerator')),
  'oidc-discovery':          lazy(() => import('@/components/tools/impl/OidcDiscoveryViewer')),
  'password-policy-tester':  lazy(() => import('@/components/tools/impl/PasswordPolicyTester')),
  'jwk':                     lazy(() => import('@/components/tools/impl/JwkGenerator')),
  'x509':                    lazy(() => import('@/components/tools/impl/X509Decoder')),
  'x509-generator':          lazy(() => import('@/components/tools/impl/X509Generator')),
  'otp-generator':           lazy(() => import('@/components/tools/impl/OtpGenerator')),
  'qr-code':                 lazy(() => import('@/components/tools/impl/QrCodeGenerator')),
  'webauthn-debugger':       lazy(() => import('@/components/tools/impl/WebAuthnDebugger')),
  'ldap-filter':             lazy(() => import('@/components/tools/impl/LdapFilterBuilder')),
  'policy-evaluator':        lazy(() => import('@/components/tools/impl/PolicyEvaluator')),
}

interface ToolMeta { id: string; label: string; icon: string; cat: string }

const TOOL_NAV: { section: string; icon: string; tools: ToolMeta[] }[] = [
  {
    section: 'JWT',
    icon: '{ }',
    tools: [
      { id: 'jwt-decoder',   label: 'JWT Decoder',             icon: '{ }',   cat: 'JWT' },
      { id: 'jwt-generator', label: 'JWT Generator',           icon: '✎{ }',  cat: 'JWT' },
      { id: 'token-verifier',label: 'Token Sig. Verifier',     icon: '✓sig',  cat: 'JWT' },
    ],
  },
  {
    section: 'SAML',
    icon: '</>',
    tools: [
      { id: 'saml-decoder',   label: 'SAML Decoder',           icon: '</>',   cat: 'SAML' },
      { id: 'saml-generator', label: 'SAML Generator',         icon: '✎</>',  cat: 'SAML' },
      { id: 'x509',           label: 'X.509 Decoder',          icon: 'cert',  cat: 'SAML' },
      { id: 'x509-generator', label: 'X.509 Generator',        icon: '✎cert', cat: 'SAML' },
      { id: 'claims-mapper',  label: 'Claims Mapper',          icon: '→attr', cat: 'SAML' },
    ],
  },
  {
    section: 'OAuth / OIDC',
    icon: 'OAuth',
    tools: [
      { id: 'pkce',                    label: 'PKCE Generator',        icon: 'PKCE',    cat: 'OAuth' },
      { id: 'oauth-url',               label: 'OAuth URL Builder',     icon: 'URL⚙',    cat: 'OAuth' },
      { id: 'oidc-discovery',          label: 'OIDC Discovery',        icon: '.well',   cat: 'OAuth' },
      { id: 'state-nonce-debugger',    label: 'State/Nonce Debugger',  icon: 'nonce',   cat: 'OAuth' },
      { id: 'introspection-tester',    label: 'Introspection Tester',  icon: 'RFC7662', cat: 'OAuth' },
      { id: 'dpop',                    label: 'DPoP Proof Generator',  icon: 'DPoP',    cat: 'OAuth' },
      { id: 'logout-url',              label: 'Logout URL Builder',    icon: '⏻URL',    cat: 'OAuth' },
      { id: 'session-cookie-analyzer', label: 'Cookie Analyzer',       icon: 'cookie',  cat: 'OAuth' },
    ],
  },
  {
    section: 'Crypto & Keys',
    icon: 'key',
    tools: [
      { id: 'jwk',                  label: 'JWK Generator',          icon: 'JWK',  cat: 'Crypto' },
      { id: 'hmac',                 label: 'HMAC Generator',         icon: 'HMAC', cat: 'Crypto' },
      { id: 'password-hash',        label: 'Password Hash',          icon: 'hash', cat: 'Crypto' },
      { id: 'random-string',        label: 'Random String Gen.',     icon: 'rand', cat: 'Crypto' },
      { id: 'api-key-analyzer',     label: 'API Key Analyzer',       icon: 'key⚑', cat: 'Crypto' },
      { id: 'password-policy-tester', label: 'Password Policy',      icon: 'pw✓', cat: 'Crypto' },
    ],
  },
  {
    section: 'MFA & Passkeys',
    icon: 'OTP',
    tools: [
      { id: 'otp-generator',    label: 'OTP Generator',         icon: 'OTP',   cat: 'MFA' },
      { id: 'qr-code',          label: 'QR Code Generator',     icon: 'QR',    cat: 'MFA' },
      { id: 'webauthn-debugger',label: 'WebAuthn Debugger',     icon: 'FIDO2', cat: 'MFA' },
    ],
  },
  {
    section: 'Directory',
    icon: 'DIR',
    tools: [
      { id: 'ldap-filter',     label: 'LDAP Filter Builder',    icon: 'LDAP', cat: 'Dir' },
      { id: 'scim-filter',     label: 'SCIM Filter Builder',    icon: 'SCIM', cat: 'Dir' },
      { id: 'policy-evaluator',label: 'Policy Evaluator',       icon: 'RBAC', cat: 'Dir' },
      { id: 'uuid',            label: 'UUID Generator',         icon: 'UUID', cat: 'Dir' },
    ],
  },
  {
    section: 'Utilities',
    icon: 'util',
    tools: [
      { id: 'timestamp',      label: 'Timestamp Converter',    icon: 'unix',   cat: 'Utils' },
      { id: 'base64',         label: 'Base64 Enc/Dec',         icon: 'b64',    cat: 'Utils' },
      { id: 'url-encoder',    label: 'URL Encoder/Decoder',    icon: '%enc',   cat: 'Utils' },
      { id: 'json-formatter', label: 'JSON Formatter',         icon: '{ }✓',   cat: 'Utils' },
      { id: 'regex-tester',   label: 'Regex Tester',           icon: '/.*/i',  cat: 'Utils' },
    ],
  },
]

const TOOL_TITLES: Record<string, string> = Object.fromEntries(
  TOOL_NAV.flatMap(g => g.tools.map(t => [t.id, t.label]))
)

// Full title override for a few abbreviated sidebar labels
const TOOL_FULL_TITLES: Record<string, string> = {
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

interface Props {
  params: Promise<{ toolId: string }>
}

export default function ToolPage({ params }: Props) {
  const { toolId } = use(params)

  const ToolComponent = TOOL_COMPONENTS[toolId]
  const title = TOOL_FULL_TITLES[toolId] || TOOL_TITLES[toolId]

  if (!ToolComponent || !title) notFound()

  return (
    <>
      {/* Page header */}
      <div className="page-header">
        <div className="ph-row">
          <div>
            <div className="ph-title" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Link
                href="/tools"
                style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text3)', textDecoration: 'none', letterSpacing: 1 }}
              >
                ← TOOLS
              </Link>
              <span style={{ color: 'var(--border)' }}>/</span>
              {title.toUpperCase()}
            </div>
            <div className="ph-sub">// IAM_TOOL_RUNNER · ● CLIENT-SIDE · no data leaves your browser</div>
          </div>
        </div>
      </div>

      {/* Two-column layout: tool content + right nav */}
      <div className="inner-page tool-inner-page" style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>

        {/* ── Main tool panel ── */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            background: 'var(--panel)',
            border: '1px solid var(--border)',
            clipPath: 'polygon(0 0,calc(100% - 12px) 0,100% 12px,100% 100%,0 100%)',
          }}>
            {/* Toolbar */}
            <div style={{
              height: 46, background: 'var(--base)', borderBottom: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', padding: '0 16px', gap: 10,
            }}>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: 2, color: 'var(--text4)' }}>
                // IAM_TOOL_RUNNER
              </span>
              <div className="pg-dot" />
              <span style={{
                fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: 1, color: 'var(--em)',
                border: '1px solid rgba(0,255,136,0.3)', padding: '2px 7px',
              }}>
                ● CLIENT-SIDE
              </span>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text)', marginLeft: 4 }}>
                {title}
              </span>
            </div>

            {/* Tool content */}
            <div style={{ padding: 24 }}>
              <Suspense fallback={
                <div style={{ fontFamily: 'var(--mono)', color: 'var(--text3)', fontSize: 11, padding: '20px 0' }}>
                  // Loading tool...
                </div>
              }>
                <ToolComponent />
              </Suspense>
            </div>
          </div>
        </div>

        {/* ── Right sidebar: tool navigator ── */}
        <div className="tool-runner-nav" style={{
          width: 220,
          flexShrink: 0,
          position: 'sticky',
          top: 0,
          maxHeight: 'calc(100vh - 120px)',
          overflowY: 'auto',
          background: 'var(--panel)',
          border: '1px solid var(--border)',
          clipPath: 'polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,0 100%)',
        }}>
          {/* Sidebar header */}
          <div style={{
            padding: '10px 14px', borderBottom: '1px solid var(--border)',
            fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: 2, color: 'var(--text4)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <span>// TOOLS</span>
            <Link href="/tools" style={{
              color: 'var(--text3)', textDecoration: 'none', fontSize: 9,
              letterSpacing: 1, transition: 'color .15s',
            }}>
              ALL →
            </Link>
          </div>

          {/* Grouped tool list */}
          {TOOL_NAV.map(group => (
            <div key={group.section}>
              {/* Section label */}
              <div style={{
                padding: '8px 14px 4px',
                fontFamily: 'var(--mono)', fontSize: 8, letterSpacing: 2,
                color: 'var(--text4)', textTransform: 'uppercase',
                borderTop: '1px solid var(--border)',
              }}>
                {group.section}
              </div>

              {/* Tool links */}
              {group.tools.map(tool => {
                const isActive = tool.id === toolId
                return (
                  <Link
                    key={tool.id}
                    href={`/tools/${tool.id}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '5px 14px',
                      textDecoration: 'none',
                      background: isActive ? 'rgba(0,255,136,0.06)' : 'transparent',
                      borderLeft: isActive ? '2px solid var(--em)' : '2px solid transparent',
                      transition: 'background .12s',
                    }}
                  >
                    <span style={{
                      fontFamily: 'var(--mono)', fontSize: 8, color: isActive ? 'var(--em)' : 'var(--text4)',
                      minWidth: 28, textAlign: 'right', flexShrink: 0,
                    }}>
                      {tool.icon}
                    </span>
                    <span style={{
                      fontFamily: 'var(--mono)', fontSize: 10,
                      color: isActive ? 'var(--em)' : 'var(--text2)',
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    }}>
                      {tool.label}
                    </span>
                  </Link>
                )
              })}
            </div>
          ))}

          {/* Footer badge */}
          <div style={{
            padding: '10px 14px', borderTop: '1px solid var(--border)',
            fontFamily: 'var(--mono)', fontSize: 8, color: 'var(--text4)',
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <span style={{ color: 'var(--em)' }}>●</span> 34 tools · CLIENT-SIDE
          </div>
        </div>

      </div>
    </>
  )
}
