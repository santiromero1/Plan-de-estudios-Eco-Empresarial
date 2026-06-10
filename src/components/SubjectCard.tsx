import type { Issue, Subject } from '../types'
import { AREAS } from '../lib/areas'

interface Props {
  subject: Subject
  issues: Issue[]
  onClick?: () => void
  dragging?: boolean
  compact?: boolean
}

const STATUS_LABEL: Record<Subject['status'], string> = {
  pending: 'Pendiente',
  in_progress: 'Cursando',
  approved: 'Aprobada',
}

export default function SubjectCard({ subject, issues, onClick, dragging, compact }: Props) {
  const area = AREAS[subject.area]
  const hasIssues = issues.length > 0
  const classes = [
    'card',
    `status-${subject.status}`,
    hasIssues ? 'card-alert' : '',
    dragging ? 'card-dragging' : '',
    compact ? 'card-compact' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div
      className={classes}
      onClick={onClick}
      style={{ background: area.bg, borderColor: hasIssues ? '#dc2626' : area.border }}
      title={hasIssues ? describeIssues(issues) : undefined}
    >
      <span className="card-stripe" style={{ background: area.color }} />
      <div className="card-body">
        <div className="card-top">
          <span className="card-code" style={{ color: area.color }}>
            {subject.code || 'ELEC'}
          </span>
          <div className="card-flags">
            {subject.annual && <span className="flag flag-annual">Anual</span>}
            {hasIssues && (
              <span className="flag flag-alert" aria-label="Correlativa pendiente">
                ⚠
              </span>
            )}
            {subject.status === 'approved' && subject.grade != null && (
              <span className="flag flag-grade">{subject.grade}</span>
            )}
          </div>
        </div>
        <div className="card-name">{subject.name}</div>
        {!compact && (
          <div className="card-foot">
            <span className={`status-dot dot-${subject.status}`} />
            <span className="status-text">{STATUS_LABEL[subject.status]}</span>
          </div>
        )}
      </div>
    </div>
  )
}

function describeIssues(issues: Issue[]): string {
  return issues
    .map((i) =>
      i.type === 'missing'
        ? `Falta cursar la correlativa ${corrLabel(i.prereq)}`
        : `${corrLabel(i.prereq)} no termina antes de que empiece esta materia`,
    )
    .join('\n')
}

function corrLabel(s: Subject): string {
  return s.code ? `${s.code} · ${s.name}` : s.name
}
