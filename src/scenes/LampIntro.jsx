import { useRef, useState, useEffect, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import LampModel, { REST } from './LampModel.jsx'
import { sfxHop, sfxFlicker, sfxLightOn, sfxDoorCreak } from '../audio.js'

const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x))
const lerp = (a, b, t) => a + (b - a) * t
const easeOut = (t) => 1 - Math.pow(1 - t, 3)
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

const ENTER = 0.3
const HOP_TO_CENTER = 2.2
const LOOK_START = 2.4
const LOOK_END = 5.0
const LIGHT_ON = 5.2
const TEXT_AT = 5.9

function NumberPlate() {
  const tex = useMemo(() => {
    const c = document.createElement('canvas')
    c.width = 128; c.height = 64
    const g = c.getContext('2d')
    g.fillStyle = '#1a1c23'
    g.fillRect(0, 0, 128, 64)
    g.fillStyle = '#f2b84b'
    g.font = 'bold 38px serif'
    g.textAlign = 'center'
    g.textBaseline = 'middle'
    g.fillText('20', 64, 32)
    const t = new THREE.CanvasTexture(c)
    t.colorSpace = THREE.SRGBColorSpace
    return t
  }, [])
  return (
    <mesh position={[0, 0.68, 0.065]}>
      <planeGeometry args={[0.28, 0.15]} />
      <meshStandardMaterial map={tex} />
    </mesh>
  )
}

