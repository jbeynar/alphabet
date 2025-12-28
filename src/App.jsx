import {useState, useEffect, useRef} from 'react'
import LetterA from './characters/LetterA'
import LetterB from './characters/LetterB'
import LetterC from './characters/LetterC'

const letters = {
    a: LetterA,
    b: LetterB,
    c: LetterC,
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
    const [blocked, setBlocked] = useState(false)
    const blockedRef = useRef(false)

    useEffect(() => {
        function selectLetter(e) {
            if (blockedRef.current) return

            const key = e.key.toLowerCase()
            if (letters[key]) {
                setCurrentLetter(key)
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
    }, [])

    if (currentLetter) {
        const LetterComponent = letters[currentLetter]
        return (
            <>
                <LetterComponent/>
                {blocked && <div style={blockedStyle}>Poczekaj dwie sekundy</div>}
            </>
        )
    } else {
        return "Hello World!"
    }

}

export default App
