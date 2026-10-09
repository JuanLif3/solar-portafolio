import './App.css'

export function App() {
  return (
      <div className="app">
        <div className="hud">
          <span className="hud__brand">Sistema Solar</span>
          <span className="hud__hint">Un viaje entre planetas</span>
        </div>
        <div className="vignette" aria-hidden="true" />
      </div>
  )
}