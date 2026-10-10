import { useEffect, useMemo, useRef, useState } from 'react'
import { systemStore, useSystemState } from '../store/system'
import '../styles/PlanetReadout.css'

type Telemetry = { label: string; value: string }

type Info = {
    index: string
    title: string
    subtitle: string
    description: string
    bullets: string[]
    telemetry: Telemetry[]
    route?: string
    routeLabel?: string
}

const SECTION_INFO: Record<string, Info> = {
    '01 · Inicio': {
        index: '01',
        title: 'Inicio',
        subtitle: 'El punto de partida',
        description:
            'Un portafolio interactivo construido como un sistema solar en constante movimiento, donde cada cuerpo representa una parte de mi trabajo. Arrastra para explorar, haz clic en cualquier planeta para decodificar su señal.',
        bullets: ['Portafolio interactivo', 'Diseño 3D en tiempo real', 'Navegación orbital'],
        telemetry: [
            { label: 'MASA',          value: '3.30 ×10²³ kg' },
            { label: 'DIÁMETRO',      value: '4 879 km' },
            { label: 'ÓRBITA',        value: '88 días' },
            { label: 'SEÑAL',         value: '−38 dBm' },
            { label: 'INCLINACIÓN',   value: '7.0°' },
            { label: 'EXCENTRICIDAD', value: '0.206' },
        ],
    },
    '02 · Sobre mí': {
        index: '02',
        title: 'Sobre mí',
        subtitle: 'Quién está detrás',
        description:
            'Desarrollador en formación, enfocado en el ecosistema TypeScript: React, Next.js y NestJS. Técnico en Programación y Análisis de Sistemas, con tres proyectos reales desplegados en producción. Me interesa la ciberseguridad, investigar cada detalle y usar la IA como herramienta, no como muleta.',
        bullets: ['Técnico en Programación', 'TypeScript · React · Next', 'Aprendiendo ciberseguridad'],
        telemetry: [
            { label: 'TÍTULO',      value: 'Téc. Programación' },
            { label: 'ENFOQUE',     value: 'Full Stack TS' },
            { label: 'PROYECTOS',   value: '03 desplegados' },
            { label: 'IDIOMAS',     value: 'ES · EN técnico' },
            { label: 'UBICACIÓN',   value: 'Chile' },
            { label: 'DISPONIBLE',  value: 'Sí' },
        ],
    },
    '03 · Proyectos': {
        index: '03',
        title: 'Proyectos',
        subtitle: 'Lo que he construido',
        description:
            'Tres aplicaciones web reales, desplegadas y funcionales: un gestor de contraseñas con cifrado zero-knowledge, un sistema de finanzas para una junta de vecinos y una app de mensajería en desarrollo. Todo construido con TypeScript, React y Node.js.',
        bullets: ['Gestor zero-knowledge', 'Finanzas Villa', 'Mensajería Bletchley'],
        telemetry: [
            { label: 'TOTAL',    value: '03 proyectos' },
            { label: 'EN LÍNEA', value: '02 activos' },
            { label: 'EN CURSO', value: '01 desarrollo' },
            { label: 'STACK',    value: 'React · Node' },
            { label: 'DEPLOY',   value: 'Vercel' },
            { label: 'DB',       value: 'PostgreSQL · Neon' },
        ],
        route: '/proyectos',
        routeLabel: 'Ver proyectos',
    },
    '04 · Experiencia': {
        index: '04',
        title: 'Trayectoria',
        subtitle: 'De dónde vengo',
        description:
            'Aún sin experiencia formal en el rubro tech, pero con un historial laboral variado que forjó disciplina y trato con personas: jefe de aseo en Mall Vivo, reponedor en Alvi, atención al cliente en Falabella, líder promotor, trabajo en almacén de barrio y aseo general. Cada trabajo enseñó algo distinto sobre responsabilidad, orden y esfuerzo.',
        bullets: ['Jefe de aseo · Mall Vivo', 'Reponedor · Alvi', 'Retail y atención · Falabella'],
        telemetry: [
            { label: 'RUBRO ACTUAL', value: 'Aprendiendo dev' },
            { label: 'TRABAJOS',     value: '06+ experiencias' },
            { label: 'SOFT SKILLS',  value: 'Liderazgo · Orden' },
            { label: 'BUSCO',        value: 'Primer empleo TI' },
            { label: 'MODALIDAD',    value: 'Remoto · Híbrido' },
            { label: 'INGLÉS',       value: 'Lectura técnica' },
        ],
    },
    '05 · Stack': {
        index: '05',
        title: 'Stack',
        subtitle: 'Con qué trabajo',
        description:
            'Mi stack principal gira en torno a TypeScript: React y Next.js en el frontend, NestJS y Node.js en el backend. Uso Vercel para deploy, Neon (PostgreSQL) como base de datos, y sigo profundizando en ciberseguridad por interés personal.',
        bullets: ['TypeScript', 'React · Next.js', 'NestJS · Node.js', 'PostgreSQL · Neon', 'Vercel', 'Git · GitHub'],
        telemetry: [
            { label: 'LENGUAJES',  value: 'TS · JS · Java' },
            { label: 'FRONTEND',   value: 'React · Next' },
            { label: 'BACKEND',    value: 'NestJS · Node' },
            { label: 'DATOS',      value: 'PostgreSQL · Neon' },
            { label: 'DEPLOY',     value: 'Vercel' },
            { label: 'IDE',        value: 'IntelliJ IDEA' },
        ],
    },
    '06 · Power BI': {
        index: '06',
        title: 'Power BI',
        subtitle: 'Proyecto académico ISI802',
        description:
            'Dashboard desarrollado como parte del Trabajo Integrador de la asignatura Business Intelligence (ISI802). Análisis de vulnerabilidad territorial de la Región de O\'Higgins con modelo dimensional en estrella, medidas DAX y proyección con Machine Learning. Un primer acercamiento serio a Power BI.',
        bullets: ['Proyecto universitario', 'Modelo Estrella', 'Medidas DAX + ML'],
        telemetry: [
            { label: 'CONTEXTO',    value: 'Académico ISI802' },
            { label: 'PÁGINAS',     value: '06 reportes' },
            { label: 'MEDIDAS DAX', value: '48 funciones' },
            { label: 'FUENTES',     value: '04 orígenes' },
            { label: 'REGISTROS',   value: '+180 000' },
            { label: 'HERRAMIENTA', value: 'Power BI Desktop' },
        ],
        route: '/powerbi',
        routeLabel: 'Ver dashboard',
    },
    '07 · Notebooks': {
        index: '07',
        title: 'Notebooks',
        subtitle: 'Análisis académico reproducible',
        description:
            'Notebook en Google Colab que documenta el pipeline completo del proyecto ISI802: ETL de 4 fuentes (ODEPA, CONAF, SII, Open-Meteo), modelo estrella dimensional, clustering K-Means y forecast de series temporales. Todo el código es reproducible y las fuentes son públicas.',
        bullets: ['ETL 4 fuentes', 'Modelo estrella', 'K-Means + Forecast'],
        telemetry: [
            { label: 'CONTEXTO',     value: 'Académico' },
            { label: 'FASES',        value: '06 etapas' },
            { label: 'FUENTES',      value: '04 datasets' },
            { label: 'MODELOS',      value: 'K-Means · SARIMA' },
            { label: 'HERRAMIENTAS', value: 'pandas · sklearn' },
            { label: 'ENTORNO',      value: 'Google Colab' },
        ],
        route: '/notebooks',
        routeLabel: 'Ver notebooks',
    },
    '08 · Contacto': {
        index: '08',
        title: 'Contacto',
        subtitle: 'Hablemos',
        description:
            '¿Tienes un proyecto en mente, una oportunidad junior o simplemente quieres conectar? Mi bandeja está abierta. Respondo lo antes posible, casi siempre en menos de 24 horas.',
        bullets: ['Email', 'GitHub', 'LinkedIn'],
        telemetry: [
            { label: 'EMAIL',     value: 'tu@correo.com' },
            { label: 'GITHUB',    value: '@tu-usuario' },
            { label: 'LINKEDIN',  value: '/in/tu-usuario' },
            { label: 'UBICACIÓN', value: 'Chile' },
            { label: 'RESPUESTA', value: '< 24 h' },
            { label: 'IDIOMAS',   value: 'ES · EN' },
        ],
    },
}

