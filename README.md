# Planificador de Cursada · Lic. en Economía Empresarial (UTDT)

App interactiva para planificar la cursada personalizada de la **Licenciatura en Economía Empresarial** (Plan 2021, Universidad Torcuato Di Tella).

## Qué hace

- **Arrastrar y soltar** materias entre cuatrimestres (estilo Kanban), incluida una zona **EXTRA** para materias sin asignar o que estás recursando.
- **Validación de correlativas en tiempo real:** si una materia queda antes que su correlativa (o sin ella), aparece una **alerta ⚠** y se marca en rojo. El contador de alertas vive en la barra superior.
- **Materias anuales:** marcá una materia como anual (ocupa los dos cuatrimestres del año) y el validador recalcula cuándo libera sus correlativas — útil para casos como cursar Matemática I de forma anual y ver cómo se corre Matemática II.
- **Colores por área de negocio:** Negocios · Economía y Ciencias Sociales · Datos y Análisis Cuantitativo · Electivas.
- **Marcar como aprobada + nota (1–10)** y cálculo automático del **promedio simple** de la carrera.
- **Dos vistas:**
  1. **Vista de grilla** — los 4 años × 2 cuatrimestres + EXTRA.
  2. **Timeline de correlativas** — materias ordenadas por cuatrimestre con **flechas** que muestran las dependencias (en rojo punteado si la correlativa no se respeta).
- **Persistencia local** (localStorage) + **Exportar / Importar** tu plan como JSON y **Reset** al plan oficial.

## Correr en local

```bash
npm install
npm run dev      # http://localhost:5173
```

## Build de producción

```bash
npm run build    # genera /dist (type-check + bundle)
npm run preview  # sirve el build localmente
```

## Deploy en Vercel

El proyecto es un Vite + React estándar; Vercel lo autodetecta.

- **Framework preset:** Vite
- **Build command:** `npm run build`
- **Output directory:** `dist`

Desde la CLI: `vercel` (o conectá el repo de GitHub en el dashboard de Vercel).

## Estructura

```
src/
  data/plan.ts          # Plan 2021: materias, áreas y correlativas (fuente de verdad)
  lib/
    areas.ts            # Definición de las 4 áreas y sus colores
    validation.ts       # Lógica de correlativas, índices de cuatrimestre y promedio
    storage.ts          # localStorage + export/import
  components/
    GridView.tsx        # Vista de grilla con drag & drop (@dnd-kit)
    TimelineView.tsx    # Timeline con flechas SVG de correlativas
    SubjectCard.tsx     # Tarjeta de materia
    SubjectModal.tsx    # Editar estado, nota, modalidad anual
  App.tsx               # Estado global, barra superior, toggle de vistas
```

## Editar el plan

Toda la información del plan vive en [`src/data/plan.ts`](src/data/plan.ts). Para corregir una correlativa o reasignar un área, editá el `SEED` ahí. La transcripción detallada está en [`plan-de-estudios/economia-empresarial-ditella.md`](plan-de-estudios/economia-empresarial-ditella.md), que incluye una sección de **celdas a verificar** contra el plan oficial.
