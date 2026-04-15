'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export interface ArtifactData {
  langId: string
  name: string
  type: string
  desc: string
  author: string
  version: string
  license: string
  avatarInitials: string
  avatarBg: string
  tags: string[]
  files: string[]
}

interface Props {
  artifact: ArtifactData | null
  onClose: () => void
}

function buildCodePreview(langId: string, name: string): string {
  const samples: Record<string, string> = {
    python: `# ${name}\n# Auto-generated preview\n\nimport requests\n\ndef main():\n    print("Loading ${name}...")\n\nif __name__ == "__main__":\n    main()`,
    javascript: `// ${name}\n// Auto-generated preview\n\nconst ${name.replace(/-/g, '_')} = () => {\n  console.log('${name} loaded');\n};\n\nexport default ${name.replace(/-/g, '_')};`,
    typescript: `// ${name}\n// Auto-generated preview\n\nexport function init(): void {\n  console.log('${name} ready');\n}`,
    bash: `#!/bin/bash\n# ${name}\n\nset -euo pipefail\n\necho "Running ${name}..."\n`,
    yaml: `# ${name}\napiVersion: v1\nkind: Config\nmetadata:\n  name: ${name}\n`,
    xml: `<?xml version="1.0" encoding="UTF-8"?>\n<!-- ${name} -->\n<PolicySet>\n  <Description>${name}</Description>\n</PolicySet>`,
    cedar: `// ${name}\npermit(\n  principal,\n  action == Action::"read",\n  resource\n);`,
    rego: `package ${name.replace(/-/g, '_')}\n\ndefault allow = false\n\nallow {\n  input.method == "GET"\n}`,
    toml: `# ${name}\n[server]\nhost = "localhost"\nport = 8080`,
  }
  return samples[langId] || `# ${name}\n# View the source files below`
}

