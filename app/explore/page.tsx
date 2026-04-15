export default function ExplorePage() {
  return (
    <>
      <div className="page-header">
        <div className="ph-row">
          <div>
            <div className="ph-title">EXPLORE</div>
            <div className="ph-sub">// discover protocols, teams, and trending discussions</div>
          </div>
          <div className="ph-actions">
            <button className="btn-sec btn-ghost">⊕ FOLLOW TOPICS</button>
          </div>
        </div>
      </div>
      <div className="inner-page">
        <div className="sec-divider">FEATURED PROTOCOLS</div>
        <div className="three-col" style={{ marginBottom: 24 }}>
          {[
            { badge: 'badge-em', label: 'OIDC', members: '2,341', title: 'OpenID Connect', body: 'Modern identity layer on top of OAuth 2.0. Token-based, REST-friendly, mobile-first.', pills: ['#federation', '#JWT'] },
            { badge: 'badge-amber', label: 'SAML', members: '1,887', title: 'SAML 2.0', body: 'Enterprise SSO standard. XML-based assertions, widely supported in legacy and regulated environments.', pills: ['#SSO', '#enterprise'] },
            { badge: 'badge-blue', label: 'FIDO2', members: '1,204', title: 'FIDO2 / Passkeys', body: 'Phishing-resistant authentication. Hardware-backed credentials, no shared secrets.', pills: ['#passkeys', '#MFA'] },
            { badge: 'badge-red', label: 'XACML', members: '876', title: 'XACML / Cedar', body: 'Fine-grained authorization policy language. Attribute-based access control at scale.', pills: ['#ABAC', '#policy'] },
            { badge: 'badge-purple', label: 'SCIM', members: '743', title: 'SCIM 2.0', body: 'Automated user provisioning and deprovisioning across cloud services via REST API.', pills: ['#provisioning', '#lifecycle'] },
            { badge: 'badge-em', label: 'OAUTH2', members: '3,102', title: 'OAuth 2.0', body: 'Authorization framework. Delegated access via scopes and tokens. Industry standard for APIs.', pills: ['#tokens', '#API'] },
          ].map(p => (
            <div className="g-card" key={p.label}>
              <div className="g-card-inner">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <span className={`badge ${p.badge}`}>{p.label}</span>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text3)' }}>{p.members} members</span>
                </div>
                <div className="g-card-title">{p.title}</div>
                <div className="g-card-body">{p.body}</div>
              </div>
              <div className="g-card-foot">
                {p.pills.map(pill => <span key={pill} className="topic-pill">{pill}</span>)}
              </div>
            </div>
          ))}
        </div>

        <div className="sec-divider">TOP OPERATORS</div>
        <div className="explore-table-wrap" style={{ border: '1px solid var(--border)', background: 'var(--panel)', overflow: 'hidden', clipPath: 'polygon(0 0,calc(100% - 12px) 0,100% 12px,100% 100%,0 100%)' }}>
          <table className="data-table" style={{ minWidth: 560 }}>
            <thead>
              <tr><th>OPERATOR</th><th>SPECIALTY</th><th>REP</th><th>POSTS</th><th>ARTIFACTS</th><th>STATUS</th></tr>
            </thead>
            <tbody>
              {[
                { name: 'sarah.rahman', spec: 'Enterprise Federation', rep: 98, repCls: 'var(--em)', posts: 142, artifacts: 18, status: 'ONLINE', statusCls: 'badge-em', nameCls: 'var(--em)' },
                { name: 'david.wu', spec: 'FIDO2 / Passkeys', rep: 95, repCls: 'var(--em)', posts: 89, artifacts: 12, status: 'ONLINE', statusCls: 'badge-em', nameCls: 'var(--em)' },
                { name: 'tanya.chen', spec: 'Zero Trust Architecture', rep: 91, repCls: 'var(--amber)', posts: 76, artifacts: 9, status: 'AWAY', statusCls: 'badge-amber', nameCls: 'var(--text2)' },
                { name: 'marcus.johnson', spec: 'Policy Engines', rep: 88, repCls: 'var(--amber)', posts: 64, artifacts: 21, status: 'ONLINE', statusCls: 'badge-em', nameCls: 'var(--text2)' },
                { name: 'priya.lee', spec: 'Multi-Region IAM', rep: 85, repCls: 'var(--amber)', posts: 51, artifacts: 7, status: 'AWAY', statusCls: 'badge-amber', nameCls: 'var(--text2)' },
              ].map(o => (
                <tr key={o.name}>
                  <td><span style={{ color: o.nameCls, fontFamily: 'var(--mono)' }}>{o.name}</span></td>
                  <td>{o.spec}</td>
                  <td><span style={{ color: o.repCls }}>{o.rep}</span></td>
                  <td>{o.posts}</td>
                  <td>{o.artifacts}</td>
                  <td><span className={`badge ${o.statusCls}`}>{o.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
