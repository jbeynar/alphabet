import { useEffect } from 'react'
import BackButton from '../../components/BackButton'
import './SpellingGame.css'

function SpellingGame({ onExit }) {
    useEffect(() => {
        function handleKey(e) {
            if (e.key === 'Escape') onExit?.()
        }
        window.addEventListener('keydown', handleKey)
        return () => window.removeEventListener('keydown', handleKey)
    }, [onExit])

    return (
        <div className="spelling-container">
            <BackButton onClick={onExit} />
            <div className="spelling-content">
                <span className="spelling-emoji" aria-hidden="true">✏️</span>
                <h1 className="spelling-title">Ortografia</h1>
                <p className="spelling-subtitle">Nauka trudnych wyrazów</p>
                <p className="spelling-placeholder">Gra jest w przygotowaniu. Wróć tu wkrótce!</p>
            </div>
        </div>
    )
}

export default SpellingGame
