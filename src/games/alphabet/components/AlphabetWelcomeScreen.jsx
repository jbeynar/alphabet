import './AlphabetWelcomeScreen.css'
import Keyboard from './Keyboard'

function AlphabetWelcomeScreen() {
    return (
        <div className="alphabet-welcome-container">
            <div className="alphabet-welcome-content">
                <h1 className="alphabet-welcome-title">Witaj w Alfabecie!</h1>
                <p className="alphabet-welcome-subtitle">Naciśnij dowolną literę na klawiaturze</p>
                <Keyboard />
            </div>
        </div>
    )
}

export default AlphabetWelcomeScreen
