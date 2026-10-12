import { useState, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'

export default function App() {
const [sec, setSec] = useState('overview')
const [lang, setLang] = useState('pt')

const nomes = {
pt: {about:'Sobre Mim',projects:'Projetos',experience:'Experiências',contact:'Contato',agenda:'Agenda'},
en: {about:'About Me',projects:'Projects',experience:'Experience',contact:'Contact',agenda:'Schedule'}
}

const voltar = lang === 'pt' ? '← Voltar' : '← Back'

return (
<div className="app">
<Canvas shadows dpr={[1,2]} camera={{fov:40, position:[0,2.4,9], near:0.1, far:80}}>
<color attach="background" args={['#0b0d11']}/>
<ambientLight intensity={0.3}/>
</Canvas>

<button className="lang" onClick={()=> setLang(lang==='pt'?'en':'pt')}>
{lang==='pt'?'PT | en':'pt | EN'}
</button>

<nav className="menu">
<span className="brand">G. Campelo</span>
{['about','projects','experience','contact','agenda'].map(k=>(
<button key={k} className={sec===k?'active':''} onClick={()=>setSec(k)}>
{nomes[lang][k]}
</button>
))}
</nav>

{sec !== 'overview' && (
<button className="back" onClick={()=>setSec('overview')}>{voltar}</button>
)}

{sec !== 'overview' && (
<aside className="panel">
<h2>{nomes[lang][sec]}</h2>
<p style={{color:'#8b90a0'}}>
{lang==='pt'?'Conteúdo em desenvolvimento...':'Content under development...'}
</p>
</aside>
)}
</div>
)
}
