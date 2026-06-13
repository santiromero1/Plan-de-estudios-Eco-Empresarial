/* TimelineView — Flujo horizontal de correlativas con flechas SVG.
   Permite arrastrar y reordenar materias entre cuatrimestres (y dentro). */
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useDroppable,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { Subject } from '../types';
import { SubjectCard } from './SubjectCard';
import { SortableCard } from './SortableCard';
import { realId } from '../lib/board';
import { usePlan } from '../context/PlanContext';
import { timelineColsOf, type TLCol } from '../data/plan';

interface Edge {
  from: string;
  to: string;
  path: string;
  conflict: boolean;
}

interface Props {
  subjects: Subject[];
  conflicts: Set<string>;
  faltanMap: Record<string, Subject[]>;
  onCard: (s: Subject) => void;
  onReorder: (activeId: string, overId: string) => void;
}

function TLColumn({
  col,
  subjects,
  conflicts,
  faltanMap,
  onCard,
  hovered,
  setHovered,
  relatedIds,
}: {
  col: TLCol;
  subjects: Subject[];
  conflicts: Set<string>;
  faltanMap: Record<string, Subject[]>;
  onCard: (s: Subject) => void;
  hovered: string | null;
  setHovered: (id: string | null) => void;
  relatedIds: Set<string>;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: col.dropId });
  const cards = subjects.filter((s) =>
    col.extra ? (s.term || '').startsWith('extra') : s.term === col.id,
  );

  return (
    <div className="tl-col">
      <div className={`tl-col-head ${col.extra ? 'extra' : ''}`}>
        <div className="tl-year">{col.year}</div>
        <div className="tl-sem">{col.sem}</div>
      </div>
      <div ref={setNodeRef} className={`tl-cards ${isOver ? 'tl-cards-over' : ''}`}>
        <SortableContext items={cards.map((c) => c.id)} strategy={verticalListSortingStrategy}>
          {cards.map((s) => {
            const isDim = hovered && !relatedIds.has(s.id);
            return (
              <div
                className="tl-card"
                key={s.id}
                data-tlid={s.id}
                onMouseEnter={() => setHovered(s.id)}
                onMouseLeave={() => setHovered(null)}
              >
                <div style={{ opacity: isDim ? 0.38 : 1, transition: '.15s' }}>
                  <SortableCard
                    subject={s}
                    conflict={conflicts.has(s.id)}
                    faltan={faltanMap[s.id] || []}
                    onCard={onCard}
                  />
                </div>
              </div>
            );
          })}
        </SortableContext>
        {cards.length === 0 && (
          <div className="col-empty" style={{ padding: '14px 8px', fontSize: 11 }}>
            —
          </div>
        )}
      </div>
    </div>
  );
}

