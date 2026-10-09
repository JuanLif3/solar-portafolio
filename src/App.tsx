import './App.css'
import { Scene } from './components/Scene'

export function App() {
  return (
      <div className="app">
          <Scene />
        <div className="hud">
          <span className="hud__brand">Sistema Solar</span>
          <span className="hud__hint">Un viaje entre planetas</span>
        </div>
        <div className="vignette" aria-hidden="true" />
      </div>
  )
}