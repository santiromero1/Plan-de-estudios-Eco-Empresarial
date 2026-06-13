/* Modelo de dominio — ver Specs/02-PRD.md §2 */

/** id de área, único dentro de una carrera (ya no es una unión fija:
    cada carrera define sus propias áreas). */
export type AreaId = string;

export type Estado =
  | 'pendiente'
  | 'en-curso'
  | 'aprobada'
  | 'desaprobada'
  | 'desinscripta';

/** Área temática de una carrera, con sus colores (viajan con la data
    para que cada carrera tenga su propia paleta). */
export interface AreaDef {
  id: AreaId;
  label: string;
  /** color de acento (borde, dot) */
  color: string;
  /** fondo de la card */
  tint: string;
  /** fondo más saturado (estados activos); opcional */
  tint2?: string;
}

export interface Term {
  id: string; // ej. "1-1" (año 1, sem 1) | "extra-1"
  anio: number; // 1..4 (9 = extra)
  semestre: 1 | 2;
  orden: number; // índice lineal global para comparar tiempo
  esExtra: boolean;
}

export interface Subject {
  id: string; // = código del plan, o uid para electivas
  codigo: string | null;
  nombre: string;
  area: AreaId; // id de un área de la carrera
  /** ids de materias que deben estar aprobadas/completadas antes */
  corr: string[];
  /** ids de correlativas RECOMENDADAS (no obligatorias; no generan alertas,
      sólo se informan en el panel de la materia). */
  corrRec?: string[];
  /** cuatrimestre donde está ubicada */
  term: string;
  estado: Estado;
  nota?: number | null;
  /** materia anual: abarca los dos semestres del año */
  anual?: boolean;
  /** slot de electiva editable */
  esElectiva?: boolean;
  slotLabel?: string;
  /** opciones predefinidas para elegir el nombre (ej. electiva del Núcleo Digital) */
  opciones?: string[];
}

export interface Conflict {
  subject: Subject;
  faltan: Subject[];
}

export interface PlanSummary {
  promedio: number | null;
  aprobadas: number;
  total: number;
  restantes: number;
  alertas: Conflict[];
}

/** Plan oficial completo de una carrera (áreas, grilla de años y materias). */
export interface CarreraPlan {
  id: string; // id de carrera (coincide con CARRERAS en auth.ts)
  label: string; // nombre para mostrar (ej. "Economía Empresarial")
  notaAprobacion: number;
  areas: AreaDef[];
  terms: Term[];
  subjects: Subject[];
}
