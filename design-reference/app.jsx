/* app.jsx — App principal: estado, validación en vivo, vistas, acciones */
const { useState: useStateA, useMemo, useRef: useRefA } = React;

const STORAGE_KEY = 'planificador-ditella-v1';

function loadInitial() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return PLAN.SUBJECTS.map(s => ({ ...s }));
}

function App() {
  const [subjects, setSubjects] = useStateA(loadInitial);
  const [view, setView] = useStateA('grid');
  const [openId, setOpenId] = useStateA(null);
  const [dragDemo, setDragDemo] = useStateA(false);
  const fileRef = useRefA(null);

  // índice global para el panel (correlativas por nombre)
  window.__subjectsById = useMemo(() => Logic.buildIndex(subjects), [subjects]);

  // Validación en vivo
  const { conflicts, faltanMap, summary } = useMemo(() => {
    const byId = Logic.buildIndex(subjects);
    const conflicts = new Set();
    const faltanMap = {};
    subjects.forEach(s => {
      const faltan = Logic.correlativasIncumplidas(s, byId, PLAN.TERMS);
      faltanMap[s.id] = faltan;
      if (s.estado !== 'desinscripta' && s.estado !== 'aprobada' && faltan.length) conflicts.add(s.id);
    });
    return { conflicts, faltanMap, summary: Logic.planSummary(subjects, PLAN.TERMS) };
  }, [subjects]);

  function persist(next) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch (e) {}
  }

  function updateSubject(next) {
    setSubjects(prev => {
      const arr = prev.map(s => (s.id === next.id ? { ...s, ...next } : s));
      persist(arr);
      return arr;
    });
  }

  function onExport() {
    const blob = new Blob([JSON.stringify(subjects, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'mi-cursada.json'; a.click();
    URL.revokeObjectURL(url);
  }
  function onImport() { fileRef.current && fileRef.current.click(); }
  function onFile(e) {
    const f = e.target.files[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      try { const data = JSON.parse(r.result); if (Array.isArray(data)) { setSubjects(data); persist(data); } }
      catch (err) { alert('Archivo inválido'); }
    };
    r.readAsText(f);
    e.target.value = '';
  }
  function onReset() {
    if (confirm('¿Resetear el plan al estado oficial inicial? Se perderán tus cambios.')) {
      const fresh = PLAN.SUBJECTS.map(s => ({ ...s }));
      setSubjects(fresh); persist(fresh); setOpenId(null);
    }
  }

  const openSubject = openId ? subjects.find(s => s.id === openId) : null;

  // Demo de arrastre: levanta "Métodos Analíticos" y muestra zonas válidas/ inválidas
  const demoState = dragDemo ? {
    lifted: '3313',
    target: '2-2',
    invalid: ['1-1', '1-2'],
  } : null;

  // Inyecta clase lifted en la card demo (a través de faltanMap no; via prop) -> manejado en GridView demo
  const subjectsForGrid = dragDemo
    ? subjects.map(s => s.id === '3313' ? { ...s, __lifted: true } : s)
    : subjects;

  return (
    <div className="app">
      <Header view={view} setView={setView} summary={summary}
        onJump={(s) => { setView('grid'); setOpenId(s.id); }}
        onExport={onExport} onImport={onImport} onReset={onReset} />

      <input type="file" ref={fileRef} accept="application/json" style={{ display: 'none' }} onChange={onFile} />

      <main className="viewport">
        {view === 'grid' && (
          <>
            <div className="view-head">
              <div>
                <h1>Mi plan de cursada</h1>
                <p>Arrastrá cada materia al cuatrimestre donde la cursás. El color indica el área;
                   las alertas marcan correlativas pendientes.</p>
              </div>
              <button className={`tab ${dragDemo ? 'active' : ''}`} style={{
                  background: dragDemo ? 'var(--info)' : 'var(--surface)',
                  color: dragDemo ? '#fff' : 'var(--ink-2)',
                  border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}
                onClick={() => setDragDemo(d => !d)}>
                {Icons.hand} {dragDemo ? 'Salir de demo' : 'Ver demo de arrastre'}
              </button>
            </div>

            {dragDemo && (
              <div style={{ marginBottom: 18 }}>
                <span className="demo-note">{Icons.hand} Demo: arrastrando “Métodos Analíticos”.
                  Las zonas válidas se resaltan; donde su correlativa aún no está aprobada, queda bloqueado.</span>
              </div>
            )}

            <GridView subjects={subjectsForGrid} conflicts={conflicts} faltanMap={faltanMap}
              onCard={(s) => setOpenId(s.id)} demo={demoState} />

            <div style={{ marginTop: 26 }}><Legend /></div>
          </>
        )}

        {view === 'timeline' && (
          <>
            <TimelineView subjects={subjects} conflicts={conflicts} faltanMap={faltanMap}
              onCard={(s) => setOpenId(s.id)} />
            <div style={{ marginTop: 22 }}><Legend /></div>
          </>
        )}
      </main>

      {openSubject && (
        <SubjectPanel subject={openSubject}
          faltan={(openSubject.estado !== 'aprobada' && openSubject.estado !== 'desinscripta') ? faltanMap[openSubject.id] : []}
          onClose={() => setOpenId(null)} onChange={updateSubject} />
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
