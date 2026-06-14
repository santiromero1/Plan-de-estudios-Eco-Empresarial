/* SupportModal — formulario de "Contactar soporte". Se usa en dos contextos:
   - 'activacion': desde la pantalla de acceso pendiente (recordar activación).
   - 'general': desde la app (correcciones de plan, sugerencias, bugs). */
import { useState } from 'react';
import type { Session } from '../lib/auth';
import { sendSupportMessage } from '../lib/support';
import { carreraById } from '../lib/auth';
import { Icons } from './icons';

const TIPOS_GENERAL = [
  'Corrección de plan de estudios',
  'Sugerencia / mejora',
  'Reportar un error',
  'Otro',
];

export function SupportModal({
  session,
  contexto,
  onClose,
}: {
  session: Session;
  contexto: 'activacion' | 'general';
  onClose: () => void;
}) {
  const [tipo, setTipo] = useState(
    contexto === 'activacion' ? 'Activación de cuenta' : TIPOS_GENERAL[0],
  );
  const [mensaje, setMensaje] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const carreraLabel = carreraById(session.carrera)?.label ?? session.carrera;
  const puedeEnviar = contexto === 'activacion' || mensaje.trim() !== '';

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (sending || !puedeEnviar) return;
    setSending(true);
    setError(null);
    const res = await sendSupportMessage({
      userId: session.userId,
      email: session.email,
      nombre: session.username ?? '',
      carrera: carreraLabel,
      tipo,
      mensaje:
        mensaje.trim() ||
        (contexto === 'activacion'
          ? 'El usuario pide que le activen el acceso (creó la cuenta y está esperando).'
          : ''),
    });
    setSending(false);
    if (res.ok) setDone(true);
    else setError(res.error ?? 'No se pudo enviar.');
  }

  return (
    <>
      <div className="scrim" onClick={onClose} />
      <div className="support-modal" role="dialog" aria-label="Contactar soporte">
        <button className="support-close" onClick={onClose} aria-label="Cerrar">
          {Icons.x}
        </button>

        {done ? (
          <div className="support-done">
            <span className="support-done-ico">{Icons.check}</span>
            <h3>¡Mensaje enviado!</h3>
            <p>
              {contexto === 'activacion'
                ? 'Te vamos a activar el acceso a la brevedad. ¡Gracias!'
                : 'Gracias por escribirnos. Lo vamos a revisar.'}
            </p>
            <button type="button" className="login-submit" onClick={onClose}>
              Cerrar
            </button>
          </div>
        ) : (
          <form className="support-form" onSubmit={onSubmit}>
            <h3>{Icons.inbox} Contactar soporte</h3>
            <p className="support-intro">
              {contexto === 'activacion'
                ? 'Avisanos que ya creaste tu cuenta y querés que te activemos el acceso. Te llega a Santiago directo.'
                : 'Contanos una corrección de un plan, una sugerencia, o algo que no funcione. Lo recibimos directo.'}
            </p>

            {contexto === 'general' && (
              <label className="login-field">
                <span className="login-label">Tipo</span>
                <select
                  className="login-input login-select"
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                >
                  {TIPOS_GENERAL.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </label>
            )}

            <label className="login-field">
              <span className="login-label">
                Mensaje{contexto === 'activacion' ? ' (opcional)' : ''}
              </span>
              <textarea
                className="login-input support-textarea"
                placeholder={
                  contexto === 'activacion'
                    ? 'Podés dejar una nota o enviarlo vacío.'
                    : 'Escribí tu mensaje…'
                }
                value={mensaje}
                onChange={(e) => {
                  setMensaje(e.target.value);
                  setError(null);
                }}
                rows={5}
              />
            </label>

            <div className="support-meta">
              Se envía como <b>{session.username}</b> ({session.email}) · {carreraLabel}
            </div>

            {error && <div className="login-error">{error}</div>}

            <button type="submit" className="login-submit" disabled={!puedeEnviar || sending}>
              {sending ? 'Enviando…' : 'Enviar'}
            </button>
          </form>
        )}
      </div>
    </>
  );
}
