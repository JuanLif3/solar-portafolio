import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

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
}

/* ============================================================
 *  SHADER COMÚN — vertex
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
 *  UTILIDADES DE RUIDO — compartidas por todos los shaders
 * ============================================================ */
const noiseChunk = /* glsl */ `
  vec3 hash33(vec3 p) {
    p = vec3(
      dot(p, vec3(127.1, 311.7, 74.7)),
      dot(p, vec3(269.5, 183.3, 246.1)),
      dot(p, vec3(113.5, 271.9, 124.6))
    );
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
  }
  float noise(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    vec3 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(mix(dot(hash33(i+vec3(0,0,0)), f-vec3(0,0,0)),
              dot(hash33(i+vec3(1,0,0)), f-vec3(1,0,0)), u.x),
          mix(dot(hash33(i+vec3(0,1,0)), f-vec3(0,1,0)),
              dot(hash33(i+vec3(1,1,0)), f-vec3(1,1,0)), u.x), u.y),
      mix(mix(dot(hash33(i+vec3(0,0,1)), f-vec3(0,0,1)),
              dot(hash33(i+vec3(1,0,1)), f-vec3(1,0,1)), u.x),
          mix(dot(hash33(i+vec3(0,1,1)), f-vec3(0,1,1)),
              dot(hash33(i+vec3(1,1,1)), f-vec3(1,1,1)), u.x), u.y),
      u.z);
  }
  float fbm(vec3 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p *= 2.03;
      a *= 0.5;
    }
    return v;
  }
`

/* ============================================================
 *  SHADER DE PLANETA — todo en un solo fragment con ramas por tipo
 * ============================================================ */