/* ============================================================
 *  TYPEWRITER
 * ============================================================ */
function useTypewriter(text: string, speed = 12, delay = 320) {
    const [count, setCount] = useState(0)

    useEffect(() => {
        setCount(0)
        let i = 0
        let interval: ReturnType<typeof setInterval> | null = null
        const timeout = setTimeout(() => {
            interval = setInterval(() => {
                i++
                setCount(i)
                if (i >= text.length && interval) clearInterval(interval)
            }, speed)
        }, delay)
        return () => {
            clearTimeout(timeout)
            if (interval) clearInterval(interval)
        }
    }, [text, speed, delay])

    return text.slice(0, count)
}

/* ============================================================
 *  COORDENADAS EN VIVO — sin re-render
 *  Escribe directo al DOM vía refs. Throttle agresivo en mobile.
 * ============================================================ */
function useLiveCoords(
    active: string | null,
    latRef: React.RefObject<HTMLSpanElement | null>,
    lonRef: React.RefObject<HTMLSpanElement | null>,
    altRef: React.RefObject<HTMLSpanElement | null>,
    velRef: React.RefObject<HTMLSpanElement | null>,
) {
    const seedRef = useRef(Math.random() * 1000)

    useEffect(() => {
        if (!active) return
        seedRef.current = Math.random() * 1000

        const isMobile = window.innerWidth < 900
        const interval = isMobile ? 200 : 60 // 5 fps mobile, ~16 fps desktop

        let last = 0
        let raf = 0

        const tick = (now: number) => {
            if (now - last > interval) {
                last = now
                const t = performance.now() / 1000 + seedRef.current
                const lat = Math.sin(t * 0.4) * 62.4
                const lon = Math.cos(t * 0.3) * 118.7
                const alt = 128.4 + Math.sin(t * 0.6) * 24
                const vel = 4.2 + Math.sin(t * 0.9) * 0.8

                if (latRef.current) {
                    latRef.current.textContent =
                        `${lat >= 0 ? '+' : '−'}${Math.abs(lat).toFixed(2)}°`
                }
                if (lonRef.current) {
                    lonRef.current.textContent =
                        `${lon >= 0 ? '+' : '−'}${Math.abs(lon).toFixed(2)}°`
                }
                if (altRef.current) {
                    altRef.current.textContent = `${alt.toFixed(1)} Mm`
                }
                if (velRef.current) {
                    velRef.current.textContent = `${vel.toFixed(2)} km/s`
                }
            }
            raf = requestAnimationFrame(tick)
        }
        raf = requestAnimationFrame(tick)
        return () => cancelAnimationFrame(raf)
    }, [active, latRef, lonRef, altRef, velRef])
}

