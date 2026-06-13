/* ============================================================
   abogacia.ts — Plan oficial de la Carrera de Abogacía (UTDT),
   Plan 2018. Carrera de 5 años (3 + 2 de formación profesional).
   Fuente: PDF oficial "Abogacía - Plan de Estudio (Ingresantes 2018)".
   Notas de transcripción:
   - El plan NO tiene correlativas materia-a-materia. Tiene reglas de
     ciclo (gate):
       (**) Obligatorias de 4°/5° → requieren TODO 1° año aprobado → reqHasta: 1
       (***) Electivas del ciclo superior → requieren TODO 1° y 2° → reqHasta: 2
   - Las áreas NO vienen en el material oficial (todo un color); se
     diseñaron para esta app (Público / Privado / Penal / Teoría y
     Filosofía / Economía y Gestión / Electivas).
   - OJO: el PDF repite el código 2716 para "Filosofía Moral" (1° año) y
     "Filosofía Política" (2° año). Se mantuvo el código mostrado, pero
     Filosofía Política usa id interno '2716b'. ⚠️ Verificar el código real.
   ============================================================ */

import type { AreaDef, CarreraPlan, Subject, Term } from '../types';

const areas: AreaDef[] = [
  { id: 'publico', label: 'Derecho Público', color: '#6b2fb3', tint: '#ece4f8', tint2: '#dfd0f1' },
  { id: 'privado', label: 'Derecho Privado', color: '#e6007e', tint: '#fce4f0', tint2: '#f9d2e6' },
  { id: 'penal', label: 'Derecho Penal', color: '#c0392b', tint: '#f7e3e0', tint2: '#efc9c3' },
  { id: 'teoria', label: 'Teoría y Filosofía', color: '#00a3c4', tint: '#dcf1f7', tint2: '#c5e8f1' },
  { id: 'economia', label: 'Economía y Gestión', color: '#1fa97b', tint: '#e1f5ee', tint2: '#c9ebde' },
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
  { id: '5-1', anio: 5, semestre: 1, orden: 9, esExtra: false },
  { id: '5-2', anio: 5, semestre: 2, orden: 10, esExtra: false },
  { id: 'extra-1', anio: 9, semestre: 1, orden: 11, esExtra: true },
  { id: 'extra-2', anio: 9, semestre: 2, orden: 12, esExtra: true },
];

