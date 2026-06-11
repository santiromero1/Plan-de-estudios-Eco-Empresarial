/* panel.jsx — Drawer de materia: cambiar estado, nota, anual, editar electiva */
const { useState: useStateP, useEffect: useEffectP } = React;

const ESTADOS_ORDEN = ['pendiente', 'en-curso', 'aprobada', 'desaprobada', 'desinscripta'];

function SubjectPanel({ subject, faltan, onClose, onChange }) {
  const [local, setLocal] = useStateP(subject);
  useEffectP(() => setLocal(subject), [subject]);

  const meta = ESTADO_META[local.estado];
  const isAprobada = local.estado === 'aprobada';
  const aprueba = local.nota != null && local.nota >= Logic.NOTA_APROBACION;

  function patch(p) {
    const next = { ...local, ...p };
    setLocal(next);
    onChange(next);
  }

  function setEstado(e) {
    const p = { estado: e };
    if (e !== 'aprobada') p.nota = null;
    else if (local.nota == null) p.nota = 7;
    patch(p);
  }

  function setNota(v) {
    if (v === '') return patch({ nota: null });
    let n = Math.max(1, Math.min(10, Number(v)));
    patch({ nota: n });
  }

  return (
    <>
      <div className="scrim" onClick={onClose} />
      <aside className="panel" role="dialog" aria-label={`Materia ${local.nombre}`}>
        <header className="panel-head">
          <span className={`panel-area-tag area-${local.area}`}
                style={{ background: `var(--${local.area}-tint)`, color: `var(--${local.area})` }}>
            <span className="legend-dot" style={{ background: `var(--${local.area})` }} />
            {PLAN.AREAS[local.area].label}
          </span>
          <button className="panel-close" onClick={onClose} aria-label="Cerrar">{Icons.x}</button>
          <h2 className="panel-title">{local.nombre || 'Electiva sin nombre'}</h2>
          <div className="panel-sub">
            {local.codigo && <span className="card-code">Cód. {local.codigo}</span>}
            {local.codigo && <span className="dot" style={{ width: 3, height: 3, borderRadius: '50%', background: 'currentColor', opacity: .5 }} />}
            <span>{meta.label}{isAprobada && aprueba ? ` · ${local.nota}` : ''}</span>
          </div>
        </header>

        <div className="panel-body">
          {/* Conflicto banner */}
          {faltan && faltan.length > 0 && (
            <div className="panel-conflict-banner">
              {Icons.warn}
              <div>Esta materia está ubicada antes de aprobar {faltan.length === 1 ? 'su correlativa' : 'sus correlativas'}:{' '}
                <b>{faltan.map(f => f.nombre).join(', ')}</b>. Movela a un cuatrimestre posterior para resolver la alerta.</div>
            </div>
          )}

          {/* Editar nombre de electiva */}
          {local.esElectiva && (
            <div>
              <div className="field-label">{Icons.pencil} Nombre de la electiva</div>
              <input className="text-input" value={local.nombre}
                     placeholder="Ej. Programación I"
                     onChange={e => patch({ nombre: e.target.value })} />
            </div>
          )}

          {/* Estado */}
          <div>
            <div className="field-label">{Icons.spark} Estado de cursada</div>
            <div className="seg">
              {ESTADOS_ORDEN.map(e => (
                <button key={e} className={`${e} ${local.estado === e ? 'on ' + e : ''}`}
                        onClick={() => setEstado(e)}>
                  <span className="seg-dot" style={{ background: ESTADO_META[e].color }} />
                  {ESTADO_META[e].label}
                </button>
              ))}
            </div>
          </div>

          {/* Nota (solo aprobada) */}
          {isAprobada && (
            <div>
              <div className="field-label">{Icons.check} Nota final</div>
              <div className="nota-row">
                <input className="nota-input" type="number" min="1" max="10"
                       value={local.nota ?? ''} onChange={e => setNota(e.target.value)} />
                <div className={`nota-hint ${aprueba ? '' : 'fail'}`}>
                  {aprueba
                    ? <>Materia <b>aprobada</b> (≥ {Logic.NOTA_APROBACION}).<br/>Entra al promedio.</>
                    : <>Con nota &lt; {Logic.NOTA_APROBACION} <b>no aprueba</b>.<br/>No suma al promedio.</>}
                </div>
              </div>
            </div>
          )}

          {/* Anual */}
          {!local.esElectiva && (
            <div className="toggle-row" onClick={() => patch({ anual: !local.anual })} style={{ cursor: 'pointer' }}>
              <div className="tr-text">
                <b>Materia anual</b>
                <small>Abarca los dos semestres del año</small>
              </div>
              <div className={`switch ${local.anual ? 'on' : ''}`} />
            </div>
          )}

          {/* Correlativas */}
          <div>
            <div className="field-label">{Icons.link} Correlativas requeridas</div>
            {(!local.corr || local.corr.length === 0)
              ? <div className="corr-empty">Sin correlativas — se puede cursar en cualquier momento.</div>
              : <div className="corr-list">
                  {local.corr.map(cid => {
                    const c = window.__subjectsById[cid];
                    if (!c) return null;
                    const incumplida = faltan && faltan.some(f => f.id === cid);
                    return (
                      <div key={cid} className={`corr-item ${incumplida ? 'bad' : 'ok'}`}>
                        <span className="ci-ico">{incumplida ? Icons.warn : Icons.check}</span>
                        <span className="ci-name">{c.nombre}</span>
                        <span className="ci-state">{ESTADO_META[c.estado].label}</span>
                      </div>
                    );
                  })}
                </div>}
          </div>
        </div>
      </aside>
    </>
  );
}

window.SubjectPanel = SubjectPanel;
