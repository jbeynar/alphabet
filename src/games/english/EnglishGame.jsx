import { useCallback, useEffect, useRef, useState } from 'react'
import BackButton from '../../components/BackButton'
import MuteButton from '../../components/MuteButton'
import { pictureWords } from '../../data/words'
import { speakWord } from '../../utils/browserSpeech'
import './EnglishGame.css'

const MUTED_STORAGE_KEY = 'english.muted'
const LANG = 'en-GB'

function readMuted() {
    try {
        return localStorage.getItem(MUTED_STORAGE_KEY) === '1'
    } catch {
        return false
    }
}

function pickWord(previous) {
    const pool = pictureWords.filter(word => word.pl !== previous?.pl)
    return pool[Math.floor(Math.random() * pool.length)] ?? null
}

function EnglishGame({ onExit }) {
    const [word, setWord] = useState(() => pickWord(null))
    const [muted, setMuted] = useState(readMuted)
    const [revealing, setRevealing] = useState(true)

    useEffect(() => () => window.speechSynthesis?.cancel(), [])

    useEffect(() => {
        if (!word) return
        setRevealing(true)
        const timer = setTimeout(() => setRevealing(false), 400)
        if (!muted) speakWord(word.en, { lang: LANG, rate: 0.8 })
        return () => clearTimeout(timer)
    }, [word, muted])

    const next = useCallback(() => setWord(current => pickWord(current)), [])

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
                next()
            }
        }
        window.addEventListener('keydown', handleKey)
        return () => window.removeEventListener('keydown', handleKey)
    }, [next, onExit])

    if (!word) return null

    return (
        <div className="english-container">
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
                <p className="english-word" lang="en">{word.en}</p>
                <p className="english-translation" lang="pl">{word.pl}</p>
                <div className="english-actions">
                    {!muted && (
                        <button type="button" className="english-button" onClick={() => speakWord(word.en, { lang: LANG, rate: 0.8 })}>
                            🔊 Repeat
                        </button>
                    )}
                    <button type="button" className="english-button english-button-next" onClick={next}>
                        Next →
                    </button>
                </div>
                <p className="english-hint">Spacja pokazuje kolejny obrazek</p>
            </div>
        </div>
    )
}

export default EnglishGame
