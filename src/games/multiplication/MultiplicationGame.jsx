import { useEffect } from 'react'
import BackButton from '../../components/BackButton'
import './MultiplicationGame.css'

function MultiplicationGame({ onExit }) {
    useEffect(() => {
        function handleKey(e) {
            if (e.key === 'Escape') onExit?.()
        }
        window.addEventListener('keydown', handleKey)
        return () => window.removeEventListener('keydown', handleKey)
    }, [onExit])

    return (
        <div className="multiplication-container">
            <BackButton onClick={onExit} />
            <div className="multiplication-content">
                <h1 className="multiplication-title">Hello world</h1>
                <p className="multiplication-subtitle">Gra „Mnożenie” jest w budowie. Naciśnij Esc, aby wrócić.</p>
            </div>
        </div>
    )
}

export default MultiplicationGame
