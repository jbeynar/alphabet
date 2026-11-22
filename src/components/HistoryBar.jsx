import './HistoryBar.css'

function PlayerFaces({ entries }) {
    return (
        <div className="history-faces">
            {entries.map((ok, index) => (
                <span key={index} className={`history-face ${ok ? 'history-face-good' : 'history-face-bad'}`} aria-hidden="true">
                    {ok ? '😊' : '😢'}
                </span>
            ))}
        </div>
    )
}

function HistoryBar({ history, players, roundSize, currentPlayer }) {
    const perPlayerSize = roundSize / players

    if (players === 1) {
        const good = history.filter(Boolean).length
        return (
            <div className="history-bar" aria-label="Historia odpowiedzi">
                <PlayerFaces entries={history} />
                <span className="history-score">{good} / {perPlayerSize}</span>
            </div>
        )
    }

    return (
        <div className="history-bar history-bar-two" aria-label="Historia odpowiedzi">
            {Array.from({ length: players }, (_, p) => {
                const entries = history.filter((_, i) => i % players === p)
                const good = entries.filter(Boolean).length
                const side = p === 0 ? 'history-player-left' : 'history-player-right'
                return (
                    <div key={p} className={`history-player ${side} ${p === currentPlayer ? 'history-player-active' : ''}`}>
                        <span className="history-player-label">Gracz {p + 1}</span>
                        <span className="history-score">{good} / {perPlayerSize}</span>
                        <PlayerFaces entries={entries} />
                    </div>
                )
            })}
        </div>
    )
}

export default HistoryBar
