import { Link } from 'react-router-dom'
import './styles/Notebooks.css'

/* ============================================================
 *  CONFIG — URLs del notebook
 *  Reemplaza GITHUB_USER/REPO si cambia
 * ============================================================ */
const COLAB_URL =
    'https://colab.research.google.com/drive/1jBhoUPe6ihNb3irfjyFBdul8XhiYQS2Y?usp=sharing'

const GITHUB_USER = 'JuanLif3'
const GITHUB_REPO = 'colchagua-bi'
const GITHUB_URL = `https://github.com/Crisx-Dev/Proyecto_Analitica_Colchagua.git`

/* ============================================================
 *  META
 * ============================================================ */
const KPIS = [
    { value: '06', label: 'Fases documentadas' },
    { value: '04', label: 'Fuentes de datos' },
    { value: '16', label: 'CSV generados' },
    { value: '03', label: 'Modelos ML' },
]

/* ============================================================
 *  FASES DEL NOTEBOOK
 * ============================================================ */
type Phase = {
    id: string
    n: string
    title: string
    subtitle: string
    description: string
    bullets: string[]
    tools: string[]
    outputs: { label: string; value: string }[]
}

const PHASES: Phase[] = [
    {
        id: 'etl-odepa',
        n: '01',
        title: 'ETL · Catastro Frutícola ODEPA',
        subtitle: 'Fuente: CIREN / ODEPA 2021',
        description:
            'Carga, filtrado por provincia y limpieza del Catastro Frutícola Nacional. Se descartan las filas de Cachapoal y Cardenal Caro, y se normaliza el separador decimal de la columna de superficie (coma → punto).',
        bullets: [
            'Detección automática del encoding (utf-8-sig, utf-8, latin-1)',
            'Filtro Provincia == "COLCHAGUA" (11.269 filas de 34.656)',
            'Eliminación de columnas irrelevantes (_id, ID region, Region)',
            'Conversión de Superficie (ha) de formato chileno a float',
        ],
        tools: ['pandas', 'google.colab.files', 'numpy'],
        outputs: [
            { label: 'Filas', value: '11.269' },
            { label: 'Comunas', value: '10' },
            { label: 'Especies', value: '31' },
            { label: 'Superficie', value: '30.820 ha' },
        ],
    },
    {
        id: 'etl-incendios',
        n: '02',
        title: 'ETL · Incendios Forestales CONAF',
        subtitle: 'Fuente: CONAF 2018-2021',
        description:
            'Parseo de un Excel con múltiples hojas (una por temporada). Se detecta dinámicamente la fila de encabezado y se normalizan las columnas a nombres consistentes. Se consolida una sola tabla con las 4 temporadas.',
        bullets: [
            'Iteración sobre hojas con header variable por temporada',
            'Detección automática de la fila de encabezado (primeras 15 filas)',
            'Filtro por provincia Colchagua',
            'Conversión de formatos numéricos chilenos a estándar',
        ],
        tools: ['pandas', 'numpy', 'openpyxl'],
        outputs: [
            { label: 'Temporadas', value: '04' },
            { label: 'Registros', value: '40' },
            { label: 'Ha quemadas', value: '5.300' },
            { label: 'Comunas', value: '10' },
        ],
    },
    {
        id: 'etl-economia',
        n: '03',
        title: 'ETL · Economía PYME (SII)',
        subtitle: 'Fuente: SII · Comuna + CIIU 4 dígitos',
        description:
            'Concatenación del Datamart original (2018-2020) con el año 2021 extraído desde el archivo tabulado del SII. Se filtra por Región O\'Higgins y las 10 comunas objetivo.',
        bullets: [
            'Carga del TXT con separador tab + encoding latin-1',
            'Filtro robusto por región (normaliza tildes y apóstrofes)',
            'Limpieza de números con separador de miles chileno',
            'Concatenación con datamart existente (2018-2020)',
        ],
        tools: ['pandas', 'numpy', 'regex'],
        outputs: [
            { label: 'Años', value: '2018-2021' },
            { label: 'Actividades', value: 'CIIU múltiple' },
            { label: 'Comunas', value: '10' },
            { label: 'Métricas', value: '3 dimensiones' },
        ],
    },
    {
        id: 'etl-clima',
        n: '04',
        title: 'ETL · Clima Diario (ERA5)',
        subtitle: 'Fuente: Open-Meteo · Reanálisis ERA5',
        description:
            'Consolidación de series diarias de temperatura mínima, máxima y precipitación para cada comuna. Se usa regex para parsear el nombre de la comuna desde el nombre del archivo y se filtra al período 2018-2021.',
        bullets: [
            'Lectura de CSV con metadatos (skiprows=3)',
            'Extracción del nombre de comuna desde el nombre del archivo',
            'Filtro por rango de fechas (2018-01-01 a 2021-12-31)',
            'Consolidación de múltiples archivos en un solo DataFrame',
        ],
        tools: ['pandas', 'io', 're'],
        outputs: [
            { label: 'Registros', value: '+14.000' },
            { label: 'Comunas', value: '10' },
            { label: 'Período', value: '4 años' },
            { label: 'Variables', value: 'tmin · tmax' },
        ],
    },
    {
        id: 'modelo-estrella',
        n: '05',
        title: 'Modelo Estrella',
        subtitle: 'Datamart dimensional · 6 dims + 5 facts',
        description:
            'Diseño e implementación del modelo dimensional en estrella. Se construyen las dimensiones (comuna, tiempo diario, tiempo mensual, actividad, especie, riego) y las tablas de hechos para cada fuente. Cada fact incluye variables derivadas.',
        bullets: [
            'dim_comuna · dim_tiempo · dim_tiempo_mes',
            'dim_actividad (con código CIIU) · dim_especie · dim_riego',
            'fact_clima_diario (flags: helada, frío, calor, ola_calor)',
            'fact_clima_anual · fact_incendios · fact_economia · fact_fruticola',
        ],
        tools: ['pandas', 'numpy'],
        outputs: [
            { label: 'Dimensiones', value: '06' },
            { label: 'Hechos', value: '05' },
            { label: 'Flags clima', value: '04' },
            { label: 'Validación', value: 'id_comuna OK' },
        ],
    },
    {
        id: 'analitica',
        n: '06',
        title: 'Analítica · Clustering + Forecast',
        subtitle: 'K-Means · SARIMA · Holt-Winters',
        description:
            'Análisis no supervisado (K-Means con k=2 óptimo por silhouette) sobre 7 features de vulnerabilidad, y proyección de precipitación con SARIMA y Holt-Winters comparadas contra baseline naive.',
        bullets: [
            'K-Means con búsqueda de k óptimo (silhouette + inercia)',
            'PCA para visualización 2D de clusters',
            'SARIMA(1,0,0)(1,0,0,12) vs Holt-Winters vs Seasonal Naive',
            'Forecast final 24 meses con IC 95%',
        ],
        tools: ['scikit-learn', 'statsmodels', 'matplotlib', 'seaborn'],
        outputs: [
            { label: 'Clusters', value: 'k = 2' },
            { label: 'Features', value: '07' },
            { label: 'Modelos', value: 'SARIMA·HW' },
            { label: 'Forecast', value: '24 meses' },
        ],
    },
]

