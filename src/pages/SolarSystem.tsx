import { lazy, Suspense } from 'react'

const Scene = lazy(() =>
    import('../components/Scene').then((m) => ({ default: m.Scene }))
)
const HUD = lazy(() =>
    import('../components/HUD').then((m) => ({ default: m.HUD }))
)
const PlanetReadout = lazy(() =>
    import('../components/PlanetReadout').then((m) => ({ default: m.PlanetReadout }))
)

function LoadingFallback() {
    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                background: '#03040a',
                display: 'grid',
                placeItems: 'center',
                color: '#ffd97a',
                fontFamily: 'SFMono-Regular, ui-monospace, monospace',
                fontSize: '0.75rem',
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
            }}
        >
            <span>Iniciando sistema…</span>
        </div>
    )
}

export function SolarSystem() {
    return (
        <>
            <Suspense fallback={<LoadingFallback />}>
                <Scene />
                <HUD />
                <PlanetReadout />
            </Suspense>
            <div className="vignette" aria-hidden="true" />
        </>
    )
}