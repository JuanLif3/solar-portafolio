import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export type PlanetConfig = {
    name: string
    distance: number
    size: number
    speed: number
    color: string
    emissive?: string
    tilt?: number
    hasRings?: boolean
    ringColor?: string
}

export function Planet({
                           distance,
                           size,
                           speed,
                           color,
                           emissive = '#000000',
                           tilt = 0,
                           hasRings = false,
                           ringColor = '#d4a373',
                       }: PlanetConfig) {
    const orbitRef = useRef<THREE.Group>(null)
    const planetRef = useRef<THREE.Mesh>(null)
    const angleRef = useRef(Math.random() * Math.PI * 2)

    const planetMat = useMemo(
        () =>
            new THREE.MeshStandardMaterial({
                color: new THREE.Color(color),
                emissive: new THREE.Color(emissive),
                emissiveIntensity: 0.55,
                roughness: 0.82,
                metalness: 0.08,
            }),
        [color, emissive],
    )

    useFrame((_, delta) => {
        const d = Math.min(delta, 0.05)
        angleRef.current += d * speed

        if (orbitRef.current) {
            orbitRef.current.position.x = Math.cos(angleRef.current) * distance
            orbitRef.current.position.z = Math.sin(angleRef.current) * distance
        }

        if (planetRef.current) {
            planetRef.current.rotation.y += d * 0.5
        }
    })

    return (
        <>
            {/* Anillo de órbita sutil */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.001, 0]}>
                <ringGeometry args={[distance - 0.008, distance + 0.008, 180]} />
                <meshBasicMaterial
                    color="#6ea8ff"
                    transparent
                    opacity={0.09}
                    side={THREE.DoubleSide}
                    depthWrite={false}
                />
            </mesh>

            {/* Planeta orbitando */}
            <group ref={orbitRef}>
                <group rotation={[0, 0, tilt]}>
                    <mesh ref={planetRef} material={planetMat}>
                        <sphereGeometry args={[size, 48, 48]} />
                    </mesh>

                    {/* Anillos tipo Saturno */}
                    {hasRings && (
                        <mesh rotation={[Math.PI / 2 - 0.35, 0, 0]}>
                            <ringGeometry args={[size * 1.5, size * 2.4, 96]} />
                            <meshBasicMaterial
                                color={ringColor}
                                transparent
                                opacity={0.55}
                                side={THREE.DoubleSide}
                                depthWrite={false}
                            />
                        </mesh>
                    )}
                </group>
            </group>
        </>
    )
}