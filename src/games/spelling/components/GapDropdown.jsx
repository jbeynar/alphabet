import { useEffect, useRef } from 'react'
import './GapDropdown.css'

function GapDropdown({ options, value, revealed, correct, open, disabled, onOpen, onClose, onSelect }) {
    const rootRef = useRef(null)

    useEffect(() => {
        if (!open) return
        function handlePointerDown(e) {
            if (!rootRef.current?.contains(e.target)) onClose()
        }
        document.addEventListener('pointerdown', handlePointerDown)
        return () => document.removeEventListener('pointerdown', handlePointerDown)
    }, [open, onClose])

    const state = revealed ? (correct ? 'gap-correct' : 'gap-wrong') : ''
    const className = `gap ${open ? 'gap-open' : ''} ${value ? 'gap-filled' : ''} ${state}`

    return (
        <span className={className} ref={rootRef}>
            <button
                type="button"
                className="gap-button"
                aria-haspopup="listbox"
                aria-expanded={open}
                onClick={open ? onClose : onOpen}
                disabled={disabled}
            >
                {value ?? '?'}
            </button>
            {open && (
                <ul className="gap-menu" role="listbox">
                    {options.map(option => (
                        <li key={option}>
                            <button
                                type="button"
                                className={`gap-option ${option === value ? 'gap-option-selected' : ''}`}
                                role="option"
                                aria-selected={option === value}
                                onClick={() => onSelect(option)}
                            >
                                {option}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </span>
    )
}

export default GapDropdown
