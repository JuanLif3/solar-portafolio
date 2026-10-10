import { useState } from 'react'
import { Link } from 'react-router-dom'
import { DownloadButton } from '../components/DownloadButton'
import '../styles/PowerBI.css'

/* ============================================================
 *  CONFIG
 * ============================================================ */
const PBIX_DOWNLOAD_URL =
    'https://correoaiep-my.sharepoint.com/:u:/g/personal/juan_riverosp_correoaiep_cl/IQAaZGM-K2VxSL462Y0141XzASN3wPb2IjjsA7_o4gIlF1k?e=jrz1vr&download=1'

const PBIX_FILENAME = 'Proyecto_Colchagua.pbix'

/* ============================================================
 *  GALERÍA DE CAPTURAS DEL DASHBOARD
 * ============================================================ */
type Visual = {
    id: string
    n: string
    title: string
    subtitle: string
    description: string
    insight: string
    image: string
    wide?: boolean
}

const VISUALS: Visual[] = [
    {
        id: 'ranking-amenazas',
        n: '01',
        title: 'Ranking y perfil de amenazas',
        subtitle: 'Tabla · Scatter · Evolución temporal',
        description:
            'Vista principal del dashboard. Combina el ranking de comunas según vulnerabilidad, el cruce de amenaza vs impacto por comuna, y la evolución anual de precipitación contra las ventas del sector agropecuario.',
        insight:
            'Solo Chimbarongo y San Fernando califican como comunas críticas (alta fruticultura + alta siniestralidad). El resto mantiene perfil estándar.',
        image: '/powerbi/01-ranking-amenazas.png',
        wide: true,
    },
    {
        id: 'contexto',
        n: '02',
        title: 'Contexto del sector agro',
        subtitle: 'KPIs · Riego · Especies frutícolas',
        description:
            'Estado inicial del sector agropecuario de Colchagua: ventas totales (80M UF, $3.887M CLP), superficie por método de riego, ranking de las 30+ especies frutícolas cultivadas y mapa geográfico de incendios por comuna.',
        insight:
            'El 76% de la superficie se riega por goteo — el resto usa métodos más vulnerables. El cerezo lidera el cultivo con más de 10.000 unidades, siendo la especie más sensible a heladas.',
        image: '/powerbi/02-contexto.png',
        wide: true,
    },
    {
        id: 'proyeccion-ml',
        n: '03',
        title: 'Proyección ML · 2022-2023',
        subtitle: 'Forecast · Modelo predictivo · Series temporales',
        description:
            'Las cuatro proyecciones construidas con machine learning (Prophet + scikit-learn). Cada gráfico muestra la serie histórica 2018-2021 en línea continua y la proyección 2022-2023 en línea punteada, con intervalos de confianza.',
        insight:
            'El modelo predice que las hectáreas quemadas seguirán subiendo hacia 4.800 en 2023. Los días con olas de calor se estabilizarán en ~10 al año. La amenaza climática se consolida como régimen permanente, no como evento aislado.',
        image: '/powerbi/03-proyeccion-ml.png',
        wide: true,
    },
    {
        id: 'heladas',
        n: '04',
        title: 'Mapa de calor · Heladas por comuna',
        subtitle: 'Análisis espacio-temporal · 2018-2021',
        description:
            'Heatmap que cruza comunas (eje Y) contra años (eje X), coloreando cada celda según la severidad de las heladas registradas. Los tonos más intensos marcan los eventos climáticos más severos.',
        insight:
            'Chimbarongo (13 días), Nancagua (12), Pumanque (11) y San Fernando (11) superan sistemáticamente el promedio regional. La amenaza tiene geografía propia: no se distribuye parejo.',
        image: '/powerbi/04-heladas.png',
        wide: true,
    },
    {
        id: 'volatilidad',
        n: '05',
        title: 'Volatilidad laboral agrícola',
        subtitle: 'Boxplot por comuna · Distribución de trabajadores',
        description:
            'Diagrama de caja que muestra la dispersión de la cantidad de trabajadores agrícolas por comuna entre 2018-2021. Los bigotes indican el rango completo, la caja el 25-75% y la línea central la mediana.',
        insight:
            'San Fernando concentra los valores más altos pero también la mayor dispersión — la volatilidad laboral es un factor de vulnerabilidad tan relevante como el clima.',
        image: '/powerbi/05-volatilidad.png',
        wide: true,
    },
]

