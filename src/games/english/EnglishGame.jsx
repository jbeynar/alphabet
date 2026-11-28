import { useCallback, useEffect, useRef, useState } from 'react'
import BackButton from '../../components/BackButton'
import MuteButton from '../../components/MuteButton'
import SpeakerIcon from '../../components/SpeakerIcon'
import { pictureWords } from '../../data/words'
import { speakWord } from '../../utils/browserSpeech'
import './EnglishGame.css'

const MUTED_STORAGE_KEY = 'english.muted'
const AUTOPLAY_STORAGE_KEY = 'english.autoplay'
const AUTOPLAY_MS = 8000
const LANG = 'en-GB'
const COLORS = ['#7b2cbf', '#1d6fd8', '#0f9d8a', '#2e9e44', '#e07a10', '#d6336c', '#c0392b', '#3f51b5']

function readMuted() {
    try {
        return localStorage.getItem(MUTED_STORAGE_KEY) === '1'
    } catch {
        return false
    }
}

function readAutoplay() {
    try {
        return localStorage.getItem(AUTOPLAY_STORAGE_KEY) !== '0'
    } catch {
        return true
    }
}

function PlayPauseIcon({ playing }) {
    return (
        <svg className="english-icon" viewBox="0 0 24 24" width="1.1em" height="1.1em" fill="currentColor" aria-hidden="true">
            {playing ? <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" /> : <path d="M8 5v14l11-7z" />}
        </svg>
    )
}

function pickWord(previous) {
    const pool = pictureWords.filter(word => word.pl !== previous?.pl)
    return pool[Math.floor(Math.random() * pool.length)] ?? null
}

function pickColor(previous) {
    const pool = COLORS.filter(color => color !== previous)
    return pool[Math.floor(Math.random() * pool.length)]
}

function EnglishGame({ onExit }) {
    // Shown pictures so far; `index` points at the current one (Back moves it left).
    const [history, setHistory] = useState(() => ({
        items: [{ word: pickWord(null), color: pickColor(null) }],
        index: 0,
    }))
    const { word, color } = history.items[history.index]
    const canGoBack = history.index > 0
    const [muted, setMuted] = useState(readMuted)
    const [autoplay, setAutoplay] = useState(readAutoplay)
    const [tabVisible, setTabVisible] = useState(() => !document.hidden)
    // The countdown runs only while autoplay is on and the browser tab is in the foreground.
    const counting = autoplay && tabVisible
    const [revealing, setRevealing] = useState(true)

    useEffect(() => () => window.speechSynthesis?.cancel(), [])

    useEffect(() => {
        if (!word) return
        setRevealing(true)
        const timer = setTimeout(() => setRevealing(false), 400)
        if (!muted) speakWord(word.en, { lang: LANG, rate: 0.8 })
        return () => clearTimeout(timer)
    }, [word, muted])

    const next = useCallback(() => {
        setHistory(({ items, index }) => {
            if (index < items.length - 1) return { items, index: index + 1 }
            const current = items[index]
            const item = { word: pickWord(current.word), color: pickColor(current.color) }
            return { items: [...items, item], index: index + 1 }
        })
    }, [])

    const back = useCallback(() => {
        setHistory(state => (state.index > 0 ? { ...state, index: state.index - 1 } : state))
    }, [])

    useEffect(() => {
        const handleVisibility = () => setTabVisible(!document.hidden)
        document.addEventListener('visibilitychange', handleVisibility)
        return () => document.removeEventListener('visibilitychange', handleVisibility)
    }, [])

    // Auto-advance: the countdown restarts whenever the picture changes (Next, Back or auto)
    // and when the tab comes back to the foreground.
    useEffect(() => {
        if (!counting) return
        const timer = setTimeout(next, AUTOPLAY_MS)
        return () => clearTimeout(timer)
    }, [counting, history, next])

    const toggleAutoplay = useCallback(() => {
        setAutoplay(current => {
            const value = !current
            try {
                localStorage.setItem(AUTOPLAY_STORAGE_KEY, value ? '1' : '0')
            } catch {}
            return value
        })
    }, [])

    function toggleMuted() {
        const value = !muted
        try {
            localStorage.setItem(MUTED_STORAGE_KEY, value ? '1' : '0')
        } catch {}
        if (value) window.speechSynthesis?.cancel()
        setMuted(value)
    }

    useEffect(() => {
        function handleKey(e) {
            if (e.key === 'Escape') {
                onExit?.()
                return
            }
            if (e.key === ' ' || e.key === 'Enter' || e.key === 'ArrowRight') {
                e.preventDefault()
                if (e.repeat) return
                next()
                return
            }
            if (e.key === 'p' || e.key === 'P') {
                if (e.repeat) return
                toggleAutoplay()
                return
            }
            if (e.key === 'ArrowLeft') {
                e.preventDefault()
                if (e.repeat) return
                back()
            }
        }
        window.addEventListener('keydown', handleKey)
        return () => window.removeEventListener('keydown', handleKey)
    }, [next, back, toggleAutoplay, onExit])

    if (!word) return null

    return (
        <div className="english-container" style={{ '--english-color': color }}>
            <BackButton onClick={onExit} />
            <MuteButton muted={muted} onToggle={toggleMuted} />
            <div className="english-content">
                <button
                    type="button"
                    className={`english-card ${revealing ? 'english-card-reveal' : ''}`}
                    onClick={next}
                    aria-label={`${word.en}. Następny obrazek`}
                >
                    <img key={word.pl} src={word.image} alt={word.en} className="english-image" />
                </button>
                <div className="english-progress" aria-hidden="true">
                    {counting && (
                        <div
                            key={history.index}
                            className="english-progress-bar"
                            style={{ animationDuration: `${AUTOPLAY_MS}ms` }}
                        />
                    )}
                </div>
                <p className="english-word" lang="en">{word.en}</p>
                <p className="english-translation" lang="pl">{word.pl}</p>
                <div className="english-actions">
                    <button type="button" className="english-button" onClick={back} disabled={!canGoBack}>
                        ← Back
                    </button>
                    {!muted && (
                        <button type="button" className="english-button" onClick={() => speakWord(word.en, { lang: LANG, rate: 0.8 })}>
                            <SpeakerIcon /> Repeat
                        </button>
                    )}
                    <button
                        type="button"
                        className="english-button"
                        onClick={toggleAutoplay}
                        aria-pressed={autoplay}
                        title={autoplay ? 'Zatrzymaj automatyczne zmienianie (P)' : 'Włącz automatyczne zmienianie (P)'}
                    >
                        <PlayPauseIcon playing={autoplay} /> {autoplay ? 'Pause' : 'Play'}
                    </button>
                    <button type="button" className="english-button english-button-next" onClick={next}>
                        Next →
                    </button>
                </div>
                <p className="english-hint">Spacja lub → pokazuje kolejny obrazek, ← wraca do poprzedniego, P zatrzymuje / wznawia automat</p>
            </div>
        </div>
    )
}

export default EnglishGame
