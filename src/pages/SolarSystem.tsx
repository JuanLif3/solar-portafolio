import { Scene } from '../components/Scene'
import { HUD } from '../components/HUD'
import { PlanetReadout } from '../components/PlanetReadout'

export function SolarSystem() {
    return (
        <>
            <Scene />
                <HUD />
                <PlanetReadout />
            <div className="vignette" aria-hidden="true" />
        </>
    )
}