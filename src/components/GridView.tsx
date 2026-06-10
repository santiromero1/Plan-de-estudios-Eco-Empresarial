import { useState } from 'react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  useDraggable,
  useDroppable,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import type { Issue, Subject } from '../types'
import SubjectCard from './SubjectCard'

interface Props {
  subjects: Subject[]
  issuesById: Record<string, Issue[]>
  onOpen: (s: Subject) => void
  onMove: (id: string, year: number | null, sem: 1 | 2 | null) => void
}

const YEARS = [1, 2, 3, 4]

function slotId(year: number, sem: 1 | 2) {
  return `y${year}s${sem}`
}

function DraggableCard({
  subject,
  issues,
  onOpen,
}: {
  subject: Subject
  issues: Issue[]
  onOpen: () => void
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: subject.id })
  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="drag-wrap"
      style={{ opacity: isDragging ? 0.35 : 1 }}
    >
      <SubjectCard subject={subject} issues={issues} onClick={onOpen} />
    </div>
  )
}

function Slot({
  id,
  subjects,
  issuesById,
  onOpen,
}: {
  id: string
  subjects: Subject[]
  issuesById: Record<string, Issue[]>
  onOpen: (s: Subject) => void
}) {
  const { setNodeRef, isOver } = useDroppable({ id })
  return (
    <div ref={setNodeRef} className={`slot ${isOver ? 'slot-over' : ''}`}>
      {subjects.length === 0 && <div className="slot-empty">Soltá materias acá</div>}
      {subjects.map((s) => (
        <DraggableCard key={s.id} subject={s} issues={issuesById[s.id] ?? []} onOpen={() => onOpen(s)} />
      ))}
    </div>
  )
}

export default function GridView({ subjects, issuesById, onOpen, onMove }: Props) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  const inSlot = (year: number, sem: 1 | 2) =>
    subjects.filter((s) => s.year === year && s.sem === sem)
  const extra = subjects.filter((s) => s.year == null || s.sem == null)

  function onDragStart(e: DragStartEvent) {
    setActiveId(String(e.active.id))
  }

  function onDragEnd(e: DragEndEvent) {
    setActiveId(null)
    const over = e.over?.id ? String(e.over.id) : null
    if (!over) return
    const id = String(e.active.id)
    if (over === 'extra') {
      onMove(id, null, null)
      return
    }
    const m = over.match(/^y(\d)s(\d)$/)
    if (m) onMove(id, Number(m[1]), Number(m[2]) as 1 | 2)
  }

  const active = activeId ? subjects.find((s) => s.id === activeId) ?? null : null

  return (
    <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd}>
      <div className="grid-view">
        {YEARS.map((year) => (
          <section key={year} className="year-block">
            <header className="year-head">{year}° Año</header>
            <div className="sem-cols">
              {([1, 2] as const).map((sem) => (
                <div key={sem} className="sem-col">
                  <div className="sem-label">{sem}° Cuatrimestre</div>
                  <Slot
                    id={slotId(year, sem)}
                    subjects={inSlot(year, sem)}
                    issuesById={issuesById}
                    onOpen={onOpen}
                  />
                </div>
              ))}
            </div>
          </section>
        ))}

        <section className="year-block extra-block">
          <header className="year-head extra-head">EXTRA · Sin asignar / Recursando</header>
          <Slot id="extra" subjects={extra} issuesById={issuesById} onOpen={onOpen} />
        </section>
      </div>

      <DragOverlay dropAnimation={null}>
        {active ? (
          <SubjectCard subject={active} issues={issuesById[active.id] ?? []} dragging />
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
