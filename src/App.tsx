import { Scene } from './components/Scene'
import { HUD } from './components/HUD'
import { PlanetReadout } from './components/PlanetReadout'
import './App.css'

export function App() {
    return (
        <div className="app">
            <Scene />
                <HUD />
                <PlanetReadout />

            <div className="vignette" aria-hidden="true" />
        </div>
    )
}