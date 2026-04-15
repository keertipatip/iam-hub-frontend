export function RightCol() {
  return (
    <div className="right-col">
      <div className="widget">
        <div className="w-head">
          <div className="w-lead"></div>
          <span className="w-title">OPERATOR_STATS</span>
        </div>
        <div className="w-body">
          <div className="stat-grid">
            <div className="stat-cell"><div className="stat-val">1.2K</div><div className="stat-key">followers</div></div>
            <div className="stat-cell"><div className="stat-val">48</div><div className="stat-key">posts</div></div>
            <div className="stat-cell"><div className="stat-val">12</div><div className="stat-key">artifacts</div></div>
            <div className="stat-cell"><div className="stat-val amb">94</div><div className="stat-key">rep_score</div></div>
          </div>
        </div>
      </div>
      <div className="widget">
        <div className="w-head">
          <div className="w-lead red"></div>
          <span className="w-title">TRENDING_TOPICS</span>
        </div>
        <div className="w-body">
          {[
            { level: 'HIGH', cls: 't-high', topic: 'Entra ID Conditional Access', count: 342 },
            { level: 'MED', cls: 't-med', topic: 'Passkey Enterprise Rollout', count: 219 },
            { level: 'MED', cls: 't-med', topic: 'SCIM 2.0 Best Practices', count: 188 },
            { level: 'LOW', cls: 't-low', topic: 'JWT vs Opaque Tokens', count: 156 },
            { level: 'LOW', cls: 't-low', topic: 'Zero Trust Patterns', count: 122 },
          ].map(r => (
            <div className="threat-row" key={r.topic}>
              <div className={`threat-level ${r.cls}`}>{r.level}</div>
              <div className="threat-topic">{r.topic}</div>
              <div className="threat-count">{r.count}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="widget">
        <div className="w-head">
          <div className="w-lead" style={{ animation: 'blink 1s step-end infinite' }}></div>
          <span className="w-title">ONLINE_OPERATORS</span>
          <span style={{ marginLeft: 'auto', fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--em)' }}>47</span>
        </div>
        <div className="w-body">
          {[
            { initials: 'TC', bg: 'linear-gradient(135deg,#cc2200,#551100)', name: 'tanya.chen', spec: 'security_architect' },
            { initials: 'RO', bg: 'linear-gradient(135deg,#005530,#002210)', name: 'raj.okonkwo', spec: 'idp_engineer' },
            { initials: 'LM', bg: 'linear-gradient(135deg,#003366,#001133)', name: 'lisa.muller', spec: 'compliance_lead' },
          ].map(u => (
            <div className="user-row" key={u.name}>
              <div className="u-sm-hex" style={{ background: u.bg }}>{u.initials}</div>
              <div className="u-sm-info">
                <div className="u-sm-name">{u.name}</div>
                <div className="u-sm-spec">{u.spec}</div>
              </div>
              <button className="u-follow-btn">+FOLLOW</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
