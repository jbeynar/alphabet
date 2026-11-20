let voicesPromise = null

function loadVoices() {
    if (voicesPromise) return voicesPromise
    voicesPromise = new Promise(resolve => {
        const synth = window.speechSynthesis
        const existing = synth.getVoices()
        if (existing.length) return resolve(existing)
        const onChange = () => {
            synth.removeEventListener('voiceschanged', onChange)
            resolve(synth.getVoices())
        }
        synth.addEventListener('voiceschanged', onChange)
        setTimeout(() => resolve(synth.getVoices()), 1500)
    })
    return voicesPromise
}

// Higher-quality voices are much clearer for a child than the basic system ones.
// Score each candidate so the best available Polish voice wins.
const QUALITY_HINTS = ['premium', 'enhanced', 'natural', 'neural', 'google', 'microsoft', 'zosia', 'ewa']

function scoreVoice(voice, code, short) {
    const voiceLang = voice.lang.toLowerCase().replace('_', '-')
    if (!voiceLang.startsWith(short)) return -1
    let score = voiceLang === code ? 10 : 5
    const name = voice.name.toLowerCase()
    QUALITY_HINTS.forEach((hint, i) => {
        if (name.includes(hint)) score += QUALITY_HINTS.length - i
    })
    return score
}

function pickVoice(voices, lang) {
    const code = lang.toLowerCase().replace('_', '-')
    const short = code.split('-')[0]
    let best = null
    let bestScore = -1
    for (const voice of voices) {
        const score = scoreVoice(voice, code, short)
        if (score > bestScore) {
            best = voice
            bestScore = score
        }
    }
    return best
}

export async function speakWord(text, { lang = 'pl-PL', rate = 0.7, pitch = 1 } = {}) {
    const synth = window.speechSynthesis
    if (!synth || !text) return

    synth.cancel()
    const voices = await loadVoices()

    // A short lead-in pause keeps the first syllable from being clipped by the engine.
    const utterance = new SpeechSynthesisUtterance(`​ ${text}.`)
    utterance.lang = lang
    utterance.voice = pickVoice(voices, lang)
    utterance.rate = rate
    utterance.pitch = pitch
    utterance.volume = 1
    synth.speak(utterance)
}
