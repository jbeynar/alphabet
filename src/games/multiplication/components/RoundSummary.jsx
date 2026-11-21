function playerScores(history, players) {
    return Array.from({ length: players }, (_, p) =>
        history.filter((ok, i) => i % players === p && ok).length
    )
}

function verdict(scores) {
    if (scores.length === 1) return null
    const best = Math.max(...scores)
    const winners = scores.map((s, i) => (s === best ? i : -1)).filter(i => i >= 0)
    if (winners.length > 1) return 'Remis! 🤝'
    return `Wygrywa Gracz ${winners[0] + 1}! 🏆`
}

function RoundSummary({ history, players, roundSize, onContinue }) {
    const perPlayerSize = roundSize / players
    const scores = playerScores(history, players)
    const result = verdict(scores)

    return (
        <div className="round-summary" role="status" aria-live="polite">
            <h2 className="round-summary-title">Koniec rundy!</h2>
            <div className="round-summary-scores">
                {scores.map((score, p) => (
                    <div key={p} className="round-summary-player">
                        <span className="round-summary-emoji" aria-hidden="true">{score * 2 >= perPlayerSize ? '😊' : '🙂'}</span>
                        {players > 1 && <span className="round-summary-name">Gracz {p + 1}</span>}
                        <span className="round-summary-score">{score} / {perPlayerSize}</span>
                    </div>
                ))}
            </div>
            {result && <p className="round-summary-winner">{result}</p>}
            <button type="button" className="settings-start" onClick={onContinue}>
                Kontynuuj ▶
            </button>
            <p className="round-summary-hint">albo naciśnij Enter</p>
        </div>
    )
}

export default RoundSummary
