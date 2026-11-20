import { useEffect } from 'react'
import './WelcomeScreen.css'

const GAMES = [
    { id: 'alphabet', title: 'Alfabet', emoji: '🔤', available: true },
    { id: 'multiplication', title: 'Mnożenie', emoji: '✖️', available: true },
]

function WelcomeScreen({ onSelectGame }) {
    // Keys 1..n pick a game, so the app stays keyboard-driven like the games themselves
    useEffect(() => {
        function pickByNumber(e) {
            const index = Number(e.key) - 1
            const game = GAMES[index]
            if (game?.available) onSelectGame(game.id)
        }
        window.addEventListener('keydown', pickByNumber)
        return () => window.removeEventListener('keydown', pickByNumber)
    }, [onSelectGame])

    return (
        <div className="welcome-container">
            <div className="welcome-content">
                <h1 className="welcome-title">Wybierz grę</h1>
                <div className="welcome-games">
                    {GAMES.map((game, index) => (
                        <button
                            key={game.id}
                            type="button"
                            className="welcome-game"
                            disabled={!game.available}
                            onClick={() => onSelectGame(game.id)}
                        >
                            <span className="welcome-game-number">{index + 1}</span>
                            <span className="welcome-game-emoji" aria-hidden="true">{game.emoji}</span>
                            <span className="welcome-game-title">{game.title}</span>
                            {!game.available && <span className="welcome-game-badge">Wkrótce</span>}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default WelcomeScreen
