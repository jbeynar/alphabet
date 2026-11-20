import { useCallback, useEffect, useRef, useState } from 'react'
import BackButton from '../../components/BackButton'
import SettingsScreen from './components/SettingsScreen'
import Question from './components/Question'
import FaceFeedback from './components/FaceFeedback'
import HistoryBar from './components/HistoryBar'
import { generateQuestion } from './utils/questions'
import { playGentleWrong } from './utils/sounds'
import { speakWord } from '../../utils/browserSpeech'
import './MultiplicationGame.css'

const DEFAULT_SETTINGS = { maxA: 5, maxB: 5, answerCount: 3 }
const NEXT_QUESTION_DELAY = 3000

function MultiplicationGame({ onExit }) {
    const [phase, setPhase] = useState('settings')
    const [settings, setSettings] = useState(DEFAULT_SETTINGS)
    const [question, setQuestion] = useState(null)
    const [chosenIndex, setChosenIndex] = useState(null)
    const [history, setHistory] = useState([])
    const lockedRef = useRef(false)
    const timerRef = useRef(null)

    useEffect(() => () => clearTimeout(timerRef.current), [])

    useEffect(() => {
        if (phase === 'play' && !question) {
            setQuestion(generateQuestion(settings))
        }
    }, [phase, question, settings])

    function startGame() {
        setHistory([])
        setChosenIndex(null)
        lockedRef.current = false
        setPhase('play')
    }

    const answer = useCallback(index => {
        if (lockedRef.current || !question) return
        lockedRef.current = true
        const correct = index === question.correctIndex
        setChosenIndex(index)
        setHistory(h => [...h, correct])
        if (correct) {
            speakWord(`${question.a} razy ${question.b} to ${question.correct}`, { lang: 'pl-PL' })
        } else {
            playGentleWrong()
        }
        timerRef.current = setTimeout(() => {
            setQuestion(prev => generateQuestion(settings, prev))
            setChosenIndex(null)
            lockedRef.current = false
        }, NEXT_QUESTION_DELAY)
    }, [question, settings])

    useEffect(() => {
        function handleKey(e) {
            if (e.key === 'Escape') {
                onExit?.()
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
    }, [phase, settings.answerCount, answer, onExit])

    return (
        <div className="multiplication-container">
            <BackButton onClick={onExit} />
            {phase === 'settings' ? (
                <SettingsScreen settings={settings} onChange={setSettings} onStart={startGame} />
            ) : (
                <div className="multiplication-content multiplication-play">
                    {question && <Question question={question} chosenIndex={chosenIndex} onAnswer={answer} />}
                    {question && chosenIndex !== null && <FaceFeedback correct={chosenIndex === question.correctIndex} />}
                    <HistoryBar history={history} />
                </div>
            )}
        </div>
    )
}

export default MultiplicationGame
