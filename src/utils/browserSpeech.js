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

function pickVoice(voices, lang) {
    const code = lang.toLowerCase().replace('_', '-')
    const short = code.split('-')[0]
    return (
        voices.find(v => v.lang.toLowerCase().replace('_', '-') === code) ||
        voices.find(v => v.lang.toLowerCase().startsWith(short)) ||
        null
    )
}

export async function speakWord(text, { lang = 'pl-PL', rate = 0.8, pitch = 1 } = {}) {
    const synth = window.speechSynthesis
    if (!synth || !text) return

    synth.cancel()
    const voices = await loadVoices()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = lang
    utterance.voice = pickVoice(voices, lang)
    utterance.rate = rate
    utterance.pitch = pitch
    utterance.volume = 1
    synth.speak(utterance)
}
