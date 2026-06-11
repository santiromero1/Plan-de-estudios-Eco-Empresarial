# Planificador de Cursada — Lic. Economía Empresarial (UTDT)

App web de un solo usuario para **planificar y seguir** la cursada de la Lic. en
Economía Empresarial (UTDT, Plan 2021). Arrastrá materias entre cuatrimestres,
validá correlativas en vivo, cargá notas y mirá el promedio. Dos vistas: **Grilla**
(Kanban por año/semestre con drag & drop) y **Timeline de correlativas** (flechas).
Persistencia en `localStorage` + export/import JSON.

## Stack

- Vite 5 + React 18 + TypeScript
- `@dnd-kit/core` para el drag & drop
- SVG para las flechas del timeline (sin librerías extra)
- Estética Di Tella (ver [`Specs/03-Design.md`](Specs/03-Design.md))

## Desarrollo

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # genera dist/ (deployable a Vercel)
npm run preview  # sirve el build
```

## Estructura

```
src/
  types.ts            modelo de dominio
  data/plan.ts        plan oficial 2021 (áreas, cuatrimestres, materias)
  lib/logic.ts        validación de correlativas, alertas, promedio
  lib/storage.ts      localStorage + export/import
  components/         Header, GridView, TimelineView, SubjectCard, SubjectPanel, icons
  index.css           sistema de diseño
```

## Documentación

- [`Specs/01-Discovery.md`](Specs/01-Discovery.md) — dominio y alcance
- [`Specs/02-PRD.md`](Specs/02-PRD.md) — requerimientos, modelo, reglas, criterios de aceptación
- [`Specs/03-Design.md`](Specs/03-Design.md) — diseño visual + decisiones de implementación
- [`plan-de-estudios/economia-empresarial-ditella.md`](plan-de-estudios/economia-empresarial-ditella.md) — plan transcrito
- [`design-reference/`](design-reference) — mockup original de "Claude Design" (referencia)

> El estado inicial arranca **limpio** (todas las materias `pendiente` en su ubicación
> oficial). Marcá tu progreso real desde la app; se guarda solo.
