/* ============================================================
   economia.ts — Plan oficial de la Lic. en Economía (UTDT).
   Carrera de 4 años. Fuente: PDF oficial "Economía - Plan de Estudios".
   Áreas diseñadas para esta app (el material no trae subcategorías):
   Economía / Métodos Cuantitativos / Historia y Cs. Sociales /
   Negocios y Derecho / Electivas.
   Notas: el * (Micro/Macro recomiendan Matemática II) y el ** (varias
   materias recomiendan Economía Matemática II) se cargan como
   correlativas RECOMENDADAS (corrRec), no obligatorias.
   ============================================================ */

import type { AreaDef, CarreraPlan, Subject, Term } from '../types';

const areas: AreaDef[] = [
  { id: 'economia', label: 'Economía', color: '#e6007e', tint: '#fce4f0', tint2: '#f9d2e6' },
  { id: 'metodos', label: 'Métodos Cuantitativos', color: '#00a3c4', tint: '#dcf1f7', tint2: '#c5e8f1' },
  { id: 'historia', label: 'Historia y Cs. Sociales', color: '#6b2fb3', tint: '#ece4f8', tint2: '#dfd0f1' },
  { id: 'negocios', label: 'Negocios y Derecho', color: '#1fa97b', tint: '#e1f5ee', tint2: '#c9ebde' },
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
  { id: '1201', codigo: '1201', nombre: 'Matemática I', area: 'metodos', corr: [], term: '1-1', estado: 'pendiente' },
  { id: '1101', codigo: '1101', nombre: 'Economía I', area: 'economia', corr: [], term: '1-1', estado: 'pendiente' },
  { id: '1301', codigo: '1301', nombre: 'Contabilidad Básica', area: 'negocios', corr: [], term: '1-1', estado: 'pendiente' },
  { id: '1501', codigo: '1501', nombre: 'Instituciones Políticas y de Gobierno', area: 'historia', corr: [], term: '1-1', estado: 'pendiente' },
  { id: '9003', codigo: '9003', nombre: 'Comprensión de Textos y Escritura', area: 'historia', corr: [], term: '1-1', estado: 'pendiente' },

  // ---------- AÑO 1 · Semestre 2 ----------
  { id: '1102', codigo: '1102', nombre: 'Economía II', area: 'economia', corr: [], term: '1-2', estado: 'pendiente' },
  { id: '1001', codigo: '1001', nombre: 'Problemas Filosóficos', area: 'historia', corr: [], term: '1-2', estado: 'pendiente' },
  { id: '1202', codigo: '1202', nombre: 'Matemática II', area: 'metodos', corr: ['1201'], term: '1-2', estado: 'pendiente' },
  { id: '1401', codigo: '1401', nombre: 'Historia de Occidente a partir de la Modernidad', area: 'historia', corr: [], term: '1-2', estado: 'pendiente' },

  // ---------- AÑO 2 · Semestre 1 ----------
  { id: '2103', codigo: '2103', nombre: 'Microeconomía', area: 'economia', corr: ['1101'], corrRec: ['1202'], term: '2-1', estado: 'pendiente' },
  { id: '2203', codigo: '2203', nombre: 'Introducción a la Estadística', area: 'metodos', corr: ['1202'], term: '2-1', estado: 'pendiente' },
  { id: '2204', codigo: '2204', nombre: 'Economía Matemática', area: 'metodos', corr: ['1202'], term: '2-1', estado: 'pendiente' },
  { id: '2002', codigo: '2002', nombre: 'Introducción al Derecho', area: 'negocios', corr: [], term: '2-1', estado: 'pendiente' },

  // ---------- AÑO 2 · Semestre 2 ----------
  { id: '2104', codigo: '2104', nombre: 'Macroeconomía', area: 'economia', corr: ['1102'], corrRec: ['1202'], term: '2-2', estado: 'pendiente' },
  { id: '2205', codigo: '2205', nombre: 'Análisis Estadístico', area: 'metodos', corr: ['2203'], term: '2-2', estado: 'pendiente' },
  { id: '3107', codigo: '3107', nombre: 'Tópicos de Microeconomía', area: 'economia', corr: ['2103', '1202'], term: '2-2', estado: 'pendiente' },
  { id: '2106', codigo: '2106', nombre: 'Historia Económica Internacional', area: 'historia', corr: ['1101', '1102'], term: '2-2', estado: 'pendiente' },

  // ---------- AÑO 3 · Semestre 1 ----------
  { id: '3109', codigo: '3109', nombre: 'Comercio Internacional', area: 'economia', corr: ['2103'], term: '3-1', estado: 'pendiente' },
  { id: '3111', codigo: '3111', nombre: 'Historia del Pensamiento Económico', area: 'economia', corr: ['2103', '2104'], term: '3-1', estado: 'pendiente' },
  { id: '3206', codigo: '3206', nombre: 'Econometría', area: 'metodos', corr: ['2205'], term: '3-1', estado: 'pendiente' },
  { id: '4118', codigo: '4118', nombre: 'Economía Matemática II', area: 'metodos', corr: ['2204'], term: '3-1', estado: 'pendiente' },
  { id: '9004', codigo: '9004', nombre: 'Expresión Oral y Escrita', area: 'historia', corr: [], term: '3-1', estado: 'pendiente' },

  // ---------- AÑO 3 · Semestre 2 ----------
  { id: '4117', codigo: '4117', nombre: 'Organización Industrial', area: 'economia', corr: ['2103'], corrRec: ['4118'], term: '3-2', estado: 'pendiente' },
  { id: '3110', codigo: '3110', nombre: 'Riesgo, Incertidumbre y Finanzas', area: 'economia', corr: ['2103'], corrRec: ['4118'], term: '3-2', estado: 'pendiente' },
  { id: '3108', codigo: '3108', nombre: 'Tópicos de Macroeconomía', area: 'economia', corr: ['2204', '2104'], corrRec: ['4118'], term: '3-2', estado: 'pendiente' },
  { id: 'campo-1', codigo: null, nombre: '', area: 'electivas', corr: [], term: '3-2', estado: 'pendiente', esElectiva: true, slotLabel: 'Materia Electiva de Campo Menor' },

  // ---------- AÑO 4 · Semestre 1 ----------
  { id: '4115', codigo: '4115', nombre: 'Desarrollo Económico', area: 'economia', corr: ['2104', '2103'], corrRec: ['4118'], term: '4-1', estado: 'pendiente' },
  { id: '4113', codigo: '4113', nombre: 'Finanzas Públicas', area: 'economia', corr: ['2104', '2103'], corrRec: ['4118'], term: '4-1', estado: 'pendiente' },
  { id: '4116', codigo: '4116', nombre: 'Moneda y Bancos', area: 'economia', corr: ['2104', '2103'], corrRec: ['4118'], term: '4-1', estado: 'pendiente' },
  { id: 'campo-2', codigo: null, nombre: '', area: 'electivas', corr: [], term: '4-1', estado: 'pendiente', esElectiva: true, slotLabel: 'Materia Electiva de Campo Menor' },

  // ---------- AÑO 4 · Semestre 2 ----------
  { id: '4112', codigo: '4112', nombre: 'Economía Monetaria Internacional', area: 'economia', corr: ['2104', '2103'], corrRec: ['4118'], term: '4-2', estado: 'pendiente' },
  { id: '4155', codigo: '4155', nombre: 'Historia Económica Argentina', area: 'historia', corr: ['2104', '2103'], term: '4-2', estado: 'pendiente' },
  { id: '4136', codigo: '4136', nombre: 'Tópicos de Economía Aplicada', area: 'economia', corr: ['3206'], term: '4-2', estado: 'pendiente' },
  { id: 'campo-3', codigo: null, nombre: '', area: 'electivas', corr: [], term: '4-2', estado: 'pendiente', esElectiva: true, slotLabel: 'Materia Electiva de Campo Menor' },
  { id: 'seminario', codigo: null, nombre: 'Seminario de Graduación', area: 'historia', corr: [], term: '4-2', estado: 'pendiente' },
];

export const economia: CarreraPlan = {
  id: 'economia',
  label: 'Economía',
  notaAprobacion: 6,
  areas,
  terms,
  subjects,
};
