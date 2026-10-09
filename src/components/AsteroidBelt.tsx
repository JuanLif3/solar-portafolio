import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function AsteroidBelt() {
    const pointsRef = useRef<THREE.Points>(null)

    const { geometry, material } = useMemo(() => {
        const count = 2600
        const positions = new Float32Array(count * 3)
        const sizes = new Float32Array(count)

        for (let i = 0; i < count; i++) {
            const i3 = i * 3
            const r = 9.5 + Math.random() * 1.6
            const angle = Math.random() * Math.PI * 2
            const y = (Math.random() - 0.5) * 0.5
            positions[i3] = Math.cos(angle) * r
            positions[i3 + 1] = y
            positions[i3 + 2] = Math.sin(angle) * r
            sizes[i] = 0.6 + Math.random() * 1.2
        }

        const geo = new THREE.BufferGeometry()
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
        geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1))

        const mat = new THREE.PointsMaterial({
            size: 0.028,
            color: '#b8a888',
            transparent: true,
            opacity: 0.75,
            depthWrite: false,
            sizeAttenuation: true,
        })

        return { geometry: geo, material: mat }
    }, [])

    useFrame((_, delta) => {
        if (pointsRef.current) pointsRef.current.rotation.y += delta * 0.045
    })

    return (
        <points
            ref={pointsRef}
            geometry={geometry}
            material={material}
            frustumCulled={false}
        />
    )
}