'use client'

import { useState } from 'react'

interface LangCard {
  id: string
  icon: string
  iconColor: string
  name: string
  desc: string
  tags: string[]
  badge: string
  badgeCls: string
  ext: string
  cat: string
  by: string
  byColor: string
}

const LANGS: LangCard[] = [
  { id: 'cedar', icon: '🌲', iconColor: 'var(--em)', name: 'Cedar', desc: "Amazon's policy language for fine-grained authorization. Used in AWS Verified Permissions.", tags: ['#IAM', '#AWS', '#ABAC'], badge: 'POLICY', badgeCls: 'badge-em', ext: '.cedar', cat: 'policy', by: 'AWS · Amazon', byColor: 'var(--em)' },
  { id: 'rego', icon: '⬡', iconColor: 'var(--blue)', name: 'Rego / OPA', desc: "Open Policy Agent's declarative language for policy-as-code across cloud-native stacks.", tags: ['#OPA', '#Kubernetes', '#RBAC'], badge: 'POLICY', badgeCls: 'badge-blue', ext: '.rego', cat: 'policy', by: 'Open Policy Agent', byColor: 'var(--em)' },
  { id: 'xacml', icon: '⊡', iconColor: 'var(--amber)', name: 'XACML', desc: 'eXtensible Access Control Markup Language. OASIS standard for attribute-based access control.', tags: ['#ABAC', '#OASIS', '#enterprise'], badge: 'POLICY', badgeCls: 'badge-amber', ext: '.xml', cat: 'policy', by: 'OASIS Standard', byColor: 'var(--em)' },
  { id: 'casbin', icon: '◎', iconColor: 'var(--purple)', name: 'Casbin DSL', desc: 'Multi-model authorization library supporting ACL, RBAC, ABAC with a simple conf+policy format.', tags: ['#RBAC', '#ACL', '#multi-model'], badge: 'POLICY', badgeCls: 'badge-purple', ext: '.conf + .csv', cat: 'policy', by: 'casbin.org', byColor: 'var(--em)' },
  { id: 'json', icon: '{ }', iconColor: 'var(--amber)', name: 'JSON', desc: 'JavaScript Object Notation. Used for JWT payloads, SCIM resources, OIDC discovery docs, and API configs.', tags: ['#JWT', '#SCIM', '#config'], badge: 'DATA', badgeCls: 'badge-amber', ext: '.json', cat: 'data', by: 'ECMA · RFC 8259', byColor: 'var(--em)' },
  { id: 'yaml', icon: '≡', iconColor: 'var(--blue)', name: 'YAML', desc: 'Human-readable data serialisation. Kubernetes RBAC manifests, Helm chart values, CI/CD pipeline configs.', tags: ['#Kubernetes', '#RBAC', '#DevOps'], badge: 'DATA', badgeCls: 'badge-blue', ext: '.yaml / .yml', cat: 'data', by: 'yaml.org', byColor: 'var(--em)' },
  { id: 'xml', icon: '</>', iconColor: 'var(--red)', name: 'XML', desc: 'SAML 2.0 assertions, WS-Federation tokens, XACML policies, and SOAP security headers all live here.', tags: ['#SAML', '#WS-Fed', '#SOAP'], badge: 'DATA', badgeCls: 'badge-red', ext: '.xml', cat: 'data', by: 'W3C Standard', byColor: 'var(--em)' },
  { id: 'toml', icon: '⊕', iconColor: 'var(--text2)', name: 'TOML', desc: "Tom's Obvious Minimal Language. Auth server config files, client credential stores, and IdP settings.", tags: ['#config', '#IdP'], badge: 'DATA', badgeCls: '', ext: '.toml', cat: 'data', by: 'toml.io', byColor: 'var(--em)' },
  { id: 'javascript', icon: 'JS', iconColor: 'var(--amber)', name: 'JavaScript', desc: 'Write PKCE helpers, JWT decode utilities, JWKS fetch wrappers, and OAuth 2.0 client logic in-browser.', tags: ['#PKCE', '#JWT', '#OAuth'], badge: 'SCRIPT', badgeCls: 'badge-amber', ext: '.js', cat: 'script', by: 'ECMA · TC39', byColor: 'var(--em)' },
  { id: 'typescript', icon: 'TS', iconColor: 'var(--blue)', name: 'TypeScript', desc: 'Typed superset of JS. Build strongly-typed auth SDKs, token validators, and policy enforcement clients.', tags: ['#typed', '#SDK', '#auth'], badge: 'SCRIPT', badgeCls: 'badge-blue', ext: '.ts', cat: 'script', by: 'Microsoft', byColor: 'var(--em)' },
  { id: 'python', icon: 'Py', iconColor: 'var(--em)', name: 'Python', desc: 'Script token introspection, LDAP queries, SCIM provisioning flows, and AWS IAM policy generation.', tags: ['#SCIM', '#LDAP', '#AWS-IAM'], badge: 'SCRIPT', badgeCls: 'badge-em', ext: '.py', cat: 'script', by: 'Python · PSF', byColor: 'var(--em)' },
  { id: 'bash', icon: '$_', iconColor: 'var(--text2)', name: 'Bash / Shell', desc: 'curl-based OAuth flows, token inspection one-liners, cert rotation scripts, and IdP health-check automation.', tags: ['#curl', '#automation', '#ops'], badge: 'SCRIPT', badgeCls: '', ext: '.sh', cat: 'script', by: 'GNU · POSIX', byColor: 'var(--em)' },
  { id: 'sql', icon: 'SQL', iconColor: 'var(--blue)', name: 'SQL', desc: 'Query user stores, audit logs, permission tables, and session records. Postgres, MySQL, or SQLite syntax.', tags: ['#audit', '#permissions', '#users'], badge: 'QUERY', badgeCls: 'badge-blue', ext: '.sql', cat: 'query', by: 'ISO SQL Standard', byColor: 'var(--em)' },
  { id: 'graphql', icon: 'GQL', iconColor: 'var(--purple)', name: 'GraphQL', desc: 'Query IAM data APIs, introspect permission graphs, and test field-level authorization with typed schemas.', tags: ['#API', '#schema', '#auth-z'], badge: 'QUERY', badgeCls: 'badge-purple', ext: '.graphql', cat: 'query', by: 'GraphQL Foundation', byColor: 'var(--em)' },
  { id: 'ldap', icon: 'LDAP', iconColor: 'var(--amber)', name: 'LDAP Filter', desc: 'Write and test LDAP search filters for Active Directory / OpenLDAP — user lookups, group memberships, attribute queries.', tags: ['#ActiveDirectory', '#groups'], badge: 'QUERY', badgeCls: 'badge-amber', ext: 'ldap filter', cat: 'query', by: 'RFC 4515 · IETF', byColor: 'var(--em)' },
  { id: 'jmespath', icon: 'JME', iconColor: 'var(--em)', name: 'JMESPath', desc: 'Query and transform JSON — extract claims from JWT payloads, filter AWS IAM policy documents, parse SCIM responses.', tags: ['#JWT', '#AWS', '#claims'], badge: 'QUERY', badgeCls: 'badge-em', ext: 'jmespath expr', cat: 'query', by: 'JMESPath Spec', byColor: 'var(--em)' },
]

