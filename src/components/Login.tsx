/* Login — ingreso y registro con mail + contraseña (Supabase).
   El "nombre de usuario" y la carrera se piden sólo al registrarse. */
import { useMemo, useState } from 'react';
import {
  CARRERAS,
  carreraById,
  login,
  register,
  requestPasswordReset,
  type Session,
} from '../lib/auth';
import { Icons } from './icons';

type Mode = 'login' | 'register';

export function Login({ onLogin }: { onLogin: (s: Session) => void }) {
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [username, setUsername] = useState('');
  const [carrera, setCarrera] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const carreraSel = useMemo(() => carreraById(carrera), [carrera]);
  const carreraNoDisponible = !!carreraSel && !carreraSel.disponible;

  const puedeIngresar =
    mode === 'login'
      ? email.trim() !== '' && pass !== ''
      : email.trim() !== '' &&
        pass !== '' &&
        username.trim() !== '' &&
        !!carreraSel &&
        carreraSel.disponible;

  function reset(next: Mode) {
    setMode(next);
    setError(null);
    setInfo(null);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setError(null);
    setInfo(null);
    setLoading(true);
    try {
      const res =
        mode === 'login'
          ? await login(email, pass)
          : await register(email, pass, username, carrera);

      if (res.ok) {
        onLogin(res.session);
        return;
      }
      if ('needsEmailConfirm' in res) {
        setInfo('¡Listo! Te enviamos un mail para confirmar tu cuenta. Revisá tu casilla.');
        setMode('login');
        return;
      }
      setError(res.error);
    } finally {
      setLoading(false);
    }
  }

  async function onForgot() {
    if (!email.trim()) {
      setError('Escribí tu mail arriba y volvé a tocar "¿Olvidaste tu contraseña?".');
      return;
    }
    setError(null);
    setInfo(null);
    setLoading(true);
    const res = await requestPasswordReset(email);
    setLoading(false);
    if (res.ok) setInfo('Si el mail existe, te enviamos un enlace para restablecer la contraseña.');
    else setError(res.error ?? 'No se pudo enviar el mail.');
  }

  return (
    <div className="login-screen">
      <div className="login-card">
        <div className="login-head">
          <img className="login-logo" src="/ditella.png" alt="Universidad Torcuato Di Tella" />
          <h1>Mi Plan de Estudios</h1>
          <p>Planificá tu cursada · UTDT</p>
        </div>

        <div className="login-tabs" role="tablist">
          <button
            type="button"
            role="tab"
            className={`login-tab ${mode === 'login' ? 'is-active' : ''}`}
            aria-selected={mode === 'login'}
            onClick={() => reset('login')}
          >
            Ingresar
          </button>
          <button
            type="button"
            role="tab"
            className={`login-tab ${mode === 'register' ? 'is-active' : ''}`}
            aria-selected={mode === 'register'}
            onClick={() => reset('register')}
          >
            Crear cuenta
          </button>
        </div>

        <form className="login-form" onSubmit={onSubmit}>
          <label className="login-field">
            <span className="login-label">{Icons.user} Mail</span>
            <input
              className="login-input"
              type="email"
              autoComplete="email"
              placeholder="tu@mail.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(null);
              }}
            />
          </label>

          {mode === 'register' && (
            <label className="login-field">
              <span className="login-label">{Icons.user} Nombre de usuario</span>
              <input
                className="login-input"
                type="text"
                autoComplete="username"
                placeholder="Cómo querés que te llamemos"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError(null);
                }}
              />
            </label>
          )}

          <label className="login-field">
            <span className="login-label">{Icons.lock} Contraseña</span>
            <div className="login-input-wrap">
              <input
                className="login-input"
                type={showPass ? 'text' : 'password'}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                placeholder={mode === 'register' ? 'Mínimo 6 caracteres' : 'Tu contraseña'}
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

          {mode === 'register' && (
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
          )}

          {mode === 'register' && carreraNoDisponible && (
            <div className="login-notice">
              <span className="login-notice-ico">{Icons.spark}</span>
              <div>
                <b>¡Estamos trabajando en tu carrera!</b>
                <p>
                  El planificador de <b>{carreraSel!.label}</b> todavía no está disponible. Muy
                  pronto sumaremos tu carrera. 🚀
                </p>
              </div>
            </div>
          )}

          {info && <div className="login-info">{info}</div>}
          {error && !carreraNoDisponible && <div className="login-error">{error}</div>}

          <button type="submit" className="login-submit" disabled={!puedeIngresar || loading}>
            {loading ? 'Un momento…' : mode === 'login' ? 'Ingresar' : 'Crear cuenta'}
          </button>

          {mode === 'login' && (
            <button type="button" className="login-link" onClick={onForgot} disabled={loading}>
              ¿Olvidaste tu contraseña?
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
