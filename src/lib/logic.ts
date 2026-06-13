/* logic.ts — Validación pura de correlativas, alertas y promedio.
   Espeja PRD §2.3 y §5. Sin React: testeable y portable. */

import type { PlanSummary, Subject, Term } from '../types';

export function buildIndex(subjects: Subject[]): Record<string, Subject> {
  const byId: Record<string, Subject> = {};
  subjects.forEach((s) => (byId[s.id] = s));
  return byId;
}

function termById(terms: Term[], id: string): Term | null {
  return terms.find((t) => t.id === id) ?? null;
}

/** Orden lineal en que una materia EMPIEZA según ubicación + duración. */
export function ordenInicio(subject: Subject, terms: Term[]): number {
  const t = termById(terms, subject.term);
  if (!t) return Infinity;
  // Anual ubicada en S2 empieza en el S1 del mismo año (orden - 1).
  if (subject.anual) return t.orden - (t.semestre === 2 ? 1 : 0);
  return t.orden;
}

/** Orden lineal en que una materia se COMPLETA. */
export function ordenCompletado(subject: Subject, terms: Term[]): number {
  const t = termById(terms, subject.term);
  if (!t) return Infinity;
  // Anual ubicada en S1 se completa al final del S2 (orden + 1).
  if (subject.anual) return t.orden + (t.semestre === 1 ? 1 : 0);
  return t.orden;
}

/** Correlativas INCUMPLIDAS de una materia (lista de materias faltantes). */
export function correlativasIncumplidas(
  subject: Subject,
  byId: Record<string, Subject>,
  terms: Term[],
): Subject[] {
  if (!subject.corr || subject.corr.length === 0) return [];
  const inicio = ordenInicio(subject, terms);
  return subject.corr
    .map((cid) => byId[cid])
    .filter((c): c is Subject => Boolean(c))
    .filter((c) => {
      if (c.estado === 'aprobada') return false; // aprobada cuenta siempre
      return !(ordenCompletado(c, terms) < inicio); // debe completar ANTES
    });
}

/** ¿La materia tiene conflicto de correlativa? (solo aún no completadas) */
export function tieneConflicto(
  subject: Subject,
  byId: Record<string, Subject>,
  terms: Term[],
): boolean {
  if (subject.estado === 'desinscripta' || subject.estado === 'aprobada') return false;
  return correlativasIncumplidas(subject, byId, terms).length > 0;
}

/** Resumen del plan: promedio, aprobadas, total, alertas. */
export function planSummary(
  subjects: Subject[],
  terms: Term[],
  notaAprobacion: number,
): PlanSummary {
  const byId = buildIndex(subjects);

  // Electivas sin nombre no cuentan al total.
  const cuentan = subjects.filter((s) => !s.esElectiva || s.nombre);
  const total = cuentan.length;

  const aprobadas = subjects.filter(
    (s) => s.estado === 'aprobada' && s.nota != null && s.nota >= notaAprobacion,
  );
  const promedio = aprobadas.length
    ? aprobadas.reduce((acc, s) => acc + (s.nota as number), 0) / aprobadas.length
    : null;

  const alertas = subjects
    .filter((s) => tieneConflicto(s, byId, terms))
    .map((s) => ({ subject: s, faltan: correlativasIncumplidas(s, byId, terms) }));

  return {
    promedio,
    aprobadas: aprobadas.length,
    total,
    restantes: total - aprobadas.length,
    alertas,
  };
}
