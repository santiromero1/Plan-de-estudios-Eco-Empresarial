# PRD — Planificador de Cursada (Lic. Economía Empresarial UTDT)

> Requerimientos de producto. **Qué** construye la app, su modelo de datos, reglas de validación y criterios de aceptación. Lee primero [`01-Discovery.md`](./01-Discovery.md).

---

## 1. Resumen

App web **multiusuario** para **planificar y seguir** la cursada de la Lic. en Economía Empresarial (UTDT). Permite arrastrar materias entre cuatrimestres, valida correlativas en vivo con alertas, distingue áreas por color, y registra notas para calcular el promedio. Dos vistas: **Grilla** y **Timeline de correlativas**. Cada usuario se registra (mail+contraseña), su plan se **autoguarda en la nube** (Supabase) y el acceso está gateado por pago. Ver [04-Cuentas-y-Sincronizacion.md](./04-Cuentas-y-Sincronizacion.md). (`localStorage` queda como caché offline + export/import por archivo.)

---

## 2. Conceptos del dominio

### 2.1 Materia (Subject)

```ts
type Area = 'negocios' | 'economia-social' | 'datos-cuant' | 'electivas';

type Duracion = 'cuatrimestral' | 'anual';

type EstadoMateria =
  | 'pendiente'    // todavía no cursada
  | 'en-curso'     // cursándose ahora
  | 'aprobada'     // aprobada (tiene nota)
  | 'desaprobada'  // a recursar
  | 'desinscripta';// se bajó

interface Materia {
  id: string;            // = código del plan (ej. "1202") o uid para electivas
  codigo: string | null; // null para slots de electiva sin código
  nombre: string;        // editable en electivas
  area: Area;
  correlativas: string[];// ids de materias requeridas aprobadas
  duracion: Duracion;    // default 'cuatrimestral'; el usuario puede marcar 'anual'
  estado: EstadoMateria; // default 'pendiente'
  nota: number | null;   // 1–10, solo si estado === 'aprobada'
  esElectiva: boolean;   // slots editables
  // Ubicación en el plan:
  cuatrimestreId: string | null; // a qué bloque pertenece; null = sin ubicar
}
```

### 2.2 Cuatrimestre / Bloque (Term)

El plan se organiza en una secuencia **lineal y ordenada** de cuatrimestres. Cada uno es un "bloque" donde caen materias (columnas tipo Kanban).

```ts
interface Cuatrimestre {
  id: string;        // ej. "1-1" (año 1, sem 1)
  anio: number;      // 1..4 (y más si se extiende)
  semestre: 1 | 2;
  orden: number;     // índice lineal global (1,2,3,…) para comparar tiempo
  esExtra: boolean;  // bloque EXTRA para desfasajes / 5to año, etc.
  materiaIds: string[];
}
```

- Bloques base: Año 1 S1, Año 1 S2, Año 2 S1 … Año 4 S2 → 8 bloques.
- Bloque(s) **EXTRA**: para materias que se corren más allá del 4º año o que no entran en el plan ideal.

### 2.3 Eje temporal y materias anuales (clave para correlativas)

Para validar correlativas hay que comparar **cuándo se completa** una materia vs. **cuándo empieza** otra.

- Cada cuatrimestre tiene un `orden` lineal (1 = Año1S1, 2 = Año1S2, …).
- Una materia **cuatrimestral** ubicada en el bloque de `orden = N`:
  - empieza en `N`, **se completa al final de `N`**.
- Una materia **anual** ubicada en el año Y (ocupa S1 y S2 de ese año):
  - empieza en el S1 del año, **se completa al final del S2** (orden del S2).
  - Visualmente ocupa/abarca los dos semestres del año.

**Regla de correlativa válida:**
> Para cada correlativa `C` de una materia `M`:
> `C` debe estar **aprobada o planificada para completarse antes** de que empiece `M`.
> Es decir: `ordenDeCompletado(C) < ordenDeInicio(M)`.

Si `C` está aprobada (estado `aprobada`), se considera cumplida sin importar su ubicación.

---

## 3. Mapeo de materias → área (CONFIRMADO ✅)

> Colores por área se definen en el Design Spec. Mapeo **confirmado por Santi contra la página oficial de la UTDT** (2026-06-11).

