import { useState, type FormEvent } from 'react'
import '../styles/ContactForm.css'

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xyekndnw'

type Status = 'idle' | 'sending' | 'success' | 'error'

export function ContactForm() {
    const [status, setStatus] = useState<Status>('idle')
    const [errorMsg, setErrorMsg] = useState('')

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (status === 'sending') return

        const form = e.currentTarget
        const data = new FormData(form)

        setStatus('sending')
        setErrorMsg('')

        try {
            const res = await fetch(FORMSPREE_ENDPOINT, {
                method: 'POST',
                body: data,
                headers: { Accept: 'application/json' },
            })

            if (res.ok) {
                setStatus('success')
                form.reset()
            } else {
                const json = await res.json().catch(() => null)
                const msg =
                    json?.errors?.[0]?.message ??
                    'No se pudo enviar. Intenta de nuevo.'
                setErrorMsg(msg)
                setStatus('error')
            }
        } catch {
            setErrorMsg('Error de red. Revisa tu conexión.')
            setStatus('error')
        }
    }

    if (status === 'success') {
        return (
            <div className="contact-form contact-form--success">
                <span className="contact-form__success-dot" />
                <h4 className="contact-form__success-title">Mensaje enviado</h4>
                <p className="contact-form__success-text">
                    Gracias por escribir. Te responderé a la brevedad,
                    normalmente en menos de 24 horas.
                </p>
                <button
                    type="button"
                    className="contact-form__reset"
                    onClick={() => setStatus('idle')}
                >
                    Enviar otro mensaje
                </button>
            </div>
        )
    }

    return (
        <form
            className="contact-form"
            onSubmit={handleSubmit}
            noValidate
        >
            <header className="contact-form__head">
                <span className="contact-form__head-mark">◆</span>
                <span className="contact-form__head-label">
                    Canal directo · Envío cifrado
                </span>
            </header>

            {/* Honeypot anti-spam: oculto para humanos, visible para bots */}
            <input
                type="text"
                name="_gotcha"
                tabIndex={-1}
                autoComplete="off"
                style={{
                    position: 'absolute',
                    left: '-9999px',
                    width: 1,
                    height: 1,
                    opacity: 0,
                }}
                aria-hidden="true"
            />

            <div className="contact-form__row">
                <label className="contact-form__field">
                    <span className="contact-form__label">Nombre</span>
                    <input
                        type="text"
                        name="name"
                        required
                        maxLength={80}
                        autoComplete="name"
                        placeholder="Tu nombre"
                        className="contact-form__input"
                    />
                </label>

                <label className="contact-form__field">
                    <span className="contact-form__label">Email</span>
                    <input
                        type="email"
                        name="email"
                        required
                        maxLength={120}
                        autoComplete="email"
                        placeholder="tu@correo.com"
                        className="contact-form__input"
                    />
                </label>
            </div>

            <label className="contact-form__field">
                <span className="contact-form__label">Asunto</span>
                <input
                    type="text"
                    name="subject"
                    required
                    maxLength={120}
                    placeholder="¿De qué quieres hablar?"
                    className="contact-form__input"
                />
            </label>

            <label className="contact-form__field">
                <span className="contact-form__label">Mensaje</span>
                <textarea
                    name="message"
                    required
                    rows={5}
                    maxLength={2000}
                    placeholder="Cuéntame brevemente tu idea, propuesta o consulta…"
                    className="contact-form__textarea"
                />
            </label>

            {status === 'error' && (
                <div className="contact-form__error">
                    <span className="contact-form__error-mark">⚠</span>
                    <span>{errorMsg}</span>
                </div>
            )}

            <button
                type="submit"
                className="contact-form__submit"
                disabled={status === 'sending'}
            >
                {status === 'sending' ? (
                    <>
                        <span className="contact-form__spinner" />
                        Enviando…
                    </>
                ) : (
                    <>
                        Enviar mensaje
                        <span className="contact-form__submit-arrow">→</span>
                    </>
                )}
            </button>

            <p className="contact-form__note">
                Tus datos solo se usan para responderte. Cero spam.
            </p>
        </form>
    )
}