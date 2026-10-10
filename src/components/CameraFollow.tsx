import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { systemStore, useSystemState } from '../store/system'
import { planetPositions } from '../store/planetPositions'

const OVERVIEW_CAMERA = new THREE.Vector3(0, 26, 14)
const OVERVIEW_TARGET = new THREE.Vector3(0, 0, 0)
const FOCUS_DISTANCE = 4.5

export function CameraFollow() {
    const { camera } = useThree()
    const controls = useThree((s) => s.controls) as
        | { target: THREE.Vector3; update: () => void; enabled: boolean }
        | null
    const { focusedPlanet } = useSystemState()

    const wasFocusedRef = useRef(false)
    const desiredCamPos = useRef(new THREE.Vector3())
    const desiredTarget = useRef(new THREE.Vector3())

    useFrame((_, delta) => {
        if (!controls) return
        const d = Math.min(delta, 0.05)
        const k = 1 - Math.pow(0.003, d) // lerp suave

        if (focusedPlanet) {
            const planetPos = planetPositions.get(focusedPlanet)
            if (!planetPos) return

            // Deshabilita control de usuario mientras sigue al planeta
            controls.enabled = false

            if (!wasFocusedRef.current) {
                // Primera vez enfocado: snapshot del offset actual
                wasFocusedRef.current = true
            }

            // Target: la posición del planeta
            desiredTarget.current.copy(planetPos)

            // Cámara: offset fijo respecto al planeta
            const offset = new THREE.Vector3(2.6, 2.0, 2.6)
            desiredCamPos.current.copy(planetPos).add(offset)

            // Lerp target y posición
            controls.target.lerp(desiredTarget.current, k)
            camera.position.lerp(desiredCamPos.current, k)
            camera.lookAt(controls.target)

            controls.update()
        } else {
            // Volver al overview
            if (wasFocusedRef.current) {
                wasFocusedRef.current = false
            }
            controls.enabled = true

            controls.target.lerp(OVERVIEW_TARGET, k)
            camera.position.lerp(OVERVIEW_CAMERA, k)
            camera.lookAt(controls.target)

            controls.update()
        }
    })

    return null
}