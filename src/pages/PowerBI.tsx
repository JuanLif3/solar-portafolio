import { Link } from 'react-router-dom'
import { DownloadButton } from '../components/DownloadButton'
import {
    ChartAmenazaImpacto,
    ChartVentasUF,
    ChartEmpresasTrabajadores,
    ChartHectareasVentas,
    ChartVegetacion,
    ChartPrecipitacionVentas,
    PowerBIChartsGroupC,
    ChartHeladasHeatmap,
} from '../components/PowerBICharts'
import '../styles/PowerBI.css'

/* ============================================================
 *  CONFIG
 * ============================================================ */
const PBIX_DOWNLOAD_URL =
    'https://correoaiep-my.sharepoint.com/:u:/g/personal/juan_riverosp_correoaiep_cl/IQAaZGM-K2VxSL462Y0141XzASN3wPb2IjjsA7_o4gIlF1k?e=jrz1vr&download=1'

const PBIX_FILENAME = 'Proyecto_Colchagua.pbix'

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
                            <span className="pb__meta-label">Visualizaciones</span>
                            <span className="pb__meta-value">09 gráficos</span>
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

            {/* ============ BLOQUES DE GRÁFICOS POWER BI ============ */}
            <section className="pb__visuals">

                {/* BLOQUE 01 · Contexto y concentración del riesgo */}
                <div className="pb-block">
                    <header className="pb__section-head">
                        <span className="pb__section-index">01</span>
                        <div>
                            <h2 className="pb__section-title">Contexto y concentración del riesgo</h2>
                            <p className="pb__section-desc">
                                Dónde se acumula el empleo agrícola y cómo se distribuye el daño territorial.
                            </p>
                        </div>
                    </header>

                    <div className="pb-block__grid pb-block__grid--A">
                        <div className="pbi-slot pbi-slot--wide">
                            <ChartAmenazaImpacto />
                        </div>
                        <div className="pbi-slot">
                            <ChartVentasUF />
                        </div>
                        <div className="pbi-slot">
                            <ChartEmpresasTrabajadores />
                        </div>
                        <div className="pbi-slot">
                            <ChartHeladasHeatmap />
                        </div>
                    </div>
                </div>

                {/* BLOQUE 02 · Efecto dominó territorial */}
                <div className="pb-block">
                    <header className="pb__section-head">
                        <span className="pb__section-index">02</span>
                        <div>
                            <h2 className="pb__section-title">Efecto dominó territorial</h2>
                            <p className="pb__section-desc">
                                Incendios, vegetación nativa y su impacto sobre las ventas del sector.
                            </p>
                        </div>
                    </header>

                    <div className="pb-block__grid pb-block__grid--B">
                        <div className="pbi-slot">
                            <ChartHectareasVentas />
                        </div>
                        <div className="pbi-slot">
                            <ChartVegetacion />
                        </div>
                        <div className="pbi-slot">
                            <ChartPrecipitacionVentas />
                        </div>
                    </div>
                </div>

                {/* BLOQUE 03 · Efecto dominó sectorial */}
                <div className="pb-block">
                    <header className="pb__section-head">
                        <span className="pb__section-index">03</span>
                        <div>
                            <h2 className="pb__section-title">Efecto dominó sectorial</h2>
                            <p className="pb__section-desc">
                                Colapso de cereales y apicultura bajo estrés climático compuesto.
                            </p>
                        </div>
                    </header>

                    <div className="pb-block__grid pb-block__grid--C">
                        <PowerBIChartsGroupC />
                    </div>
                </div>

            </section>

            {/* ============ CONCLUSIONES ============ */}
            <section className="pb__findings">
                <header className="pb__section-head">
                    <span className="pb__section-index">04</span>
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
                    <span className="pb__section-index">05</span>
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
        </main>
    )
}