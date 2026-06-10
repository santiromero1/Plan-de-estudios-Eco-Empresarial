import type { AreaId } from '../types'

export interface AreaDef {
  id: AreaId
  label: string
  short: string
  /** color de acento (texto/borde fuerte) */
  color: string
  /** fondo suave de la tarjeta */
  bg: string
  /** borde suave */
  border: string
}

export const AREAS: Record<AreaId, AreaDef> = {
  negocios: {
    id: 'negocios',
    label: 'Negocios',
    short: 'Negocios',
    color: '#1d4ed8',
    bg: '#eff4ff',
    border: '#bfd3ff',
  },
  economia: {
    id: 'economia',
    label: 'Economía y Ciencias Sociales',
    short: 'Economía y Cs. Sociales',
    color: '#0f766e',
    bg: '#effbf8',
    border: '#a7e8dc',
  },
  datos: {
    id: 'datos',
    label: 'Datos y Análisis Cuantitativo',
    short: 'Datos y Cuantitativo',
    color: '#6d28d9',
    bg: '#f5f1ff',
    border: '#d6c7ff',
  },
  electivas: {
    id: 'electivas',
    label: 'Electivas',
    short: 'Electivas',
    color: '#b45309',
    bg: '#fff8ec',
    border: '#f6d79a',
  },
}

export const AREA_LIST = Object.values(AREAS)
