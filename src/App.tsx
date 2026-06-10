import { useEffect, useMemo, useRef, useState } from 'react'
import type { Subject } from './types'
import { loadPlan, savePlan, clearPlan, exportPlan, parseImported } from './lib/storage'
import { buildDefaultPlan } from './data/plan'
import { getIssues, indexById, computeAverage } from './lib/validation'
import { AREA_LIST } from './lib/areas'
import GridView from './components/GridView'
import TimelineView from './components/TimelineView'
import SubjectModal from './components/SubjectModal'

type View = 'grid' | 'timeline'

export default function App() {
  const [subjects, setSubjects] = useState<Subject[]>(() => loadPlan())
  const [view, setView] = useState<View>('grid')
  const [openId, setOpenId] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    savePlan(subjects)
  }, [subjects])

  const byId = useMemo(() => indexById(subjects), [subjects])

  const issuesById = useMemo(() => {
    const map: Record<string, ReturnType<typeof getIssues>> = {}
    for (const s of subjects) map[s.id] = getIssues(s, byId)
    return map
  }, [subjects, byId])

  const totalIssues = useMemo(
    () => Object.values(issuesById).reduce((a, list) => a + list.length, 0),
    [issuesById],
  )

  const { avg, count, approved } = useMemo(() => computeAverage(subjects), [subjects])

  function patchSubject(id: string, patch: Partial<Subject>) {
    setSubjects((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)))
  }

  function moveSubject(id: string, year: number | null, sem: 1 | 2 | null) {
    patchSubject(id, { year, sem })
  }

  function onImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const parsed = parseImported(String(reader.result))
      if (parsed) {
        // reconciliamos con el plan oficial para no perder datos estáticos
        const incoming = new Map(parsed.map((s) => [s.id, s]))
        setSubjects(
          buildDefaultPlan().map((d) => {
            const s = incoming.get(d.id)
            return s
              ? {
                  ...d,
                  year: s.year ?? null,
                  sem: s.sem ?? null,
                  annual: !!s.annual,
                  status: s.status ?? 'pending',
                  grade: s.grade ?? null,
                }
              : d
          }),
        )
      } else {
        alert('No pude leer el archivo. ¿Es un export válido?')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  function resetAll() {
    if (confirm('¿Restablecer el plan a la versión oficial 2021? Se pierden tus cambios.')) {
      clearPlan()
      setSubjects(buildDefaultPlan())
    }
  }

  const openSubject = openId ? byId[openId] : null

  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar-left">
          <span className="brand-mark">UTDT</span>
          <div>
            <h1 className="app-title">Planificador de Cursada</h1>
            <p className="app-sub">Lic. en Economía Empresarial · Plan 2021</p>
          </div>
        </div>

        <div className="stats">
          <div className="stat">
            <span className="stat-value">{avg != null ? avg.toFixed(2) : '—'}</span>
            <span className="stat-label">Promedio{count ? ` (${count})` : ''}</span>
          </div>
          <div className="stat">
            <span className="stat-value">
              {approved}/{subjects.length}
            </span>
            <span className="stat-label">Aprobadas</span>
          </div>
          <div className={`stat ${totalIssues ? 'stat-alert' : ''}`}>
            <span className="stat-value">{totalIssues}</span>
            <span className="stat-label">Alertas</span>
          </div>
        </div>
      </header>

      <div className="toolbar">
        <div className="view-toggle">
          <button
            className={view === 'grid' ? 'vt-active' : ''}
            onClick={() => setView('grid')}
          >
            Vista de grilla
          </button>
          <button
            className={view === 'timeline' ? 'vt-active' : ''}
            onClick={() => setView('timeline')}
          >
            Timeline correlativas
          </button>
        </div>

        <div className="legend">
          {AREA_LIST.map((a) => (
            <span key={a.id} className="legend-item">
              <span className="legend-dot" style={{ background: a.color }} />
              {a.short}
            </span>
          ))}
        </div>

        <div className="actions">
          <button className="ghost-btn" onClick={() => exportPlan(subjects)}>
            Exportar
          </button>
          <button className="ghost-btn" onClick={() => fileRef.current?.click()}>
            Importar
          </button>
          <button className="ghost-btn danger" onClick={resetAll}>
            Reset
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            hidden
            onChange={onImportFile}
          />
        </div>
      </div>

      <main className="content">
        {view === 'grid' ? (
          <GridView
            subjects={subjects}
            issuesById={issuesById}
            onOpen={(s) => setOpenId(s.id)}
            onMove={moveSubject}
          />
        ) : (
          <TimelineView subjects={subjects} issuesById={issuesById} onOpen={(s) => setOpenId(s.id)} />
        )}
      </main>

      {openSubject && (
        <SubjectModal
          subject={openSubject}
          issues={issuesById[openSubject.id] ?? []}
          byId={byId}
          onClose={() => setOpenId(null)}
          onChange={(patch) => patchSubject(openSubject.id, patch)}
        />
      )}
    </div>
  )
}
