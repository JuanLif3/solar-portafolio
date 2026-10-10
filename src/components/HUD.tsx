import { useEffect, useRef, useState } from 'react'
import { systemStore, useSystemState, type SectionId } from '../store/system'
import '../styles/HUD.css'

type Section = { id: SectionId; label: string; href?: string }

const SECTIONS: Section[] = [
    { id: 'inicio',        label: 'Inicio' },
    { id: 'sobre-mi',      label: 'Sobre mí' },
    { id: 'proyectos',     label: 'Proyectos' },
    { id: 'experiencia',   label: 'Experiencia' },
    { id: 'stack',         label: 'Stack' },
    { id: 'certs',         label: 'Certificaciones' },
    { id: 'blog',          label: 'Blog' },
    { id: 'contacto',      label: 'Contacto' },
]

export function HUD() {
    const { speed, paused, showLabels, showOrbits, activeSection } = useSystemState()

    const raRef = useRef<HTMLSpanElement>(null)
    const decRef = useRef<HTMLSpanElement>(null)
    const zoomRef = useRef<HTMLSpanElement>(null)
    const timeRef = useRef<HTMLSpanElement>(null)
    const fpsRef = useRef<HTMLSpanElement>(null)

    const [fullscreen, setFullscreen] = useState(false)
    const startRef = useRef(performance.now())

    // ============ Coordenadas / tiempo / fps en vivo ============
    useEffect(() => {
        let frames = 0
        let fpsTimer = performance.now()
        let fps = 60

        let raf = 0
        const loop = () => {
            const now = performance.now()
            frames++

            if (now - fpsTimer > 500) {
                fps = Math.round((frames * 1000) / (now - fpsTimer))
                frames = 0
                fpsTimer = now
                if (fpsRef.current) fpsRef.current.textContent = `${fps} FPS`
            }

            const elapsed = (now - startRef.current) / 1000
            const t = now / 1000

            if (raRef.current) {
                const ra = ((t * 0.08) % 24)
                const hh = Math.floor(ra)
                const mm = Math.floor((ra - hh) * 60)
                raRef.current.textContent = `${String(hh).padStart(2, '0')}h ${String(mm).padStart(2, '0')}m`
            }
            if (decRef.current) {
                const dec = Math.sin(t * 0.08) * 55
                const sign = dec >= 0 ? '+' : '−'
                decRef.current.textContent = `${sign}${Math.abs(dec).toFixed(1)}°`
            }
            if (zoomRef.current) {
                zoomRef.current.textContent = `${(0.5 + Math.abs(Math.sin(t * 0.3)) * 1.5).toFixed(2)}×`
            }
            if (timeRef.current) {
                const h = Math.floor(elapsed / 3600)
                const m = Math.floor((elapsed % 3600) / 60)
                const s = Math.floor(elapsed % 60)
                timeRef.current.textContent = `T + ${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
            }

            raf = requestAnimationFrame(loop)
        }
        raf = requestAnimationFrame(loop)
        return () => cancelAnimationFrame(raf)
    }, [])

    // ============ Fullscreen state sync ============
    useEffect(() => {
        const onChange = () => setFullscreen(!!document.fullscreenElement)
        document.addEventListener('fullscreenchange', onChange)
        return () => document.removeEventListener('fullscreenchange', onChange)
    }, [])

    // ============ Atajos de teclado ============
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            // No disparar si el usuario escribe en un input.
            const tag = (e.target as HTMLElement)?.tagName
            if (tag === 'INPUT' || tag === 'TEXTAREA') return

            if (e.code === 'Space') {
                e.preventDefault()
                systemStore.togglePause()
            } else if (e.key === 'r' || e.key === 'R') {
                systemStore.resetView()
            } else if (e.key === 'l' || e.key === 'L') {
                systemStore.toggleLabels()
            } else if (e.key === 'o' || e.key === 'O') {
                systemStore.toggleOrbits()
            } else if (e.key === 'f' || e.key === 'F') {
                toggleFullscreen()
            }
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [])

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(() => {})
        } else {
            document.exitFullscreen().catch(() => {})
        }
    }

    const onSectionClick = (s: Section) => {
        systemStore.setActiveSection(activeSection === s.id ? null : s.id)
        const el = document.getElementById(s.id)
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    return (
        <div className="hud">
            {/* ============ ESQUINAS ============ */}
            <span className="hud__corner hud__corner--tl" />
            <span className="hud__corner hud__corner--tr" />
            <span className="hud__corner hud__corner--bl" />
            <span className="hud__corner hud__corner--br" />

            {/* ============ TOP BAR ============ */}
            <header className="hud__top">
                <div className="hud__brand">
                    <span className="hud__brand-mark">◆</span>
                    <span className="hud__brand-name">Sistema Solar</span>
                    <span className="hud__brand-sep">·</span>
                    <span className="hud__brand-sub">Portafolio</span>
                </div>

                <nav className="hud__nav" aria-label="Navegación">
                    {SECTIONS.map((s, i) => (
                        <button
                            key={s.id}
                            type="button"
                            className={`hud__nav-item ${activeSection === s.id ? 'is-active' : ''}`}
                            onClick={() => onSectionClick(s)}
                            title={s.label}
                        >
                            <span className="hud__nav-index">{String(i + 1).padStart(2, '0')}</span>
                            <span className="hud__nav-label">{s.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="hud__status">
                    <span className="hud__status-dot" />
                    <span className="hud__status-text">LIVE</span>
                    <span className="hud__status-fps" ref={fpsRef}>60 FPS</span>
                </div>
            </header>

            {/* ============ LEFT RAIL ============ */}
            <aside className="hud__left">
                <button
                    type="button"
                    className="hud__rail-item"
                    onClick={() => systemStore.resetView()}
                    title="Reset vista (R)"
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                        <path d="M3 12a9 9 0 1 0 3-6.7" />
                        <polyline points="3 4 3 9 8 9" />
                    </svg>
                </button>

                <button
                    type="button"
                    className={`hud__rail-item ${showLabels ? 'is-on' : ''}`}
                    onClick={() => systemStore.toggleLabels()}
                    title="Etiquetas (L)"
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                        <path d="M20.6 13.4L13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8z" />
                        <circle cx="7.5" cy="7.5" r="1" fill="currentColor" />
                    </svg>
                </button>

                <button
                    type="button"
                    className={`hud__rail-item ${showOrbits ? 'is-on' : ''}`}
                    onClick={() => systemStore.toggleOrbits()}
                    title="Órbitas (O)"
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" strokeWidth="1.8">
                        <ellipse cx="12" cy="12" rx="10" ry="5" />
                        <circle cx="12" cy="12" r="2" fill="currentColor" />
                    </svg>
                </button>

                <button
                    type="button"
                    className={`hud__rail-item ${fullscreen ? 'is-on' : ''}`}
                    onClick={toggleFullscreen}
                    title="Pantalla completa (F)"
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                        <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
                    </svg>
                </button>
            </aside>

            {/* ============ CROSSHAIR ============ */}
            <div className="hud__crosshair" aria-hidden="true">
                <span className="hud__crosshair-ring" />
                <span className="hud__crosshair-h" />
                <span className="hud__crosshair-v" />
            </div>

            {/* ============ BOTTOM BAR ============ */}
            <footer className="hud__bottom">
                <div className="hud__coords">
                    <div className="hud__coord">
                        <span className="hud__coord-label">RA</span>
                        <span className="hud__coord-value" ref={raRef}>00h 00m</span>
                    </div>
                    <div className="hud__coord">
                        <span className="hud__coord-label">DEC</span>
                        <span className="hud__coord-value" ref={decRef}>+00.0°</span>
                    </div>
                    <div className="hud__coord">
                        <span className="hud__coord-label">ZOOM</span>
                        <span className="hud__coord-value" ref={zoomRef}>1.00×</span>
                    </div>
                </div>

                <div className="hud__timeline">
                    <button
                        type="button"
                        className="hud__pause"
                        onClick={() => systemStore.togglePause()}
                        title={paused ? 'Reanudar (Space)' : 'Pausar (Space)'}
                        aria-label={paused ? 'Reanudar' : 'Pausar'}
                    >
                        {paused ? (
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                                <polygon points="6 3 20 12 6 21" />
                            </svg>
                        ) : (
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                                <rect x="6" y="4" width="4" height="16" />
                                <rect x="14" y="4" width="4" height="16" />
                            </svg>
                        )}
                    </button>

                    <span className="hud__timeline-label">Velocidad</span>

                    <input
                        type="range"
                        className="hud__slider"
                        min={0.1}
                        max={3}
                        step={0.1}
                        value={speed}
                        onChange={(e) => systemStore.setSpeed(parseFloat(e.target.value))}
                        aria-label="Velocidad orbital"
                    />

                    <span className="hud__timeline-value">{speed.toFixed(1)}×</span>

                    <span className="hud__timeline-sep" />

                    <span className="hud__clock" ref={timeRef}>T + 00:00:00</span>
                </div>

                <div className="hud__hint">
                    <span className="hud__hint-key">Espacio</span><span className="hud__hint-sep">·</span>
                    <span className="hud__hint-text">pausar</span>
                    <span className="hud__hint-sep">·</span>
                    <span className="hud__hint-key">R</span><span className="hud__hint-sep">·</span>
                    <span className="hud__hint-text">reset</span>
                    <span className="hud__hint-sep">·</span>
                    <span className="hud__hint-key">L</span><span className="hud__hint-sep">·</span>
                    <span className="hud__hint-text">etiquetas</span>
                    <span className="hud__hint-sep">·</span>
                    <span className="hud__hint-key">O</span><span className="hud__hint-sep">·</span>
                    <span className="hud__hint-text">órbitas</span>
                    <span className="hud__hint-sep">·</span>
                    <span className="hud__hint-key">F</span><span className="hud__hint-sep">·</span>
                    <span className="hud__hint-text">pantalla</span>
                </div>
            </footer>
        </div>
    )
}