const planetFrag = /* glsl */ `
  uniform float uTime;
  uniform int   uKind;      // 0..7
  uniform vec3  uLightDir;

  varying vec3 vNormal;
  varying vec3 vViewDir;
  varying vec3 vPos;

  ${noiseChunk}

  /* ---------- ROCOSO (Mercurio) ---------- */
  vec3 rocky(vec3 p, float t, vec3 c1, vec3 c2, vec3 c3, float craterStrength) {
    float n = fbm(p * 3.2);
    float craters = fbm(p * 12.0 + vec3(t * 0.03));
    float big = fbm(p * 1.5);
    float v = n * 0.5 + 0.5;
    vec3 col = mix(c1, c2, smoothstep(0.3, 0.7, v));
    col = mix(col, c3, smoothstep(0.6, 0.95, v));
    // Cráteres (oscuridad en huecos).
    col *= 1.0 - smoothstep(0.55, 1.0, craters) * craterStrength;
    // Variación a gran escala (manchas claras/oscuras).
    col *= 0.85 + big * 0.4;
    return col;
  }

  /* ---------- GASEOSO CON BANDAS ---------- */
  vec3 gasBands(vec3 p, float t, vec3 cA, vec3 cB, vec3 cC, vec3 cHot, float bandFreq) {
    float lat = p.y;
    // Turbulencia que distorsiona las bandas.
    float turb = fbm(p * 2.5 + vec3(t * 0.05, 0.0, 0.0));
    float bands = sin(lat * bandFreq + turb * 3.2) * 0.5 + 0.5;
    // Bandas más nítidas donde hay más turbulencia.
    bands = pow(bands, 0.85);

    vec3 col = mix(cA, cB, bands);
    col = mix(col, cC, smoothstep(0.55, 0.95, bands * (0.6 + turb * 0.6)));
    // Bandas finas brillantes.
    float thin = sin(lat * bandFreq * 2.4 + turb * 5.0) * 0.5 + 0.5;
    col += cHot * pow(thin, 6.0) * 0.35;
    return col;
  }

  /* ---------- TIPO TIERRA ---------- */
  vec3 earthLike(vec3 p, float t) {
    float lat = p.y;
    // Continentes (ruido grande).
    float continents = fbm(p * 1.8 + vec3(t * 0.008, 0.0, 0.0));
    float continents2 = fbm(p * 4.5 + vec3(t * 0.01, 0.0, 0.0));
    float landMask = smoothstep(-0.05, 0.15, continents + continents2 * 0.3);

    // Océano.
    vec3 oceanDeep = vec3(0.02, 0.08, 0.25);
    vec3 oceanShallow = vec3(0.05, 0.25, 0.55);
    vec3 ocean = mix(oceanDeep, oceanShallow, smoothstep(-0.4, 0.15, continents));

    // Tierra.
    vec3 landDark = vec3(0.18, 0.30, 0.12);
    vec3 landMid = vec3(0.35, 0.48, 0.22);
    vec3 desert = vec3(0.72, 0.58, 0.32);
    vec3 land = mix(landDark, landMid, smoothstep(0.0, 0.5, continents2));
    land = mix(land, desert, smoothstep(0.4, 0.7, continents2));

    vec3 col = mix(ocean, land, landMask);

    // Casquetes polares.
    float polar = smoothstep(0.72, 0.95, abs(lat));
    col = mix(col, vec3(0.95, 0.96, 1.0), polar);

    // Nubes.
    float clouds = fbm(p * 4.0 + vec3(t * 0.02, 0.0, 0.0));
    float cloudMask = smoothstep(0.15, 0.55, clouds);
    col = mix(col, vec3(1.0), cloudMask * 0.65);

    return col;
  }

  /* ---------- MARTE ---------- */
  vec3 mars(vec3 p, float t) {
    float lat = p.y;
    float n = fbm(p * 3.0 + vec3(t * 0.005, 0.0, 0.0));
    float big = fbm(p * 1.2);

    vec3 c1 = vec3(0.45, 0.18, 0.10);
    vec3 c2 = vec3(0.72, 0.32, 0.16);
    vec3 c3 = vec3(0.90, 0.55, 0.30);

    vec3 col = mix(c1, c2, smoothstep(-0.3, 0.3, n));
    col = mix(col, c3, smoothstep(0.3, 0.75, n));
    col *= 0.85 + big * 0.3;

    // Casquetes polares.
    float polar = smoothstep(0.78, 0.96, abs(lat));
    col = mix(col, vec3(0.92, 0.94, 1.0), polar);

    return col;
  }

  /* ---------- VENUS ---------- */
  vec3 venus(vec3 p, float t) {
    float turb = fbm(p * 2.0 + vec3(t * 0.02, 0.0, 0.0));
    float turb2 = fbm(p * 5.0 - vec3(t * 0.015, 0.0, 0.0));
    float v = turb * 0.6 + turb2 * 0.4;

    vec3 c1 = vec3(0.75, 0.55, 0.20);
    vec3 c2 = vec3(0.95, 0.78, 0.42);
    vec3 c3 = vec3(1.00, 0.92, 0.68);

    vec3 col = mix(c1, c2, smoothstep(-0.3, 0.4, v));
    col = mix(col, c3, smoothstep(0.4, 0.85, v));
    return col;
  }

  /* ---------- JÚPITER ---------- */
  vec3 jupiter(vec3 p, float t) {
    vec3 cA = vec3(0.55, 0.32, 0.18);
    vec3 cB = vec3(0.90, 0.72, 0.50);
    vec3 cC = vec3(0.98, 0.88, 0.70);
    vec3 cHot = vec3(1.0, 0.92, 0.78);
    vec3 col = gasBands(p, t, cA, cB, cC, cHot, 22.0);

    // Gran Mancha Roja
    vec3 stormCenter = normalize(vec3(0.55, -0.35, 0.75));
    float d = distance(p, stormCenter);
    float storm = smoothstep(0.32, 0.16, d);
    float stormTurb = fbm(p * 8.0 + vec3(t * 0.1));
    col = mix(col, vec3(0.70, 0.25, 0.15) * (0.8 + stormTurb * 0.4), storm * 0.85);

    return col;
  }

  /* ---------- SATURNO ---------- */
  vec3 saturn(vec3 p, float t) {
    vec3 cA = vec3(0.70, 0.55, 0.30);
    vec3 cB = vec3(0.92, 0.82, 0.60);
    vec3 cC = vec3(1.0, 0.95, 0.78);
    vec3 cHot = vec3(1.0, 0.98, 0.90);
    return gasBands(p, t, cA, cB, cC, cHot, 18.0);
  }

  /* ---------- URANO ---------- */
  vec3 uranus(vec3 p, float t) {
    vec3 cA = vec3(0.35, 0.72, 0.78);
    vec3 cB = vec3(0.60, 0.88, 0.92);
    vec3 cC = vec3(0.78, 0.95, 0.98);
    vec3 cHot = vec3(0.92, 1.0, 1.0);
    return gasBands(p, t, cA, cB, cC, cHot, 12.0);
  }

  /* ---------- NEPTUNO ---------- */
  vec3 neptune(vec3 p, float t) {
    vec3 cA = vec3(0.10, 0.18, 0.55);
    vec3 cB = vec3(0.22, 0.35, 0.78);
    vec3 cC = vec3(0.42, 0.55, 0.92);
    vec3 cHot = vec3(0.75, 0.85, 1.0);
    vec3 col = gasBands(p, t, cA, cB, cC, cHot, 14.0);

    // Mancha oscura.
    vec3 stormCenter = normalize(vec3(-0.4, 0.2, 0.85));
    float d = distance(p, stormCenter);
    float storm = smoothstep(0.35, 0.12, d);
    col = mix(col, vec3(0.05, 0.08, 0.28), storm * 0.7);

    return col;
  }

  void main() {
    vec3 p = normalize(vPos);

    vec3 col;
    if (uKind == 0) col = rocky(p, uTime, vec3(0.20,0.18,0.16), vec3(0.55,0.50,0.45), vec3(0.78,0.72,0.65), 0.7);
    else if (uKind == 1) col = venus(p, uTime);
    else if (uKind == 2) col = earthLike(p, uTime);
    else if (uKind == 3) col = mars(p, uTime);
    else if (uKind == 4) col = jupiter(p, uTime);
    else if (uKind == 5) col = saturn(p, uTime);
    else if (uKind == 6) col = uranus(p, uTime);
    else                 col = neptune(p, uTime);

    // ---------- Iluminación con la luz del sol ----------
    vec3 n = normalize(vNormal);
    vec3 L = normalize(uLightDir);
    float ndl = max(dot(n, L), 0.0);

    // Sombra nocturna: lado oscuro no es 100% negro, tiene algo de ambiente.
    float light = 0.06 + ndl * 1.05;
    col *= light;

    // Rim sutil del lado iluminado.
    float fresnel = pow(1.0 - max(dot(n, normalize(vViewDir)), 0.0), 3.5);
    col += vec3(0.5, 0.65, 1.0) * fresnel * ndl * 0.35;

    gl_FragColor = vec4(col, 1.0);
  }
`

