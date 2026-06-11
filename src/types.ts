/* Modelo de dominio — ver Specs/02-PRD.md §2 */

export type AreaId = 'negocios' | 'economia' | 'datos' | 'electivas';

export type Estado =
  | 'pendiente'
  | 'en-curso'
  | 'aprobada'
  | 'desaprobada'
  | 'desinscripta';

export interface Area {
  id: AreaId;
  label: string;
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
  area: AreaId;
  /** ids de materias que deben estar aprobadas/completadas antes */
  corr: string[];
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