/* ============================================================
 *  HALLAZGOS
 * ============================================================ */
const FINDINGS = [
    {
        n: 'H1',
        title: 'Riesgo de concentración laboral provincial',
        body: 'Chimbarongo (12.000+) y San Fernando (14.000+) concentran la masa laboral agrícola provincial. Un shock en cualquiera de ellas arrastra las métricas de toda la provincia, no solo de la comuna afectada.',
    },
    {
        n: 'H2',
        title: 'Asimetría de amenazas climáticas',
        body: 'Chimbarongo concentró casi el 60% de la superficie quemada provincial (3.125 ha). Y existe brecha térmica severa: Lolol promedia 0,5 días de helada al año, mientras Chimbarongo supera los 8.',
    },
    {
        n: 'H3',
        title: 'Resiliencia de ventas vs colapso del empleo',
        body: 'Las ventas del sector crecieron +45,74% en el período, pero el empleo agrícola se desplomó en 2021 volviendo a niveles de 2018. Las PYMEs sobrevivieron a costa de reducir personal.',
    },
    {
        n: 'H4',
        title: 'Clustering K-Means: 2 perfiles territoriales',
        body: 'Cluster 0 (estándar): 8 comunas con menor exposición. Cluster 1 (crítica): Chimbarongo y San Fernando, que combinan la mayor fruticultura con los peores índices de incendios, heladas y monocultivo.',
    },
    {
        n: 'H5',
        title: 'Forecast ML · Proyección 2023',
        body: 'Modelo Holt-Winters predice que las hectáreas quemadas seguirán subiendo hacia 4.800 ha en 2023 y los días con olas de calor se estabilizarán en ~10 al año. La amenaza es un régimen permanente.',
    },
]