const SECTIONS = [
  { id: 'policy', label: 'POLICY LANGUAGES', cat: 'policy' },
  { id: 'data', label: 'DATA FORMATS', cat: 'data' },
  { id: 'script', label: 'SCRIPTING', cat: 'script' },
  { id: 'query', label: 'QUERY LANGUAGES', cat: 'query' },
]

interface Props {
  onLaunch: (id: string) => void
}

export function LangPicker({ onLaunch }: Props) {
  const [catFilter, setCatFilter] = useState('all')

  return (
    <>
      <div className="pg-toolbar">
        <div className="pg-toolbar-title"><div className="pg-dot"></div>CODE_PLAYGROUND // SELECT ENVIRONMENT TO LAUNCH</div>
        <div className="pg-sep"></div>
        <div style={{ display: 'flex', gap: 2 }}>
          {['all', 'policy', 'data', 'script', 'query'].map(c => (
            <button
              key={c}
              className={`c-tool${catFilter === c ? ' active' : ''}`}
              onClick={() => setCatFilter(c)}
            >
              {c.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '32px 36px', background: 'var(--base)' }}>
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontFamily: 'var(--display)', fontSize: 36, letterSpacing: 3, color: 'var(--text)', lineHeight: 1 }}>CODE PLAYGROUND</div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--text3)', marginTop: 6 }}>
            Choose a language environment and click <span style={{ color: 'var(--em)' }}>▷ LAUNCH</span> on any card to open the editor.
          </div>
        </div>

        {SECTIONS.map(sec => {
          const cards = LANGS.filter(l => (catFilter === 'all' || l.cat === catFilter) && l.cat === sec.cat)
          if (cards.length === 0) return null
          return (
            <div key={sec.id}>
              <div className={`sec-divider pg-cat-all pg-cat-${sec.cat}`}>{sec.label}</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 32 }}>
                {cards.map(l => (
                  <div
                    key={l.id}
                    className={`pg-lang-card pg-cat-all pg-cat-${l.cat}`}
                    data-lang={l.id}
                  >
                    <div className="pg-lang-inner">
                      <div className="pg-lang-icon" style={{ color: l.iconColor }}>{l.icon}</div>
                      <div className="pg-lang-name">{l.name}</div>
                      <div className="pg-lang-desc">{l.desc}</div>
                      <div className="pg-lang-tags">{l.tags.map(t => <span key={t} className="topic-pill">{t}</span>)}</div>
                      <div className="pg-lang-meta">
                        <span
                          className={`badge${l.badgeCls ? ' ' + l.badgeCls : ''}`}
                          style={!l.badgeCls ? { color: 'var(--text2)', borderColor: 'var(--border2)' } : undefined}
                        >
                          {l.badge}
                        </span>
                        <span style={{ color: 'var(--text4)' }}>{l.ext}</span>
                      </div>
                    </div>
                    <div className="pg-lang-foot">
                      <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text3)' }}>
                        by <span style={{ color: l.byColor }}>{l.by}</span>
                      </div>
                      <button className="sim-launch-btn" onClick={() => onLaunch(l.id)}>▷ LAUNCH</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}
