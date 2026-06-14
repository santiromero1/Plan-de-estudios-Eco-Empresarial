/* ============================================================
   ciencias-sociales.ts — Plan oficial de la Lic. en Ciencias
   Sociales (UTDT), ingresantes 2025. Carrera de 4 años.
   Fuente: PDF oficial (grilla con códigos/correlativas) + folletos
   de orientación (listas de electivas).
   Estructura: tronco común (años 1-2 + parte de 3-4) y 5 ORIENTACIONES
   (Sociedad y Mercados, Desarrollo Social y Económico, Comunicación y
   Periodismo, Historia y Cultura, Arte). El alumno elige una con el
   toggle de orientación.
   - Cada orientación tiene sus materias fijas (estadística, micro/macro,
     seminarios) según la grilla del PDF.
   - Las "Materias de Orientación" son slots editables con un desplegable
     (opciones) tomado del folleto de cada rama.
   - Las "Electivas de Ciclo Común" son slots editables libres (el folleto
     no publica su lista).
   ⚠️ El PDF y los folletos tienen algunas inconsistencias; esta es una
   transcripción de mejor esfuerzo. Conviene verificar las materias fijas
   por orientación.
   ============================================================ */

import type { AreaDef, CarreraPlan, Orientacion, Subject, Term } from '../types';

