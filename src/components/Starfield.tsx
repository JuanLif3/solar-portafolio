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
        const count = 3200
        const RANGE = 120
        const DEPTH = 70

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

        for (let i = 0; i < count; i++) {
            const i3 = i * 3

            positions[i3]     = (Math.random() - 0.5) * RANGE
            positions[i3 + 1] = (Math.random() - 0.5) * 60
            positions[i3 + 2] = -Math.random() * DEPTH - 2

            const c = palette[(Math.random() * palette.length) | 0]
            colors[i3]     = c.r
            colors[i3 + 1] = c.g
            colors[i3 + 2] = c.b

            const depthFactor = 1.0 - Math.abs(positions[i3 + 2]) / (DEPTH + 2)
            speeds[i] = 0.8 + depthFactor * 4.5 + Math.random() * 0.8
            sizes[i] = 0.8 + Math.random() * 2.2
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