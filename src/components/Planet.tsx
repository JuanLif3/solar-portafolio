import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Html } from '@react-three/drei'

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

/* ============================================================
 *  VERTEX — compartido
 * ============================================================ */
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
 *  Sin ruido pesado, solo gradientes suaves de gran escala.
 * ============================================================ */
const planetFrag = /* glsl */ `
  uniform float uTime;
  uniform int   uKind;
  uniform vec3  uLightDir;

  varying vec3 vNormal;
  varying vec3 vViewDir;
  varying vec3 vPos;

  // Ruido suave solo para dar variación sutil (no texturas detalladas).
  float softNoise(vec3 p) {
    float s = sin(p.x * 2.1) * cos(p.y * 1.7) * sin(p.z * 2.3);
    float s2 = sin(p.x * 4.7 + 1.3) * cos(p.y * 3.9 + 0.7);
    return s * 0.6 + s2 * 0.4;
  }

  /* ---------- Bandas suaves para gigantes gaseosos ---------- */
  vec3 gasMinimal(vec3 p, float freq, vec3 c1, vec3 c2, vec3 c3) {
    float lat = p.y;
    float bands = sin(lat * freq) * 0.5 + 0.5;
    // Segunda capa de bandas desplazadas.
    float bands2 = sin(lat * freq * 1.9 + 1.2) * 0.5 + 0.5;

    vec3 col = mix(c1, c2, smoothstep(0.15, 0.85, bands));
    col = mix(col, c3, smoothstep(0.6, 0.95, bands2) * 0.5);
    return col;
  }

  void main() {
    vec3 p = normalize(vPos);

    // ------------------- COLOR BASE POR TIPO -------------------
    vec3 col;

    if (uKind == 0) {
      // MERCURIO — gris piedra con leve gradiente
      float v = softNoise(p * 3.0) * 0.15 + 0.5;
      col = mix(vec3(0.32, 0.30, 0.29), vec3(0.55, 0.52, 0.49), v);
    }
    else if (uKind == 1) {
      // VENUS — amarillo pálido con bandas muy suaves
      float v = sin(p.y * 5.0) * 0.5 + 0.5;
      col = mix(vec3(0.78, 0.62, 0.35), vec3(0.95, 0.85, 0.60), v);
    }
    else if (uKind == 2) {
      // TIERRA — océano + continentes estilizados (sin nubes ni detalle)
      float landNoise = softNoise(p * 2.2);
      float landMask = smoothstep(0.05, 0.35, landNoise);
      vec3 ocean = mix(vec3(0.10, 0.22, 0.45), vec3(0.16, 0.35, 0.62), p.y * 0.5 + 0.5);
      vec3 land = mix(vec3(0.28, 0.42, 0.24), vec3(0.55, 0.58, 0.32), p.y * 0.5 + 0.5);
      col = mix(ocean, land, landMask);
      // Casquetes polares limpios.
      float polar = smoothstep(0.75, 0.95, abs(p.y));
      col = mix(col, vec3(0.92, 0.95, 1.0), polar);
    }
    else if (uKind == 3) {
      // MARTE — rojo óxido plano con variación mínima
      float v = softNoise(p * 2.5) * 0.15 + 0.5;
      col = mix(vec3(0.55, 0.28, 0.18), vec3(0.80, 0.44, 0.28), v);
      float polar = smoothstep(0.82, 0.98, abs(p.y));
      col = mix(col, vec3(0.90, 0.92, 0.96), polar);
    }
    else if (uKind == 4) {
      // JÚPITER — bandas marrón/crema limpias
      col = gasMinimal(p, 16.0,
        vec3(0.55, 0.40, 0.28),
        vec3(0.85, 0.72, 0.55),
        vec3(0.96, 0.90, 0.78)
      );
    }
    else if (uKind == 5) {
      // SATURNO — bandas doradas suaves
      col = gasMinimal(p, 13.0,
        vec3(0.70, 0.58, 0.38),
        vec3(0.88, 0.80, 0.62),
        vec3(0.96, 0.92, 0.80)
      );
    }
    else if (uKind == 6) {
      // URANO — cian pálido casi uniforme
      col = gasMinimal(p, 8.0,
        vec3(0.55, 0.82, 0.85),
        vec3(0.72, 0.92, 0.94),
        vec3(0.85, 0.96, 0.97)
      );
    }
    else {
      // NEPTUNO — azul profundo
      col = gasMinimal(p, 10.0,
        vec3(0.18, 0.28, 0.62),
        vec3(0.32, 0.45, 0.82),
        vec3(0.55, 0.68, 0.92)
      );
    }

    // ------------------- ILUMINACIÓN LIMPIA -------------------
    vec3 n = normalize(vNormal);
    vec3 L = normalize(uLightDir);
    float ndl = max(dot(n, L), 0.0);

    // Terminador suave: día claro, noche con apenas ambiente.
    float dayNight = smoothstep(-0.05, 0.35, ndl);

    vec3 nightColor = col * 0.12;              // ambiente mínimo
    vec3 dayColor = col * (0.85 + ndl * 0.35); // sol directo
    col = mix(nightColor, dayColor, dayNight);

    // Rim light fino, solo del lado iluminado.
    float fresnel = pow(1.0 - max(dot(n, normalize(vViewDir)), 0.0), 4.0);
    col += vec3(0.85, 0.90, 1.0) * fresnel * ndl * 0.45;

    gl_FragColor = vec4(col, 1.0);
  }
`

