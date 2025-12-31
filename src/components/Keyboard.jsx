import './Keyboard.css'

function Keyboard() {
    const keyWidth = 40
    const keyHeight = 40
    const gap = 8
    const radius = 8
    const padding = 24

    const rows = [
        { keys: ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'], offset: 0 },
        { keys: ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'], offset: 24 },
        { keys: ['Z', 'X', 'C', 'V', 'B', 'N', 'M'], offset: 60 },
    ]

    const keysWidth = 10 * keyWidth + 9 * gap
    const totalWidth = keysWidth + padding * 2
    const totalHeight = 3 * keyHeight + 2 * gap + keyHeight + gap + padding * 2

    return (
        <svg
            viewBox={`0 0 ${totalWidth} ${totalHeight}`}
            className="keyboard-svg"
            aria-label="Klawiatura"
        >
            {/* Keyboard frame */}
            <rect
                x="0"
                y="0"
                width={totalWidth}
                height={totalHeight}
                rx="16"
                fill="none"
                stroke="rgba(255, 255, 255, 0.3)"
                strokeWidth="2"
            />

            {/* Letter keys */}
            {rows.map((row, rowIndex) => (
                row.keys.map((key, keyIndex) => {
                    const x = padding + row.offset + keyIndex * (keyWidth + gap)
                    const y = padding + rowIndex * (keyHeight + gap)
                    return (
                        <g key={key}>
                            <rect
                                x={x}
                                y={y}
                                width={keyWidth}
                                height={keyHeight}
                                rx={radius}
                                fill="#fff"
                                stroke="#e9ecef"
                                strokeWidth="1.5"
                            />
                            <text
                                x={x + keyWidth / 2}
                                y={y + keyHeight / 2 + 1}
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fontSize="15"
                                fontWeight="500"
                                fontFamily="system-ui, -apple-system, sans-serif"
                                fill="#495057"
                            >
                                {key}
                            </text>
                        </g>
                    )
                })
            ))}

            {/* Spacebar */}
            {(() => {
                const spaceWidth = 200
                const spaceX = (totalWidth - spaceWidth) / 2
                const spaceY = padding + 3 * (keyHeight + gap)
                return (
                    <rect
                        x={spaceX}
                        y={spaceY}
                        width={spaceWidth}
                        height={keyHeight}
                        rx={radius}
                        fill="#fff"
                        stroke="#e9ecef"
                        strokeWidth="1.5"
                    />
                )
            })()}
        </svg>
    )
}

export default Keyboard
