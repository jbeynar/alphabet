import {useState, useEffect, useRef} from 'react'
import LetterA from './characters/LetterA'
import LetterB from './characters/LetterB'
import LetterC from './characters/LetterC'
import LetterD from './characters/LetterD'
import LetterE from './characters/LetterE'
import LetterF from './characters/LetterF'
import WelcomeScreen from './components/WelcomeScreen'
import FuseLoader from './components/FuseLoader'

const letters = {
    a: LetterA,
    b: LetterB,
    c: LetterC,
    d: LetterD,
    e: LetterE,
    f: LetterF,
}

const backgrounds = {
    a: 'linear-gradient(135deg, #ff8a8a 0%, #c0392b 100%)',
    b: 'linear-gradient(135deg, #81ecec 0%, #00897b 100%)',
    c: 'linear-gradient(135deg, #f4d03f 0%, #c0392b 100%)',
    d: 'linear-gradient(135deg, #d4a5ff 0%, #6c3483 100%)',
    e: 'linear-gradient(135deg, #ffb347 0%, #b54708 100%)',
    f: 'linear-gradient(135deg, #74b9ff 0%, #0652DD 100%)',
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
            if (blockedRef.current) return

            if (key === currentLetter) {
                const newCount = pressCount + 1
                setPressCount(newCount)
                if (newCount > 6) {
                    setLetterColor(getRandomColor())
                }
            } else {
                setCurrentLetter(key)
                setPressCount(1)
                setLetterColor('#fff')
                blockedRef.current = true
                setBlocked(true)
                setTimeout(() => {
                    blockedRef.current = false
                    setBlocked(false)
                    setPressCount(2)
                }, 2000)
            }
        }

        window.addEventListener('keydown', selectLetter)
        return () => window.removeEventListener('keydown', selectLetter)
    }, [currentLetter, pressCount])

    const background = currentLetter ? backgrounds[currentLetter] : 'transparent'

    if (currentLetter) {
        const LetterComponent = letters[currentLetter]
        const visibleImages = Math.max(0, pressCount - 2)
        return (
            <div className="app-background" style={{ background }}>
                <LetterComponent showBoard={pressCount >= 2} visibleImages={visibleImages} letterColor={letterColor} />
                {blocked && <FuseLoader />}
            </div>
        )
    } else {
        return <WelcomeScreen />
    }

}

export default App
