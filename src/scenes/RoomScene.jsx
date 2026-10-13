import { useRef, useState, useEffect, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import LampModel from './LampModel.jsx'
import ScreenProjects from '../ui/ScreenProjects.jsx'
import { texts } from '../i18n.js'
import { sfxClick, sfxWhoosh } from '../audio.js'

const VIEWS = {
  overview: { pos: [0, 2.9, 8.6], look: [0, 1.9, -1.5] },
  projects: { pos: [0, 1.8, -0.35], look: [0, 1.75, -2.3] },
  contact: { pos: [1.2, 2.0, 0.0], look: [1.75, 1.2, -1.8] },
  about: { pos: [-1.0, 2.4, 1.8], look: [-2.4, 1.6, -3.9] },
  experience: { pos: [3.5, 2.5, -0.8], look: [4.0, 2.5, -4.4] },
  agenda: { pos: [-0.5, 2.8, -2.0], look: [-1.5, 2.9, -4.5] },
}

function Box({ p, s, c, r = 0.7, m = 0, ...rest }) {
  return (
    <mesh position={p} castShadow receiveShadow {...rest}>
      <boxGeometry args={s} />
      <meshStandardMaterial color={c} roughness={r} metalness={m} />
    </mesh>
  )
}

function Pin({ position, label, active }) {
  const ref = useRef()
  useFrame(({ clock }) => {
    ref.current.position.y = position[1] + Math.sin(clock.elapsedTime * 2.4) * 0.07
    ref.current.scale.setScalar(active ? 1.5 : 1)
  })
  return (
    <group>
      <mesh ref={ref} position={position}>
        <sphereGeometry args={[0.1, 16, 12]} />
        <meshStandardMaterial color="#f2b84b" emissive="#f2b84b" emissiveIntensity={2} />
      </mesh>
      {active && (
        <Html position={[position[0], position[1] + 0.35, position[2]]} center style={{ pointerEvents: 'none' }}>
          <div className="pin-label">{label}</div>
        </Html>
      )}
    </group>
  )
}

function Hot({ id, focus, onFocus, pin, label, children }) {
  const [hover, setHover] = useState(false)
  useEffect(() => {
    document.body.style.cursor = hover ? 'pointer' : 'auto'
    return () => { document.body.style.cursor = 'auto' }
  }, [hover])
  return (
    <group
      onPointerOver={(e) => { e.stopPropagation(); setHover(true) }}
      onPointerOut={() => setHover(false)}
      onClick={(e) => { e.stopPropagation(); sfxClick(); onFocus(id) }}
    >
      {children}
      {focus === 'overview' && <Pin position={pin} label={label} active={hover} />}
    </group>
  )
}

function CameraRig({ focus }) {
  const { camera, pointer } = useThree()
  const look = useRef(new THREE.Vector3(0, 1.9, -3))
  const goalPos = useMemo(() => new THREE.Vector3(), [])
  const goalLook = useMemo(() => new THREE.Vector3(), [])
  const prevFocus = useRef(focus)

  useEffect(() => {
    camera.position.set(0, 1.9, 5.5)
    look.current.set(0, 1.9, -3)
  }, [camera])

  useEffect(() => {
    if (prevFocus.current !== focus) { prevFocus.current = focus; sfxWhoosh() }
  }, [focus])

  useFrame((_, dt) => {
    const v = VIEWS[focus]
    goalPos.set(...v.pos)
    goalLook.set(...v.look)
    if (focus === 'overview') {
      goalPos.x += pointer.x * 0.9
      goalPos.y += pointer.y * 0.35
    }
    const k = 1 - Math.exp(-3 * Math.min(dt, 0.05))
    camera.position.lerp(goalPos, k)
    look.current.lerp(goalLook, k)
    camera.lookAt(look.current)
  })
  return null
}

function useCalendarTex() {
  return useMemo(() => {
    const c = document.createElement('canvas')
    c.width = 256; c.height = 320
    const g = c.getContext('2d')
    g.fillStyle = '#fafafa'; g.fillRect(0, 0, 256, 320)
    g.fillStyle = '#c2410c'; g.fillRect(0, 0, 256, 50)
    g.fillStyle = '#fff'; g.font = 'bold 22px sans-serif'; g.textAlign = 'center'
    g.fillText('OUTUBRO 2026', 128, 35)
    const days = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']
    g.fillStyle = '#6b7280'; g.font = 'bold 13px sans-serif'
    days.forEach((d, i) => g.fillText(d, 22 + i * 33, 74))
    g.font = '14px sans-serif'
    let day = 1, startCol = 4
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 7; col++) {
        if ((row === 0 && col < startCol) || day > 31) continue
        const x = 22 + col * 33, y = 94 + row * 38
        if (day === 12) {
          g.fillStyle = '#7c5cbf'
          g.beginPath(); g.arc(x, y - 4, 13, 0, Math.PI * 2); g.fill()
          g.fillStyle = '#fff'
        } else {
          g.fillStyle = '#2b2f38'
        }
        g.fillText(String(day), x, y)
        day++
      }
    }
    g.fillStyle = '#7c5cbf'; g.font = 'bold 13px sans-serif'
    g.fillText('📅 Agendar reunião', 128, 300)
    const tex = new THREE.CanvasTexture(c)
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
  }, [])
}