/* ============================================================
 *  COMPONENTE
 * ============================================================ */
export function Notebooks() {
    return (
        <main className="nb">
            {/* ---------- Fondo ---------- */}
            <div className="nb__bg" aria-hidden="true">
                <div className="nb__bg-grid" />
                <div className="nb__bg-glow" />
            </div>

            <span className="nb__corner nb__corner--tl" />
            <span className="nb__corner nb__corner--tr" />
            <span className="nb__corner nb__corner--bl" />
            <span className="nb__corner nb__corner--br" />

            {/* ---------- Back ---------- */}
            <Link to="/" className="nb__back">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <line x1="19" y1="12" x2="5" y2="12" />
                    <polyline points="12 19 5 12 12 5" />
                </svg>
                <span>Volver al sistema</span>
            </Link>

            {/* ============ HERO ============ */}
            <header className="nb__hero">
                <span className="nb__eyebrow">
                    <span className="nb__eyebrow-mark">◆</span>
                    Proyecto BI · Notebooks
                </span>

                <h1 className="nb__title">
                    Análisis reproducible en <em>6 fases</em>.
                </h1>

                <p className="nb__lede">
                    Un solo notebook en Google Colab que documenta el pipeline
                    completo de Business Intelligence: desde la extracción cruda
                    de 4 fuentes oficiales (ODEPA, CONAF, SII, ERA5) hasta el
                    clustering no supervisado, el forecast de series temporales
                    y la construcción de un modelo dimensional en estrella.
                </p>

                {/* Barra de acciones */}
                <div className="nb__actions">
                    <a
                        href={COLAB_URL}
                        target="_blank"
                        rel="noreferrer"
                        className="nb__action nb__action--primary"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                             stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                             strokeLinejoin="round">
                            <path d="M12 2 L2 12 L12 22 L22 12 Z" />
                        </svg>
                        Abrir en Google Colab
                    </a>

                    <a
                        href={GITHUB_URL}
                        target="_blank"
                        rel="noreferrer"
                        className="nb__action"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2c-3.2.7-3.87-1.54-3.87-1.54-.53-1.35-1.3-1.71-1.3-1.71-1.06-.72.08-.71.08-.71 1.17.08 1.79 1.2 1.79 1.2 1.04 1.79 2.73 1.27 3.4.97.11-.75.41-1.27.75-1.56-2.55-.29-5.24-1.28-5.24-5.68 0-1.25.45-2.28 1.19-3.08-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.06 11.06 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.12 3.05.74.8 1.19 1.83 1.19 3.08 0 4.41-2.69 5.38-5.25 5.67.42.36.79 1.07.79 2.16v3.2c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5z" />
                        </svg>
                        Ver repo en GitHub
                    </a>

                    <span className="nb__file">
                        <span className="nb__file-dot" />
                        Entrega_Final.ipynb
                    </span>
                </div>

                {/* KPIs */}
                <div className="nb__meta">
                    {KPIS.map((k) => (
                        <div key={k.label} className="nb__meta-item">
                            <span className="nb__meta-label">{k.label}</span>
                            <span className="nb__meta-value">{k.value}</span>
                        </div>
                    ))}
                </div>
            </header>

            {/* ============ FASES ============ */}
            <section className="nb__phases">
                <header className="nb__section-head">
                    <span className="nb__section-index">01</span>
                    <div>
                        <h2 className="nb__section-title">Pipeline paso a paso</h2>
                        <p className="nb__section-desc">
                            Las 6 fases del notebook, con sus inputs, transformaciones
                            y outputs verificables.
                        </p>
                    </div>
                </header>

                <div className="nb__phases-grid">
                    {PHASES.map((p) => (
                        <article key={p.id} className="nb-phase">
                            <span className="nb-phase__bracket nb-phase__bracket--tl" />
                            <span className="nb-phase__bracket nb-phase__bracket--tr" />
                            <span className="nb-phase__bracket nb-phase__bracket--bl" />
                            <span className="nb-phase__bracket nb-phase__bracket--br" />

                            <header className="nb-phase__head">
                                <span className="nb-phase__n">{p.n}</span>
                                <div className="nb-phase__head-body">
                                    <h3 className="nb-phase__title">{p.title}</h3>
                                    <span className="nb-phase__subtitle">{p.subtitle}</span>
                                </div>
                            </header>

                            <p className="nb-phase__desc">{p.description}</p>

                            <ul className="nb-phase__bullets">
                                {p.bullets.map((b) => (
                                    <li key={b}>
                                        <span className="nb-phase__bullet-mark">▸</span>
                                        {b}
                                    </li>
                                ))}
                            </ul>

                            <div className="nb-phase__output">
                                {p.outputs.map((o) => (
                                    <div key={o.label} className="nb-phase__output-item">
                                        <span className="nb-phase__output-label">{o.label}</span>
                                        <span className="nb-phase__output-value">{o.value}</span>
                                    </div>
                                ))}
                            </div>

                            <footer className="nb-phase__foot">
                                <span className="nb-phase__tools">
                                    {p.tools.map((t, i) => (
                                        <span key={t}>
                                            {t}
                                            {i < p.tools.length - 1 && ' · '}
                                        </span>
                                    ))}
                                </span>
                            </footer>
                        </article>
                    ))}
                </div>
            </section>

            {/* ============ HALLAZGOS ============ */}
            <section className="nb__findings">
                <header className="nb__section-head">
                    <span className="nb__section-index">02</span>
                    <div>
                        <h2 className="nb__section-title">Hallazgos del análisis</h2>
                        <p className="nb__section-desc">
                            Cinco conclusiones del notebook, respaldadas por los datos.
                        </p>
                    </div>
                </header>

                <ol className="nb__findings-list">
                    {FINDINGS.map((h) => (
                        <li key={h.n} className="nb-finding">
                            <span className="nb-finding__n">{h.n}</span>
                            <div className="nb-finding__body">
                                <h3 className="nb-finding__title">{h.title}</h3>
                                <p className="nb-finding__text">{h.body}</p>
                            </div>
                        </li>
                    ))}
                </ol>
            </section>

            {/* ============ CTA FINAL ============ */}
            <section className="nb__cta-final">
                <div className="nb__cta-final-content">
                    <span className="nb__cta-final-eyebrow">
                        Ejecuta el análisis completo
                    </span>
                    <h2 className="nb__cta-final-title">
                        El notebook está listo para reproducirse.
                    </h2>
                    <p className="nb__cta-final-text">
                        Todas las fuentes son públicas y trazables. Con un click
                        en Colab puedes ejecutar el pipeline completo (ETL →
                        modelo estrella → clustering → forecast) con tus propias
                        credenciales.
                    </p>

                    <div className="nb__cta-final-actions">
                        <a
                            href={COLAB_URL}
                            target="_blank"
                            rel="noreferrer"
                            className="nb__action nb__action--primary"
                        >
                            Abrir en Colab
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                                 stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                 strokeLinejoin="round">
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                <polyline points="15 3 21 3 21 9" />
                                <line x1="10" y1="14" x2="21" y2="3" />
                            </svg>
                        </a>
                        <a
                            href={GITHUB_URL}
                            target="_blank"
                            rel="noreferrer"
                            className="nb__action"
                        >
                            Ver en GitHub
                        </a>
                        <Link to="/powerbi" className="nb__action">
                            Ver dashboard
                        </Link>
                    </div>
                </div>
            </section>

            {/* ---------- Footer ---------- */}
            <footer className="nb__foot">
                <span>// Proyecto ISI802 · Business Intelligence</span>
                <span>Región de O'Higgins · Chile</span>
            </footer>
        </main>
    )
}