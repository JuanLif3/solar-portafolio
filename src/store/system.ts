import { useSyncExternalStore } from 'react'

export type SectionId =
    | 'inicio'
    | 'sobre-mi'
    | 'proyectos'
    | 'experiencia'
    | 'stack'
    | 'certs'
    | 'blog'
    | 'contacto'

export type SystemState = {
    speed: number          // 0.1 – 3.0
    paused: boolean
    showLabels: boolean
    showOrbits: boolean
    activeSection: SectionId | null
    focusedPlanet: string | null
}

let state: SystemState = {
    speed: 1,
    paused: false,
    showLabels: true,
    showOrbits: true,
    activeSection: null,
}

const listeners = new Set<() => void>()
const emit = () => listeners.forEach((l) => l())

type ControlsLike = { reset: () => void }
let controlsRef: ControlsLike | null = null

export const systemStore = {
    getState: () => state,
    subscribe: (l: () => void) => {
        listeners.add(l)
        return () => listeners.delete(l)
    },

    focusedPlanet: null,

    setFocusedPlanet: (name: string | null) => {
        state = { ...state, focusedPlanet: name }
        emit()
    },

    setSpeed: (n: number) =>
        ((state = { ...state, speed: n }), emit()),

    togglePause: () =>
        ((state = { ...state, paused: !state.paused }), emit()),

    toggleLabels: () =>
        ((state = { ...state, showLabels: !state.showLabels }), emit()),

    toggleOrbits: () =>
        ((state = { ...state, showOrbits: !state.showOrbits }), emit()),

    setActiveSection: (id: SectionId | null) =>
        ((state = { ...state, activeSection: id }), emit()),

    // --- Controles de cámara (registrados desde Scene) ---
    _setControls: (c: ControlsLike | null) => {
        controlsRef = c
    },
    resetView: () => {
        controlsRef?.reset()
    },
}

export function useSystemState() {
    return useSyncExternalStore(systemStore.subscribe, systemStore.getState)
}