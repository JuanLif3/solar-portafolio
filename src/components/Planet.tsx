import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Html } from '@react-three/drei'
import { systemStore, useSystemState, type SectionId } from '../store/system'
import { planetPositions } from '../store/planetPositions'

export type PlanetKind =
    | 'mercury'
    | 'venus'
    | 'earth'
    | 'mars'
    | 'jupiter'
    | 'saturn'
    | 'uranus'
    | 'neptune'

export type PlanetConfig = {
    name: string
    kind: PlanetKind
    distance: number
    size: number
    speed: number
    tilt?: number
    label: string
}

const planetVert = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vViewDir;
  varying vec3 vPos;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vViewDir = normalize(-mv.xyz);
    vPos = position;
    gl_Position = projectionMatrix * mv;
  }
`

/* ============================================================
 *  FRAGMENT — minimalista
 * ============================================================ */
const planetFrag = /* glsl */ `
  uniform float uTime;
  uniform int   uKind;
  uniform vec3  uLightDir;

  varying vec3 vNormal;
  varying vec3 vViewDir;
  varying vec3 vPos;

  float softNoise(vec3 p) {
    float s = sin(p.x * 2.1) * cos(p.y * 1.7) * sin(p.z * 2.3);
    float s2 = sin(p.x * 4.7 + 1.3) * cos(p.y * 3.9 + 0.7);
    return s * 0.6 + s2 * 0.4;
  }

  vec3 gasMinimal(vec3 p, float freq, vec3 c1, vec3 c2, vec3 c3) {
    float lat = p.y;
    float bands = sin(lat * freq) * 0.5 + 0.5;
    float bands2 = sin(lat * freq * 1.9 + 1.2) * 0.5 + 0.5;
    vec3 col = mix(c1, c2, smoothstep(0.15, 0.85, bands));
    col = mix(col, c3, smoothstep(0.6, 0.95, bands2) * 0.5);
    return col;
  }

  void main() {
    vec3 p = normalize(vPos);
    vec3 col;

    if (uKind == 0) {
      float v = softNoise(p * 3.0) * 0.15 + 0.5;
      col = mix(vec3(0.32, 0.30, 0.29), vec3(0.55, 0.52, 0.49), v);
    }
    else if (uKind == 1) {
      float v = sin(p.y * 5.0) * 0.5 + 0.5;
      col = mix(vec3(0.78, 0.62, 0.35), vec3(0.95, 0.85, 0.60), v);
    }
    else if (uKind == 2) {
      float landNoise = softNoise(p * 2.2);
      float landMask = smoothstep(0.05, 0.35, landNoise);
      vec3 ocean = mix(vec3(0.10, 0.22, 0.45), vec3(0.16, 0.35, 0.62), p.y * 0.5 + 0.5);
      vec3 land = mix(vec3(0.28, 0.42, 0.24), vec3(0.55, 0.58, 0.32), p.y * 0.5 + 0.5);
      col = mix(ocean, land, landMask);
      float polar = smoothstep(0.75, 0.95, abs(p.y));
      col = mix(col, vec3(0.92, 0.95, 1.0), polar);
    }
    else if (uKind == 3) {
      float v = softNoise(p * 2.5) * 0.15 + 0.5;
      col = mix(vec3(0.55, 0.28, 0.18), vec3(0.80, 0.44, 0.28), v);
      float polar = smoothstep(0.82, 0.98, abs(p.y));
      col = mix(col, vec3(0.90, 0.92, 0.96), polar);
    }
    else if (uKind == 4) {
      col = gasMinimal(p, 16.0,
        vec3(0.55, 0.40, 0.28),
        vec3(0.85, 0.72, 0.55),
        vec3(0.96, 0.90, 0.78)
      );
    }
    else if (uKind == 5) {
      col = gasMinimal(p, 13.0,
        vec3(0.70, 0.58, 0.38),
        vec3(0.88, 0.80, 0.62),
        vec3(0.96, 0.92, 0.80)
      );
    }
    else if (uKind == 6) {
      col = gasMinimal(p, 8.0,
        vec3(0.55, 0.82, 0.85),
        vec3(0.72, 0.92, 0.94),
        vec3(0.85, 0.96, 0.97)
      );
    }
    else {
      col = gasMinimal(p, 10.0,
        vec3(0.18, 0.28, 0.62),
        vec3(0.32, 0.45, 0.82),
        vec3(0.55, 0.68, 0.92)
      );
    }

    vec3 n = normalize(vNormal);
    vec3 L = normalize(uLightDir);
    float ndl = max(dot(n, L), 0.0);

    float dayNight = smoothstep(-0.05, 0.35, ndl);
    vec3 nightColor = col * 0.12;
    vec3 dayColor = col * (0.85 + ndl * 0.35);
    col = mix(nightColor, dayColor, dayNight);

    float fresnel = pow(1.0 - max(dot(n, normalize(vViewDir)), 0.0), 4.0);
    col += vec3(0.85, 0.90, 1.0) * fresnel * ndl * 0.45;

    gl_FragColor = vec4(col, 1.0);
  }
