/* App — orquesta sesión, gate de acceso y el planificador.
     - Carga la sesión de Supabase al iniciar.
     - Sin sesión → Login. Sesión sin acceso activo → AccessGate.
     - Con acceso activo → Planner (plan + autoguardado en la nube). */
import { useEffect, useMemo, useRef, useState } from 'react';
import type { CarreraPlan, Subject } from './types';
import { freshPlan, getPlan } from './data/plan';
import { buildIndex, correlativasIncumplidas, planSummary } from './lib/logic';
import { moveOrReorder } from './lib/board';
import {
  exportPlan,
  loadPlan,
  parseImported,
  saveLocalCache,
  syncPlanToCloud,
} from './lib/storage';
import { Header, Legend } from './components/Header';
import { GridView } from './components/GridView';
import { TimelineView } from './components/TimelineView';
import { SubjectPanel } from './components/SubjectPanel';
import { Login } from './components/Login';
import { AccessGate } from './components/AccessGate';
import { PlanProvider } from './context/PlanContext';
import { getActiveSession, logout, type Session } from './lib/auth';

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [bootstrapping, setBootstrapping] = useState(true);

  // Recupera la sesión persistida al abrir la app.
  useEffect(() => {
    getActiveSession()
      .then(setSession)
      .finally(() => setBootstrapping(false));
  }, []);

  async function onLogout() {
    await logout();
    setSession(null);
  }

  if (bootstrapping) {
    return <SplashLoader label="Cargando…" />;
  }

  if (!session) {
    return <Login onLogin={setSession} />;
  }

  if (session.accessStatus !== 'active') {
    return <AccessGate session={session} onLogout={onLogout} />;
  }

  const plan = getPlan(session.carrera);
  if (!plan) {
    // No debería pasar (el login sólo deja entrar a carreras con plan),
    // pero por las dudas no rompemos la app.
    return <AccessGate session={session} onLogout={onLogout} />;
  }

  return <Planner session={session} plan={plan} onLogout={onLogout} />;
}

type View = 'grid' | 'timeline';
type SaveState = 'idle' | 'saving' | 'saved' | 'error';

function Planner({
  session,
  plan,
  onLogout,
}: {
  session: Session;
  plan: CarreraPlan;
  onLogout: () => void;
}) {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [planLoading, setPlanLoading] = useState(true);
  const [view, setView] = useState<View>('grid');
  const [openId, setOpenId] = useState<string | null>(null);
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const fileRef = useRef<HTMLInputElement>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Carga el plan del usuario desde la nube (con migración local si hace falta).
  useEffect(() => {
    let cancelled = false;
    setPlanLoading(true);
    loadPlan(session.userId, session.carrera).then((plan) => {
      if (!cancelled) {
        setSubjects(plan);
        setPlanLoading(false);
      }
    });
    return () => {
      cancelled = true;
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [session.userId, session.carrera]);

  const byId = useMemo(() => buildIndex(subjects), [subjects]);

  // Validación en vivo
  const { conflicts, faltanMap, summary } = useMemo(() => {
    const idx = buildIndex(subjects);
    const conflicts = new Set<string>();
    const faltanMap: Record<string, Subject[]> = {};
    subjects.forEach((s) => {
      const faltan = correlativasIncumplidas(s, idx, plan.terms);
      faltanMap[s.id] = faltan;
      if (s.estado !== 'desinscripta' && s.estado !== 'aprobada' && faltan.length) {
        conflicts.add(s.id);
      }
    });
    return {
      conflicts,
      faltanMap,
      summary: planSummary(subjects, plan.terms, plan.notaAprobacion),
    };
  }, [subjects, plan]);

  /** Aplica el cambio, guarda al instante en local y sincroniza a la nube
      con debounce (~1s tras el último cambio). */
  function commit(next: Subject[]) {
    setSubjects(next);
    saveLocalCache(session.userId, session.carrera, next);
    setSaveState('saving');
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      const res = await syncPlanToCloud(session.userId, session.carrera, next);
      setSaveState(res.ok ? 'saved' : 'error');
      if (res.ok) setTimeout(() => setSaveState('idle'), 2000);
    }, 1000);
  }

  function updateSubject(next: Subject) {
    commit(subjects.map((s) => (s.id === next.id ? { ...s, ...next } : s)));
  }
  function reorder(activeId: string, overId: string) {
    commit(moveOrReorder(subjects, activeId, overId, plan.terms));
  }

  function onImport() {
    fileRef.current?.click();
  }
  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      const data = parseImported(String(reader.result), session.carrera);
      if (data) commit(data);
      else alert('Archivo inválido: no es un plan exportado válido.');
    };
    reader.readAsText(f);
    e.target.value = '';
  }
  function onReset() {
    if (confirm('¿Resetear el plan al estado oficial inicial? Se perderán tus cambios.')) {
      commit(freshPlan(session.carrera));
      setOpenId(null);
    }
  }

  if (planLoading) {
    return <SplashLoader label="Cargando tu plan…" />;
  }

  const openSubject = openId ? subjects.find((s) => s.id === openId) : null;

  return (
    <PlanProvider plan={plan}>
      <div className="app">
      <Header
        view={view}
        setView={setView}
        summary={summary}
        onJump={(s) => {
          setView('grid');
          setOpenId(s.id);
        }}
        onExport={() => exportPlan(subjects)}
        onImport={onImport}
        onReset={onReset}
        onLogout={onLogout}
      />

      <SaveBadge state={saveState} />

      <input
        type="file"
        ref={fileRef}
        accept="application/json"
        style={{ display: 'none' }}
        onChange={onFile}
      />

      <main className="viewport">
        <div key={view} className="view-swap">
          {view === 'grid' && (
            <>
              <div className="view-head">
                <div>
                  <h1>Mi plan de cursada</h1>
                  <p>
                    Arrastrá cada materia al cuatrimestre donde la cursás y ordenalas como quieras
                    dentro del semestre. El color indica el área; las alertas marcan correlativas
                    pendientes. Hacé click en una materia para cargar nota, estado o marcarla anual.
                  </p>
                </div>
              </div>

              <GridView
                subjects={subjects}
                conflicts={conflicts}
                faltanMap={faltanMap}
                onCard={(s) => setOpenId(s.id)}
                onReorder={reorder}
              />

              <div style={{ marginTop: 26 }}>
                <Legend />
              </div>
            </>
          )}

          {view === 'timeline' && (
            <>
              <TimelineView
                subjects={subjects}
                conflicts={conflicts}
                faltanMap={faltanMap}
                onCard={(s) => setOpenId(s.id)}
                onReorder={reorder}
              />
              <div style={{ marginTop: 22 }}>
                <Legend />
              </div>
            </>
          )}
        </div>
      </main>

      {openSubject && (
        <SubjectPanel
          subject={openSubject}
          faltan={
            openSubject.estado !== 'aprobada' && openSubject.estado !== 'desinscripta'
              ? faltanMap[openSubject.id] || []
              : []
          }
          byId={byId}
          onClose={() => setOpenId(null)}
          onChange={updateSubject}
        />
      )}
      </div>
    </PlanProvider>
  );
}

function SplashLoader({ label }: { label: string }) {
  return (
    <div className="splash">
      <div className="splash-spinner" />
      <p>{label}</p>
    </div>
  );
}

function SaveBadge({ state }: { state: SaveState }) {
  if (state === 'idle') return null;
  const text =
    state === 'saving' ? 'Guardando…' : state === 'saved' ? 'Guardado ✓' : 'Error al guardar';
  return <div className={`save-badge save-badge--${state}`}>{text}</div>;
}