export function ArtifactDrawer({ artifact, onClose }: Props) {
  const router = useRouter()
  const [activeFile, setActiveFile] = useState(0)

  useEffect(() => {
    setActiveFile(0)
  }, [artifact])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  if (!artifact) return null

  const codeContent = buildCodePreview(artifact.langId, artifact.name)
  const lines = codeContent.split('\n')

  function remixToPlayground() {
    onClose()
    setTimeout(() => router.push('/ide'), 80)
  }

  function remixToCanvas() {
    onClose()
    setTimeout(() => router.push('/canvas'), 80)
  }

  const isCodeArtifact = ['script', 'policy', 'tool', 'template', 'config'].includes(artifact.type)

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          display: 'block', position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.55)', zIndex: 200,
          backdropFilter: 'blur(2px)',
        }}
      />

      {/* Drawer */}
      <div style={{
        position: 'fixed', top: 0, right: 0, width: 680, maxWidth: '95vw',
        height: '100vh', background: 'var(--base)', borderLeft: '1px solid var(--border)',
        zIndex: 201, display: 'flex', flexDirection: 'column', overflow: 'hidden',
        animation: 'slideInRight 0.2s ease',
      }}>

        {/* Toolbar */}
        <div style={{
          height: 50, background: 'var(--panel)', borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', padding: '0 16px', gap: 10, flexShrink: 0,
        }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: 2, color: 'var(--text4)' }}>// ARTIFACT_VIEWER</div>
          <div className="pg-dot" style={{ marginLeft: 4 }}></div>
          <span style={{
            fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: 1, color: 'var(--amber)',
            border: '1px solid rgba(255,183,0,0.3)', padding: '2px 7px',
          }}>READ-ONLY</span>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
            <button className="c-tool" onClick={onClose} style={{ color: 'var(--text3)' }}>✕ CLOSE</button>
          </div>
        </div>

        {/* Header */}
        <div style={{
          padding: '18px 20px 14px', borderBottom: '1px solid var(--border)',
          background: 'var(--panel)', flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
            <div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 16, fontWeight: 700, color: 'var(--em)', marginBottom: 6 }}>
                {artifact.name}
              </div>
              <div style={{ fontFamily: 'var(--sans)', fontSize: 12, color: 'var(--text2)', lineHeight: 1.65, maxWidth: 560 }}>
                {artifact.desc}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <span className={`badge badge-${artifact.type === 'policy' ? 'em' : artifact.type === 'config' ? 'blue' : artifact.type === 'template' ? 'purple' : artifact.type === 'design' ? 'purple' : artifact.type === 'diagram' ? 'blue' : artifact.type === 'image' ? 'red' : artifact.type === 'document' ? 'red' : 'amber'}`}>
                {artifact.type.toUpperCase()}
              </span>
              <span style={{
                fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: 1, color: 'var(--text3)',
                border: '1px solid var(--border)', padding: '2px 7px',
              }}>{artifact.version}</span>
              <span style={{
                fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: 1, color: 'var(--text3)',
                border: '1px solid var(--border)', padding: '2px 7px',
              }}>{artifact.license}</span>
            </div>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {artifact.tags.map(t => <span key={t} className="topic-pill">{t}</span>)}
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
              <div
                className="u-sm-hex"
                style={{ width: 26, height: 26, fontSize: 9, background: `linear-gradient(135deg,${artifact.avatarBg},${artifact.avatarBg}88)` }}
              >
                {artifact.avatarInitials}
              </div>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text3)' }}>{artifact.author}</span>
            </div>
          </div>
        </div>

        {/* File tabs */}
        {artifact.files.length > 0 && (
          <div style={{
            display: 'flex', background: 'var(--panel)', borderBottom: '1px solid var(--border)',
            padding: '0 16px', gap: 2, flexShrink: 0, overflowX: 'auto',
          }}>
            {artifact.files.map((f, i) => (
              <button
                key={f}
                className={`c-tool${activeFile === i ? ' active' : ''}`}
                onClick={() => setActiveFile(i)}
                style={{ whiteSpace: 'nowrap' }}
              >
                {f}
              </button>
            ))}
          </div>
        )}

        {/* Code viewer or non-code notice */}
        <div style={{
          flex: 1, overflowY: 'auto', padding: '20px 24px',
          background: 'var(--void)', fontFamily: 'var(--mono)',
          fontSize: 11, lineHeight: 1.9, color: 'var(--text2)',
        }}>
          {isCodeArtifact ? (
            lines.map((line, i) => (
              <div key={i} className="code-line">
                <span className="ln">{String(i + 1).padStart(2, '0')}</span>
                <span className="lc">{line || '\u00A0'}</span>
              </div>
            ))
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 12, opacity: 0.6 }}>
              <div style={{ fontSize: 36 }}>
                {artifact.type === 'image' ? '🖼' : artifact.type === 'diagram' ? '◈' : artifact.type === 'design' ? '✦' : '📄'}
              </div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text3)', textAlign: 'center' }}>
                // {artifact.type.toUpperCase()} artifact — preview not available in browser<br />
                Download to open with the appropriate tool
              </div>
            </div>
          )}
        </div>

        {/* Remix bar */}
        <div style={{
          padding: '14px 20px', borderTop: '1px solid var(--border)',
          background: 'var(--panel)', flexShrink: 0,
          display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap',
        }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text3)' }}>// REMIX_AS</div>
          {isCodeArtifact && (
            <button className="artifact-remix-btn playground" onClick={remixToPlayground}>
              ▷ OPEN IN PLAYGROUND
            </button>
          )}
          <button className="artifact-remix-btn canvas" onClick={remixToCanvas}>
            ◻ IMPORT TO CANVAS
          </button>
          <button
            style={{
              marginLeft: 'auto', padding: '5px 14px', fontFamily: 'var(--mono)', fontSize: 11,
              fontWeight: 600, background: 'none', border: '1px solid var(--border2)',
              color: 'var(--text2)', cursor: 'pointer',
              clipPath: 'polygon(0 0,calc(100% - 6px) 0,100% 6px,100% 100%,0 100%)',
              transition: 'all 0.15s',
            }}
            onMouseOver={e => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--em)'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--em-dim)' }}
            onMouseOut={e => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--text2)'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border2)' }}
          >
            ⬇ DOWNLOAD
          </button>
        </div>
      </div>
    </>
  )
}