/* ============================================================
 *  ATMÓSFERA — esfera ligeramente más grande, fresnel
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
    float f = pow(1.0 - max(dot(vNormal, vViewDir), 0.0), 3.0);
    gl_FragColor = vec4(uColor, f * uIntensity);
  }
`

function Atmosphere({ color, intensity = 0.9 }: { color: string; intensity?: number }) {
    const uniforms = useMemo(
        () => ({
            uColor: { value: new THREE.Color(color) },
            uIntensity: { value: intensity },
        }),
        [color, intensity],
    )
    return (
        <mesh scale={1.14}>
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
 *  ANILLOS DE SATURNO — shader con divisiones tipo Cassini
 * ============================================================ */
const ringVert = /* glsl */ `
  varying vec3 vLocal;
  void main() {
    vLocal = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const ringFrag = /* glsl */ `
  uniform float uInner;
  uniform float uOuter;
  varying vec3 vLocal;

  float hash(float n) { return fract(sin(n) * 43758.5453); }

  void main() {
    float r = length(vLocal.xy);
    float t = clamp((r - uInner) / (uOuter - uInner), 0.0, 1.0);

    // Bandas anchas.
    float band1 = smoothstep(0.02, 0.10, t) * smoothstep(0.98, 0.90, t);

    // Divisiones tipo Cassini.
    float gap1 = smoothstep(0.38, 0.41, t) * smoothstep(0.45, 0.42, t);
    float gap2 = smoothstep(0.66, 0.69, t) * smoothstep(0.74, 0.71, t);
    float gap3 = smoothstep(0.85, 0.87, t) * smoothstep(0.90, 0.88, t);

    float density = band1 * (1.0 - gap1 * 0.95) * (1.0 - gap2 * 0.6) * (1.0 - gap3 * 0.4);

    // Variación fina.
    float fine = 0.7 + 0.3 * hash(floor(t * 320.0));

    vec3 col = mix(vec3(0.80, 0.72, 0.55), vec3(0.98, 0.92, 0.78), fine);

    // Suavizado de bordes.
    density *= smoothstep(0.0, 0.06, t) * smoothstep(1.0, 0.94, t);

    float alpha = density * fine * 0.85;
    gl_FragColor = vec4(col, alpha);
  }
