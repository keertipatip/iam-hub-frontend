'use client'

import { useState } from 'react'
import { useToast } from '../ToastProvider'

interface LangFile { Name: string; Section: boolean; Dot: string; Active: boolean }
interface CodeLine { Class: string; Text: string }
interface LangData {
  Name: string
  Ext: string
  RunLabel: string
  TermLabel: string
  Files: LangFile[]
  Code: CodeLine[]
  Run: CodeLine[]
}

interface Props {
  langId: string
  langData: LangData
  onBack: () => void
}

export function IdeView({ langId, langData, onBack }: Props) {
  const { toast } = useToast()
  const [activeFile, setActiveFile] = useState(() => langData.Files.find(f => f.Active)?.Name ?? '')
  const [termLines, setTermLines] = useState<CodeLine[]>([])
  const [activeFileTabs, setActiveFileTabs] = useState(activeFile)

  const fileTabs = langData.Files.filter(f => !f.Section).slice(0, 5)

  async function runCode() {
    try {
      const res = await fetch(`/api/playground/run?lang=${langId}`, { method: 'POST' })
      const data = await res.json()
      setTermLines(data.lines ?? [])
    } catch {
      setTermLines([{ Class: 'err', Text: 'ERROR // failed to connect to API' }])
    }
  }

  return (
    <>
      <div className="pg-toolbar">
        <button className="c-tool" style={{ color: 'var(--text3)' }} onClick={onBack}>← BACK</button>
        <div className="pg-sep"></div>
        <div className="pg-toolbar-title"><div className="pg-dot"></div>{langData.Name} // {langData.Ext}</div>
        <div className="pg-sep"></div>
        <div id="pg-file-tabs" style={{ display: 'flex', gap: 2 }}>
          {fileTabs.map(f => (
            <button
              key={f.Name}
              className={`c-tool${activeFileTabs === f.Name ? ' active' : ''}`}
              onClick={() => setActiveFileTabs(f.Name)}
            >
              {f.Name}
            </button>
          ))}
        </div>
        <div className="pg-sep"></div>
        <button className="c-tool">FORMAT</button>
        <button className="c-tool">LINT</button>
        <button className="c-tool amber active" onClick={runCode}>{langData.RunLabel}</button>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
          <button className="c-tool" onClick={() => toast('FILE_SAVED // version_tagged')}>💾 SAVE</button>
          <button className="c-tool" onClick={() => toast('ARTIFACT_PUBLISHED // community_shared')}>↑ SHARE</button>
        </div>
      </div>

      <div className="ide-layout">
        {/* File tree */}
        <div className="ide-files">
          {langData.Files.map((f, i) =>
            f.Section ? (
              <div key={i} className="f-section">{f.Name}</div>
            ) : (
              <div
                key={i}
                className={`f-item${activeFile === f.Name ? ' active' : ''}`}
                onClick={() => { setActiveFile(f.Name); setActiveFileTabs(f.Name) }}
              >
                <div className={`f-dot ${f.Dot}`}></div>
                {f.Name}
              </div>
            )
          )}
        </div>

        {/* Code area */}
        <div className="ide-code">
          {langData.Code.map((line, i) => (
            <div key={i} className="code-line">
              <span className="ln">{String(i + 1).padStart(2, '0')}</span>
              <span className={`lc${line.Class ? ' ' + line.Class : ''}`}>{line.Text as string}</span>
            </div>
          ))}
        </div>

        {/* Terminal */}
        <div className="ide-term">
          <div className="term-bar">
            <span>{langData.TermLabel}</span>
            <button className="term-run-btn" onClick={runCode}>▷ RUN</button>
          </div>
          <div className="term-body">
            {termLines.length === 0 ? (
              <div className="t-line t-mute">// {langData.Name} ready — press {langData.RunLabel} to execute</div>
            ) : (
              termLines.map((l, i) => (
                <div key={i} className={`t-line t-${l.Class}`}>{l.Text as string}</div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  )
}
