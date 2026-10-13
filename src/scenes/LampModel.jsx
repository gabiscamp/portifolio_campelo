import { useRef, useMemo, useLayoutEffect } from 'react'
import * as THREE from 'three'

export const REST = { a1: -0.6, a2: 1.3, a3: 0.2 }
const L1 = 1.6
const L2 = 1.4

const metal = { color: '#d4cfc8', roughness: 0.3, metalness: 0.35 }
const dark = { color: '#4a4555', roughness: 0.45, metalness: 0.5 }
const accent = { color: '#f2b84b', roughness: 0.4, metalness: 0.3 }

function Arm({ length }) {
  return (
    <mesh position={[0, length / 2, 0]} castShadow>
      <cylinderGeometry args={[0.06, 0.06, length, 16]} />
      <meshStandardMaterial {...metal} />
    </mesh>
  )
}

function Joint() {
  return (
    <mesh castShadow>
      <sphereGeometry args={[0.14, 20, 16]} />
      <meshStandardMaterial {...accent} />
    </mesh>
  )
}

export default function LampModel({ rig, light = false, bulbOn = false, ...props }) {
  const local = { root: useRef(), lower: useRef(), upper: useRef(), head: useRef(), bulb: useRef(), spot: useRef() }
  const r = rig || local
  const target = useMemo(() => new THREE.Object3D(), [])

  useLayoutEffect(() => {
    if (light && r.spot.current) r.spot.current.target = target
  }, [light, r, target])

  return (
    <group ref={r.root} {...props}>
      <mesh position={[0, 0.07, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.7, 0.78, 0.14, 40]} />
        <meshStandardMaterial {...dark} />
      </mesh>
      <mesh position={[0, 0.15, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.7, 0.02, 40]} />
        <meshStandardMaterial {...accent} />
      </mesh>

      <group ref={r.lower} position={[0, 0.14, 0]} rotation={[0, 0, REST.a1]}>
        <Arm length={L1} />
        <group position={[0, L1, 0]}>
          <Joint />
          <group ref={r.upper} rotation={[0, 0, REST.a2]}>
            <Arm length={L2} />
            <group position={[0, L2, 0]}>
              <Joint />
              <group ref={r.head} rotation={[0, 0, REST.a3]}>
                <mesh position={[0, -0.35, 0]} castShadow>
                  <sphereGeometry args={[0.64, 40, 20, 0, Math.PI * 2, 0, Math.PI / 2]} />
                  <meshStandardMaterial {...dark} side={THREE.DoubleSide} />
                </mesh>
                <mesh position={[0, -0.35, 0]} rotation={[Math.PI / 2, 0, 0]}>
                  <torusGeometry args={[0.64, 0.035, 12, 48]} />
                  <meshStandardMaterial {...accent} />
                </mesh>
                <mesh ref={r.bulb} position={[0, -0.5, 0]}>
                  <sphereGeometry args={[0.2, 24, 16]} />
                  <meshStandardMaterial color="#fff3d6" emissive="#ffc766" emissiveIntensity={bulbOn ? 2.2 : 0} />
                </mesh>
                {light && (
                  <>
                    <spotLight
                      ref={r.spot}
                      position={[0, -0.55, 0]}
                      angle={0.62}
                      penumbra={0.85}
                      intensity={0}
                      distance={0}
                      decay={2}
                      color="#ffd9a0"
                      castShadow
                      shadow-mapSize={[1024, 1024]}
                      shadow-bias={-0.0006}
                    />
                    <primitive object={target} position={[0, -4, 0]} />
                  </>
                )}
                {bulbOn && !light && <pointLight position={[0, -0.6, 0]} intensity={2} distance={4} color="#ffd9a0" />}
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
  )
}
