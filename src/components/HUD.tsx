import '../styles/HUD.css'

const SECTIONS = [
    'Inicio',
    'Sobre mí',
    'Proyectos',
    'Experiencia',
    'Stack',
    'Certificaciones',
    'Blog',
    'Contacto',
]

export function HUD() {
    return (
        <div className="hud">
            {/* Esquinas HUD */}
            <span className="hud__corner hud__corner--tl" />
            <span className="hud__corner hud__corner--tr" />
            <span className="hud__corner hud__corner--bl" />
            <span className="hud__corner hud__corner--br" />

            {/* Top bar */}
            <header className="hud__top">
                <div className="hud__brand">
                    <span className="hud__brand-mark">◆</span>
                    <span className="hud__brand-name">Sistema Solar</span>
                    <span className="hud__brand-sep">·</span>
                    <span className="hud__brand-sub">Portafolio</span>
                </div>

                <nav className="hud__nav">
                    {SECTIONS.map((s, i) => (
                        <button key={s} className="hud__nav-item" type="button">
                            <span className="hud__nav-index">{String(i + 1).padStart(2, '0')}</span>
                            <span className="hud__nav-label">{s}</span>
                        </button>
                    ))}
                </nav>

                <div className="hud__status">
                    <span className="hud__status-dot" />
                    <span className="hud__status-text">LIVE</span>
                </div>
            </header>

            {/* Left rail */}
            <aside className="hud__left">
                <span className="hud__rail-item">◎</span>
                <span className="hud__rail-item">✦</span>
                <span className="hud__rail-item">◈</span>
                <span className="hud__rail-item">◇</span>
            </aside>

            {/* Crosshair central */}
            <div className="hud__crosshair" aria-hidden="true">
                <span className="hud__crosshair-ring" />
                <span className="hud__crosshair-h" />
                <span className="hud__crosshair-v" />
            </div>

            {/* Bottom bar */}
            <footer className="hud__bottom">
                <div className="hud__coords">
                    <div className="hud__coord">
                        <span className="hud__coord-label">RA</span>
                        <span className="hud__coord-value">05h 42m</span>
                    </div>
                    <div className="hud__coord">
                        <span className="hud__coord-label">DEC</span>
                        <span className="hud__coord-value">−12° 34′</span>
                    </div>
                    <div className="hud__coord">
                        <span className="hud__coord-label">ZOOM</span>
                        <span className="hud__coord-value">1.00×</span>
                    </div>
                </div>

                <div className="hud__timeline">
                    <span className="hud__timeline-label">Órbita</span>
                    <div className="hud__timeline-track">
                        <div className="hud__timeline-fill" />
                        <span className="hud__timeline-marker" />
                    </div>
                    <span className="hud__timeline-value">T + 00:00:00</span>
                </div>

                <div className="hud__hint">
                    <span className="hud__hint-key">Arrastrar</span>
                    <span className="hud__hint-sep">·</span>
                    <span className="hud__hint-text">rotar</span>
                    <span className="hud__hint-sep">·</span>
                    <span className="hud__hint-key">Rueda</span>
                    <span className="hud__hint-sep">·</span>
                    <span className="hud__hint-text">zoom</span>
                </div>
            </footer>
        </div>
    )
}