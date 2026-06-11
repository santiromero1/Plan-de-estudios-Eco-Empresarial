# Design Spec — Planificador de Cursada (Lic. Economía Empresarial UTDT)

> **Brief de diseño** para generar el front-end (mockup/HTML) con estética **Universidad Torcuato Di Tella**. Este documento se entrega a "Claude Design". Luego se desarrolla funcional (React+Vite+TS) y este spec se actualiza para reflejar la implementación real (documento vivo).
>
> Contexto funcional: ver [`02-PRD.md`](./02-PRD.md). Dominio: ver [`01-Discovery.md`](./01-Discovery.md).

---

## 1. Personalidad visual (Di Tella)

Referencia: campus virtual y branding de la UTDT (capturas adjuntas por el usuario).

- **Vibe**: institucional pero **joven, colorido y enérgico**. Multicolor sobre fondo claro y limpio.
- **Logo "ditella"**: letras en colores distintos (magenta, cyan, amarillo, violeta) → de ahí sale la paleta.
- **Formas**: bordes **muy redondeados** (pills, cards con `border-radius` generoso ~12–16px). Las olas/blobs de color del hero del campus son un motivo opcional decorativo.
- **Espaciado**: aireado, generoso. Mucho blanco.
- **Tono**: claro por defecto (fondo blanco/gris muy claro), texto azul muy oscuro casi negro.

## 2. Sistema de color

### 2.1 Marca / UI base
| Token | Uso | Sugerencia (ajustable) |
|---|---|---|
| `--bg` | Fondo app | `#F7F8FA` |
| `--surface` | Cards, paneles | `#FFFFFF` |
| `--ink` | Texto principal | `#1A1B3A` (azul-noche Di Tella) |
| `--ink-muted` | Texto secundario | `#6B6E8A` |
| `--border` | Bordes sutiles | `#E6E8EF` |

### 2.2 Colores por ÁREA (núcleo del diseño)
Cada materia se colorea por su área. Tomados del multicolor Di Tella:

| Área | Token | Color base | Fondo card (claro) | Uso |
|---|---|---|---|---|
| **Negocios** | `--area-negocios` | Magenta/Rosa `#E6007E` | `#FDE6F1` | Acento + barra lateral de la card |
| **Economía y Cs. Sociales** | `--area-economia` | Violeta `#6B2FB3` | `#EDE5F7` | idem |
| **Datos y Análisis Cuantitativo** | `--area-datos` | Cyan/Teal `#00A3C4` | `#E0F4F9` | idem |
| **Electivas** | `--area-electivas` | Amarillo/Naranja `#F5A623` | `#FDF1DC` | idem |

> Patrón de card: fondo claro del área + **barra de acento** (left border 4–6px) o **chip** en el color base. Texto siempre `--ink` para legibilidad (no texto sobre el color saturado).

### 2.3 Estados / feedback
| Token | Uso | Sugerencia |
|---|---|---|
| `--success` | Aprobada | `#1FA97B` |
| `--warning` | Alerta de correlativa | `#E8A300` |
| `--danger` | Desaprobada / conflicto duro | `#E0384E` |
| `--info` | En curso | `#2D7FF9` |

## 3. Tipografía

- **Sans geométrica/humanista**, redondeada y amigable. Opciones: **Poppins**, **Montserrat**, **Nunito Sans** o la que más se acerque al branding Di Tella.
- Jerarquía:
  - H1 (título app): 28–32px, semibold.
  - Títulos de bloque ("1 AÑO", "EXTRA"): 14–16px, **uppercase**, letter-spacing leve, peso medio (como en el wireframe).
  - Card título (materia): 14px, medium.
  - Metadatos (código, nota, estado): 12px, muted.

## 4. Layout general

```
┌───────────────────────────────────────────────────────────┐
│  HEADER: logo/título · [ Grilla | Timeline ] · Promedio ·  │
│          aprobadas X/Y · ⚠ N alertas · ⋯(export/import)    │
├───────────────────────────────────────────────────────────┤
│                                                            │
│                   ÁREA DE VISTA ACTIVA                     │
│              (Grilla  ó  Timeline)                         │
│                                                            │
├───────────────────────────────────────────────────────────┤
│  LEYENDA: ● Negocios  ● Economía  ● Datos  ● Electivas      │
└───────────────────────────────────────────────────────────┘
```

