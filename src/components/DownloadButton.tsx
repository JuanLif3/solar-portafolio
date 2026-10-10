import { useState } from 'react'

type Props = {
    url: string
    filename: string
    label?: string
}

export function DownloadButton({ url, filename, label = 'Descargar' }: Props) {
    const [state, setState] = useState<'idle' | 'downloading'>('idle')

    const handleDownload = () => {
        setState('downloading')

        // Creamos un <a> temporal en el DOM. El atributo `download`
        // actúa como sugerencia de nombre para el navegador.
        const a = document.createElement('a')
        a.href = url
        a.download = filename
        a.target = '_blank'
        a.rel = 'noopener noreferrer'

        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)

        // Feedback visual durante 2s.
        setTimeout(() => setState('idle'), 2000)
    }

    return (
        <button
            type="button"
            className="pb__cta pb__cta--download"
            onClick={handleDownload}
            disabled={state === 'downloading'}
            aria-label={`Descargar ${filename}`}
        >
            {state === 'downloading' ? (
                <>
                    <span className="pb__cta-spinner" aria-hidden="true" />
                    Descargando…
                </>
            ) : (
                <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                         strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    {label}
                </>
            )}
        </button>
    )
}