function HeisenbergHat() {
  return (
    <group position={[1.6, 3.58, -4.25]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.22, 0.22, 0.02, 24]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.12, 0]} castShadow>
        <cylinderGeometry args={[0.13, 0.14, 0.22, 20]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
      </mesh>
    </group>
  )
}

function WesterosMap() {
  const tex = useMemo(() => {
    const c = document.createElement('canvas')
    c.width = 200; c.height = 280
    const g = c.getContext('2d')
    g.fillStyle = '#d4c5a0'; g.fillRect(0, 0, 200, 280)
    g.strokeStyle = '#8a7a50'; g.lineWidth = 2
    g.beginPath(); g.moveTo(80, 20); g.quadraticCurveTo(120, 60, 100, 100)
    g.quadraticCurveTo(130, 140, 90, 180); g.quadraticCurveTo(110, 220, 95, 260); g.stroke()
    g.fillStyle = '#6a5a30'; g.font = 'italic 14px serif'; g.textAlign = 'center'
    g.fillText('WESTEROS', 100, 150)
    g.fillStyle = '#b91c1c'; g.font = '10px serif'
    g.fillText("King's Landing", 120, 220)
    g.beginPath(); g.arc(115, 210, 3, 0, Math.PI * 2); g.fill()
    g.fillText('Winterfell', 95, 60)
    g.beginPath(); g.arc(90, 50, 3, 0, Math.PI * 2); g.fill()
    const t = new THREE.CanvasTexture(c)
    t.colorSpace = THREE.SRGBColorSpace
    return t
  }, [])

  return (
    <mesh position={[4.3, 2.5, -4.48]}>
      <planeGeometry args={[0.7, 1.0]} />
      <meshStandardMaterial map={tex} />
    </mesh>
  )
}

function CentralPerkMug() {
  return (
    <group position={[-1.1, 1.17, -1.7]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.1, 0.085, 0.2, 20]} />
        <meshStandardMaterial color="#fafafa" roughness={0.4} />
      </mesh>
      <mesh position={[0.12, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.055, 0.016, 8, 16]} />
        <meshStandardMaterial color="#fafafa" />
      </mesh>
      <mesh position={[0, 0.04, 0.101]}>
        <planeGeometry args={[0.12, 0.06]} />
        <meshStandardMaterial color="#e08a3c" />
      </mesh>
    </group>
  )
}

