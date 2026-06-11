/* SortableCard — card de materia arrastrable y reordenable (@dnd-kit/sortable).
   Usada por la Grilla y el Timeline. */
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Subject } from '../types';
import { SubjectCard } from './SubjectCard';

interface Props {
  subject: Subject;
  conflict: boolean;
  faltan: Subject[];
  onCard: (s: Subject) => void;
  anualSegment?: 'start' | 'end';
  anualCaption?: string;
}

export function SortableCard({
  subject,
  conflict,
  faltan,
  onCard,
  anualSegment,
  anualCaption,
}: Props) {
  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id: subject.id,
  });

  return (
    <SubjectCard
      subject={subject}
      conflict={conflict}
      faltan={faltan}
      onClick={() => onCard(subject)}
      anualSegment={anualSegment}
      anualCaption={anualCaption}
      drag={{
        setNodeRef,
        attributes,
        listeners,
        isDragging,
        style: {
          transform: CSS.Translate.toString(transform),
          transition,
        },
      }}
    />
  );
}
