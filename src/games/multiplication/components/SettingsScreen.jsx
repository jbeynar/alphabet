import { useState } from 'react'
import NumberField from './NumberField'
import ChoiceField from './ChoiceField'
import { factorRange } from '../utils/questions'

export const SETTINGS_LIMITS = {
    maxA: { min: 1, max: 20 },
    maxB: { min: 1, max: 20 },
    answerCount: { min: 2, max: 8 },
}

export const PLAYER_OPTIONS = [
    { value: 1, label: '1' },
    { value: 2, label: '2' },
]

export const DIFFICULTY_OPTIONS = [
    { value: 'easy', label: 'Łatwy' },
    { value: 'hard', label: 'Trudny' },
]

const FIELD_ROWS = [
    [
        { key: 'players', label: 'Ilu graczy', type: 'choice', options: PLAYER_OPTIONS },
        { key: 'difficulty', label: 'Poziom', type: 'choice', options: DIFFICULTY_OPTIONS },
    ],
    [
        { key: 'maxA', label: 'Pierwsza liczba do', type: 'number' },
        { key: 'maxB', label: 'Druga liczba do', type: 'number' },
        { key: 'answerCount', label: 'Ile odpowiedzi', type: 'number' },
    ],
]

const FIELDS = FIELD_ROWS.flat()

function SettingsScreen({ settings, onChange, onStart }) {
    const [activeIndex, setActiveIndex] = useState(0)
    const range = factorRange(settings)

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
                {FIELD_ROWS.map((row, rowIndex) => (
                    <div key={rowIndex} className="settings-row">
                        {row.map(field => {
                            const index = FIELDS.indexOf(field)
                            const shared = {
                                key: field.key,
                                label: field.label,
                                value: settings[field.key],
                                active: index === activeIndex,
                                onActivate: () => setActiveIndex(index),
                                onChange: value => onChange({ ...settings, [field.key]: value }),
                            }
                            if (field.type === 'choice') {
                                return <ChoiceField {...shared} options={field.options} />
                            }
                            return <NumberField {...shared} min={SETTINGS_LIMITS[field.key].min} max={SETTINGS_LIMITS[field.key].max} />
                        })}
                    </div>
                ))}
            </div>
            <p className="settings-preview">
                {settings.difficulty === 'hard'
                    ? `Działania w zakresie od ${range.minA} do ${range.maxA} × od ${range.minB} do ${range.maxB}`
                    : `Największe działanie: ${settings.maxA} × ${settings.maxB}`}
            </p>
            <button type="button" className="settings-start" onClick={onStart}>
                Start ▶
            </button>
        </div>
    )
}

export default SettingsScreen
