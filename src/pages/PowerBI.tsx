import { Link } from 'react-router-dom'
import './styles/PowerBI.css'

export function PowerBI() {
    return (
        <main className="powerbi">
            <Link to="/" className="powerbi__back">
                ← Volver al sistema
            </Link>

            <header className="powerbi__header">
                <span className="powerbi__eyebrow">Sección 03 · Proyectos</span>
                <h1 className="powerbi__title">Dashboard Colchagua</h1>
                <p className="powerbi__subtitle">
                    Visualización de vulnerabilidad territorial para las PYMEs de la
                    Región de O'Higgins.
                </p>
            </header>

            <section className="powerbi__embed">
                <div className="powerbi__embed-placeholder">
                    <p>Aquí va el iframe de Power BI</p>
                    <code>{`<iframe src="https://app.powerbi.com/view?r=..." />`}</code>
                </div>
            </section>

            <section className="powerbi__notebooks">
                <h2>Notebooks</h2>
                <ul>
                    <li><a href="https://github.com/" target="_blank" rel="noreferrer">01 · ETL y limpieza</a></li>
                    <li><a href="https://github.com/" target="_blank" rel="noreferrer">02 · Análisis exploratorio</a></li>
                    <li><a href="https://github.com/" target="_blank" rel="noreferrer">03 · Modelo predictivo</a></li>
                </ul>
            </section>
        </main>
    )
}