# Discovery — Planificador de Cursada (Lic. Economía Empresarial UTDT)

> Documento de descubrimiento. Define **el problema, el usuario, el contexto y las decisiones** antes de escribir requerimientos o diseño. Es la base que alimenta el PRD y el Design Spec.

---

## 1. El problema

Planificar la cursada de una carrera universitaria con correlatividades es un rompecabezas que las herramientas oficiales (el campus de la universidad) **no resuelven**: solo muestran las materias de un cuatrimestre, sin dejar planificar a futuro ni simular escenarios.

Decisiones reales que rompen el plan "ideal" de 4 años:

- **Materias anuales**: cursar Matemática I de forma anual (en vez de cuatrimestral) corre Matemática II y toda su cadena de correlativas (2203 → 2205 → 3308…).
- **Recursar / desinscribirse**: si bocho o me bajo de una materia, tengo que moverla a un cuatrimestre futuro y revalidar que sus correlativas y las materias que ella habilita sigan siendo viables.
- **Reordenar por gusto/carga**: querer adelantar o atrasar materias según carga horaria, horarios o preferencia.

Hoy esto se hace mentalmente o en un Excel, sin validación automática de correlativas ni visualización clara.

## 2. El usuario

- **Quién**: Santiago — estudiante de la Licenciatura en Economía Empresarial (UTDT), Plan 2021. **Un solo usuario** (herramienta personal).
- **Contexto de uso**: principalmente desktop (planificación sentado, con mouse — drag & drop). Mobile es secundario.
- **Objetivo**: tener un mapa vivo y editable de su carrera donde pueda mover materias, ver correlativas, recibir alertas cuando algo no cierra, y llevar registro de notas/promedio.

## 3. Qué tiene que lograr (objetivos)

1. **Visualizar** todo el plan de carrera (4 años × 2 semestres + slot EXTRA para desfasajes).
2. **Reorganizar** materias arrastrándolas entre cuatrimestres (interacción tipo Kanban).
3. **Validar correlativas** en tiempo real y **alertar** cuando una materia quedó ubicada antes (o al mismo tiempo) que una de sus correlativas.
4. **Distinguir áreas** por color (Negocios / Economía y Cs. Sociales / Datos y Análisis Cuantitativo / Electivas).
5. **Registrar avance**: marcar materias como aprobadas con su nota, y calcular el **promedio** de la carrera.
6. **Dos vistas**: Grilla (plan por años) y Timeline de correlativas (flujo con flechas de dependencia).
7. **Persistir** el plan localmente y poder exportarlo/importarlo.

## 4. Fuente de verdad del dominio

El plan de estudios y las correlatividades están en
[`plan-de-estudios/economia-empresarial-ditella.md`](../plan-de-estudios/economia-empresarial-ditella.md).

Resumen del grafo de correlativas (cadenas principales):

```
1201 Matemática I → 1202 Matemática II → 2203 Intro Estadística → 2205 Análisis Estadístico → 3308 Métodos Estadísticos
                                       → 2204 Economía Matemática
1101 Economía I → 2103 Microeconomía → 3313 Métodos Analíticos → 4337 Dir. Op. y Tec. II
                                     → 3306 Riesgo, Incert. y Finanzas → 3311 Dir. Op. y Tec. I → 4337 Dir. Op. y Tec. II
                                                                       → 4311 Finanzas Internacionales
                                                                       → 4308 Finanzas de la Empresa
                                                                       → 4326 Desarrollo de Nuevos Negocios
                                     → 3303 Teoría de las Decisiones
                                     → 4368 Estrategia Competitiva y Digital
              → 4327 Marketing
1102 Economía II → 2104 Macroeconomía
1301 Contabilidad Básica → 1303 ICG I → 3312 ICG II → 3311 / 4308 / 4326
```

> ⚠️ El archivo tiene una sección "Celdas a verificar" (transcripción de foto). Las dudas conocidas: ubicación exacta de 9004 y la Electiva del Núcleo Digital, correlativa exacta de 3313, asteriscos en 2103/2104, y distinción 4311 vs 4308. **No bloquean el diseño**, pero la data del modelo debe ser editable para corregir sin tocar código.

## 5. Decisiones tomadas (de la fase de preguntas)

| Tema | Decisión | Nota |
|---|---|---|
| **Proceso** | Híbrido: carpeta `Specs/` (Discovery, PRD, Design) + patrones GSD (discovery por preguntas, verificación). Sin estructura `.planning/`. | |
| **Stack** | React + Vite + TypeScript. Deploy en Vercel. | Elección previa del proyecto. |
| **Persistencia** | `localStorage` + export/import a JSON. Sin backend ni login. | Backup y portabilidad por archivo. |
| **Notas** | Escala 1–10, **aprueba con 6**, promedio simple (no ponderado — el plan no tiene créditos). | UTDT suele aprobar con 4; el umbral es una **constante única** fácil de cambiar. |
| **Electivas** | Slots placeholder editables (el usuario les pone el nombre real de la materia). | Núcleo Digital + Cursos de Campo Menor. |
| **Vistas** | (1) Grilla por años, (2) Timeline de correlativas. | Wireframe adjunto por el usuario. |
| **Estética** | Inspirada en el campus Di Tella: paleta multicolor, sans geométrica, bordes redondeados, fondo claro. | Detalle en Design Spec. |

## 6. Fuera de alcance (v1)

- Multiusuario / cuentas / sincronización en la nube.
- Horarios de cursada / choques de horario / aulas.
- Auto-reorganización automática del plan (la app **alerta**, pero el usuario mueve a mano).
- Integración con el campus real de la UTDT (scraping de notas).
- App mobile nativa (la web es responsive, pero el drag & drop se optimiza para desktop).

## 7. Riesgos / cosas a cuidar

- **Exactitud de la data**: errores en correlativas darían alertas falsas. Mitigación: modelo de datos editable + sección de verificación ya documentada.
- **Pérdida de datos** (localStorage): mitigada con export/import JSON.
- **Complejidad de la validación de correlativas con materias anuales**: requiere modelar la cursada en un eje temporal lineal (ver PRD §Modelo).
- **Drag & drop accesible y claro**: que el feedback visual de "no podés soltar acá" sea evidente.

## 8. Flujo de trabajo del proyecto

1. **Specs** (este documento + PRD + Design) ← estamos acá.
2. El **Design Spec** se pasa a "Claude Design" para generar el front-end (mockup/HTML) con estética Di Tella.
3. El resultado vuelve para **desarrollarlo de forma funcional** (React + Vite + TS).
4. Se **actualiza el Design Spec** para reflejar la implementación real (documento vivo).
