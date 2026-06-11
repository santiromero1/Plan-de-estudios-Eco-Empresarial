/* ============================================================
   data.js — Modelo de datos del Planificador de Cursada
   Lic. en Economía Empresarial (UTDT) — Plan 2021
   Data real del plan + estados de DEMO para mostrar todos
   los casos de tarjeta. Pensado para portar a React+TS.
   ============================================================ */

// --- Áreas de negocio (colores en styles.css) ---
const AREAS = {
  negocios:  { id: 'negocios',  label: 'Negocios' },
  economia:  { id: 'economia',  label: 'Economía y Cs. Sociales' },
  datos:     { id: 'datos',     label: 'Datos y Análisis Cuantitativo' },
  electivas: { id: 'electivas', label: 'Electivas' },
};

// --- Cuatrimestres / bloques (orden lineal global) ---
const TERMS = [
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

const NOTA_APROBACION = 6;

/* Materias.
   estado: pendiente | en-curso | aprobada | desaprobada | desinscripta
   Los estados de DEMO están elegidos para mostrar:
   - varias aprobadas con nota (promedio)
   - en-curso
   - una ANUAL (Matemática I, abarca el año 1)
   - un CONFLICTO por anual en cascada (Matemática II)
   - un CONFLICTO por mover materia antes que su correlativa (Métodos Analíticos)
   - una DESAPROBADA movida a EXTRA para recursar (Economía Matemática)
   - una DESINSCRIPTA (Comprensión de Textos)
   - ELECTIVAS: una completada y dos placeholders editables
*/
const SUBJECTS = [
  // ---------- AÑO 1 ----------
  { id: '1201', codigo: '1201', nombre: 'Matemática I',                 area: 'datos',    corr: [],                term: '1-1', estado: 'aprobada', nota: 8, anual: true },
  { id: '1101', codigo: '1101', nombre: 'Economía I',                   area: 'economia', corr: [],                term: '1-1', estado: 'aprobada', nota: 9 },
  { id: '1302', codigo: '1302', nombre: 'Administración I',             area: 'negocios', corr: [],                term: '1-1', estado: 'aprobada', nota: 7 },
  { id: '2002', codigo: '2002', nombre: 'Introducción al Derecho',      area: 'economia', corr: [],                term: '1-1', estado: 'aprobada', nota: 6 },

  { id: '1202', codigo: '1202', nombre: 'Matemática II',                area: 'datos',    corr: ['1201'],          term: '1-2', estado: 'en-curso' },
  { id: '1102', codigo: '1102', nombre: 'Economía II',                  area: 'economia', corr: [],                term: '1-2', estado: 'aprobada', nota: 8 },
  { id: '1301', codigo: '1301', nombre: 'Contabilidad Básica',          area: 'negocios', corr: [],                term: '1-2', estado: 'aprobada', nota: 10 },
  { id: '1401', codigo: '1401', nombre: 'Historia de Occidente',        area: 'economia', corr: [],                term: '1-2', estado: 'aprobada', nota: 7 },
  { id: '9003', codigo: '9003', nombre: 'Comprensión de Textos y Escritura', area: 'economia', corr: [],          term: '1-2', estado: 'desinscripta' },

  // ---------- AÑO 2 ----------
  { id: '2203', codigo: '2203', nombre: 'Introducción a la Estadística', area: 'datos',   corr: ['1202'],          term: '2-1', estado: 'en-curso' },
  { id: '2103', codigo: '2103', nombre: 'Microeconomía',                area: 'economia', corr: ['1101'],          term: '2-1', estado: 'en-curso' },
  { id: '1303', codigo: '1303', nombre: 'Info. y Contab. Gerencial I',  area: 'negocios', corr: ['1301'],          term: '2-1', estado: 'pendiente' },
  // Conflicto: movida acá (antes de que se complete su correlativa Microeconomía)
  { id: '3313', codigo: '3313', nombre: 'Métodos Analíticos a los Negocios', area: 'datos', corr: ['2103'],        term: '2-1', estado: 'pendiente' },

  { id: '2205', codigo: '2205', nombre: 'Análisis Estadístico',         area: 'datos',    corr: ['2203'],          term: '2-2', estado: 'pendiente' },
  { id: '1501', codigo: '1501', nombre: 'Instituciones Políticas y de Gobierno', area: 'economia', corr: [],       term: '2-2', estado: 'pendiente' },
  { id: '2106', codigo: '2106', nombre: 'Historia Económica Internacional', area: 'economia', corr: [],            term: '2-2', estado: 'pendiente' },
  { id: '3312', codigo: '3312', nombre: 'Info. y Contab. Gerencial II', area: 'negocios', corr: ['1303'],          term: '2-2', estado: 'pendiente' },

  // ---------- AÑO 3 ----------
  { id: '2104', codigo: '2104', nombre: 'Macroeconomía',                area: 'economia', corr: ['1102'],          term: '3-1', estado: 'pendiente' },
  { id: '3308', codigo: '3308', nombre: 'Métodos Estadísticos a los Negocios', area: 'datos', corr: ['2205'],      term: '3-1', estado: 'pendiente' },
  { id: '4327', codigo: '4327', nombre: 'Marketing',                    area: 'negocios', corr: ['1101'],          term: '3-1', estado: 'pendiente' },

  { id: '3306', codigo: '3306', nombre: 'Riesgo, Incertidumbre y Finanzas', area: 'negocios', corr: ['2103'],      term: '3-2', estado: 'pendiente' },
  { id: '3303', codigo: '3303', nombre: 'Teoría de las Decisiones',     area: 'datos',    corr: ['2103'],          term: '3-2', estado: 'pendiente' },
  { id: '3311', codigo: '3311', nombre: 'Dir. de Operaciones y Tec. I', area: 'negocios', corr: ['3306', '3312'], term: '3-2', estado: 'pendiente' },
  { id: 'elec-dig', codigo: null, nombre: '', area: 'electivas', corr: [], term: '3-2', estado: 'pendiente', esElectiva: true, slotLabel: 'Electiva — Núcleo Digital' },

  // ---------- AÑO 4 ----------
  { id: '9004', codigo: '9004', nombre: 'Expresión Oral y Escrita',     area: 'economia', corr: [],                term: '4-1', estado: 'pendiente' },
  { id: '4311', codigo: '4311', nombre: 'Finanzas Internacionales',     area: 'negocios', corr: ['3306'],          term: '4-1', estado: 'pendiente' },
  { id: '4308', codigo: '4308', nombre: 'Finanzas de la Empresa',       area: 'negocios', corr: ['3306', '3312'], term: '4-1', estado: 'pendiente' },
  { id: 'campo-1', codigo: null, nombre: 'Comportamiento Organizacional', area: 'electivas', corr: [], term: '4-1', estado: 'aprobada', nota: 9, esElectiva: true, slotLabel: 'Electiva — Campo Menor' },

  { id: '4326', codigo: '4326', nombre: 'Desarrollo de Nuevos Negocios', area: 'negocios', corr: ['1302', '3312', '3306'], term: '4-2', estado: 'pendiente' },
  { id: '4368', codigo: '4368', nombre: 'Estrategia Competitiva y Digital', area: 'negocios', corr: ['2103'],      term: '4-2', estado: 'pendiente' },
  { id: '4337', codigo: '4337', nombre: 'Dir. de Operaciones y Tec. II', area: 'negocios', corr: ['3313', '3311'], term: '4-2', estado: 'pendiente' },
  { id: 'campo-2', codigo: null, nombre: '', area: 'electivas', corr: [], term: '4-2', estado: 'pendiente', esElectiva: true, slotLabel: 'Electiva — Campo Menor' },

  // ---------- EXTRA (recursadas / corridas) ----------
  { id: '2204', codigo: '2204', nombre: 'Economía Matemática',          area: 'datos',    corr: ['1202'],          term: 'extra-1', estado: 'desaprobada' },
];

// Mapa de correlatividad inversa (qué habilita cada materia) — para el timeline
function buildDependents(subjects) {
  const map = {};
  subjects.forEach(s => { map[s.id] = []; });
  subjects.forEach(s => {
    (s.corr || []).forEach(c => {
      if (map[c]) map[c].push(s.id);
    });
  });
  return map;
}

window.PLAN = { AREAS, TERMS, SUBJECTS, NOTA_APROBACION, buildDependents };
