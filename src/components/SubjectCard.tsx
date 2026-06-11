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
import { Icons, AREA_LABEL } from './icons';

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
  const isElectivaEmpty = subject.esElectiva && !subject.nombre;

  const dragProps = drag
    ? { ref: drag.setNodeRef, style: drag.style, ...drag.attributes, ...drag.listeners }
    : {};

  if (isElectivaEmpty) {
    return (
      <div
        className="card area-electivas is-electiva-empty"
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
    `area-${subject.area}`,
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
      <div className={cls} onClick={onClick} {...dragProps}>
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
          <span>{AREA_LABEL[subject.area]}</span>
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
