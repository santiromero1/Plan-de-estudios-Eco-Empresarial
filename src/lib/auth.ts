/* auth.ts — Autenticación (provisional, hardcodeada).
   Esta capa está pensada para reemplazarse luego por un backend real con
   base de datos. Por ahora valida contra un usuario fijo y guarda la sesión
   en localStorage. El plan de cada usuario se persiste aparte (storage.ts).

   Cuando exista el back, sólo hay que reemplazar `login()` por una llamada a
   la API y mantener la misma forma de `Session`. */

export interface Carrera {
  id: string;
  label: string;
  /** true sólo para las carreras cuyo planificador ya está desarrollado. */
  disponible: boolean;
}

/** Carreras de grado de la UTDT (orden alfabético).
    Hoy sólo Economía Empresarial tiene el planificador desarrollado. */
export const CARRERAS: Carrera[] = [
  { id: 'abogacia', label: 'Abogacía', disponible: false },
  { id: 'admin-empresas', label: 'Administración de Empresas', disponible: false },
  { id: 'arquitectura', label: 'Arquitectura', disponible: false },
  { id: 'ciencia-politica', label: 'Ciencia Política y Gobierno', disponible: false },
  { id: 'ciencias-comportamiento', label: 'Ciencias del Comportamiento', disponible: false },
  { id: 'ciencias-sociales', label: 'Ciencias Sociales', disponible: false },
  { id: 'diseno', label: 'Diseño', disponible: false },
  { id: 'economia', label: 'Economía', disponible: false },
  { id: 'economia-empresarial', label: 'Economía Empresarial', disponible: true },
  { id: 'estudios-internacionales', label: 'Estudios Internacionales', disponible: false },
  { id: 'historia', label: 'Historia', disponible: false },
  { id: 'ingenieria-industrial', label: 'Ingeniería Industrial', disponible: false },
  { id: 'tecnologia-digital', label: 'Tecnología Digital', disponible: false },
];

export function carreraById(id: string): Carrera | undefined {
  return CARRERAS.find((c) => c.id === id);
}

export interface Session {
  user: string;
  carrera: string; // id de Carrera
}

// Credenciales fijas (provisional). Reemplazar por backend real más adelante.
const HARDCODED_USER = 'alumno';
const HARDCODED_PASS = 'ditella2026';

const AUTH_KEY = 'planificador-auth-v1';

export type LoginResult =
  | { ok: true; session: Session }
  | { ok: false; error: string };

/** Valida credenciales + carrera disponible. Persiste la sesión si todo OK. */
export function login(user: string, pass: string, carrera: string): LoginResult {
  const c = carreraById(carrera);
  if (!c) return { ok: false, error: 'Elegí una carrera para continuar.' };
  if (!c.disponible) {
    return {
      ok: false,
      error: 'El planificador para esta carrera todavía no está disponible.',
    };
  }
  if (user.trim() !== HARDCODED_USER || pass !== HARDCODED_PASS) {
    return { ok: false, error: 'Usuario o contraseña incorrectos.' };
  }
  const session: Session = { user: user.trim(), carrera: c.id };
  try {
    localStorage.setItem(AUTH_KEY, JSON.stringify(session));
  } catch {
    /* almacenamiento bloqueado: la sesión vive sólo en memoria */
  }
  return { ok: true, session };
}

/** Recupera la sesión persistida (si la hay). */
export function loadSession(): Session | null {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw);
    if (s && typeof s.user === 'string' && typeof s.carrera === 'string') {
      // Si la carrera dejó de estar disponible, invalida la sesión.
      const c = carreraById(s.carrera);
      if (c?.disponible) return s as Session;
    }
  } catch {
    /* corrupto */
  }
  return null;
}

export function logout(): void {
  try {
    localStorage.removeItem(AUTH_KEY);
  } catch {
    /* ignore */
  }
}
