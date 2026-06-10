export type AreaId = 'negocios' | 'economia' | 'datos' | 'electivas'

export type Status = 'pending' | 'in_progress' | 'approved'

export interface Subject {
  /** id estable (= código del plan cuando existe, o un id sintético para electivas/campo menor) */
  id: string
  /** código oficial del plan; vacío para electivas sin código */
  code: string
  name: string
  area: AreaId
  /** ids de las materias que deben estar aprobadas/cursadas antes */
  prereqs: string[]
  /** año de cursada planificado (1..4) o null si está sin asignar (EXTRA) */
  year: number | null
  /** cuatrimestre dentro del año (1 o 2) o null si está sin asignar */
  sem: 1 | 2 | null
  /** si se cursa anualmente (ocupa los dos cuatrimestres del año) */
  annual: boolean
  status: Status
  /** nota (1..10) cuando status === 'approved' */
  grade: number | null
}

export interface Issue {
  type: 'missing' | 'late'
  prereq: Subject
}
