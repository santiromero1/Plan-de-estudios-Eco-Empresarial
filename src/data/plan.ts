import type { AreaId, Subject } from '../types'

/**
 * Plan de Estudios 2021 — Licenciatura en Economía Empresarial (UTDT).
 * `year`/`sem` representan la ubicación SUGERIDA por el plan oficial; el usuario
 * puede moverlas libremente. Los `prereqs` usan los ids (= códigos) de las materias.
 */
interface Seed {
  id: string
  code: string
  name: string
  area: AreaId
  year: number
  sem: 1 | 2
  prereqs?: string[]
}

const SEED: Seed[] = [
  // ───────────────── Año 1 ─────────────────
  { id: '1201', code: '1201', name: 'Matemática I', area: 'datos', year: 1, sem: 1 },
  { id: '1101', code: '1101', name: 'Economía I', area: 'economia', year: 1, sem: 1 },
  { id: '1302', code: '1302', name: 'Administración I', area: 'negocios', year: 1, sem: 1 },
  { id: '2002', code: '2002', name: 'Introducción al Derecho', area: 'economia', year: 1, sem: 1 },

  { id: '1202', code: '1202', name: 'Matemática II', area: 'datos', year: 1, sem: 2, prereqs: ['1201'] },
  { id: '1102', code: '1102', name: 'Economía II', area: 'economia', year: 1, sem: 2 },
  { id: '1301', code: '1301', name: 'Contabilidad Básica', area: 'negocios', year: 1, sem: 2 },
  { id: '1401', code: '1401', name: 'Historia de Occidente a partir de la Modernidad', area: 'economia', year: 1, sem: 2 },
  { id: '9003', code: '9003', name: 'Comprensión de Textos y Escritura', area: 'economia', year: 1, sem: 2 },

  // ───────────────── Año 2 ─────────────────
  { id: '2203', code: '2203', name: 'Introducción a la Estadística', area: 'datos', year: 2, sem: 1, prereqs: ['1202'] },
  { id: '2204', code: '2204', name: 'Economía Matemática', area: 'datos', year: 2, sem: 1, prereqs: ['1202'] },
  { id: '2103', code: '2103', name: 'Microeconomía', area: 'economia', year: 2, sem: 1, prereqs: ['1101'] },
  { id: '1303', code: '1303', name: 'Información y Contabilidad Gerencial I', area: 'negocios', year: 2, sem: 1, prereqs: ['1301'] },

  { id: '2205', code: '2205', name: 'Análisis Estadístico', area: 'datos', year: 2, sem: 2, prereqs: ['2203'] },
  { id: '1501', code: '1501', name: 'Instituciones Políticas y de Gobierno', area: 'economia', year: 2, sem: 2 },
  { id: '2106', code: '2106', name: 'Historia Económica Internacional', area: 'economia', year: 2, sem: 2 },
  { id: '3312', code: '3312', name: 'Información y Contabilidad Gerencial II', area: 'negocios', year: 2, sem: 2, prereqs: ['1303'] },

  // ───────────────── Año 3 ─────────────────
  { id: '2104', code: '2104', name: 'Macroeconomía', area: 'economia', year: 3, sem: 1, prereqs: ['1102'] },
  { id: '3308', code: '3308', name: 'Métodos Estadísticos aplicados a los Negocios', area: 'datos', year: 3, sem: 1, prereqs: ['2205'] },
  { id: '4327', code: '4327', name: 'Marketing', area: 'negocios', year: 3, sem: 1, prereqs: ['1101'] },
  { id: '3313', code: '3313', name: 'Métodos Analíticos aplicados a los Negocios', area: 'datos', year: 3, sem: 1, prereqs: ['2103'] },

  { id: '3306', code: '3306', name: 'Riesgo, Incertidumbre y Finanzas', area: 'negocios', year: 3, sem: 2, prereqs: ['2103'] },
  { id: '3303', code: '3303', name: 'Teoría de las Decisiones', area: 'negocios', year: 3, sem: 2, prereqs: ['2103'] },
  { id: '3311', code: '3311', name: 'Dirección de Operaciones y Tecnología I', area: 'negocios', year: 3, sem: 2, prereqs: ['3306', '3312'] },
  { id: 'NUCLEO-DIG', code: '', name: 'Materia Electiva del Núcleo Digital', area: 'electivas', year: 3, sem: 2 },

  // ───────────────── Año 4 ─────────────────
  { id: '9004', code: '9004', name: 'Expresión Oral y Escrita', area: 'economia', year: 4, sem: 1 },
  { id: '4311', code: '4311', name: 'Finanzas Internacionales', area: 'negocios', year: 4, sem: 1, prereqs: ['3306'] },
  { id: '4308', code: '4308', name: 'Finanzas de la Empresa', area: 'negocios', year: 4, sem: 1, prereqs: ['3306', '3312'] },
  { id: 'CAMPO-1', code: '', name: 'Curso de Campo Menor', area: 'electivas', year: 4, sem: 1 },

  { id: '4326', code: '4326', name: 'Desarrollo de Nuevos Negocios', area: 'negocios', year: 4, sem: 2, prereqs: ['1302', '3312', '3306'] },
  { id: '4368', code: '4368', name: 'Estrategia Competitiva y Digital', area: 'negocios', year: 4, sem: 2, prereqs: ['2103'] },
  { id: '4337', code: '4337', name: 'Dirección de Operaciones y Tecnología II', area: 'negocios', year: 4, sem: 2, prereqs: ['3313', '3311'] },
  { id: 'CAMPO-2', code: '', name: 'Curso de Campo Menor', area: 'electivas', year: 4, sem: 2 },
  { id: 'CAMPO-3', code: '', name: 'Curso de Campo Menor', area: 'electivas', year: 4, sem: 2 },
]

export const PLAN_VERSION = 2021

export function buildDefaultPlan(): Subject[] {
  return SEED.map((s) => ({
    id: s.id,
    code: s.code,
    name: s.name,
    area: s.area,
    prereqs: s.prereqs ?? [],
    year: s.year,
    sem: s.sem,
    annual: false,
    status: 'pending',
    grade: null,
  }))
}