/* ============================================================
 *  KPIs RESUMEN
 * ============================================================ */
const KPIS = [
    { value: '+45,74%', label: 'Crecimiento agro 2018-2021' },
    { value: '5.300 ha', label: 'Hectáreas quemadas' },
    { value: '2', label: 'Comunas críticas' },
    { value: '10', label: 'Comunas analizadas' },
]

/* ============================================================
 *  CONCLUSIONES
 * ============================================================ */
const FINDINGS = [
    {
        n: '01',
        title: 'Dos comunas concentran el riesgo',
        body: 'Chimbarongo (3.125 ha quemadas) y San Fernando (1.268 ha) acumulan el 82% del daño territorial por incendios. Ambas combinan alta densidad de fruticultura con crecimiento económico sostenido — la tormenta perfecta para que un solo evento arrase con años de inversión.',
    },
    {
        n: '02',
        title: 'El crecimiento esconde fragilidad',
        body: 'Aunque las ventas crecen 45,74% en el período, Pumanque muestra un retroceso de −10,42% con solo 6 días de helada registrados. El impacto no es lineal ni homogéneo entre comunas: la vulnerabilidad no se distribuye parejo.',
    },
    {
        n: '03',
        title: 'Heladas con geografía propia',
        body: 'El mapa de calor espacio-temporal revela que Chepica (9 días), Chimbarongo (13), Nancagua (12), Pumanque (11) y San Fernando (11) superan sistemáticamente el promedio regional. La amenaza climática tiene territorio específico.',
    },
    {
        n: '04',
        title: 'Cerezo: rey y vulnerable',
        body: 'El cerezo lidera la superficie cultivada con más de 10 mil unidades, pero es la especie más sensible a heladas y al monocultivo. Una concentración productiva tan alta en una sola especie genera un punto único de falla para toda la economía regional.',
    },
    {
        n: '05',
        title: 'Olas de calor en ascenso',
        body: 'La proyección ML predice que los días con olas de calor se estabilizarán en ~10 al año, mientras las hectáreas quemadas seguirán subiendo hacia 4.800 en 2023. La amenaza climática ya no es un evento aislado, es un régimen permanente.',
    },
]

/* ============================================================
 *  STACK
 * ============================================================ */
const STACK = [
    { label: 'ETL',           value: 'Python · Pandas · Airflow' },
    { label: 'Datamart',      value: 'SQL Server · Modelo Estrella' },
    { label: 'DAX',           value: '48 medidas · Time Intelligence' },
    { label: 'ML/Forecast',   value: 'scikit-learn · Prophet' },
    { label: 'Visualización', value: 'Power BI Service' },
    { label: 'Fuentes',       value: 'CIREN · INE · Censo Agropecuario' },
]

/* ============================================================
 *  COMPONENTE
 * ============================================================ */
