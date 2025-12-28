import {useState, useEffect} from 'react'
import LetterA from './characters/LetterA'
import LetterB from './characters/LetterB'
import LetterC from './characters/LetterC'

const letters = {
    a: LetterA,
    b: LetterB,
    c: LetterC,
}

function App() {
    const [currentLetter, setCurrentLetter] = useState('')

    useEffect(() => {
        function selectLetter(e) {
            const key = e.key.toLowerCase()
            if (letters[key]) {
                setCurrentLetter(key)
            }
        }

        window.addEventListener('keydown', selectLetter)
        return () => window.removeEventListener('keydown', selectLetter)
    }, [])
    if (currentLetter) {
        const LetterComponent = letters[currentLetter]
        return <LetterComponent/>
    } else {
        return "Hello World!"
    }

}

export default App
