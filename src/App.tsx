import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { SolarSystem } from './pages/SolarSystem'
import { WarpPortal } from './components/WarpPortal'

import './App.css'

// Rutas secundarias: carga diferida (no bloquean el primer render)
const Proyectos = lazy(() =>
    import('./pages/Proyectos').then((m) => ({ default: m.Proyectos }))
)
const PowerBI = lazy(() =>
    import('./pages/PowerBI').then((m) => ({ default: m.PowerBI }))
)
const Notebooks = lazy(() =>
    import('./pages/Notebooks').then((m) => ({ default: m.Notebooks }))
)

export function App() {
    return (
        <BrowserRouter>
            <div className="app">
                <Suspense fallback={null}>
                    <Routes>
                        <Route path="/" element={<SolarSystem />} />
                        <Route path="/proyectos" element={<Proyectos />} />
                        <Route path="/powerbi" element={<PowerBI />} />
                        <Route path="/notebooks" element={<Notebooks />} />
                    </Routes>
                </Suspense>

                <WarpPortal />
            </div>
        </BrowserRouter>
    )
}