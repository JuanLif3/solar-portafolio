import { useEffect, useMemo, useState } from 'react'
import { systemStore, useSystemState } from '../store/system'
import './PlanetReadout.css'

type Telemetry = { label: string; value: string }

type Info = {
    index: string
    title: string
    subtitle: string
    description: string
    bullets: string[]
    telemetry: Telemetry[]
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
            { label: 'EXPERIENCIA', value: '+4 años' },
            { label: 'PROYECTOS',   value: '27 entregados' },
            { label: 'STACK',       value: '18 tecnologías' },
            { label: 'IDIOMAS',     value: 'ES · EN · PT' },
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
            { label: 'TOTAL',     value: '27 sistemas' },
            { label: 'EN LÍNEA',  value: '18 activos' },
            { label: 'EN CURSO',  value: '5 en desarrollo' },
            { label: 'ARCHIVO',   value: '4 retirados' },
        ],
    },
    '04 · Experiencia': {
        index: '04',
        title: 'Experiencia',
        subtitle: 'Dónde he estado',
        description:
            'Trayectoria profesional construyendo productos digitales junto a equipos de producto, diseño y datos. Desde startups en etapa temprana hasta plataformas de escala empresarial.',
        bullets: ['Empresas tech', 'Equipos distribuidos', 'Metodologías ágiles'],
        telemetry: [
            { label: 'EMPRESAS',  value: '6 compañías' },
            { label: 'AÑOS',      value: '+4 trabajando' },
            { label: 'PAÍSES',    value: '3 remotos' },
            { label: 'ROLES',     value: 'Frontend → Full' },
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
        ],
    },
    '06 · Certificaciones': {
        index: '06',
        title: 'Certificaciones',
        subtitle: 'Formación continua',
        description:
            'Cursos, certificaciones y formación continua que mantienen el conocimiento al día en un campo que cambia cada seis meses.',
        bullets: ['AWS Certified', 'Meta Frontend', 'Google Cloud'],
        telemetry: [
            { label: 'TOTAL',       value: '12 emitidas' },
            { label: 'PLATAFORMAS', value: '5 proveedores' },
            { label: 'AÑO ÚLTIMO',  value: '2025' },
            { label: 'HORAS',       value: '+340 h' },
        ],
    },
    '07 · Blog': {
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
        ],
    },
    '08 · Contacto': {
        index: '08',
        title: 'Contacto',
        subtitle: 'Hablemos',
        description:
            '¿Tienes un proyecto en mente o simplemente quieres saludar? Mi bandeja de entrada está siempre abierta. Respondo en menos de 24 horas.',
        bullets: ['Email', 'GitHub', 'LinkedIn'],
        telemetry: [
            { label: 'EMAIL',    value: 'tu@correo.com' },
            { label: 'GITHUB',   value: '@tu-usuario' },
            { label: 'LINKEDIN', value: '/in/tu-usuario' },
            { label: 'UBICACIÓN',value: 'Remoto · GMT-5' },
        ],
    },
}

/* ============================================================
 *  TYPEWRITER HOOK
 * ============================================================ */
