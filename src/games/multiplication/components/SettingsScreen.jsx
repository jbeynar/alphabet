import { useState } from 'react'
import NumberField from './NumberField'

export const SETTINGS_LIMITS = {
    players: { min: 1, max: 2 },
    maxA: { min: 1, max: 20 },
    maxB: { min: 1, max: 20 },
    answerCount: { min: 2, max: 8 },
}

const FIELDS = [
    { key: 'players', label: 'Ilu graczy' },
    { key: 'maxA', label: 'Pierwsza liczba do' },
    { key: 'maxB', label: 'Druga liczba do' },
    { key: 'answerCount', label: 'Ile odpowiedzi' },
]

function SettingsScreen({ settings, onChange, onStart }) {
    const [activeIndex, setActiveIndex] = useState(0)

    function handleKeyDown(e) {
        if (e.key === 'ArrowRight' || (e.key === 'Tab' && !e.shiftKey)) {
            e.preventDefault()
            setActiveIndex(i => (i + 1) % FIELDS.length)
        } else if (e.key === 'ArrowLeft' || (e.key === 'Tab' && e.shiftKey)) {
            e.preventDefault()
            setActiveIndex(i => (i - 1 + FIELDS.length) % FIELDS.length)
        } else if (e.key === 'Enter') {
            e.preventDefault()
            onStart()
        }
    }

    return (
        <div className="multiplication-content multiplication-settings" onKeyDown={handleKeyDown}>
            <h1 className="multiplication-title">Mnożenie</h1>
            <p className="multiplication-subtitle">Ustaw grę i naciśnij Enter</p>
            <div className="settings-fields">
                {FIELDS.map((field, index) => (
                    <NumberField
                        key={field.key}
                        label={field.label}
                        value={settings[field.key]}
                        min={SETTINGS_LIMITS[field.key].min}
                        max={SETTINGS_LIMITS[field.key].max}
                        active={index === activeIndex}
                        onActivate={() => setActiveIndex(index)}
                        onChange={value => onChange({ ...settings, [field.key]: value })}
                    />
                ))}
            </div>
            <p className="settings-preview">
                Największe działanie: {settings.maxA} × {settings.maxB}
            </p>
            <button type="button" className="settings-start" onClick={onStart}>
                Start ▶
            </button>
        </div>
    )
}

export default SettingsScreen
