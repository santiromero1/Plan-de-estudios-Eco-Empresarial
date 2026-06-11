/* timeline.jsx — Vista de Timeline de correlativas (flujo horizontal + flechas SVG) */
const { useState: useStateT, useRef: useRefT, useLayoutEffect, useEffect: useEffectT, useCallback } = React;

const TL_COLS = [
  { id: '1-1', year: '1.er Año', sem: 'Semestre 1' },
  { id: '1-2', year: '1.er Año', sem: 'Semestre 2' },
  { id: '2-1', year: '2.º Año',  sem: 'Semestre 1' },
  { id: '2-2', year: '2.º Año',  sem: 'Semestre 2' },
  { id: '3-1', year: '3.er Año', sem: 'Semestre 1' },
  { id: '3-2', year: '3.er Año', sem: 'Semestre 2' },
  { id: '4-1', year: '4.º Año',  sem: 'Semestre 1' },
  { id: '4-2', year: '4.º Año',  sem: 'Semestre 2' },
  { id: 'extra', year: 'Extra', sem: 'Recursadas', extra: true },
];

function colIndexOf(termId) {
  if (termId && termId.startsWith('extra')) return 8;
  return TL_COLS.findIndex(c => c.id === termId);
}

function TimelineView({ subjects, conflicts, faltanMap, onCard }) {
  const innerRef = useRefT(null);
  const [edges, setEdges] = useStateT([]);
  const [dims, setDims] = useStateT({ w: 0, h: 0 });
  const [hovered, setHovered] = useStateT(null);

  const byId = {};
  subjects.forEach(s => { byId[s.id] = s; });

  // Cards visibles por columna (electivas vacías incluidas como slots)
  const colSubjects = id =>
    subjects.filter(s => (id === 'extra' ? (s.term || '').startsWith('extra') : s.term === id));

  const measure = useCallback(() => {
    const inner = innerRef.current;
    if (!inner) return;
    const ir = inner.getBoundingClientRect();
    const pos = {};
    inner.querySelectorAll('[data-tlid]').forEach(el => {
      const r = el.getBoundingClientRect();
      pos[el.getAttribute('data-tlid')] = {
        left: r.left - ir.left, right: r.right - ir.left,
        top: r.top - ir.top, midY: r.top - ir.top + r.height / 2,
      };
    });

    const list = [];
    subjects.forEach(t => {
      (t.corr || []).forEach(cid => {
        const c = byId[cid];
        if (!c || !pos[cid] || !pos[t.id]) return;
        const isConflict = (faltanMap[t.id] || []).some(f => f.id === cid);
        const ci = colIndexOf(c.term), ti = colIndexOf(t.term);
        const forward = ti > ci;
        const s = pos[cid], d = pos[t.id];
        let path, mx;
        if (forward) {
          const sx = s.right, sy = s.midY, tx = d.left, ty = d.midY;
          const dx = Math.max(34, (tx - sx) * 0.45);
          path = `M ${sx} ${sy} C ${sx + dx} ${sy}, ${tx - dx} ${ty}, ${tx} ${ty}`;
          mx = (sx + tx) / 2;
        } else {
          // misma columna o hacia atrás → lazo por la izquierda (suele ser conflicto)
          const sx = s.left, sy = s.midY, tx = d.left, ty = d.midY;
          const dx = 30 + Math.abs(ty - sy) * 0.12;
          path = `M ${sx} ${sy} C ${sx - dx} ${sy}, ${tx - dx} ${ty}, ${tx} ${ty}`;
          mx = sx - dx;
        }
        list.push({ from: cid, to: t.id, path, conflict: isConflict, forward });
      });
    });
    setEdges(list);
    setDims({ w: inner.scrollWidth, h: inner.scrollHeight });
  }, [subjects]);

  useLayoutEffect(() => { measure(); }, [measure]);
  useEffectT(() => {
    const r = () => measure();
    window.addEventListener('resize', r);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => measure());
    const id = setTimeout(measure, 120);
    return () => { window.removeEventListener('resize', r); clearTimeout(id); };
  }, [measure]);

  const relatedIds = new Set();
  if (hovered) {
    relatedIds.add(hovered);
    edges.forEach(e => { if (e.from === hovered || e.to === hovered) { relatedIds.add(e.from); relatedIds.add(e.to); } });
  }

  return (
    <div className="timeline-wrap">
      <div className="view-head" style={{ marginBottom: 14 }}>
        <div>
          <h1>Timeline de correlativas</h1>
          <p>Cada flecha va de una materia a la que habilita. Si una materia queda ubicada
             antes de aprobar su correlativa, la flecha se marca en rojo.</p>
        </div>
      </div>

      <div className="timeline-scroll scroll-x">
        <div className="timeline-inner" ref={innerRef}>
          <svg className="tl-svg" width={dims.w} height={dims.h} viewBox={`0 0 ${dims.w} ${dims.h}`}>
            <defs>
              <marker id="ah" markerWidth="9" markerHeight="9" refX="6.5" refY="4" orient="auto" markerUnits="userSpaceOnUse">
                <path d="M1 1 L7 4 L1 7" fill="none" stroke="var(--border-2)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </marker>
              <marker id="ah-c" markerWidth="9" markerHeight="9" refX="6.5" refY="4" orient="auto" markerUnits="userSpaceOnUse">
                <path d="M1 1 L7 4 L1 7" fill="none" stroke="var(--danger)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </marker>
              <marker id="ah-a" markerWidth="9" markerHeight="9" refX="6.5" refY="4" orient="auto" markerUnits="userSpaceOnUse">
                <path d="M1 1 L7 4 L1 7" fill="none" stroke="var(--info)" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"/>
              </marker>
            </defs>
            {edges.map((e, i) => {
              const active = hovered && (e.from === hovered || e.to === hovered);
              const dim = hovered && !active;
              const cls = ['tl-path', e.conflict ? 'conflict' : '', active ? 'active' : '', dim ? 'dim' : ''].join(' ');
              const marker = e.conflict ? 'url(#ah-c)' : active ? 'url(#ah-a)' : 'url(#ah)';
              return <path key={i} className={cls} d={e.path} markerEnd={marker} />;
            })}
          </svg>

          {TL_COLS.map(col => (
            <div className="tl-col" key={col.id}>
              <div className={`tl-col-head ${col.extra ? 'extra' : ''}`}>
                <div className="tl-year">{col.year}</div>
                <div className="tl-sem">{col.sem}</div>
              </div>
              <div className="tl-cards">
                {colSubjects(col.id).map(s => {
                  const isDim = hovered && !relatedIds.has(s.id);
                  return (
                    <div className="tl-card" key={s.id} data-tlid={s.id}
                         onMouseEnter={() => setHovered(s.id)} onMouseLeave={() => setHovered(null)}>
                      <div className={isDim ? 'dim-card-wrap' : ''} style={isDim ? { opacity: .38, transition: '.15s' } : { transition: '.15s' }}>
                        <SubjectCard subject={s} compact
                          conflict={conflicts.has(s.id)} faltan={faltanMap[s.id]}
                          onClick={() => onCard(s)} />
                      </div>
                    </div>
                  );
                })}
                {colSubjects(col.id).length === 0 && (
                  <div className="col-empty" style={{ padding: '14px 8px', fontSize: 11 }}>—</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="tl-legend-row">
        <span className="legend-title">Flechas</span>
        <span className="lr-item"><span className="lr-line" /> correlativa cumplida</span>
        <span className="lr-item"><span className="lr-line conflict" /> conflicto temporal (revisar orden)</span>
        <span className="lr-item" style={{ color: 'var(--ink-muted)' }}>Pasá el mouse por una materia para resaltar sus vínculos</span>
      </div>
    </div>
  );
}

window.TimelineView = TimelineView;
