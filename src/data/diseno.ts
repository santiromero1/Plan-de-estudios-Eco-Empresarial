/* ============================================================
   diseno.ts — Plan oficial de la Carrera de Diseño (UTDT).
   Carrera de 4 años. Fuente: PDF oficial "Diseño - Plan de Estudios".
   Áreas diseñadas para esta app (el material no trae subcategorías):
   Laboratorio de Diseño / Teoría e Historia / Tecnología y Métodos /
   Gestión y Sociedad / Electivas.
   ============================================================ */

import type { AreaDef, CarreraPlan, Subject, Term } from '../types';

const areas: AreaDef[] = [
  { id: 'lab', label: 'Laboratorio de Diseño', color: '#1fa97b', tint: '#e1f5ee', tint2: '#c9ebde' },
  { id: 'teoria', label: 'Teoría e Historia', color: '#6b2fb3', tint: '#ece4f8', tint2: '#dfd0f1' },
  { id: 'tecnologia', label: 'Tecnología y Métodos', color: '#00a3c4', tint: '#dcf1f7', tint2: '#c5e8f1' },
  { id: 'gestion', label: 'Gestión y Sociedad', color: '#e6007e', tint: '#fce4f0', tint2: '#f9d2e6' },
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
  { id: '1602', codigo: '1602', nombre: 'Laboratorio de Diseño I', area: 'lab', corr: [], term: '1-1', estado: 'pendiente' },
  { id: '1603', codigo: '1603', nombre: 'Forma e Imagen', area: 'teoria', corr: [], term: '1-1', estado: 'pendiente' },
  { id: '1403', codigo: '1403', nombre: 'Arte y Cultura de la Modernidad', area: 'teoria', corr: [], term: '1-1', estado: 'pendiente' },
  { id: '1207', codigo: '1207', nombre: 'Matemática', area: 'tecnologia', corr: [], term: '1-1', estado: 'pendiente' },

  // ---------- AÑO 1 · Semestre 2 ----------
  { id: '1604', codigo: '1604', nombre: 'Laboratorio de Diseño II', area: 'lab', corr: ['1602'], term: '1-2', estado: 'pendiente' },
  { id: '1605', codigo: '1605', nombre: 'Teorías de la Comunicación', area: 'teoria', corr: [], term: '1-2', estado: 'pendiente' },
  { id: '2604', codigo: '2604', nombre: 'Historia del Diseño Moderno', area: 'teoria', corr: [], term: '1-2', estado: 'pendiente' },
  { id: '1501', codigo: '1501', nombre: 'Instituciones Políticas y de Gobierno', area: 'gestion', corr: [], term: '1-2', estado: 'pendiente' },
  { id: '9003', codigo: '9003', nombre: 'Comprensión de Textos y Escritura', area: 'gestion', corr: [], term: '1-2', estado: 'pendiente' },

  // ---------- AÑO 2 · Semestre 1 ----------
  { id: '2601', codigo: '2601', nombre: 'Laboratorio de Diseño III', area: 'lab', corr: ['1602', '1604'], term: '2-1', estado: 'pendiente' },
  { id: '2602', codigo: '2602', nombre: 'Objeto y Materialidad', area: 'tecnologia', corr: [], term: '2-1', estado: 'pendiente' },
  { id: '2603', codigo: '2603', nombre: 'Introducción a los Estudios Visuales', area: 'teoria', corr: [], term: '2-1', estado: 'pendiente' },
  { id: '2608', codigo: '2608', nombre: 'Economía', area: 'gestion', corr: [], term: '2-1', estado: 'pendiente' },

  // ---------- AÑO 2 · Semestre 2 ----------
  { id: '2605', codigo: '2605', nombre: 'Laboratorio de Diseño IV', area: 'lab', corr: ['1602', '1604'], term: '2-2', estado: 'pendiente' },
  { id: '2606', codigo: '2606', nombre: 'Teoría y Metodología del Diseño', area: 'teoria', corr: [], term: '2-2', estado: 'pendiente' },
  { id: '2607', codigo: '2607', nombre: 'Ingeniería de Materiales', area: 'tecnologia', corr: [], term: '2-2', estado: 'pendiente' },
  { id: '3003', codigo: '3003', nombre: 'Sociología', area: 'gestion', corr: [], term: '2-2', estado: 'pendiente' },

  // ---------- AÑO 3 · Semestre 1 ----------
  { id: '3620', codigo: '3620', nombre: 'Laboratorio de Diseño V', area: 'lab', corr: ['2601', '2605'], term: '3-1', estado: 'pendiente' },
  { id: '3621', codigo: '3621', nombre: 'Visualización de la Información', area: 'tecnologia', corr: [], term: '3-1', estado: 'pendiente' },
  { id: '3622', codigo: '3622', nombre: 'Programación Orientada al Diseño', area: 'tecnologia', corr: [], term: '3-1', estado: 'pendiente' },
  { id: '3623', codigo: '3623', nombre: 'Historia del Diseño Latinoamericano', area: 'teoria', corr: [], term: '3-1', estado: 'pendiente' },

  // ---------- AÑO 3 · Semestre 2 ----------
  { id: '3624', codigo: '3624', nombre: 'Laboratorio de Diseño VI', area: 'lab', corr: ['2605', '3620'], term: '3-2', estado: 'pendiente' },
  { id: '3625', codigo: '3625', nombre: 'Diseño de Interactividad', area: 'tecnologia', corr: [], term: '3-2', estado: 'pendiente' },
  { id: '4327', codigo: '4327', nombre: 'Marketing', area: 'gestion', corr: ['2608'], term: '3-2', estado: 'pendiente' },
  { id: '9004', codigo: '9004', nombre: 'Expresión Oral y Escrita', area: 'gestion', corr: [], term: '3-2', estado: 'pendiente' },
  { id: 'campo-1', codigo: null, nombre: '', area: 'electivas', corr: [], term: '3-2', estado: 'pendiente', esElectiva: true, slotLabel: 'Curso de Campo Menor' },

  // ---------- AÑO 4 · Semestre 1 ----------
  { id: '4630', codigo: '4630', nombre: 'Laboratorio de Diseño VII', area: 'lab', corr: ['3620', '3624'], term: '4-1', estado: 'pendiente' },
  { id: '4631', codigo: '4631', nombre: 'Diseño y Gestión Cultural', area: 'gestion', corr: [], term: '4-1', estado: 'pendiente' },
  { id: '4632', codigo: '4632', nombre: 'Gestión Estratégica del Diseño', area: 'gestion', corr: [], term: '4-1', estado: 'pendiente' },
  { id: 'campo-2', codigo: null, nombre: '', area: 'electivas', corr: [], term: '4-1', estado: 'pendiente', esElectiva: true, slotLabel: 'Curso de Campo Menor' },

  // ---------- AÑO 4 · Semestre 2 ----------
  { id: '4633', codigo: '4633', nombre: 'Laboratorio de Diseño VIII (Proyecto Final)', area: 'lab', corr: ['3624'], term: '4-2', estado: 'pendiente' },
  { id: '4634', codigo: '4634', nombre: 'Narrativas y Medios', area: 'gestion', corr: [], term: '4-2', estado: 'pendiente' },
  { id: '4635', codigo: '4635', nombre: 'Diseño Sustentable', area: 'gestion', corr: [], term: '4-2', estado: 'pendiente' },
  { id: 'campo-3', codigo: null, nombre: '', area: 'electivas', corr: [], term: '4-2', estado: 'pendiente', esElectiva: true, slotLabel: 'Curso de Campo Menor' },
];

export const diseno: CarreraPlan = {
  id: 'diseno',
  label: 'Diseño',
  notaAprobacion: 6,
  areas,
  terms,
  subjects,
};
