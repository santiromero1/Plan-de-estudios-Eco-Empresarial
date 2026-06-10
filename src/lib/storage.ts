import type { Subject } from '../types'
import { buildDefaultPlan } from '../data/plan'

const KEY = 'planificador-eco-empresarial:v1'

/** Carga el plan guardado y lo reconcilia con la definición oficial. */
export function loadPlan(): Subject[] {
  const defaults = buildDefaultPlan()
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return defaults
    const saved = JSON.parse(raw) as Subject[]
    const savedById = new Map(saved.map((s) => [s.id, s]))
    // Partimos de la definición oficial (datos estáticos siempre actualizados)
    // y aplicamos el estado guardado por el usuario (ubicación, nota, etc.).
    return defaults.map((d) => {
      const s = savedById.get(d.id)
      if (!s) return d
      return {
        ...d,
        year: s.year ?? null,
        sem: s.sem ?? null,
        annual: !!s.annual,
        status: s.status ?? 'pending',
        grade: s.grade ?? null,
      }
    })
  } catch {
    return defaults
  }
}

export function savePlan(subjects: Subject[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(subjects))
  } catch {
    /* almacenamiento no disponible; se ignora */
  }
}

export function clearPlan(): void {
  try {
    localStorage.removeItem(KEY)
  } catch {
    /* noop */
  }
}

export function exportPlan(subjects: Subject[]): void {
  const blob = new Blob([JSON.stringify(subjects, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `plan-economia-empresarial-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export function parseImported(text: string): Subject[] | null {
  try {
    const data = JSON.parse(text)
    if (!Array.isArray(data)) return null
    return data as Subject[]
  } catch {
    return null
  }
}
