import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import type { Issue, Subject } from '../types'
import { AREAS } from '../lib/areas'
import { startIndex, completionIndex } from '../lib/validation'
import SubjectCard from './SubjectCard'

interface Props {
  subjects: Subject[]
  issuesById: Record<string, Issue[]>
  onOpen: (s: Subject) => void
}

interface Edge {
  d: string
  color: string
  bad: boolean
}

const COLS = [1, 2, 3, 4, 5, 6, 7, 8]

function colMeta(idx: number) {
  const year = Math.ceil(idx / 2)
  const sem = idx % 2 === 1 ? 1 : 2
  return { year, sem }
}

function edgesEqual(a: Edge[], b: Edge[]): boolean {
  if (a.length !== b.length) return false
  for (let i = 0; i < a.length; i++) {
    if (a[i].d !== b[i].d || a[i].color !== b[i].color || a[i].bad !== b[i].bad) return false
  }
  return true
}

export default function TimelineView({ subjects, issuesById, onOpen }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<Map<string, HTMLElement>>(new Map())
  const [edges, setEdges] = useState<Edge[]>([])
  const [size, setSize] = useState({ w: 0, h: 0 })

  const setCardRef = useCallback((id: string, el: HTMLElement | null) => {
    if (el) cardRefs.current.set(id, el)
    else cardRefs.current.delete(id)
  }, [])

  const recompute = useCallback(() => {
    const container = containerRef.current
    if (!container) return
    const cRect = container.getBoundingClientRect()
    const sl = container.scrollLeft
    const st = container.scrollTop
    const next: Edge[] = []

    for (const s of subjects) {
      if (startIndex(s) == null) continue
      const toEl = cardRefs.current.get(s.id)
      if (!toEl) continue
      const tr = toEl.getBoundingClientRect()
      const start = startIndex(s) as number
      for (const pid of s.prereqs) {
        const fromEl = cardRefs.current.get(pid)
        if (!fromEl) continue
        const p = subjects.find((x) => x.id === pid)
        if (!p) continue
        const fr = fromEl.getBoundingClientRect()

        const x1 = fr.right - cRect.left + sl
        const y1 = fr.top + fr.height / 2 - cRect.top + st
        const x2 = tr.left - cRect.left + sl
        const y2 = tr.top + tr.height / 2 - cRect.top + st
        const dx = Math.max(30, Math.min(140, Math.abs(x2 - x1) / 2))

        const pc = completionIndex(p)
        const bad = s.status !== 'approved' && p.status !== 'approved' && (pc == null || pc >= start)
        next.push({
          d: `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`,
          color: bad ? '#dc2626' : AREAS[p.area].color,
          bad,
        })
      }
    }
    // Solo actualizamos el estado si cambió de verdad: así evitamos el bucle
    // ResizeObserver -> setState -> re-layout -> ResizeObserver que congela la pestaña.
    setEdges((prev) => (edgesEqual(prev, next) ? prev : next))
    const w = container.scrollWidth
    const h = container.scrollHeight
    setSize((prev) => (Math.abs(prev.w - w) < 1 && Math.abs(prev.h - h) < 1 ? prev : { w, h }))
  }, [subjects])

  useLayoutEffect(() => {
    let raf = 0
    const schedule = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(recompute)
    }
    schedule()
    const container = containerRef.current
    const ro = new ResizeObserver(schedule)
    if (container) ro.observe(container)
    window.addEventListener('resize', schedule)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      window.removeEventListener('resize', schedule)
    }
  }, [recompute])

  const extra = subjects.filter((s) => s.year == null || s.sem == null)

  return (
    <div className="timeline-scroll" ref={containerRef}>
      <div className="timeline-inner">
        <svg className="timeline-svg" width={size.w} height={size.h}>
          <defs>
            <marker id="arrow" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto">
              <path d="M0,0 L9,4.5 L0,9 z" fill="context-stroke" />
            </marker>
            <marker id="arrow-red" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto">
              <path d="M0,0 L9,4.5 L0,9 z" fill="#dc2626" />
            </marker>
          </defs>
          {edges.map((e, i) => (
            <path
              key={i}
              d={e.d}
              fill="none"
              stroke={e.color}
              strokeWidth={e.bad ? 2.5 : 1.8}
              strokeDasharray={e.bad ? '6 4' : undefined}
              markerEnd={`url(#${e.bad ? 'arrow-red' : 'arrow'})`}
              opacity={0.85}
            />
          ))}
        </svg>

        <div className="timeline-cols">
          {COLS.map((idx) => {
            const { year, sem } = colMeta(idx)
            const items = subjects.filter((s) => startIndex(s) === idx)
            return (
              <div key={idx} className="tl-col">
                <div className="tl-col-head">
                  <strong>{year}° Año</strong>
                  <span>{sem}° Cuat.</span>
                </div>
                <div className="tl-col-body">
                  {items.length === 0 && <div className="tl-empty">—</div>}
                  {items.map((s) => (
                    <div key={s.id} ref={(el) => setCardRef(s.id, el)}>
                      <SubjectCard
                        subject={s}
                        issues={issuesById[s.id] ?? []}
                        onClick={() => onOpen(s)}
                        compact
                      />
                    </div>
                  ))}
                </div>
              </div>
            )
          })}

          {extra.length > 0 && (
            <div className="tl-col tl-col-extra">
              <div className="tl-col-head">
                <strong>EXTRA</strong>
                <span>Sin asignar</span>
              </div>
              <div className="tl-col-body">
                {extra.map((s) => (
                  <div key={s.id} ref={(el) => setCardRef(s.id, el)}>
                    <SubjectCard
                      subject={s}
                      issues={issuesById[s.id] ?? []}
                      onClick={() => onOpen(s)}
                      compact
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
