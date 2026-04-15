'use client'

import { useState } from 'react'
import { Composer } from '@/components/feed/Composer'
import { FeedPosts } from '@/components/feed/PostCard'
import { RightCol } from '@/components/feed/RightCol'

const TABS = ['ALL_POSTS', 'FOLLOWING', 'ARTICLES', 'QUESTIONS', 'ARTIFACTS']

export default function FeedPage() {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <div className="feed-layout">
      <div className="feed-col">
        <div className="tab-bar">
          {TABS.map((t, i) => (
            <div
              key={t}
              className={`tab${activeTab === i ? ' active' : ''}`}
              onClick={() => setActiveTab(i)}
            >
              {t}
            </div>
          ))}
        </div>
        <Composer />
        <FeedPosts />
      </div>
      <RightCol />
    </div>
  )
}
