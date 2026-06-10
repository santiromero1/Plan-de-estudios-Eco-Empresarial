import { useEffect, useState } from 'react'
import type { Issue, Subject } from '../types'
import { AREAS } from '../lib/areas'

interface Props {
  subject: Subject
  issues: Issue[]
  byId: Record<string, Subject>
  onClose: () => void
  onChange: (patch: Partial<Subject>) => void
}

export default function SubjectModal({ subject, issues, byId, onClose, onChange }: Props) {
  const area = AREAS[subject.area]
  const [grade, setGrade] = useState(subject.grade != null ? String(subject.grade) : '')

  useEffect(() => {
    setGrade(subject.grade != null ? String(subject.grade) : '')
  }, [subject.id, subject.grade])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  function commitGrade(value: string) {
    setGrade(value)
    if (value.trim() === '') {
      onChange({ grade: null })
      return
    }
    const n = Number(value)
    if (!Number.isNaN(n) && n >= 1 && n <= 10) onChange({ grade: n })
  }

  const prereqs = subject.prereqs.map((id) => byId[id]).filter(Boolean)

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head" style={{ borderColor: area.color }}>
          <div>
            <span className="modal-code" style={{ color: area.color }}>
              {subject.code || 'Electiva'}
            </span>
            <h2 className="modal-title">{subject.name}</h2>
            <span className="modal-area" style={{ color: area.color }}>
              {area.label}
            </span>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Cerrar">
            ✕
          </button>
        </div>

        <div className="modal-section">
          <label className="field-label">Estado</label>
          <div className="seg">
            {(['pending', 'in_progress', 'approved'] as const).map((st) => (
              <button
                key={st}
                className={`seg-btn ${subject.status === st ? 'seg-active' : ''}`}
                onClick={() =>
                  onChange({ status: st, grade: st === 'approved' ? subject.grade : null })
                }
              >
                {st === 'pending' ? 'Pendiente' : st === 'in_progress' ? 'Cursando' : 'Aprobada'}
              </button>
            ))}
          </div>
        </div>

        {subject.status === 'approved' && (
          <div className="modal-section">
            <label className="field-label" htmlFor="grade">
              Nota (1 a 10)
            </label>
            <input
              id="grade"
              className="grade-input"
              type="number"
              min={1}
              max={10}
              step={0.01}
              inputMode="decimal"
              value={grade}
              onChange={(e) => commitGrade(e.target.value)}
              placeholder="Ej. 8"
            />
          </div>
        )}

        <div className="modal-section">
          <label className="field-label">Modalidad</label>
          <label className="check-row">
            <input
              type="checkbox"
              checked={subject.annual}
              onChange={(e) => onChange({ annual: e.target.checked })}
            />
            <span>
              Cursada <strong>anual</strong> (ocupa los dos cuatrimestres del año y libera
              correlativas recién a fin de año)
            </span>
          </label>
        </div>

        <div className="modal-section">
          <label className="field-label">Correlativas</label>
          {prereqs.length === 0 ? (
            <p className="muted">Sin correlativas.</p>
          ) : (
            <ul className="prereq-list">
              {prereqs.map((p) => {
                const issue = issues.find((i) => i.prereq.id === p.id)
                return (
                  <li key={p.id} className={issue ? 'prereq-bad' : 'prereq-ok'}>
                    <span>{p.code ? `${p.code} · ${p.name}` : p.name}</span>
                    <span className="prereq-tag">
                      {p.status === 'approved'
                        ? 'Aprobada'
                        : issue?.type === 'missing'
                          ? 'Sin planificar'
                          : issue?.type === 'late'
                            ? 'Se cursa tarde'
                            : 'OK'}
                    </span>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        {subject.year != null && (
          <div className="modal-section">
            <button className="ghost-btn" onClick={() => onChange({ year: null, sem: null })}>
              Mover a "Sin asignar" (EXTRA)
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