/* ============================================================
 *  ATMÓSFERA — fina y sutil
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
 *  ANILLOS DE SATURNO — finos, minimalistas
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
            {/* Anillo principal */}
            <mesh material={ringMat}>
                <ringGeometry args={[1.45, 2.25, 128]} />
            </mesh>
            {/* Anillo exterior tenue */}
            <mesh material={innerRingMat}>
                <ringGeometry args={[2.35, 2.55, 128]} />
            </mesh>
        </group>
    )
}

/* ============================================================
 *  MAPAS POR TIPO
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
 *  COMPONENTE
 * ============================================================ */
export function Planet({ kind, distance, size, speed, tilt = 0, label }: PlanetConfig) {
    const orbitRef = useRef<THREE.Group>(null)
    const planetRef = useRef<THREE.Mesh>(null)
    const angleRef = useRef(Math.random() * Math.PI * 2)

    const uniforms = useMemo(
        () => ({
            uTime: { value: 0 },
            uKind: { value: KIND_INDEX[kind] },
            uLightDir: { value: new THREE.Vector3(1, 0.25, 0.5).normalize() },
        }),
        [kind],
    )

    useFrame((_, delta) => {
        const d = Math.min(delta, 0.05)
        angleRef.current += d * speed

        if (orbitRef.current) {
            orbitRef.current.position.x = Math.cos(angleRef.current) * distance
            orbitRef.current.position.z = Math.sin(angleRef.current) * distance
        }

        if (planetRef.current) {
            planetRef.current.rotation.y += d * 0.3
        }

        uniforms.uTime.value += d
    })

    const atmo = ATMO[kind]

    return (
        <>
            {/* ============ ÓRBITA ============ */}
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

            {/* ============ PLANETA ORBITANDO ============ */}
            <group ref={orbitRef}>
                <group rotation={[0, 0, tilt]} scale={size}>
                    <mesh ref={planetRef}>
                        <sphereGeometry args={[1, 64, 64]} />
                        <shaderMaterial
                            uniforms={uniforms}
                            vertexShader={planetVert}
                            fragmentShader={planetFrag}
                            toneMapped={false}
                        />
                    </mesh>
                    {atmo && <Atmosphere color={atmo.color} intensity={atmo.intensity} />}
                    {kind === 'saturn' && <Rings />}
                </group>

                <Html
                    center
                    distanceFactor={11}
                    position={[0, size + 0.35, 0]}
                    zIndexRange={[10, 0]}
                    style={{ pointerEvents: 'none', userSelect: 'none' }}
                >
                    <div className="planet-label">
                        <span className="planet-label__dot" />
                        <span className="planet-label__text">{label}</span>
                    </div>
                </Html>
            </group>
        </>
    )
}