`

function Rings({ inner, outer }: { inner: number; outer: number }) {
    const uniforms = useMemo(
        () => ({ uInner: { value: inner }, uOuter: { value: outer } }),
        [inner, outer],
    )
    return (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[inner, outer, 200, 1]} />
            <shaderMaterial
                uniforms={uniforms}
                vertexShader={ringVert}
                fragmentShader={ringFrag}
                transparent
                depthWrite={false}
                side={THREE.DoubleSide}
            />
        </mesh>
    )
}

/* ============================================================
 *  MAPA DE KIND → ÍNDICE DEL SHADER
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

/* ============================================================
 *  ATMÓSFERA — color por tipo
 * ============================================================ */
const ATMO_COLOR: Partial<Record<PlanetKind, { color: string; intensity: number }>> = {
    venus:   { color: '#f5c060', intensity: 1.1 },
    earth:   { color: '#6ea8ff', intensity: 1.3 },
    mars:    { color: '#ff9860', intensity: 0.5 },
    jupiter: { color: '#e8c090', intensity: 0.75 },
    saturn:  { color: '#f0d8a0', intensity: 0.7 },
    uranus:  { color: '#7ae0e0', intensity: 0.85 },
    neptune: { color: '#5a7ae0', intensity: 0.95 },
}

/* ============================================================
 *  COMPONENTE
 * ============================================================ */
export function Planet({ kind, distance, size, speed, tilt = 0 }: PlanetConfig) {
    const orbitRef = useRef<THREE.Group>(null)
    const planetRef = useRef<THREE.Mesh>(null)
    const angleRef = useRef(Math.random() * Math.PI * 2)

    // La luz viene del sol (en 0,0,0), así que para cada planeta en
    // órbita la dirección hacia el sol es -normalize(posPlaneta).
    // Pero como usamos un shader con uLightDir constante en espacio
    // del planeta, pasamos esa dirección desde el padre. Aquí usamos
    // una dirección fija que da buena iluminación a todos.
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
            planetRef.current.rotation.y += d * 0.35
        }

        uniforms.uTime.value += d
    })

    const atmo = ATMO_COLOR[kind]

    return (
        <>
            {/* ============ ÓRBITA ============ */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.002, 0]}>
                <ringGeometry args={[distance - 0.18, distance + 0.18, 220]} />
                <meshBasicMaterial
                    color="#c9b88a"
                    transparent
                    opacity={0.055}
                    side={THREE.DoubleSide}
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                />
            </mesh>

            <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[distance - 0.014, distance + 0.014, 240]} />
                <meshBasicMaterial
                    color="#e8d8a8"
                    transparent
                    opacity={0.55}
                    side={THREE.DoubleSide}
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                />
            </mesh>

            {Array.from({ length: 24 }).map((_, i) => {
                const angle = (i / 24) * Math.PI * 2
                const tickLen = i % 6 === 0 ? 0.14 : 0.06
                const x1 = Math.cos(angle) * (distance - 0.02)
                const z1 = Math.sin(angle) * (distance - 0.02)
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
                            opacity={0.5}
                            depthWrite={false}
                        />
                    </line>
                )
            })}

            {/* ============ PLANETA ORBITANDO ============ */}
            <group ref={orbitRef}>
                <group rotation={[0, 0, tilt]} scale={size}>
                    {/* Esfera del planeta con shader propio */}
                    <mesh ref={planetRef}>
                        <sphereGeometry args={[1, 64, 64]} />
                        <shaderMaterial
                            uniforms={uniforms}
                            vertexShader={planetVert}
                            fragmentShader={planetFrag}
                            toneMapped={false}
                        />
                    </mesh>

                    {/* Atmósfera si aplica */}
                    {atmo && <Atmosphere color={atmo.color} intensity={atmo.intensity} />}

                    {/* Anillos de Saturno */}
                    {kind === 'saturn' && (
                        <group rotation={[Math.PI / 2 - 0.4, 0, 0]}>
                            <Rings inner={1.4} outer={2.4} />
                        </group>
                    )}
                </group>
            </group>
        </>
    )
}