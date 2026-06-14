/* AccessGate — pantalla para usuarios sin acceso activo (todavía no pagaron).
   En la Etapa 2 acá irá el botón de pago (Mercado Pago). Por ahora informa que
   el acceso está pendiente de activación y permite contactar soporte. */
import { useState } from 'react';
import { nombreDePila, type Session } from '../lib/auth';
import { Icons } from './icons';
import { SupportModal } from './SupportModal';

export function AccessGate({
  session,
  onLogout,
}: {
  session: Session;
  onLogout: () => void;
}) {
  const [support, setSupport] = useState(false);
  const expirado = session.accessStatus === 'expired';
  const nombre = nombreDePila(session.username);
  return (
    <div className="login-screen">
      <div className="login-card">
        <div className="login-head">
          <img className="login-logo" src="/ditella.png" alt="Universidad Torcuato Di Tella" />
          <h1>{expirado ? 'Tu acceso venció' : 'Activá tu acceso'}</h1>
          <p>
            Hola{nombre ? ` ${nombre}` : ''}, tu cuenta está creada
            {expirado ? ', pero el acceso venció.' : ' pero todavía no tiene el acceso activo.'}
          </p>
        </div>

        <div className="login-notice">
          <span className="login-notice-ico">{Icons.lock}</span>
          <div>
            <b>Acceso pendiente de activación</b>
            <p>
              Muy pronto vas a poder activar tu acceso desde acá. Mientras tanto, si ya hiciste el
              pago, avisanos y lo activamos.
            </p>
          </div>
        </div>

        <button type="button" className="login-submit" onClick={() => setSupport(true)}>
          {Icons.inbox} Contactar soporte
        </button>

        <button type="button" className="login-link" onClick={onLogout}>
          {Icons.logout} Cerrar sesión
        </button>
      </div>

      {support && (
        <SupportModal session={session} contexto="activacion" onClose={() => setSupport(false)} />
      )}
    </div>
  );
}
