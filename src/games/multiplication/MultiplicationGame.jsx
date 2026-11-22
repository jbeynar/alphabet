import { useCallback, useEffect, useRef, useState } from 'react'
import BackButton from '../../components/BackButton'
import MuteButton from '../../components/MuteButton'
import SettingsScreen, { SETTINGS_LIMITS, PLAYER_OPTIONS, DIFFICULTY_OPTIONS } from './components/SettingsScreen'
import Question from './components/Question'
import FaceFeedback from '../../components/FaceFeedback'
import HistoryBar from '../../components/HistoryBar'
import RoundSummary from '../../components/RoundSummary'
import { generateQuestion } from './utils/questions'
import { playGentleWrong } from '../../utils/sounds'
import { speakWord } from '../../utils/browserSpeech'
import './MultiplicationGame.css'

const DEFAULT_SETTINGS = { players: 1, maxA: 7, maxB: 7, answerCount: 4, difficulty: 'easy' }
const NEXT_QUESTION_DELAY = 3000
const NEXT_QUESTION_DELAY_MUTED = 1200
const MUTED_STORAGE_KEY = 'multiplication.muted'
const SETTINGS_STORAGE_KEY = 'multiplication.settings'

function readMuted() {
    try {
        return localStorage.getItem(MUTED_STORAGE_KEY) === '1'
    } catch {
        return false
    }
}

function readSettings() {
    try {
        const stored = JSON.parse(localStorage.getItem(SETTINGS_STORAGE_KEY))
        if (!stored || typeof stored !== 'object') return DEFAULT_SETTINGS
        const settings = { ...DEFAULT_SETTINGS }
        for (const key of Object.keys(SETTINGS_LIMITS)) {
            const { min, max } = SETTINGS_LIMITS[key]
            if (Number.isInteger(stored[key]) && stored[key] >= min && stored[key] <= max) settings[key] = stored[key]
        }
        if (PLAYER_OPTIONS.some(o => o.value === stored.players)) settings.players = stored.players
        if (DIFFICULTY_OPTIONS.some(o => o.value === stored.difficulty)) settings.difficulty = stored.difficulty
        return settings
    } catch {
        return DEFAULT_SETTINGS
    }
}

function saveSettings(settings) {
    try {
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings))
    } catch {}
}
const ROUND_SIZE_PER_PLAYER = 10

function MultiplicationGame({ onExit }) {
    const [phase, setPhase] = useState('settings')
    const [settings, setSettings] = useState(readSettings)
    const [question, setQuestion] = useState(null)
    const [chosenIndex, setChosenIndex] = useState(null)
    const [history, setHistory] = useState([])
    const [muted, setMuted] = useState(readMuted)
    const lockedRef = useRef(false)
    const timerRef = useRef(null)

    const roundSize = settings.players * ROUND_SIZE_PER_PLAYER
    const answeredTurns = chosenIndex !== null ? history.length - 1 : history.length
    const currentPlayer = answeredTurns % settings.players

    useEffect(() => () => clearTimeout(timerRef.current), [])

    function toggleMuted() {
        const next = !muted
        try {
            localStorage.setItem(MUTED_STORAGE_KEY, next ? '1' : '0')
        } catch {}
        if (next) window.speechSynthesis?.cancel()
        setMuted(next)
    }

    useEffect(() => {
        if (phase === 'play' && !question) {
            setQuestion(generateQuestion(settings))
        }
    }, [phase, question, settings])

    function startGame() {
        saveSettings(settings)
        setHistory([])
        setChosenIndex(null)
        setQuestion(null)
        lockedRef.current = false
        setPhase('play')
    }

    const continueRound = useCallback(() => {
        setHistory([])
        setChosenIndex(null)
        setQuestion(prev => generateQuestion(settings, prev))
        lockedRef.current = false
        setPhase('play')
    }, [settings])

    const answer = useCallback(index => {
        if (lockedRef.current || !question) return
        lockedRef.current = true
        const correct = index === question.correctIndex
        const roundFinished = history.length + 1 >= roundSize
        setChosenIndex(index)
        setHistory(h => [...h, correct])
        if (!muted && correct) {
            speakWord(`${question.a} razy ${question.b} to ${question.correct}`, { lang: 'pl-PL' })
        } else if (!muted) {
            playGentleWrong()
        }
        timerRef.current = setTimeout(() => {
            setChosenIndex(null)
            if (roundFinished) {
                setPhase('summary')
                return
            }
            setQuestion(prev => generateQuestion(settings, prev))
            lockedRef.current = false
        }, muted ? NEXT_QUESTION_DELAY_MUTED : NEXT_QUESTION_DELAY)
    }, [question, settings, history.length, roundSize, muted])

    useEffect(() => {
        function handleKey(e) {
            if (e.key === 'Escape') {
                onExit?.()
                return
            }
            if (phase === 'summary') {
                if (e.key === 'Enter') {
                    e.preventDefault()
                    continueRound()
                }
                return
            }
            if (phase !== 'play') return
            if (e.key.length !== 1) return
            const index = e.key.toLowerCase().charCodeAt(0) - 'a'.charCodeAt(0)
            if (index >= 0 && index < settings.answerCount) {
                answer(index)
            }
        }
        window.addEventListener('keydown', handleKey)
        return () => window.removeEventListener('keydown', handleKey)
    }, [phase, settings.answerCount, answer, continueRound, onExit])

    return (
        <div className={`multiplication-container ${phase === 'play' && settings.players > 1 && currentPlayer === 1 ? 'multiplication-container-player2' : ''}`}>
            <BackButton onClick={onExit} />
            <MuteButton muted={muted} onToggle={toggleMuted} />
            {phase === 'settings' ? (
                <SettingsScreen settings={settings} onChange={setSettings} onStart={startGame} />
            ) : (
                <div className="multiplication-content multiplication-play">
                    {phase === 'summary' ? (
                        <RoundSummary history={history} players={settings.players} roundSize={roundSize} onContinue={continueRound} />
                    ) : (
                        <>
                            {settings.players > 1 && <p className="turn-label">Gracz {currentPlayer + 1}</p>}
                            {question && <Question question={question} chosenIndex={chosenIndex} onAnswer={answer} />}
                            {question && chosenIndex !== null && <FaceFeedback correct={chosenIndex === question.correctIndex} />}
                        </>
                    )}
                    <HistoryBar history={history} players={settings.players} roundSize={roundSize} currentPlayer={phase === 'play' ? currentPlayer : -1} />
                </div>
            )}
        </div>
    )
}

export default MultiplicationGame
