/* ============================================================
   admin-empresas.ts — Plan oficial de la Lic. en Administración
   de Empresas (UTDT), Plan 2021.
   Fuente: PDF oficial "Administración de Empresas (Ingresantes 2021)".
   Áreas según la imagen oficial: Negocios / Economía y Cs. Sociales /
   Datos y Análisis Cuantitativo / Electivas (mismas que Eco Empresarial).
   Nota: el * de Micro/Macro = "recomendable haber aprobado Matemática II"
   → se carga como correlativa recomendada (corrRec), no obligatoria.
   ============================================================ */

import type { AreaDef, CarreraPlan, Subject, Term } from '../types';

const areas: AreaDef[] = [
  { id: 'negocios', label: 'Negocios', color: '#e6007e', tint: '#fce4f0', tint2: '#f9d2e6' },
  { id: 'economia', label: 'Economía y Cs. Sociales', color: '#6b2fb3', tint: '#ece4f8', tint2: '#dfd0f1' },
  { id: 'datos', label: 'Datos y Análisis Cuantitativo', color: '#00a3c4', tint: '#dcf1f7', tint2: '#c5e8f1' },
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
  { id: '1201', codigo: '1201', nombre: 'Matemática I', area: 'datos', corr: [], term: '1-1', estado: 'pendiente' },
  { id: '1101', codigo: '1101', nombre: 'Economía I', area: 'economia', corr: [], term: '1-1', estado: 'pendiente' },
  { id: '1302', codigo: '1302', nombre: 'Administración I', area: 'negocios', corr: [], term: '1-1', estado: 'pendiente' },
  { id: '2002', codigo: '2002', nombre: 'Introducción al Derecho', area: 'negocios', corr: [], term: '1-1', estado: 'pendiente' },

  // ---------- AÑO 1 · Semestre 2 ----------
  { id: '1202', codigo: '1202', nombre: 'Matemática II', area: 'datos', corr: ['1201'], term: '1-2', estado: 'pendiente' },
  { id: '1102', codigo: '1102', nombre: 'Economía II', area: 'economia', corr: [], term: '1-2', estado: 'pendiente' },
  { id: '1301', codigo: '1301', nombre: 'Contabilidad Básica', area: 'negocios', corr: [], term: '1-2', estado: 'pendiente' },
  { id: '1401', codigo: '1401', nombre: 'Historia de Occidente a partir de la Modernidad', area: 'economia', corr: [], term: '1-2', estado: 'pendiente' },
  { id: '9003', codigo: '9003', nombre: 'Comprensión de Textos y Escritura', area: 'economia', corr: [], term: '1-2', estado: 'pendiente' },

  // ---------- AÑO 2 · Semestre 1 ----------
  { id: '2203', codigo: '2203', nombre: 'Introducción a la Estadística', area: 'datos', corr: ['1202'], term: '2-1', estado: 'pendiente' },
  { id: '2303', codigo: '2303', nombre: 'Administración II', area: 'negocios', corr: ['1302'], term: '2-1', estado: 'pendiente' },
  { id: '2103', codigo: '2103', nombre: 'Microeconomía', area: 'economia', corr: ['1101'], corrRec: ['1202'], term: '2-1', estado: 'pendiente' },
  { id: '1303', codigo: '1303', nombre: 'Información y Contabilidad Gerencial I', area: 'negocios', corr: ['1301'], term: '2-1', estado: 'pendiente' },

  // ---------- AÑO 2 · Semestre 2 ----------
  { id: '2205', codigo: '2205', nombre: 'Análisis Estadístico', area: 'datos', corr: ['2203'], term: '2-2', estado: 'pendiente' },
  { id: '1501', codigo: '1501', nombre: 'Instituciones Políticas y de Gobierno', area: 'economia', corr: [], term: '2-2', estado: 'pendiente' },
  { id: '2106', codigo: '2106', nombre: 'Historia Económica Internacional', area: 'economia', corr: ['1101', '1102'], term: '2-2', estado: 'pendiente' },
  { id: '3312', codigo: '3312', nombre: 'Información y Contabilidad Gerencial II', area: 'negocios', corr: ['1303'], term: '2-2', estado: 'pendiente' },

  // ---------- AÑO 3 · Semestre 1 ----------
  { id: '2104', codigo: '2104', nombre: 'Macroeconomía', area: 'economia', corr: ['1102'], corrRec: ['1202'], term: '3-1', estado: 'pendiente' },
  { id: '3311', codigo: '3311', nombre: 'Dirección de Operaciones y Tecnología I', area: 'negocios', corr: [], term: '3-1', estado: 'pendiente' },
  { id: '3317', codigo: '3317', nombre: 'Equipos, Personas y Liderazgo', area: 'negocios', corr: [], term: '3-1', estado: 'pendiente' },
  { id: '3313', codigo: '3313', nombre: 'Métodos Analíticos aplicados a los Negocios', area: 'datos', corr: [], term: '3-1', estado: 'pendiente' },

  // ---------- AÑO 3 · Semestre 2 ----------
  { id: '3306', codigo: '3306', nombre: 'Riesgo, Incertidumbre y Finanzas', area: 'negocios', corr: ['2103'], term: '3-2', estado: 'pendiente' },
  { id: '3315', codigo: '3315', nombre: 'Dirección Estratégica', area: 'negocios', corr: ['2103', '2303'], term: '3-2', estado: 'pendiente' },
  { id: '4327', codigo: '4327', nombre: 'Marketing', area: 'negocios', corr: [], term: '3-2', estado: 'pendiente' },
  { id: '4340', codigo: '4340', nombre: 'Aspectos Legales y Éticos de las Decisiones Empresariales', area: 'negocios', corr: ['2002'], term: '3-2', estado: 'pendiente' },
  { id: '9004', codigo: '9004', nombre: 'Expresión Oral y Escrita', area: 'economia', corr: [], term: '3-2', estado: 'pendiente' },

  // ---------- AÑO 4 · Semestre 1 ----------
  { id: '4308', codigo: '4308', nombre: 'Finanzas de la Empresa', area: 'negocios', corr: ['3306', '3312'], term: '4-1', estado: 'pendiente' },
  { id: '3319', codigo: '3319', nombre: 'Negocios y Estrategia Digital', area: 'negocios', corr: ['2103'], term: '4-1', estado: 'pendiente' },
  { id: '4350', codigo: '4350', nombre: 'Marketing Digital', area: 'negocios', corr: ['4327'], term: '4-1', estado: 'pendiente' },
  { id: 'campo-1', codigo: null, nombre: '', area: 'electivas', corr: [], term: '4-1', estado: 'pendiente', esElectiva: true, slotLabel: 'Curso de Campo Menor' },

  // ---------- AÑO 4 · Semestre 2 ----------
  { id: '4326', codigo: '4326', nombre: 'Desarrollo de Nuevos Negocios', area: 'negocios', corr: ['2303', '3312', '3306'], term: '4-2', estado: 'pendiente' },
  { id: '3318', codigo: '3318', nombre: 'Sustentabilidad y Empresa', area: 'negocios', corr: [], term: '4-2', estado: 'pendiente' },
  { id: 'campo-2', codigo: null, nombre: '', area: 'electivas', corr: [], term: '4-2', estado: 'pendiente', esElectiva: true, slotLabel: 'Curso de Campo Menor' },
  { id: 'campo-3', codigo: null, nombre: '', area: 'electivas', corr: [], term: '4-2', estado: 'pendiente', esElectiva: true, slotLabel: 'Curso de Campo Menor' },
];

export const adminEmpresas: CarreraPlan = {
  id: 'admin-empresas',
  label: 'Administración de Empresas',
  notaAprobacion: 6,
  areas,
  terms,
  subjects,
};
