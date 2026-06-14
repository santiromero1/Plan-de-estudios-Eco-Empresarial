/* ============================================================
   plan.ts — Registro de planes por carrera + helpers.
   Cada carrera vive en su propio archivo y se registra acá.
   La grilla de años/semestres se DERIVA de los `terms` de cada
   carrera, así soporta carreras de distinta duración sin tocar
   las vistas.
   ============================================================ */

import type { CarreraPlan, Subject, Term } from '../types';
import { economiaEmpresarial } from './economia-empresarial';
import { tecnologiaDigital } from './tecnologia-digital';
import { abogacia } from './abogacia';
import { adminEmpresas } from './admin-empresas';
import { arquitectura } from './arquitectura';
import { cienciaPolitica } from './ciencia-politica';
import { cienciasComportamiento } from './ciencias-comportamiento';

/** Registro de planes disponibles, keyeado por id de carrera. */
export const PLANS: Record<string, CarreraPlan> = {
  [economiaEmpresarial.id]: economiaEmpresarial,
  [tecnologiaDigital.id]: tecnologiaDigital,
  [abogacia.id]: abogacia,
  [adminEmpresas.id]: adminEmpresas,
  [arquitectura.id]: arquitectura,
  [cienciaPolitica.id]: cienciaPolitica,
  [cienciasComportamiento.id]: cienciasComportamiento,
  // Agregar acá las demás carreras a medida que se transcriben:
};

export function getPlan(carreraId: string): CarreraPlan | undefined {
  return PLANS[carreraId];
}

/** ¿Existe un plan desarrollado para esta carrera? */
export function hasPlan(carreraId: string): boolean {
  return carreraId in PLANS;
}

/** Resuelve el plan EFECTIVO para una carrera + orientación: si la carrera
    tiene orientaciones, suma las materias de la elegida al tronco común. */
export function resolvePlan(
  carreraId: string,
  orientacionId?: string | null,
): CarreraPlan | undefined {
  const base = PLANS[carreraId];
  if (!base) return undefined;
  if (!base.orientaciones || base.orientaciones.length === 0) return base;
  // Si no eligió (o no matchea), por defecto se muestra la primera orientación.
  const orient = base.orientaciones.find((o) => o.id === orientacionId) ?? base.orientaciones[0];
  return {
    ...base,
    label: `${base.label} · ${orient.label}`,
    subjects: [...base.subjects, ...orient.subjects],
  };
}

/** ¿La carrera tiene orientaciones a elegir? */
export function tieneOrientaciones(carreraId: string): boolean {
  return (PLANS[carreraId]?.orientaciones?.length ?? 0) > 0;
}

/** Copia profunda de las materias del plan oficial (estado inicial / reset). */
export function freshPlan(carreraId: string, orientacionId?: string | null): Subject[] {
  const plan = resolvePlan(carreraId, orientacionId);
  if (!plan) return [];
  return plan.subjects.map((s) => ({ ...s, corr: [...s.corr] }));
}

// ============================================================
// Helpers de grilla (derivados de los terms de cada carrera)
// ============================================================

const ORDINAL: Record<number, string> = {
  1: '1.er',
  2: '2.º',
  3: '3.er',
  4: '4.º',
  5: '5.º',
  6: '6.º',
  7: '7.º',
};

export function ordinalAnio(anio: number): string {
  return ORDINAL[anio] ?? `${anio}.º`;
}

/** Bloque de un año para la vista Grilla (con sus columnas/semestres). */
export interface YearBlock {
  key: string;
  label: string;
  termIds: string[]; // columnas del año (semestres), en orden
  esExtra: boolean;
}

/** Agrupa los terms en bloques de año para la Grilla. Los extra van juntos
    en un único bloque "Extra" al final. */
export function yearBlocksOf(terms: Term[]): YearBlock[] {
  const regulares = terms.filter((t) => !t.esExtra);
  const extra = terms.filter((t) => t.esExtra);

  const porAnio = new Map<number, Term[]>();
  regulares.forEach((t) => {
    const arr = porAnio.get(t.anio) ?? [];
    arr.push(t);
    porAnio.set(t.anio, arr);
  });

  const blocks: YearBlock[] = [...porAnio.keys()]
    .sort((a, b) => a - b)
    .map((anio) => {
      const ts = (porAnio.get(anio) ?? []).sort((a, b) => a.semestre - b.semestre);
      return {
        key: `anio-${anio}`,
        label: `${ordinalAnio(anio)} Año`,
        termIds: ts.map((t) => t.id),
        esExtra: false,
      };
    });

  if (extra.length) {
    blocks.push({
      key: 'extra',
      label: 'Extra',
      termIds: extra.sort((a, b) => a.orden - b.orden).map((t) => t.id),
      esExtra: true,
    });
  }
  return blocks;
}

/** Columna de la vista Timeline. Los terms extra se agrupan en una sola. */
export interface TLCol {
  id: string; // id lógico de la columna ('extra' para el bloque agrupado)
  dropId: string; // term al que se suelta
  year: string;
  sem: string;
  extra: boolean;
}

export function timelineColsOf(terms: Term[]): TLCol[] {
  const regulares = terms.filter((t) => !t.esExtra).sort((a, b) => a.orden - b.orden);
  const extra = terms.filter((t) => t.esExtra).sort((a, b) => a.orden - b.orden);

  const cols: TLCol[] = regulares.map((t) => ({
    id: t.id,
    dropId: t.id,
    year: `${ordinalAnio(t.anio)} Año`,
    sem: `Semestre ${t.semestre}`,
    extra: false,
  }));

  if (extra.length) {
    cols.push({
      id: 'extra',
      dropId: extra[0].id,
      year: 'Extra',
      sem: 'Recursadas',
      extra: true,
    });
  }
  return cols;
}