export default function RoomScene({ focus, lang, onFocus }) {
  const calendarTex = useCalendarTex()
  const tr = texts[lang].nav
  const agendaLabel = lang === 'pt' ? 'Agenda' : 'Schedule'

  return (
    <>
      <color attach="background" args={['#0f1015']} />
      <CameraRig focus={focus} />
      <hemisphereLight args={['#ffe9c7', '#2b2540', 0.7]} />
      <directionalLight
        position={[4, 9, 6]}
        intensity={1.1}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-9}
        shadow-camera-right={9}
        shadow-camera-top={9}
        shadow-camera-bottom={-9}
        shadow-bias={-0.0005}
      />
      <pointLight position={[0, 3.9, -1.5]} intensity={22} color="#ffcf8a" distance={14} />

      <Box p={[0, -0.1, 0.75]} s={[10, 0.2, 10.5]} c="#7a5233" r={0.8} />
      <Box p={[0, 2.25, -4.6]} s={[10.4, 4.5, 0.2]} c="#3a3552" />
      <Box p={[-5.1, 2.25, 0.75]} s={[0.2, 4.5, 10.5]} c="#34304a" />
      <Box p={[5.1, 2.25, 0.75]} s={[0.2, 4.5, 10.5]} c="#34304a" />
      <mesh position={[0, 0.011, -0.5]} receiveShadow>
        <cylinderGeometry args={[2.3, 2.3, 0.02, 48]} />
        <meshStandardMaterial color="#4b3b73" roughness={1} />
      </mesh>

      <Box p={[0, 1.0, -2.0]} s={[3.4, 0.12, 1.3]} c="#9c6b3a" />
      {[[-1.55, -2.55], [1.55, -2.55], [-1.55, -1.45], [1.55, -1.45]].map(([x, z]) => (
        <Box key={`${x}${z}`} p={[x, 0.5, z]} s={[0.12, 1.0, 0.12]} c="#7a5230" />
      ))}

      <Hot id="projects" focus={focus} onFocus={onFocus} pin={[0, 2.65, -2.3]} label={tr.projects}>
        <Box p={[0, 1.75, -2.3]} s={[1.9, 1.1, 0.08]} c="#14161d" r={0.4} />
        <Box p={[0, 1.28, -2.28]} s={[0.14, 0.34, 0.1]} c="#2a2d38" />
        <Box p={[0, 1.08, -2.2]} s={[0.6, 0.03, 0.35]} c="#2a2d38" />
        <Html
          transform
          position={[0, 1.75, -2.255]}
          scale={0.092}
          zIndexRange={[1, 0]}
          pointerEvents={focus === 'projects' ? 'auto' : 'none'}
        >
          <ScreenProjects lang={lang} />
        </Html>
      </Hot>
      <Box p={[0, 1.09, -1.7]} s={[0.9, 0.03, 0.28]} c="#232631" r={0.5} />

      <Hot id="contact" focus={focus} onFocus={onFocus} pin={[1.2, 1.75, -1.8]} label={tr.contact}>
        <mesh position={[1.2, 1.11, -1.8]} castShadow>
          <cylinderGeometry args={[0.28, 0.3, 0.1, 24]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.6} />
        </mesh>
        <mesh position={[1.2, 1.17, -1.8]} castShadow>
          <cylinderGeometry args={[0.2, 0.2, 0.02, 24]} />
          <meshStandardMaterial color="#2a2a2a" roughness={0.5} />
        </mesh>
        <mesh position={[1.2, 1.185, -1.8]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.15, 0.015, 8, 24]} />
          <meshStandardMaterial color="#d4a017" metalness={0.7} roughness={0.3} />
        </mesh>
        {Array.from({ length: 10 }).map((_, i) => {
          const angle = (i / 10) * Math.PI * 1.6 + 0.5
          const rx = Math.cos(angle) * 0.11
          const rz = Math.sin(angle) * 0.11
          return (
            <mesh key={i} position={[1.2 + rx, 1.19, -1.8 + rz]}>
              <cylinderGeometry args={[0.015, 0.015, 0.02, 8]} />
              <meshStandardMaterial color="#0a0a0a" />
            </mesh>
          )
        })}
        <Box p={[1.2, 1.24, -1.8]} s={[0.5, 0.04, 0.08]} c="#1a1a1a" r={0.5} />
        <mesh position={[0.95, 1.25, -1.8]} castShadow>
          <cylinderGeometry args={[0.06, 0.07, 0.1, 16]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.5} />
        </mesh>
        <mesh position={[1.45, 1.25, -1.8]} castShadow>
          <cylinderGeometry args={[0.06, 0.07, 0.1, 16]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.5} />
        </mesh>
        <mesh position={[1.2, 1.08, -1.6]} rotation={[0.3, 0, 0]}>
          <torusGeometry args={[0.06, 0.008, 6, 16, Math.PI * 3]} />
          <meshStandardMaterial color="#2a2a2a" roughness={0.7} />
        </mesh>
      </Hot>

      <Hot id="about" focus={focus} onFocus={onFocus} pin={[-3.2, 3.7, -4.1]} label={tr.about}>
        <group position={[-3.2, 0, -3.7]} rotation={[0, 0.12, 0]}>
          <Box p={[0, 0.25, 0]} s={[2.5, 0.5, 1.0]} c="#e08a3c" />
          <Box p={[0, 0.6, 0.05]} s={[2.0, 0.22, 0.8]} c="#f0a05a" />
          <Box p={[0, 0.85, -0.4]} s={[2.5, 0.9, 0.28]} c="#e08a3c" />
          <Box p={[-1.12, 0.55, 0]} s={[0.26, 0.7, 1.0]} c="#d27a30" />
          <Box p={[1.12, 0.55, 0]} s={[0.26, 0.7, 1.0]} c="#d27a30" />
          <Box p={[0.55, 0.95, 0.0]} s={[0.5, 0.5, 0.14]} c="#7c5cbf" rotation={[0, 0, 0.3]} />
        </group>
        <Box p={[-3.2, 2.5, -4.46]} s={[1.3, 1.6, 0.06]} c="#f2b84b" r={0.4} m={0.3} />
        <Box p={[-3.2, 2.5, -4.42]} s={[1.08, 1.38, 0.05]} c="#a9c4de" r={0.25} m={0.1} />
      </Hot>

      <Hot id="experience" focus={focus} onFocus={onFocus} pin={[3.2, 3.7, -4.2]} label={tr.experience}>
        <Box p={[3.2, 2.5, -4.46]} s={[2.4, 1.6, 0.06]} c="#c99a5b" r={0.95} />
        <Box p={[2.65, 2.78, -4.42]} s={[0.5, 0.38, 0.02]} c="#e8dcc8" rotation={[0, 0, 0.03]} />
        <Box p={[3.25, 2.82, -4.42]} s={[0.45, 0.45, 0.02]} c="#fff3a6" rotation={[0, 0, 0.06]} />
        <Box p={[3.78, 2.72, -4.42]} s={[0.38, 0.5, 0.02]} c="#ffd1dc" rotation={[0, 0, -0.08]} />
        <Box p={[2.8, 2.2, -4.42]} s={[0.55, 0.4, 0.02]} c="#cfe8ff" rotation={[0, 0, -0.03]} />
        <Box p={[3.5, 2.18, -4.42]} s={[0.6, 0.36, 0.02]} c="#e8dcc8" rotation={[0, 0, 0.04]} />
        {[[2.65, 3.0], [3.25, 3.08], [3.78, 3.0], [2.8, 2.42], [3.5, 2.38]].map(([x, y], i) => (
          <mesh key={i} position={[x, y, -4.4]}>
            <sphereGeometry args={[0.035, 8, 6]} />
            <meshStandardMaterial color={['#c2410c', '#7c5cbf', '#3f9e5a', '#d4a017', '#c2410c'][i]} />
          </mesh>
        ))}
      </Hot>

      <Hot id="agenda" focus={focus} onFocus={onFocus} pin={[-1.5, 3.7, -4.4]} label={agendaLabel}>
        <mesh position={[-1.5, 2.9, -4.48]}>
          <planeGeometry args={[0.95, 1.2]} />
          <meshStandardMaterial map={calendarTex} />
        </mesh>
      </Hot>

      <HeisenbergHat />

      <WesterosMap />

      <Box p={[0.8, 3.5, -4.3]} s={[3.2, 0.08, 0.4]} c="#8a6a30" />

      <mesh position={[-0.2, 3.66, -4.3]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[0.1, 0.025, 12, 32]} />
        <meshStandardMaterial color="#d4a017" metalness={0.9} roughness={0.25} emissive="#d4a017" emissiveIntensity={0.3} />
      </mesh>

      <Box p={[0.3, 3.7, -4.3]} s={[0.12, 0.3, 0.25]} c="#7c5cbf" />
      <Box p={[0.44, 3.72, -4.3]} s={[0.12, 0.34, 0.25]} c="#3f9e5a" />
      <Box p={[0.58, 3.69, -4.3]} s={[0.12, 0.28, 0.25]} c="#c2410c" />

      <Box p={[0.78, 3.95, -4.3]} s={[0.05, 0.8, 0.02]} c="#c4c8d0" m={0.9} r={0.2} />
      <Box p={[0.78, 3.58, -4.3]} s={[0.25, 0.04, 0.04]} c="#d4a017" m={0.8} />

      <Box p={[1.4, 3.72, -4.3]} s={[0.28, 0.34, 0.04]} c="#fafafa" />
      <Box p={[1.78, 3.7, -4.3]} s={[0.24, 0.3, 0.04]} c="#fafafa" />
      <Box p={[2.1, 3.71, -4.3]} s={[0.26, 0.32, 0.04]} c="#fafafa" />

      <CentralPerkMug />

      <Box p={[-0.55, 1.07, -1.55]} s={[0.34, 0.012, 0.22]} c="#efe4c8" rotation={[0, 0.4, 0]} />
      <mesh position={[-0.55, 1.08, -1.55]}>
        <sphereGeometry args={[0.035, 12, 8]} />
        <meshStandardMaterial color="#b91c1c" />
      </mesh>

      <LampModel bulbOn position={[-1.35, 1.06, -2.35]} scale={0.26} />
    </>
  )
}
