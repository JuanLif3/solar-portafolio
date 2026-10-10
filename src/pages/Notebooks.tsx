import { Link } from 'react-router-dom'

export function Notebooks() {
    return (
        <main className="powerbi">
            <Link to="/" className="powerbi__back">← Volver al sistema</Link>
            <header className="powerbi__header">
                <span className="powerbi__eyebrow">Sección 05 · Stack</span>
                <h1 className="powerbi__title">Notebooks</h1>
            </header>
            <p>Aquí van los notebooks del proyecto Colchagua.</p>
        </main>
    )
}