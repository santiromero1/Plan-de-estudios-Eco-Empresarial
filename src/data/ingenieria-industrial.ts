/* ============================================================
   ingenieria-industrial.ts — Plan de la Lic. en Ingeniería
   Industrial (UTDT). Carrera de 5 años.
   Fuente: imagen oficial del plan (áreas por color). ⚠️ NO se cuenta
   con las correlativas: las materias están cargadas sin correlatividad
   y la app muestra un aviso. Cuando estén disponibles, se agregan.
   Áreas (de la referencia de la imagen): Matemáticas y Programación /
   Ingenierías / Ciencias Exactas / Negocios y Humanidades / Electivas.
   ============================================================ */

import type { AreaDef, CarreraPlan, Subject, Term } from '../types';

const areas: AreaDef[] = [
  { id: 'mate', label: 'Matemáticas y Programación', color: '#00a3c4', tint: '#dcf1f7', tint2: '#c5e8f1' },
  { id: 'ing', label: 'Ingenierías', color: '#e6007e', tint: '#fce4f0', tint2: '#f9d2e6' },
  { id: 'exactas', label: 'Ciencias Exactas', color: '#1fa97b', tint: '#e1f5ee', tint2: '#c9ebde' },
  { id: 'negocios', label: 'Negocios y Humanidades', color: '#2d7ff9', tint: '#e2edfe', tint2: '#cfe0fc' },
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
  { id: 'intro-ingenieria', codigo: null, nombre: 'Introducción a la Ingeniería', area: 'ing', corr: [], term: '1-1', estado: 'pendiente' },
  { id: 'intro-programacion', codigo: null, nombre: 'Introducción a la Programación', area: 'mate', corr: [], term: '1-1', estado: 'pendiente' },
  { id: 'matematica-1', codigo: null, nombre: 'Matemática I', area: 'mate', corr: [], term: '1-1', estado: 'pendiente' },
  { id: 'economia-1', codigo: null, nombre: 'Economía I', area: 'negocios', corr: [], term: '1-1', estado: 'pendiente' },

  // ---------- AÑO 1 · Semestre 2 ----------
  { id: 'algebra-geometria', codigo: null, nombre: 'Álgebra y Geometría Analítica', area: 'mate', corr: [], term: '1-2', estado: 'pendiente' },
  { id: 'quimica-general', codigo: null, nombre: 'Química General', area: 'exactas', corr: [], term: '1-2', estado: 'pendiente' },
  { id: 'matematica-2', codigo: null, nombre: 'Matemática II', area: 'mate', corr: [], term: '1-2', estado: 'pendiente' },
  { id: '9003', codigo: '9003', nombre: 'Comprensión de Textos y Escritura', area: 'negocios', corr: [], term: '1-2', estado: 'pendiente' },
  { id: 'elec-humcs', codigo: null, nombre: '', area: 'electivas', corr: [], term: '1-2', estado: 'pendiente', esElectiva: true, slotLabel: 'Electiva en Humanidades o Ciencias Sociales' },

  // ---------- AÑO 2 · Semestre 1 ----------
  { id: 'intro-estadistica', codigo: null, nombre: 'Introducción a la Estadística', area: 'mate', corr: [], term: '2-1', estado: 'pendiente' },
  { id: 'fisica-1', codigo: null, nombre: 'Física I', area: 'exactas', corr: [], term: '2-1', estado: 'pendiente' },
  { id: 'matematica-3', codigo: null, nombre: 'Matemática III', area: 'mate', corr: [], term: '2-1', estado: 'pendiente' },
  { id: 'algoritmos', codigo: null, nombre: 'Algoritmos y Estructuras de Datos', area: 'mate', corr: [], term: '2-1', estado: 'pendiente' },

  // ---------- AÑO 2 · Semestre 2 ----------
  { id: 'inferencia-estadistica', codigo: null, nombre: 'Inferencia Estadística', area: 'mate', corr: [], term: '2-2', estado: 'pendiente' },
  { id: 'fisica-2', codigo: null, nombre: 'Física II', area: 'exactas', corr: [], term: '2-2', estado: 'pendiente' },
  { id: 'diseno-mecatronico-1', codigo: null, nombre: 'Diseño Mecatrónico I', area: 'ing', corr: [], term: '2-2', estado: 'pendiente' },
  { id: 'microeconomia', codigo: null, nombre: 'Microeconomía', area: 'negocios', corr: [], term: '2-2', estado: 'pendiente' },

  // ---------- AÑO 3 · Semestre 1 ----------
  { id: 'ing-industrias-1', codigo: null, nombre: 'Ingeniería de Industrias I: Producción y Procesos', area: 'ing', corr: [], term: '3-1', estado: 'pendiente' },
  { id: 'fisica-3', codigo: null, nombre: 'Física III', area: 'exactas', corr: [], term: '3-1', estado: 'pendiente' },
  { id: 'tecnologia-electrica', codigo: null, nombre: 'Tecnología Eléctrica y Electrónica', area: 'ing', corr: [], term: '3-1', estado: 'pendiente' },
  { id: 'matematica-aplicada', codigo: null, nombre: 'Matemática Aplicada', area: 'mate', corr: [], term: '3-1', estado: 'pendiente' },
  { id: '9004', codigo: '9004', nombre: 'Expresión Oral y Escrita', area: 'negocios', corr: [], term: '3-1', estado: 'pendiente' },

  // ---------- AÑO 3 · Semestre 2 ----------
  { id: 'ing-industrias-2', codigo: null, nombre: 'Ingeniería de Industrias II: Investigación Operativa', area: 'ing', corr: [], term: '3-2', estado: 'pendiente' },
  { id: 'termodinamica', codigo: null, nombre: 'Termodinámica y Mecánica de Fluidos', area: 'exactas', corr: [], term: '3-2', estado: 'pendiente' },
  { id: 'diseno-mecatronico-2', codigo: null, nombre: 'Diseño Mecatrónico II', area: 'ing', corr: [], term: '3-2', estado: 'pendiente' },
  { id: 'intro-contabilidad', codigo: null, nombre: 'Introducción a la Contabilidad y las Finanzas', area: 'negocios', corr: [], term: '3-2', estado: 'pendiente' },

  // ---------- AÑO 4 · Semestre 1 ----------
  { id: 'ing-industrias-3', codigo: null, nombre: 'Ingeniería de Industrias III: Planificación y Logística', area: 'ing', corr: [], term: '4-1', estado: 'pendiente' },
  { id: 'ing-energia', codigo: null, nombre: 'Ingeniería de la Energía', area: 'ing', corr: [], term: '4-1', estado: 'pendiente' },
  { id: 'diseno-mecatronico-3', codigo: null, nombre: 'Diseño Mecatrónico III', area: 'ing', corr: [], term: '4-1', estado: 'pendiente' },
  { id: 'ciencia-materiales', codigo: null, nombre: 'Ciencia de Materiales', area: 'exactas', corr: [], term: '4-1', estado: 'pendiente' },

  // ---------- AÑO 4 · Semestre 2 ----------
  { id: 'ing-industrias-sistemas', codigo: null, nombre: 'Ingeniería de Industrias: Sistemas y Gestión', area: 'ing', corr: [], term: '4-2', estado: 'pendiente' },
  { id: 'datos-inteligencia-negocios', codigo: null, nombre: 'Datos e Inteligencia de Negocios', area: 'mate', corr: [], term: '4-2', estado: 'pendiente' },
  { id: 'instalaciones-procesos', codigo: null, nombre: 'Instalaciones y Procesos Industriales', area: 'ing', corr: [], term: '4-2', estado: 'pendiente' },
  { id: 'elec-conc-1', codigo: null, nombre: '', area: 'electivas', corr: [], term: '4-2', estado: 'pendiente', esElectiva: true, slotLabel: 'Electiva en concentración elegida' },

  // ---------- AÑO 5 · Semestre 1 ----------
  { id: 'innovacion-sostenibilidad', codigo: null, nombre: 'Innovación y Sostenibilidad', area: 'negocios', corr: [], term: '5-1', estado: 'pendiente' },
  { id: 'equipos-liderazgo', codigo: null, nombre: 'Equipos y Liderazgo', area: 'negocios', corr: [], term: '5-1', estado: 'pendiente' },
  { id: 'etica-legislacion', codigo: null, nombre: 'Ética y Legislación', area: 'negocios', corr: [], term: '5-1', estado: 'pendiente' },
  { id: 'campo-1', codigo: null, nombre: '', area: 'electivas', corr: [], term: '5-1', estado: 'pendiente', esElectiva: true, slotLabel: 'Curso electivo o de campo menor' },
  { id: 'elec-conc-2', codigo: null, nombre: '', area: 'electivas', corr: [], term: '5-1', estado: 'pendiente', esElectiva: true, slotLabel: 'Electiva en concentración elegida' },

  // ---------- AÑO 5 · Semestre 2 ----------
  { id: 'proyecto-final', codigo: null, nombre: 'Proyecto Final de Ingeniería Industrial', area: 'ing', corr: [], term: '5-2', estado: 'pendiente' },
  { id: 'campo-2', codigo: null, nombre: '', area: 'electivas', corr: [], term: '5-2', estado: 'pendiente', esElectiva: true, slotLabel: 'Curso electivo o de campo menor' },
  { id: 'campo-3', codigo: null, nombre: '', area: 'electivas', corr: [], term: '5-2', estado: 'pendiente', esElectiva: true, slotLabel: 'Curso electivo o de campo menor' },
  { id: 'elec-conc-3', codigo: null, nombre: '', area: 'electivas', corr: [], term: '5-2', estado: 'pendiente', esElectiva: true, slotLabel: 'Electiva en concentración elegida' },
  { id: 'practica-profesional', codigo: null, nombre: 'Práctica Profesional Supervisada', area: 'ing', corr: [], term: '5-2', estado: 'pendiente' },
];

export const ingenieriaIndustrial: CarreraPlan = {
  id: 'ingenieria-industrial',
  label: 'Ingeniería Industrial',
  notaAprobacion: 6,
  areas,
  terms,
  subjects,
  aviso:
    'Este plan todavía no tiene las correlativas cargadas. Podés organizar y seguir las materias, pero la app aún no valida correlatividades para esta carrera.',
};
