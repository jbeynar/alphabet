const LETTERS = 'abcdefgh'

function Question({ question, chosenIndex, onAnswer }) {
    const answered = chosenIndex !== null

    return (
        <div className="question">
            <div className="question-equation">
                {question.a} <span className="question-times">×</span> {question.b} <span className="question-equals">=</span>
                <span className="question-blank">{answered ? question.correct : '?'}</span>
            </div>
            <div className="answers">
                {question.answers.map((value, index) => {
                    let state = ''
                    if (answered) {
                        if (index === question.correctIndex) state = 'answer-correct'
                        else if (index === chosenIndex) state = 'answer-wrong'
                        else state = 'answer-dimmed'
                    }
                    return (
                        <button
                            key={index}
                            type="button"
                            className={`answer ${state}`}
                            onClick={() => onAnswer(index)}
                            disabled={answered}
                        >
                            <span className="answer-number">{LETTERS[index]}</span>
                            <span className="answer-value">{value}</span>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

export default Question
