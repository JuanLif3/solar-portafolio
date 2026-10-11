import { Link } from 'react-router-dom'
import '../styles/SiteFooter.css'

type SiteFooterProps = {
    projectLabel: string
    location?: string
}

export function SiteFooter({
                               projectLabel,
                               location = "Región de O'Higgins · Chile",
                           }: SiteFooterProps) {
    const year = new Date().getFullYear()

    return (
        <footer className="site-footer">
            <span className="site-footer__corner site-footer__corner--tl" />
            <span className="site-footer__corner site-footer__corner--tr" />
            <span className="site-footer__corner site-footer__corner--bl" />
            <span className="site-footer__corner site-footer__corner--br" />

            <div className="site-footer__grid">
                {/* Columna 1 · Brand */}
                <div className="site-footer__col site-footer__col--brand">
                    <span className="site-footer__brand-mark">◆</span>
                    <div>
                        <span className="site-footer__brand-name">Juan Riveros</span>
                        <span className="site-footer__brand-role">
                            Full Stack Developer · BI
                        </span>
                    </div>
                </div>

                {/* Columna 2 · Navegación */}
                <div className="site-footer__col">
                    <span className="site-footer__label">Navegación</span>
                    <ul className="site-footer__list">
                        <li><Link to="/">Sistema solar</Link></li>
                        <li><Link to="/proyectos">Proyectos</Link></li>
                        <li><Link to="/powerbi">Power BI</Link></li>
                        <li><Link to="/notebooks">Notebooks</Link></li>
                    </ul>
                </div>

                {/* Columna 3 · Contacto */}
                <div className="site-footer__col">
                    <span className="site-footer__label">Contacto</span>
                    <ul className="site-footer__list">
                        <li>
                            <a href="https://github.com/JuanLif3" target="_blank" rel="noreferrer">
                                GitHub
                            </a>
                        </li>
                        <li>
                            <a href="mailto:juan.riverosp@correoaiep.cl">
                                juan.riverosp@correoaiep.cl
                            </a>
                        </li>
                    </ul>
                </div>

                {/* Columna 4 · Declaración IA */}
                <div className="site-footer__col site-footer__col--ai">
                    <span className="site-footer__label site-footer__label--ai">
                        <span className="site-footer__ai-dot" />
                        Declaración de IA
                    </span>
                    <p className="site-footer__ai-text">
                        Asistencia usada para revisión de código, redacción
                        y variantes visuales. Todo el código fue comprendido
                        y adaptado por el autor. La IA fue copiloto, no piloto.
                    </p>
                </div>
            </div>

            {/* Barra inferior */}
            <div className="site-footer__bottom">
                <span className="site-footer__meta">
                    // {projectLabel}
                </span>
                <span className="site-footer__meta site-footer__meta--mid">
                    {location}
                </span>
                <span className="site-footer__meta">
                    © {year} · Todos los derechos reservados
                </span>
            </div>
        </footer>
    )
}