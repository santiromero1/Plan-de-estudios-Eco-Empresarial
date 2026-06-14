/* ============================================================
   historia.ts — Plan oficial de la Lic. en Historia (UTDT).
   Carrera de 4 años. Fuente: PDF oficial "Historia - Plan de Estudios".
   Áreas diseñadas para esta app (el material no trae subcategorías):
   Historia Argentina y Latinoamericana / Historia Universal /
   Arte y Cultura / Teoría y Métodos / Electivas.
   Nota: en 1° S2 se cursa UNA de dos (Estadística 2209 o Matemática I
   1201) → modelado como slot con desplegable.
   ============================================================ */

import type { AreaDef, CarreraPlan, Subject, Term } from '../types';

const areas: AreaDef[] = [
  { id: 'arglat', label: 'Historia Argentina y Latinoamericana', color: '#e6007e', tint: '#fce4f0', tint2: '#f9d2e6' },
  { id: 'mundo', label: 'Historia Universal', color: '#6b2fb3', tint: '#ece4f8', tint2: '#dfd0f1' },
  { id: 'arte', label: 'Arte y Cultura', color: '#1fa97b', tint: '#e1f5ee', tint2: '#c9ebde' },
  { id: 'teoria', label: 'Teoría y Métodos', color: '#00a3c4', tint: '#dcf1f7', tint2: '#c5e8f1' },
  { id: 'electivas', label: 'Electivas', color: '#f5a623', tint: '#fcefd6', tint2: '#f8e3b8' },
];

const terms: Term[] = [
  { id: '1-1', anio: 1, semestre: 1, orden: 1, esExtra: false },
  { id: '1-2', anio: 1, semestre: 2, orden: 2, esExtra: false },
  { id: '2-1', anio: 2, semestre: 1, orden: 3, esExtra: false },
  { id: '2-2', anio: 2, semestre: 2, orden: 4, esExtra: false },
  { id: '3-1', anio: 3, semestre: 1, orden: 5, esExtra: false },
  { id: '3-2', anio: 3, semestre: 2, orden: 6, esExtra: false },
  { id: '4-1', anio: 4, semestre: 1, orden: 7, esExtra: false },
  { id: '4-2', anio: 4, semestre: 2, orden: 8, esExtra: false },
  { id: 'extra-1', anio: 9, semestre: 1, orden: 9, esExtra: true },
  { id: 'extra-2', anio: 9, semestre: 2, orden: 10, esExtra: true },
];

