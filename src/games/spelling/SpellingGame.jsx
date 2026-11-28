import { useCallback, useEffect, useRef, useState } from 'react'
import BackButton from '../../components/BackButton'
import MuteButton from '../../components/MuteButton'
import SpeakerIcon from '../../components/SpeakerIcon'
import FaceFeedback from '../../components/FaceFeedback'
import HistoryBar from '../../components/HistoryBar'
import RoundSummary from '../../components/RoundSummary'
import SpellingWord from './components/SpellingWord'
import { splitWord, countGaps, checkGaps, pickWord } from './utils/gaps'
import { playGentleWrong } from '../../utils/sounds'
import { speakWord } from '../../utils/browserSpeech'
import words from './data/words.json'
import './SpellingGame.css'

const ROUND_SIZE = 10
const NEXT_WORD_DELAY = 3000
const NEXT_WORD_DELAY_MUTED = 1200
const MUTED_STORAGE_KEY = 'spelling.muted'
const PLAYABLE = words.filter(word => countGaps(splitWord(word)) > 0)

function readMuted() {
    try {
        return localStorage.getItem(MUTED_STORAGE_KEY) === '1'
    } catch {
        return false
    }
}

function makeTurn(previous) {
    const word = pickWord(PLAYABLE, previous)
    if (!word) return null
    const segments = splitWord(word)
    return { word, segments, gaps: segments.filter(s => s.type === 'gap') }
}

function SpellingGame({ onExit }) {
    const [phase, setPhase] = useState('play')
    const [turn, setTurn] = useState(null)
    const [choices, setChoices] = useState([])
    const [openGap, setOpenGap] = useState(null)
    const [result, setResult] = useState(null)
    const [history, setHistory] = useState([])
    const [muted, setMuted] = useState(readMuted)
    const lockedRef = useRef(false)
    const timerRef = useRef(null)
    const prevWordRef = useRef(null)

    const gapCount = turn?.gaps.length ?? 0
    const answered = result !== null
    const correct = answered && result.every(Boolean)

    useEffect(() => () => {
        clearTimeout(timerRef.current)
        window.speechSynthesis?.cancel()
    }, [])

    useEffect(() => {
        if (phase !== 'play' || turn) return
        const next = makeTurn(prevWordRef.current)
        if (!next) return
        prevWordRef.current = next.word
        setTurn(next)
        setChoices(Array(next.gaps.length).fill(null))
        setOpenGap(0)
        setResult(null)
        lockedRef.current = false
    }, [phase, turn])

    useEffect(() => {
        if (turn && !muted) speakWord(turn.word, { lang: 'pl-PL' })
    }, [turn, muted])

    function toggleMuted() {
        const next = !muted
        try {
            localStorage.setItem(MUTED_STORAGE_KEY, next ? '1' : '0')
        } catch {}
        if (next) window.speechSynthesis?.cancel()
        setMuted(next)
    }

    const closeGap = useCallback(() => setOpenGap(null), [])

    const submit = useCallback(answers => {
        if (lockedRef.current || !turn || answers.some(choice => choice === null)) return
        lockedRef.current = true
        const perGap = checkGaps(turn.segments, answers)
        const ok = perGap.every(Boolean)
        const roundFinished = history.length + 1 >= ROUND_SIZE
        setResult(perGap)
        setOpenGap(null)
        setHistory(h => [...h, ok])
        if (!muted && ok) {
            speakWord(turn.word, { lang: 'pl-PL' })
        } else if (!muted) {
            playGentleWrong()
        }
        timerRef.current = setTimeout(() => {
            setResult(null)
            if (roundFinished) {
                setPhase('summary')
                return
            }
            setTurn(null)
        }, muted ? NEXT_WORD_DELAY_MUTED : NEXT_WORD_DELAY)
    }, [turn, history.length, muted])

    const choose = useCallback((index, option) => {
        if (lockedRef.current) return
        const next = [...choices]
        next[index] = option
        setChoices(next)
        const after = next.findIndex((choice, i) => i > index && choice === null)
        const before = next.findIndex(choice => choice === null)
        if (after >= 0 || before >= 0) {
            setOpenGap(after >= 0 ? after : before)
            return
        }
        submit(next)
    }, [choices, submit])

    const continueRound = useCallback(() => {
        setHistory([])
        setResult(null)
        setTurn(null)
        setPhase('play')
    }, [])

    useEffect(() => {
        function handleKey(e) {
            if (e.key === 'Escape') {
                if (openGap !== null) setOpenGap(null)
                else onExit?.()
                return
            }
            if (phase === 'summary') {
                if (e.key === 'Enter') {
                    e.preventDefault()
                    continueRound()
                }
                return
            }
            if (phase !== 'play' || !turn || answered) return
            if (e.key === 'Enter') {
                e.preventDefault()
                if (openGap !== null) setOpenGap(null)
                else setOpenGap(Math.max(0, choices.findIndex(choice => choice === null)))
                return
            }
            if (openGap !== null && (e.key === '1' || e.key === 'ArrowUp')) {
                choose(openGap, turn.gaps[openGap].options[0])
                return
            }
            if (openGap !== null && (e.key === '2' || e.key === 'ArrowDown')) {
                choose(openGap, turn.gaps[openGap].options[1])
                return
            }
            if (e.key === 'ArrowRight' || (e.key === 'Tab' && !e.shiftKey)) {
                e.preventDefault()
                setOpenGap(((openGap ?? -1) + 1) % gapCount)
                return
            }
            if (e.key === 'ArrowLeft' || (e.key === 'Tab' && e.shiftKey)) {
                e.preventDefault()
                setOpenGap(((openGap ?? 0) - 1 + gapCount) % gapCount)
            }
        }
        window.addEventListener('keydown', handleKey)
        return () => window.removeEventListener('keydown', handleKey)
    }, [phase, turn, answered, openGap, choices, gapCount, choose, continueRound, onExit])

    return (
        <div className="spelling-container">
            <BackButton onClick={onExit} />
            <MuteButton muted={muted} onToggle={toggleMuted} />
            <div className="spelling-content spelling-play">
                {phase === 'summary' ? (
                    <RoundSummary history={history} players={1} roundSize={ROUND_SIZE} onContinue={continueRound} />
                ) : (
                    turn && (
                        <>
                            <h1 className="spelling-prompt">Uzupełnij wyraz</h1>
                            <SpellingWord
                                segments={turn.segments}
                                choices={choices}
                                openGap={openGap}
                                result={result}
                                disabled={answered}
                                onOpenGap={setOpenGap}
                                onCloseGap={closeGap}
                                onChoose={choose}
                            />
                            {answered && !correct && (
                                <p className="spelling-correct-word" lang="pl">
                                    {turn.segments.map((segment, i) =>
                                        segment.type === 'gap' ? <b key={i}>{segment.answer}</b> : <span key={i}>{segment.value}</span>
                                    )}
                                </p>
                            )}
                            {!muted && (
                                <div className="spelling-actions">
                                    <button type="button" className="spelling-repeat" onClick={() => speakWord(turn.word, { lang: 'pl-PL' })}>
                                        <SpeakerIcon /> Powtórz
                                    </button>
                                </div>
                            )}
                            <p className="spelling-hint">1 / 2 wybiera literę</p>
                            {answered && <FaceFeedback correct={correct} />}
                        </>
                    )
                )}
                <HistoryBar history={history} players={1} roundSize={ROUND_SIZE} currentPlayer={phase === 'play' ? 0 : -1} />
            </div>
        </div>
    )
}

export default SpellingGame
