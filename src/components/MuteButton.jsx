import './MuteButton.css'

function MuteButton({ muted, onToggle }) {
    const label = muted ? 'Włącz dźwięk' : 'Wyłącz dźwięk'
    return (
        <button
            type="button"
            className={`mute-button ${muted ? 'mute-button-muted' : ''}`}
            onClick={onToggle}
            aria-label={label}
            aria-pressed={muted}
            title={label}
        >
            {muted ? '🔇' : '🔊'}
        </button>
    )
}

export default MuteButton
