/* Header — barra superior (wordmark, tabs, métricas, alertas, acciones) + leyenda. */
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { PlanSummary, Subject } from '../types';
import { Icons } from './icons';
import { usePlan } from '../context/PlanContext';

type View = 'grid' | 'timeline';

function useOutside(ref: React.RefObject<HTMLElement>, onOut: () => void) {
  useEffect(() => {
    function h(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onOut();
    }
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

function Brand() {
  const { plan } = usePlan();
  return (
    <div className="brand">
      <img className="brand-logo" src="/ditella.png" alt="Universidad Torcuato Di Tella" />
      <div className="brand-text">
        <b>Mi Plan de Estudios</b>
        <small>{plan.label} · UTDT</small>
      </div>
    </div>
  );
}

function Tabs({ view, setView }: { view: View; setView: (v: View) => void }) {
  const gridRef = useRef<HTMLButtonElement>(null);
  const tlRef = useRef<HTMLButtonElement>(null);
  const [thumb, setThumb] = useState({ left: 0, width: 0, ready: false });

  function sync() {
    const el = view === 'grid' ? gridRef.current : tlRef.current;
    if (el) setThumb({ left: el.offsetLeft, width: el.offsetWidth, ready: true });
  }

  // Posiciona el indicador antes de pintar (sin flash en el primer render).
  useLayoutEffect(sync, [view]);
  useEffect(() => {
    const onR = () => sync();
    window.addEventListener('resize', onR);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(onR);
    return () => window.removeEventListener('resize', onR);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view]);

  return (
    <div className="tabs" role="tablist">
      <span
        className="tab-thumb"
        style={{
          transform: `translateX(${thumb.left}px)`,
          width: thumb.width,
          opacity: thumb.ready ? 1 : 0,
        }}
      />
      <button
        ref={gridRef}
        className={`tab ${view === 'grid' ? 'active' : ''}`}
        onClick={() => setView('grid')}
      >
        {Icons.grid} Grilla
      </button>
      <button
        ref={tlRef}
        className={`tab ${view === 'timeline' ? 'active' : ''}`}
        onClick={() => setView('timeline')}
      >
        {Icons.timeline} Timeline
      </button>
    </div>
  );
}

function AlertsButton({
  alertas,
  onJump,
}: {
  alertas: PlanSummary['alertas'];
  onJump: (s: Subject) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useOutside(ref, () => setOpen(false));
  const n = alertas.length;
  return (
    <div className="pop-wrap" ref={ref}>
      <button className={`alert-btn ${n === 0 ? 'none' : ''}`} onClick={() => setOpen((o) => !o)}>
        {n === 0 ? Icons.check : Icons.warn}
        {n === 0 ? 'Sin alertas' : `${n} alerta${n > 1 ? 's' : ''}`}
      </button>
      {open && (
        <div className="popover alert-pop">
          <h4>{Icons.warn} Conflictos de correlativa</h4>
          {n === 0 ? (
            <div className="alert-none">
              {Icons.check}
              <div>¡Todo en orden! No hay conflictos de correlativas en tu plan.</div>
            </div>
          ) : (
            alertas.map((a) => (
              <div
                key={a.subject.id}
                className="alert-row"
                onClick={() => {
                  setOpen(false);
                  onJump(a.subject);
                }}
              >
                <span className="ar-ico">{Icons.warn}</span>
                <div>
                  <div className="ar-name">{a.subject.nombre}</div>
                  <div className="ar-detail">
                    Falta aprobar antes: <b>{a.faltan.map((f) => f.nombre).join(', ')}</b>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function ActionsMenu({
  onExport,
  onImport,
  onReset,
  onLogout,
}: {
  onExport: () => void;
  onImport: () => void;
  onReset: () => void;
  onLogout: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useOutside(ref, () => setOpen(false));
  return (
    <div className="pop-wrap" ref={ref}>
      <button className="icon-btn" onClick={() => setOpen((o) => !o)} aria-label="Acciones">
        {Icons.dots}
      </button>
      {open && (
        <div className="popover">
          <button
            className="menu-item"
            onClick={() => {
              setOpen(false);
              onExport();
            }}
          >
            {Icons.download} Exportar plan (JSON)
          </button>
          <button
            className="menu-item"
            onClick={() => {
              setOpen(false);
              onImport();
            }}
          >
            {Icons.upload} Importar plan…
          </button>
          <button
            className="menu-item danger"
            onClick={() => {
              setOpen(false);
              onReset();
            }}
          >
            {Icons.reset} Resetear al plan oficial
          </button>
          <div className="menu-sep" />
          <button
            className="menu-item"
            onClick={() => {
              setOpen(false);
              onLogout();
            }}
          >
            {Icons.logout} Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}

interface Props {
  view: View;
  setView: (v: View) => void;
  summary: PlanSummary;
  onJump: (s: Subject) => void;
  onExport: () => void;
  onImport: () => void;
  onReset: () => void;
  onLogout: () => void;
}

export function Header({
  view,
  setView,
  summary,
  onJump,
  onExport,
  onImport,
  onReset,
  onLogout,
}: Props) {
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
            <span className="val">
              {summary.aprobadas}
              <small> / {summary.total}</small>
            </span>
            <span className="lbl">Aprobadas</span>
          </div>
        </div>
        <AlertsButton alertas={summary.alertas} onJump={onJump} />
        <ActionsMenu
          onExport={onExport}
          onImport={onImport}
          onReset={onReset}
          onLogout={onLogout}
        />
      </div>
    </header>
  );
}

export function Legend() {
  const { plan } = usePlan();
  return (
    <div className="legend">
      <span className="legend-title">Áreas</span>
      {plan.areas.map((a) => (
        <span key={a.id} className="legend-item">
          <span className="legend-dot" style={{ background: a.color }} />
          {a.label}
        </span>
      ))}
    </div>
  );
}
