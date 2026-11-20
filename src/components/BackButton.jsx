import './BackButton.css'

function BackButton({ onClick }) {
    return (
        <button
            type="button"
            className="back-button"
            onClick={onClick}
            aria-label="Wróć do wyboru gier"
            title="Wróć do wyboru gier (Esc)"
        >
            ←
        </button>
    )
}

export default BackButton
