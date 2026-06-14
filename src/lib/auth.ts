/* auth.ts — Autenticación con Supabase.
   Login/registro por mail + contraseña. El "nombre de usuario" y la carrera
   se guardan en la tabla `profiles`. El acceso a la app se gatea por
   `access_status` (pending → todavía no pagó; active → pagó; expired).

   Supabase maneja el hash de la contraseña, el reset por mail y la sesión
   persistida. Acá sólo orquestamos y traducimos errores al español. */

import { supabase } from './supabase';
import { hasPlan } from '../data/plan';

export interface Carrera {
  id: string;
  label: string;
  /** true sólo para las carreras cuyo planificador ya está desarrollado.
      Se deriva automáticamente del registro de planes (PLANS en data/plan). */
  disponible: boolean;
}

/** Carreras de grado de la UTDT (orden alfabético). La disponibilidad se
    calcula según si ya existe el plan en el registro: agregar una carrera a
    PLANS la habilita sola, sin tocar esta lista. */
const CARRERAS_RAW: { id: string; label: string }[] = [
  { id: 'abogacia', label: 'Abogacía' },
  { id: 'admin-empresas', label: 'Administración de Empresas' },
  { id: 'arquitectura', label: 'Arquitectura' },
  { id: 'ciencia-politica', label: 'Ciencia Política y Gobierno' },
  { id: 'ciencias-comportamiento', label: 'Ciencias del Comportamiento' },
  { id: 'ciencias-sociales', label: 'Ciencias Sociales' },
  { id: 'diseno', label: 'Diseño' },
  { id: 'economia', label: 'Economía' },
  { id: 'economia-empresarial', label: 'Economía Empresarial' },
  { id: 'estudios-internacionales', label: 'Estudios Internacionales' },
  { id: 'historia', label: 'Historia' },
  { id: 'ingenieria-industrial', label: 'Ingeniería Industrial' },
  { id: 'tecnologia-digital', label: 'Tecnología Digital' },
];

export const CARRERAS: Carrera[] = CARRERAS_RAW.map((c) => ({
  ...c,
  disponible: hasPlan(c.id),
}));

export function carreraById(id: string): Carrera | undefined {
  return CARRERAS.find((c) => c.id === id);
}

export type AccessStatus = 'pending' | 'active' | 'expired';

export interface Session {
  userId: string;
  email: string;
  username: string | null;
  carrera: string; // id de Carrera
  accessStatus: AccessStatus;
  /** orientación elegida (sólo carreras con orientaciones); null si no eligió. */
  orientacion: string | null;
}

export type AuthResult =
  | { ok: true; session: Session }
  | { ok: false; error: string }
  /** Registro OK pero falta confirmar el mail (sin sesión todavía). */
  | { ok: false; needsEmailConfirm: true };

interface ProfileRow {
  username: string | null;
  carrera: string;
  access_status: AccessStatus;
  orientacion?: string | null;
}

/** Trae el perfil del usuario logueado y arma la Session. Tolera que la
    columna `orientacion` todavía no exista (cae a la versión sin ella). */
async function buildSession(userId: string, email: string): Promise<Session | null> {
  let { data, error } = await supabase
    .from('profiles')
    .select('username, carrera, access_status, orientacion')
    .eq('id', userId)
    .single<ProfileRow>();

  if (error) {
    // Fallback: columna `orientacion` aún no creada en la DB.
    ({ data, error } = await supabase
      .from('profiles')
      .select('username, carrera, access_status')
      .eq('id', userId)
      .single<ProfileRow>());
  }

  if (error || !data) return null;
  return {
    userId,
    email,
    username: data.username,
    carrera: data.carrera,
    accessStatus: data.access_status,
    orientacion: data.orientacion ?? null,
  };
}

/** Guarda la orientación elegida por el usuario en su perfil. */
export async function setOrientacion(
  userId: string,
  orientacion: string,
): Promise<{ ok: boolean; error?: string }> {
  const { error } = await supabase
    .from('profiles')
    .update({ orientacion })
    .eq('id', userId);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

/** Registro: crea el usuario en Supabase Auth. El trigger `handle_new_user`
    crea la fila en `profiles` con username + carrera desde la metadata. */
export async function register(
  email: string,
  pass: string,
  username: string,
  carrera: string,
): Promise<AuthResult> {
  const c = carreraById(carrera);
  if (!c) return { ok: false, error: 'Elegí una carrera para continuar.' };
  if (!c.disponible) {
    return { ok: false, error: 'El planificador para esta carrera todavía no está disponible.' };
  }

  const { data, error } = await supabase.auth.signUp({
    email: email.trim(),
    password: pass,
    options: { data: { username: username.trim(), carrera: c.id } },
  });

  if (error) return { ok: false, error: traducirError(error.message) };

  // Sin sesión → Supabase espera confirmación por mail.
  if (!data.session || !data.user) return { ok: false, needsEmailConfirm: true };

  const session = await buildSession(data.user.id, data.user.email ?? email.trim());
  if (!session) return { ok: false, error: 'No se pudo cargar tu perfil. Probá iniciar sesión.' };
  return { ok: true, session };
}

/** Login con mail + contraseña. */
export async function login(email: string, pass: string): Promise<AuthResult> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password: pass,
  });

  if (error) return { ok: false, error: traducirError(error.message) };
  if (!data.user) return { ok: false, error: 'No se pudo iniciar sesión.' };

  const session = await buildSession(data.user.id, data.user.email ?? email.trim());
  if (!session) return { ok: false, error: 'No se pudo cargar tu perfil.' };
  return { ok: true, session };
}

/** Recupera la sesión persistida al abrir la app (si la hay). */
export async function getActiveSession(): Promise<Session | null> {
  const { data } = await supabase.auth.getUser();
  if (!data.user) return null;
  return buildSession(data.user.id, data.user.email ?? '');
}

export async function logout(): Promise<void> {
  await supabase.auth.signOut();
}

/** Envía mail de reseteo de contraseña. */
export async function requestPasswordReset(email: string): Promise<{ ok: boolean; error?: string }> {
  const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
    redirectTo: window.location.origin,
  });
  if (error) return { ok: false, error: traducirError(error.message) };
  return { ok: true };
}

/** Traduce los mensajes de error más comunes de Supabase al español. */
function traducirError(msg: string): string {
  const m = msg.toLowerCase();
  if (m.includes('invalid login credentials')) return 'Mail o contraseña incorrectos.';
  if (m.includes('email not confirmed')) return 'Confirmá tu mail antes de ingresar.';
  if (m.includes('user already registered') || m.includes('already been registered'))
    return 'Ya existe una cuenta con ese mail. Iniciá sesión.';
  if (m.includes('password should be at least'))
    return 'La contraseña debe tener al menos 6 caracteres.';
  if (m.includes('unable to validate email') || m.includes('invalid email'))
    return 'El mail no es válido.';
  if (m.includes('rate limit') || m.includes('too many'))
    return 'Demasiados intentos. Esperá un momento e intentá de nuevo.';
  return 'Ocurrió un error. Intentá de nuevo.';
}
