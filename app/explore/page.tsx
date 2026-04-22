'use client'

export default function ExplorePage() {
  const protocols = [
    { badge: 'badge-em',     label: 'OAuth 2.0', members: '3,102', title: 'OAuth 2.0',           body: 'Authorization framework. Delegated access via scopes and tokens. Industry standard for APIs.',                              pills: ['#tokens', '#API'] },
    { badge: 'badge-em',     label: 'OIDC',      members: '2,341', title: 'OpenID Connect',       body: 'Modern identity layer on top of OAuth 2.0. Token-based, REST-friendly, mobile-first.',                                    pills: ['#federation', '#JWT'] },
    { badge: 'badge-amber',  label: 'SAML',      members: '1,887', title: 'SAML 2.0',             body: 'Enterprise SSO standard. XML-based assertions, widely supported in legacy and regulated environments.',                   pills: ['#SSO', '#enterprise'] },
    { badge: 'badge-blue',   label: 'FIDO2',     members: '1,204', title: 'FIDO2 / Passkeys',     body: 'Phishing-resistant authentication. Hardware-backed credentials, no shared secrets.',                                     pills: ['#passkeys', '#MFA'] },
    { badge: 'badge-red',    label: 'XACML',     members: '876',   title: 'XACML / Cedar',        body: 'Fine-grained authorization policy language. Attribute-based access control at scale.',                                   pills: ['#ABAC', '#policy'] },
    { badge: 'badge-purple', label: 'SCIM',      members: '743',   title: 'SCIM 2.0',             body: 'Automated user provisioning and deprovisioning across cloud services via REST API.',                                     pills: ['#provisioning', '#lifecycle'] },
  ]

  const operators = [
    { name: 'sarah.rahman',   spec: 'Enterprise Federation',   rep: 98, posts: 142, artifacts: 18, status: 'Online',  statusCls: 'badge-em',    initials: 'SR', bg: '#cc2200' },
    { name: 'david.wu',       spec: 'FIDO2 / Passkeys',        rep: 95, posts: 89,  artifacts: 12, status: 'Online',  statusCls: 'badge-em',    initials: 'DW', bg: '#003355' },
    { name: 'tanya.chen',     spec: 'Zero Trust Architecture', rep: 91, posts: 76,  artifacts: 9,  status: 'Away',   statusCls: 'badge-amber', initials: 'TC', bg: '#cc2200' },
    { name: 'marcus.johnson', spec: 'Policy Engines',          rep: 88, posts: 64,  artifacts: 21, status: 'Online', statusCls: 'badge-em',    initials: 'MJ', bg: '#005530' },
    { name: 'priya.lee',      spec: 'Multi-Region IAM',        rep: 85, posts: 51,  artifacts: 7,  status: 'Away',   statusCls: 'badge-amber', initials: 'PL', bg: '#552200' },
  ]

  return (
    <>
      {/* Header */}
      <div style={{ padding: '28px 32px 20px', background: 'var(--bg)', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 600, color: 'var(--text)', letterSpacing: '-.3px', marginBottom: 4 }}>Explore</div>
            <div style={{ fontSize: 13, color: 'var(--text-3)' }}>Discover protocols, practitioners, and trending topics in IAM</div>
          </div>
          <button style={{ padding: '7px 16px', background: 'none', border: '1px solid var(--border)', borderRadius: 10, fontFamily: 'var(--sans)', fontSize: 13, color: 'var(--text-2)', cursor: 'pointer' }}>
            Follow topics
          </button>
        </div>
      </div>

      <div style={{ padding: '28px 32px', overflowY: 'auto', flex: 1 }}>

        {/* Protocols */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>Protocols &amp; Standards</span>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
            {protocols.map(p => (
              <div key={p.label} style={{ border: '1px solid var(--border)', borderRadius: 14, background: 'var(--bg)', overflow: 'hidden', cursor: 'pointer', transition: 'all .18s' }}
                onMouseOver={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border-med)'; (e.currentTarget as HTMLDivElement).style.boxShadow = 'var(--shadow-sm)' }}
                onMouseOut={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLDivElement).style.boxShadow = 'none' }}
              >
                <div style={{ padding: '20px 20px 14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <span className={`badge ${p.badge}`}>{p.label}</span>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text-3)', marginLeft: 'auto' }}>{p.members} members</span>
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 8 }}>{p.title}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6 }}>{p.body}</div>
                </div>
                <div style={{ padding: '10px 20px', borderTop: '1px solid var(--border)', background: 'var(--bg-secondary)', display: 'flex', gap: 6 }}>
                  {p.pills.map(pill => <span key={pill} className="topic-pill">{pill}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Members */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>Top Members</span>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          </div>
          <div style={{ border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden', background: 'var(--bg)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr>
                  {['Member', 'Specialty', 'Rep', 'Posts', 'Artifacts', 'Status'].map(h => (
                    <th key={h} style={{ background: 'var(--bg-secondary)', fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text-3)', fontWeight: 500, padding: '10px 16px', textAlign: 'left', borderBottom: '1px solid var(--border)', letterSpacing: '.3px', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {operators.map((o, i) => (
                  <tr key={o.name} style={{ borderBottom: i < operators.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 28, height: 28, borderRadius: 8, background: o.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#fff', flexShrink: 0 }}>{o.initials}</div>
                        <span style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--text)', fontWeight: 500 }}>{o.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', color: 'var(--text-2)', fontSize: 13 }}>{o.spec}</td>
                    <td style={{ padding: '12px 16px', fontFamily: 'var(--mono)', fontSize: 13, color: o.rep >= 95 ? 'var(--green)' : 'var(--amber)', fontWeight: 600 }}>{o.rep}</td>
                    <td style={{ padding: '12px 16px', color: 'var(--text-2)' }}>{o.posts}</td>
                    <td style={{ padding: '12px 16px', color: 'var(--text-2)' }}>{o.artifacts}</td>
                    <td style={{ padding: '12px 16px' }}><span className={`badge ${o.statusCls}`}>{o.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </>
  )
}
