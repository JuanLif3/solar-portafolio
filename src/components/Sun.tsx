import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Billboard } from '@react-three/drei'
import * as THREE from 'three'

/* ============================================================
 *  SUPERFICIE DEL SOL — plasma turbulento
 * ============================================================ */
const sunVert = /* glsl */ `
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

const sunFrag = /* glsl */ `
  uniform float uTime;
  varying vec3 vNormal;
  varying vec3 vViewDir;
  varying vec3 vPos;

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
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.03; a *= 0.5; }
    return v;
  }

  void main() {
    vec3 p = normalize(vPos);

    // Dos capas de turbulencia a diferentes escalas moviéndose.
    float n1 = fbm(p * 3.2 + vec3(uTime * 0.18, uTime * 0.06, 0.0));
    float n2 = fbm(p * 8.0 - vec3(uTime * 0.10, 0.0, uTime * 0.05));
    float turb = n1 * 0.65 + n2 * 0.35;

    // Paleta: rojo profundo → naranja → amarillo → blanco.
    vec3 cCool = vec3(0.85, 0.18, 0.02);
    vec3 cMid  = vec3(1.00, 0.48, 0.06);
    vec3 cHot  = vec3(1.00, 0.85, 0.32);
    vec3 cCore = vec3(1.00, 0.98, 0.90);

    vec3 col = mix(cCool, cMid, smoothstep(-0.35, 0.35, turb));
    col = mix(col, cHot,  smoothstep(0.15, 0.65, turb));
    col = mix(col, cCore, smoothstep(0.55, 0.95, turb));

    // Fresnel: borde más brillante.
    float fresnel = pow(1.0 - max(dot(vNormal, vViewDir), 0.0), 1.8);
    col += vec3(1.0, 0.55, 0.15) * fresnel * 1.4;

    // Pulso global sutil.
    col *= 1.0 + 0.05 * sin(uTime * 1.3);

    gl_FragColor = vec4(col, 1.0);
  }
`

/* ============================================================
 *  HALO RADIAL — billboard aditivo
 * ============================================================ */
const haloVert = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const haloFrag = /* glsl */ `
  uniform vec3  uColor;
  uniform float uIntensity;
  uniform float uPower;
  varying vec2  vUv;
  void main() {
    vec2 p = (vUv - 0.5) * 2.0;
    float d = length(p);
    float a = pow(max(1.0 - d, 0.0), uPower);
    gl_FragColor = vec4(uColor * a * uIntensity, a);
  }
`

export function Sun() {
    const sunUniforms = useMemo(() => ({ uTime: { value: 0 } }), [])

    const haloUniforms = useMemo(
        () => ({
            uColor:     { value: new THREE.Color('#ffb45a') },
            uIntensity: { value: 1.8 },
            uPower:     { value: 2.6 },
        }),
        [],
    )

    const coronaUniforms = useMemo(
        () => ({
            uColor:     { value: new THREE.Color('#ff7a3c') },
            uIntensity: { value: 0.9 },
            uPower:     { value: 3.4 },
        }),
        [],
    )

    const groupRef = useRef<THREE.Group>(null)

    useFrame((_, delta) => {
        sunUniforms.uTime.value += Math.min(delta, 0.05)
        if (groupRef.current) {
            groupRef.current.rotation.y += delta * 0.04
        }
    })

    return (
        <group>
            {/* Núcleo del sol */}
            <mesh>
                <sphereGeometry args={[1.5, 96, 96]} />
                <shaderMaterial
                    uniforms={sunUniforms}
                    vertexShader={sunVert}
                    fragmentShader={sunFrag}
                    toneMapped={false}
                />
            </mesh>

            {/* Halo brillante */}
            <Billboard>
                <mesh>
                    <planeGeometry args={[9, 9]} />
                    <shaderMaterial
                        uniforms={haloUniforms}
                        vertexShader={haloVert}
                        fragmentShader={haloFrag}
                        transparent
                        depthWrite={false}
                        blending={THREE.AdditiveBlending}
                        toneMapped={false}
                    />
                </mesh>
            </Billboard>

            {/* Corona mucho más amplia y suave */}
            <Billboard>
                <mesh>
                    <planeGeometry args={[18, 18]} />
                    <shaderMaterial
                        uniforms={coronaUniforms}
                        vertexShader={haloVert}
                        fragmentShader={haloFrag}
                        transparent
                        depthWrite={false}
                        blending={THREE.AdditiveBlending}
                        toneMapped={false}
                    />
                </mesh>
            </Billboard>

            {/* Luz que ilumina los planetas */}
            <pointLight
                position={[0, 0, 0]}
                intensity={2.4}
                decay={0}
                color="#fff2d0"
            />
        </group>
    )
}