/* ============================================================
   estudios-internacionales.ts — Plan oficial de la Lic. en
   Estudios Internacionales (UTDT), ingresantes 2025. 4 años.
   Fuente: PDF oficial.
   - Gate de ciclo: las obligatorias de 4° requieren todo 1° y 2°
     aprobado → reqHasta: 2.
   - El * del folleto = "materia ofrecida en ambos semestres" (no es
     correlativa); sólo se cargan las correlativas duras del PDF.
   - Áreas diseñadas para esta app.
   ============================================================ */

import type { AreaDef, CarreraPlan, Subject, Term } from '../types';

const areas: AreaDef[] = [
  { id: 'rrii', label: 'Relaciones Internacionales', color: '#2d7ff9', tint: '#e2edfe', tint2: '#cfe0fc' },
  { id: 'politica', label: 'Política y Gobierno', color: '#e6007e', tint: '#fce4f0', tint2: '#f9d2e6' },
  { id: 'economia', label: 'Economía', color: '#1fa97b', tint: '#e1f5ee', tint2: '#c9ebde' },
  { id: 'metodos', label: 'Métodos y Formación', color: '#00a3c4', tint: '#dcf1f7', tint2: '#c5e8f1' },
  { id: 'historia', label: 'Historia', color: '#6b2fb3', tint: '#ece4f8', tint2: '#dfd0f1' },
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
  { id: '1502', codigo: '1502', nombre: 'Introducción a la Ciencia Política', area: 'politica', corr: [], term: '1-1', estado: 'pendiente' },
  { id: '1519', codigo: '1519', nombre: 'Introducción a las Relaciones Internacionales', area: 'rrii', corr: [], term: '1-1', estado: 'pendiente' },
  { id: '1101', codigo: '1101', nombre: 'Economía I', area: 'economia', corr: [], term: '1-1', estado: 'pendiente' },
  { id: '1204', codigo: '1204', nombre: 'Matemática I', area: 'metodos', corr: [], term: '1-1', estado: 'pendiente' },
  { id: '9003', codigo: '9003', nombre: 'Comprensión de Textos y Escritura', area: 'metodos', corr: [], term: '1-1', estado: 'pendiente' },

  // ---------- AÑO 1 · Semestre 2 ----------
  { id: '1503', codigo: '1503', nombre: 'Lógica y Técnicas de Investigación en Ciencias Sociales', area: 'metodos', corr: [], term: '1-2', estado: 'pendiente' },
  { id: '2505', codigo: '2505', nombre: 'Teoría Política I', area: 'politica', corr: [], term: '1-2', estado: 'pendiente' },
  { id: '1408', codigo: '1408', nombre: 'Historia de Occidente a partir de la Modernidad', area: 'historia', corr: [], term: '1-2', estado: 'pendiente' },
  { id: '1205', codigo: '1205', nombre: 'Matemática II', area: 'metodos', corr: ['1204'], term: '1-2', estado: 'pendiente' },

  // ---------- AÑO 2 · Semestre 1 ----------
  { id: '2504', codigo: '2504', nombre: 'Política Comparada', area: 'politica', corr: [], term: '2-1', estado: 'pendiente' },
  { id: '2522', codigo: '2522', nombre: 'Política y Sociedad en la Argentina (S. XIX y XX)', area: 'politica', corr: [], term: '2-1', estado: 'pendiente' },
  { id: '2524', codigo: '2524', nombre: 'Historia del Mundo Contemporáneo (1914-2000)', area: 'historia', corr: [], term: '2-1', estado: 'pendiente' },
  { id: '1104', codigo: '1104', nombre: 'Economía II', area: 'economia', corr: ['1101'], term: '2-1', estado: 'pendiente' },

  // ---------- AÑO 2 · Semestre 2 ----------
  { id: '3510', codigo: '3510', nombre: 'Introducción a las Políticas Públicas', area: 'politica', corr: [], term: '2-2', estado: 'pendiente' },
  { id: '2521', codigo: '2521', nombre: 'Política y Sociedad en América Latina', area: 'politica', corr: [], term: '2-2', estado: 'pendiente' },
  { id: '3507', codigo: '3507', nombre: 'Teoría Política II', area: 'politica', corr: ['2505'], term: '2-2', estado: 'pendiente' },
  { id: '4513', codigo: '4513', nombre: 'Teoría de las Relaciones Internacionales', area: 'rrii', corr: [], term: '2-2', estado: 'pendiente' },

  // ---------- AÑO 3 · Semestre 1 ----------
  { id: '2526', codigo: '2526', nombre: 'Diseño y Metodología de las Ciencias Sociales', area: 'metodos', corr: [], term: '3-1', estado: 'pendiente' },
  { id: '2520', codigo: '2520', nombre: 'Organizaciones y Teoría de la Decisión', area: 'politica', corr: [], term: '3-1', estado: 'pendiente' },
  { id: '4516', codigo: '4516', nombre: 'Política Exterior Argentina', area: 'rrii', corr: [], term: '3-1', estado: 'pendiente' },
  { id: '3508', codigo: '3508', nombre: 'Política y Economía', area: 'economia', corr: [], term: '3-1', estado: 'pendiente' },
  { id: '9004', codigo: '9004', nombre: 'Expresión Oral y Escrita', area: 'metodos', corr: [], term: '3-1', estado: 'pendiente' },

  // ---------- AÑO 3 · Semestre 2 ----------
  { id: '2525', codigo: '2525', nombre: 'Estadística para las Ciencias Sociales', area: 'metodos', corr: [], term: '3-2', estado: 'pendiente' },
  { id: '3511', codigo: '3511', nombre: 'Relaciones Internacionales Contemporáneas', area: 'rrii', corr: [], term: '3-2', estado: 'pendiente' },
  { id: '3616', codigo: '3616', nombre: 'Política Exterior de los Estados Unidos', area: 'rrii', corr: [], term: '3-2', estado: 'pendiente' },
  { id: '2503', codigo: '2503', nombre: 'Política y Derecho', area: 'politica', corr: [], term: '3-2', estado: 'pendiente' },

  // ---------- AÑO 4 · Semestre 1 (gate: requiere todo 1° y 2°) ----------
  { id: '3208', codigo: '3208', nombre: 'Comercio Internacional', area: 'rrii', corr: [], reqHasta: 2, term: '4-1', estado: 'pendiente' },
  { id: '4618', codigo: '4618', nombre: 'Derecho Internacional', area: 'rrii', corr: [], reqHasta: 2, term: '4-1', estado: 'pendiente' },
  { id: 'campo-1', codigo: null, nombre: '', area: 'electivas', corr: [], term: '4-1', estado: 'pendiente', esElectiva: true, slotLabel: 'Curso de Campo Menor' },
  { id: 'campo-2', codigo: null, nombre: '', area: 'electivas', corr: [], term: '4-1', estado: 'pendiente', esElectiva: true, slotLabel: 'Curso de Campo Menor' },

  // ---------- AÑO 4 · Semestre 2 ----------
  { id: '4619', codigo: '4619', nombre: 'Organismos Internacionales', area: 'rrii', corr: [], reqHasta: 2, term: '4-2', estado: 'pendiente' },
  { id: '4617', codigo: '4617', nombre: 'Conflictos Internacionales y Seguridad', area: 'rrii', corr: [], reqHasta: 2, term: '4-2', estado: 'pendiente' },
  { id: 'campo-3', codigo: null, nombre: '', area: 'electivas', corr: [], term: '4-2', estado: 'pendiente', esElectiva: true, slotLabel: 'Curso de Campo Menor' },
  { id: 'campo-4', codigo: null, nombre: '', area: 'electivas', corr: [], term: '4-2', estado: 'pendiente', esElectiva: true, slotLabel: 'Curso de Campo Menor' },
  { id: '5601', codigo: '5601', nombre: 'Seminario de Graduación', area: 'metodos', corr: [], reqHasta: 2, term: '4-2', estado: 'pendiente' },
];

export const estudiosInternacionales: CarreraPlan = {
  id: 'estudios-internacionales',
  label: 'Estudios Internacionales',
  notaAprobacion: 6,
  areas,
  terms,
  subjects,
};
