import {useState} from 'react'
import WelcomeScreen from './components/WelcomeScreen'
import AlphabetGame from './games/alphabet/AlphabetGame'
import MultiplicationGame from './games/multiplication/MultiplicationGame'

function App() {
    const [game, setGame] = useState(null)

    if (game === 'alphabet') {
        return <AlphabetGame onExit={() => setGame(null)} />
    }
    if (game === 'multiplication') {
        return <MultiplicationGame onExit={() => setGame(null)} />
    }

    return <WelcomeScreen onSelectGame={setGame} />
}

export default App
