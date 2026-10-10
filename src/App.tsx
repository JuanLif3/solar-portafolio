import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { SolarSystem } from './pages/SolarSystem'
import { PowerBI } from './pages/PowerBI'
import { Notebooks } from './pages/Notebooks'
import './App.css'

export function App() {
    return (
        <BrowserRouter>
            <div className="app">
                <Routes>
                    <Route path="/" element={<SolarSystem />} />
                    <Route path="/powerbi" element={<PowerBI />} />
                    <Route path="/notebooks" element={<Notebooks />} />
                </Routes>
            </div>
        </BrowserRouter>
    )
}