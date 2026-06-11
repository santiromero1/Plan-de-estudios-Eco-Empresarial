/* storage.ts — Persistencia en localStorage + export/import JSON.
   Se guarda SOLO el estado mutable del usuario (estado, nota, ubicación,
   anual, nombre de electiva) keyeado por id, y se reconstruye sobre el plan
   oficial. Así, correcciones estructurales del plan (áreas, correlativas,
   nuevas materias) se aplican sin borrar el progreso del usuario. */

import type { Estado, Subject } from '../types';
import { freshPlan } from '../data/plan';

// v3: formato de estado-por-id (antes se guardaba el plan completo).
const STORAGE_KEY = 'planificador-ditella-v3';

interface UserState {
  estado: Estado;
  nota: number | null;
  term: string;
  anual: boolean;
  nombre?: string; // solo electivas (nombre editable)
}

/** Extrae el estado mutable de cada materia, keyeado por id. */
function extractState(subjects: Subject[]): Record<string, UserState> {
  const map: Record<string, UserState> = {};
  subjects.forEach((s) => {
    map[s.id] = {
      estado: s.estado,
      nota: s.nota ?? null,
      term: s.term,
      anual: !!s.anual,
      ...(s.esElectiva ? { nombre: s.nombre } : {}),
    };
  });
  return map;
}

/** Aplica el estado guardado sobre el plan oficial (por id). */
function applyState(fresh: Subject[], state: Record<string, UserState>): Subject[] {
  return fresh.map((s) => {
    const u = state[s.id];
    if (!u) return s;
    return {
      ...s,
      estado: u.estado,
      nota: u.nota,
      term: u.term ?? s.term,
      anual: u.anual,
      ...(s.esElectiva && u.nombre !== undefined ? { nombre: u.nombre } : {}),
    };
  });
}

export function loadPlan(): Subject[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const state = JSON.parse(raw);
      if (state && typeof state === 'object') return applyState(freshPlan(), state);
    }
  } catch {
    /* corrupto o vacío → plan oficial */
  }
  return freshPlan();
}

export function savePlan(subjects: Subject[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(extractState(subjects)));
  } catch {
    /* almacenamiento lleno o bloqueado: se ignora */
  }
}

/** Exporta el plan completo (autocontenido y legible) para backup. */
export function exportPlan(subjects: Subject[]): void {
  const blob = new Blob([JSON.stringify(subjects, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'mi-cursada.json';
  a.click();
  URL.revokeObjectURL(url);
}

/** Importa un backup (array de materias) y lo reproyecta sobre el plan oficial
    actual, conservando tu progreso aunque la estructura del plan haya cambiado. */
export function parseImported(text: string): Subject[] | null {
  try {
    const data = JSON.parse(text);
    if (Array.isArray(data) && data.every((s) => s && typeof s.id === 'string')) {
      return applyState(freshPlan(), extractState(data as Subject[]));
    }
  } catch {
    /* inválido */
  }
  return null;
}
