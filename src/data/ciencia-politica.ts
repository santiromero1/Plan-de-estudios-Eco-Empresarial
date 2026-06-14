/* ============================================================
   ciencia-politica.ts — Plan oficial de la Lic. en Ciencia
   Política y Gobierno (UTDT), Plan 2025. Carrera de 4 años.
   Fuente: PDF oficial "Ciencia Política y Gobierno (Ingresantes 2025)".
   - Tronco común años 1-3; en 4° el alumno elige UNA orientación
     (Ciencia Política con campo menor / Gestión Pública).
   - Las obligatorias de 4° requieren todo 1° y 2° aprobado → reqHasta: 2.
   - Las áreas NO vienen en el material; se diseñaron para esta app.
   ============================================================ */

import type { AreaDef, CarreraPlan, Orientacion, Subject, Term } from '../types';

const areas: AreaDef[] = [
  { id: 'teoria', label: 'Teoría Política', color: '#6b2fb3', tint: '#ece4f8', tint2: '#dfd0f1' },
  { id: 'politica', label: 'Política Argentina y Comparada', color: '#e6007e', tint: '#fce4f0', tint2: '#f9d2e6' },
  { id: 'rrii', label: 'Relaciones Internacionales', color: '#2d7ff9', tint: '#e2edfe', tint2: '#cfe0fc' },
  { id: 'publicas', label: 'Políticas Públicas y Estado', color: '#1fa97b', tint: '#e1f5ee', tint2: '#c9ebde' },
  { id: 'metodos', label: 'Métodos y Economía', color: '#00a3c4', tint: '#dcf1f7', tint2: '#c5e8f1' },
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

// ---------- TRONCO COMÚN (años 1-3) ----------
const subjects: Subject[] = [
  // AÑO 1 · Semestre 1
  { id: '1502', codigo: '1502', nombre: 'Introducción a la Ciencia Política', area: 'politica', corr: [], term: '1-1', estado: 'pendiente' },
  { id: '1519', codigo: '1519', nombre: 'Introducción a las Relaciones Internacionales', area: 'rrii', corr: [], term: '1-1', estado: 'pendiente' },
  { id: '1101', codigo: '1101', nombre: 'Economía I', area: 'metodos', corr: [], term: '1-1', estado: 'pendiente' },
  { id: '1204', codigo: '1204', nombre: 'Matemática I', area: 'metodos', corr: [], term: '1-1', estado: 'pendiente' },
  { id: '9003', codigo: '9003', nombre: 'Comprensión de Textos y Escritura', area: 'metodos', corr: [], term: '1-1', estado: 'pendiente' },

  // AÑO 1 · Semestre 2
  { id: '1503', codigo: '1503', nombre: 'Lógica y Técnicas de Investigación en Ciencias Sociales', area: 'metodos', corr: [], term: '1-2', estado: 'pendiente' },
  { id: '2505', codigo: '2505', nombre: 'Teoría Política I', area: 'teoria', corr: [], term: '1-2', estado: 'pendiente' },
  { id: '1408', codigo: '1408', nombre: 'Historia de Occidente a partir de la Modernidad', area: 'teoria', corr: [], term: '1-2', estado: 'pendiente' },
  { id: '1205', codigo: '1205', nombre: 'Matemática II', area: 'metodos', corr: ['1204'], term: '1-2', estado: 'pendiente' },

  // AÑO 2 · Semestre 1
  { id: '2504', codigo: '2504', nombre: 'Política Comparada', area: 'politica', corr: [], term: '2-1', estado: 'pendiente' },
  { id: '2522', codigo: '2522', nombre: 'Política y Sociedad en la Argentina (S. XIX y XX)', area: 'politica', corr: [], term: '2-1', estado: 'pendiente' },
  { id: '2524', codigo: '2524', nombre: 'Historia del Mundo Contemporáneo (1914-2000)', area: 'rrii', corr: [], term: '2-1', estado: 'pendiente' },
  { id: '1104', codigo: '1104', nombre: 'Economía II', area: 'metodos', corr: ['1101'], term: '2-1', estado: 'pendiente' },

  // AÑO 2 · Semestre 2
  { id: '3510', codigo: '3510', nombre: 'Introducción a las Políticas Públicas', area: 'publicas', corr: [], term: '2-2', estado: 'pendiente' },
  { id: '2521', codigo: '2521', nombre: 'Política y Sociedad en América Latina', area: 'politica', corr: [], term: '2-2', estado: 'pendiente' },
  { id: '3507', codigo: '3507', nombre: 'Teoría Política II', area: 'teoria', corr: ['2505'], term: '2-2', estado: 'pendiente' },
  { id: '4513', codigo: '4513', nombre: 'Teoría de las Relaciones Internacionales', area: 'rrii', corr: [], term: '2-2', estado: 'pendiente' },

  // AÑO 3 · Semestre 1
  { id: '2526', codigo: '2526', nombre: 'Diseño y Metodología de las Ciencias Sociales', area: 'metodos', corr: [], term: '3-1', estado: 'pendiente' },
  { id: '2520', codigo: '2520', nombre: 'Organizaciones y Teoría de la Decisión', area: 'publicas', corr: [], term: '3-1', estado: 'pendiente' },
  { id: '3508', codigo: '3508', nombre: 'Política y Economía', area: 'publicas', corr: [], term: '3-1', estado: 'pendiente' },
  { id: '4527', codigo: '4527', nombre: 'Estructura Social y Demografía', area: 'politica', corr: [], term: '3-1', estado: 'pendiente' },
  { id: '9004', codigo: '9004', nombre: 'Expresión Oral y Escrita', area: 'metodos', corr: [], term: '3-1', estado: 'pendiente' },

  // AÑO 3 · Semestre 2
  { id: '2525', codigo: '2525', nombre: 'Estadística para las Ciencias Sociales', area: 'metodos', corr: [], term: '3-2', estado: 'pendiente' },
  { id: '2503', codigo: '2503', nombre: 'Política y Derecho', area: 'publicas', corr: [], term: '3-2', estado: 'pendiente' },
  { id: '3523', codigo: '3523', nombre: 'Política y Comunicación', area: 'publicas', corr: [], term: '3-2', estado: 'pendiente' },
  { id: '3522', codigo: '3522', nombre: 'Estado y Políticas Públicas en Argentina', area: 'publicas', corr: [], term: '3-2', estado: 'pendiente' },
];

// ---------- AÑO 4 · Orientación en Ciencia Política (con campo menor) ----------
const orientCienciaPolitica: Orientacion = {
  id: 'ciencia-politica',
  label: 'Ciencia Política',
  subjects: [
    { id: '4536', codigo: '4536', nombre: 'Finanzas Públicas', area: 'publicas', corr: [], reqHasta: 2, term: '4-1', estado: 'pendiente' },
    { id: '4524', codigo: '4524', nombre: 'Política Económica Argentina', area: 'publicas', corr: [], reqHasta: 2, term: '4-1', estado: 'pendiente' },
    { id: 'campo-1', codigo: null, nombre: '', area: 'electivas', corr: [], term: '4-1', estado: 'pendiente', esElectiva: true, slotLabel: 'Curso de Campo Menor' },
    { id: 'campo-2', codigo: null, nombre: '', area: 'electivas', corr: [], term: '4-1', estado: 'pendiente', esElectiva: true, slotLabel: 'Curso de Campo Menor' },

    { id: '4537', codigo: '4537', nombre: 'Tópicos de Teoría Política Social', area: 'teoria', corr: [], reqHasta: 2, term: '4-2', estado: 'pendiente' },
    { id: '4514', codigo: '4514', nombre: 'Actores y Procesos Políticos', area: 'politica', corr: [], reqHasta: 2, term: '4-2', estado: 'pendiente' },
    { id: 'campo-3', codigo: null, nombre: '', area: 'electivas', corr: [], term: '4-2', estado: 'pendiente', esElectiva: true, slotLabel: 'Curso de Campo Menor' },
    { id: 'campo-4', codigo: null, nombre: '', area: 'electivas', corr: [], term: '4-2', estado: 'pendiente', esElectiva: true, slotLabel: 'Curso de Campo Menor' },
    { id: '5604', codigo: '5604', nombre: 'Seminario de Graduación', area: 'metodos', corr: [], reqHasta: 2, term: '4-2', estado: 'pendiente' },
  ],
};

// ---------- AÑO 4 · Orientación en Gestión Pública ----------
const orientGestionPublica: Orientacion = {
  id: 'gestion-publica',
  label: 'Gestión Pública',
  subjects: [
    { id: '4536', codigo: '4536', nombre: 'Finanzas Públicas', area: 'publicas', corr: [], reqHasta: 2, term: '4-1', estado: 'pendiente' },
    { id: '4524', codigo: '4524', nombre: 'Política Económica Argentina', area: 'publicas', corr: [], reqHasta: 2, term: '4-1', estado: 'pendiente' },
    { id: '4560', codigo: '4560', nombre: 'Estructura del Sector Público', area: 'publicas', corr: [], reqHasta: 2, term: '4-1', estado: 'pendiente' },
    { id: '4561', codigo: '4561', nombre: 'Policy Lab: Políticas Públicas Sectoriales', area: 'publicas', corr: [], reqHasta: 2, term: '4-1', estado: 'pendiente' },

    { id: '4543', codigo: '4543', nombre: 'Políticas Públicas Comparadas', area: 'publicas', corr: [], reqHasta: 2, term: '4-2', estado: 'pendiente' },
    { id: '4562', codigo: '4562', nombre: 'Evaluación de Políticas Públicas', area: 'publicas', corr: [], reqHasta: 2, term: '4-2', estado: 'pendiente' },
    { id: '4354', codigo: '4354', nombre: 'Comportamiento Organizacional', area: 'publicas', corr: [], reqHasta: 2, term: '4-2', estado: 'pendiente' },
    { id: '4563-64', codigo: '4563/4564', nombre: 'E-Government y Transparencia Pública · o · Datos para Cientistas Sociales', area: 'publicas', corr: [], reqHasta: 2, term: '4-2', estado: 'pendiente' },
    { id: '5604', codigo: '5604', nombre: 'Seminario de Graduación', area: 'metodos', corr: [], reqHasta: 2, term: '4-2', estado: 'pendiente' },
  ],
};

export const cienciaPolitica: CarreraPlan = {
  id: 'ciencia-politica',
  label: 'Ciencia Política y Gobierno',
  notaAprobacion: 6,
  areas,
  terms,
  subjects,
  orientaciones: [orientCienciaPolitica, orientGestionPublica],
};
