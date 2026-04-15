export default function EventsPage() {
  return (
    <>
      <div className="page-header">
        <div className="ph-row">
          <div>
            <div className="ph-title">EVENTS</div>
            <div className="ph-sub">// conferences, workshops, webinars</div>
          </div>
          <div className="ph-actions">
            <button className="btn-sec btn-ghost">+ PROPOSE EVENT</button>
          </div>
        </div>
      </div>
      <div className="inner-page">
        <div className="sec-divider">UPCOMING</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
          <div className="g-card" style={{ borderColor: 'rgba(0,255,136,0.25)' }}>
            <div className="g-card-inner">
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                <div style={{ textAlign: 'center', minWidth: 56, padding: 8, background: 'var(--void)', border: '1px solid var(--em-dim)' }}>
                  <div style={{ fontFamily: 'var(--display)', fontSize: 24, color: 'var(--em)' }}>28</div>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--text3)' }}>FEB</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span className="tag-chip tc-event">WEBINAR</span>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text3)' }}>14:00 UTC</span>
                  </div>
                  <div className="g-card-title">Zero Trust Implementation: Lessons from the Field</div>
                  <div className="g-card-body">Panel discussion with 4 senior IAM architects. Live Q&A, case studies from regulated industries.</div>
                </div>
                <button className="btn-sec btn-em" style={{ padding: '6px 14px', fontSize: 11, flexShrink: 0 }}>REGISTER</button>
              </div>
            </div>
          </div>
          <div className="g-card">
            <div className="g-card-inner">
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                <div style={{ textAlign: 'center', minWidth: 56, padding: 8, background: 'var(--void)', border: '1px solid var(--border2)' }}>
                  <div style={{ fontFamily: 'var(--display)', fontSize: 24, color: 'var(--amber)' }}>05</div>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--text3)' }}>MAR</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span className="tag-chip tc-discuss">WORKSHOP</span>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text3)' }}>10:00 UTC // 3 HOURS</span>
                  </div>
                  <div className="g-card-title">Cedar Policy Lab: Hands-on Authorization Design</div>
                  <div className="g-card-body">Interactive workshop with real policy scenarios. Use the built-in IDE Playground. Max 50 seats.</div>
                </div>
                <button className="btn-sec btn-ghost" style={{ padding: '6px 14px', fontSize: 11, flexShrink: 0 }}>JOIN WAITLIST</button>
              </div>
            </div>
          </div>
          <div className="g-card">
            <div className="g-card-inner">
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                <div style={{ textAlign: 'center', minWidth: 56, padding: 8, background: 'var(--void)', border: '1px solid var(--border2)' }}>
                  <div style={{ fontFamily: 'var(--display)', fontSize: 24, color: 'var(--amber)' }}>12</div>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--text3)' }}>MAR</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span className="tag-chip tc-article">CONF</span>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text3)' }}>ALL DAY // VIRTUAL</span>
                  </div>
                  <div className="g-card-title">IAMHUB Summit 2025 — Spring Edition</div>
                  <div className="g-card-body">12 talks, 4 workshops, 3 keynotes. Passkeys, AI identity, Zero Trust, and post-quantum IAM.</div>
                </div>
                <button className="btn-sec btn-ghost" style={{ padding: '6px 14px', fontSize: 11, flexShrink: 0 }}>LEARN MORE</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
