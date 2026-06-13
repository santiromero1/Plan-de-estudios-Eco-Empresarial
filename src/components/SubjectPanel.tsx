/* SubjectPanel — Drawer de materia: estado, nota, anual, editar electiva. */
import { useEffect, useState } from 'react';
import type { Estado, Subject } from '../types';
import { Icons, ESTADO_META } from './icons';
import { usePlan } from '../context/PlanContext';

const ESTADOS_ORDEN: Estado[] = [
  'pendiente',
  'en-curso',
  'aprobada',
  'desaprobada',
  'desinscripta',
];

interface Props {
  subject: Subject;
  faltan: Subject[];
  byId: Record<string, Subject>;
  onClose: () => void;
  onChange: (next: Subject) => void;
}

export function SubjectPanel({ subject, faltan, byId, onClose, onChange }: Props) {
  const [local, setLocal] = useState<Subject>(subject);
  // ¿La electiva con opciones está en modo "Otra" (nombre libre)?
  const [otra, setOtra] = useState(false);
  useEffect(() => {
    setLocal(subject);
    const ops = subject.opciones || [];
    setOtra(!!subject.nombre && ops.length > 0 && !ops.includes(subject.nombre));
  }, [subject]);

  const { plan, areaById } = usePlan();
  const area = areaById(local.area);
  const meta = ESTADO_META[local.estado];
  const isAprobada = local.estado === 'aprobada';
  const aprueba = local.nota != null && local.nota >= plan.notaAprobacion;

  function patch(p: Partial<Subject>) {
    const next = { ...local, ...p };
    setLocal(next);
    onChange(next);
  }

  function setEstado(e: Estado) {
    const p: Partial<Subject> = { estado: e };
    if (e !== 'aprobada') p.nota = null;
    else if (local.nota == null) p.nota = 7;
    patch(p);
  }

  function setNota(v: string) {
    if (v === '') return patch({ nota: null });
    const n = Math.max(1, Math.min(10, Number(v)));
    patch({ nota: n });
  }

  return (
    <>
      <div className="scrim" onClick={onClose} />
      <aside className="panel" role="dialog" aria-label={`Materia ${local.nombre}`}>
        <header className="panel-head">
          <span
            className="panel-area-tag"
            style={{ background: area.tint, color: area.color }}
          >
            <span className="legend-dot" style={{ background: area.color }} />
            {area.label}
          </span>
          <button className="panel-close" onClick={onClose} aria-label="Cerrar">
            {Icons.x}
          </button>
          <h2 className="panel-title">{local.nombre || 'Electiva sin nombre'}</h2>
          <div className="panel-sub">
            {local.codigo && <span className="card-code">Cód. {local.codigo}</span>}
            {local.codigo && (
              <span
                className="dot"
                style={{
                  width: 3,
                  height: 3,
                  borderRadius: '50%',
                  background: 'currentColor',
                  opacity: 0.5,
                }}
              />
            )}
            <span>
              {meta.label}
              {isAprobada && aprueba ? ` · ${local.nota}` : ''}
            </span>
          </div>
        </header>

        <div className="panel-body">
          {faltan && faltan.length > 0 && (
            <div className="panel-conflict-banner">
              {Icons.warn}
              <div>
                Esta materia está ubicada antes de aprobar{' '}
                {faltan.length === 1 ? 'su correlativa' : 'sus correlativas'}:{' '}
                <b>{faltan.map((f) => f.nombre).join(', ')}</b>. Movela a un cuatrimestre posterior
                para resolver la alerta.
              </div>
            </div>
          )}

          {local.esElectiva && (
            <div>
              <div className="field-label">
                {Icons.pencil} {local.opciones ? 'Materia electiva' : 'Nombre de la electiva'}
              </div>
              {local.opciones ? (
                <>
                  <select
                    className="text-input"
                    value={otra ? '__otra__' : local.opciones.includes(local.nombre) ? local.nombre : ''}
                    onChange={(e) => {
                      const v = e.target.value;
                      if (v === '__otra__') {
                        setOtra(true);
                        if (local.opciones!.includes(local.nombre)) patch({ nombre: '' });
                      } else {
                        setOtra(false);
                        patch({ nombre: v });
                      }
                    }}
                  >
                    <option value="">Elegí una opción…</option>
                    {local.opciones.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                    <option value="__otra__">Otra…</option>
                  </select>
                  {otra && (
                    <input
                      className="text-input"
                      style={{ marginTop: 8 }}
                      value={local.nombre}
                      placeholder="Escribí el nombre de la materia"
                      onChange={(e) => patch({ nombre: e.target.value })}
                    />
                  )}
                </>
              ) : (
                <input
                  className="text-input"
                  value={local.nombre}
                  placeholder="Ej. Programación I"
                  onChange={(e) => patch({ nombre: e.target.value })}
                />
              )}
            </div>
          )}

          <div>
            <div className="field-label">{Icons.spark} Estado de cursada</div>
            <div className="seg">
              {ESTADOS_ORDEN.map((e) => (
                <button
                  key={e}
                  className={`${e} ${local.estado === e ? 'on ' + e : ''}`}
                  onClick={() => setEstado(e)}
                >
                  <span className="seg-dot" style={{ background: ESTADO_META[e].color }} />
                  {ESTADO_META[e].label}
                </button>
              ))}
            </div>
          </div>

          {isAprobada && (
            <div>
              <div className="field-label">{Icons.check} Nota final</div>
              <div className="nota-row">
                <input
                  className="nota-input"
                  type="number"
                  min="1"
                  max="10"
                  value={local.nota ?? ''}
                  onChange={(e) => setNota(e.target.value)}
                />
                <div className={`nota-hint ${aprueba ? '' : 'fail'}`}>
                  {aprueba ? (
                    <>
                      Materia <b>aprobada</b> (≥ {plan.notaAprobacion}).
                      <br />
                      Entra al promedio.
                    </>
                  ) : (
                    <>
                      Con nota &lt; {plan.notaAprobacion} <b>no aprueba</b>.
                      <br />
                      No suma al promedio.
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {!local.esElectiva && (
            <div
              className="toggle-row"
              onClick={() => patch({ anual: !local.anual })}
              style={{ cursor: 'pointer' }}
            >
              <div className="tr-text">
                <b>Materia anual</b>
                <small>Abarca los dos semestres del año</small>
              </div>
              <div className={`switch ${local.anual ? 'on' : ''}`} />
            </div>
          )}

          <div>
            <div className="field-label">{Icons.link} Correlativas requeridas</div>
            {!local.corr || local.corr.length === 0 ? (
              <div className="corr-empty">
                Sin correlativas — se puede cursar en cualquier momento.
              </div>
            ) : (
              <div className="corr-list">
                {local.corr.map((cid) => {
                  const c = byId[cid];
                  if (!c) return null;
                  const incumplida = faltan && faltan.some((f) => f.id === cid);
                  return (
                    <div key={cid} className={`corr-item ${incumplida ? 'bad' : 'ok'}`}>
                      <span className="ci-ico">{incumplida ? Icons.warn : Icons.check}</span>
                      <span className="ci-name">{c.nombre}</span>
                      <span className="ci-state">{ESTADO_META[c.estado].label}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
