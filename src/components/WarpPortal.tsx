import { useNavigate } from 'react-router-dom'
import { systemStore, useSystemState } from '../store/system'
import { WarpOverlay } from './WarpOverlay'

/**
 * Envuelve al WarpOverlay para que:
 *  1. Solo exista en el DOM mientras `warping === true`
 *     (así no bloquea clics al canvas del sistema solar)
 *  2. Maneje la navegación con react-router automáticamente
 *  3. Limpie el estado al terminar la animación
 */
export function WarpPortal() {
    const navigate = useNavigate()
    const { warping, warpTarget } = useSystemState()

    if (!warping || !warpTarget) return null

    return (
        <WarpOverlay
            duration={3400}
            onArrive={() => {
                // Navega cuando el flash blanco está al 100%
                navigate(warpTarget)
            }}
            onComplete={() => {
                // Al terminar, limpia el estado → se desmonta el overlay
                systemStore.setWarping(null)
                systemStore.setFocusedPlanet(null)
            }}
        />
    )
}