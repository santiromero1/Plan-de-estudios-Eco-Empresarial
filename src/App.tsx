/* App — estado, validación en vivo, vistas y acciones. */
import { useMemo, useRef, useState } from 'react';
import type { Subject } from './types';
import { TERMS, freshPlan } from './data/plan';
import { buildIndex, correlativasIncumplidas, planSummary } from './lib/logic';
import { moveOrReorder } from './lib/board';
import { exportPlan, loadPlan, parseImported, savePlan } from './lib/storage';
import { Header, Legend } from './components/Header';
import { GridView } from './components/GridView';
import { TimelineView } from './components/TimelineView';
import { SubjectPanel } from './components/SubjectPanel';
import { Login } from './components/Login';
import { loadSession, logout, type Session } from './lib/auth';

type View = 'grid' | 'timeline';

export default function App() {
  const [session, setSession] = useState<Session | null>(loadSession);
  const [subjects, setSubjects] = useState<Subject[]>(loadPlan);
  const [view, setView] = useState<View>('grid');
  const [openId, setOpenId] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function onLogout() {
    logout();
    setSession(null);
    setOpenId(null);
  }

  if (!session) {
    return <Login onLogin={setSession} />;
  }

  const byId = useMemo(() => buildIndex(subjects), [subjects]);

  // Validación en vivo
  const { conflicts, faltanMap, summary } = useMemo(() => {
    const idx = buildIndex(subjects);
    const conflicts = new Set<string>();
    const faltanMap: Record<string, Subject[]> = {};
    subjects.forEach((s) => {
      const faltan = correlativasIncumplidas(s, idx, TERMS);
      faltanMap[s.id] = faltan;
      if (s.estado !== 'desinscripta' && s.estado !== 'aprobada' && faltan.length) {
        conflicts.add(s.id);
      }
    });
    return { conflicts, faltanMap, summary: planSummary(subjects, TERMS) };
  }, [subjects]);

  function commit(next: Subject[]) {
    setSubjects(next);
    savePlan(next);
  }

  function updateSubject(next: Subject) {
    commit(subjects.map((s) => (s.id === next.id ? { ...s, ...next } : s)));
  }

  function reorder(activeId: string, overId: string) {
    commit(moveOrReorder(subjects, activeId, overId));
  }

  function onImport() {
    fileRef.current?.click();
  }
  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      const data = parseImported(String(reader.result));
      if (data) commit(data);
      else alert('Archivo inválido: no es un plan exportado válido.');
    };
    reader.readAsText(f);
    e.target.value = '';
  }
  function onReset() {
    if (confirm('¿Resetear el plan al estado oficial inicial? Se perderán tus cambios.')) {
      const fresh = freshPlan();
      commit(fresh);
      setOpenId(null);
    }
  }

  const openSubject = openId ? subjects.find((s) => s.id === openId) : null;

  return (
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
  );
}