export function PowerBI() {
    const [openImage, setOpenImage] = useState<Visual | null>(null)

    return (
        <main className="pb">
            {/* ---------- Fondo ---------- */}
            <div className="pb__bg" aria-hidden="true">
                <div className="pb__bg-grid" />
                <div className="pb__bg-glow" />
            </div>

            <span className="pb__corner pb__corner--tl" />
            <span className="pb__corner pb__corner--tr" />
            <span className="pb__corner pb__corner--bl" />
            <span className="pb__corner pb__corner--br" />

            {/* ---------- Back ---------- */}
            <Link to="/" className="pb__back">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <line x1="19" y1="12" x2="5" y2="12" />
                    <polyline points="12 19 5 12 12 5" />
                </svg>
                <span>Volver al sistema</span>
            </Link>

            {/* ============ HERO ============ */}
            <header className="pb__hero">
                <div className="pb__hero-main">
                    <span className="pb__eyebrow">
                        <span className="pb__eyebrow-mark">◆</span>
                        Proyecto BI · Colchagua
                    </span>

                    <h1 className="pb__title">
                        Vulnerabilidad territorial de la fruticultura en <em>Colchagua</em>.
                    </h1>

                    <p className="pb__lede">
                        Análisis de datos reales sobre cómo las amenazas climáticas
                        —incendios y heladas— impactan al sector agropecuario de la
                        Región de O'Higgins. Un estudio que combina ETL, modelado
                        dimensional, DAX y machine learning para responder una
                        pregunta concreta: <strong>¿qué comunas y qué productores
                        son los más frágiles frente al cambio climático?</strong>
                    </p>
                </div>

                <aside className="pb__hero-side">
                    <div className="pb__meta">
                        <div className="pb__meta-item">
                            <span className="pb__meta-label">Período</span>
                            <span className="pb__meta-value">2018 – 2021</span>
                        </div>
                        <div className="pb__meta-item">
                            <span className="pb__meta-label">Alcance</span>
                            <span className="pb__meta-value">10 comunas</span>
                        </div>
                        <div className="pb__meta-item">
                            <span className="pb__meta-label">Registros</span>
                            <span className="pb__meta-value">+180.000</span>
                        </div>
                        <div className="pb__meta-item">
                            <span className="pb__meta-label">Vistas del reporte</span>
                            <span className="pb__meta-value">05 capturas</span>
                        </div>
                    </div>

                    <div className="pb__hero-cta">
                        <DownloadButton
                            url={PBIX_DOWNLOAD_URL}
                            filename={PBIX_FILENAME}
                            label="Descargar .pbix"
                        />
                        <Link to="/notebooks" className="pb__cta">
                            Ver notebooks
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                                 stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                 strokeLinejoin="round">
                                <line x1="5" y1="12" x2="19" y2="12" />
                                <polyline points="12 5 19 12 12 19" />
                            </svg>
                        </Link>
                    </div>

                    <div className="pb__notice">
                        <span className="pb__notice-mark">ℹ</span>
                        <div>
                            <strong>Dashboard interactivo.</strong> El informe completo
                            (filtros, drill-through, páginas cruzadas) está disponible
                            como archivo <code>Proyecto_Colchagua.pbix</code>.
                            Descárgalo y ábrelo con Power BI Desktop.
                        </div>
                    </div>
                </aside>
            </header>

            {/* ============ KPIs ============ */}
            <section className="pb__kpis">
                {KPIS.map((k) => (
                    <article key={k.label} className="pb__kpi">
                        <span className="pb__kpi-value">{k.value}</span>
                        <span className="pb__kpi-label">{k.label}</span>
                    </article>
                ))}
            </section>

            {/* ============ GALERÍA DE CAPTURAS ============ */}
            <section className="pb__visuals">
                <header className="pb__section-head">
                    <span className="pb__section-index">01</span>
                    <div>
                        <h2 className="pb__section-title">Vistas del dashboard</h2>
                        <p className="pb__section-desc">
                            Cinco capturas del reporte en Power BI Desktop.
                            Haz clic en cualquiera para verla en tamaño completo.
                        </p>
                    </div>
                </header>

                <div className="pb__visuals-grid">
                    {VISUALS.map((v) => (
                        <article
                            key={v.id}
                            className={`pb-visual ${v.wide ? 'pb-visual--wide' : ''}`}
                            onClick={() => setOpenImage(v)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault()
                                    setOpenImage(v)
                                }
                            }}
                        >
                            <span className="pb-visual__bracket pb-visual__bracket--tl" />
                            <span className="pb-visual__bracket pb-visual__bracket--tr" />
                            <span className="pb-visual__bracket pb-visual__bracket--bl" />
                            <span className="pb-visual__bracket pb-visual__bracket--br" />

                            <header className="pb-visual__head">
                                <span className="pb-visual__n">{v.n}</span>
                                <span className="pb-visual__subtitle">{v.subtitle}</span>
                            </header>

                            <div className="pb-visual__img-wrap">
                                <img
                                    src={v.image}
                                    alt={v.title}
                                    loading="lazy"
                                    className="pb-visual__img"
                                />
                                <span className="pb-visual__zoom" aria-hidden="true">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                        <circle cx="11" cy="11" r="8" />
                                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                        <line x1="11" y1="8" x2="11" y2="14" />
                                        <line x1="8" y1="11" x2="14" y2="11" />
                                    </svg>
                                </span>
                            </div>

                            <h3 className="pb-visual__title">{v.title}</h3>
                            <p className="pb-visual__desc">{v.description}</p>

                            <div className="pb-visual__insight">
                                <span className="pb-visual__insight-mark">▸</span>
                                <span>{v.insight}</span>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            {/* ============ CONCLUSIONES ============ */}
            <section className="pb__findings">
                <header className="pb__section-head">
                    <span className="pb__section-index">02</span>
                    <div>
                        <h2 className="pb__section-title">Conclusiones sobre vulnerabilidad</h2>
                        <p className="pb__section-desc">
                            Cinco hallazgos accionables para tomadores de decisión.
                        </p>
                    </div>
                </header>

                <ol className="pb__findings-list">
                    {FINDINGS.map((f) => (
                        <li key={f.n} className="pb__finding">
                            <span className="pb__finding-n">{f.n}</span>
                            <div className="pb__finding-body">
                                <h3 className="pb__finding-title">{f.title}</h3>
                                <p className="pb__finding-text">{f.body}</p>
                            </div>
                        </li>
                    ))}
                </ol>

                <aside className="pb__caveat">
                    <span className="pb__caveat-mark">⚠</span>
                    <div>
                        <strong>Nota metodológica.</strong> Los resultados muestran{' '}
                        <em>correlación</em>, no causalidad directa. Otros factores
                        (precios de mercado, políticas públicas, decisiones individuales)
                        también inciden. Los números deben leerse como evidencia para
                        priorizar, no como veredicto.
                    </div>
                </aside>
            </section>

            {/* ============ STACK ============ */}
            <section className="pb__stack">
                <header className="pb__section-head">
                    <span className="pb__section-index">03</span>
                    <div>
                        <h2 className="pb__section-title">Stack técnico</h2>
                        <p className="pb__section-desc">
                            Cómo se construyó el análisis, de principio a fin.
                        </p>
                    </div>
                </header>

                <ul className="pb__stack-list">
                    {STACK.map((s) => (
                        <li key={s.label} className="pb__stack-item">
                            <span className="pb__stack-label">{s.label}</span>
                            <span className="pb__stack-dots" />
                            <span className="pb__stack-value">{s.value}</span>
                        </li>
                    ))}
                </ul>

                <div className="pb__cta-row">
                    <Link to="/notebooks" className="pb__cta pb__cta--primary">
                        Ver notebooks de análisis
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                             stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                             strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12" />
                            <polyline points="12 5 19 12 12 19" />
                        </svg>
                    </Link>

                    <DownloadButton
                        url={PBIX_DOWNLOAD_URL}
                        filename={PBIX_FILENAME}
                        label="Descargar .pbix"
                    />
                </div>
            </section>

            {/* ---------- Footer ---------- */}
            <footer className="pb__foot">
                <span>// Proyecto ISI802 · Business Intelligence</span>
                <span>Región de O'Higgins · Chile</span>
            </footer>

            {/* ============ LIGHTBOX ============ */}
            {openImage && (
                <div
                    className="pb-lightbox"
                    onClick={() => setOpenImage(null)}
                    role="dialog"
                    aria-modal="true"
                >
                    <button
                        type="button"
                        className="pb-lightbox__close"
                        onClick={() => setOpenImage(null)}
                        aria-label="Cerrar"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                             stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>

                    <div
                        className="pb-lightbox__inner"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <header className="pb-lightbox__head">
                            <span className="pb-lightbox__n">{openImage.n}</span>
                            <div>
                                <h3 className="pb-lightbox__title">{openImage.title}</h3>
                                <span className="pb-lightbox__subtitle">
                                    {openImage.subtitle}
                                </span>
                            </div>
                        </header>

                        <img
                            src={openImage.image}
                            alt={openImage.title}
                            className="pb-lightbox__img"
                        />

                        <div className="pb-lightbox__body">
                            <p className="pb-lightbox__desc">{openImage.description}</p>
                            <p className="pb-lightbox__insight">
                                <span className="pb-lightbox__insight-mark">▸</span>
                                {openImage.insight}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </main>
    )
}