- **Header sticky** con: toggle de vista (tabs tipo pill), métricas (promedio, aprobadas/total), contador de alertas, menú de acciones (exportar, importar, reset).
- **Leyenda** de áreas siempre visible (footer o lateral).

## 5. Vista de GRILLA (referencia: lado izquierdo del wireframe)

- Secciones apiladas verticalmente: **1 AÑO**, **2 AÑO**, **3 AÑO**, **4 AÑO**, **EXTRA**.
- Cada sección: un **header de año** (pill ancho gris claro, texto centrado uppercase) y debajo **dos columnas** = Semestre 1 (izq) y Semestre 2 (der).
- Cada columna es una **dropzone** (Kanban) que contiene las cards de materia de ese cuatrimestre.
- **EXTRA**: misma estructura de 2 columnas, para materias corridas.

### Card de materia (Grilla)
```
┌─[acento área]──────────────────┐
│ Microeconomía            ✓ 8   │   ← nombre + (estado/nota)
│ 2103 · Economía                │   ← código · área (muted)
└────────────────────────────────┘
```
- Left border / barra del color del área.
- Esquina: badge de estado (✓ aprobada con nota, ◷ en curso, ↻ recursar, — pendiente).
- Si hay **conflicto de correlativa**: borde/halo `--warning` + icono ⚠. Tooltip al hover: "Falta aprobar: Matemática I".
- **Anual**: la card se estira para abarcar visualmente los dos semestres del año (puede ser una card ancha que cruza ambas columnas, o un indicador "Anual").
- **Draggable**: cursor grab, sombra elevada al arrastrar, placeholder en destino.

## 6. Vista de TIMELINE de correlativas (referencia: lado derecho del wireframe)

- Disposición **horizontal por etapas** (cuatrimestres de izquierda a derecha).
- Cada etapa es una **columna** con sus materias (cards compactas).
- **Flechas curvas** conectan cada correlativa → la materia que habilita (como en el wireframe: grupos conectados por flechas hacia la derecha).
- **Conflicto temporal**: si una materia está ubicada antes/igual que una de la que depende, la **flecha se pinta en `--danger`** y la card destino muestra ⚠. 
- Permitir **reacomodar** materias entre columnas (drag) → revalida flechas.
- Mantener el color por área en las cards también acá.

## 7. Componentes a diseñar

1. **Header / barra superior** (con tabs de vista + métricas + acciones).
2. **Card de materia** — todos los estados:
   - pendiente, en-curso, aprobada (con nota), desaprobada/recursar, desinscripta.
   - con conflicto de correlativa (overlay de alerta).
   - variante anual.
   - variante electiva (placeholder editable — look "vacío/editable").
3. **Columna / dropzone** (vacía y con cards; estado "drag over").
4. **Header de año** (pill).
5. **Panel/Popover de materia** — al hacer click: cambiar estado, cargar nota, marcar anual, editar nombre (electivas). 
6. **Leyenda de áreas**.
7. **Resumen de alertas** (badge en header + lista desplegable).
8. **Métrica de promedio** (número grande + aprobadas/total).
9. **Diálogo export/import/reset**.
10. **Flecha de correlativa** (normal y en conflicto) para el Timeline.

## 8. Estados de interacción a representar

- Hover sobre card (elevación sutil).
- Dragging (card "levantada", dropzones resaltadas, zona inválida atenuada).
- Conflicto de correlativa (warning persistente, no solo en hover).
- Tooltip explicativo de qué correlativa falta.
- Empty state de una columna ("Soltá materias acá").

## 9. Responsive

- **Desktop-first** (el drag & drop se piensa para mouse).
- Mobile/tablet: la grilla pasa a 1 columna por cuatrimestre apilada; el timeline scrollea horizontal. Drag & drop puede degradar a un selector "mover a…" en pantallas chicas (no bloqueante para v1).

## 10. Entregable esperado de Claude Design

