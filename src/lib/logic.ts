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

function anioDe(subject: Subject, terms: Term[]): number {
  return termById(terms, subject.term)?.anio ?? Infinity;
}

/** Gate de ciclo: materias de años <= reqHasta que faltan completar/aprobar
    antes de que esta materia empiece. Vacío si no hay reqHasta o está cumplido. */
export function gateIncumplido(
  subject: Subject,
  all: Subject[],
  terms: Term[],
): Subject[] {
  const req = subject.reqHasta;
  if (!req) return [];
  const inicio = ordenInicio(subject, terms);
  return all.filter((c) => {
    if (c.id === subject.id) return false;
    if (c.esElectiva) return false; // los slots de electiva no se "aprueban"
    if (anioDe(c, terms) > req) return false; // sólo años <= reqHasta (excluye extra)
    if (c.estado === 'aprobada') return false; // aprobada cuenta siempre
    return !(ordenCompletado(c, terms) < inicio); // debe completar ANTES
  });
}

/** Todas las faltantes (correlativas materia-a-materia + gate de ciclo). */
export function incumplidas(
  subject: Subject,
  byId: Record<string, Subject>,
  all: Subject[],
  terms: Term[],
): Subject[] {
  const corr = correlativasIncumplidas(subject, byId, terms);
  const gate = gateIncumplido(subject, all, terms);
  const vistos = new Set(corr.map((s) => s.id));
  return [...corr, ...gate.filter((g) => !vistos.has(g.id))];
}

/** ¿La materia tiene conflicto? (correlativas o gate; solo aún no completadas) */
export function tieneConflicto(
  subject: Subject,
  byId: Record<string, Subject>,
  all: Subject[],
  terms: Term[],
): boolean {
  if (subject.estado === 'desinscripta' || subject.estado === 'aprobada') return false;
  return incumplidas(subject, byId, all, terms).length > 0;
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
    .filter((s) => tieneConflicto(s, byId, subjects, terms))
    .map((s) => ({ subject: s, faltan: incumplidas(s, byId, subjects, terms) }));

  return {
    promedio,
    aprobadas: aprobadas.length,
    total,
    restantes: total - aprobadas.length,
    alertas,
  };
}
