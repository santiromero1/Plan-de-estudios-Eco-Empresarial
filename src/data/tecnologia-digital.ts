/* ============================================================
   tecnologia-digital.ts — Plan oficial de la Lic. en
   Tecnología Digital (UTDT).
   Áreas (con colores), correlativas y cuatrimestres.
   Estado inicial LIMPIO: todas 'pendiente'.
   Fuente: PDF oficial "Tecnología Digital - Plan de Estudio".
   Notas de transcripción:
   - Las correlativas marcadas con * en el PDF son "recomendadas pero
     NO obligatorias" → NO se cargan como correlativa dura (no generan
     alertas). Sólo se cargan las obligatorias.
   - Numeración corregida según la imagen de áreas: 2815 es
     "Tecnología Digital IV: Redes de Computadoras".
   ============================================================ */

import type { AreaDef, CarreraPlan, Subject, Term } from '../types';

const areas: AreaDef[] = [
  { id: 'tecnologia', label: 'Tecnología Digital', color: '#e6007e', tint: '#fce4f0', tint2: '#f9d2e6' },
  { id: 'negocios', label: 'Negocios', color: '#6b2fb3', tint: '#ece4f8', tint2: '#dfd0f1' },
  { id: 'matematica', label: 'Matemática', color: '#00a3c4', tint: '#dcf1f7', tint2: '#c5e8f1' },
  { id: 'neurociencia', label: 'Neurociencia', color: '#2d7ff9', tint: '#e2edfe', tint2: '#cfe0fc' },
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
  { id: '1811', codigo: '1811', nombre: 'Tecnología Digital I: Introducción a la Programación', area: 'tecnologia', corr: [], term: '1-1', estado: 'pendiente' },
  { id: '1201', codigo: '1201', nombre: 'Matemática I', area: 'matematica', corr: [], term: '1-1', estado: 'pendiente' },
  { id: '1101', codigo: '1101', nombre: 'Economía I', area: 'negocios', corr: [], term: '1-1', estado: 'pendiente' },
  { id: '1401', codigo: '1401', nombre: 'Historia de Occidente a partir de la Modernidad', area: 'negocios', corr: [], term: '1-1', estado: 'pendiente' },

  // ---------- AÑO 1 · Semestre 2 ----------
  { id: '9003', codigo: '9003', nombre: 'Comprensión de Textos y Escritura', area: 'negocios', corr: [], term: '1-2', estado: 'pendiente' },
  { id: '1812', codigo: '1812', nombre: 'Tecnología Digital II: Sistemas de Computación', area: 'tecnologia', corr: [], corrRec: ['1811'], term: '1-2', estado: 'pendiente' },
  { id: '1202', codigo: '1202', nombre: 'Matemática II', area: 'matematica', corr: ['1201'], term: '1-2', estado: 'pendiente' },
  { id: '4001', codigo: '4001', nombre: 'Neurociencias y Psicología Experimental', area: 'neurociencia', corr: [], term: '1-2', estado: 'pendiente' },
  { id: '1810', codigo: '1810', nombre: 'Álgebra para Computación', area: 'matematica', corr: [], corrRec: ['1201'], term: '1-2', estado: 'pendiente' },

  // ---------- AÑO 2 · Semestre 1 ----------
  { id: '2811', codigo: '2811', nombre: 'Tecnología Digital III: Algoritmos y Estructuras de Datos', area: 'tecnologia', corr: ['1811', '1810'], term: '2-1', estado: 'pendiente' },
  { id: '2103', codigo: '2103', nombre: 'Microeconomía', area: 'negocios', corr: ['1101'], term: '2-1', estado: 'pendiente' },
  { id: '2203', codigo: '2203', nombre: 'Introducción a la Estadística', area: 'matematica', corr: ['1202'], term: '2-1', estado: 'pendiente' },
  { id: '2810', codigo: '2810', nombre: 'Introducción al Diseño', area: 'diseno', corr: [], term: '2-1', estado: 'pendiente' },

  // ---------- AÑO 2 · Semestre 2 ----------
  { id: '2815', codigo: '2815', nombre: 'Tecnología Digital IV: Redes de Computadoras', area: 'tecnologia', corr: ['1812'], term: '2-2', estado: 'pendiente' },
  { id: '2814', codigo: '2814', nombre: 'Inferencia Estadística', area: 'matematica', corr: ['2203'], corrRec: ['1811'], term: '2-2', estado: 'pendiente' },
  { id: '2812', codigo: '2812', nombre: 'Aspectos Éticos y Legales en Tecnología y Sociedad', area: 'negocios', corr: [], term: '2-2', estado: 'pendiente' },
  { id: '2813', codigo: '2813', nombre: 'Introducción a la Contabilidad y las Finanzas', area: 'negocios', corr: [], corrRec: ['2203'], term: '2-2', estado: 'pendiente' },

  // ---------- AÑO 3 · Semestre 1 ----------
  { id: '3813', codigo: '3813', nombre: 'Tecnología Digital V: Diseño de Algoritmos', area: 'tecnologia', corr: ['2811'], term: '3-1', estado: 'pendiente' },
  { id: '3812', codigo: '3812', nombre: 'Métodos Computacionales', area: 'matematica', corr: ['1202'], term: '3-1', estado: 'pendiente' },
  { id: '3810', codigo: '3810', nombre: 'Gestión de Proyectos Digitales', area: 'negocios', corr: ['1811'], term: '3-1', estado: 'pendiente' },
  { id: '3811', codigo: '3811', nombre: 'Visualización de Datos', area: 'negocios', corr: ['1811'], term: '3-1', estado: 'pendiente' },
  { id: '9004', codigo: '9004', nombre: 'Expresión Oral y Escrita', area: 'negocios', corr: [], term: '3-1', estado: 'pendiente' },

  // ---------- AÑO 3 · Semestre 2 ----------
  { id: '3816', codigo: '3816', nombre: 'Tecnología Digital VI: Inteligencia Artificial', area: 'tecnologia', corr: ['2811', '2814'], term: '3-2', estado: 'pendiente' },
  { id: '3814', codigo: '3814', nombre: 'Diseño Interactivo', area: 'diseno', corr: [], term: '3-2', estado: 'pendiente' },
  { id: '3303', codigo: '3303', nombre: 'Teoría de las Decisiones', area: 'neurociencia', corr: ['2103'], term: '3-2', estado: 'pendiente' },
  { id: '3815', codigo: '3815', nombre: 'Aplicaciones Computacionales en Negocios', area: 'tecnologia', corr: ['3812'], term: '3-2', estado: 'pendiente' },

  // ---------- AÑO 4 · Semestre 1 ----------
  { id: '4811', codigo: '4811', nombre: 'Tecnología Digital VII: Ingeniería de Datos', area: 'tecnologia', corr: ['2811', '2815'], term: '4-1', estado: 'pendiente' },
  { id: '4810', codigo: '4810', nombre: 'Taller de Emprendedorismo', area: 'negocios', corr: [], term: '4-1', estado: 'pendiente' },
  { id: 'campo-1', codigo: null, nombre: '', area: 'electivas', corr: [], term: '4-1', estado: 'pendiente', esElectiva: true, slotLabel: 'Electivo o Campo Menor' },
  { id: 'campo-2', codigo: null, nombre: '', area: 'electivas', corr: [], term: '4-1', estado: 'pendiente', esElectiva: true, slotLabel: 'Electivo o Campo Menor' },

  // ---------- AÑO 4 · Semestre 2 ----------
  { id: '4813', codigo: '4813', nombre: 'Tecnología Digital VIII: Proyecto Final', area: 'tecnologia', corr: ['2815', '2811'], term: '4-2', estado: 'pendiente' },
  { id: '4812', codigo: '4812', nombre: 'Inteligencia Artificial y Neurociencias', area: 'neurociencia', corr: ['3303', '2811'], corrRec: ['3816'], term: '4-2', estado: 'pendiente' },
  { id: 'campo-3', codigo: null, nombre: '', area: 'electivas', corr: [], term: '4-2', estado: 'pendiente', esElectiva: true, slotLabel: 'Electivo o Campo Menor' },
  { id: 'campo-4', codigo: null, nombre: '', area: 'electivas', corr: [], term: '4-2', estado: 'pendiente', esElectiva: true, slotLabel: 'Electivo o Campo Menor' },
];

export const tecnologiaDigital: CarreraPlan = {
  id: 'tecnologia-digital',
  label: 'Tecnología Digital',
  notaAprobacion: 6,
  areas,
  terms,
  subjects,
};