export function TimelineView({ subjects, conflicts, faltanMap, onCard, onReorder }: Props) {
  const { plan } = usePlan();
  const cols = timelineColsOf(plan.terms);
  /** orden lineal de un cuatrimestre (para la dirección de las flechas). */
  const ordenOf = (termId: string): number =>
    plan.terms.find((t) => t.id === termId)?.orden ?? -1;
  const innerRef = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [dims, setDims] = useState({ w: 0, h: 0 });
  const [hovered, setHovered] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));
  const active = activeId ? subjects.find((s) => s.id === realId(activeId)) : null;

  const byId: Record<string, Subject> = {};
  subjects.forEach((s) => (byId[s.id] = s));

  const measure = useCallback(() => {
    const inner = innerRef.current;
    if (!inner) return;
    const ir = inner.getBoundingClientRect();
    const pos: Record<string, { left: number; right: number; midY: number }> = {};
    inner.querySelectorAll<HTMLElement>('[data-tlid]').forEach((el) => {
      const r = el.getBoundingClientRect();
      const id = el.getAttribute('data-tlid');
      if (id) {
        pos[id] = {
          left: r.left - ir.left,
          right: r.right - ir.left,
          midY: r.top - ir.top + r.height / 2,
        };
      }
    });

    const list: Edge[] = [];
    subjects.forEach((t) => {
      (t.corr || []).forEach((cid) => {
        const c = byId[cid];
        if (!c || !pos[cid] || !pos[t.id]) return;
        const isConflict = (faltanMap[t.id] || []).some((f) => f.id === cid);
        const forward = ordenOf(t.term) > ordenOf(c.term);
        const s = pos[cid];
        const d = pos[t.id];
        let path: string;
        if (forward) {
          const sx = s.right,
            sy = s.midY,
            tx = d.left,
            ty = d.midY;
          const dx = Math.max(34, (tx - sx) * 0.45);
          path = `M ${sx} ${sy} C ${sx + dx} ${sy}, ${tx - dx} ${ty}, ${tx} ${ty}`;
        } else {
          const sx = s.left,
            sy = s.midY,
            tx = d.left,
            ty = d.midY;
          const dx = 30 + Math.abs(ty - sy) * 0.12;
          path = `M ${sx} ${sy} C ${sx - dx} ${sy}, ${tx - dx} ${ty}, ${tx} ${ty}`;
        }
        list.push({ from: cid, to: t.id, path, conflict: isConflict });
      });
    });
    setEdges(list);
    setDims({ w: inner.scrollWidth, h: inner.scrollHeight });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subjects, faltanMap]);

  useLayoutEffect(() => {
    measure();
  }, [measure]);

  useEffect(() => {
    const r = () => measure();
    window.addEventListener('resize', r);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => measure());
    const id = window.setTimeout(measure, 120);
    return () => {
      window.removeEventListener('resize', r);
      window.clearTimeout(id);
    };
  }, [measure]);

  const relatedIds = new Set<string>();
  if (hovered) {
    relatedIds.add(hovered);
    edges.forEach((e) => {
      if (e.from === hovered || e.to === hovered) {
        relatedIds.add(e.from);
        relatedIds.add(e.to);
      }
    });
  }

  function onDragStart(e: DragStartEvent) {
    setActiveId(String(e.active.id));
    setHovered(null);
  }
  function onDragEnd(e: DragEndEvent) {
    setActiveId(null);
    const { active: a, over } = e;
    if (!over) return;
    onReorder(String(a.id), String(over.id));
  }

  return (
    <div className="timeline-wrap">
      <div className="view-head" style={{ marginBottom: 14 }}>
        <div>
          <h1>Timeline de correlativas</h1>
          <p>
            Arrastrá las materias para reordenarlas o moverlas de cuatrimestre. Cada flecha va de una
            materia a la que habilita; si una queda ubicada antes de aprobar su correlativa, la flecha
            se marca en rojo.
          </p>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragCancel={() => setActiveId(null)}
      >
        <div className="timeline-scroll scroll-x">
          <div className="timeline-inner" ref={innerRef}>
            <svg
              className="tl-svg"
              width={dims.w}
              height={dims.h}
              viewBox={`0 0 ${dims.w} ${dims.h}`}
            >
              <defs>
                <marker
                  id="ah"
                  markerWidth="9"
                  markerHeight="9"
                  refX="6.5"
                  refY="4"
                  orient="auto"
                  markerUnits="userSpaceOnUse"
                >
                  <path
                    d="M1 1 L7 4 L1 7"
                    fill="none"
                    stroke="var(--border-2)"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </marker>
                <marker
                  id="ah-c"
                  markerWidth="9"
                  markerHeight="9"
                  refX="6.5"
                  refY="4"
                  orient="auto"
                  markerUnits="userSpaceOnUse"
                >
                  <path
                    d="M1 1 L7 4 L1 7"
                    fill="none"
                    stroke="var(--danger)"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </marker>
                <marker
                  id="ah-a"
                  markerWidth="9"
                  markerHeight="9"
                  refX="6.5"
                  refY="4"
                  orient="auto"
                  markerUnits="userSpaceOnUse"
                >
                  <path
                    d="M1 1 L7 4 L1 7"
                    fill="none"
                    stroke="var(--info)"
                    strokeWidth="1.9"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </marker>
              </defs>
              {edges.map((e, i) => {
                const activeEdge = hovered && (e.from === hovered || e.to === hovered);
                const dim = hovered && !activeEdge;
                const cls = [
                  'tl-path',
                  e.conflict ? 'conflict' : '',
                  activeEdge ? 'active' : '',
                  dim ? 'dim' : '',
                ]
                  .filter(Boolean)
                  .join(' ');
                const marker = e.conflict ? 'url(#ah-c)' : activeEdge ? 'url(#ah-a)' : 'url(#ah)';
                return <path key={i} className={cls} d={e.path} markerEnd={marker} />;
              })}
            </svg>

            {cols.map((col) => (
              <TLColumn
                key={col.id}
                col={col}
                subjects={subjects}
                conflicts={conflicts}
                faltanMap={faltanMap}
                onCard={onCard}
                hovered={hovered}
                setHovered={setHovered}
                relatedIds={relatedIds}
              />
            ))}
          </div>
        </div>

        <DragOverlay dropAnimation={null}>
          {active ? (
            <SubjectCard
              subject={active}
              conflict={conflicts.has(active.id)}
              faltan={faltanMap[active.id] || []}
              lifted
            />
          ) : null}
        </DragOverlay>
      </DndContext>

      <div className="tl-legend-row">
        <span className="legend-title">Flechas</span>
        <span className="lr-item">
          <span className="lr-line" /> correlativa cumplida
        </span>
        <span className="lr-item">
          <span className="lr-line conflict" /> conflicto temporal (revisar orden)
        </span>
        <span className="lr-item" style={{ color: 'var(--ink-muted)' }}>
          Pasá el mouse por una materia para resaltar sus vínculos
        </span>
      </div>
    </div>
  );
}
