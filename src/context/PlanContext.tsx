/* PlanContext — provee el plan oficial de la carrera activa (áreas, terms,
   nota de aprobación) a toda la app, para no prop-drillear los colores de
   área por todos los componentes. */
import { createContext, useContext, useMemo } from 'react';
import type { ReactNode } from 'react';
import type { AreaDef, CarreraPlan } from '../types';

interface PlanCtx {
  plan: CarreraPlan;
  /** Devuelve la definición (con colores) de un área por id; fallback gris. */
  areaById: (id: string) => AreaDef;
}

const FALLBACK_AREA: AreaDef = {
  id: '_',
  label: '—',
  color: '#797c9c',
  tint: '#f0f1f6',
  tint2: '#e5e7f0',
};

const Ctx = createContext<PlanCtx | null>(null);

export function PlanProvider({ plan, children }: { plan: CarreraPlan; children: ReactNode }) {
  const value = useMemo<PlanCtx>(() => {
    const map = new Map(plan.areas.map((a) => [a.id, a]));
    return {
      plan,
      areaById: (id) => map.get(id) ?? FALLBACK_AREA,
    };
  }, [plan]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function usePlan(): PlanCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('usePlan debe usarse dentro de <PlanProvider>');
  return ctx;
}
