/* ============================================================
   arquitectura.ts — Plan oficial de la Carrera de Arquitectura
   (UTDT), Plan Inicio Marzo 2016/2023. Carrera de 5 años.
   Fuente: PDF oficial "Plan de Estudios - Arquitectura".
   Tiene correlativas materia-a-materia ricas (no usa gate de ciclo).
   Las áreas NO vienen en el material (todo un color); se diseñaron
   para esta app: Proyecto y Diseño / Técnica y Tecnología /
   Historia y Teoría / Gestión y Sociedad / Electivas.
   ============================================================ */

import type { AreaDef, CarreraPlan, Subject, Term } from '../types';

const areas: AreaDef[] = [
  { id: 'proyecto', label: 'Proyecto y Diseño', color: '#e6007e', tint: '#fce4f0', tint2: '#f9d2e6' },
  { id: 'tecnica', label: 'Técnica y Tecnología', color: '#00a3c4', tint: '#dcf1f7', tint2: '#c5e8f1' },
  { id: 'historia', label: 'Historia y Teoría', color: '#6b2fb3', tint: '#ece4f8', tint2: '#dfd0f1' },
  { id: 'gestion', label: 'Gestión y Sociedad', color: '#1fa97b', tint: '#e1f5ee', tint2: '#c9ebde' },
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
  // ---------- AÑO 1 · Semestre 1 (Ciclo Introductorio) ----------
  { id: '1901', codigo: '1901', nombre: 'Introducción al Proyecto Arquitectónico', area: 'proyecto', corr: [], term: '1-1', estado: 'pendiente' },
  { id: '1902', codigo: '1902', nombre: 'Introducción a los Medios Expresivos', area: 'proyecto', corr: [], term: '1-1', estado: 'pendiente' },
  { id: '1207', codigo: '1207', nombre: 'Matemática I', area: 'tecnica', corr: [], term: '1-1', estado: 'pendiente' },
  { id: '1903', codigo: '1903', nombre: 'Introducción a las Construcciones', area: 'tecnica', corr: [], term: '1-1', estado: 'pendiente' },
  { id: '9003', codigo: '9003', nombre: 'Comprensión de Textos y Escritura', area: 'gestion', corr: [], term: '1-1', estado: 'pendiente' },

  // ---------- AÑO 1 · Semestre 2 ----------
  { id: '1904', codigo: '1904', nombre: 'Introducción al Proyecto Urbano', area: 'proyecto', corr: ['1901'], term: '1-2', estado: 'pendiente' },
  { id: '1905', codigo: '1905', nombre: 'Morfología', area: 'proyecto', corr: [], term: '1-2', estado: 'pendiente' },
  { id: '1906', codigo: '1906', nombre: 'Matemática II', area: 'tecnica', corr: ['1207'], term: '1-2', estado: 'pendiente' },
  { id: '1403', codigo: '1403', nombre: 'Arte y Cultura de la Modernidad', area: 'historia', corr: [], term: '1-2', estado: 'pendiente' },
  { id: '1518', codigo: '1518', nombre: 'Introducción a la Administración Pública y a las Organizaciones', area: 'gestion', corr: [], term: '1-2', estado: 'pendiente' },

  // ---------- AÑO 2 · Semestre 1 (Ciclo Disciplinar) ----------
  { id: '2901', codigo: '2901', nombre: 'Proyecto I', area: 'proyecto', corr: ['1403', '1902', '1903', '1904', '1905'], term: '2-1', estado: 'pendiente' },
  { id: '2902', codigo: '2902', nombre: 'Croquis', area: 'proyecto', corr: ['1902'], term: '2-1', estado: 'pendiente' },
  { id: '2903', codigo: '2903', nombre: 'Estructuras I', area: 'tecnica', corr: ['1906'], term: '2-1', estado: 'pendiente' },
  { id: '1907', codigo: '1907', nombre: 'Historia General de la Arquitectura y del Arte', area: 'historia', corr: ['1403'], term: '2-1', estado: 'pendiente' },
  { id: '1118', codigo: '1118', nombre: 'Economía', area: 'gestion', corr: [], term: '2-1', estado: 'pendiente' },

  // ---------- AÑO 2 · Semestre 2 ----------
  { id: '2904', codigo: '2904', nombre: 'Proyecto II', area: 'proyecto', corr: ['2901'], term: '2-2', estado: 'pendiente' },
  { id: '2905', codigo: '2905', nombre: 'Materia y Forma', area: 'proyecto', corr: [], term: '2-2', estado: 'pendiente' },
  { id: '2906', codigo: '2906', nombre: 'Estructuras II', area: 'tecnica', corr: ['2903'], term: '2-2', estado: 'pendiente' },
  { id: '2907', codigo: '2907', nombre: 'Construcciones I', area: 'tecnica', corr: ['1903'], term: '2-2', estado: 'pendiente' },
  { id: '2908', codigo: '2908', nombre: 'Historia de la Arquitectura Moderna I', area: 'historia', corr: ['1403'], term: '2-2', estado: 'pendiente' },

  // ---------- AÑO 3 · Semestre 1 ----------
  { id: '3901', codigo: '3901', nombre: 'Proyecto III', area: 'proyecto', corr: ['2904'], term: '3-1', estado: 'pendiente' },
  { id: '3902', codigo: '3902', nombre: 'Modelos Informáticos I', area: 'tecnica', corr: [], term: '3-1', estado: 'pendiente' },
  { id: '3903', codigo: '3903', nombre: 'Construcciones II', area: 'tecnica', corr: ['2907'], term: '3-1', estado: 'pendiente' },
  { id: '3904', codigo: '3904', nombre: 'Instalaciones Complementarias I', area: 'tecnica', corr: ['1903'], term: '3-1', estado: 'pendiente' },
  { id: '3905', codigo: '3905', nombre: 'Historia de la Arquitectura Moderna II', area: 'historia', corr: ['1907', '2908'], term: '3-1', estado: 'pendiente' },
  { id: '9004', codigo: '9004', nombre: 'Expresión Oral y Escrita', area: 'gestion', corr: [], term: '3-1', estado: 'pendiente' },

  // ---------- AÑO 3 · Semestre 2 ----------
  { id: '3906', codigo: '3906', nombre: 'Proyecto IV', area: 'proyecto', corr: ['2905', '3901'], term: '3-2', estado: 'pendiente' },
  { id: '3907', codigo: '3907', nombre: 'Modelos Informáticos II', area: 'tecnica', corr: ['3902'], term: '3-2', estado: 'pendiente' },
  { id: '3908', codigo: '3908', nombre: 'Construcciones III', area: 'tecnica', corr: ['3903'], term: '3-2', estado: 'pendiente' },
  { id: '3909', codigo: '3909', nombre: 'Instalaciones Complementarias II', area: 'tecnica', corr: ['3904'], term: '3-2', estado: 'pendiente' },
  { id: '3910', codigo: '3910', nombre: 'Historia de la Arquitectura en Argentina y América Latina', area: 'historia', corr: ['2908'], term: '3-2', estado: 'pendiente' },

  // ---------- AÑO 4 · Semestre 1 ----------
  { id: '4901', codigo: '4901', nombre: 'Proyecto V', area: 'proyecto', corr: ['3906'], term: '4-1', estado: 'pendiente' },
  { id: '4902', codigo: '4902', nombre: 'Arquitectura del Paisaje', area: 'proyecto', corr: ['2907', '3901', '3905'], term: '4-1', estado: 'pendiente' },
  { id: '4908', codigo: '4908', nombre: 'Estética y Teorías de la Arquitectura', area: 'historia', corr: ['3905'], term: '4-1', estado: 'pendiente' },
  { id: '4904', codigo: '4904', nombre: 'Estructuras III', area: 'tecnica', corr: ['2906'], term: '4-1', estado: 'pendiente' },
  { id: '4905', codigo: '4905', nombre: 'Estudios del Patrimonio', area: 'historia', corr: ['2906', '2907', '3904', '3910'], term: '4-1', estado: 'pendiente' },

  // ---------- AÑO 4 · Semestre 2 ----------
  { id: '4906', codigo: '4906', nombre: 'Proyecto VI', area: 'proyecto', corr: ['4901'], term: '4-2', estado: 'pendiente' },
  { id: '4907', codigo: '4907', nombre: 'Gerenciamiento de la Edilicia', area: 'gestion', corr: ['1118'], term: '4-2', estado: 'pendiente' },
  { id: '4903', codigo: '4903', nombre: 'Comunicación', area: 'gestion', corr: ['3905'], term: '4-2', estado: 'pendiente' },
  { id: '4909', codigo: '4909', nombre: 'Planificación Urbana', area: 'proyecto', corr: ['3906'], term: '4-2', estado: 'pendiente' },
  { id: 'campo-1', codigo: null, nombre: '', area: 'electivas', corr: [], term: '4-2', estado: 'pendiente', esElectiva: true, slotLabel: 'Curso Optativo del Campo Menor' },

  // ---------- AÑO 5 · Semestre 1 (Ciclo de Consolidación) ----------
  { id: '5901', codigo: '5901', nombre: 'Tesis Proyectual - Primera Parte', area: 'proyecto', corr: ['3907', '3908', '3909', '3910', '4906'], term: '5-1', estado: 'pendiente' },
  { id: '5906', codigo: '5906', nombre: 'Legislación de Obras', area: 'gestion', corr: ['1518', '3906'], term: '5-1', estado: 'pendiente' },
  { id: '5903', codigo: '5903', nombre: 'Tecnologías Avanzadas', area: 'tecnica', corr: ['4904', '3909', '3908'], term: '5-1', estado: 'pendiente' },
  { id: 'campo-2', codigo: null, nombre: '', area: 'electivas', corr: [], term: '5-1', estado: 'pendiente', esElectiva: true, slotLabel: 'Curso Optativo del Campo Menor' },
  { id: 'campo-3', codigo: null, nombre: '', area: 'electivas', corr: [], term: '5-1', estado: 'pendiente', esElectiva: true, slotLabel: 'Curso Optativo del Campo Menor' },

  // ---------- AÑO 5 · Semestre 2 ----------
  { id: '5904', codigo: '5904', nombre: 'Tesis Proyectual - Segunda Parte', area: 'proyecto', corr: ['5901'], term: '5-2', estado: 'pendiente' },
  { id: '5902', codigo: '5902', nombre: 'Dirección de Obras', area: 'tecnica', corr: ['3908', '3909', '4904'], term: '5-2', estado: 'pendiente' },
  { id: '5907', codigo: '5907', nombre: 'Ética Profesional', area: 'gestion', corr: ['1518', '3906'], term: '5-2', estado: 'pendiente' },
  { id: '5910', codigo: '5910', nombre: 'Práctica Profesional', area: 'gestion', corr: ['3903', '3907', '3909', '3910', '4901'], term: '5-2', estado: 'pendiente' },
  { id: 'campo-4', codigo: null, nombre: '', area: 'electivas', corr: [], term: '5-2', estado: 'pendiente', esElectiva: true, slotLabel: 'Curso Optativo del Campo Menor' },
];

export const arquitectura: CarreraPlan = {
  id: 'arquitectura',
  label: 'Arquitectura',
  notaAprobacion: 6,
  areas,
  terms,
  subjects,
};
