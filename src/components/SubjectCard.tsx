/* SubjectCard — tarjeta de materia. Soporta todos los estados y,
   opcionalmente, bindings de drag de @dnd-kit. */
import { useState } from 'react';
import type {
  CSSProperties,
  DOMAttributes,
  HTMLAttributes,
  Ref,
} from 'react';
import type { Subject } from '../types';
import { Icons } from './icons';
import { usePlan } from '../context/PlanContext';

function StatusBadge({ estado, nota }: { estado: Subject['estado']; nota?: number | null }) {
  if (estado === 'aprobada') {
    return (
      <span className="badge aprobada">
        {Icons.check} {nota != null ? nota : '✓'}
      </span>
    );
  }
  if (estado === 'pendiente') return null;
  if (estado === 'en-curso') return <span className="badge en-curso">{Icons.clock}</span>;
  if (estado === 'desaprobada') return <span className="badge desaprobada">{Icons.redo}</span>;
  if (estado === 'desinscripta') return <span className="badge desinscripta">{Icons.minus}</span>;
  return null;
}

function ConflictTooltip({ faltan }: { faltan: Subject[] }) {
  return (
    <div className="tooltip">
      <div className="t-title">{Icons.warn} Falta aprobar:</div>
      {faltan.map((f) => (
        <div key={f.id}>
          <b>{f.nombre}</b>
        </div>
      ))}
    </div>
  );
}

export interface DragBindings {
  setNodeRef: Ref<HTMLDivElement>;
  attributes: HTMLAttributes<HTMLDivElement>;
  listeners?: DOMAttributes<HTMLDivElement>;
  isDragging?: boolean;
  style?: CSSProperties;
}

interface Props {
  subject: Subject;
  conflict?: boolean;
  faltan?: Subject[];
  onClick?: () => void;
  lifted?: boolean;
  drag?: DragBindings;
  /** Si la materia es anual y se renderiza en una columna: qué segmento es. */
  anualSegment?: 'start' | 'end';
  anualCaption?: string;
}

export function SubjectCard({
  subject,
  conflict = false,
  faltan = [],
  onClick,
  lifted,
  drag,
  anualSegment,
  anualCaption,
}: Props) {
  const [hover, setHover] = useState(false);
  const { areaById } = usePlan();
  const area = areaById(subject.area);
  const isElectivaEmpty = subject.esElectiva && !subject.nombre;

  // Colores del área inyectados como CSS custom properties (data-driven).
  const areaStyle = {
    '--accent': area.color,
    '--area-bg': area.tint,
  } as CSSProperties;

  const dragProps = drag
    ? { ref: drag.setNodeRef, ...drag.attributes, ...drag.listeners }
    : {};
  const mergedStyle: CSSProperties = { ...areaStyle, ...(drag?.style ?? {}) };

  if (isElectivaEmpty) {
    return (
      <div
        className="card is-electiva-empty"
        style={mergedStyle}
        onClick={onClick}
        title="Click para nombrar la electiva"
        {...dragProps}
      >
        <div className="electiva-slot-label">{subject.slotLabel || 'Electiva'}</div>
        <div className="electiva-empty">{Icons.pencil} Nombrar materia…</div>
      </div>
    );
  }

  const cls = [
    'card',
    `is-${subject.estado}`,
    conflict ? 'has-conflict' : '',
    subject.anual ? 'is-anual' : '',
    anualSegment ? `is-anual-${anualSegment}` : '',
    lifted ? 'is-lifted' : '',
    drag?.isDragging ? 'is-dragging' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className="tip-wrap"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className={cls} style={mergedStyle} onClick={onClick} {...dragProps}>
        <div className="card-top">
          <div style={{ flex: 1 }}>
            {subject.esElectiva && <div className="electiva-slot-label">{subject.slotLabel}</div>}
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
          <span>{area.label}</span>
          {subject.anual && (
            <>
              <span className="dot" />
              <span className="anual-tag">{Icons.calendar} Anual</span>
            </>
          )}
        </div>

        {subject.anual && anualSegment && (
          <div className={`anual-link ${anualSegment}`}>
            {Icons.link}
            <span>{anualCaption}</span>
          </div>
        )}
      </div>
      {hover && conflict && faltan.length > 0 && <ConflictTooltip faltan={faltan} />}
    </div>
  );
}
