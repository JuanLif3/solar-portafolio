import { Scene } from './components/Scene'
import { HUD } from './components/HUD'
import { PlanetPanel } from './components/PlanetPanel'
import './App.css'

export function App() {
    return (
        <div className="app">
            <Scene />
            <HUD />
            <PlanetPanel />
            <div className="vignette" aria-hidden="true" />
        </div>
    )
}