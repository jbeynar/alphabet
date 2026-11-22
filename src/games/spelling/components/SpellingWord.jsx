import GapDropdown from './GapDropdown'

function SpellingWord({ segments, choices, openGap, result, disabled, onOpenGap, onCloseGap, onChoose }) {
    let gapIndex = -1
    return (
        <div className="spelling-word" lang="pl">
            {segments.map((segment, i) => {
                if (segment.type === 'text') {
                    return <span key={i} className="spelling-letters">{segment.value}</span>
                }
                const index = ++gapIndex
                return (
                    <GapDropdown
                        key={i}
                        options={segment.options}
                        value={choices[index]}
                        revealed={result !== null}
                        correct={result?.[index] ?? false}
                        open={openGap === index}
                        disabled={disabled}
                        onOpen={() => onOpenGap(index)}
                        onClose={onCloseGap}
                        onSelect={option => onChoose(index, option)}
                    />
                )
            })}
        </div>
    )
}

export default SpellingWord
