import { useEffect, useRef } from 'react'

function ChoiceField({ label, options, value, active, onChange, onActivate }) {
    const ref = useRef(null)
    const index = Math.max(0, options.findIndex(o => o.value === value))

    useEffect(() => {
        if (!active) return
        const id = setTimeout(() => ref.current?.focus(), 0)
        return () => clearTimeout(id)
    }, [active])

    function move(delta) {
        const next = (index + delta + options.length) % options.length
        onChange(options[next].value)
    }

    function handleKeyDown(e) {
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === ' ') {
            e.preventDefault()
            move(e.key === 'ArrowUp' ? -1 : 1)
        }
    }

    return (
        <div
            ref={ref}
            className={`number-field choice-field ${active ? 'number-field-active' : ''}`}
            tabIndex={0}
            role="radiogroup"
            aria-label={label}
            onClick={onActivate}
            onFocus={onActivate}
            onKeyDown={handleKeyDown}
        >
            <span className="number-field-label">{label}</span>
            <div className="choice-options">
                {options.map(option => (
                    <button
                        key={option.value}
                        type="button"
                        tabIndex={-1}
                        role="radio"
                        aria-checked={option.value === value}
                        className={`choice-option ${option.value === value ? 'choice-option-selected' : ''}`}
                        onClick={() => onChange(option.value)}
                    >
                        {option.label}
                    </button>
                ))}
            </div>
            <span className="number-field-range">↑ ↓ zmienia</span>
        </div>
    )
}

export default ChoiceField
