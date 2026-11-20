import { useEffect, useRef, useState } from 'react'

function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value))
}

function NumberField({ label, value, min, max, active, onChange, onActivate }) {
    const [text, setText] = useState(String(value))
    const inputRef = useRef(null)

    useEffect(() => {
        setText(String(value))
    }, [value])

    useEffect(() => {
        if (!active) return
        const id = setTimeout(() => {
            inputRef.current?.focus()
            inputRef.current?.select()
        }, 0)
        return () => clearTimeout(id)
    }, [active])

    function commit(raw) {
        const parsed = parseInt(raw, 10)
        const next = Number.isNaN(parsed) ? value : clamp(parsed, min, max)
        onChange(next)
        setText(String(next))
    }

    function handleChange(raw) {
        const digits = raw.replace(/\D/g, '').slice(0, 2)
        setText(digits)
        const parsed = parseInt(digits, 10)
        if (!Number.isNaN(parsed) && parsed >= min && parsed <= max) onChange(parsed)
    }

    function step(delta) {
        onChange(clamp(value + delta, min, max))
    }

    function handleKeyDown(e) {
        if (e.key === 'ArrowUp') {
            e.preventDefault()
            step(1)
        } else if (e.key === 'ArrowDown') {
            e.preventDefault()
            step(-1)
        } else if (e.key === 'Enter') {
            commit(e.target.value)
        }
    }

    return (
        <div className={`number-field ${active ? 'number-field-active' : ''}`} onClick={onActivate}>
            <span className="number-field-label">{label}</span>
            <div className="number-field-controls">
                <button type="button" className="number-field-button" onClick={() => step(-1)} aria-label={`${label}: mniej`}>−</button>
                <input
                    ref={inputRef}
                    className="number-field-input"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={text}
                    onFocus={e => {
                        onActivate()
                        e.target.select()
                    }}
                    onChange={e => handleChange(e.target.value)}
                    onBlur={e => commit(e.target.value)}
                    onKeyDown={handleKeyDown}
                    aria-label={label}
                />
                <button type="button" className="number-field-button" onClick={() => step(1)} aria-label={`${label}: więcej`}>+</button>
            </div>
            <span className="number-field-range">{min}–{max}</span>
        </div>
    )
}

export default NumberField
