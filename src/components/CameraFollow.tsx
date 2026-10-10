import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useSystemState } from '../store/system'
import { planetPositions } from '../store/planetPositions'

const OVERVIEW_CAMERA = new THREE.Vector3(0, 26, 14)
const OVERVIEW_TARGET = new THREE.Vector3(0, 0, 0)
const FOCUS_OFFSET = new THREE.Vector3(3.2, 2.2, 3.2)

export function CameraFollow() {
    const camera = useThree((s) => s.camera)
    const controls = useThree((s) => s.controls) as any

    const { focusedPlanet } = useSystemState()
    const focusedRef = useRef<string | null>(null)
    focusedRef.current = focusedPlanet

    // Estado de la "máquina" de seguimiento.
    const isReturningRef = useRef(false)
    const wasFocusedRef = useRef(false)

    const tmpVec = useRef(new THREE.Vector3())

    useFrame((_, delta) => {
        if (!controls || !controls.target) return

        const d = Math.min(delta, 0.05)
        const k = 1 - Math.pow(0.0005, d)
        const focus = focusedRef.current

        if (focus) {
            const planetPos = planetPositions.get(focus)
            if (!planetPos) return

            // Enfocado: seguimos al planeta y bloqueamos al usuario.
            controls.enabled = false
            isReturningRef.current = false
            wasFocusedRef.current = true

            controls.target.lerp(planetPos, k)

            tmpVec.current.copy(planetPos).add(FOCUS_OFFSET)
            camera.position.lerp(tmpVec.current, k)
            camera.lookAt(controls.target)
            controls.update()
            return
        }

        if (wasFocusedRef.current) {
            // Venimos de un foco: hacemos la transición suave al overview
            // y cuando llegamos, devolvemos el control al usuario.
            isReturningRef.current = true

            controls.target.lerp(OVERVIEW_TARGET, k)
            camera.position.lerp(OVERVIEW_CAMERA, k)
            camera.lookAt(controls.target)
            controls.update()

            const dist = camera.position.distanceTo(OVERVIEW_CAMERA)
            if (dist < 0.3) {
                wasFocusedRef.current = false
                isReturningRef.current = false
                controls.enabled = true
            }
            return
        }

        // Libre: no tocamos la cámara. OrbitControls se encarga por completo.
        if (!controls.enabled) {
            controls.enabled = true
        }
    })

    return null
}