`

/* ============================================================
 *  ATMÓSFERA
 * ============================================================ */
const atmoVert = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vViewDir;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vViewDir = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`

const atmoFrag = /* glsl */ `
  uniform vec3  uColor;
  uniform float uIntensity;
  varying vec3 vNormal;
  varying vec3 vViewDir;
  void main() {
    float f = pow(1.0 - max(dot(vNormal, vViewDir), 0.0), 3.5);
    gl_FragColor = vec4(uColor, f * uIntensity);
  }
`

function Atmosphere({ color, intensity }: { color: string; intensity: number }) {
    const uniforms = useMemo(
        () => ({
            uColor: { value: new THREE.Color(color) },
            uIntensity: { value: intensity },
        }),
        [color, intensity],
    )
    return (
        <mesh scale={1.08}>
            <sphereGeometry args={[1, 48, 48]} />
            <shaderMaterial
                uniforms={uniforms}
                vertexShader={atmoVert}
                fragmentShader={atmoFrag}
                transparent
                depthWrite={false}
                blending={THREE.AdditiveBlending}
                side={THREE.BackSide}
                toneMapped={false}
            />
        </mesh>
    )
}

/* ============================================================
 *  ANILLOS DE SATURNO
 * ============================================================ */
function Rings() {
    const ringMat = useMemo(
        () =>
            new THREE.MeshBasicMaterial({
                color: '#d8c89a',
                transparent: true,
                opacity: 0.55,
                side: THREE.DoubleSide,
                depthWrite: false,
            }),
        [],
    )

    const innerRingMat = useMemo(
        () =>
            new THREE.MeshBasicMaterial({
                color: '#c8b890',
                transparent: true,
                opacity: 0.35,
                side: THREE.DoubleSide,
                depthWrite: false,
            }),
        [],
    )

    return (
        <group rotation={[Math.PI / 2 - 0.35, 0, 0]}>
            <mesh material={ringMat}>
                <ringGeometry args={[1.45, 2.25, 128]} />
            </mesh>
            <mesh material={innerRingMat}>
                <ringGeometry args={[2.35, 2.55, 128]} />
            </mesh>
        </group>
    )
}

/* ============================================================
 *  MAPAS
 * ============================================================ */
const KIND_INDEX: Record<PlanetKind, number> = {
    mercury: 0,
    venus: 1,
    earth: 2,
    mars: 3,
    jupiter: 4,
    saturn: 5,
    uranus: 6,
    neptune: 7,
}

const ATMO: Partial<Record<PlanetKind, { color: string; intensity: number }>> = {
    earth:   { color: '#5a90e0', intensity: 0.85 },
    venus:   { color: '#e0b870', intensity: 0.55 },
    jupiter: { color: '#d0b090', intensity: 0.4 },
    saturn:  { color: '#d8c090', intensity: 0.35 },
    uranus:  { color: '#70c8d0', intensity: 0.5 },
    neptune: { color: '#4860c0', intensity: 0.55 },
}

/* ============================================================
 *  Extrae el id de sección desde la etiqueta.
 *  "03 · Proyectos" → "proyectos"
 * ============================================================ */
function labelToSectionId(label: string): SectionId | null {
    const parts = label.split('·')
    if (parts.length < 2) return null
    const raw = parts[1].trim().toLowerCase()
    // Normaliza acentos y espacios para que coincida con SectionId
    const normalized = raw
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '-')
    const allowed: SectionId[] = [
        'inicio', 'sobre-mi', 'proyectos', 'experiencia',
        'stack', 'certs', 'blog', 'contacto',
    ]
    return allowed.includes(normalized as SectionId)
        ? (normalized as SectionId)
        : null
}

/* ============================================================
 *  COMPONENTE
 * ============================================================ */