| Código | Materia | Área propuesta |
|---|---|---|
| 1201 | Matemática I | Datos y Análisis Cuantitativo |
| 1101 | Economía I | Economía y Cs. Sociales |
| 1302 | Administración I | Negocios |
| 2002 | Introducción al Derecho | Economía y Cs. Sociales |
| 1202 | Matemática II | Datos y Análisis Cuantitativo |
| 1102 | Economía II | Economía y Cs. Sociales |
| 1301 | Contabilidad Básica | Negocios |
| 1401 | Historia de Occidente (Modernidad) | Economía y Cs. Sociales |
| 9003 | Comprensión de Textos y Escritura | Economía y Cs. Sociales |
| 2203 | Introducción a la Estadística | Datos y Análisis Cuantitativo |
| 2204 | Economía Matemática | Datos y Análisis Cuantitativo |
| 2103 | Microeconomía | Economía y Cs. Sociales |
| 1303 | Información y Contabilidad Gerencial I | Negocios |
| 2205 | Análisis Estadístico | Datos y Análisis Cuantitativo |
| 1501 | Instituciones Políticas y de Gobierno | Economía y Cs. Sociales |
| 2106 | Historia Económica Internacional | Economía y Cs. Sociales |
| 3312 | Información y Contabilidad Gerencial II | Negocios |
| 2104 | Macroeconomía | Economía y Cs. Sociales |
| 3308 | Métodos Estadísticos aplicados a los Negocios | Datos y Análisis Cuantitativo |
| 4327 | Marketing | Negocios |
| 3313 | Métodos Analíticos aplicados a los Negocios | Datos y Análisis Cuantitativo |
| 3306 | Riesgo, Incertidumbre y Finanzas | Negocios |
| 3303 | Teoría de las Decisiones | Negocios |
| 3311 | Dirección de Operaciones y Tecnología I | Negocios |
| 9004 | Expresión Oral y Escrita | Economía y Cs. Sociales |
| 4311 | Finanzas Internacionales | Negocios |
| 4308 | Finanzas de la Empresa | Negocios |
| 4326 | Desarrollo de Nuevos Negocios | Negocios |
| 4368 | Estrategia Competitiva y Digital | Negocios |
| 4337 | Dirección de Operaciones y Tecnología II | Negocios |
| — | Electiva Núcleo Digital | Electivas |
| — | Curso de Campo Menor (×N) | Electivas |

---

## 4. Funcionalidades (features) y user stories

### F1 — Vista de Grilla
- **US1.1**: Como usuario veo todas las materias organizadas por **Año** (1–4 + EXTRA), con dos columnas por año (Semestre 1 y Semestre 2), según el wireframe.
- **US1.2**: Cada materia es una **tarjeta** con su nombre, color por área, y un indicador de estado (aprobada/en curso/etc.) y nota si corresponde.
- **US1.3**: Las materias anuales se muestran abarcando los dos semestres de su año.

### F2 — Drag & drop (Kanban)
- **US2.1**: Puedo **arrastrar** una materia de un cuatrimestre a otro (incluido EXTRA).
- **US2.2**: Al arrastrar, veo feedback visual de las zonas donde puedo soltar.
- **US2.3**: Al soltar, el plan se **revalida** y se actualizan las alertas de correlativas.
- **US2.4**: Puedo marcar una materia como **anual**; pasa a ocupar los dos semestres de su año y la validación lo tiene en cuenta.

### F3 — Validación de correlativas y alertas
- **US3.1**: Si ubico una materia en un cuatrimestre donde **alguna correlativa no está completada antes**, la tarjeta muestra una **alerta** (icono + color de advertencia) indicando qué correlativa falta.
- **US3.2**: La alerta lista las correlativas incumplidas por nombre.
- **US3.3**: Hay un **resumen de alertas** del plan (cuántos conflictos hay y en qué materias).
- **US3.4**: Mover una materia que es correlativa de otras revalida también a las dependientes (efecto cascada).

### F4 — Timeline de correlativas
- **US4.1**: Veo las materias dispuestas en un **flujo horizontal** con **flechas** que conectan cada correlativa con la materia que habilita (según wireframe "Vista de Timeline Correlativas").
- **US4.2**: Puedo **acomodar** materias en el espacio del timeline.
- **US4.3**: Si una materia está ubicada **antes o al mismo tiempo** que una de la que depende, salta una **alerta visual** sobre la flecha/tarjeta conflictiva.

### F5 — Estados y notas
- **US5.1**: Puedo cambiar el estado de una materia: pendiente / en-curso / aprobada / desaprobada / desinscripta.
- **US5.2**: Si la marco **aprobada**, ingreso una **nota** (1–10). Aprueba con **6** (constante configurable).
- **US5.3**: Si la marco **desaprobada** o **desinscripta**, puedo moverla a un cuatrimestre futuro (recursar).
- **US5.4**: Veo el **promedio** de la carrera (promedio simple de materias aprobadas) y cantidad de materias aprobadas / totales / restantes.

