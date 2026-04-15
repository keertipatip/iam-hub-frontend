'use client'

import { useState, useEffect } from 'react'
import { SimLibrary } from '@/components/simulator/SimLibrary'
import { SimRunner } from '@/components/simulator/SimRunner'
import { SimCreate } from '@/components/simulator/SimCreate'

type View = { type: 'library' } | { type: 'run'; key: string } | { type: 'create' }

interface SimData {
  Title: string
  Protocol: string
  Config: { Label: string; Type: string; Opts: string[]; Val: string }[]
  Attacks: string[]
  Steps: { Class: string; Text: string }[]
}

export default function SimulatorPage() {
  const [view, setView] = useState<View>({ type: 'library' })
  const [filter, setFilter] = useState('all')
  const [simData, setSimData] = useState<SimData | null>(null)

  async function handleLaunch(key: string) {
    try {
      const res = await fetch(`/api/simulations/${key}`)
      const data: SimData = await res.json()
      setSimData(data)
      setView({ type: 'run', key })
    } catch {
      setSimData(null)
    }
  }

  return (
    <div id="sim-wrapper" style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden', height: '100%' }}>
      {view.type === 'library' && (
        <SimLibrary
          onLaunch={handleLaunch}
          onCreate={() => setView({ type: 'create' })}
          filter={filter}
          onFilter={setFilter}
        />
      )}
      {view.type === 'run' && simData && (
        <SimRunner
          simKey={(view as { type: 'run'; key: string }).key}
          simData={simData}
          onBack={() => setView({ type: 'library' })}
        />
      )}
      {view.type === 'create' && (
        <SimCreate onBack={() => setView({ type: 'library' })} />
      )}
    </div>
  )
}
