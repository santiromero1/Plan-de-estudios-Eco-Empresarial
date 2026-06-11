/* grid.jsx — Vista de Grilla (Kanban por año/semestre) */

const YEARS = [
  { anio: 1, label: '1.er Año', terms: ['1-1', '1-2'] },
  { anio: 2, label: '2.º Año',  terms: ['2-1', '2-2'] },
  { anio: 3, label: '3.er Año', terms: ['3-1', '3-2'] },
  { anio: 4, label: '4.º Año',  terms: ['4-1', '4-2'] },
];
const EXTRA = { label: 'Extra', terms: ['extra-1', 'extra-2'] };

function Column({ termId, subjects, label, conflicts, faltanMap, onCard, demo }) {
  const cards = subjects.filter(s => s.term === termId && !s.anual);
  const cls = ['column'];
  if (demo && demo.invalid && demo.invalid.includes(termId)) cls.push('dropzone-invalid');
  if (demo && demo.target === termId) cls.push('dropzone-over');

  return (
    <div className={cls.join(' ')}>
      <div className="col-head">
        <span className="ch-label">{label}</span>
        <span className="ch-count">{cards.length}</span>
      </div>
      <div className="col-cards">
        {cards.map(s => (
          <SubjectCard key={s.id} subject={s} lifted={s.__lifted}
            conflict={conflicts.has(s.id)} faltan={faltanMap[s.id]}
            onClick={() => onCard(s)} />
        ))}
        {demo && demo.target === termId && <div className="drop-placeholder" />}
        {cards.length === 0 && !(demo && demo.target === termId) && (
          <div className="col-empty">{Icons.inbox} Soltá materias acá</div>
        )}
      </div>
    </div>
  );
}

function YearBlock({ year, subjects, conflicts, faltanMap, onCard, demo, isExtra }) {
  const [t1, t2] = year.terms;
  const anualCards = subjects.filter(s => s.anual && year.terms.includes(s.term));

  return (
    <div className="year-block">
      <div className={`year-pill ${isExtra ? 'extra' : ''}`}>
        {year.label}
        {isExtra && <span className="yp-meta">materias corridas / recursadas</span>}
      </div>

      {anualCards.length > 0 && (
        <div className="cols" style={{ marginBottom: 14 }}>
          {anualCards.map(s => (
            <SubjectCard key={s.id} subject={s} lifted={s.__lifted}
              conflict={conflicts.has(s.id)} faltan={faltanMap[s.id]}
              onClick={() => onCard(s)} />
          ))}
        </div>
      )}

      <div className="cols">
        <Column termId={t1} label={isExtra ? 'Cuatrim. corrido 1' : 'Semestre 1'}
          subjects={subjects} conflicts={conflicts} faltanMap={faltanMap} onCard={onCard} demo={demo} />
        <Column termId={t2} label={isExtra ? 'Cuatrim. corrido 2' : 'Semestre 2'}
          subjects={subjects} conflicts={conflicts} faltanMap={faltanMap} onCard={onCard} demo={demo} />
      </div>
    </div>
  );
}

function GridView({ subjects, conflicts, faltanMap, onCard, demo }) {
  return (
    <div>
      {YEARS.map(y => (
        <YearBlock key={y.anio} year={y} subjects={subjects}
          conflicts={conflicts} faltanMap={faltanMap} onCard={onCard} demo={demo} />
      ))}
      <YearBlock year={EXTRA} subjects={subjects} isExtra
        conflicts={conflicts} faltanMap={faltanMap} onCard={onCard} demo={demo} />
    </div>
  );
}

window.GridView = GridView;
