/* components.jsx — Tarjeta de materia y subcomponentes */
const { useState } = React;

const ESTADO_META = {
  'pendiente':    { label: 'Pendiente',    icon: Icons.minus,  color: 'var(--ink-muted)' },
  'en-curso':     { label: 'En curso',     icon: Icons.clock,  color: 'var(--info)' },
  'aprobada':     { label: 'Aprobada',     icon: Icons.check,  color: 'var(--success)' },
  'desaprobada':  { label: 'Recursar',     icon: Icons.redo,   color: 'var(--danger)' },
  'desinscripta': { label: 'Desinscripta', icon: Icons.minus,  color: 'var(--ink-muted)' },
};

const AREA_LABEL = {
  negocios: 'Negocios', economia: 'Economía', datos: 'Datos', electivas: 'Electiva',
};

// Badge de estado (esquina de la card)
function StatusBadge({ estado, nota }) {
  const meta = ESTADO_META[estado];
  if (!meta) return null;
  if (estado === 'aprobada') {
    return <span className="badge aprobada">{Icons.check} {nota != null ? nota : '✓'}</span>;
  }
  if (estado === 'pendiente') return null;
  return <span className={`badge ${estado}`}>{meta.icon}{estado === 'en-curso' ? ' ·' : ''}</span>;
}

// Tooltip de conflicto
function ConflictTooltip({ faltan }) {
  return (
    <div className="tooltip">
      <div className="t-title">{Icons.warn} Falta aprobar:</div>
      {faltan.map(f => <div key={f.id}><b>{f.nombre}</b></div>)}
    </div>
  );
}

/* SubjectCard — soporta todos los estados */
function SubjectCard({ subject, conflict, faltan = [], onClick, lifted, compact }) {
  const [hover, setHover] = useState(false);
  const isElectivaEmpty = subject.esElectiva && !subject.nombre;

  // Electiva vacía (placeholder editable)
  if (isElectivaEmpty) {
    return (
      <div className="card area-electivas is-electiva-empty"
           onClick={onClick} title="Click para nombrar la electiva">
        <div className="electiva-slot-label">{subject.slotLabel || 'Electiva'}</div>
        <div className="electiva-empty">{Icons.pencil} Nombrar materia…</div>
      </div>
    );
  }

  const cls = [
    'card', `area-${subject.area}`,
    `is-${subject.estado}`,
    conflict ? 'has-conflict' : '',
    subject.anual ? 'is-anual' : '',
    lifted ? 'is-lifted' : '',
  ].join(' ');

  return (
    <div className="tip-wrap"
         onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <div className={cls} onClick={onClick}>
        <div className="card-top">
          <div style={{ flex: 1 }}>
            {subject.esElectiva && (
              <div className="electiva-slot-label">{subject.slotLabel}</div>
            )}
            <div className="card-name">{subject.nombre}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            {conflict && <span className="conflict-flag">{Icons.warn}</span>}
            <StatusBadge estado={subject.estado} nota={subject.nota} />
          </div>
        </div>

        <div className="card-meta">
          {subject.codigo && <span className="card-code">{subject.codigo}</span>}
          {subject.codigo && <span className="dot" />}
          <span>{AREA_LABEL[subject.area]}</span>
          {subject.anual && <>
            <span className="dot" />
            <span className="anual-tag">{Icons.calendar} Anual</span>
          </>}
        </div>

        {subject.anual && !compact && (
          <div className="anual-span" style={{ marginTop: 8 }}>
            <span className="anual-line" /> abarca S1 + S2 <span className="anual-line" />
          </div>
        )}
      </div>
      {hover && conflict && faltan.length > 0 && <ConflictTooltip faltan={faltan} />}
    </div>
  );
}

Object.assign(window, { SubjectCard, StatusBadge, ConflictTooltip, ESTADO_META, AREA_LABEL });