const areas: AreaDef[] = [
  { id: 'historia', label: 'Historia', color: '#6b2fb3', tint: '#ece4f8', tint2: '#dfd0f1' },
  { id: 'politica', label: 'Política y Sociedad', color: '#e6007e', tint: '#fce4f0', tint2: '#f9d2e6' },
  { id: 'economia', label: 'Economía y Métodos', color: '#00a3c4', tint: '#dcf1f7', tint2: '#c5e8f1' },
  { id: 'humanidades', label: 'Humanidades y Cultura', color: '#1fa97b', tint: '#e1f5ee', tint2: '#c9ebde' },
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

// ---------- TRONCO COMÚN ----------
const subjects: Subject[] = [
  // AÑO 1 · Semestre 1
  { id: '1005', codigo: '1005', nombre: 'La Modernidad en Occidente', area: 'historia', corr: [], term: '1-1', estado: 'pendiente' },
  { id: '1502', codigo: '1502', nombre: 'Introducción a la Ciencia Política', area: 'politica', corr: [], term: '1-1', estado: 'pendiente' },
  { id: '1204', codigo: '1204', nombre: 'Matemática I', area: 'economia', corr: [], term: '1-1', estado: 'pendiente' },
  { id: '1101', codigo: '1101', nombre: 'Economía I', area: 'economia', corr: [], term: '1-1', estado: 'pendiente' },
  { id: '9003', codigo: '9003', nombre: 'Comprensión de Texto y Escritura', area: 'humanidades', corr: [], term: '1-1', estado: 'pendiente' },

  // AÑO 1 · Semestre 2
  { id: '1008', codigo: '1008', nombre: 'Lógica y Técnicas de la Investigación en Ciencias Sociales', area: 'humanidades', corr: [], term: '1-2', estado: 'pendiente' },
  { id: '1001', codigo: '1001', nombre: 'Problemas Filosóficos', area: 'humanidades', corr: [], term: '1-2', estado: 'pendiente' },
  { id: '2004', codigo: '2004', nombre: 'El Mundo en el Siglo XIX', area: 'historia', corr: ['1005'], term: '1-2', estado: 'pendiente' },
  { id: '1007', codigo: '1007', nombre: 'Economía II', area: 'economia', corr: [], term: '1-2', estado: 'pendiente' },

  // AÑO 2 · Semestre 1
  { id: '3003', codigo: '3003', nombre: 'Sociología', area: 'politica', corr: [], term: '2-1', estado: 'pendiente' },
  { id: '1006', codigo: '1006', nombre: 'Argentina en el Siglo XIX', area: 'historia', corr: [], term: '2-1', estado: 'pendiente' },
  { id: '3005', codigo: '3005', nombre: 'Estudio del Comportamiento Humano', area: 'politica', corr: [], term: '2-1', estado: 'pendiente' },
  { id: '3923', codigo: '3923', nombre: 'Arte Contemporáneo', area: 'humanidades', corr: [], term: '2-1', estado: 'pendiente' },

  // AÑO 2 · Semestre 2
  { id: '3001', codigo: '3001', nombre: 'Antropología', area: 'politica', corr: [], term: '2-2', estado: 'pendiente' },
  { id: '3004', codigo: '3004', nombre: 'El Mundo en el Siglo XX', area: 'historia', corr: ['2004'], term: '2-2', estado: 'pendiente' },
  { id: '1004', codigo: '1004', nombre: 'Historia de las Ideas Políticas', area: 'historia', corr: [], term: '2-2', estado: 'pendiente' },
  { id: '2106', codigo: '2106', nombre: 'Historia Económica Internacional', area: 'economia', corr: ['1101'], term: '2-2', estado: 'pendiente' },

  // AÑO 3 · Semestre 1 (común)
  { id: '2003', codigo: '2003', nombre: 'Argentina en el Siglo XX', area: 'historia', corr: ['1006'], term: '3-1', estado: 'pendiente' },
  { id: '3002', codigo: '3002', nombre: 'Política Económica Argentina', area: 'economia', corr: [], term: '3-1', estado: 'pendiente' },
  { id: '9004', codigo: '9004', nombre: 'Expresión Oral', area: 'humanidades', corr: [], term: '3-1', estado: 'pendiente' },

  // AÑO 3 · Semestre 2 (común)
  { id: '2006', codigo: '2006', nombre: 'Estructura Social y Demografía', area: 'politica', corr: [], term: '3-2', estado: 'pendiente' },

  // AÑO 4 · Semestre 2 (común)
  { id: '4000', codigo: '4000', nombre: 'Seminario de Graduación', area: 'humanidades', corr: [], term: '4-2', estado: 'pendiente' },
];

// ---------- Listas de electivas de orientación (desplegables) ----------
const OPC_SYM = [
  'Investigación de Mercado', 'Marketing', 'Marketing Digital', 'Análisis de Datos para Cientistas Sociales',
  'Recursos Humanos', 'Liderazgo y Negociación', 'Métodos Analíticos Aplicados a los Negocios',
  'Negocios Sustentables y Finanzas de Impacto', 'Negocios con Impacto Social', 'Comportamiento del Consumidor',
  'Neurociencia y Psicología Experimental', 'Comportamiento Humano y Diseño Sistémico', 'Comportamiento Organizacional',
  'Comunicación, Redes y Plataformas', 'Arte y Mercado', 'Innovación', 'Opinión Pública', 'Comunicación Estratégica',
];
const OPC_DESARROLLO = [
  'Política y Economía', 'Introducción a las Políticas Públicas', 'Género y Políticas Públicas', 'Finanzas Públicas',
  'Historia del Pensamiento Económico', 'La Política Económica en la Práctica', 'Teoría General del Derecho',
  'Inteligencia Artificial, Ética y Democracia', 'Actores y Procesos Políticos', 'El Cambio Climático como Problema Global',
  'Desafíos Globales Contemporáneos: Pobreza, Desigualdad e Inmigración', 'Opinión Pública', 'Filosofía Política',
  'Política Europea', 'Geopolítica de Asia y el Pacífico', 'Análisis de Datos para Cientistas Sociales',
  'Diseño y Evaluación de Políticas Públicas', 'Gobierno Electrónico y Transparencia Pública', 'Organizaciones y Teoría de la Decisión',
];
const OPC_CYP = [
  'Introducción al Periodismo', 'Política y Comunicación', 'Investigación Periodística', 'Redacción y Edición Periodística',
  'Periodismo Beat: Incubadora de Medios', 'Opinión Pública', 'Neurociencia y Psicología Experimental', 'Marketing Digital',
  'Investigación de Mercado', 'Comportamiento del Consumidor', 'Análisis de Datos para Cientistas Sociales', 'Humanidades Digitales',
  'Desafíos Globales Contemporáneos: Pobreza, Desigualdad e Inmigración', 'El Cambio Climático como Problema Global',
  'Política Exterior Argentina', 'Comunicación Estratégica', 'Innovación y Emprendedurismo', 'Visualización y Análisis de Datos',
  'Historia Contemporánea de América Latina',
];
const OPC_HYC = [
  'Historia y Cultura', 'Historia de la Ciencia y la Técnica', 'Historia del Arte', 'Historia Contemporánea de América Latina',
  'Historia de América Latina en el Siglo XIX', 'Historia de Asia y África', 'Historia de los Estados Unidos',
  'Escritura Creativa Multiplataforma', 'Literatura Argentina', 'Ideas y Cultura en Argentina', 'Moda, Música y Cine de América Latina',
  'Humanidades Digitales', 'Arte y Mercado', 'Arte Latinoamericano desde Buenos Aires', 'Arte y Cultura de la Modernidad',
  'Neurociencia del Aprendizaje', 'Imaginarios de la Ciudad Moderna en las Américas', 'Prácticas Museográficas',
  'Creer, Pertenecer y Practicar: Religiones y Espiritualidad en las Américas',
];
const OPC_ARTE = [
  'Crítica de Arte', 'Creatividad y Estética', 'Fronteras del Pensamiento Contemporáneo', 'Taller de Arte Avanzado',
  'Investigación Artística: Archivos y Museos', 'Introducción a la Gestión Cultural', 'Arte y Mercado', 'Historia del Arte II',
  'Curaduría Avanzada', 'Arte y Cultura de la Modernidad', 'Introducción a los Estudios Visuales', 'Forma e Imagen',
  'Comunicación, Redes y Plataformas', 'Literatura Argentina', 'Arte Latinoamericano desde Buenos Aires',
];

// Helpers para generar slots editables
function ccSlot(id: string, term: string): Subject {
  return { id, codigo: null, nombre: '', area: 'electivas', corr: [], term, estado: 'pendiente', esElectiva: true, slotLabel: 'Electiva de Ciclo Común' };
}
function orientSlot(id: string, term: string, opciones: string[]): Subject {
  return { id, codigo: null, nombre: '', area: 'electivas', corr: [], term, estado: 'pendiente', esElectiva: true, slotLabel: 'Materia de Orientación', opciones };
}

// ---------- ORIENTACIONES (años 3-4 según la grilla del PDF) ----------
const oSociedadMercados: Orientacion = {
  id: 'sociedad-mercados',
  label: 'Sociedad y Mercados',
  subjects: [
    { id: '1205', codigo: '1205', nombre: 'Matemática II', area: 'economia', corr: ['1204'], term: '3-1', estado: 'pendiente' },
    ccSlot('sym-cc1', '3-1'),
    { id: '2203', codigo: '2203', nombre: 'Introducción a la Estadística', area: 'economia', corr: ['1205'], term: '3-2', estado: 'pendiente' },
    ccSlot('sym-cc2', '3-2'), ccSlot('sym-cc3', '3-2'),
    { id: '2205', codigo: '2205', nombre: 'Análisis Estadístico', area: 'economia', corr: ['1205'], term: '4-1', estado: 'pendiente' },
    orientSlot('sym-o1', '4-1', OPC_SYM), orientSlot('sym-o2', '4-1', OPC_SYM), orientSlot('sym-o3', '4-1', OPC_SYM),
    { id: '3308', codigo: '3308', nombre: 'Métodos Estadísticos Aplicados a los Negocios', area: 'economia', corr: ['2205'], term: '4-2', estado: 'pendiente' },
    orientSlot('sym-o4', '4-2', OPC_SYM), orientSlot('sym-o5', '4-2', OPC_SYM), orientSlot('sym-o6', '4-2', OPC_SYM),
  ],
};

const oDesarrollo: Orientacion = {
  id: 'desarrollo-social-economico',
  label: 'Desarrollo Social y Económico',
  subjects: [
    { id: '1205', codigo: '1205', nombre: 'Matemática II', area: 'economia', corr: ['1204'], term: '3-1', estado: 'pendiente' },
    ccSlot('des-cc1', '3-1'),
    { id: '2203', codigo: '2203', nombre: 'Introducción a la Estadística', area: 'economia', corr: ['1205'], term: '3-2', estado: 'pendiente' },
    ccSlot('des-cc2', '3-2'), ccSlot('des-cc3', '3-2'),
    { id: '2205', codigo: '2205', nombre: 'Análisis Estadístico', area: 'economia', corr: ['1205'], term: '4-1', estado: 'pendiente' },
    { id: '2103', codigo: '2103', nombre: 'Microeconomía', area: 'economia', corr: ['1101'], term: '4-1', estado: 'pendiente' },
    orientSlot('des-o1', '4-1', OPC_DESARROLLO), orientSlot('des-o2', '4-1', OPC_DESARROLLO),
    { id: '3308', codigo: '3308', nombre: 'Métodos Estadísticos Aplicados', area: 'economia', corr: ['2205'], term: '4-2', estado: 'pendiente' },
    { id: '2104', codigo: '2104', nombre: 'Macroeconomía', area: 'economia', corr: ['1007'], term: '4-2', estado: 'pendiente' },
    orientSlot('des-o3', '4-2', OPC_DESARROLLO), orientSlot('des-o4', '4-2', OPC_DESARROLLO),
  ],
};

const oComunicacion: Orientacion = {
  id: 'comunicacion-periodismo',
  label: 'Comunicación y Periodismo',
  subjects: [
    ccSlot('cyp-cc1', '3-1'), ccSlot('cyp-cc2', '3-1'),
    { id: '2525', codigo: '2525', nombre: 'Estadística para Ciencias Sociales', area: 'economia', corr: ['1204'], term: '3-2', estado: 'pendiente' },
    ccSlot('cyp-cc3', '3-2'), ccSlot('cyp-cc4', '3-2'),
    orientSlot('cyp-o1', '4-1', OPC_CYP), orientSlot('cyp-o2', '4-1', OPC_CYP), orientSlot('cyp-o3', '4-1', OPC_CYP), orientSlot('cyp-o4', '4-1', OPC_CYP),
    { id: '3925', codigo: '3925', nombre: 'Seminario de Comunicación y Periodismo', area: 'humanidades', corr: [], term: '4-2', estado: 'pendiente' },
    orientSlot('cyp-o5', '4-2', OPC_CYP), orientSlot('cyp-o6', '4-2', OPC_CYP), orientSlot('cyp-o7', '4-2', OPC_CYP),
  ],
};

const oHistoria: Orientacion = {
  id: 'historia-cultura',
  label: 'Historia y Cultura',
  subjects: [
    ccSlot('hyc-cc1', '3-1'), ccSlot('hyc-cc2', '3-1'),
    { id: '2525', codigo: '2525', nombre: 'Estadística para Ciencias Sociales', area: 'economia', corr: ['1204'], term: '3-2', estado: 'pendiente' },
    ccSlot('hyc-cc3', '3-2'), ccSlot('hyc-cc4', '3-2'),
    orientSlot('hyc-o1', '4-1', OPC_HYC), orientSlot('hyc-o2', '4-1', OPC_HYC), orientSlot('hyc-o3', '4-1', OPC_HYC), orientSlot('hyc-o4', '4-1', OPC_HYC),
    { id: '3927', codigo: '3927', nombre: 'Seminario de Historia Pública y Digital', area: 'historia', corr: [], term: '4-2', estado: 'pendiente' },
    orientSlot('hyc-o5', '4-2', OPC_HYC), orientSlot('hyc-o6', '4-2', OPC_HYC), orientSlot('hyc-o7', '4-2', OPC_HYC),
  ],
};

const oArte: Orientacion = {
  id: 'arte',
  label: 'Arte',
  subjects: [
    ccSlot('art-cc1', '3-1'), ccSlot('art-cc2', '3-1'),
    ccSlot('art-cc3', '3-2'), ccSlot('art-cc4', '3-2'), ccSlot('art-cc5', '3-2'),
    orientSlot('art-o1', '4-1', OPC_ARTE), orientSlot('art-o2', '4-1', OPC_ARTE), orientSlot('art-o3', '4-1', OPC_ARTE), orientSlot('art-o4', '4-1', OPC_ARTE),
    orientSlot('art-o5', '4-2', OPC_ARTE), orientSlot('art-o6', '4-2', OPC_ARTE), orientSlot('art-o7', '4-2', OPC_ARTE), orientSlot('art-o8', '4-2', OPC_ARTE),
  ],
};

export const cienciasSociales: CarreraPlan = {
  id: 'ciencias-sociales',
  label: 'Ciencias Sociales',
  notaAprobacion: 6,
  areas,
  terms,
  subjects,
  orientaciones: [oSociedadMercados, oDesarrollo, oComunicacion, oHistoria, oArte],
};
