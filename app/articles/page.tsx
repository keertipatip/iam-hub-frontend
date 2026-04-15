'use client'

import { useState } from 'react'

const TABS = ['LATEST', 'TRENDING', 'BOOKMARKED']

export default function ArticlesPage() {
  const [activeTab, setActiveTab] = useState(0)
  return (
    <>
      <div className="page-header">
        <div className="ph-row">
          <div>
            <div className="ph-title">ARTICLES</div>
            <div className="ph-sub">// peer-reviewed technical writing from IAM operators</div>
          </div>
          <div className="ph-actions">
            <button className="btn-sec btn-em">+ WRITE ARTICLE</button>
          </div>
        </div>
      </div>
      <div className="inner-page">
        <div className="two-col">
          <div>
            <div className="tab-bar" style={{ marginBottom: 16 }}>
              {TABS.map((t, i) => (
                <div key={t} className={`tab${activeTab === i ? ' active' : ''}`} onClick={() => setActiveTab(i)}>{t}</div>
              ))}
            </div>
            {[
              { initials: 'SR', bg: 'linear-gradient(135deg,#cc2200,#662200)', author: 'sarah.rahman', verified: '✦ VERIFIED', time: '2025-02-26 // 14:32 UTC // 8 MIN', title: 'OIDC vs SAML in 2025: When to Choose Which', excerpt: 'A decision framework built from 40+ enterprise deployments. Context matters more than convention.', topics: ['#OIDC', '#SAML', '#enterprise'], likes: 142, comments: 38 },
              { initials: 'DW', bg: 'linear-gradient(135deg,#003355,#001122)', author: 'david.wu', time: '2025-02-20 // 6 MIN', title: 'Building Phishing-Resistant Auth with WebAuthn Level 3', excerpt: 'Deep dive into the new credential level requirements and enterprise deployment patterns for FIDO2.', topics: ['#WebAuthn', '#FIDO2'], likes: 98, comments: 22 },
              { initials: 'MJ', bg: 'linear-gradient(135deg,#005530,#003320)', author: 'marcus.johnson', time: '2025-02-15 // 12 MIN', title: 'Cedar Policy Language: Production Patterns at Scale', excerpt: 'AWS Cedar policy evaluation at 10M+ requests/day — schema design, testing, and performance gotchas.', topics: ['#Cedar', '#ABAC'], likes: 76, comments: 14 },
            ].map(a => (
              <div key={a.title} className="post-card">
                <div className="post-inner">
                  <div className="post-head">
                    <div className="hex-avatar" style={{ width: 36, height: 36, background: a.bg }}>{a.initials}</div>
                    <div className="post-meta">
                      <div className="post-author">{a.author}{a.verified && <span className="post-verified">{a.verified}</span>}</div>
                      <div className="post-time">{a.time}</div>
                    </div>
                    <span className="tag-chip tc-article">ARTICLE</span>
                  </div>
                  <div className="post-title">{a.title}</div>
                  <div className="post-excerpt">{a.excerpt}</div>
                  <div className="post-topics">{a.topics.map(t => <span key={t} className="topic-pill">{t}</span>)}</div>
                </div>
                <div className="post-foot">
                  <button className="p-action">♥ {a.likes}</button>
                  <button className="p-action">⌥ {a.comments}</button>
                  <span className="p-readmore">READ →</span>
                </div>
              </div>
            ))}
          </div>
          <div>
            <div className="widget">
              <div className="w-head"><div className="w-lead"></div><span className="w-title">WRITE_STATS</span></div>
              <div className="w-body">
                <div className="stat-grid">
                  <div className="stat-cell"><div className="stat-val">4</div><div className="stat-key">published</div></div>
                  <div className="stat-cell"><div className="stat-val amb">2</div><div className="stat-key">drafts</div></div>
                  <div className="stat-cell"><div className="stat-val">1.4K</div><div className="stat-key">total reads</div></div>
                  <div className="stat-cell"><div className="stat-val">98%</div><div className="stat-key">approval</div></div>
                </div>
              </div>
            </div>
            <div className="widget">
              <div className="w-head"><div className="w-lead amber"></div><span className="w-title">POPULAR_TAGS</span></div>
              <div className="w-body" style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {['#OAuth2','#OIDC','#SAML','#JWT','#ZeroTrust','#FIDO2','#SCIM','#Cedar','#XACML','#passkeys'].map(t => (
                  <span key={t} className="topic-pill">{t}</span>
                ))}
              </div>
            </div>
            <div className="widget">
              <div className="w-head"><div className="w-lead blue"></div><span className="w-title">READING_QUEUE</span></div>
              <div className="w-body">
                <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text3)', marginBottom: 6 }}>// 3 articles saved</div>
                {['Token Introspection at Scale', 'SCIM 2.0 Provisioning Patterns', 'Securing M2M with OAuth2'].map((a, i) => (
                  <div key={a} style={{ fontFamily: 'var(--sans)', fontSize: 12, color: 'var(--text2)', padding: '6px 0', borderBottom: i < 2 ? '1px solid var(--border)' : undefined }}>{a}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
