# TODO — Planificador de Cursada UTDT

Lista viva de pendientes. Contexto completo del sistema de cuentas en
[Specs/04-Cuentas-y-Sincronizacion.md](./Specs/04-Cuentas-y-Sincronizacion.md).

---

## 🔜 Próximo (en orden de prioridad)

### 1. Pasarela de pago — Mercado Pago + webhook
Monetiza ya con la carrera que ya está andando (Economía Empresarial).
- Checkout de Mercado Pago (pago único = acceso de por vida).
- **Webhook** (Supabase Edge Function) que al confirmar el pago ponga
  `access_status = 'active'` automáticamente. Reemplaza el alta manual.
- Botón "Pagar $X" en [src/components/AccessGate.tsx](./src/components/AccessGate.tsx)
  (hoy dice "escribinos").
- **Definir el precio** antes.

### 2. Login con Google (OAuth)
Menos fricción: ingreso con un click, sin contraseña.
- Activar el provider de Google en Supabase (Authentication → Providers).
- Botón "Continuar con Google" en [src/components/Login.tsx](./src/components/Login.tsx)
  (`supabase.auth.signInWithOAuth({ provider: 'google' })`).
- Ojo: al entrar por Google el perfil se crea sin `carrera` elegida →
  pedir la carrera la primera vez (paso de onboarding) o por defecto.

### 3. Multi-carrera — ✅ COMPLETO (13/13)
Las 13 carreras de grado están cargadas y habilitadas. Features construidos en
el camino: áreas/colores por carrera, grilla derivada de los terms (soporta
4 y 5 años), correlativas recomendadas (`corrRec`), gate de ciclo (`reqHasta`),
orientaciones con toggle (Ciencia Política, Ciencias Sociales), slots editables
con desplegable (`opciones`), y aviso de plan (`aviso`).
**Pendiente menor:** Ingeniería Industrial no tiene correlativas cargadas
(sólo materias + áreas, con aviso); agregarlas cuando estén disponibles.
**Verificar:** las áreas de las carreras cuyo material no las traía fueron
diseñadas (Abogacía, Arquitectura, Economía, Estudios Int., Historia, Diseño,
Ing. Industrial); Ciencias Sociales fue transcripción de mejor esfuerzo.

### 4. Landing / contexto
Página simple que explique qué es y cuánto sale (para gente que llega de afuera).

---

## ✅ Checklist pre-launch (técnico)

- [x] Activar "Confirm email" en Supabase.
- [ ] Cargar `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` en Vercel
      (Settings → Environment Variables) — **antes** de que rebuildee.
- [ ] Cambiar el **Site URL** de Supabase de `localhost` a
      `https://plan-estudios-eco-empresarial.vercel.app` al lanzar.
- [ ] Verificar que el deploy de producción levante con login + nube OK.

---

## 💡 Ideas / nice-to-have (sin prioridad)

- Backoffice propio en la app (lista de usuarios + buscador + botón activar),
  protegido por rol admin, si el Table Editor queda corto.
- Estado `expired` (hoy definido pero sin uso; sirve si algún día hay
  suscripción además del pago único).

---

## ❌ Decidido NO hacer

- **Login con nombre de usuario** (además del mail): suma complejidad
  (usuario único + lookup usuario→mail con riesgo de email harvesting) para
  poco valor. Se queda **solo con mail** (+ Google cuando se sume).
