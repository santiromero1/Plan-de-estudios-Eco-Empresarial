/* board.ts — Reordenamiento puro del tablero (drag & drop).
   Funciona para Grilla y Timeline: el orden DENTRO de un cuatrimestre lo
   determina la posición en el array; cambiar de cuatrimestre = cambiar `term`. */

import type { Subject } from '../types';
import { TERMS } from '../data/plan';

/** Quita el sufijo ':end' que usan los segmentos espejo de materias anuales. */
export function realId(id: string): string {
  return id.split(':')[0];
}

const TERM_IDS = new Set(TERMS.map((t) => t.id));

/**
 * Mueve/reordena `activeId` según dónde se soltó (`overId`).
 * - `overId` es el id de otra materia → se inserta antes de ella (mismo o nuevo term).
 * - `overId` es el id de un cuatrimestre (columna vacía / zona libre) → se manda al final de ese term.
 */
export function moveOrReorder(
  subjects: Subject[],
  activeRawId: string,
  overRawId: string,
): Subject[] {
  const activeId = realId(activeRawId);
  const overId = realId(overRawId);
  if (activeId === overId) return subjects;

  const active = subjects.find((s) => s.id === activeId);
  if (!active) return subjects;

  const overIsTerm = TERM_IDS.has(overId);
  let targetTerm: string;
  let insertBeforeId: string | null = null;

  if (overIsTerm) {
    targetTerm = overId;
  } else {
    const over = subjects.find((s) => s.id === overId);
    if (!over) return subjects;
    targetTerm = over.term;
    insertBeforeId = overId;
  }

  const arr = subjects.filter((s) => s.id !== activeId);
  const moved: Subject = { ...active, term: targetTerm };

  if (insertBeforeId) {
    const idx = arr.findIndex((s) => s.id === insertBeforeId);
    arr.splice(idx, 0, moved);
  } else {
    // Columna/zona libre: al final del grupo de ese cuatrimestre.
    let lastIdx = -1;
    arr.forEach((s, i) => {
      if (s.term === targetTerm) lastIdx = i;
    });
    if (lastIdx >= 0) arr.splice(lastIdx + 1, 0, moved);
    else arr.push(moved);
  }
  return arr;
}
