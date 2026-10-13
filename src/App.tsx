import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { SolarSystem } from './pages/SolarSystem'
import { WarpPortal } from './components/WarpPortal'
import { useThemeEffect } from './hooks/useThemeEffect'

import './App.css'

const Proyectos = lazy(() =>
    import('./pages/Proyectos').then((m) => ({ default: m.Proyectos }))
)
const PowerBI = lazy(() =>
    import('./pages/PowerBI').then((m) => ({ default: m.PowerBI }))
)
const Notebooks = lazy(() =>
    import('./pages/Notebooks').then((m) => ({ default: m.Notebooks }))
)

function AppShell() {
    // Aplica el tema al <html> según la ruta
    useThemeEffect()

    return (
        <Suspense fallback={null}>
            <Routes>
                <Route path="/" element={<SolarSystem />} />
                <Route path="/proyectos" element={<Proyectos />} />
                <Route path="/powerbi" element={<PowerBI />} />
                <Route path="/notebooks" element={<Notebooks />} />
            </Routes>
        </Suspense>
    )
}

export function App() {
    return (
        <BrowserRouter>
            <div className="app">
                <AppShell />
                <WarpPortal />
            </div>
        </BrowserRouter>
    )
}