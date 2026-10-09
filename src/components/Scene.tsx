import { Canvas } from '@react-three/fiber'
import { Sun } from './Sun'
import { Planet, type PlanetConfig } from './Planet'
import { Starfield } from './Starfield'

const PLANETS: PlanetConfig[] = [
    { name: 'Mercurio', distance: 3.4,  size: 0.16, speed: 1.55, color: '#a89a8c', emissive: '#1a1006' },
    { name: 'Venus',    distance: 4.8,  size: 0.23, speed: 1.15, color: '#e6b87a', emissive: '#3a2a10' },
    { name: 'Tierra',   distance: 6.4,  size: 0.26, speed: 0.85, color: '#4a90c8', emissive: '#0a2030', tilt: 0.41 },
    { name: 'Marte',    distance: 8.2,  size: 0.21, speed: 0.65, color: '#c2573d', emissive: '#2a0e08', tilt: 0.44 },
    { name: 'Júpiter',  distance: 11.4, size: 0.55, speed: 0.38, color: '#d4a373', emissive: '#3a2410', tilt: 0.05 },
    { name: 'Saturno',  distance: 15.0, size: 0.47, speed: 0.28, color: '#e8c88a', emissive: '#3a2c15', tilt: 0.47, hasRings: true, ringColor: '#e0c090' },
    { name: 'Urano',    distance: 18.6, size: 0.34, speed: 0.20, color: '#7ad4d4', emissive: '#0a2a2a', tilt: 1.71 },
    { name: 'Neptuno',  distance: 22.0, size: 0.33, speed: 0.15, color: '#3a5b9c', emissive: '#0a1428', tilt: 0.49 },
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
                <ambientLight intensity={0.08} />

                <Starfield />
                <Sun />

                {PLANETS.map((p) => (
                    <Planet key={p.name} {...p} />
                ))}
            </Canvas>
        </div>
    )
}