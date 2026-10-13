import { themeStore, useTheme } from '../store/theme'
import '../styles/ThemeToggle.css'

type Props = {
    variant?: 'rail' | 'floating'
}

export function ThemeToggle({ variant = 'rail' }: Props) {
    const theme = useTheme()
    const isDark = theme === 'dark'

    const label = isDark ? 'Modo claro' : 'Modo oscuro'

    return (
        <button
            type="button"
            className={`theme-toggle theme-toggle--${variant} ${isDark ? 'is-dark' : 'is-light'}`}
            onClick={() => themeStore.toggle()}
            title={label}
            aria-label={label}
        >
            {isDark ? (
                // Sol (para cambiar a claro)
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                </svg>
            ) : (
                // Luna (para cambiar a oscuro)
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"
                     strokeLinejoin="round">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
            )}
        </button>
    )
}