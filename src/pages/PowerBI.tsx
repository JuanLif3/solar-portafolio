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
type BlockLayout = 'A' | 'B' | 'C'

type Visual = {
    id: string
    n: string
    title: string
    subtitle: string
    description: string
    insight: string
    image: string
    layout: BlockLayout
    /** Clases de tamaño dentro del grid */
    span?: 'wide' | 'tall' | 'full' | 'normal'
}

const BLOCKS: { id: BlockLayout; index: string; title: string; subtitle: string }[] = [
    {
        id: 'A',
        index: '01',
        title: 'Contexto y concentración del riesgo',
        subtitle: 'Dónde se acumula el empleo agrícola y cómo se distribuye el daño',
    },
    {
        id: 'B',
        index: '02',
        title: 'Efecto dominó territorial',
        subtitle: 'Incendios, vegetación nativa y su impacto sobre las ventas',
    },
    {
        id: 'C',
        index: '03',
        title: 'Efecto dominó sectorial',
        subtitle: 'Colapso de cereales y apicultura bajo estrés climático',
    },
]

const VISUALS: Visual[] = [
    /* ---------- BLOQUE A ---------- */
    {
        id: 'amenaza-impacto',
        n: 'A1',
        title: 'Amenaza vs Impacto',
        subtitle: 'Scatter · Hectáreas quemadas vs crecimiento de ventas',
        description:
            'Cruce de hectáreas quemadas por incendios (eje X) contra crecimiento de ventas agro (eje Y). Cada burbuja es una comuna; el tamaño representa la concentración de cultivos. Las burbujas azul claro son comunas críticas (alta fruticultura + alta siniestralidad).',
        insight:
            'Chimbarongo y San Fernando se aíslan como outliers. El resto de las comunas se agrupa en el cuadrante bajo-impacto — la vulnerabilidad no se distribuye parejo.',
        image: '/powerbi/amenaza-impacto.png',
        layout: 'A',
        span: 'wide',
    },
    {
        id: 'ventas-uf-comuna',
        n: 'A2',
        title: 'Ventas Totales UF por comuna',
        subtitle: 'Ranking de volumen económico · 2018-2021',
        description:
            'Volumen agregado de ventas en UF para cada comuna de la provincia. San Fernando lidera con casi 50 mill. UF, seguido por Santa Cruz y Chimbarongo.',
        insight:
            'El 60% del volumen provincial se concentra en 3 comunas (San Fernando, Santa Cruz, Chimbarongo). Un shock en cualquiera de ellas mueve la aguja provincial completa.',
        image: '/powerbi/ventas-uf-comuna.png',
        layout: 'A',
        span: 'tall',
    },
    {
        id: 'empresas-trabajadores',
        n: 'A3',
        title: 'Empresas y trabajadores por año',
        subtitle: 'Doble eje · 2018-2021',
        description:
            'Evolución anual del número de empresas formales (azul oscuro, eje derecho) frente al número de trabajadores dependientes (azul claro, eje izquierdo). Las dos series divergen a partir de 2020.',
        insight:
            'Las empresas crecieron (+8%) mientras los trabajadores cayeron (-4.000 en 2021). Las PYMEs sobrevivieron a costa de reducir personal — el shock climático y la pandemia golpearon al empleo, no a la estructura empresarial.',
        image: '/powerbi/empresas-trabajadores.png',
        layout: 'A',
        span: 'tall',
    },

    /* ---------- BLOQUE B ---------- */
    {
        id: 'hectareas-ventas',
        n: 'B1',
        title: 'Hectáreas quemadas vs Ventas Agro',
        subtitle: 'Barras + línea · 2018-2021',
        description:
            'Combinación de hectáreas quemadas por incendios (barras azules) contra ventas agro (línea azul oscura, eje derecho). Revela la desconexión entre el crecimiento económico sostenido y la aceleración del daño territorial.',
        insight:
            'Las hectáreas quemadas crecieron 17× entre 2018 y 2021 (200 → 3.500 ha) mientras las ventas solo crecían 1,5×. El daño escala mucho más rápido que el beneficio.',
        image: '/powerbi/hectareas-ventas.png',
        layout: 'B',
        span: 'tall',
    },
    {
        id: 'vegetacion-plantaciones',
        n: 'B2',
        title: 'Vegetación, Plantaciones y Ha_Agricolas',
        subtitle: 'Composición del suelo afectado · 100% apilado',
        description:
            'Descomposición porcentual de la superficie quemada por comuna, distinguiendo vegetación natural (celeste), plantaciones forestales (azul oscuro) y superficie agrícola productiva (naranja).',
        insight:
            'El fuego afectó mayormente vegetación nativa y matorrales — NO cultivos productivos. El daño a las PYMEs fue indirecto: estrés ambiental, pérdida de polinizadores y cortes de servicios, no pérdida directa de frutales.',
        image: '/powerbi/vegetacion-plantaciones.png',
        layout: 'B',
        span: 'tall',
    },
    {
        id: 'precipitacion-ventas',
        n: 'B3',
        title: 'Precipitación Anual mm vs Ventas Agro',
        subtitle: 'Barras + línea · Efecto sequía',
        description:
            'Precipitación anual acumulada (barras) contra las ventas agro del período (línea). Permite leer el efecto de la sequía estructural de 2019 sobre el desempeño económico.',
        insight:
            'La caída de precipitación en 2019 coincidió con el peor año de empleo agrícola (2020-2021). El déficit hídrico actúa como disparador retardado: el impacto económico se ve 1-2 años después del evento climático.',
        image: '/powerbi/precipitacion-ventas.png',
        layout: 'B',
        span: 'tall',
    },

    /* ---------- BLOQUE C ---------- */
    {
        id: 'empresas-cereales-apicultura',
        n: 'C1',
        title: 'Empresas · Cereales vs Apicultura',
        subtitle: 'Número de empresas formales · 2018-2021',
        description:
            'Cantidad de empresas formales dedicadas al cultivo de cereales (trigo y maíz) vs las dedicadas a la apicultura. Ambas series muestran la contracción del sector tras el shock climático compuesto de 2019.',
        insight:
            'La apicultura mostró recuperación post-2020 (nueva formalización), mientras los cereales siguieron cayendo. La sequía golpeó más fuerte a los cultivos extensivos.',
        image: '/powerbi/empresas-cereales-apicultura.png',
        layout: 'C',
        span: 'full',
    },
    {
        id: 'ventas-cereales-apicultura',
        n: 'C2',
        title: 'Ventas · Cereales vs Apicultura',
        subtitle: 'Ventas anuales · 2018-2021',
        description:
            'Volumen de ventas de cereales (trigo + maíz) contra apicultura. Ambas series cayeron con fuerza durante 2019-2020 y solo la apicultura mostró un rebote claro en 2021.',
        insight:
            'La caída conjunta de ventas en 2020 confirma el efecto dominó: la sequía de 2019 y las olas de calor deshidrataron cultivos y redujeron la floración disponible para las abejas, golpeando ambos rubros simultáneamente.',
        image: '/powerbi/ventas-cereales-apicultura.png',
        layout: 'C',
        span: 'full',
    },
    {
        id: 'trabajadores-cereales-apicultura',
        n: 'C3',
        title: 'Trabajadores · Cereales vs Apicultura',
        subtitle: 'Empleo formal del sector · 2018-2021',
        description:
            'Cantidad de trabajadores dependientes en cereales y apicultura. Ambas series tocaron su mínimo histórico en 2020 y comenzaron a recuperarse en 2021, sin volver aún a los niveles de 2018.',
        insight:
            'El empleo cayó 40% en cereales y 35% en apicultura durante el período. Es la prueba más dura del efecto dominó sectorial: el shock climático destruyó puestos de trabajo formales que tomarán años recuperar.',
        image: '/powerbi/trabajadores-cereales-apicultura.png',
        layout: 'C',
        span: 'full',
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
                {BLOCKS.map((block) => {
                    const blockVisuals = VISUALS.filter((v) => v.layout === block.id)

                    return (
                        <div key={block.id} className={`pb-block pb-block--${block.id}`}>
                            <header className="pb__section-head">
                                <span className="pb__section-index">{block.index}</span>
                                <div>
                                    <h2 className="pb__section-title">{block.title}</h2>
                                    <p className="pb__section-desc">{block.subtitle}</p>
                                </div>
                            </header>

                            <div className={`pb-block__grid pb-block__grid--${block.id}`}>
                                {blockVisuals.map((v) => (
                                    <article
                                        key={v.id}
                                        className={`pb-visual pb-visual--${v.span ?? 'normal'}`}
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
                        </div>
                    )
                })}
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