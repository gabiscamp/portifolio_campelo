import { useState, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import LampIntro from './scenes/LampIntro.jsx'
import RoomScene from './scenes/RoomScene.jsx'
import Panel from './ui/Panel.jsx'
import { texts } from './i18n.js'
import { sfxClick } from './audio.js'

export default function App() {
  const [stage, setStage] = useState('intro')
  const [fading, setFading] = useState(false)
  const [lit, setLit] = useState(false)
  const [focus, setFocus] = useState('overview')
  const [lang, setLang] = useState('pt')
  const tr = texts[lang]

  const go = useCallback((next) => {
    setFading(true)
    setTimeout(() => {
      setStage(next)
      setLit(false)
      setFading(false)
    }, 600)
  }, [])

  return (
    <div className="app">
      <Canvas shadows dpr={[1, 2]} camera={{ fov: 40, position: [0, 2.4, 9], near: 0.1, far: 80 }}>
        {stage === 'intro' && <LampIntro onLit={() => setLit(true)} onDoorOpened={() => go('room')} />}
        {stage === 'room' && <RoomScene focus={focus} lang={lang} onFocus={setFocus} />}
      </Canvas>

      <div className={`fade ${fading ? 'on' : ''}`} />

      <button className="lang" onClick={() => setLang(lang === 'pt' ? 'en' : 'pt')}>
        {lang === 'pt' ? 'PT | en' : 'pt | EN'}
      </button>

      {stage === 'intro' && (
        <button className="skip" onClick={() => go('room')}>
          {tr.skip}
        </button>
      )}

      {stage === 'intro' && (
        <div className={`hero ${lit ? 'show' : ''}`}>
          <h1>Gabriela Campelo</h1>
          <p>{tr.role}</p>
          <p className="door-hint">{tr.doorHint}</p>
        </div>
      )}

      {stage === 'room' && (
        <>
          <nav className="menu">
            <span className="brand">G. Campelo</span>
            {['about', 'projects', 'experience', 'contact', 'agenda'].map((k) => (
              <button key={k} className={focus === k ? 'active' : ''} onClick={() => setFocus(k)}>
                {tr.nav[k] || (k === 'agenda' ? (lang === 'pt' ? 'Agenda' : 'Schedule') : k)}
              </button>
            ))}
          </nav>
          {focus !== 'overview' && (
            <button className="back" onClick={() => setFocus('overview')}>
              {tr.back}
            </button>
          )}
          <Panel focus={focus} lang={lang} />
        </>
      )}
    </div>
  )
}
