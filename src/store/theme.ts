import { useEffect, useState } from 'react'

export type Theme = 'dark' | 'light'

const STORAGE_KEY = 'portafolio-theme'

function getInitialTheme(): Theme {
    if (typeof window === 'undefined') return 'dark'
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'light' || stored === 'dark') return stored
    // Respeta preferencia del sistema operativo
    const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches
    return prefersLight ? 'light' : 'dark'
}

let currentTheme: Theme = getInitialTheme()
const listeners = new Set<(t: Theme) => void>()

export const themeStore = {
    get(): Theme {
        return currentTheme
    },
    set(theme: Theme) {
        currentTheme = theme
        localStorage.setItem(STORAGE_KEY, theme)
        listeners.forEach((fn) => fn(theme))
    },
    toggle() {
        themeStore.set(currentTheme === 'dark' ? 'light' : 'dark')
    },
}

export function useTheme() {
    const [theme, setTheme] = useState<Theme>(currentTheme)

    useEffect(() => {
        const listener = (t: Theme) => setTheme(t)
        listeners.add(listener)
        return () => {
            listeners.delete(listener)
        }
    }, [])

    return theme
}