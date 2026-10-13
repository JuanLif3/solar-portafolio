import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useTheme } from '../store/theme'


export function useThemeEffect() {
    const theme = useTheme()
    const { pathname } = useLocation()

    useEffect(() => {
        const isSolarSystem = pathname === '/'
        const effective = isSolarSystem ? 'dark' : theme

        document.documentElement.setAttribute('data-theme', effective)
        document.documentElement.style.colorScheme = effective
    }, [theme, pathname])
}