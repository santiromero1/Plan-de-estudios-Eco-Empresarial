/* storage.ts — Persistencia del plan en Supabase + caché local (offline).
   Se guarda el estado mutable de cada materia (estado, nota, ubicación, anual,
   nombre de electiva) keyeado por id, MÁS el orden de los ids (porque el orden
   dentro de un cuatrimestre lo define la posición en el array). Todo se
   reconstruye sobre el plan oficial, así correcciones estructurales del plan
   (áreas, correlativas, nuevas materias) se aplican sin borrar el progreso.

   Estrategia: la nube (tabla `plans`) es la fuente de verdad. localStorage
   funciona como caché instantánea y respaldo offline: se escribe al toque en
   cada cambio y la nube se sincroniza con debounce desde App.tsx. */

import type { Estado, Subject } from '../types';
import { freshPlan } from '../data/plan';
import { supabase } from './supabase';

interface UserState {
  estado: Estado;
  nota: number | null;
  term: string;
  anual: boolean;
  nombre?: string; // solo electivas (nombre editable)
}

type StateMap = Record<string, UserState>;

/** Forma serializada del plan: estado por id + orden de los ids. */
interface PlanPayload {
  order: string[];
  state: StateMap;
}

// Clave legacy: antes se guardaba todo en este único item (sin usuarios).
const LEGACY_KEY = 'planificador-ditella-v3';
// Caché por usuario+carrera.
const cacheKey = (userId: string, carrera: string) => `planificador-cache-${userId}-${carrera}`;

/** Extrae el estado mutable de cada materia, keyeado por id. */
function extractState(subjects: Subject[]): StateMap {
  const map: StateMap = {};
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
function applyState(fresh: Subject[], state: StateMap): Subject[] {
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

/** Reordena el array según el orden guardado de ids. Las materias que no estén
    en `order` (ej. nuevas del plan oficial) quedan al final, en su orden oficial. */
function applyOrder(subjects: Subject[], order: string[]): Subject[] {
  if (!order || order.length === 0) return subjects;
  const pos = new Map(order.map((id, i) => [id, i]));
  return subjects
    .map((s, i) => ({ s, i }))
    .sort((a, b) => {
      const pa = pos.has(a.s.id) ? pos.get(a.s.id)! : order.length + a.i;
      const pb = pos.has(b.s.id) ? pos.get(b.s.id)! : order.length + b.i;
      return pa - pb;
    })
    .map((x) => x.s);
}

/** Serializa el plan del usuario (estado + orden). */
function serialize(subjects: Subject[]): PlanPayload {
  return { order: subjects.map((s) => s.id), state: extractState(subjects) };
}

/** Normaliza un payload guardado (acepta el formato nuevo con `order` y el
    legacy que era el mapa de estado pelado). */
function normalize(raw: unknown): { state: StateMap; order: string[] } {
  if (raw && typeof raw === 'object') {
    const obj = raw as Record<string, unknown>;
    if (obj.state && typeof obj.state === 'object') {
      return {
        state: obj.state as StateMap,
        order: Array.isArray(obj.order) ? (obj.order as string[]) : [],
      };
    }
    // legacy: el objeto ES el mapa de estado.
    return { state: raw as StateMap, order: [] };
  }
  return { state: {}, order: [] };
}

/** Reconstruye el plan completo a partir de un payload guardado. */
function reconstruct(raw: unknown, carrera: string, orientacion?: string | null): Subject[] {
  const { state, order } = normalize(raw);
  return applyOrder(applyState(freshPlan(carrera, orientacion), state), order);
}

function readLocalPayload(userId: string, carrera: string): unknown {
  try {
    const raw =
      localStorage.getItem(cacheKey(userId, carrera)) ?? localStorage.getItem(LEGACY_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/** Escribe la caché local al instante (sin esperar a la nube). */
export function saveLocalCache(userId: string, carrera: string, subjects: Subject[]): void {
  try {
    localStorage.setItem(cacheKey(userId, carrera), JSON.stringify(serialize(subjects)));
  } catch {
    /* almacenamiento lleno o bloqueado: se ignora */
  }
}

/** Carga el plan del usuario: primero intenta la nube; si no hay fila, usa la
    caché/legacy local y la sube (migración automática). Devuelve el plan
    reconstruido sobre el oficial. */
export async function loadPlan(
  userId: string,
  carrera: string,
  orientacion?: string | null,
): Promise<Subject[]> {
  const { data, error } = await supabase
    .from('plans')
    .select('data')
    .eq('user_id', userId)
    .eq('carrera', carrera)
    .maybeSingle<{ data: unknown }>();

  const cloud = !error && data?.data ? normalize(data.data) : null;
  if (cloud && Object.keys(cloud.state).length > 0) {
    const subjects = reconstruct(data!.data, carrera, orientacion);
    saveLocalCache(userId, carrera, subjects);
    return subjects;
  }

  // No hay nada en la nube: ¿tenemos progreso local para migrar?
  const localRaw = readLocalPayload(userId, carrera);
  const local = localRaw ? normalize(localRaw) : null;
  if (local && Object.keys(local.state).length > 0) {
    const subjects = reconstruct(localRaw, carrera, orientacion);
    // Migración: subimos lo local a la nube (best-effort, no bloquea).
    void syncPlanToCloud(userId, carrera, subjects);
    return subjects;
  }

  return freshPlan(carrera, orientacion);
}

/** Sincroniza el plan a la nube (upsert por user_id+carrera). */
export async function syncPlanToCloud(
  userId: string,
  carrera: string,
  subjects: Subject[],
): Promise<{ ok: boolean; error?: string }> {
  const { error } = await supabase
    .from('plans')
    .upsert(
      { user_id: userId, carrera, data: serialize(subjects) },
      { onConflict: 'user_id,carrera' },
    );
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

/** Exporta el plan completo (autocontenido y legible) para backup. */
export function exportPlan(subjects: Subject[]): void {
  const blob = new Blob([JSON.stringify(subjects, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'mi-cursada.json';
  a.click();
  URL.revokeObjectURL(url);
}

/** Importa un backup (array de materias) y lo reproyecta sobre el plan oficial
    actual, conservando tu progreso y el orden aunque la estructura haya cambiado. */
export function parseImported(
  text: string,
  carrera: string,
  orientacion?: string | null,
): Subject[] | null {
  try {
    const data = JSON.parse(text);
    if (Array.isArray(data) && data.every((s) => s && typeof s.id === 'string')) {
      const arr = data as Subject[];
      return applyOrder(
        applyState(freshPlan(carrera, orientacion), extractState(arr)),
        arr.map((s) => s.id),
      );
    }
  } catch {
    /* inválido */
  }
  return null;
}
