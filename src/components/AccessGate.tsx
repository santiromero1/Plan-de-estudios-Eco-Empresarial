/* AccessGate — pantalla para usuarios sin acceso activo (todavía no pagaron).
   En la Etapa 2 acá irá el botón de pago (Mercado Pago). Por ahora informa que
   el acceso está pendiente de activación. */
import type { Session } from '../lib/auth';
import { Icons } from './icons';

export function AccessGate({
  session,
  onLogout,
}: {
  session: Session;
  onLogout: () => void;
}) {
  const expirado = session.accessStatus === 'expired';
  return (
    <div className="login-screen">
      <div className="login-card">
        <div className="login-head">
          <img className="login-logo" src="/ditella.png" alt="Universidad Torcuato Di Tella" />
          <h1>{expirado ? 'Tu acceso venció' : 'Activá tu acceso'}</h1>
          <p>
            Hola{session.username ? ` ${session.username}` : ''}, tu cuenta está creada
            {expirado ? ', pero el acceso venció.' : ' pero todavía no tiene el acceso activo.'}
          </p>
        </div>

        <div className="login-notice">
          <span className="login-notice-ico">{Icons.lock}</span>
          <div>
            <b>Acceso pendiente de activación</b>
            <p>
              Muy pronto vas a poder activar tu acceso desde acá. Mientras tanto, si ya hiciste el
              pago, escribinos y lo activamos.
            </p>
          </div>
        </div>

        <button type="button" className="login-link" onClick={onLogout}>
          {Icons.logout} Cerrar sesión
        </button>
      </div>
    </div>
  );
}
