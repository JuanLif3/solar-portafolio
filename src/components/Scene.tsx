import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Sun } from './Sun'
import { Planet, type PlanetConfig } from './Planet'
import { Starfield } from './Starfield'

const PLANETS: PlanetConfig[] = [
    { name: 'Mercurio', kind: 'mercury', distance: 3.4,  size: 0.16, speed: 1.55 },
    { name: 'Venus',    kind: 'venus',   distance: 4.8,  size: 0.24, speed: 1.15 },
    { name: 'Tierra',   kind: 'earth',   distance: 6.4,  size: 0.27, speed: 0.85, tilt: 0.41 },
    { name: 'Marte',    kind: 'mars',    distance: 8.2,  size: 0.21, speed: 0.65, tilt: 0.44 },
    { name: 'Júpiter',  kind: 'jupiter', distance: 11.4, size: 0.58, speed: 0.38, tilt: 0.05 },
    { name: 'Saturno',  kind: 'saturn',  distance: 15.0, size: 0.48, speed: 0.28, tilt: 0.47 },
    { name: 'Urano',    kind: 'uranus',  distance: 18.6, size: 0.34, speed: 0.20, tilt: 1.71 },
    { name: 'Neptuno',  kind: 'neptune', distance: 22.0, size: 0.33, speed: 0.15, tilt: 0.49 },
]

export function Scene() {
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
                <Sun />

                {PLANETS.map((p) => (
                    <Planet key={p.name} {...p} />
                ))}

                <OrbitControls
                    makeDefault
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
            </Canvas>
        </div>
    )
}