export default function LampIntro({ onLit, onDoorOpened }) {
  const { camera, pointer } = useThree()
  const rig = {
    root: useRef(),
    lower: useRef(),
    upper: useRef(),
    head: useRef(),
    bulb: useRef(),
    spot: useRef(),
  }
  const ambient = useRef()
  const time = useRef(0)
  const sent = useRef(false)
  const hopSfx = useRef(0)
  const flickerSfx = useRef({ a: false, b: false, on: false })

  const hingeRef = useRef()
  const knobRef = useRef()
  const [doorVisible, setDoorVisible] = useState(false)
  const [doorOpening, setDoorOpening] = useState(false)
  const doorTime = useRef(0)
  const doorSfxPlayed = useRef(false)
  const [hover, setHover] = useState(false)

  useEffect(() => {
    camera.position.set(0, 2.2, 8)
    camera.lookAt(0, 1.5, 0)
  }, [camera])

  useEffect(() => {
    document.body.style.cursor = hover && !doorOpening ? 'pointer' : 'auto'
    return () => { document.body.style.cursor = 'auto' }
  }, [hover, doorOpening])

  useFrame((_, dt) => {
    time.current += Math.min(dt, 0.05)
    const t = time.current
    const root = rig.root.current

    if (doorOpening) {
      doorTime.current += Math.min(dt, 0.05)
      const dt2 = doorTime.current

      if (knobRef.current) {
        knobRef.current.rotation.z = -easeInOut(clamp(dt2 / 0.3)) * 0.8
      }

      if (dt2 > 0.3 && !doorSfxPlayed.current) { doorSfxPlayed.current = true; sfxDoorCreak() }

      if (hingeRef.current) {
        hingeRef.current.rotation.y = easeInOut(clamp((dt2 - 0.3) / 1.2)) * 1.6
      }

      const camP = easeInOut(clamp((dt2 - 0.6) / 1.8))
      camera.position.x += (0.5 - camera.position.x) * camP * 0.05
      camera.position.y += (1.5 - camera.position.y) * camP * 0.05
      camera.position.z += (1 - camera.position.z) * camP * 0.05
      camera.lookAt(0.5, 1.3, -1)

      if (dt2 > 2.5) onDoorOpened?.()
      return
    }

    let x = -7, y = 0, sy = 1

    if (t < ENTER) {
      x = -7
    } else if (t < HOP_TO_CENTER) {
      const p = clamp((t - ENTER) / (HOP_TO_CENTER - ENTER))
      x = lerp(-7, -1.8, easeOut(p))
      const hopPhase = p * Math.PI * 3
      const hop = Math.abs(Math.sin(hopPhase)) * (1.0 - p * 0.4)
      y = hop
      const air = clamp(hop / 0.3)
      const landing = Math.sin(hopPhase) < 0.05 && Math.cos(hopPhase) < 0
      sy = landing ? 0.82 : 0.88 + 0.12 * air + hop * 0.12

      const hopIdx = Math.floor(p * 3)
      if (hopIdx > hopSfx.current) { hopSfx.current = hopIdx; sfxHop() }
    } else if (t < LOOK_END) {
      x = -1.8
    } else {
      x = -1.8
      sy = 1 + Math.sin((t - LOOK_END) * 1.4) * 0.015
    }

    const sxz = 1 / Math.sqrt(Math.max(sy, 0.5))
    root.position.set(x, y, 0)
    root.scale.set(sxz, sy, sxz)

    let a1 = REST.a1, a2 = REST.a2, a3 = REST.a3, headY = 0

    if (t >= ENTER && t < HOP_TO_CENTER) {
      const p = clamp((t - ENTER) / (HOP_TO_CENTER - ENTER))
      const hop = Math.abs(Math.sin(p * Math.PI * 3))
      a2 += hop * 0.3; a3 += -hop * 0.5
    } else if (t >= LOOK_START && t < LOOK_END) {
      const k = (t - LOOK_START) / (LOOK_END - LOOK_START)
      if (k < 0.25) {
        const p = k / 0.25
        headY = easeInOut(p) * 1.2; a3 += easeInOut(p) * 0.25
      } else if (k < 0.45) {
        const p = (k - 0.25) / 0.2
        headY = lerp(1.2, -1.2, easeInOut(p))
        a3 += lerp(0.25, -0.2, easeInOut(p))
        a2 += Math.sin(p * Math.PI) * 0.08
      } else if (k < 0.65) {
        const p = (k - 0.45) / 0.2
        headY = lerp(-1.2, 0, easeInOut(p))
        a3 += lerp(-0.2, -0.35, easeInOut(p))
        a2 += easeInOut(p) * 0.15
      } else {
        const p = (k - 0.65) / 0.35
        headY = Math.sin(p * Math.PI * 2) * 0.15
        a3 += -0.35 + p * 0.2; a2 += 0.15 - p * 0.1
        a1 += Math.sin(p * Math.PI) * 0.04
      }
    } else if (t > LOOK_END) {
      const breathe = Math.sin((t - LOOK_END) * 1.4)
      a3 += -0.15 + breathe * 0.02
      headY = Math.sin((t - LOOK_END) * 0.6) * 0.08
    }

    rig.lower.current.rotation.z = a1
    rig.upper.current.rotation.z = a2
    rig.head.current.rotation.z = a3
    rig.head.current.rotation.y = headY

    const lt = t - LIGHT_ON
    let lk = 0
    if (lt > 0) {
      if (lt < 0.08) { lk = 1; if (!flickerSfx.current.a) { flickerSfx.current.a = true; sfxFlicker() } }
      else if (lt < 0.2) lk = 0
      else if (lt < 0.28) { lk = 1; if (!flickerSfx.current.b) { flickerSfx.current.b = true; sfxFlicker() } }
      else if (lt < 0.45) lk = 0.06
      else { lk = clamp((lt - 0.45) / 0.8); if (!flickerSfx.current.on) { flickerSfx.current.on = true; sfxLightOn() } }
    }
    rig.spot.current.intensity = lk * 95
    rig.bulb.current.material.emissiveIntensity = lk * 3
    ambient.current.intensity = 0.05 + lk * 0.15

    if (lk > 0.5 && !doorVisible) setDoorVisible(true)

    camera.position.x += (pointer.x * 0.5 - camera.position.x) * 0.02
    camera.position.y += (2.2 + pointer.y * 0.15 - camera.position.y) * 0.02
    camera.lookAt(0, 1.5, 0)

    if (t > TEXT_AT && !sent.current) { sent.current = true; onLit?.() }
  })

  const clickDoor = (e) => {
    e.stopPropagation()
    if (!doorVisible || doorOpening) return
    setDoorOpening(true); setHover(false)
  }

  return (
    <>
      <color attach="background" args={['#1e1a2e']} />
      <fog attach="fog" args={['#1e1a2e', 12, 28]} />
      <ambientLight ref={ambient} intensity={0.05} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color="#2a2540" roughness={0.9} />
      </mesh>

      <LampModel rig={rig} light bulbOn={false} position={[-7, 0, 0]} />

      <group position={[0.5, 0, 0]}>
        <mesh position={[-0.55, 1.4, 0]} castShadow>
          <boxGeometry args={[0.1, 2.8, 0.2]} />
          <meshStandardMaterial color="#f2b84b" roughness={0.4} metalness={0.3} />
        </mesh>
        <mesh position={[0.55, 1.4, 0]} castShadow>
          <boxGeometry args={[0.1, 2.8, 0.2]} />
          <meshStandardMaterial color="#f2b84b" roughness={0.4} metalness={0.3} />
        </mesh>
        <mesh position={[0, 2.73, 0]} castShadow>
          <boxGeometry args={[1.2, 0.1, 0.2]} />
          <meshStandardMaterial color="#f2b84b" roughness={0.4} metalness={0.3} />
        </mesh>

        <group ref={hingeRef} position={[-0.5, 0, 0]}>
          <group
            position={[0.5, 1.35, 0]}
            onClick={clickDoor}
            onPointerOver={(e) => { e.stopPropagation(); if (doorVisible) setHover(true) }}
            onPointerOut={() => setHover(false)}
          >
            <mesh castShadow>
              <boxGeometry args={[1.0, 2.7, 0.08]} />
              <meshStandardMaterial color="#7c5cbf" roughness={0.65} />
            </mesh>
            <mesh position={[0, 0.6, 0.045]}>
              <boxGeometry args={[0.7, 0.8, 0.02]} />
              <meshStandardMaterial color="#6648a6" roughness={0.7} />
            </mesh>
            <mesh position={[0, -0.55, 0.045]}>
              <boxGeometry args={[0.7, 1.0, 0.02]} />
              <meshStandardMaterial color="#6648a6" roughness={0.7} />
            </mesh>
            <mesh position={[0, 0.55, 0.06]}>
              <boxGeometry args={[0.42, 0.05, 0.02]} />
              <meshStandardMaterial color="#f2b84b" roughness={0.35} metalness={0.3} />
            </mesh>
            <mesh position={[0, 0.2, 0.06]}>
              <boxGeometry args={[0.42, 0.05, 0.02]} />
              <meshStandardMaterial color="#f2b84b" roughness={0.35} metalness={0.3} />
            </mesh>
            <mesh position={[-0.185, 0.375, 0.06]}>
              <boxGeometry args={[0.05, 0.4, 0.02]} />
              <meshStandardMaterial color="#f2b84b" roughness={0.35} metalness={0.3} />
            </mesh>
            <mesh position={[0.185, 0.375, 0.06]}>
              <boxGeometry args={[0.05, 0.4, 0.02]} />
              <meshStandardMaterial color="#f2b84b" roughness={0.35} metalness={0.3} />
            </mesh>
            <mesh position={[0, 0.375, 0.05]}>
              <boxGeometry args={[0.32, 0.3, 0.01]} />
              <meshStandardMaterial color="#5a3f94" roughness={0.8} />
            </mesh>
            <mesh position={[0, 0.45, 0.065]}>
              <torusGeometry args={[0.03, 0.008, 10, 20]} />
              <meshStandardMaterial color="#d4a017" metalness={0.85} roughness={0.2} />
            </mesh>
            <mesh position={[0, 0.45, 0.06]}>
              <circleGeometry args={[0.025, 20]} />
              <meshStandardMaterial color="#1a1c23" />
            </mesh>
            <NumberPlate />
            <group ref={knobRef} position={[0.38, -0.15, 0.06]}>
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.06, 0.06, 0.03, 16]} />
                <meshStandardMaterial color="#d4a017" metalness={0.85} roughness={0.25} />
              </mesh>
              <mesh position={[0, 0, 0.06]} castShadow>
                <sphereGeometry args={[0.04, 12, 8]} />
                <meshStandardMaterial color="#e6b422" metalness={0.85} roughness={0.2} />
              </mesh>
            </group>
          </group>
        </group>
      </group>
    </>
  )
}
