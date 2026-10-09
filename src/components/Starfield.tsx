import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { systemStore } from '../store/system'

/* ============================================================
 *  STREAKS
 *  Cada estrella es un LINE SEGMENT (2 vértices) con cola
 *  proporcional a su velocidad. Eso produce el efecto "warp".
 * ============================================================ */

const vert = /* glsl */ `
  uniform float uTime;
  uniform float uRange;
  uniform float uPixelRatio;
  uniform float uTailLength;

  attribute float aSpeed;
  attribute float aSize;
  attribute vec3  aColor;
  attribute float aTail; // 0 = cabeza, 1 = cola

  varying vec3  vColor;
  varying float vAlpha;

  void main() {
    // Loop horizontal infinito hacia la izquierda.
    vec3 pos = position;
    pos.x = mod(pos.x - uTime * aSpeed + uRange * 0.5, uRange) - uRange * 0.5;

    // La cola se extiende hacia la derecha (opuesta al movimiento).
    // Longitud proporcional a la velocidad → estrellas rápidas = estelas largas.
    pos.x += aTail * aSpeed * uTailLength;

    // Twinkle solo en la cabeza.
    float seed = fract(sin(dot(position, vec3(12.9898, 78.233, 45.164))) * 43758.5453);
    float twinkle = 0.7 + 0.3 * sin(uTime * 4.0 + seed * 30.0);

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;

    vColor = aColor * aSize;
    // Cabeza opaca, cola transparente.
    vAlpha = (1.0 - aTail * 0.95) * (0.6 + twinkle * 0.4);
  }
`

const frag = /* glsl */ `
  varying vec3  vColor;
  varying float vAlpha;
  void main() {
    gl_FragColor = vec4(vColor, vAlpha);
  }
`

export function Starfield() {
    const materialRef = useRef<THREE.ShaderMaterial>(null)

    const { geometry, uniforms } = useMemo(() => {
        // Rejilla uniforme → densidad pareja en cualquier dirección.
        const GRID = 20
        const count = GRID * GRID * GRID

        const RANGE = 220
        const HEIGHT = 160
        const DEPTH = 300
        const INNER_HOLE = 30

        const cellX = RANGE / GRID
        const cellY = HEIGHT / GRID
        const cellZ = DEPTH / GRID

        // Cada estrella genera 2 vértices (cabeza + cola) → 6 floats.
        const positions = new Float32Array(count * 6)
        const colors = new Float32Array(count * 6)
        const speeds = new Float32Array(count * 2)
        const sizes = new Float32Array(count * 2)
        const tails = new Float32Array(count * 2)

        const palette = [
            new THREE.Color('#ffffff'),
            new THREE.Color('#dfe9ff'),
            new THREE.Color('#a9c6ff'),
            new THREE.Color('#fff2d4'),
            new THREE.Color('#ffd9a8'),
        ]

        let i = 0
        for (let gx = 0; gx < GRID; gx++) {
            for (let gy = 0; gy < GRID; gy++) {
                for (let gz = 0; gz < GRID; gz++) {
                    const jx = (Math.random() - 0.5) * cellX * 0.9
                    const jy = (Math.random() - 0.5) * cellY * 0.9
                    const jz = (Math.random() - 0.5) * cellZ * 0.9

                    let px = (gx + 0.5) * cellX - RANGE * 0.5 + jx
                    let py = (gy + 0.5) * cellY - HEIGHT * 0.5 + jy
                    let pz = (gz + 0.5) * cellZ - DEPTH * 0.5 + jz

                    const dist = Math.sqrt(px * px + py * py + pz * pz)
                    if (dist < INNER_HOLE) {
                        const s = INNER_HOLE / Math.max(dist, 0.001)
                        px *= s
                        py *= s
                        pz *= s
                    }

                    const c = palette[(Math.random() * palette.length) | 0]
                    const depthFactor = Math.max(0, 1 - dist / 150)
                    // Velocidad alta — esto es lo que da la sensación de viaje.
                    const sp = 0.6 + depthFactor * 2.8 + Math.random() * 0.6
                    const sz = 0.85 + Math.random() * 0.35

                    const i6 = i * 6
                    // Cabeza
                    positions[i6]     = px
                    positions[i6 + 1] = py
                    positions[i6 + 2] = pz
                    // Cola (misma posición base — el shader añade el offset)
                    positions[i6 + 3] = px
                    positions[i6 + 4] = py
                    positions[i6 + 5] = pz

                    colors[i6]     = c.r
                    colors[i6 + 1] = c.g
                    colors[i6 + 2] = c.b
                    colors[i6 + 3] = c.r
                    colors[i6 + 4] = c.g
                    colors[i6 + 5] = c.b

                    speeds[i * 2]     = sp
                    speeds[i * 2 + 1] = sp

                    sizes[i * 2]     = sz
                    sizes[i * 2 + 1] = sz

                    tails[i * 2]     = 0 // cabeza
                    tails[i * 2 + 1] = 1 // cola

                    i++
                }
            }
        }

        const geo = new THREE.BufferGeometry()
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
        geo.setAttribute('aColor',   new THREE.BufferAttribute(colors, 3))
        geo.setAttribute('aSpeed',   new THREE.BufferAttribute(speeds, 1))
        geo.setAttribute('aSize',    new THREE.BufferAttribute(sizes, 1))
        geo.setAttribute('aTail',    new THREE.BufferAttribute(tails, 1))

        const uni = {
            uTime: { value: 0 },
            uRange: { value: RANGE },
            uPixelRatio: {
                value:
                    typeof window !== 'undefined'
                        ? Math.min(window.devicePixelRatio || 1, 2)
                        : 1,
            },
            // Multiplicador global del largo de la estela.
            uTailLength: { value: 0.22 },
        }

        return { geometry: geo, uniforms: uni }
    }, [])

    useFrame((_, delta) => {
        const { paused, speed } = systemStore.getState()
        if (paused) return
        if (materialRef.current) {
            materialRef.current.uniforms.uTime.value += Math.min(delta, 0.05) * speed
        }
    })

    return (
        <lineSegments geometry={geometry} frustumCulled={false}>
            <shaderMaterial
                ref={materialRef}
                uniforms={uniforms}
                vertexShader={vert}
                fragmentShader={frag}
                transparent
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </lineSegments>
    )
}