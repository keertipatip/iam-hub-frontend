'use client'

import { useState } from 'react'
import { LangPicker } from '@/components/playground/LangPicker'
import { IdeView } from '@/components/playground/IdeView'

type View = { type: 'picker' } | { type: 'ide'; langId: string }

interface LangData {
  Name: string
  Ext: string
  RunLabel: string
  TermLabel: string
  Files: { Name: string; Section: boolean; Dot: string; Active: boolean }[]
  Code: { Class: string; Text: string }[]
  Run: { Class: string; Text: string }[]
}

export default function IdePage() {
  const [view, setView] = useState<View>({ type: 'picker' })
  const [langData, setLangData] = useState<LangData | null>(null)

  async function handleLaunch(langId: string) {
    try {
      const res = await fetch(`/api/playground/lang/${langId}`)
      const data: LangData = await res.json()
      setLangData(data)
      setView({ type: 'ide', langId })
    } catch {
      setLangData(null)
    }
  }

  return (
    <div id="pg-content" style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden', height: '100%' }}>
      {view.type === 'picker' && <LangPicker onLaunch={handleLaunch} />}
      {view.type === 'ide' && langData && (
        <IdeView
          langId={(view as { type: 'ide'; langId: string }).langId}
          langData={langData}
          onBack={() => setView({ type: 'picker' })}
        />
      )}
    </div>
  )
}
