import './WelcomeScreen.css'
import Keyboard from './Keyboard'

function WelcomeScreen() {
    return (
        <div className="welcome-container">
            <div className="welcome-content">
                <h1 className="welcome-title">Witaj w Alfabecie!</h1>
                <p className="welcome-subtitle">Naciśnij dowolną literę na klawiaturze</p>
                <Keyboard />
            </div>
        </div>
    )
}

export default WelcomeScreen
