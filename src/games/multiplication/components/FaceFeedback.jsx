function FaceFeedback({ correct }) {
    return (
        <div className={`face-feedback ${correct ? 'face-happy' : 'face-sad'}`} role="status" aria-live="polite">
            <span className="face-emoji" aria-hidden="true">{correct ? '😊' : '😢'}</span>
            <span className="face-text">{correct ? 'Brawo!' : 'Spróbuj jeszcze raz!'}</span>
        </div>
    )
}

export default FaceFeedback
