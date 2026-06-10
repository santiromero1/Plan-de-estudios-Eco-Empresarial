import type { Issue, Subject } from '../types'

/** índice lineal del cuatrimestre: Año1-C1 = 1 ... Año4-C2 = 8 */
export function cuatriIndex(year: number, sem: number): number {
  return (year - 1) * 2 + sem
}

/**
 * Cuatrimestre en el que la materia queda EFECTIVAMENTE aprobada/disponible como
 * correlativa. Una materia anual recién "libera" a fin de año (segundo cuatrimestre).
 */
export function completionIndex(s: Subject): number | null {
  if (s.year == null || s.sem == null) return null
  if (s.annual) return (s.year - 1) * 2 + 2
  return cuatriIndex(s.year, s.sem)
}

/** cuatrimestre en el que la materia COMIENZA a cursarse */
export function startIndex(s: Subject): number | null {
  if (s.year == null || s.sem == null) return null
  if (s.annual) return cuatriIndex(s.year, 1)
  return cuatriIndex(s.year, s.sem)
}

/**
 * Devuelve los problemas de correlatividad de una materia según su ubicación actual:
 *  - `missing`: la correlativa no está aprobada ni planificada en ningún cuatrimestre.
 *  - `late`: la correlativa está planificada pero NO termina antes de que esta empiece.
 * Las materias aprobadas o sin asignar (EXTRA) no generan alertas.
 */
export function getIssues(s: Subject, byId: Record<string, Subject>): Issue[] {
  if (s.year == null || s.sem == null) return []
  if (s.status === 'approved') return []
  const start = startIndex(s)
  if (start == null) return []

  const issues: Issue[] = []
  for (const pid of s.prereqs) {
    const p = byId[pid]
    if (!p) continue
    if (p.status === 'approved') continue
    const pc = completionIndex(p)
    if (pc == null) {
      issues.push({ type: 'missing', prereq: p })
    } else if (pc >= start) {
      issues.push({ type: 'late', prereq: p })
    }
  }
  return issues
}

export function indexById(subjects: Subject[]): Record<string, Subject> {
  const map: Record<string, Subject> = {}
  for (const s of subjects) map[s.id] = s
  return map
}

export interface AverageResult {
  avg: number | null
  count: number
  approved: number
}

/** Promedio simple de las materias aprobadas con nota cargada. */
export function computeAverage(subjects: Subject[]): AverageResult {
  const approved = subjects.filter((s) => s.status === 'approved').length
  const graded = subjects.filter((s) => s.status === 'approved' && s.grade != null)
  if (graded.length === 0) return { avg: null, count: 0, approved }
  const sum = graded.reduce((a, s) => a + (s.grade as number), 0)
  return { avg: sum / graded.length, count: graded.length, approved }
}