const subjects: Subject[] = [
  // ---------- AÑO 1 · Semestre 1 ----------
  { id: '1714', codigo: '1714', nombre: 'Derecho Constitucional I', area: 'publico', corr: [], term: '1-1', estado: 'pendiente' },
  { id: '1715', codigo: '1715', nombre: 'Teoría General del Derecho', area: 'teoria', corr: [], term: '1-1', estado: 'pendiente' },
  { id: '1717', codigo: '1717', nombre: 'Fundamentos del Derecho Privado', area: 'privado', corr: [], term: '1-1', estado: 'pendiente' },
  { id: '1709', codigo: '1709', nombre: 'Historia Contemporánea', area: 'teoria', corr: [], term: '1-1', estado: 'pendiente' },

  // ---------- AÑO 1 · Semestre 2 ----------
  { id: '1716', codigo: '1716', nombre: 'Derecho Constitucional II', area: 'publico', corr: [], term: '1-2', estado: 'pendiente' },
  { id: '2716', codigo: '2716', nombre: 'Filosofía Moral', area: 'teoria', corr: [], term: '1-2', estado: 'pendiente' },
  { id: '2710', codigo: '2710', nombre: 'Obligaciones', area: 'privado', corr: [], term: '1-2', estado: 'pendiente' },
  { id: '1702', codigo: '1702', nombre: 'Derecho Penal I', area: 'penal', corr: [], term: '1-2', estado: 'pendiente' },

  // ---------- AÑO 2 · Semestre 1 ----------
  { id: '2718', codigo: '2718', nombre: 'Derecho de Daños y Seguros', area: 'privado', corr: [], term: '2-1', estado: 'pendiente' },
  { id: '2714', codigo: '2714', nombre: 'Derecho Penal II', area: 'penal', corr: [], term: '2-1', estado: 'pendiente' },
  { id: '2715', codigo: '2715', nombre: 'Lógica y Redacción', area: 'teoria', corr: [], term: '2-1', estado: 'pendiente' },
  { id: '1701', codigo: '1701', nombre: 'Microeconomía', area: 'economia', corr: [], term: '2-1', estado: 'pendiente' },

  // ---------- AÑO 2 · Semestre 2 ----------
  { id: '2711', codigo: '2711', nombre: 'Análisis Económico del Derecho', area: 'economia', corr: [], term: '2-2', estado: 'pendiente' },
  { id: '2719', codigo: '2719', nombre: 'Derecho Procesal Penal', area: 'penal', corr: [], term: '2-2', estado: 'pendiente' },
  { id: '2717', codigo: '2717', nombre: 'Derechos Reales', area: 'privado', corr: [], term: '2-2', estado: 'pendiente' },
  { id: '2716b', codigo: '2716', nombre: 'Filosofía Política', area: 'teoria', corr: [], term: '2-2', estado: 'pendiente' },

  // ---------- AÑO 3 · Semestre 1 ----------
  { id: '3715', codigo: '3715', nombre: 'Contratos I', area: 'privado', corr: [], term: '3-1', estado: 'pendiente' },
  { id: '3716', codigo: '3716', nombre: 'Derecho Laboral y de la Seguridad Social', area: 'publico', corr: [], term: '3-1', estado: 'pendiente' },
  { id: '3711', codigo: '3711', nombre: 'Familia y Sucesiones', area: 'privado', corr: [], term: '3-1', estado: 'pendiente' },
  { id: '3717', codigo: '3717', nombre: 'Sociedades', area: 'privado', corr: [], term: '3-1', estado: 'pendiente' },

  // ---------- AÑO 3 · Semestre 2 ----------
  { id: '3710', codigo: '3710', nombre: 'Derecho Administrativo', area: 'publico', corr: [], term: '3-2', estado: 'pendiente' },
  { id: '3712', codigo: '3712', nombre: 'Derecho Internacional Público', area: 'publico', corr: [], term: '3-2', estado: 'pendiente' },
  { id: '3709', codigo: '3709', nombre: 'Derecho Procesal Civil I', area: 'publico', corr: [], term: '3-2', estado: 'pendiente' },
  { id: '3718', codigo: '3718', nombre: 'Derecho y Sociedad', area: 'teoria', corr: [], term: '3-2', estado: 'pendiente' },

  // ---------- AÑO 4 · Semestre 1 (Ciclo Superior: requiere todo 1° año) ----------
  { id: '4711', codigo: '4711', nombre: 'Derecho Procesal Civil II', area: 'publico', corr: [], reqHasta: 1, term: '4-1', estado: 'pendiente' },
  { id: '5828', codigo: '5828', nombre: 'Derecho Tributario', area: 'publico', corr: [], reqHasta: 1, term: '4-1', estado: 'pendiente' },
  { id: '4712', codigo: '4712', nombre: 'Macroeconomía', area: 'economia', corr: [], reqHasta: 1, term: '4-1', estado: 'pendiente' },
  { id: 'elec-4-1', codigo: null, nombre: '', area: 'electivas', corr: [], reqHasta: 2, term: '4-1', estado: 'pendiente', esElectiva: true, slotLabel: 'Materia Electiva' },

  // ---------- AÑO 4 · Semestre 2 ----------
  { id: '4702', codigo: '4702', nombre: 'Concursos y Quiebras', area: 'privado', corr: [], reqHasta: 1, term: '4-2', estado: 'pendiente' },
  { id: '4707', codigo: '4707', nombre: 'Contabilidad y Análisis Financiero', area: 'economia', corr: [], reqHasta: 1, term: '4-2', estado: 'pendiente' },
  { id: '4714', codigo: '4714', nombre: 'Contratos II', area: 'privado', corr: [], reqHasta: 1, term: '4-2', estado: 'pendiente' },
  { id: '5719', codigo: '5719', nombre: 'Derecho Internacional Privado', area: 'privado', corr: [], reqHasta: 1, term: '4-2', estado: 'pendiente' },
  { id: 'elec-4-2', codigo: null, nombre: '', area: 'electivas', corr: [], reqHasta: 2, term: '4-2', estado: 'pendiente', esElectiva: true, slotLabel: 'Materia Electiva' },

  // ---------- AÑO 5 · Semestre 1 ----------
  { id: '5829', codigo: '5829', nombre: 'Derecho Ambiental y de los Recursos Naturales', area: 'publico', corr: [], reqHasta: 1, term: '5-1', estado: 'pendiente' },
  { id: 'elec-5-1', codigo: null, nombre: '', area: 'electivas', corr: [], reqHasta: 2, term: '5-1', estado: 'pendiente', esElectiva: true, slotLabel: 'Materia Electiva' },

  // ---------- AÑO 5 · Semestre 2 ----------
  { id: '5705', codigo: '5705', nombre: 'Ética Profesional', area: 'teoria', corr: [], reqHasta: 1, term: '5-2', estado: 'pendiente' },
  { id: '5703', codigo: '5703', nombre: 'Seminario: Mediación y Arbitraje', area: 'privado', corr: [], reqHasta: 1, term: '5-2', estado: 'pendiente' },
  { id: 'elec-5-2', codigo: null, nombre: '', area: 'electivas', corr: [], reqHasta: 2, term: '5-2', estado: 'pendiente', esElectiva: true, slotLabel: 'Materia Electiva' },
];

export const abogacia: CarreraPlan = {
  id: 'abogacia',
  label: 'Abogacía',
  notaAprobacion: 6,
  areas,
  terms,
  subjects,
};
