import { useEffect, useRef } from 'react'
import './WarpOverlay.css'

export interface WarpOverlayProps {
    /** Duración total del salto en ms. */
    duration?: number
    /** Se llama al terminar (para desmontar el overlay). */
    onComplete?: () => void
}

type Phase = 'charge' | 'warp' | 'flash' | 'arrive'

interface Star {
    x: number      // -1 .. 1  (espacio normalizado)
    y: number      // -1 .. 1
    z: number      // profundidad: 1 = lejos, ~0 = pegado a la cámara
    pz: number     // z del frame anterior (para la estela)
    size: number
    bright: number
    warm: number   // 0 = azul hielo, >0 = blanco cálido
}

interface FrameState {
    speed: number
    intensity: number
    flash: number
    phase: Phase
}

const STAR_COUNT = 1600
const FAR_Z = 1
const NEAR_Z = 0.04

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v)
const lerp = (a: number, b: number, t: number) => a + (b - a) * t

/**
 * Curva maestra de la animación. Todo (velocidad, intensidad, flash, fase)
 * se deriva de un único progreso `p` en [0, 1]. Así la animación es
 * determinista, fácil de ajustar y no depende de timers paralelos.
 */
function computeState(p: number): FrameState {
    let speed: number
    let phase: Phase

    if (p < 0.22) {
        // Carga: las estrellas derivan despacio, "respirando"
        phase = 'charge'
        const k = p / 0.22
        speed = lerp(0.14, 0.34, k * k)
    } else if (p < 0.62) {
        // Aceleración: crecimiento exponencial de la velocidad
        phase = p < 0.30 ? 'charge' : 'warp'
        const k = (p - 0.22) / 0.40
        speed = lerp(0.34, 6.2, Math.pow(k, 2.4))
    } else if (p < 0.74) {
        // Pico: hipervelocidad
        phase = 'warp'
        const k = (p - 0.62) / 0.12
        speed = lerp(6.2, 9.0, k)
    } else if (p < 0.86) {
        // Flash blanco
        phase = 'flash'
        const k = (p - 0.74) / 0.12
        speed = lerp(9.0, 2.6, Math.pow(k, 0.7))
    } else {
        // Llegada: frenado suave
        phase = 'arrive'
        const k = (p - 0.86) / 0.14
        speed = lerp(2.6, 0.14, 1 - Math.pow(1 - k, 3))
    }

    let intensity: number
    if (p < 0.62) intensity = Math.pow(p / 0.62, 2.2)
    else if (p < 0.8) intensity = 1
    else intensity = Math.pow(clamp01(1 - (p - 0.8) / 0.2), 1.5)

    let flash = 0
    if (p > 0.64 && p <= 0.74) {
        flash = Math.pow((p - 0.64) / 0.1, 2) * 0.3
    } else if (p > 0.74 && p <= 0.8) {
        flash = lerp(0.3, 1, Math.pow((p - 0.74) / 0.06, 0.5))
    } else if (p > 0.8 && p <= 0.97) {
        flash = Math.pow(1 - (p - 0.8) / 0.17, 1.6)
    }

    return { speed, intensity: clamp01(intensity), flash: clamp01(flash), phase }
}