- Mockup navegable (HTML/CSS, o componentes) de **ambas vistas** con datos de ejemplo del plan real.
- Todos los **estados de la card** visibles.
- Sistema de color y tipografía aplicado (tokens arriba).
- No hace falta lógica funcional (drag real, validación) en esta etapa — eso lo desarrollo yo después. Sí que se vea **cómo luce** un conflicto, una aprobada, una anual, una electiva.

---

## 11. Decisiones de implementación (v0.1 — implementado)

> _Sección viva. Refleja el front funcional ya construido a partir del mockup de "Claude Design" (carpeta [`design-reference/`](../design-reference)). El mockup era React+Babel vía CDN; se portó a un proyecto Vite+TS real con drag & drop funcional._

### 11.1 Stack
- **Vite 5 + React 18 + TypeScript** (`tsc -b` en strict mode, sin errores).
- **Drag & drop**: `@dnd-kit/core` (`useDraggable` en las cards, `useDroppable` en cada columna/cuatrimestre, `DragOverlay` para la card "levantada"). `PointerSensor` con `activationConstraint: { distance: 6 }` para no disparar drag en un click (el click abre el panel).
- **Timeline / flechas**: **SVG** con curvas Bézier calculadas midiendo posiciones reales de las cards (`getBoundingClientRect`), `marker` para las puntas. Sin librería externa.
- **Persistencia**: `localStorage` (`planificador-ditella-v1`) + export/import JSON + reset al plan oficial.
- **Deploy**: estático, listo para Vercel (`npm run build` → `dist/`).

### 11.2 Estructura de componentes (`src/`)
- `types.ts` — modelo de dominio (PRD §2).
- `data/plan.ts` — plan oficial 2021 (áreas, terms, materias). **Estado inicial limpio**: todo `pendiente` en su ubicación oficial; el usuario carga su progreso real.
- `lib/logic.ts` — validación pura de correlativas, alertas y promedio (PRD §2.3 / §5).
- `lib/storage.ts` — load/save/export/import.
- `components/` — `Header` (+`Legend`), `GridView` (DnD), `TimelineView`, `SubjectCard`, `SubjectPanel`, `icons`.
- `index.css` — sistema de diseño portado de `design-reference/styles.css`.

### 11.3 Tokens finales (vs. mockup)
- Paleta por área **confirmada** igual al brief: Negocios `#E6007E`, Economía `#6B2FB3`, Datos `#00A3C4`, Electivas `#F5A623`. Cada card usa fondo *tint* del área + barra de acento (left border) en el color base.
- Tipografía: **Poppins** (400–700) vía Google Fonts.
- Fondo app `#F4F5F9`, surface `#FFFFFF`, ink `#1A1B3A`. Radios 14px (card) / 20px (columna) / pill.

### 11.4 Ajustes / pendientes vs. spec
- El mockup traía un "modo demo" de arrastre congelado: se reemplazó por **drag & drop real** (`@dnd-kit/core` + `@dnd-kit/sortable`). Soltar una materia revalida en vivo (alertas en cascada).
- **Reordenar dentro del cuatrimestre** (orden libre de las materias en cada semestre) ✔ — vía `SortableContext`. El orden lo determina la posición en el array de materias (lib `board.ts`, función pura `moveOrReorder`).
- **Timeline interactivo** (US4.2) ✔ — ahora se pueden arrastrar y reordenar materias también desde el Timeline (mismo motor `moveOrReorder`); las flechas se recalculan al soltar.
- **Logo Di Tella** real (`public/ditella.png`) arriba a la izquierda; el título pasó a **"Mi Plan de Estudios"**.
- **Transición Grilla ↔ Timeline**: fundido + leve ascenso (240ms, `cubic-bezier(.23,1,.32,1)`), respeta `prefers-reduced-motion`.
- **Materia anual**: aparece en ambos semestres del año, vinculada como un curso continuo (patrón "evento multi-día"): leyenda direccional + nub conector; arrastrar cualquiera de los dos segmentos mueve el año completo.
- **Pendiente**: agregar slots de electiva extra (US6.2); los 3 slots previstos (Núcleo Digital + 2 Campo Menor) ya están.
