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
            'Un portafolio interactivo diseñado como un sistema solar en constante movimiento, donde cada planeta representa una parte de mi trabajo. Arrastra para explorar, haz clic en cualquier cuerpo para decodificar su señal.',
        bullets: ['Portafolio interactivo', 'Diseño 3D en tiempo real', 'Navegación orbital'],
        telemetry: [
            { label: 'MASA',     value: '3.30 ×10²³ kg' },
            { label: 'DIÁMETRO', value: '4 879 km' },
            { label: 'ÓRBITA',   value: '88 días' },
            { label: 'SEÑAL',    value: '−38 dBm' },
            { label: 'INCLINACIÓN', value: '7.0°' },
            { label: 'EXCENTRICIDAD', value: '0.206' },
        ],
    },
    '02 · Sobre mí': {
        index: '02',
        title: 'Sobre mí',
        subtitle: 'Quién está detrás',
        description:
            'Desarrollador full stack con foco en experiencias web rápidas, accesibles y con atención obsesiva al detalle. Me interesan los productos que se sienten vivos, no solo funcionales.',
        bullets: ['Full Stack Developer', 'React + TypeScript', 'Node.js + PostgreSQL'],
        telemetry: [
            { label: 'EXPERIENCIA',  value: '+4 años' },
            { label: 'PROYECTOS',    value: '27 entregados' },
            { label: 'STACK',        value: '18 tecnologías' },
            { label: 'IDIOMAS',      value: 'ES · EN · PT' },
            { label: 'UBICACIÓN',    value: 'Remoto · GMT-5' },
            { label: 'DISPONIBLE',   value: 'Sí' },
        ],
    },
    '03 · Proyectos': {
        index: '03',
        title: 'Proyectos',
        subtitle: 'Lo que he construido',
        description:
            'Una selección de sistemas que he diseñado e implementado de punta a punta: desde dashboards en tiempo real con WebGL hasta pipelines de datos sobre terabytes de información.',
        bullets: ['Análisis orbital', 'Motor de recomendación', 'Editor colaborativo'],
        telemetry: [
            { label: 'TOTAL',    value: '27 sistemas' },
            { label: 'EN LÍNEA', value: '18 activos' },
            { label: 'EN CURSO', value: '5 desarrollo' },
            { label: 'ARCHIVO',  value: '4 retirados' },
            { label: 'USUARIOS', value: '+12 000' },
            { label: 'UPTIME',   value: '99.98%' },
        ],
        route: '/proyectos',
        routeLabel: 'Archivo de proyectos',
    },
    '04 · Experiencia': {
        index: '04',
        title: 'Experiencia',
        subtitle: 'Dónde he estado',
        description:
            'Trayectoria profesional construyendo productos digitales junto a equipos de producto, diseño y datos. Desde startups en etapa temprana hasta plataformas de escala empresarial.',
        bullets: ['Empresas tech', 'Equipos distribuidos', 'Metodologías ágiles'],
        telemetry: [
            { label: 'EMPRESAS', value: '6 compañías' },
            { label: 'AÑOS',     value: '+4 trabajando' },
            { label: 'PAÍSES',   value: '3 remotos' },
            { label: 'ROLES',    value: 'Frontend → Full' },
            { label: 'MENTORÍA', value: '4 devs' },
            { label: 'CHARLAS',  value: '3 eventos' },
        ],
    },
    '05 · Stack': {
        index: '05',
        title: 'Stack',
        subtitle: 'Con qué trabajo',
        description:
            'Las herramientas con las que construyo día a día. Un stack maduro, probado en producción y elegido por razones concretas, no por moda.',
        bullets: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'AWS'],
        telemetry: [
            { label: 'LENGUAJES',  value: 'TS · PY · GO' },
            { label: 'FRAMEWORKS', value: 'React · Next' },
            { label: 'DATOS',      value: 'Postgres · Redis' },
            { label: 'CLOUD',      value: 'AWS · Vercel' },
            { label: 'CI/CD',      value: 'GH Actions' },
            { label: 'MONITOREO',  value: 'Sentry · DD' },
        ],
    },
    '06 · Power BI': {
        index: '06',
        title: 'Certificaciones',
        subtitle: 'Formación continua',
        description:
            'Cursos, certificaciones y formación continua que mantienen el conocimiento al día en un campo que cambia cada seis meses.',
        bullets: ['AWS Certified', 'Meta Frontend', 'Google Cloud'],
        telemetry: [
            { label: 'TOTAL',        value: '12 emitidas' },
            { label: 'PLATAFORMAS',  value: '5 proveedores' },
            { label: 'AÑO ÚLTIMO',   value: '2025' },
            { label: 'HORAS',        value: '+340 h' },
            { label: 'PROMEDIO',     value: '94%' },
            { label: 'VIGENTES',     value: '7 activas' },
        ],
        route: '/powerbi',
        routeLabel: 'Dashboard Colchagua',
    },
    '07 · Notebooks': {
        index: '07',
        title: 'Blog',
        subtitle: 'Lo que escribo',
        description:
            'Notas técnicas, reflexiones sobre desarrollo y ensayos sobre la intersección entre software, diseño y producto. Escrito sin pretensiones, sin SEO, sin relleno.',
        bullets: ['Artículos técnicos', 'Ensayos de producto', 'Notas de aprendizaje'],
        telemetry: [
            { label: 'ARTÍCULOS', value: '24 publicados' },
            { label: 'TEMAS',     value: '8 categorías' },
            { label: 'PALABRAS',  value: '+42 000' },
            { label: 'ÚLTIMA',    value: 'hace 6 días' },
            { label: 'LECTURAS',  value: '+8 400' },
            { label: 'SUSCRIPTORES', value: '340' },
        ],
        route: '/notebooks',
        routeLabel: 'Notebooks de análisis',
    },
    '08 · Contacto': {
        index: '08',
        title: 'Contacto',
        subtitle: 'Hablemos',
        description:
            '¿Tienes un proyecto en mente o simplemente quieres saludar? Mi bandeja de entrada está siempre abierta. Respondo en menos de 24 horas.',
        bullets: ['Email', 'GitHub', 'LinkedIn'],
        telemetry: [
            { label: 'EMAIL',      value: 'tu@correo.com' },
            { label: 'GITHUB',     value: '@tu-usuario' },
            { label: 'LINKEDIN',   value: '/in/tu-usuario' },
            { label: 'UBICACIÓN',  value: 'Remoto · GMT-5' },
            { label: 'RESPUESTA',  value: '< 24 h' },
            { label: 'ZONA',       value: 'Global' },
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
 *  COORDENADAS EN VIVO
 * ============================================================ */
function useLiveCoords(active: string | null) {
    const [coords, setCoords] = useState({ lat: 0, lon: 0, alt: 0, vel: 0 })
    const seedRef = useRef(Math.random() * 1000)

    useEffect(() => {
        if (!active) return
        seedRef.current = Math.random() * 1000

        let raf = 0
        const tick = () => {
            const t = performance.now() / 1000 + seedRef.current
            setCoords({
                lat: Math.sin(t * 0.4) * 62.4,
                lon: Math.cos(t * 0.3) * 118.7,
                alt: 128.4 + Math.sin(t * 0.6) * 24,
                vel: 4.2 + Math.sin(t * 0.9) * 0.8,
            })
            raf = requestAnimationFrame(tick)
        }
        raf = requestAnimationFrame(tick)
        return () => cancelAnimationFrame(raf)
    }, [active])

    return coords
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

    const coords = useLiveCoords(focusedPlanet)

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

                <aside className="readout" role="dialog" aria-modal="false">
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
                            <span className="readout__catalog-label">OBJETO · RA 05h 42m · DEC −12° 34′</span>
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
                            <span className="readout__coord-value">
                {coords.lat >= 0 ? '+' : '−'}
                                {Math.abs(coords.lat).toFixed(2)}°
              </span>
                        </div>
                        <div className="readout__coord">
                            <span className="readout__coord-label">LON</span>
                            <span className="readout__coord-value">
                {coords.lon >= 0 ? '+' : '−'}
                                {Math.abs(coords.lon).toFixed(2)}°
              </span>
                        </div>
                        <div className="readout__coord">
                            <span className="readout__coord-label">ALT</span>
                            <span className="readout__coord-value">
                {coords.alt.toFixed(1)} Mm
              </span>
                        </div>
                        <div className="readout__coord">
                            <span className="readout__coord-label">VEL</span>
                            <span className="readout__coord-value">
                {coords.vel.toFixed(2)} km/s
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
                  <span className="readout__travel-eyebrow">Saltar a destino</span>
                  <span className="readout__travel-label">
                    {info.routeLabel ?? info.route}
                  </span>
                </span>
                                <span className="readout__travel-route">{info.route}</span>
                                <span className="readout__travel-arrow" aria-hidden="true">→</span>
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
            </div>
        </div>
    )
}