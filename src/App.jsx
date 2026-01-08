import {useState, useEffect, useRef} from 'react'
import Letter from './characters/Letter'
import WelcomeScreen from './components/WelcomeScreen'
import FuseLoader from './components/FuseLoader'

const backgrounds = {
    a: 'linear-gradient(135deg, #ff8a8a 0%, #c0392b 100%)',
    ą: 'linear-gradient(135deg, #ff6b6b 0%, #a93226 100%)',
    b: 'linear-gradient(135deg, #81ecec 0%, #00897b 100%)',
    c: 'linear-gradient(135deg, #f4d03f 0%, #c0392b 100%)',
    ć: 'linear-gradient(135deg, #f7dc6f 0%, #d4ac0d 100%)',
    d: 'linear-gradient(135deg, #d4a5ff 0%, #6c3483 100%)',
    e: 'linear-gradient(135deg, #ffb347 0%, #b54708 100%)',
    ę: 'linear-gradient(135deg, #f5b041 0%, #ca6f1e 100%)',
    f: 'linear-gradient(135deg, #74b9ff 0%, #0652DD 100%)',
    g: 'linear-gradient(135deg, #a8e6cf 0%, #1e8449 100%)',
    h: 'linear-gradient(135deg, #ffeaa7 0%, #d68910 100%)',
    i: 'linear-gradient(135deg, #dfe6e9 0%, #636e72 100%)',
    j: 'linear-gradient(135deg, #fd79a8 0%, #c0392b 100%)',
    k: 'linear-gradient(135deg, #55efc4 0%, #00b894 100%)',
    l: 'linear-gradient(135deg, #a29bfe 0%, #6c5ce7 100%)',
    ł: 'linear-gradient(135deg, #b8a9c9 0%, #5b4b7a 100%)',
    m: 'linear-gradient(135deg, #fab1a0 0%, #e17055 100%)',
    n: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)',
    ń: 'linear-gradient(135deg, #81d4fa 0%, #0277bd 100%)',
    o: 'linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 100%)',
    ó: 'linear-gradient(135deg, #ffe066 0%, #f39c12 100%)',
    p: 'linear-gradient(135deg, #ff7675 0%, #d63031 100%)',
    r: 'linear-gradient(135deg, #00cec9 0%, #00838f 100%)',
    s: 'linear-gradient(135deg, #fdcb6e 0%, #e67e22 100%)',
    ś: 'linear-gradient(135deg, #f8c291 0%, #e55039 100%)',
    t: 'linear-gradient(135deg, #e056fd 0%, #8e44ad 100%)',
    u: 'linear-gradient(135deg, #7bed9f 0%, #2ed573 100%)',
    w: 'linear-gradient(135deg, #70a1ff 0%, #1e90ff 100%)',
    y: 'linear-gradient(135deg, #eccc68 0%, #f7b731 100%)',
    z: 'linear-gradient(135deg, #ff6348 0%, #eb4d4b 100%)',
    ź: 'linear-gradient(135deg, #ff7979 0%, #c0392b 100%)',
    ż: 'linear-gradient(135deg, #badc58 0%, #6ab04c 100%)',
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
            if (!backgrounds[key]) return
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
        const visibleImages = Math.max(0, pressCount - 2)
        return (
            <div className="app-background" style={{ background }}>
                <Letter letter={currentLetter.toUpperCase()} showBoard={pressCount >= 2} visibleImages={visibleImages} letterColor={letterColor} />
                {blocked && <FuseLoader />}
            </div>
        )
    } else {
        return <WelcomeScreen />
    }

}

export default App
