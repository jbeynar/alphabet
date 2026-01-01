import {useState, useEffect, useRef} from 'react'
import LetterA from './characters/LetterA'
import LetterB from './characters/LetterB'
import LetterC from './characters/LetterC'
import LetterD from './characters/LetterD'
import LetterE from './characters/LetterE'
import LetterF from './characters/LetterF'
import WelcomeScreen from './components/WelcomeScreen'

const letters = {
    a: LetterA,
    b: LetterB,
    c: LetterC,
    d: LetterD,
    e: LetterE,
    f: LetterF,
}

const blockedStyle = {
    position: 'fixed',
    top: '1rem',
    right: '1rem',
    background: 'rgba(0,0,0,0.7)',
    color: '#fff',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    fontSize: '1rem',
}

function App() {
    const [currentLetter, setCurrentLetter] = useState('')
    const [pressCount, setPressCount] = useState(0)
    const [blocked, setBlocked] = useState(false)
    const blockedRef = useRef(false)

    useEffect(() => {
        function selectLetter(e) {
            const key = e.key.toLowerCase()
            if (!letters[key]) return

            if (key === currentLetter) {
                setPressCount(prev => prev + 1)
            } else {
                if (blockedRef.current) return
                setCurrentLetter(key)
                setPressCount(1)
                blockedRef.current = true
                setBlocked(true)
                setTimeout(() => {
                    blockedRef.current = false
                    setBlocked(false)
                }, 2000)
            }
        }

        window.addEventListener('keydown', selectLetter)
        return () => window.removeEventListener('keydown', selectLetter)
    }, [currentLetter])

    if (currentLetter) {
        const LetterComponent = letters[currentLetter]
        return (
            <>
                <LetterComponent showBoard={pressCount >= 2} />
                {blocked && <div style={blockedStyle}>Poczekaj dwie sekundy</div>}
            </>
        )
    } else {
        return <WelcomeScreen />
    }

}

export default App
