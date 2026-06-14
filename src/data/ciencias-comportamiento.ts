/* ============================================================
   ciencias-comportamiento.ts — Plan oficial de la Lic. en
   Ciencias del Comportamiento (UTDT). Carrera de 4 años.
   Fuente: PDF oficial "Ciencias del Comportamiento".
   Áreas según la imagen oficial: Neurociencia y Psicología /
   Matemáticas y Estadística / Negocios / Diseño / Electivas.
   ============================================================ */

import type { AreaDef, CarreraPlan, Subject, Term } from '../types';

const areas: AreaDef[] = [
  { id: 'neuro', label: 'Neurociencia y Psicología', color: '#2d7ff9', tint: '#e2edfe', tint2: '#cfe0fc' },
  { id: 'mate', label: 'Matemáticas y Estadística', color: '#00a3c4', tint: '#dcf1f7', tint2: '#c5e8f1' },
  { id: 'negocios', label: 'Negocios', color: '#e6007e', tint: '#fce4f0', tint2: '#f9d2e6' },
  { id: 'diseno', label: 'Diseño', color: '#1fa97b', tint: '#e1f5ee', tint2: '#c9ebde' },
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
  { id: '1201', codigo: '1201', nombre: 'Matemática I', area: 'mate', corr: [], term: '1-1', estado: 'pendiente' },
  { id: '1101', codigo: '1101', nombre: 'Economía I', area: 'negocios', corr: [], term: '1-1', estado: 'pendiente' },
  { id: '1401', codigo: '1401', nombre: 'Historia de Occidente a partir de la Modernidad', area: 'negocios', corr: [], term: '1-1', estado: 'pendiente' },
  { id: '4001', codigo: '4001', nombre: 'Neurociencia y Psicología Experimental', area: 'neuro', corr: [], term: '1-1', estado: 'pendiente' },
  { id: '9003', codigo: '9003', nombre: 'Comprensión de Textos y Escritura', area: 'negocios', corr: [], term: '1-1', estado: 'pendiente' },

  // ---------- AÑO 1 · Semestre 2 ----------
  { id: '1202', codigo: '1202', nombre: 'Matemática II', area: 'mate', corr: ['1201'], term: '1-2', estado: 'pendiente' },
  { id: '1850', codigo: '1850', nombre: 'Estructura y Función del Sistema Nervioso', area: 'neuro', corr: [], term: '1-2', estado: 'pendiente' },
  { id: '1852', codigo: '1852', nombre: 'Fundamentos de Psicología y Sociedad', area: 'neuro', corr: [], term: '1-2', estado: 'pendiente' },
  { id: '1851', codigo: '1851', nombre: 'Introducción a la Programación', area: 'mate', corr: [], term: '1-2', estado: 'pendiente' },

  // ---------- AÑO 2 · Semestre 1 ----------
  { id: '2203', codigo: '2203', nombre: 'Introducción a la Estadística', area: 'mate', corr: ['1202'], term: '2-1', estado: 'pendiente' },
  { id: '2850', codigo: '2850', nombre: 'Técnicas de Medición en Psicología Experimental', area: 'neuro', corr: ['4001'], term: '2-1', estado: 'pendiente' },
  { id: '2851', codigo: '2851', nombre: 'Neurociencia y Ética', area: 'neuro', corr: ['4001'], term: '2-1', estado: 'pendiente' },
  { id: '2813', codigo: '2813', nombre: 'Introducción a la Contabilidad y las Finanzas', area: 'negocios', corr: [], term: '2-1', estado: 'pendiente' },

  // ---------- AÑO 2 · Semestre 2 ----------
  { id: '2814', codigo: '2814', nombre: 'Inferencia Estadística', area: 'mate', corr: ['2203'], term: '2-2', estado: 'pendiente' },
  { id: '2852', codigo: '2852', nombre: 'Personalidad y Diferencias Individuales', area: 'neuro', corr: ['1852'], term: '2-2', estado: 'pendiente' },
  { id: '2853', codigo: '2853', nombre: 'Psicología de Masas', area: 'neuro', corr: ['1852'], term: '2-2', estado: 'pendiente' },
  { id: '2810', codigo: '2810', nombre: 'Introducción al Diseño', area: 'diseno', corr: [], term: '2-2', estado: 'pendiente' },

  // ---------- AÑO 3 · Semestre 1 ----------
  { id: '4358', codigo: '4358', nombre: 'Neurociencia del Aprendizaje', area: 'neuro', corr: ['4001'], term: '3-1', estado: 'pendiente' },
  { id: '3303', codigo: '3303', nombre: 'Teoría de las Decisiones', area: 'negocios', corr: ['1101', '2203'], term: '3-1', estado: 'pendiente' },
  { id: '3814', codigo: '3814', nombre: 'Diseño Interactivo', area: 'diseno', corr: ['2810'], term: '3-1', estado: 'pendiente' },
  { id: '3850', codigo: '3850', nombre: 'Métodos Estadísticos en Psicología Experimental', area: 'mate', corr: ['2814', '1851', '4001'], term: '3-1', estado: 'pendiente' },
  { id: '9004', codigo: '9004', nombre: 'Expresión Oral y Escrita', area: 'negocios', corr: [], term: '3-1', estado: 'pendiente' },

  // ---------- AÑO 3 · Semestre 2 ----------
  { id: '3851', codigo: '3851', nombre: 'Economía del Comportamiento', area: 'negocios', corr: ['1101'], term: '3-2', estado: 'pendiente' },
  { id: '4327', codigo: '4327', nombre: 'Marketing', area: 'negocios', corr: [], term: '3-2', estado: 'pendiente' },
  { id: '3852', codigo: '3852', nombre: 'Inteligencia Artificial Aplicada', area: 'negocios', corr: ['2814', '1851'], term: '3-2', estado: 'pendiente' },
  { id: '3811', codigo: '3811', nombre: 'Visualización de Datos', area: 'diseno', corr: ['1851', '2810'], term: '3-2', estado: 'pendiente' },

  // ---------- AÑO 4 · Semestre 1 ----------
  { id: '4851', codigo: '4851', nombre: 'Comportamiento Organizacional y Gestión de Cambio', area: 'negocios', corr: [], term: '4-1', estado: 'pendiente' },
  { id: '4850', codigo: '4850', nombre: 'Datos y Neurociencia', area: 'mate', corr: ['2814', '1851', '2850'], term: '4-1', estado: 'pendiente' },
  { id: 'campo-1', codigo: null, nombre: '', area: 'electivas', corr: [], term: '4-1', estado: 'pendiente', esElectiva: true, slotLabel: 'Curso Electivo o de Campo Menor' },
  { id: 'campo-2', codigo: null, nombre: '', area: 'electivas', corr: [], term: '4-1', estado: 'pendiente', esElectiva: true, slotLabel: 'Curso Electivo o de Campo Menor' },

  // ---------- AÑO 4 · Semestre 2 ----------
  { id: '4852', codigo: '4852', nombre: 'Lenguaje y Cognición', area: 'neuro', corr: ['2814', '1851', '4001'], term: '4-2', estado: 'pendiente' },
  { id: '4853', codigo: '4853', nombre: 'Proyecto Final', area: 'neuro', corr: ['3850', '2850'], term: '4-2', estado: 'pendiente' },
  { id: 'campo-3', codigo: null, nombre: '', area: 'electivas', corr: [], term: '4-2', estado: 'pendiente', esElectiva: true, slotLabel: 'Curso Electivo o de Campo Menor' },
  { id: 'campo-4', codigo: null, nombre: '', area: 'electivas', corr: [], term: '4-2', estado: 'pendiente', esElectiva: true, slotLabel: 'Curso Electivo o de Campo Menor' },
];

export const cienciasComportamiento: CarreraPlan = {
  id: 'ciencias-comportamiento',
  label: 'Ciencias del Comportamiento',
  notaAprobacion: 6,
  areas,
  terms,
  subjects,
};
