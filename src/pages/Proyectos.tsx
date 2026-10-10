import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import './Proyectos.css'

/* ============================================================
 *  TIPOS & DATOS
 * ============================================================ */
type Category = 'bi' | 'ml' | 'etl' | 'web'

type Project = {
    id: string
    index: string
    title: string
    subtitle: string
    description: string
    tags: string[]
    year: string
    category: Category
    status: 'live' | 'wip' | 'archived'
    href: string
    external?: string
}

const CATEGORY_LABEL: Record<Category, string> = {
    bi:   'Business Intelligence',
    ml:   'Machine Learning',
    etl:  'ETL / Data',
    web:  'Web / App',
}

const STATUS_LABEL: Record<Project['status'], string> = {
    live:     'En línea',
    wip:      'En desarrollo',
    archived: 'Archivado',
}

const PROJECTS: Project[] = [
    {
        id: 'zeroknowledge',
        index: '01',
        title: 'Zero Knowledge · Gestor de Contraseñas',
        subtitle: 'Cifrado end-to-end · Zero-knowledge',
        description:
            'Gestor de contraseñas con arquitectura zero-knowledge: el servidor nunca ve las credenciales en texto plano. Cifrado en cliente, derivación de claves y almacenamiento seguro de bóvedas por usuario.',
        tags: ['React', 'TypeScript', 'Cifrado', 'Node.js'],
        year: '2025',
        category: 'web',
        status: 'live',
        href: 'https://zeroknowledge-frontend.vercel.app/',
        external: 'https://zeroknowledge-frontend.vercel.app/',
    },
    {
        id: 'finanzas-villa',
        index: '02',
        title: 'Finanzas Villa · Gestión para Tesorería',
        subtitle: 'Ingresos · Egresos · Reportes comunitarios',
        description:
            'Sistema de gestión financiera para la tesorería de una villa: registro de ingresos y egresos, control de cuotas por vecino, historial de movimientos y reportes claros para la comunidad. En producción, usado por la tesorera real.',
        tags: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
        year: '2025',
        category: 'web',
        status: 'live',
        href: 'https://finanzas-villa.vercel.app/login',
        external: 'https://finanzas-villa.vercel.app/login',
    },
    {
        id: 'bletchley',
        index: '03',
        title: 'Bletchley · Mensajería Reinventada',
        subtitle: 'Alternativa a WhatsApp · +200% features',
        description:
            'Mensajería instantánea con mejoras sustanciales sobre WhatsApp: privacidad reforzada, features propias y arquitectura moderna. Proyecto en desarrollo activo — el nombre es un guiño a Bletchley Park, cuna de la criptografía moderna.',
        tags: ['React', 'TypeScript', 'WebSockets', 'Node.js'],
        year: '2025',
        category: 'web',
        status: 'wip',
        href: 'https://github.com/JuanLif3/Bletchley.git',
        external: 'https://github.com/JuanLif3/Bletchley.git',
    },
]

/* ============================================================
 *  COMPONENTE
 * ============================================================ */
type Filter = 'all' | Category