const subjects: Subject[] = [
  // ---------- AÑO 1 · Semestre 1 ----------
  { id: '1404', codigo: '1404', nombre: 'Historia y Literatura', area: 'arte', corr: [], term: '1-1', estado: 'pendiente' },
  { id: '1001', codigo: '1001', nombre: 'Problemas Filosóficos', area: 'teoria', corr: [], term: '1-1', estado: 'pendiente' },
  { id: '1502', codigo: '1502', nombre: 'Introducción a la Ciencia Política', area: 'teoria', corr: [], term: '1-1', estado: 'pendiente' },
  { id: '1101', codigo: '1101', nombre: 'Economía I', area: 'teoria', corr: [], term: '1-1', estado: 'pendiente' },
  { id: '1402', codigo: '1402', nombre: 'Teoría y Práctica de la Escritura', area: 'teoria', corr: [], term: '1-1', estado: 'pendiente' },

  // ---------- AÑO 1 · Semestre 2 ----------
  { id: '1407', codigo: '1407', nombre: 'Historia de Occidente hasta la Modernidad', area: 'mundo', corr: [], term: '1-2', estado: 'pendiente' },
  { id: '1004', codigo: '1004', nombre: 'Historia de las Ideas Políticas', area: 'teoria', corr: [], term: '1-2', estado: 'pendiente' },
  { id: '2409', codigo: '2409', nombre: 'Historia de América Latina en el Periodo Colonial', area: 'arglat', corr: [], term: '1-2', estado: 'pendiente' },
  { id: 'mate-estad', codigo: '2209/1201', nombre: '', area: 'teoria', corr: [], term: '1-2', estado: 'pendiente', esElectiva: true, slotLabel: 'Estadística o Matemática I (elegí una)', opciones: ['Estadística', 'Matemática I'] },

  // ---------- AÑO 2 · Semestre 1 ----------
  { id: '1405', codigo: '1405', nombre: 'Historia Argentina I', area: 'arglat', corr: [], term: '2-1', estado: 'pendiente' },
  { id: '2410', codigo: '2410', nombre: 'Historia de Europa I', area: 'mundo', corr: ['1407'], term: '2-1', estado: 'pendiente' },
  { id: '3405', codigo: '3405', nombre: 'Historia de América Latina en el siglo XIX', area: 'arglat', corr: ['2409'], term: '2-1', estado: 'pendiente' },
  { id: '2405', codigo: '2405', nombre: 'Historia del Arte', area: 'arte', corr: [], term: '2-1', estado: 'pendiente' },

  // ---------- AÑO 2 · Semestre 2 ----------
  { id: '3409', codigo: '3409', nombre: 'Historia Contemporánea de América Latina', area: 'arglat', corr: ['3405'], term: '2-2', estado: 'pendiente' },
  { id: '3413', codigo: '3413', nombre: 'Historia de Europa II', area: 'mundo', corr: ['2410'], term: '2-2', estado: 'pendiente' },
  { id: '2408', codigo: '2408', nombre: 'Historia de la Ciencia y de la Técnica', area: 'teoria', corr: [], term: '2-2', estado: 'pendiente' },
  { id: '2106', codigo: '2106', nombre: 'Historia Económica Internacional', area: 'mundo', corr: [], term: '2-2', estado: 'pendiente' },

  // ---------- AÑO 3 · Semestre 1 ----------
  { id: '3422', codigo: '3422', nombre: 'Historia Argentina II', area: 'arglat', corr: ['1405'], term: '3-1', estado: 'pendiente' },
  { id: '1403', codigo: '1403', nombre: 'Arte y Cultura de la Modernidad', area: 'arte', corr: [], term: '3-1', estado: 'pendiente' },
  { id: '4114', codigo: '4114', nombre: 'Historia Económica Argentina', area: 'arglat', corr: [], term: '3-1', estado: 'pendiente' },
  { id: '3916', codigo: '3916', nombre: 'Literatura Argentina', area: 'arte', corr: [], term: '3-1', estado: 'pendiente' },
  { id: '9004', codigo: '9004', nombre: 'Expresión Oral y Escrita', area: 'teoria', corr: [], term: '3-1', estado: 'pendiente' },

  // ---------- AÑO 3 · Semestre 2 ----------
  { id: '4419', codigo: '4419', nombre: 'Historia Argentina III (Problemas historiográficos)', area: 'arglat', corr: ['3422'], term: '3-2', estado: 'pendiente' },
  { id: '3416', codigo: '3416', nombre: 'Historia de Europa III', area: 'mundo', corr: ['3413'], term: '3-2', estado: 'pendiente' },
  { id: '4416', codigo: '4416', nombre: 'Historia del siglo XX', area: 'mundo', corr: [], term: '3-2', estado: 'pendiente' },
  { id: 'campo-1', codigo: null, nombre: '', area: 'electivas', corr: [], term: '3-2', estado: 'pendiente', esElectiva: true, slotLabel: 'Curso de Campo Menor' },

  // ---------- AÑO 4 · Semestre 1 ----------
  { id: '4401', codigo: '4401', nombre: 'Seminario de Investigación Histórica I', area: 'teoria', corr: [], term: '4-1', estado: 'pendiente' },
  { id: '4415', codigo: '4415', nombre: 'Historiografía', area: 'teoria', corr: [], term: '4-1', estado: 'pendiente' },
  { id: 'campo-2', codigo: null, nombre: '', area: 'electivas', corr: [], term: '4-1', estado: 'pendiente', esElectiva: true, slotLabel: 'Curso de Campo Menor' },
  { id: 'campo-3', codigo: null, nombre: '', area: 'electivas', corr: [], term: '4-1', estado: 'pendiente', esElectiva: true, slotLabel: 'Curso de Campo Menor' },

  // ---------- AÑO 4 · Semestre 2 ----------
  { id: '4412', codigo: '4412', nombre: 'Historia de los Estados Unidos', area: 'mundo', corr: [], term: '4-2', estado: 'pendiente' },
  { id: '4402', codigo: '4402', nombre: 'Seminario de Investigación en Historia II', area: 'teoria', corr: ['4401'], term: '4-2', estado: 'pendiente' },
  { id: '4535', codigo: '4535', nombre: 'Seminario sobre Ideas y Cultura en Argentina', area: 'arte', corr: [], term: '4-2', estado: 'pendiente' },
  { id: 'campo-4', codigo: null, nombre: '', area: 'electivas', corr: [], term: '4-2', estado: 'pendiente', esElectiva: true, slotLabel: 'Curso de Campo Menor' },
  { id: '5401', codigo: '5401', nombre: 'Seminario de Graduación', area: 'teoria', corr: [], term: '4-2', estado: 'pendiente' },
];

export const historia: CarreraPlan = {
  id: 'historia',
  label: 'Historia',
  notaAprobacion: 6,
  areas,
  terms,
  subjects,
};
