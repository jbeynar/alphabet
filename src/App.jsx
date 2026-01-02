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

function getRandomColor() {
    const colors = [
        '#FF6B6B', // jasny czerwony
        '#FFE66D', // słoneczny żółty
        '#4ECDC4', // turkusowy
        '#FF9F43', // pomarańczowy
        '#A8E6CF', // miętowy
        '#FF85A2', // różowy
        '#88D8B0', // zielony pastelowy
        '#FFCC5C', // złoty żółty
        '#96E6A1', // jasny zielony
        '#DDA0DD', // śliwkowy pastelowy
        '#87CEEB', // błękitny
        '#F8B500', // żółty słonecznikowy
        '#FFB6C1', // jasny róż
        '#98D8C8', // morski
        '#F7DC6F', // kanarkowy
        '#BB8FCE', // lawendowy
        '#85C1E9', // niebieski pastelowy
        '#F1948A', // koralowy
        '#82E0AA', // szmaragdowy jasny
        '#F5B041', // mandarynkowy
        '#D7BDE2', // fioletowy pastelowy
        '#76D7C4', // akwamaryna
        '#F9E79F', // kremowy żółty
        '#EC7063', // malinowy
        '#73C6B6', // jadeitowy
        '#FAD7A0', // brzoskwiniowy
        '#C39BD3', // orchidea
        '#7FB3D5', // chabrowy jasny
        '#F0B27A', // morelowy
        '#ABEBC6', // pistacjowy
        '#E59866', // cynamonowy
        '#AED6F1', // baby blue
        '#F5B7B1', // pudrowy róż
        '#D5F5E3', // miętowa biel
        '#FADBD8', // różany
        '#D4E6F1', // lodowy błękit
    ]
    return colors[Math.floor(Math.random() * colors.length)]
}

function App() {
    const [currentLetter, setCurrentLetter] = useState('')
    const [pressCount, setPressCount] = useState(0)
    const [blocked, setBlocked] = useState(false)
    const [letterColor, setLetterColor] = useState('#fff')
    const blockedRef = useRef(false)

    useEffect(() => {
        function selectLetter(e) {
            const key = e.key.toLowerCase()
            if (!letters[key]) return

            if (key === currentLetter) {
                const newCount = pressCount + 1
                setPressCount(newCount)
                if (newCount > 6) {
                    setLetterColor(getRandomColor())
                }
            } else {
                if (blockedRef.current) return
                setCurrentLetter(key)
                setPressCount(1)
                setLetterColor('#fff')
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
    }, [currentLetter, pressCount])

    if (currentLetter) {
        const LetterComponent = letters[currentLetter]
        const visibleImages = Math.max(0, pressCount - 2)
        return (
            <>
                <LetterComponent showBoard={pressCount >= 2} visibleImages={visibleImages} letterColor={letterColor} />
                {blocked && <div style={blockedStyle}>Poczekaj dwie sekundy</div>}
            </>
        )
    } else {
        return <WelcomeScreen />
    }

}

export default App
