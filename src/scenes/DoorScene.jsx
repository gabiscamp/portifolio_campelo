import { useRef, useState, useEffect, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { sfxKnock, sfxDoorCreak, sfxWhoosh } from '../audio.js'

const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x))
const lerp = (a, b, t) => a + (b - a) * t
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

const PURPLE = '#7c5cbf'
const PURPLE_DARK = '#6648a6'
const PURPLE_DEEP = '#5a3f94'
const YELLOW = '#f2b84b'
const YELLOW_DARK = '#d4a017'
const WALL = '#2a2d38'

function Box({ p, s, c, r = 0.7, m = 0, ...rest }) {
  return (
    <mesh position={p} castShadow receiveShadow {...rest}>
      <boxGeometry args={s} />
      <meshStandardMaterial color={c} roughness={r} metalness={m} />
    </mesh>
  )
}

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
    <mesh position={[0, 1.15, 0.07]} castShadow>
      <planeGeometry args={[0.38, 0.2]} />
      <meshStandardMaterial map={tex} />
    </mesh>
  )
}

export default function DoorScene({ onOpenStart, onOpened }) {
  const { camera, pointer } = useThree()
  const hinge = useRef()
  const knob = useRef()
  const glass = useRef()
  const spill = useRef()
  const backWall = useRef()
  const peepholeGlow = useRef()
  const st = useRef({ opening: false, t: 0, done: false, time: 0, sfx: { knock: false, creak: false, whoosh: false } })
  const [hover, setHover] = useState(false)

  useEffect(() => {
    camera.position.set(0, 2.0, 8)
    camera.lookAt(0, 1.8, 0)
  }, [camera])

  useEffect(() => {
    document.body.style.cursor = hover && !st.current.opening ? 'pointer' : 'auto'
    return () => { document.body.style.cursor = 'auto' }
  }, [hover])

  useFrame((_, dt) => {
    const s = st.current
    dt = Math.min(dt, 0.05)
    s.time += dt
    if (s.opening) s.t += dt
    const t = s.t

    if (s.opening && !s.sfx.knock) { s.sfx.knock = true; sfxKnock() }
    if (t > 0.5 && !s.sfx.creak) { s.sfx.creak = true; sfxDoorCreak() }
    if (t > 1.5 && !s.sfx.whoosh) { s.sfx.whoosh = true; sfxWhoosh() }

    knob.current.rotation.z = -easeInOut(clamp(t / 0.4)) * 0.8
    const o = easeInOut(clamp((t - 0.4) / 1.5))
    hinge.current.rotation.y = o * 1.75
    spill.current.intensity = o * 55
    backWall.current.emissiveIntensity = 0.1 + o * 0.6

    const pulse = 0.4 + Math.sin(s.time * 2.5) * 0.3 + Math.sin(s.time * 7) * 0.05
    glass.current.emissiveIntensity = s.opening ? 0.2 : hover ? 3.0 : pulse
    peepholeGlow.current.intensity = s.opening ? 0 : hover ? 8 : pulse * 3

    const c = easeInOut(clamp((t - 1.1) / 1.9))
    const idleX = s.opening ? 0 : pointer.x * 0.5
    camera.position.set(
      lerp(idleX, 0, c),
      lerp(2.0 + (s.opening ? 0 : pointer.y * 0.2), 1.75, c),
      lerp(8, -1.0, c)
    )
    camera.lookAt(0, 1.8, lerp(0, -6, c))

    if (t > 3.2 && !s.done) {
      s.done = true
      onOpened?.()
    }
  })

  const open = (e) => {
    e.stopPropagation()
    if (st.current.opening) return
    st.current.opening = true
    setHover(false)
    onOpenStart?.()
  }

  return (
    <>
      <color attach="background" args={['#16181e']} />
      <fog attach="fog" args={['#16181e', 14, 34]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 8, 8]} intensity={1.2} castShadow shadow-mapSize={[1024, 1024]} />
      <spotLight position={[0, 6, 4]} angle={0.5} penumbra={0.8} intensity={65} color="#fff1d6" />
      <pointLight ref={spill} position={[0, 2.6, -3]} color="#ffcf8a" intensity={0} distance={16} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#1c1f27" roughness={0.85} />
      </mesh>

      <Box p={[-4.6, 3, 0]} s={[7, 6, 0.3]} c={WALL} />
      <Box p={[4.6, 3, 0]} s={[7, 6, 0.3]} c={WALL} />
      <Box p={[0, 4.9, 0]} s={[2.2, 2.3, 0.3]} c={WALL} />
      <Box p={[0, 0.06, 0.1]} s={[14.4, 0.12, 0.34]} c="#171921" />

      <mesh position={[0, 3, -7]}>
        <planeGeometry args={[30, 8]} />
        <meshStandardMaterial ref={backWall} color="#5a4630" emissive="#c98a3c" emissiveIntensity={0.1} />
      </mesh>

      <Box p={[-1.07, 1.88, 0.02]} s={[0.14, 3.75, 0.42]} c={YELLOW} r={0.4} m={0.3} />
      <Box p={[1.07, 1.88, 0.02]} s={[0.14, 3.75, 0.42]} c={YELLOW} r={0.4} m={0.3} />
      <Box p={[0, 3.68, 0.02]} s={[2.28, 0.14, 0.42]} c={YELLOW} r={0.4} m={0.3} />

      <group ref={hinge} position={[-1, 0, 0]}>
        <group
          position={[1, 1.775, 0]}
          onPointerOver={(e) => { e.stopPropagation(); setHover(true) }}
          onPointerOut={() => setHover(false)}
          onClick={open}
        >
          <Box p={[0, 0, 0]} s={[2, 3.55, 0.12]} c={PURPLE} />

          <Box p={[-0.55, 1.0, 0.065]} s={[0.65, 0.85, 0.03]} c={PURPLE_DARK} />
          <Box p={[0.55, 1.0, 0.065]} s={[0.65, 0.85, 0.03]} c={PURPLE_DARK} />
          <Box p={[-0.55, -0.9, 0.065]} s={[0.65, 1.25, 0.03]} c={PURPLE_DARK} />
          <Box p={[0.55, -0.9, 0.065]} s={[0.65, 1.25, 0.03]} c={PURPLE_DARK} />

          <group position={[0, 0.4, 0.075]}>
            <Box p={[0, 0.37, 0]} s={[0.7, 0.06, 0.04]} c={YELLOW} r={0.35} m={0.3} />
            <Box p={[0, -0.37, 0]} s={[0.7, 0.06, 0.04]} c={YELLOW} r={0.35} m={0.3} />
            <Box p={[-0.32, 0, 0]} s={[0.06, 0.8, 0.04]} c={YELLOW} r={0.35} m={0.3} />
            <Box p={[0.32, 0, 0]} s={[0.06, 0.8, 0.04]} c={YELLOW} r={0.35} m={0.3} />
            <Box p={[0, 0, -0.01]} s={[0.58, 0.68, 0.01]} c={PURPLE_DEEP} />
          </group>

          <NumberPlate />

          <group position={[0, 0.4, 0.09]}>
            <mesh castShadow>
              <torusGeometry args={[0.13, 0.03, 16, 32]} />
              <meshStandardMaterial color={YELLOW_DARK} metalness={0.85} roughness={0.2} />
            </mesh>
            <mesh>
              <circleGeometry args={[0.11, 32]} />
              <meshStandardMaterial ref={glass} color="#0a0c12" emissive={YELLOW} emissiveIntensity={0.4} />
            </mesh>
            <pointLight ref={peepholeGlow} position={[0, 0, 0.15]} color={YELLOW} intensity={3} distance={2} />
          </group>

          <group position={[0.8, -0.2, 0.1]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.12, 0.12, 0.04, 24]} />
              <meshStandardMaterial color={YELLOW_DARK} metalness={0.85} roughness={0.25} />
            </mesh>
            <group ref={knob}>
              <mesh position={[0, 0, 0.1]} castShadow>
                <sphereGeometry args={[0.08, 20, 16]} />
                <meshStandardMaterial color="#e6b422" metalness={0.85} roughness={0.2} />
              </mesh>
              <mesh position={[-0.1, 0, 0.05]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.028, 0.028, 0.2, 10]} />
                <meshStandardMaterial color="#e6b422" metalness={0.85} roughness={0.2} />
              </mesh>
            </group>
          </group>
        </group>
      </group>
    </>
  )
}
