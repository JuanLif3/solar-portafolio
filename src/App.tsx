import { Scene } from './components/Scene'
import { HUD } from './components/HUD'
import './App.css'

export function App() {
    return (
        <div className="app">
            <Scene />
            <HUD />
            <div className="vignette" aria-hidden="true" />
        </div>
    )
}