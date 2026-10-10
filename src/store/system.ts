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
    speed: number
    paused: boolean
    showLabels: boolean
    showOrbits: boolean
    activeSection: SectionId | null
    focusedPlanet: string | null
    warping: boolean
    warpTarget: string | null
}

let state: SystemState = {
    speed: 1,
    paused: false,
    showLabels: true,
    showOrbits: true,
    activeSection: null,
    focusedPlanet: null,
    warping: false,
    warpTarget: null,
}

const listeners = new Set<() => void>()
const emit = () => listeners.forEach((l) => l())

type ControlsLike = {
    reset: () => void
} | null

let controlsRef: ControlsLike = null

export const systemStore = {
    getState: () => state,

    subscribe: (l: () => void) => {
        listeners.add(l)
        return () => {
            listeners.delete(l)
        }
    },

    setSpeed: (n: number) => {
        state = { ...state, speed: n }
        emit()
    },

    togglePause: () => {
        state = { ...state, paused: !state.paused }
        emit()
    },

    toggleLabels: () => {
        state = { ...state, showLabels: !state.showLabels }
        emit()
    },

    toggleOrbits: () => {
        state = { ...state, showOrbits: !state.showOrbits }
        emit()
    },

    setActiveSection: (id: SectionId | null) => {
        state = { ...state, activeSection: id }
        emit()
    },

    setFocusedPlanet: (name: string | null) => {
        state = { ...state, focusedPlanet: name }
        emit()
    },

    setWarping: (route: string | null) => {
        state = { ...state, warping: route !== null, warpTarget: route }
        emit()
    },

    _setControls: (c: ControlsLike) => {
        controlsRef = c
    },

    getControls: () => controlsRef,

    resetView: () => {
        if (controlsRef && typeof controlsRef.reset === 'function') {
            controlsRef.reset()
        }
    },
}

export function useSystemState() {
    return useSyncExternalStore(systemStore.subscribe, systemStore.getState)
}