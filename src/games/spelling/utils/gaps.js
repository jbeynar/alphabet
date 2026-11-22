export const PAIRS = {
    'ó': ['ó', 'u'],
    'u': ['u', 'ó'],
    'ż': ['ż', 'rz'],
    'rz': ['rz', 'ż'],
    'h': ['h', 'ch'],
    'ch': ['ch', 'h'],
}

const DIGRAPHS = ['ch', 'rz']

function shuffleArray(array) {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
}

export function splitWord(word) {
    const segments = []
    let buffer = ''
    let i = 0
    while (i < word.length) {
        const token = DIGRAPHS.find(d => word.startsWith(d, i)) ?? word[i]
        if (PAIRS[token]) {
            if (buffer) segments.push({ type: 'text', value: buffer })
            buffer = ''
            segments.push({ type: 'gap', answer: token, options: shuffleArray(PAIRS[token]) })
        } else {
            buffer += token
        }
        i += token.length
    }
    if (buffer) segments.push({ type: 'text', value: buffer })
    return segments
}

export function countGaps(segments) {
    return segments.filter(s => s.type === 'gap').length
}

export function checkGaps(segments, choices) {
    return segments.filter(s => s.type === 'gap').map((gap, i) => choices[i] === gap.answer)
}

export function pickWord(words, previous) {
    const candidates = words.length > 1 ? words.filter(w => w !== previous) : words
    if (candidates.length === 0) return null
    return candidates[Math.floor(Math.random() * candidates.length)]
}
