/* support.ts — Envío de mensajes de soporte.
   Hace dos cosas (best-effort, independientes):
   1) Guarda el mensaje en la tabla `support_messages` de Supabase (queda
      registro, no se pierde aunque falle el mail).
   2) Manda un mail a tu casilla vía Web3Forms (servicio sin backend).
   La access key de Web3Forms va en VITE_WEB3FORMS_KEY (es pública). */

import { supabase } from './supabase';

const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY as string | undefined;

export interface SupportPayload {
  userId: string;
  email: string;
  nombre: string; // nombre completo
  carrera: string;
  tipo: string;
  mensaje: string;
}

export async function sendSupportMessage(
  p: SupportPayload,
): Promise<{ ok: boolean; error?: string }> {
  // 1) Guardar en Supabase
  const dbRes = await supabase.from('support_messages').insert({
    user_id: p.userId,
    email: p.email,
    nombre: p.nombre,
    carrera: p.carrera,
    tipo: p.tipo,
    mensaje: p.mensaje,
  });

  // 2) Mandar mail (si hay access key configurada)
  let mailOk = !WEB3FORMS_KEY ? false : true;
  if (WEB3FORMS_KEY) {
    try {
      const r = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: `Soporte UTDT — ${p.tipo}`,
          from_name: 'Planificador UTDT',
          name: p.nombre,
          email: p.email,
          replyto: p.email,
          message:
            `Tipo: ${p.tipo}\n` +
            `Carrera: ${p.carrera}\n` +
            `Usuario: ${p.nombre} <${p.email}>\n\n` +
            `${p.mensaje}`,
        }),
      });
      const j = await r.json();
      mailOk = !!j.success;
    } catch {
      mailOk = false;
    }
  }

  // Si al menos uno funcionó, lo damos por enviado.
  if (dbRes.error && !mailOk) {
    return { ok: false, error: 'No se pudo enviar el mensaje. Probá de nuevo.' };
  }
  return { ok: true };
}
