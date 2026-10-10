import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useSystemState } from '../store/system'
import { planetPositions } from '../store/planetPositions'

const OVERVIEW_CAMERA = new THREE.Vector3(0, 26, 14)
const OVERVIEW_TARGET = new THREE.Vector3(0, 0, 0)

// Offset de cámara respecto al planeta (detrás/arriba).
const FOCUS_OFFSET = new THREE.Vector3(3.2, 2.2, 3.2)

// Desplazamiento del "look target" hacia la derecha del planeta.
// A mayor valor, más a la izquierda aparece el planeta.
// Rango típico: 1.4 → 2.6. Sube si el readout tapa al planeta.
const SIDE_SHIFT = 2.0

const WORLD_UP = new THREE.Vector3(0, 1, 0)

export function CameraFollow() {
    const camera = useThree((s) => s.camera)
    const controls = useThree((s) => s.controls) as any

    const { focusedPlanet } = useSystemState()
    const focusedRef = useRef<string | null>(null)
    focusedRef.current = focusedPlanet

    const wasFocusedRef = useRef(false)

    const tmpCamPos = useRef(new THREE.Vector3())
    const tmpCamDir = useRef(new THREE.Vector3())
    const tmpRight = useRef(new THREE.Vector3())
    const tmpTarget = useRef(new THREE.Vector3())

    useFrame((_, delta) => {
        if (!controls || !controls.target) return

        const d = Math.min(delta, 0.05)
        const k = 1 - Math.pow(0.0005, d)
        const focus = focusedRef.current

        if (focus) {
            const planetPos = planetPositions.get(focus)
            if (!planetPos) return

            controls.enabled = false
            wasFocusedRef.current = true

            // 1) Posición de la cámara: offset fijo respecto al planeta.
            tmpCamPos.current.copy(planetPos).add(FOCUS_OFFSET)

            // 2) Dirección de vista (desde la cámara hacia el planeta).
            tmpCamDir.current
                .copy(planetPos)
                .sub(tmpCamPos.current)
                .normalize()

            // 3) Vector "derecha" en espacio de mundo.
            //    right = forward × up.
            tmpRight.current
                .crossVectors(tmpCamDir.current, WORLD_UP)
                .normalize()

            // 4) El target se desplaza a la derecha del planeta.
            //    La cámara "mira más a la derecha" → el planeta
            //    aparece a la izquierda del viewport.
            tmpTarget.current
                .copy(planetPos)
                .addScaledVector(tmpRight.current, SIDE_SHIFT)

            controls.target.lerp(tmpTarget.current, k)
            camera.position.lerp(tmpCamPos.current, k)
            camera.lookAt(controls.target)
            controls.update()
            return
        }

        if (wasFocusedRef.current) {
            controls.target.lerp(OVERVIEW_TARGET, k)
            camera.position.lerp(OVERVIEW_CAMERA, k)
            camera.lookAt(controls.target)
            controls.update()

            if (camera.position.distanceTo(OVERVIEW_CAMERA) < 0.3) {
                wasFocusedRef.current = false
                controls.enabled = true
            }
            return
        }

        if (!controls.enabled) {
            controls.enabled = true
        }
    })

    return null
}