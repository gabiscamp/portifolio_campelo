import { useState } from 'react'
import { Canvas } from '@react-three/fiber'

export default function App() {
  const [focus, setFocus] = useState('overview')
  const [lang, setLang] = useState('pt')

  const labels = {
    pt: { about: 'Sobre Mim', projects: 'Projetos', experience: 'Experiências', contact: 'Contato', back: '← Voltar à sala' },
    en: { about: 'About Me', projects: 'Projects', experience: 'Experience', contact: 'Contact', back: '← Back to the room' },
  }
  const nav = labels[lang]

  return (
    <div className="app">
      <Canvas shadows dpr={[1, 2]} camera={{ fov: 40, position: [0, 2.4, 9], near: 0.1, far: 80 }}>
        <color attach="background" args={['#0b0d11']} />
        <ambientLight intensity={0.3} />
      </Canvas>

      <button className="lang" onClick={() => setLang(lang === 'pt' ? 'en' : 'pt')}>
        {lang === 'pt' ? 'PT | en' : 'pt | EN'}
      </button>

      <nav className="menu">
        <span className="brand">G. Campelo</span>
        {['about', 'projects', 'experience', 'contact'].map((k) => (
          <button key={k} className={focus === k ? 'active' : ''} onClick={() => setFocus(k)}>
            {nav[k]}
          </button>
        ))}
      </nav>

      {focus !== 'overview' && (
        <button className="back" onClick={() => setFocus('overview')}>
          {nav.back}
        </button>
      )}

      {focus !== 'overview' && (
        <aside className="panel">
          <h2>{nav[focus]}</h2>
          <p style={{ color: '#8b90a0' }}>
            {lang === 'pt' ? 'Conteúdo será implementado na Sprint 2.' : 'Content will be implemented in Sprint 2.'}
          </p>
        </aside>
      )}
    </div>
  )
}
