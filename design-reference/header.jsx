/* header.jsx — Barra superior (wordmark, tabs, métricas, alertas, acciones) + leyenda */
const { useState: useStateH, useRef: useRefH, useEffect: useEffectH } = React;

function useOutside(ref, onOut) {
  useEffectH(() => {
    function h(e) { if (ref.current && !ref.current.contains(e.target)) onOut(); }
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
}

function Brand() {
  return (
    <div className="brand">
      <div className="brand-mark"><span/><span/><span/><span/></div>
      <div className="brand-text">
        <b>Mi Cursada</b>
        <small>Economía Empresarial · UTDT</small>
      </div>
    </div>
  );
}

function Tabs({ view, setView }) {
  return (
    <div className="tabs" role="tablist">
      <button className={`tab ${view === 'grid' ? 'active' : ''}`} onClick={() => setView('grid')}>
        {Icons.grid} Grilla
      </button>
      <button className={`tab ${view === 'timeline' ? 'active' : ''}`} onClick={() => setView('timeline')}>
        {Icons.timeline} Timeline
      </button>
    </div>
  );
}

function AlertsButton({ alertas, onJump }) {
  const [open, setOpen] = useStateH(false);
  const ref = useRefH();
  useOutside(ref, () => setOpen(false));
  const n = alertas.length;
  return (
    <div className="pop-wrap" ref={ref}>
      <button className={`alert-btn ${n === 0 ? 'none' : ''}`} onClick={() => setOpen(o => !o)}>
        {n === 0 ? Icons.check : Icons.warn}
        {n === 0 ? 'Sin alertas' : `${n} alerta${n > 1 ? 's' : ''}`}
      </button>
      {open && (
        <div className="popover alert-pop">
          <h4>{Icons.warn} Conflictos de correlativa</h4>
          {n === 0
            ? <div className="alert-none">{Icons.check}<div>¡Todo en orden! No hay conflictos de correlativas en tu plan.</div></div>
            : alertas.map(a => (
                <div key={a.subject.id} className="alert-row" onClick={() => { setOpen(false); onJump(a.subject); }}>
                  <span className="ar-ico">{Icons.warn}</span>
                  <div>
                    <div className="ar-name">{a.subject.nombre}</div>
                    <div className="ar-detail">Falta aprobar antes: <b>{a.faltan.map(f => f.nombre).join(', ')}</b></div>
                  </div>
                </div>
              ))}
        </div>
      )}
    </div>
  );
}

function ActionsMenu({ onExport, onImport, onReset }) {
  const [open, setOpen] = useStateH(false);
  const ref = useRefH();
  useOutside(ref, () => setOpen(false));
  return (
    <div className="pop-wrap" ref={ref}>
      <button className="icon-btn" onClick={() => setOpen(o => !o)} aria-label="Acciones">{Icons.dots}</button>
      {open && (
        <div className="popover">
          <button className="menu-item" onClick={() => { setOpen(false); onExport(); }}>{Icons.download} Exportar plan (JSON)</button>
          <button className="menu-item" onClick={() => { setOpen(false); onImport(); }}>{Icons.upload} Importar plan…</button>
          <button className="menu-item danger" onClick={() => { setOpen(false); onReset(); }}>{Icons.reset} Resetear al plan oficial</button>
        </div>
      )}
    </div>
  );
}

function Header({ view, setView, summary, onJump, onExport, onImport, onReset }) {
  const prom = summary.promedio;
  return (
    <header className="header">
      <div className="header-inner">
        <Brand />
        <Tabs view={view} setView={setView} />
        <div className="header-spacer" />
        <div className="metrics">
          <div className="metric">
            <span className="val">{prom != null ? prom.toFixed(2) : '—'}</span>
            <span className="lbl">Promedio</span>
          </div>
          <div className="metric">
            <span className="val">{summary.aprobadas}<small> / {summary.total}</small></span>
            <span className="lbl">Aprobadas</span>
          </div>
        </div>
        <AlertsButton alertas={summary.alertas} onJump={onJump} />
        <ActionsMenu onExport={onExport} onImport={onImport} onReset={onReset} />
      </div>
    </header>
  );
}

function Legend() {
  const items = [
    ['negocios', 'Negocios'],
    ['economia', 'Economía y Cs. Sociales'],
    ['datos', 'Datos y Análisis Cuantitativo'],
    ['electivas', 'Electivas'],
  ];
  return (
    <div className="legend">
      <span className="legend-title">Áreas</span>
      {items.map(([k, label]) => (
        <span key={k} className="legend-item">
          <span className="legend-dot" style={{ background: `var(--${k})` }} />
          {label}
        </span>
      ))}
    </div>
  );
}

Object.assign(window, { Header, Legend });
