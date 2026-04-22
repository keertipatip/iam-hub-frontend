export function RightCol() {
  return (
    <div className="right-col">

      {/* My stats */}
      <div className="widget">
        <div className="w-head">
          <div className="w-lead"></div>
          <span className="w-title">Your stats</span>
        </div>
        <div className="w-body">
          <div className="stat-grid">
            <div className="stat-cell"><div className="stat-val">1.2K</div><div className="stat-key">followers</div></div>
            <div className="stat-cell"><div className="stat-val">48</div><div className="stat-key">posts</div></div>
            <div className="stat-cell"><div className="stat-val">12</div><div className="stat-key">artifacts</div></div>
            <div className="stat-cell"><div className="stat-val" style={{ color: 'var(--amber)' }}>94</div><div className="stat-key">rep score</div></div>
          </div>
        </div>
      </div>

      {/* Trending */}
      <div className="widget">
        <div className="w-head">
          <div className="w-lead" style={{ background: 'var(--blue)' }}></div>
          <span className="w-title">Trending topics</span>
        </div>
        <div className="w-body" style={{ padding: '8px 0' }}>
          {[
            { topic: 'Entra ID Conditional Access', count: 342, color: 'var(--red)' },
            { topic: 'Passkey Enterprise Rollout',  count: 219, color: 'var(--amber)' },
            { topic: 'SCIM 2.0 Best Practices',     count: 188, color: 'var(--amber)' },
            { topic: 'JWT vs Opaque Tokens',        count: 156, color: 'var(--text-3)' },
            { topic: 'Zero Trust Patterns',         count: 122, color: 'var(--text-3)' },
          ].map(r => (
            <div key={r.topic} style={{ display: 'flex', alignItems: 'center', padding: '8px 16px', cursor: 'pointer', transition: 'background .1s', gap: 10 }}
              onMouseOver={e => (e.currentTarget.style.background = 'var(--bg-hover)')}
              onMouseOut={e => (e.currentTarget.style.background = '')}
            >
              <div style={{ flex: 1, fontSize: 13, color: 'var(--text-2)' }}>{r.topic}</div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: r.color }}>{r.count}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Online members */}
      <div className="widget">
        <div className="w-head">
          <div className="w-lead" style={{ animation: 'dotPulse 1.5s ease-in-out infinite' }}></div>
          <span className="w-title">Online now</span>
          <span style={{ marginLeft: 'auto', fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--accent)' }}>47</span>
        </div>
        <div className="w-body" style={{ padding: '8px 0' }}>
          {[
            { initials: 'TC', bg: '#cc3300', name: 'tanya.chen',    spec: 'Security Architect' },
            { initials: 'RO', bg: '#005530', name: 'raj.okonkwo',   spec: 'IdP Engineer' },
            { initials: 'LM', bg: '#003366', name: 'lisa.muller',   spec: 'Compliance Lead' },
          ].map(u => (
            <div key={u.name} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 16px', cursor: 'pointer', transition: 'background .1s' }}
              onMouseOver={e => (e.currentTarget.style.background = 'var(--bg-hover)')}
              onMouseOut={e => (e.currentTarget.style.background = '')}
            >
              <div style={{ width: 28, height: 28, borderRadius: 8, background: u.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                {u.initials}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text)', fontFamily: 'var(--mono)' }}>{u.name}</div>
                <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{u.spec}</div>
              </div>
              <button style={{ padding: '3px 10px', border: '1px solid var(--border)', borderRadius: 6, background: 'none', fontFamily: 'var(--sans)', fontSize: 11, color: 'var(--text-2)', cursor: 'pointer', transition: 'all .15s' }}
                onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--border-med)'; e.currentTarget.style.color = 'var(--text)' }}
                onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-2)' }}
              >Follow</button>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
