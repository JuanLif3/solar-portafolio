import { systemStore, useSystemState } from '../store/system'
import './PlanetPanel.css'

type Info = {
    index: string
    title: string
    subtitle: string
    description: string
    bullets: string[]
}

const SECTION_INFO: Record<string, Info> = {
    '01 · Inicio': {
        index: '01',
        title: 'Inicio',
        subtitle: 'El punto de partida',
        description:
            'Aquí comienza el recorrido. Un portafolio interactivo diseñado como un sistema solar en constante movimiento, donde cada planeta representa una parte de mi trabajo.',
        bullets: ['Portafolio interactivo', 'Diseño 3D en tiempo real', 'Navegación orbital'],
    },
    '02 · Sobre mí': {
        index: '02',
        title: 'Sobre mí',
        subtitle: 'Quién está detrás',
        description:
            'Desarrollador full stack con foco en experiencias web rápidas, accesibles y con atención obsesiva al detalle. Me interesan los productos que se sienten vivos.',
        bullets: ['Full Stack Developer', 'React + TypeScript', 'Node.js + PostgreSQL'],
    },
    '03 · Proyectos': {
        index: '03',
        title: 'Proyectos',
        subtitle: 'Lo que he construido',
        description:
            'Una selección de sistemas que he diseñado e implementado de punta a punta: desde dashboards en tiempo real hasta pipelines de datos.',
        bullets: ['Análisis orbital', 'Motor de recomendación', 'Editor colaborativo'],
    },
    '04 · Experiencia': {
        index: '04',
        title: 'Experiencia',
        subtitle: 'Dónde he estado',
        description:
            'Trayectoria profesional construyendo productos digitales junto a equipos de producto, diseño y datos. Desde startups hasta proyectos de escala.',
        bullets: ['Empresas tech', 'Equipos distribuidos', 'Metodologías ágiles'],
    },
    '05 · Stack': {
        index: '05',
        title: 'Stack',
        subtitle: 'Con qué trabajo',
        description:
            'Las herramientas con las que construyo día a día. React, TypeScript, Node.js, PostgreSQL, Docker, AWS y un largo etcétera de tecnologías.',
        bullets: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'AWS'],
    },
    '06 · Certificaciones': {
        index: '06',
        title: 'Certificaciones',
        subtitle: 'Formación continua',
        description:
            'Cursos, certificaciones y formación continua que mantienen el conocimiento al día en un campo que cambia cada seis meses.',
        bullets: ['AWS Certified', 'Meta Frontend', 'Google Cloud'],
    },
    '07 · Blog': {
        index: '07',
        title: 'Blog',
        subtitle: 'Lo que escribo',
        description:
            'Notas técnicas, reflexiones sobre desarrollo y ensayos sobre la intersección entre software, diseño y producto.',
        bullets: ['Artículos técnicos', 'Ensayos de producto', 'Notas de aprendizaje'],
    },
    '08 · Contacto': {
        index: '08',
        title: 'Contacto',
        subtitle: 'Hablemos',
        description:
            '¿Tienes un proyecto en mente o simplemente quieres saludar? Mi bandeja de entrada está siempre abierta.',
        bullets: ['Email', 'GitHub', 'LinkedIn'],
    },
}

export function PlanetPanel() {
    const { focusedPlanet } = useSystemState()
    const info = focusedPlanet ? SECTION_INFO[focusedPlanet] : null

    if (!focusedPlanet || !info) return null

    return (
        <aside className="planet-panel" role="dialog" aria-modal="false">
            <header className="planet-panel__head">
                <span className="planet-panel__index">{info.index}</span>
                <span className="planet-panel__catalog">{focusedPlanet}</span>
                <button
                    type="button"
                    className="planet-panel__close"
                    onClick={() => systemStore.setFocusedPlanet(null)}
                    aria-label="Cerrar panel"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>
            </header>

            <div className="planet-panel__body">
                <p className="planet-panel__subtitle">{info.subtitle}</p>
                <h2 className="planet-panel__title">{info.title}</h2>
                <p className="planet-panel__desc">{info.description}</p>

                <div className="planet-panel__section">
                    <span className="planet-panel__label">Destacado</span>
                    <ul className="planet-panel__bullets">
                        {info.bullets.map((b) => (
                            <li key={b}>
                                <span className="planet-panel__bullet-dot" />
                                {b}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <footer className="planet-panel__foot">
        <span className="planet-panel__hint">
          Presiona <kbd>Esc</kbd> para volver a la vista general
        </span>
            </footer>
        </aside>
    )
}