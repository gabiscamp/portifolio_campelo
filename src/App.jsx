import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import Panel from './ui/Panel.jsx'
import { texts } from './i18n.js'

export default function App() {
const [sec, setSec] = useState('overview')
const [lang, setLang] = useState('pt')
const tr = texts[lang]

return (
<div className="app">
<Canvas shadows dpr={[1,2]} camera={{fov:40,position:[0,2.4,9],near:0.1,far:80}}>
<color attach="background" args={['#0b0d11']}/>
<ambientLight intensity={0.3}/>
</Canvas>

<button className="lang" onClick={()=>setLang(lang==='pt'?'en':'pt')}>
{lang==='pt'?'PT | en':'pt | EN'}
</button>

<nav className="menu">
<span className="brand">G. Campelo</span>
{['about','projects','experience','contact','agenda'].map(k=>(
<button key={k} className={sec===k?'active':''} onClick={()=>setSec(k)}>
{tr.nav[k]}
</button>
))}
</nav>

{sec!=='overview' && <button className="back" onClick={()=>setSec('overview')}>{tr.back}</button>}

<Panel focus={sec} lang={lang} />
</div>
)
}
