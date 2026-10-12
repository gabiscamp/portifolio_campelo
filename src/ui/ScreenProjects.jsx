import { texts, projects } from '../i18n.js'

const thumbs = {
  'E-commerce de Doces': { bg: 'linear-gradient(135deg, #f2b84b 0%, #e08a3c 100%)', icon: '🍩', color: '#fff' },
  'RH com Reconhecimento Facial': { bg: 'linear-gradient(135deg, #3f9e5a 0%, #2d7a45 100%)', icon: '🤖', color: '#fff' },
  'Educação Financeira (TIAW)': { bg: 'linear-gradient(135deg, #4a90d9 0%, #2d6ab0 100%)', icon: '💰', color: '#fff' },
  'PI Van – Gestão de Transporte': { bg: 'linear-gradient(135deg, #7c5cbf 0%, #5a3f94 100%)', icon: '🚐', color: '#fff' },
  'Este Portfólio 3D': { bg: 'linear-gradient(135deg, #1e1a2e 0%, #7c5cbf 100%)', icon: '💡', color: '#f2b84b' },
}

function Thumb({ name, tech }) {
  const t = thumbs[name] || { bg: '#3a3552', icon: '📁', color: '#fff' }
  return (
    <div className="tl-img" style={{
      background: t.bg,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      gap: 4, color: t.color, fontSize: 12, fontWeight: 600,
    }}>
      <span style={{ fontSize: 28 }}>{t.icon}</span>
      <span style={{ fontSize: 9, opacity: 0.8, textAlign: 'center', lineHeight: 1.2, padding: '0 4px' }}>
        {tech.slice(0, 2).join(' · ')}
      </span>
    </div>
  )
}

export default function ScreenProjects({ lang }) {
  const tr = texts[lang].screen
  return (
    <div className="screen">
      <div className="screen-bar">
        <i style={{ background: '#f87171' }} />
        <i style={{ background: '#fbbf24' }} />
        <i style={{ background: '#34d399' }} />
        <span>portfolio.dev/projetos</span>
      </div>
      <div className="screen-body">
        <h2>{tr.title}</h2>
        <p className="screen-sub">{tr.sub}</p>
        <div className="timeline">
          {projects.map((p) => (
            <div className="tl-item" key={p.name}>
              <span className="tl-year">{p.year}</span>
              <div className="tl-card">
                <Thumb name={p.name} tech={p.tech} />
                <div>
                  <strong>{p.name}</strong>
                  <p>{p.desc}</p>
                  <div className="tags">
                    {p.tech.map((t) => (
                      <em key={t}>{t}</em>
                    ))}
                  </div>
                  <a href={p.repo} target="_blank" rel="noopener noreferrer">
                    {tr.repo}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