function useTypewriter(text: string, speed = 14, delay = 220) {
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
 *  COMPONENTE
 * ============================================================ */
export function PlanetReadout() {
    const { focusedPlanet } = useSystemState()
    const info = focusedPlanet ? SECTION_INFO[focusedPlanet] : null

    const [revealedTelemetry, setRevealedTelemetry] = useState(0)
    const [revealedBullets, setRevealedBullets] = useState(0)

    // Escape cierra
    useEffect(() => {
        if (!focusedPlanet) return
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') systemStore.setFocusedPlanet(null)
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [focusedPlanet])

    // Reset de la animación cuando cambia el planeta
    useEffect(() => {
        if (!info) return
        setRevealedTelemetry(0)
        setRevealedBullets(0)

        const t1 = setTimeout(() => setRevealedTelemetry(1), 700)
        const t2 = setTimeout(() => setRevealedTelemetry(2), 900)
        const t3 = setTimeout(() => setRevealedTelemetry(3), 1100)
        const t4 = setTimeout(() => setRevealedTelemetry(4), 1300)

        const tb1 = setTimeout(() => setRevealedBullets(1), 1500)
        const tb2 = setTimeout(() => setRevealedBullets(2), 1650)
        const tb3 = setTimeout(() => setRevealedBullets(3), 1800)

        return () => {
            clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4)
            clearTimeout(tb1); clearTimeout(tb2); clearTimeout(tb3)
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
        <aside className="readout" role="dialog" aria-modal="false">
            {/* Esquinas HUD */}
            <span className="readout__corner readout__corner--tl" />
            <span className="readout__corner readout__corner--tr" />
            <span className="readout__corner readout__corner--bl" />
            <span className="readout__corner readout__corner--br" />

            {/* Puntos de "datos viajando" por el borde izquierdo */}
            <span className="readout__border-pulse" aria-hidden="true" />

            {/* ============ HEADER ============ */}
            <header className="readout__head">
                <div className="readout__head-left">
                    <span className="readout__signal-dot" />
                    <span className="readout__status-text">SEÑAL ADQUIRIDA</span>
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
                    <span className="readout__catalog-label">OBJETO</span>
                    <span className="readout__catalog-value">{catalog}</span>
                </div>
                <button
                    type="button"
                    className="readout__close"
                    onClick={() => systemStore.setFocusedPlanet(null)}
                    aria-label="Desconectar señal"
                >
                    <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                    >
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>
            </div>

            {/* ============ SUBTITLE + SCANLINE DIVIDER ============ */}
            <div className="readout__subtitle">{info.subtitle}</div>
            <div className="readout__scanline" aria-hidden="true">
                <span className="readout__scanline-track" />
                <span className="readout__scanline-sweep" />
            </div>

            {/* ============ TITLE ============ */}
            <h2 className="readout__title">{info.title}</h2>

            {/* ============ DESCRIPTION (typewriter) ============ */}
            <p className="readout__desc">
                {typed}
                {typed.length < description.length && (
                    <span className="readout__caret" aria-hidden="true" />
                )}
            </p>

            {/* ============ TELEMETRY ============ */}
            <section className="readout__telemetry">
                <div className="readout__telemetry-label">
                    <span className="readout__label-dash" />
                    <span>TELEMETRÍA</span>
                    <span className="readout__label-dash" />
                </div>
                <ul className="readout__telemetry-list">
                    {info.telemetry.map((t, i) => (
                        <li
                            key={t.label}
                            className={`readout__telemetry-row ${i < revealedTelemetry ? 'is-visible' : ''}`}
                            style={{ transitionDelay: `${i * 40}ms` }}
                        >
                            <span className="readout__telemetry-key">{t.label}</span>
                            <span className="readout__telemetry-dots" />
                            <span className="readout__telemetry-value">{t.value}</span>
                        </li>
                    ))}
                </ul>
            </section>

            {/* ============ BULLETS ============ */}
            <section className="readout__features">
                <span className="readout__features-label">PUNTOS CLAVE</span>
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

            {/* ============ SIGNAL WAVE ============ */}
            <div className="readout__wave" aria-hidden="true">
                <span className="readout__wave-label">SEÑAL</span>
                <div className="readout__wave-track">
                    <span className="readout__wave-bar" style={{ animationDelay: '0ms' }} />
                    <span className="readout__wave-bar" style={{ animationDelay: '80ms' }} />
                    <span className="readout__wave-bar" style={{ animationDelay: '160ms' }} />
                    <span className="readout__wave-bar" style={{ animationDelay: '240ms' }} />
                    <span className="readout__wave-bar" style={{ animationDelay: '320ms' }} />
                    <span className="readout__wave-bar" style={{ animationDelay: '400ms' }} />
                    <span className="readout__wave-bar" style={{ animationDelay: '480ms' }} />
                    <span className="readout__wave-bar" style={{ animationDelay: '560ms' }} />
                    <span className="readout__wave-bar" style={{ animationDelay: '640ms' }} />
                    <span className="readout__wave-bar" style={{ animationDelay: '720ms' }} />
                    <span className="readout__wave-bar" style={{ animationDelay: '800ms' }} />
                    <span className="readout__wave-bar" style={{ animationDelay: '880ms' }} />
                </div>
            </div>

            {/* ============ FOOTER ============ */}
            <footer className="readout__foot">
        <span className="readout__foot-hint">
          <kbd>ESC</kbd> para desconectar señal
        </span>
                <span className="readout__foot-code">// {info.index} — READY</span>
            </footer>
        </aside>
    )
}