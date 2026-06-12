/* Login — pantalla de ingreso. Usuario, contraseña y carrera.
   Credenciales hardcodeadas (ver lib/auth.ts); se reemplazará por backend. */
import { useMemo, useState } from 'react';
import { CARRERAS, carreraById, login, type Session } from '../lib/auth';
import { Icons } from './icons';

export function Login({ onLogin }: { onLogin: (s: Session) => void }) {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [carrera, setCarrera] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const carreraSel = useMemo(() => carreraById(carrera), [carrera]);
  const carreraNoDisponible = !!carreraSel && !carreraSel.disponible;
  const puedeIngresar =
    user.trim() !== '' && pass !== '' && !!carreraSel && carreraSel.disponible;

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = login(user, pass, carrera);
    if (res.ok) onLogin(res.session);
    else setError(res.error);
  }

  return (
    <div className="login-screen">
      <div className="login-card">
        <div className="login-head">
          <img className="login-logo" src="/ditella.png" alt="Universidad Torcuato Di Tella" />
          <h1>Mi Plan de Estudios</h1>
          <p>Ingresá para planificar tu cursada · UTDT</p>
        </div>

        <form className="login-form" onSubmit={onSubmit}>
          <label className="login-field">
            <span className="login-label">{Icons.user} Usuario</span>
            <input
              className="login-input"
              type="text"
              autoComplete="username"
              placeholder="Tu usuario"
              value={user}
              onChange={(e) => {
                setUser(e.target.value);
                setError(null);
              }}
            />
          </label>

          <label className="login-field">
            <span className="login-label">{Icons.lock} Contraseña</span>
            <div className="login-input-wrap">
              <input
                className="login-input"
                type={showPass ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="Tu contraseña"
                value={pass}
                onChange={(e) => {
                  setPass(e.target.value);
                  setError(null);
                }}
              />
              <button
                type="button"
                className="login-eye"
                onClick={() => setShowPass((s) => !s)}
                aria-label={showPass ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPass ? Icons.eyeOff : Icons.eye}
              </button>
            </div>
          </label>

          <label className="login-field">
            <span className="login-label">{Icons.cap} Carrera</span>
            <select
              className="login-input login-select"
              value={carrera}
              onChange={(e) => {
                setCarrera(e.target.value);
                setError(null);
              }}
            >
              <option value="" disabled>
                Elegí tu carrera
              </option>
              {CARRERAS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                  {!c.disponible ? ' — próximamente' : ''}
                </option>
              ))}
            </select>
          </label>

          {carreraNoDisponible && (
            <div className="login-notice">
              <span className="login-notice-ico">{Icons.spark}</span>
              <div>
                <b>¡Estamos trabajando en tu carrera!</b>
                <p>
                  El planificador de <b>{carreraSel!.label}</b> todavía no está disponible. Por
                  ahora sólo podés ingresar con <b>Economía Empresarial</b>. Muy pronto sumamos la
                  tuya. 🚀
                </p>
              </div>
            </div>
          )}

          {error && !carreraNoDisponible && <div className="login-error">{error}</div>}

          <button type="submit" className="login-submit" disabled={!puedeIngresar}>
            Ingresar
          </button>
        </form>

        <p className="login-foot">
          Acceso provisional para la demo · Economía Empresarial
        </p>
      </div>
    </div>
  );
}
