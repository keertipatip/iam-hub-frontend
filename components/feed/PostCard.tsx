'use client'

import { useToast } from '../ToastProvider'

export interface Post {
  ID?: number
  Author?: string
  AuthorInitials?: string
  AuthorColor?: string
  Verified?: boolean
  VerifiedLabel?: string
  Time?: string
  TagClass?: string
  TagLabel?: string
  Title?: string
  Excerpt?: string
  Topics?: string[]
  Likes?: number
  Comments?: number
  CommentsLabel?: string
  ActionLabel?: string
  AnimDelay?: string
}

// Static seed posts matching the original template
const STATIC_POSTS: Post[] = [
  {
    Author: 'sarah.rahman',
    AuthorInitials: 'SR',
    AuthorColor: 'linear-gradient(135deg,#cc2200,#662200)',
    Verified: true,
    VerifiedLabel: '✦ Verified',
    Time: 'Feb 26 · 8 min read',
    TagClass: 'tc-article',
    TagLabel: 'Article',
    Title: 'OIDC vs SAML in 2025: When to Choose Which (and Why SAML Isn\'t Dead)',
    Excerpt: 'After deploying both protocols across 40+ enterprise environments, here\'s the decision framework I wish I had. The answer is almost never "just use OIDC" — context matters far more than convention.',
    Topics: ['#OIDC', '#SAML', '#federation', '#enterprise-IAM'],
    Likes: 142,
    Comments: 38,
    ActionLabel: 'Read full →',
    AnimDelay: '0s',
  },
  {
    Author: 'marcus.johnson',
    AuthorInitials: 'MJ',
    AuthorColor: 'linear-gradient(135deg,#005530,#003320)',
    Time: 'Feb 26 · Open source',
    TagClass: 'tc-artifact',
    TagLabel: 'Artifact',
    Title: 'Zero Trust Policy Engine — XACML Template Library (47 Policies, MIT)',
    Excerpt: 'Full policy template set for Zero Trust migrations. Covers least-privilege, time-based access, and geo-restriction patterns. Battle-tested across 6 production environments.',
    Topics: ['#ZeroTrust', '#XACML', '#policy-engine', '#open-source'],
    Likes: 89,
    Comments: 21,
    ActionLabel: 'Download →',
    AnimDelay: '0.05s',
  },
  {
    Author: 'priya.lee',
    AuthorInitials: 'PL',
    AuthorColor: 'linear-gradient(135deg,#552200,#331100)',
    Time: 'Feb 25 · Open',
    TagClass: 'tc-question',
    TagLabel: 'Question',
    Title: 'JWT rotation in multi-region setup — sub-100ms SLA?',
    Excerpt: 'JWKS cache TTL is 15min but seeing 401s at region boundaries. PKCE redeems locally but cross-region handoff fails intermittently. Has anyone solved this without increasing TTL?',
    Topics: ['#JWT', '#multi-region', '#JWKS'],
    Likes: 34,
    Comments: 67,
    CommentsLabel: '67 answers',
    ActionLabel: 'View thread →',
    AnimDelay: '0.1s',
  },
  {
    Author: 'david.wu',
    AuthorInitials: 'DW',
    AuthorColor: 'linear-gradient(135deg,#003355,#001122)',
    Verified: true,
    VerifiedLabel: '✦ Contributor',
    Time: 'Feb 24',
    TagClass: 'tc-discuss',
    TagLabel: 'Discussion',
    Title: 'Is Passkey adoption actually accelerating? Data from 50 enterprise deployments',
    Excerpt: 'Adoption varies wildly by demographic and device. The marketing narrative doesn\'t match what\'s happening in enterprise FIDO2 rollouts — here\'s the real data.',
    Topics: ['#passkeys', '#FIDO2', '#WebAuthn', '#MFA'],
    Likes: 218,
    Comments: 94,
    ActionLabel: 'Read discussion →',
    AnimDelay: '0.15s',
  },
]

function PostCard({ post, delay }: { post: Post; delay?: string }) {
  const { toast } = useToast()
  return (
    <div className="post-card" style={delay ? { animationDelay: delay } : undefined}>
      <div className="post-inner">
        <div className="post-head">
          <div
            className="hex-avatar"
            style={{ width: 36, height: 36, background: post.AuthorColor }}
          >
            {post.AuthorInitials}
          </div>
          <div className="post-meta">
            <div className="post-author">
              {post.Author}
              {post.Verified && (
                <span
                  className="post-verified"
                  style={post.VerifiedLabel === '✦ CONTRIBUTOR' ? { color: 'var(--blue)' } : undefined}
                >
                  {post.VerifiedLabel}
                </span>
              )}
            </div>
            <div className="post-time">{post.Time}</div>
          </div>
          <span className={`tag-chip ${post.TagClass}`}>{post.TagLabel}</span>
        </div>
        <div className="post-title">{post.Title}</div>
        <div className="post-excerpt">{post.Excerpt}</div>
        <div className="post-topics">
          {post.Topics?.map(t => (
            <span key={t} className="topic-pill">{t}</span>
          ))}
        </div>
      </div>
      <div className="post-foot">
        <button className={`p-action${post.Likes && post.Likes > 100 ? ' em' : ''}`}>
          ♥ {post.Likes}
        </button>
        <button className={`p-action${post.CommentsLabel ? ' amb' : ''}`}>
          ⌥ {post.CommentsLabel ?? post.Comments}
        </button>
        <button className="p-action" onClick={() => toast('Saved')}>⊡ Save</button>
        <button className="p-action" onClick={() => toast('Link copied')}>↗ Share</button>
        <span className="p-readmore">{post.ActionLabel}</span>
      </div>
    </div>
  )
}

export function FeedPosts() {
  return (
    <>
      {STATIC_POSTS.map((p, i) => (
        <PostCard key={i} post={p} delay={p.AnimDelay} />
      ))}
    </>
  )
}