### F6 — Electivas
- **US6.1**: Los slots de electiva (Núcleo Digital, Campo Menor) aparecen como **placeholders editables**: les pongo el nombre real de la materia que cursé.
  - **Núcleo Digital**: en vez de texto libre, es un **dropdown** con las opciones oficiales (Marketing Digital · Métodos Analíticos y Programación) + **"Otra…"** (que habilita escribir un nombre libre).
- **US6.2**: Puedo agregar slots de electiva extra si curso más de los previstos.

### F7 — Persistencia
> **Actualizado:** ahora la fuente de verdad es la nube (Supabase), no `localStorage`. Ver [04-Cuentas-y-Sincronizacion.md](./04-Cuentas-y-Sincronizacion.md).
- **US7.1**: Todos mis cambios se **autoguardan en la nube** (debounce ~1s) y quedan ligados a mi cuenta; `localStorage` es caché offline. Al iniciar sesión veo **lo último que guardé**, desde cualquier dispositivo.
- **US7.2**: Puedo **exportar** mi plan a un archivo JSON (backup).
- **US7.3**: Puedo **importar** un JSON para restaurar el plan.
- **US7.4**: Puedo **resetear** el plan al estado inicial del plan oficial (con confirmación).

### F9 — Cuentas y acceso (ver [04-Cuentas-y-Sincronizacion.md](./04-Cuentas-y-Sincronizacion.md))
- **US9.1**: Me **registro** con mail + contraseña y elijo mi carrera.
- **US9.2**: **Inicio sesión** y puedo **cerrar sesión** / recuperar contraseña por mail.
- **US9.3**: El acceso a la app está condicionado a mi **estado de pago** (`access_status`); sin acceso activo veo una pantalla de "activá tu acceso".

### F8 — Navegación entre vistas
- **US8.1**: Hay un toggle/tabs para cambiar entre **Grilla** y **Timeline**.
- **US8.2**: El estado (notas, ubicaciones) es compartido entre ambas vistas.

---

## 5. Reglas de negocio

1. **Aprobación**: una materia está aprobada si `estado === 'aprobada'` y `nota >= 6`. (Constante `NOTA_APROBACION = 6`.)
2. **Promedio**: media aritmética de las `nota` de materias `aprobada`. Si no hay aprobadas, se muestra "—".
3. **Correlativa cumplida**: si la correlativa está `aprobada`, cuenta como cumplida siempre. Si está planificada, cuenta como cumplida solo si `ordenDeCompletado(correlativa) < ordenDeInicio(materia)`.
4. **Materia anual**: completa al final del 2º semestre de su año; ocupa ambos semestres.
5. **EXTRA**: bloque sin restricción de año; su `orden` es posterior a Año 4 S2 (o configurable según dónde lo ubique el usuario).
6. **Una materia, un bloque**: cada materia está en un solo cuatrimestre a la vez (salvo anual, que abarca el año).
7. La **data del plan** (materias, correlativas) vive en un archivo de datos editable; corregir un error no debe requerir tocar lógica.

---

## 6. Criterios de aceptación (verificables)

- [ ] La grilla muestra los 8 bloques base + EXTRA con las materias en su ubicación oficial inicial.
- [ ] Cada tarjeta tiene el color de su área y muestra estado + nota cuando aplica.
- [ ] Puedo arrastrar una materia de un bloque a otro y el cambio persiste tras recargar.
- [ ] Al mover Matemática II a un cuatrimestre **anterior** a Matemática I (o al mismo), aparece alerta de correlativa.
- [ ] Marcar Matemática I como **anual** corre la validez de Matemática II al cuatrimestre siguiente (alerta si quedó en el mismo año tras la anual).
- [ ] La vista Timeline dibuja flechas de correlativa y marca conflictos cuando el orden temporal se viola.
- [ ] Marco 3 materias como aprobadas con notas 6, 8, 10 → el promedio muestra 8.00 y "3 aprobadas".
- [ ] Una materia con nota < 6 no cuenta como aprobada ni entra al promedio.
- [ ] Edito el nombre de un slot de electiva y persiste.
- [ ] Exporto a JSON, reseteo, importo el JSON → el plan vuelve a como estaba.

---

## 7. No-objetivos (recordatorio)

Horarios/choques, auto-reorganización automática, scraping del campus, app nativa. (Ver Discovery §6.) — **Multiusuario ya dejó de ser no-objetivo**: está implementado (ver [04-Cuentas-y-Sincronizacion.md](./04-Cuentas-y-Sincronizacion.md)).
