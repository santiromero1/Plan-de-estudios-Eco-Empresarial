/* logic.js — funciones puras de validación (correlativas, alertas, promedio)
   Espejan las reglas del PRD §2.3 y §5. Sin React: fácil de portar a TS. */

const NOTA_APROBACION_L = (window.PLAN && window.PLAN.NOTA_APROBACION) || 6;

function termById(terms, id) { return terms.find(t => t.id === id) || null; }

// Orden lineal en que una materia EMPIEZA y se COMPLETA según su ubicación + duración
function ordenInicio(subject, terms) {
  const t = termById(terms, subject.term);
  if (!t) return Infinity;                 // sin ubicar
  if (subject.anual) return t.orden - (t.semestre === 2 ? 1 : 0); // empieza en S1 del año
  return t.orden;
}
function ordenCompletado(subject, terms) {
  const t = termById(terms, subject.term);
  if (!t) return Infinity;
  if (subject.anual) return t.orden + (t.semestre === 1 ? 1 : 0); // completa fin de S2
  return t.orden;
}

// Para una materia, devuelve la lista de correlativas INCUMPLIDAS (objetos materia)
function correlativasIncumplidas(subject, subjectsById, terms) {
  if (!subject.corr || !subject.corr.length) return [];
  const startM = ordenInicio(subject, terms);
  return subject.corr
    .map(cid => subjectsById[cid])
    .filter(Boolean)
    .filter(c => {
      if (c.estado === 'aprobada') return false;          // aprobada cuenta siempre
      return !(ordenCompletado(c, terms) < startM);       // debe completar ANTES
    });
}

// ¿La materia tiene conflicto? (solo materias aún no completadas)
function tieneConflicto(subject, subjectsById, terms) {
  if (subject.estado === 'desinscripta' || subject.estado === 'aprobada') return false;
  return correlativasIncumplidas(subject, subjectsById, terms).length > 0;
}

function buildIndex(subjects) {
  const byId = {};
  subjects.forEach(s => { byId[s.id] = s; });
  return byId;
}

// Resumen del plan: promedio, aprobadas, total, alertas
function planSummary(subjects, terms) {
  const byId = buildIndex(subjects);
  const cuentan = subjects.filter(s => !s.esElectiva || s.nombre); // electivas vacías no cuentan al total
  const total = cuentan.length;
  const aprobadas = subjects.filter(s => s.estado === 'aprobada' && s.nota != null && s.nota >= NOTA_APROBACION_L);
  const conNota = aprobadas.filter(s => s.nota != null);
  const promedio = conNota.length
    ? conNota.reduce((a, s) => a + s.nota, 0) / conNota.length
    : null;
  const alertas = subjects
    .filter(s => tieneConflicto(s, byId, terms))
    .map(s => ({
      subject: s,
      faltan: correlativasIncumplidas(s, byId, terms),
    }));
  return {
    promedio,
    aprobadas: aprobadas.length,
    total,
    restantes: total - aprobadas.length,
    alertas,
  };
}

window.Logic = {
  NOTA_APROBACION: NOTA_APROBACION_L, ordenInicio, ordenCompletado,
  correlativasIncumplidas, tieneConflicto, buildIndex, planSummary, termById,
};
