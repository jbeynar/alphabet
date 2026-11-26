import {useState} from 'react'
import WelcomeScreen from './components/WelcomeScreen'
import AlphabetGame from './games/alphabet/AlphabetGame'
import MultiplicationGame from './games/multiplication/MultiplicationGame'
import SpellingGame from './games/spelling/SpellingGame'
import EnglishGame from './games/english/EnglishGame'

function App() {
    const [game, setGame] = useState(null)

    if (game === 'alphabet') {
        return <AlphabetGame onExit={() => setGame(null)} />
    }
    if (game === 'multiplication') {
        return <MultiplicationGame onExit={() => setGame(null)} />
    }
    if (game === 'spelling') {
        return <SpellingGame onExit={() => setGame(null)} />
    }
    if (game === 'english') {
        return <EnglishGame onExit={() => setGame(null)} />
    }

    return <WelcomeScreen onSelectGame={setGame} />
}

export default App
