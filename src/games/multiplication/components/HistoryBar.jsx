const ROUND_SIZE = 10

function HistoryBar({ history }) {
    if (history.length === 0) return null
    const roundLength = history.length % ROUND_SIZE || ROUND_SIZE
    const round = history.slice(-roundLength)
    const good = round.filter(Boolean).length

    return (
        <div className="history-bar" aria-label="Historia odpowiedzi">
            <div className="history-faces">
                {round.map((ok, index) => (
                    <span key={`${history.length - roundLength + index}`} className={`history-face ${ok ? 'history-face-good' : 'history-face-bad'}`} aria-hidden="true">
                        {ok ? '😊' : '😢'}
                    </span>
                ))}
            </div>
            <span className="history-score">{good} / {round.length}</span>
        </div>
    )
}

export default HistoryBar
