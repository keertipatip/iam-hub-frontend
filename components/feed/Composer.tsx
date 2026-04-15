'use client'

import { useToast } from '../ToastProvider'

export function Composer() {
  const { toast } = useToast()
  return (
    <div className="composer">
      <div className="composer-inner">
        <div className="composer-hex">AK</div>
        <textarea
          className="composer-ta"
          placeholder="// share protocol insights, post artifacts, ask the community..."
        />
      </div>
      <div className="composer-foot">
        <button className="composer-action">⊕ ATTACH</button>
        <button className="composer-action">{'{ }'} CODE</button>
        <button className="composer-action">≡ ARTICLE</button>
        <button
          className="btn-sec btn-em"
          style={{ marginLeft: 'auto', padding: '6px 14px', fontSize: 11 }}
          onClick={() => toast('POST_PUBLISHED')}
        >
          PUBLISH →
        </button>
      </div>
    </div>
  )
}
