import { texts } from '../i18n.js'

export default function Panel({ focus, lang }) {
  const tr = texts[lang]
  if (focus === 'about') {
    return (
      <aside className="panel">
        <h2>{tr.about.title}</h2>
        <div className="about-head">
          <img className="avatar" src="/img/perfil.png" alt="Gabriela Campelo" />
          <div>
            <strong>Gabriela Campelo</strong>
            <p>{tr.role}</p>
          </div>
        </div>
        <p>{tr.about.body}</p>
        <h3>{tr.about.skills}</h3>
        <div className="tags">
          {['PHP','Python','Flask','Node.js','React','JavaScript','Flutter','Dart','MySQL','SQLite','Git','Scrum','APIs REST','scikit-learn'].map(s => (
            <em key={s}>{s}</em>
          ))}
        </div>
      </aside>
    )
  }
  if (focus === 'experience') {
    return (
      <aside className="panel">
        <h2>{tr.experience.title}</h2>
        {tr.experience.items.map((it, i) => (
          <div className="card" key={i}>
            <div className="card-top">
              <strong>{it.org}</strong>
              <span>{it.period}</span>
            </div>
            <div className="card-role">{it.role}</div>
            <p>{it.desc}</p>
          </div>
        ))}
      </aside>
    )
  }
  return null
}
