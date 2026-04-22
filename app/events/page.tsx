'use client'

const EVENTS = [
  {
    day: '28', month: 'Feb', accentColor: 'var(--accent)',
    type: 'Webinar', typeClass: 'tc-event',
    time: '14:00 UTC',
    title: 'Zero Trust Implementation: Lessons from the Field',
    body: 'Panel discussion with 4 senior IAM architects. Live Q&A, case studies from regulated industries.',
    cta: 'Register', ctaStyle: 'primary',
  },
  {
    day: '05', month: 'Mar', accentColor: 'var(--amber)',
    type: 'Workshop', typeClass: 'tc-discuss',
    time: '10:00 UTC · 3 hours',
    title: 'Cedar Policy Lab: Hands-on Authorization Design',
    body: 'Interactive workshop with real policy scenarios. Use the built-in IDE Playground. Max 50 seats.',
    cta: 'Join waitlist', ctaStyle: 'ghost',
  },
  {
    day: '12', month: 'Mar', accentColor: 'var(--blue)',
    type: 'Conference', typeClass: 'tc-article',
    time: 'All day · Virtual',
    title: 'IAMHUB Summit 2025 — Spring Edition',
    body: '12 talks, 4 workshops, 3 keynotes. Passkeys, AI identity, Zero Trust, and post-quantum IAM.',
    cta: 'Learn more', ctaStyle: 'ghost',
  },
  {
    day: '21', month: 'Mar', accentColor: 'var(--purple)',
    type: 'AMA', typeClass: 'tc-artifact',
    time: '18:00 UTC',
    title: 'AMA: Building FIDO2 at Scale with sarah.rahman',
    body: 'Ask Me Anything session with a senior FIDO2/Passkeys architect. Submit questions in advance.',
    cta: 'Set reminder', ctaStyle: 'ghost',
  },
]

export default function EventsPage() {
  return (
    <>
      {/* Header */}
      <div style={{ padding: '28px 32px 20px', background: 'var(--bg)', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 600, color: 'var(--text)', letterSpacing: '-.3px', marginBottom: 4 }}>Events</div>
            <div style={{ fontSize: 13, color: 'var(--text-3)' }}>Conferences, workshops, webinars, and community sessions</div>
          </div>
          <button style={{ padding: '7px 16px', background: 'none', border: '1px solid var(--border)', borderRadius: 10, fontFamily: 'var(--sans)', fontSize: 13, color: 'var(--text-2)', cursor: 'pointer' }}>
            + Propose event
          </button>
        </div>
      </div>

      <div style={{ padding: '28px 32px', overflowY: 'auto', flex: 1 }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>Upcoming</span>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 820 }}>
          {EVENTS.map(ev => (
            <div
              key={ev.title}
              style={{ border: '1px solid var(--border)', borderRadius: 14, background: 'var(--bg)', overflow: 'hidden', transition: 'all .18s' }}
              onMouseOver={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border-med)'; (e.currentTarget as HTMLDivElement).style.boxShadow = 'var(--shadow-sm)' }}
              onMouseOut={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLDivElement).style.boxShadow = 'none' }}
            >
              <div style={{ padding: '20px 24px', display: 'flex', alignItems: 'flex-start', gap: 20 }}>

                {/* Date block */}
                <div style={{ textAlign: 'center', minWidth: 52, padding: '8px 10px', background: 'var(--bg-secondary)', borderRadius: 10, border: '1px solid var(--border)', flexShrink: 0 }}>
                  <div style={{ fontSize: 22, fontWeight: 700, color: ev.accentColor, lineHeight: 1, fontFamily: 'var(--sans)' }}>{ev.day}</div>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text-3)', marginTop: 2, letterSpacing: 1 }}>{ev.month.toUpperCase()}</div>
                </div>

                {/* Details */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <span className={`tag-chip ${ev.typeClass}`}>{ev.type}</span>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text-3)' }}>{ev.time}</span>
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 6, lineHeight: 1.4 }}>{ev.title}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6 }}>{ev.body}</div>
                </div>

                {/* CTA */}
                <button style={{
                  padding: '8px 18px', borderRadius: 10, cursor: 'pointer',
                  fontFamily: 'var(--sans)', fontSize: 13, fontWeight: 500, flexShrink: 0,
                  background: ev.ctaStyle === 'primary' ? 'var(--text)' : 'transparent',
                  color: ev.ctaStyle === 'primary' ? 'var(--bg)' : 'var(--text-2)',
                  border: ev.ctaStyle === 'primary' ? 'none' : '1px solid var(--border)',
                  transition: 'all .15s',
                }}>
                  {ev.cta}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Past events hint */}
        <div style={{ marginTop: 40, padding: '16px 20px', border: '1px solid var(--border)', borderRadius: 12, background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: 820 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 2 }}>Past events & recordings</div>
            <div style={{ fontSize: 13, color: 'var(--text-3)' }}>Access recordings and slides from previous sessions</div>
          </div>
          <button style={{ padding: '7px 16px', background: 'none', border: '1px solid var(--border)', borderRadius: 10, fontFamily: 'var(--sans)', fontSize: 13, color: 'var(--text-2)', cursor: 'pointer' }}>Browse archive</button>
        </div>

      </div>
    </>
  )
}
