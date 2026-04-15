export default function ChannelsPage() {
  const channels = [
    { name: '# zero-trust-war-room', members: 142, msgs: 23, badge: '3 UNREAD', badgeCls: 'badge-red', borderCls: 'rgba(255,51,68,0.3)' },
    { name: '# oidc-and-oauth2', members: 891, msgs: 47, badge: 'JOINED', badgeCls: 'badge-em', borderCls: undefined },
    { name: '# passkey-adoption', members: 312, msgs: 12, badge: 'JOINED', badgeCls: 'badge-em', borderCls: undefined },
    { name: '# policy-engines', members: 234, msgs: 8, action: 'JOIN', borderCls: undefined },
    { name: '# incident-response', members: 567, msgs: 31, action: 'JOIN', borderCls: undefined },
    { name: '# general', members: 2341, msgs: 89, badge: 'JOINED', badgeCls: 'badge-em', borderCls: undefined },
  ]

  return (
    <>
      <div className="page-header">
        <div className="ph-row">
          <div>
            <div className="ph-title">CHANNELS</div>
            <div className="ph-sub">// real-time topic channels // 3 unread</div>
          </div>
          <div className="ph-actions">
            <button className="btn-sec btn-ghost">+ JOIN CHANNEL</button>
          </div>
        </div>
      </div>
      <div className="inner-page">
        <div className="two-col">
          <div>
            <div className="sec-divider">ACTIVE CHANNELS</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {channels.map(c => (
                <div className="g-card" key={c.name} style={c.borderCls ? { borderColor: c.borderCls } : undefined}>
                  <div className="g-card-inner" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ fontSize: 20 }}>#</div>
                    <div style={{ flex: 1 }}>
                      <div className="g-card-title">{c.name}</div>
                      <div className="g-card-sub">{c.members} members · {c.msgs} messages today</div>
                    </div>
                    {c.badge ? (
                      <span className={`badge ${c.badgeCls}`}>{c.badge}</span>
                    ) : (
                      <button className="u-follow-btn">{c.action}</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="widget">
              <div className="w-head">
                <div className="w-lead red"></div>
                <span className="w-title">ACTIVE_NOW</span>
                <span style={{ marginLeft: 'auto', fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--em)' }}>47</span>
              </div>
              <div className="w-body">
                {[
                  { initials: 'TC', bg: 'linear-gradient(135deg,#cc2200,#551100)', name: 'tanya.chen', channel: '# zero-trust-war-room' },
                  { initials: 'MJ', bg: 'linear-gradient(135deg,#005530,#002210)', name: 'marcus.johnson', channel: '# policy-engines' },
                  { initials: 'LM', bg: 'linear-gradient(135deg,#003366,#001133)', name: 'lisa.muller', channel: '# general' },
                  { initials: 'PL', bg: 'linear-gradient(135deg,#552200,#331100)', name: 'priya.lee', channel: '# oidc-and-oauth2' },
                ].map(u => (
                  <div key={u.name} className="user-row">
                    <div className="u-sm-hex" style={{ background: u.bg }}>{u.initials}</div>
                    <div className="u-sm-info">
                      <div className="u-sm-name">{u.name}</div>
                      <div className="u-sm-spec">{u.channel}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
