import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const vert = /* glsl */ `
  uniform float uTime;
  uniform float uRange;
  uniform float uPixelRatio;

  attribute float aSpeed;
  attribute float aSize;
  attribute vec3  aColor;

  varying vec3  vColor;
  varying float vAlpha;

  void main() {
    // Desplazamiento horizontal infinito hacia la izquierda.
    vec3 pos = position;
    pos.x = mod(pos.x - uTime * aSpeed + uRange * 0.5, uRange) - uRange * 0.5;

    // Twinkle determinista por estrella.
    float seed = fract(sin(dot(position, vec3(12.9898, 78.233, 45.164))) * 43758.5453);
    float twinkle = 0.55 + 0.45 * sin(uTime * 2.5 + seed * 30.0);

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;

    gl_PointSize = aSize * uPixelRatio * (0.7 + twinkle * 0.6);

    vColor = aColor;
    vAlpha = 0.55 + twinkle * 0.45;
  }
`

const frag = /* glsl */ `
  varying vec3  vColor;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - vec2(0.5));
    if (d > 0.5) discard;
    float a = smoothstep(0.5, 0.0, d);
    gl_FragColor = vec4(vColor, a * vAlpha);
  }
`

export function Starfield() {
    const pointsRef = useRef<THREE.Points>(null)
    // 1. Agrega una referencia para el material
    const materialRef = useRef<THREE.ShaderMaterial>(null)

    const { geometry, uniforms } = useMemo(() => {
        // Repartimos en una rejilla 16x16x16 = 4096 celdas → una estrella por celda.
        // Sube o baja el número para más o menos densidad, pero siempre uniforme.
        const GRID = 16
        const count = GRID * GRID * GRID

        const RANGE = 200      // ancho del wrap horizontal (X)
        const HEIGHT = 160     // alto total (Y)
        const DEPTH = 300      // profundidad total (Z)
        const INNER_HOLE = 32  // radio vacío en el centro

        // Tamaño de cada celda
        const cellX = RANGE / GRID
        const cellY = HEIGHT / GRID
        const cellZ = DEPTH / GRID

        const positions = new Float32Array(count * 3)
        const colors = new Float32Array(count * 3)
        const speeds = new Float32Array(count)
        const sizes = new Float32Array(count)

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
                    const i3 = i * 3

                    // Centro de la celda + jitter aleatorio dentro de la celda.
                    // El jitter es del 90% del tamaño de la celda → no se sale nunca.
                    const jx = (Math.random() - 0.5) * cellX * 0.9
                    const jy = (Math.random() - 0.5) * cellY * 0.9
                    const jz = (Math.random() - 0.5) * cellZ * 0.9

                    let px = (gx + 0.5) * cellX - RANGE * 0.5 + jx
                    let py = (gy + 0.5) * cellY - HEIGHT * 0.5 + jy
                    let pz = (gz + 0.5) * cellZ - DEPTH * 0.5 + jz

                    // Si cae dentro del hueco central, empujarla hacia afuera
                    // en lugar de descartarla (así no se rompe la uniformidad).
                    const dist = Math.sqrt(px * px + py * py + pz * pz)
                    if (dist < INNER_HOLE) {
                        const s = INNER_HOLE / Math.max(dist, 0.001)
                        px *= s
                        py *= s
                        pz *= s
                    }

                    positions[i3]     = px
                    positions[i3 + 1] = py
                    positions[i3 + 2] = pz

                    const c = palette[(Math.random() * palette.length) | 0]
                    colors[i3]     = c.r
                    colors[i3 + 1] = c.g
                    colors[i3 + 2] = c.b

                    const depthFactor = Math.max(0, 1 - dist / 150)
                    speeds[i] = 1.2 + depthFactor * 5.0 + Math.random() * 1.0
                    sizes[i] = 0.8 + Math.random() * 2.4

                    i++
                }
            }
        }

        const geo = new THREE.BufferGeometry()
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
        geo.setAttribute('aColor',   new THREE.BufferAttribute(colors, 3))
        geo.setAttribute('aSpeed',   new THREE.BufferAttribute(speeds, 1))
        geo.setAttribute('aSize',    new THREE.BufferAttribute(sizes, 1))

        const uni = {
            uTime: { value: 0 },
            uRange: { value: RANGE },
            uPixelRatio: {
                value:
                    typeof window !== 'undefined'
                        ? Math.min(window.devicePixelRatio || 1, 2)
                        : 1,
            },
        }

        return { geometry: geo, uniforms: uni }
    }, [])

    useFrame((_, delta) => {
        // 2. Modifica el uniform directamente en la instancia del material
        if (materialRef.current) {
            materialRef.current.uniforms.uTime.value += Math.min(delta, 0.05)
        }
    })

    return (
        <points ref={pointsRef} geometry={geometry} frustumCulled={false}>
            <shaderMaterial
                ref={materialRef} // 3. Asigna la referencia aquí
                uniforms={uniforms}
                vertexShader={vert}
                fragmentShader={frag}
                transparent
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </points>
    )
}