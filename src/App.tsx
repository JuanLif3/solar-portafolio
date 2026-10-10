import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { SolarSystem } from './pages/SolarSystem'
import { PowerBI } from './pages/PowerBI'
import { Notebooks } from './pages/Notebooks'
import { Proyectos } from './pages/Proyectos'
import { WarpPortal } from './components/WarpPortal'

import './App.css'

export function App() {
    return (
        <BrowserRouter>
            <div className="app">
                <Routes>
                    <Route path="/" element={<SolarSystem />} />
                    <Route path="/proyectos" element={<Proyectos />} />
                    <Route path="/powerbi" element={<PowerBI />} />
                    <Route path="/notebooks" element={<Notebooks />} />
                </Routes>

                <WarpPortal />
            </div>
        </BrowserRouter>
    )
}