/* ============================================================
 *  COMPONENTE
 * ============================================================ */
export function PlanetReadout() {
    const { focusedPlanet } = useSystemState()
    const info = focusedPlanet ? SECTION_INFO[focusedPlanet] : null

    const [revealedTelemetry, setRevealedTelemetry] = useState(0)
    const [revealedBullets, setRevealedBullets] = useState(0)
    const [isClosing, setIsClosing] = useState(false)
    const [decodeProgress, setDecodeProgress] = useState(0)

    const scrollRef = useRef<HTMLElement>(null)
    const latRef = useRef<HTMLSpanElement>(null)
    const lonRef = useRef<HTMLSpanElement>(null)
    const altRef = useRef<HTMLSpanElement>(null)
    const velRef = useRef<HTMLSpanElement>(null)

    useLiveCoords(focusedPlanet, latRef, lonRef, altRef, velRef)

    /* ---------- Close con animación CRT off ---------- */
    const handleClose = () => {
        if (isClosing) return
        setIsClosing(true)
        setTimeout(() => {
            systemStore.setFocusedPlanet(null)
            setIsClosing(false)
        }, 420)
    }

    /* ---------- Escape ---------- */
    useEffect(() => {
        if (!focusedPlanet) return
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') handleClose()
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [focusedPlanet])

    /* ---------- Detectar scroll para ocultar hint ---------- */
    useEffect(() => {
        if (!focusedPlanet) return
        const el = scrollRef.current
        if (!el) return

        let raf = 0

        const check = () => {
            const hasScroll = el.scrollHeight > el.clientHeight + 8
            const nearBottom =
                el.scrollTop + el.clientHeight >= el.scrollHeight - 24

            const hintEl = document.querySelector('.readout__scroll-hint')
            if (hintEl) {
                const shouldShow = hasScroll && !nearBottom
                hintEl.classList.toggle('is-hidden', !shouldShow)
            }

            raf = requestAnimationFrame(check)
        }

        raf = requestAnimationFrame(check)
        return () => cancelAnimationFrame(raf)
    }, [focusedPlanet])

    /* ---------- Animación de revelado ---------- */
    useEffect(() => {
        if (!info) return
        setRevealedTelemetry(0)
        setRevealedBullets(0)
        setDecodeProgress(0)

        const timers: ReturnType<typeof setTimeout>[] = []

        let p = 0
        const progInterval = setInterval(() => {
            p += 4 + Math.random() * 6
            if (p >= 100) {
                p = 100
                clearInterval(progInterval)
            }
            setDecodeProgress(p)
        }, 45)

        for (let i = 1; i <= 6; i++) {
            timers.push(setTimeout(() => setRevealedTelemetry(i), 900 + i * 110))
        }
        for (let i = 1; i <= 3; i++) {
            timers.push(setTimeout(() => setRevealedBullets(i), 1700 + i * 110))
        }

        return () => {
            clearInterval(progInterval)
            timers.forEach(clearTimeout)
        }
    }, [info])

    const description = info ? info.description : ''
    const typed = useTypewriter(description)

    const catalog = useMemo(() => {
        if (!focusedPlanet) return '—'
        const parts = focusedPlanet.split('·')
        return parts[1]?.trim().toUpperCase() ?? '—'
    }, [focusedPlanet])

    if (!focusedPlanet || !info) return null

    return (
        <div className={`readout-anchor ${isClosing ? 'is-closing' : ''}`}>
            <div className="readout-shell">
                <div className="readout__crt-scanlines" aria-hidden="true" />
                <div className="readout__crt-flicker" aria-hidden="true" />
                <div className="readout__crt-flash" aria-hidden="true" />
                <div className="readout__crt-vignette" aria-hidden="true" />
                <div className="readout__crt-beam" aria-hidden="true" />

                <aside
                    className="readout"
                    role="dialog"
                    aria-modal="false"
                    ref={scrollRef}
                >
                    <span className="readout__corner readout__corner--tl" />
                    <span className="readout__corner readout__corner--tr" />
                    <span className="readout__corner readout__corner--bl" />
                    <span className="readout__corner readout__corner--br" />

                    <span className="readout__border-pulse" aria-hidden="true" />

                    {/* ============ HEADER ============ */}
                    <header className="readout__head">
                        <div className="readout__head-left">
                            <span className="readout__signal-dot" />
                            <span className="readout__status-text">SEÑAL ADQUIRIDA</span>
                        </div>
                        <div className="readout__head-mid">
                            <span className="readout__chan">CH-{info.index}</span>
                            <span className="readout__hz">144.7 MHz</span>
                        </div>
                        <div className="readout__head-right">
                            <span className="readout__live">● VIVO</span>
                        </div>
                    </header>

                    {/* ============ RETICLE + CATALOG ============ */}
                    <div className="readout__reticle-row">
                        <div className="readout__reticle" aria-hidden="true">
                            <span className="readout__reticle-corner readout__reticle-corner--tl" />
                            <span className="readout__reticle-corner readout__reticle-corner--tr" />
                            <span className="readout__reticle-corner readout__reticle-corner--bl" />
                            <span className="readout__reticle-corner readout__reticle-corner--br" />
                            <span className="readout__reticle-dot" />
                        </div>
                        <div className="readout__catalog-wrap">
                            <span className="readout__catalog-label">
                                OBJETO · RA 05h 42m · DEC −12° 34′
                            </span>
                            <span className="readout__catalog-value">{catalog}</span>
                        </div>
                        <button
                            type="button"
                            className="readout__close"
                            onClick={handleClose}
                            aria-label="Desconectar señal"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                                 stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    </div>

                    {/* ============ SUBTITLE + SCANLINE ============ */}
                    <div className="readout__subtitle">{info.subtitle}</div>
                    <div className="readout__scanline" aria-hidden="true">
                        <span className="readout__scanline-track" />
                        <span className="readout__scanline-sweep" />
                    </div>

                    {/* ============ TITLE ============ */}
                    <h2 className="readout__title" data-text={info.title}>
                        {info.title}
                    </h2>

                    {/* ============ DESCRIPTION ============ */}
                    <p className="readout__desc">
                        <span className="readout__prompt">&gt;_</span>{' '}
                        {typed}
                        {typed.length < description.length && (
                            <span className="readout__caret" aria-hidden="true" />
                        )}
                    </p>

                    {/* ============ BARRA DE DECODIFICACIÓN ============ */}
                    <div className="readout__decode">
                        <span className="readout__decode-label">DECODIFICANDO</span>
                        <div className="readout__decode-track">
                            <div
                                className="readout__decode-fill"
                                style={{ width: `${decodeProgress}%` }}
                            />
                            <div
                                className="readout__decode-glow"
                                style={{ left: `${decodeProgress}%` }}
                            />
                        </div>
                        <span className="readout__decode-value">
                            {decodeProgress.toFixed(0).padStart(3, '0')}%
                        </span>
                    </div>

                    {/* ============ GRID: telemetría + side ============ */}
                    <div className="readout__grid">
                        <section className="readout__telemetry">
                            <div className="readout__section-label">
                                <span className="readout__label-dash" />
                                <span>TELEMETRÍA</span>
                                <span className="readout__label-dash" />
                            </div>
                            <ul className="readout__telemetry-list">
                                {info.telemetry.map((t, i) => (
                                    <li
                                        key={t.label}
                                        className={`readout__telemetry-row ${i < revealedTelemetry ? 'is-visible' : ''}`}
                                        style={{ transitionDelay: `${(i % 3) * 30}ms` }}
                                    >
                                        <span className="readout__telemetry-key">{t.label}</span>
                                        <span className="readout__telemetry-dots" />
                                        <span className="readout__telemetry-value">{t.value}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>

                        <aside className="readout__side">
                            <div className="readout__radar" aria-hidden="true">
                                <span className="readout__radar-ring readout__radar-ring--1" />
                                <span className="readout__radar-ring readout__radar-ring--2" />
                                <span className="readout__radar-ring readout__radar-ring--3" />
                                <span className="readout__radar-h" />
                                <span className="readout__radar-v" />
                                <span className="readout__radar-sweep" />
                                <span className="readout__radar-blip" />
                            </div>

                            <div className="readout__wave" aria-hidden="true">
                                {Array.from({ length: 22 }).map((_, i) => (
                                    <span
                                        key={i}
                                        className="readout__wave-bar"
                                        style={{ animationDelay: `${i * 60}ms` }}
                                    />
                                ))}
                            </div>
                        </aside>
                    </div>

                    {/* ============ COORDS ============ */}
                    <div className="readout__coords">
                        <div className="readout__coord">
                            <span className="readout__coord-label">LAT</span>
                            <span className="readout__coord-value" ref={latRef}>
                                +00.00°
                            </span>
                        </div>
                        <div className="readout__coord">
                            <span className="readout__coord-label">LON</span>
                            <span className="readout__coord-value" ref={lonRef}>
                                +00.00°
                            </span>
                        </div>
                        <div className="readout__coord">
                            <span className="readout__coord-label">ALT</span>
                            <span className="readout__coord-value" ref={altRef}>
                                0.0 Mm
                            </span>
                        </div>
                        <div className="readout__coord">
                            <span className="readout__coord-label">VEL</span>
                            <span className="readout__coord-value" ref={velRef}>
                                0.00 km/s
                            </span>
                        </div>
                    </div>

                    {/* ============ FEATURES ============ */}
                    <section className="readout__features">
                        <span className="readout__section-label">PUNTOS CLAVE</span>
                        <ul className="readout__features-list">
                            {info.bullets.map((b, i) => (
                                <li
                                    key={b}
                                    className={`readout__feature ${i < revealedBullets ? 'is-visible' : ''}`}
                                    style={{ transitionDelay: `${i * 60}ms` }}
                                >
                                    <span className="readout__feature-arrow">▸</span>
                                    <span className="readout__feature-text">{b}</span>
                                </li>
                            ))}
                        </ul>
                    </section>

                    {/* ============ TRAVEL BUTTON ============ */}
                    {info.route && (
                        <div className="readout__travel">
                            <button
                                type="button"
                                className="readout__travel-btn"
                                onClick={() => systemStore.setWarping(info.route!)}
                            >
                                <span className="readout__travel-icon" aria-hidden="true">
                                    <span className="readout__travel-icon-inner" />
                                </span>
                                <span className="readout__travel-text">
                                    <span className="readout__travel-eyebrow">
                                        Saltar a destino
                                    </span>
                                    <span className="readout__travel-label">
                                        {info.routeLabel ?? info.route}
                                    </span>
                                </span>
                                <span className="readout__travel-route">{info.route}</span>
                                <span className="readout__travel-arrow" aria-hidden="true">
                                    →
                                </span>
                            </button>
                        </div>
                    )}

                    {/* ============ FOOTER ============ */}
                    <footer className="readout__foot">
                        <span className="readout__foot-hint">
                            <kbd>ESC</kbd> para desconectar señal
                        </span>
                        <span className="readout__foot-code">
                            // {info.index} — READY // SIG {`{`}LOCKED{`}`}
                        </span>
                    </footer>
                </aside>

                {/* ============ SCROLL HINT ============ */}
                <div className="readout__scroll-hint is-hidden" aria-hidden="true">
                    <span className="readout__scroll-hint-fade" />
                    <span className="readout__scroll-hint-chevron">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                             stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
                             strokeLinejoin="round">
                            <polyline points="6 9 12 15 18 9" />
                        </svg>
                    </span>
                </div>
            </div>
        </div>
    )
}