export function Proyectos() {
    const [filter, setFilter] = useState<Filter>('all')

    const filtered = useMemo(() => {
        if (filter === 'all') return PROJECTS
        return PROJECTS.filter((p) => p.category === filter)
    }, [filter])

    const counts = useMemo(() => {
        const c: Record<Filter, number> = {
            all: PROJECTS.length,
            bi:  0,
            ml:  0,
            etl: 0,
            web: 0,
        }
        for (const p of PROJECTS) c[p.category]++
        return c
    }, [])

    return (
        <main className="proyectos">
            {/* ---------- Fondo estelar ---------- */}
            <div className="proyectos__bg" aria-hidden="true">
                <div className="proyectos__bg-grid" />
                <div className="proyectos__bg-glow" />
            </div>

            {/* ---------- Esquinas HUD ---------- */}
            <span className="proyectos__corner proyectos__corner--tl" />
            <span className="proyectos__corner proyectos__corner--tr" />
            <span className="proyectos__corner proyectos__corner--bl" />
            <span className="proyectos__corner proyectos__corner--br" />

            {/* ---------- Back ---------- */}
            <Link to="/" className="proyectos__back">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                     strokeLinejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12" />
                    <polyline points="12 19 5 12 12 5" />
                </svg>
                <span>Volver al sistema</span>
            </Link>

            {/* ---------- Header ---------- */}
            <header className="proyectos__header">
        <span className="proyectos__eyebrow">
          <span className="proyectos__eyebrow-mark">◆</span>
          Archivo · 03
        </span>

                <h1 className="proyectos__title">
                    Proyectos <em>desplegados</em>.
                </h1>

                <p className="proyectos__subtitle">
                    Aplicaciones web reales, en producción, usadas por personas reales.
                    Desde un gestor de contraseñas con cifrado zero-knowledge hasta
                    sistemas de gestión financiera y mensajería.
                </p>

                {/* Filters */}
                <nav className="proyectos__filters" aria-label="Filtros">
                    {(['all', 'bi', 'ml', 'etl', 'web'] as Filter[]).map((f) => (
                        <button
                            key={f}
                            type="button"
                            className={`proyectos__filter ${filter === f ? 'is-active' : ''}`}
                            onClick={() => setFilter(f)}
                        >
              <span className="proyectos__filter-label">
                {f === 'all' ? 'Todos' : CATEGORY_LABEL[f]}
              </span>
                            <span className="proyectos__filter-count">
                {String(counts[f]).padStart(2, '0')}
              </span>
                        </button>
                    ))}
                </nav>
            </header>

            {/* ---------- Grid ---------- */}
            <section className="proyectos__grid">
                {filtered.map((p) => (
                    <a
                        key={p.id}
                        href={p.external ?? p.href}
                        target={p.external ? '_blank' : undefined}
                        rel={p.external ? 'noreferrer' : undefined}
                        className="project-card"
                        data-status={p.status}
                    >
                        {/* Corner brackets */}
                        <span className="project-card__bracket project-card__bracket--tl" />
                        <span className="project-card__bracket project-card__bracket--tr" />
                        <span className="project-card__bracket project-card__bracket--bl" />
                        <span className="project-card__bracket project-card__bracket--br" />

                        {/* Header */}
                        <div className="project-card__head">
                            <span className="project-card__index">{p.index}</span>
                            <span className={`project-card__status project-card__status--${p.status}`}>
                <span className="project-card__status-dot" />
                                {STATUS_LABEL[p.status]}
              </span>
                        </div>

                        {/* Title */}
                        <h2 className="project-card__title">{p.title}</h2>
                        <span className="project-card__subtitle">{p.subtitle}</span>

                        {/* Description */}
                        <p className="project-card__desc">{p.description}</p>

                        {/* Tags */}
                        <ul className="project-card__tags">
                            {p.tags.map((t) => (
                                <li key={t}>{t}</li>
                            ))}
                        </ul>

                        {/* Footer */}
                        <footer className="project-card__foot">
              <span className="project-card__category">
                {CATEGORY_LABEL[p.category]}
              </span>
                            <span className="project-card__year">{p.year}</span>
                            <span className="project-card__cta">
                {p.status === 'wip' ? 'Ver en GitHub' : 'Abrir'}
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                                     stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                     strokeLinejoin="round">
                  <line x1="7" y1="17" x2="17" y2="7" />
                  <polyline points="7 7 17 7 17 17" />
                </svg>
              </span>
                        </footer>
                    </a>
                ))}

                {filtered.length === 0 && (
                    <div className="proyectos__empty">
                        <span className="proyectos__empty-mark">◇</span>
                        <p>No hay proyectos en esta categoría todavía.</p>
                    </div>
                )}
            </section>

            {/* ---------- Footer ---------- */}
            <footer className="proyectos__foot">
                <span>// {filtered.length} proyectos · {counts.all} totales</span>
                <span>Repositorio · github.com/JuanLif3</span>
            </footer>
        </main>
    )
}