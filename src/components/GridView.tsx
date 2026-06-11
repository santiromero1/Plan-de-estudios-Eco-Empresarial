/* GridView — Vista de Grilla (Kanban por año/semestre) con drag & drop real.
   - Reordenar materias DENTRO de un semestre (sortable).
   - Mover materias entre cuatrimestres (incl. EXTRA).
   - Materias anuales: ancladas en ambos semestres del año, vinculadas. */
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useState } from 'react';
import type { Subject } from '../types';
import { SubjectCard } from './SubjectCard';
import { SortableCard } from './SortableCard';
import { realId } from '../lib/board';
import { Icons } from './icons';

const YEARS = [
  { anio: 1, label: '1.er Año', terms: ['1-1', '1-2'] as const },
  { anio: 2, label: '2.º Año', terms: ['2-1', '2-2'] as const },
  { anio: 3, label: '3.er Año', terms: ['3-1', '3-2'] as const },
  { anio: 4, label: '4.º Año', terms: ['4-1', '4-2'] as const },
];
const EXTRA = { label: 'Extra', terms: ['extra-1', 'extra-2'] as const };

interface CommonProps {
  conflicts: Set<string>;
  faltanMap: Record<string, Subject[]>;
  onCard: (s: Subject) => void;
}

function yearKeyOf(termId: string): string {
  const p = termId.split('-');
  return p.slice(0, -1).join('-');
}
function semOf(termId: string): string {
  const p = termId.split('-');
  return p[p.length - 1];
}

/** Materia anual anclada en un semestre (no entra al sortable; mueve el año). */
function AnualCard({
  subject,
  segment,
  caption,
  conflict,
  faltan,
  onCard,
}: {
  subject: Subject;
  segment: 'start' | 'end';
  caption: string;
  conflict: boolean;
  faltan: Subject[];
  onCard: (s: Subject) => void;
}) {
  const dndId = segment === 'start' ? subject.id : `${subject.id}:end`;
  const { setNodeRef, attributes, listeners, isDragging } = useDraggable({ id: dndId });
  return (
    <SubjectCard
      subject={subject}
      conflict={conflict}
      faltan={faltan}
      onClick={() => onCard(subject)}
      anualSegment={segment}
      anualCaption={caption}
      drag={{ setNodeRef, attributes, listeners, isDragging }}
    />
  );
}

function Column({
  termId,
  label,
  isExtra,
  subjects,
  conflicts,
  faltanMap,
  onCard,
}: CommonProps & {
  termId: string;
  label: string;
  isExtra?: boolean;
  subjects: Subject[];
}) {
  const { setNodeRef, isOver } = useDroppable({ id: termId });
  const anuales = subjects.filter((s) => s.anual && yearKeyOf(s.term) === yearKeyOf(termId));
  const cards = subjects.filter((s) => s.term === termId && !s.anual);
  const segment: 'start' | 'end' = semOf(termId) === '1' ? 'start' : 'end';
  const caption =
    segment === 'start'
      ? isExtra
        ? 'Anual · sigue en cuatrim. 2 ▸'
        : 'Anual · sigue en Semestre 2 ▸'
      : isExtra
        ? '◂ Anual · viene de cuatrim. 1'
        : '◂ Anual · viene de Semestre 1';
  const total = anuales.length + cards.length;

  return (
    <div ref={setNodeRef} className={`column ${isOver ? 'dropzone-over' : ''}`}>
      <div className="col-head">
        <span className="ch-label">{label}</span>
        <span className="ch-count">{total}</span>
      </div>
      <div className="col-cards">
        {anuales.map((s) => (
          <AnualCard
            key={`${s.id}-${segment}`}
            subject={s}
            segment={segment}
            caption={caption}
            conflict={conflicts.has(s.id)}
            faltan={faltanMap[s.id] || []}
            onCard={onCard}
          />
        ))}
        <SortableContext items={cards.map((c) => c.id)} strategy={verticalListSortingStrategy}>
          {cards.map((s) => (
            <SortableCard
              key={s.id}
              subject={s}
              conflict={conflicts.has(s.id)}
              faltan={faltanMap[s.id] || []}
              onCard={onCard}
            />
          ))}
        </SortableContext>
        {total === 0 && <div className="col-empty">{Icons.inbox} Soltá materias acá</div>}
      </div>
    </div>
  );
}

function YearBlock({
  year,
  isExtra,
  subjects,
  conflicts,
  faltanMap,
  onCard,
}: CommonProps & {
  year: { label: string; terms: readonly string[] };
  isExtra?: boolean;
  subjects: Subject[];
}) {
  const [t1, t2] = year.terms;
  return (
    <div className="year-block">
      <div className={`year-pill ${isExtra ? 'extra' : ''}`}>
        {year.label}
        {isExtra && <span className="yp-meta">materias corridas / recursadas</span>}
      </div>
      <div className="cols">
        <Column
          termId={t1}
          label={isExtra ? 'Cuatrim. corrido 1' : 'Semestre 1'}
          isExtra={isExtra}
          subjects={subjects}
          conflicts={conflicts}
          faltanMap={faltanMap}
          onCard={onCard}
        />
        <Column
          termId={t2}
          label={isExtra ? 'Cuatrim. corrido 2' : 'Semestre 2'}
          isExtra={isExtra}
          subjects={subjects}
          conflicts={conflicts}
          faltanMap={faltanMap}
          onCard={onCard}
        />
      </div>
    </div>
  );
}

interface GridProps extends CommonProps {
  subjects: Subject[];
  onReorder: (activeId: string, overId: string) => void;
}

export function GridView({ subjects, conflicts, faltanMap, onCard, onReorder }: GridProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const active = activeId ? subjects.find((s) => s.id === realId(activeId)) : null;

  function onDragStart(e: DragStartEvent) {
    setActiveId(String(e.active.id));
  }
  function onDragEnd(e: DragEndEvent) {
    setActiveId(null);
    const { active: a, over } = e;
    if (!over) return;
    onReorder(String(a.id), String(over.id));
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragCancel={() => setActiveId(null)}
    >
      <div>
        {YEARS.map((y) => (
          <YearBlock
            key={y.anio}
            year={y}
            subjects={subjects}
            conflicts={conflicts}
            faltanMap={faltanMap}
            onCard={onCard}
          />
        ))}
        <YearBlock
          year={EXTRA}
          isExtra
          subjects={subjects}
          conflicts={conflicts}
          faltanMap={faltanMap}
          onCard={onCard}
        />
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
  );
}
