# Cuentas, Sincronización y Acceso Pago

> Hito posterior a la v1. Convierte la app de **un solo usuario / localStorage** a un **producto multiusuario** con cuentas, plan guardado en la nube (autoguardado) y acceso gateado por pago. Reemplaza las decisiones de "Fuera de alcance v1" de [01-Discovery.md §6](./01-Discovery.md) sobre multiusuario y sincronización.

---

## 1. Objetivo

Que cada estudiante se registre con **mail + contraseña**, vea **lo último que guardó** al iniciar sesión (desde cualquier dispositivo) y que su progreso se **autoguarde** con cada cambio. El acceso a la app queda condicionado a un **estado de pago** (modelo de **pago único** = acceso de por vida).

## 2. Arquitectura

- **Backend:** [Supabase](https://supabase.com) (BaaS) — Postgres + Auth + Row Level Security. **No hay servidor propio**: la app sigue siendo estática (Vite) y habla con Supabase desde el navegador con la `anon key` (segura gracias a RLS).
- **Hosting:** Vercel/Netlify (estático). Las credenciales van como *Environment Variables*.
- **Cliente:** [`src/lib/supabase.ts`](../src/lib/supabase.ts) crea el cliente único a partir de `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` (ver [`.env.example`](../.env.example)).

```
Navegador (app estática)  ──anon key + JWT──►  Supabase (Auth + Postgres + RLS)
        │                                              │
   localStorage (caché offline)                  fuente de verdad
```

## 3. Modelo de datos

Esquema versionado en [`supabase/schema.sql`](../supabase/schema.sql).

### `profiles` (1 por usuario)
| Campo | Tipo | Nota |
|---|---|---|
| `id` | uuid PK | = `auth.users.id` |
| `email` | text | denormalizado, para identificar al usuario en el Table Editor |
| `username` | text | nombre visible elegido al registrarse |
| `carrera` | text | id de carrera (ver `CARRERAS` en [`auth.ts`](../src/lib/auth.ts)) |
| `access_status` | enum | `pending` \| `active` \| `expired` — **el gate de acceso** |
| `created_at` / `updated_at` | timestamptz | |

Se crea automáticamente al registrarse vía trigger `handle_new_user` (lee `username`/`carrera` de la metadata del signup).

### `plans` (1 por usuario + carrera)
| Campo | Tipo | Nota |
|---|---|---|
| `id` | uuid PK | |
| `user_id` | uuid | FK `auth.users` |
| `carrera` | text | `unique (user_id, carrera)` → preparado para multi-carrera |
| `data` | jsonb | payload del plan (ver §4) |
| `updated_at` | timestamptz | last-write-wins |

### Seguridad (RLS)
- `profiles`: cada usuario lee/edita **sólo su fila**.
- `plans`: cada usuario lee/escribe **sólo sus filas Y sólo si `access_status = 'active'`**. El gate de pago se aplica **en la base**, no sólo en la UI (helper `has_active_access()`).

## 4. Formato del plan guardado (`plans.data`)

No se guarda el plan completo, sino el **estado mutable por id + el orden de los ids**, y se reconstruye sobre el plan oficial al cargar. Esto permite corregir el plan oficial (áreas, correlativas, nuevas materias) sin borrar el progreso del usuario. Lógica en [`src/lib/storage.ts`](../src/lib/storage.ts).

```jsonc
{
  "order": ["1201", "1101", "..."],          // orden de los ids (define orden intra-semestre)
  "state": {                                  // estado mutable por id
    "1201": { "estado": "aprobada", "nota": 8, "term": "1-1", "anual": false }
  }
}
```

- **Retrocompatible:** acepta el formato legacy (mapa de estado pelado, sin `order`).
- El **orden** es necesario porque el orden dentro de un cuatrimestre lo define la posición en el array ([`board.ts`](../src/lib/board.ts)).

## 5. Sincronización y autoguardado

- **Caché offline:** cada cambio se escribe **al instante** en `localStorage` (`saveLocalCache`).
- **Nube:** se sincroniza con **debounce (~1s)** tras el último cambio (`syncPlanToCloud`, upsert por `user_id+carrera`). Indicador visual "Guardando… / Guardado ✓ / Error" en [`App.tsx`](../src/App.tsx).
- **Carga:** al iniciar sesión, `loadPlan` trae la fila de la nube; si no hay, usa la caché local y la **migra** a la nube (best-effort). La nube es la fuente de verdad.
- **Migración v1→nube:** el plan que existiera en el `localStorage` legacy (`planificador-ditella-v3`) se sube automáticamente en la primera carga.

## 6. Autenticación ([`src/lib/auth.ts`](../src/lib/auth.ts))

- **Login con mail + contraseña** (Supabase Auth hashea la contraseña; nunca se guarda en texto plano).
- Funciones: `register`, `login`, `logout`, `getActiveSession`, `requestPasswordReset`. Errores traducidos al español.
- **Registro** abierto (cualquiera crea cuenta). Por defecto Supabase pide **confirmar el mail**.
- **Reset de contraseña** por mail (gratis con Supabase).
- El "nombre de usuario" es dato de perfil para mostrar; el identificador de login es el mail.

## 7. Flujo de pantallas ([`App.tsx`](../src/App.tsx))

```
getActiveSession()
  ├─ sin sesión              → <Login>        (ingresar / crear cuenta / olvidé contraseña)
  ├─ sesión, status ≠ active → <AccessGate>   ("activá tu acceso" — gate de pago)
  └─ sesión, status = active → <Planner>      (la app: grilla/timeline + autoguardado)
```

## 8. Alta de acceso (operación manual — Etapa 1)

Mientras no exista la pasarela de pago, el acceso se activa **a mano** desde **Supabase → Table Editor → `profiles`**: se busca al usuario por `email` y se cambia `access_status` a `active` con el dropdown (sin SQL). Esto es exactamente lo que el webhook de pago automatizará en la Etapa 2.

## 9. Próximos pasos

1. **Multi-carrera:** cargar el plan oficial + correlativas de las 12 carreras restantes de la UTDT (la app ya está preparada: `plans` por carrera, selector de carrera, plan oficial por carrera). Pendiente: obtener los planes y correlativas de la facultad.
2. **Pasarela de pagos (Mercado Pago):** checkout + **webhook** que, al confirmarse el pago, ponga `access_status = 'active'` automáticamente (vía Supabase Edge Function). Pago único = queda activo de forma permanente. Reemplaza el alta manual de §8 sin cambiar el resto.
3. *(Opcional)* **Backoffice propio** en la app (lista de usuarios + buscador + botón activar) protegido por rol admin, si el Table Editor queda corto.

## 10. Cambios respecto del alcance v1

- ~~"Multiusuario / cuentas / sincronización en la nube" (fuera de alcance v1)~~ → **ahora es el núcleo del producto**.
- La persistencia ya **no es sólo `localStorage`**: la nube es la fuente de verdad; `localStorage` queda como caché offline.