export function Planet({ kind, distance, size, speed, tilt = 0, label }: PlanetConfig) {
    const { showOrbits, showLabels, activeSection } = useSystemState()
    const orbitRef = useRef<THREE.Group>(null)
    const planetRef = useRef<THREE.Mesh>(null)
    const angleRef = useRef(Math.random() * Math.PI * 2)
    const worldPosRef = useRef(new THREE.Vector3())

    // Detecta si esta sección es la activa para resaltar el label.
    const sectionId = useMemo(() => labelToSectionId(label), [label])
    const isActive = sectionId !== null && activeSection === sectionId

    const uniforms = useMemo(
        () => ({
            uTime: { value: 0 },
            uKind: { value: KIND_INDEX[kind] },
            uLightDir: { value: new THREE.Vector3(1, 0.25, 0.5).normalize() },
        }),
        [kind],
    )

    useFrame((_, delta) => {
        const { paused, speed: globalSpeed } = systemStore.getState()
        const eff = paused ? 0 : globalSpeed
        const d = Math.min(delta, 0.05) * eff
        angleRef.current += d * speed

        if (orbitRef.current) {
            orbitRef.current.position.x = Math.cos(angleRef.current) * distance
            orbitRef.current.position.z = Math.sin(angleRef.current) * distance
        }

        if (planetRef.current) {
            planetRef.current.rotation.y += d * 0.3
            planetRef.current.getWorldPosition(worldPosRef.current)
            const existing = planetPositions.get(label)
            if (existing) existing.copy(worldPosRef.current)
            else planetPositions.set(label, worldPosRef.current.clone())
        }

        uniforms.uTime.value += d
    })

    const atmo = ATMO[kind]

    return (
        <>
            {/* ============ ÓRBITAS (visibilidad controlada) ============ */}
            <group visible={showOrbits}>
                {/* Halo suave */}
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.002, 0]}>
                    <ringGeometry args={[distance - 0.18, distance + 0.18, 220]} />
                    <meshBasicMaterial
                        color="#c9b88a"
                        transparent
                        opacity={0.05}
                        side={THREE.DoubleSide}
                        depthWrite={false}
                        blending={THREE.AdditiveBlending}
                    />
                </mesh>

                {/* Línea principal */}
                <mesh rotation={[-Math.PI / 2, 0, 0]}>
                    <ringGeometry args={[distance - 0.012, distance + 0.012, 240]} />
                    <meshBasicMaterial
                        color="#e8d8a8"
                        transparent
                        opacity={0.45}
                        side={THREE.DoubleSide}
                        depthWrite={false}
                        blending={THREE.AdditiveBlending}
                    />
                </mesh>

                {/* Ticks cada 15° */}
                {Array.from({ length: 24 }).map((_, i) => {
                    const angle = (i / 24) * Math.PI * 2
                    const tickLen = i % 6 === 0 ? 0.12 : 0.05
                    const x1 = Math.cos(angle) * (distance - 0.015)
                    const z1 = Math.sin(angle) * (distance - 0.015)
                    const x2 = Math.cos(angle) * (distance + tickLen)
                    const z2 = Math.sin(angle) * (distance + tickLen)
                    return (
                        <line key={i}>
                            <bufferGeometry>
                                <bufferAttribute
                                    attach="attributes-position"
                                    args={[new Float32Array([x1, 0, z1, x2, 0, z2]), 3]}
                                />
                            </bufferGeometry>
                            <lineBasicMaterial
                                color="#e8d8a8"
                                transparent
                                opacity={0.4}
                                depthWrite={false}
                            />
                        </line>
                    )
                })}
            </group>

            {/* ============ PLANETA ORBITANDO ============ */}
            <group ref={orbitRef}>
                <group rotation={[0, 0, tilt]} scale={size}>
                    <mesh
                        ref={planetRef}
                        onClick={(e) => {
                            e.stopPropagation()
                            const { focusedPlanet } = systemStore.getState()
                            systemStore.setFocusedPlanet(focusedPlanet === label ? null : label)
                        }}
                        onPointerOver={() => (document.body.style.cursor = 'pointer')}
                        onPointerOut={() => (document.body.style.cursor = '')}
                    >
                    </mesh>
                    {atmo && <Atmosphere color={atmo.color} intensity={atmo.intensity} />}
                    {kind === 'saturn' && <Rings />}
                </group>

                {/* ============ ETIQUETA FLOTANTE ============ */}
                {showLabels && (
                    <Html
                        center
                        distanceFactor={11}
                        position={[0, size + 0.35, 0]}
                        zIndexRange={[10, 0]}
                        style={{ pointerEvents: 'none', userSelect: 'none' }}
                    >
                        <div className={`planet-label ${isActive ? 'is-active' : ''}`}>
                            <span className="planet-label__dot" />
                            <span className="planet-label__text">{label}</span>
                        </div>
                    </Html>
                )}
            </group>
        </>
    )
}