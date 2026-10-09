import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { Sun } from './Sun'
import { Planet, type PlanetConfig } from './Planet'
import { Starfield } from './Starfield'
import { AsteroidBelt } from './AsteroidBelt'
import { systemStore, useSystemState } from '../store/system'

const PLANETS: PlanetConfig[] = [
    { name: 'Mercurio', kind: 'mercury', distance: 3.4,  size: 0.16, speed: 1.55, label: '01 · Inicio' },
    { name: 'Venus',    kind: 'venus',   distance: 4.8,  size: 0.24, speed: 1.15, label: '02 · Sobre mí' },
    { name: 'Tierra',   kind: 'earth',   distance: 6.4,  size: 0.27, speed: 0.85, tilt: 0.41, label: '03 · Proyectos' },
    { name: 'Marte',    kind: 'mars',    distance: 8.2,  size: 0.21, speed: 0.65, tilt: 0.44, label: '04 · Experiencia' },
    { name: 'Júpiter',  kind: 'jupiter', distance: 11.4, size: 0.58, speed: 0.38, tilt: 0.05, label: '05 · Stack' },
    { name: 'Saturno',  kind: 'saturn',  distance: 15.0, size: 0.48, speed: 0.28, tilt: 0.47, label: '06 · Certificaciones' },
    { name: 'Urano',    kind: 'uranus',  distance: 18.6, size: 0.34, speed: 0.20, tilt: 1.71, label: '07 · Blog' },
    { name: 'Neptuno',  kind: 'neptune', distance: 22.0, size: 0.33, speed: 0.15, tilt: 0.49, label: '08 · Contacto' },
]

function DriftingSystem() {
    const groupRef = useRef<THREE.Group>(null)

    useFrame((state) => {
        if (!groupRef.current) return
        const t = state.clock.elapsedTime
        groupRef.current.position.y = Math.sin(t * 0.15) * 0.4
        groupRef.current.position.x = Math.sin(t * 0.11) * 0.25
        groupRef.current.rotation.z = Math.sin(t * 0.1) * 0.012
        groupRef.current.rotation.x = Math.cos(t * 0.13) * 0.008
    })

    return (
        <group ref={groupRef}>
            <Sun />
            {PLANETS.map((p) => (
                <Planet key={p.name} {...p} />
            ))}
            <AsteroidBelt />
        </group>
    )
}

export function Scene() {
    const { showOrbits } = useSystemState()

    return (
        <div className="scene">
            <Canvas
                camera={{ position: [0, 26, 14], fov: 42 }}
                dpr={[1, 2]}
                gl={{ antialias: true }}
            >
                <color attach="background" args={['#03040a']} />
                <ambientLight intensity={0.06} />

                <Starfield />
                <DriftingSystem />

                <OrbitControls
                    makeDefault
                    ref={(c) => {
                        if (c) systemStore._setControls(c as unknown as { reset: () => void })
                    }}
                    enableDamping
                    dampingFactor={0.06}
                    enablePan={false}
                    enableZoom
                    zoomSpeed={0.6}
                    rotateSpeed={0.55}
                    minDistance={8}
                    maxDistance={70}
                    minPolarAngle={0.05}
                    maxPolarAngle={Math.PI - 0.05}
                />

                {/* Toggle de órbitas global (no afecta la cámara) */}
                <group visible={showOrbits} />
            </Canvas>
        </div>
    )
}