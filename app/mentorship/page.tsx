export default function MentorshipPage() {
  return (
    <>
      <div className="page-header">
        <div className="ph-row">
          <div>
            <div className="ph-title">MENTORSHIP</div>
            <div className="ph-sub">// connect with senior IAM engineers and architects</div>
          </div>
          <div className="ph-actions">
            <button className="btn-sec btn-ghost">BECOME A MENTOR</button>
          </div>
        </div>
      </div>
      <div className="inner-page">
        <div className="two-col">
          <div>
            <div className="sec-divider">AVAILABLE MENTORS</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                {
                  initials: 'SR', bg: 'linear-gradient(135deg,#cc2200,#662200)', name: 'sarah.rahman',
                  sub: 'IAM Architect · 12y exp', badge: 'AVAILABLE', badgeCls: 'badge-em',
                  body: 'Specializes in enterprise federation, OIDC, SAML 2.0, and regulated industry compliance (FedRAMP, SOC2).',
                  pills: ['#OIDC', '#SAML', '#enterprise'], slots: '3 slots open', btnCls: 'btn-em',
                },
                {
                  initials: 'MJ', bg: 'linear-gradient(135deg,#005530,#003320)', name: 'marcus.johnson',
                  sub: 'Policy Engineer · 9y exp', badge: '1 SLOT', badgeCls: 'badge-amber',
                  body: 'Expert in XACML, Cedar, OPA policy design. Zero Trust migrations, attribute-based access control at scale.',
                  pills: ['#Cedar', '#XACML', '#ZeroTrust'], slots: '1 slot open', btnCls: 'btn-ghost',
                },
              ].map(m => (
                <div key={m.name} className="g-card">
                  <div className="g-card-inner">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                      <div className="hex-avatar" style={{ width: 44, height: 44, background: m.bg }}>{m.initials}</div>
                      <div>
                        <div className="g-card-title" style={{ marginBottom: 2 }}>{m.name}</div>
                        <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text3)' }}>{m.sub}</div>
                      </div>
                      <span className={`badge ${m.badgeCls}`} style={{ marginLeft: 'auto' }}>{m.badge}</span>
                    </div>
                    <div className="g-card-body">{m.body}</div>
                    <div style={{ marginTop: 12, display: 'flex', gap: 6 }}>
                      {m.pills.map(p => <span key={p} className="topic-pill">{p}</span>)}
                    </div>
                  </div>
                  <div className="g-card-foot">
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text3)' }}>{m.slots}</span>
                    <button className={`btn-sec ${m.btnCls}`} style={{ marginLeft: 'auto', padding: '6px 14px', fontSize: 11 }}>
                      REQUEST SESSION
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="widget">
              <div className="w-head"><div className="w-lead"></div><span className="w-title">MY_SESSIONS</span></div>
              <div className="w-body">
                <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text3)' }}>// no active sessions</div>
                <div style={{ fontFamily: 'var(--sans)', fontSize: 13, color: 'var(--text2)', marginTop: 8, lineHeight: 1.6 }}>
                  Request a mentorship session with a senior operator to accelerate your IAM expertise.
                </div>
                <button className="btn-sec btn-em" style={{ marginTop: 12, width: '100%', justifyContent: 'center' }}>FIND A MENTOR</button>
              </div>
            </div>
            <div className="widget">
              <div className="w-head"><div className="w-lead amber"></div><span className="w-title">PROGRAM_STATS</span></div>
              <div className="w-body">
                <div className="stat-grid">
                  <div className="stat-cell"><div className="stat-val">38</div><div className="stat-key">mentors</div></div>
                  <div className="stat-cell"><div className="stat-val amb">124</div><div className="stat-key">sessions</div></div>
                  <div className="stat-cell"><div className="stat-val">4.9</div><div className="stat-key">avg rating</div></div>
                  <div className="stat-cell"><div className="stat-val">92%</div><div className="stat-key">satisfaction</div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