export function WarpOverlay({ duration = 3400, onComplete }: WarpOverlayProps) {
    const rootRef = useRef<HTMLDivElement | null>(null)
    const stageRef = useRef<HTMLDivElement | null>(null)
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const flashRef = useRef<HTMLDivElement | null>(null)
    const completeRef = useRef(onComplete)

    useEffect(() => {
        completeRef.current = onComplete
    }, [onComplete])

    useEffect(() => {
        const root = rootRef.current
        const stage = stageRef.current
        const canvas = canvasRef.current
        const flash = flashRef.current
        if (!root || !stage || !canvas || !flash) return

        const ctx = canvas.getContext('2d', { alpha: false })
        if (!ctx) return

        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        const total = reduceMotion ? Math.min(duration, 900) : duration

        let width = 0
        let height = 0
        let halfW = 0
        let halfH = 0
        let glowGrad: CanvasGradient | null = null

        const stars: Star[] = []

        const resetStar = (s: Star, spread: boolean) => {
            s.x = Math.random() * 2 - 1
            s.y = Math.random() * 2 - 1
            s.z = spread ? NEAR_Z + Math.random() * (FAR_Z - NEAR_Z) : FAR_Z
            s.pz = s.z
            s.size = 0.5 + Math.random() * 1.5
            s.bright = 0.55 + Math.random() * 0.45
            s.warm = Math.random() < 0.12 ? Math.random() : 0
        }

        for (let i = 0; i < STAR_COUNT; i++) {
            const s: Star = { x: 0, y: 0, z: FAR_Z, pz: FAR_Z, size: 1, bright: 1, warm: 0 }
            resetStar(s, true)
            stars.push(s)
        }

        const resize = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2)
            width = Math.max(1, canvas.offsetWidth)
            height = Math.max(1, canvas.offsetHeight)
            canvas.width = Math.floor(width * dpr)
            canvas.height = Math.floor(height * dpr)
            halfW = width / 2
            halfH = height / 2
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
            ctx.fillStyle = '#000'
            ctx.fillRect(0, 0, width, height)

            // Núcleo luminoso central (se reutiliza cada frame)
            glowGrad = ctx.createRadialGradient(
                halfW, halfH, 0,
                halfW, halfH, Math.hypot(halfW, halfH) * 0.85,
            )
            glowGrad.addColorStop(0, 'rgba(150, 200, 255, 0.65)')
            glowGrad.addColorStop(0.25, 'rgba(80, 140, 255, 0.22)')
            glowGrad.addColorStop(0.60, 'rgba(30, 60, 180, 0.06)')
            glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)')
        }

        resize()

        const ro = new ResizeObserver(resize)
        ro.observe(stage)

        const startTime = performance.now()
        let lastTime = startTime
        let rafId = 0
        let finished = false
        let lastIntensity = ''
        let lastPhase = ''
        let lastFlash = ''

        const frame = (now: number) => {
            const dt = Math.min((now - lastTime) / 1000, 1 / 30)
            lastTime = now

            const p = clamp01((now - startTime) / total)
            const st = computeState(p)

            // ---------- Motion blur: desvanecer el frame anterior ----------
            const fade = lerp(0.52, 0.20, st.intensity)
            ctx.globalCompositeOperation = 'source-over'
            ctx.fillStyle = `rgba(0, 0, 0, ${fade})`
            ctx.fillRect(0, 0, width, height)

            ctx.globalCompositeOperation = 'lighter'
            ctx.lineCap = 'round'

            const dz = st.speed * dt
            const lwScale = 0.7 + st.intensity * 1.6

            // ---------- Estrellas ----------
            for (let i = 0; i < stars.length; i++) {
                const s = stars[i]
                s.pz = s.z
                s.z -= dz

                if (s.z <= NEAR_Z) {
                    resetStar(s, false)
                    continue
                }

                // Proyección perspectiva: pantalla = centro + (x / z) * mitad
                const px = halfW + (s.x * halfW) / s.pz
                const py = halfH + (s.y * halfH) / s.pz

                // Rechazo rápido: si el punto anterior ya está fuera, la
                // estela (que va radialmente hacia fuera) también lo estará.
                if (px < -80 || px > width + 80 || py < -80 || py > height + 80) continue

                const sx = halfW + (s.x * halfW) / s.z
                const sy = halfH + (s.y * halfH) / s.z

                const depth = 1 - s.z
                const appear = Math.min(1, depth * 9) // fade-in al entrar en escena
                const alpha = (0.35 + 0.65 * depth) * appear * s.bright

                const r = Math.round(165 + 90 * depth + s.warm * 60)
                const g = Math.round(200 + 55 * depth + s.warm * 20)
                const b = Math.round(255 - s.warm * 70)

                ctx.strokeStyle = `rgba(${r},${g},${b},${alpha.toFixed(3)})`
                ctx.lineWidth = s.size * (0.5 + depth * 0.9) * lwScale
                ctx.beginPath()
                ctx.moveTo(px, py)
                ctx.lineTo(sx, sy)
                ctx.stroke()
            }

            // ---------- Núcleo luminoso ----------
            if (glowGrad) {
                ctx.globalAlpha = st.intensity * 0.55
                ctx.fillStyle = glowGrad
                ctx.fillRect(0, 0, width, height)
                ctx.globalAlpha = 1
            }

            // ---------- Sincronizar capas CSS ----------
            const iStr = st.intensity.toFixed(2)
            if (iStr !== lastIntensity) {
                root.style.setProperty('--warp', iStr)
                lastIntensity = iStr
            }
            if (st.phase !== lastPhase) {
                root.dataset.phase = st.phase
                lastPhase = st.phase
            }
            const fStr = st.flash.toFixed(3)
            if (fStr !== lastFlash) {
                flash.style.opacity = fStr
                lastFlash = fStr
            }

            const rootOpacity = p < 0.88 ? 1 : 1 - (p - 0.88) / 0.12
            root.style.opacity = rootOpacity.toFixed(3)

            if (p >= 1) {
                if (!finished) {
                    finished = true
                    completeRef.current?.()
                }
                return
            }
            rafId = requestAnimationFrame(frame)
        }

        rafId = requestAnimationFrame(frame)

        return () => {
            cancelAnimationFrame(rafId)
            ro.disconnect()
        }
    }, [duration])

    return (
        <div className="warp" ref={rootRef} data-phase="charge" aria-hidden="true">
            <div className="warp__stage" ref={stageRef}>
                <canvas className="warp__canvas" ref={canvasRef} />
            </div>
            <div className="warp__bloom" />
            <div className="warp__vignette" />
            <div className="warp__noise" />
            <div className="warp__flash" ref={flashRef} />
        </div>
    )
}