let audioContext = null

function getContext() {
    const Ctx = window.AudioContext || window.webkitAudioContext
    if (!Ctx) return null
    if (!audioContext) audioContext = new Ctx()
    if (audioContext.state === 'suspended') audioContext.resume()
    return audioContext
}

export function playGentleWrong() {
    const ctx = getContext()
    if (!ctx) return
    const now = ctx.currentTime
    const notes = [
        { freq: 330, start: 0, duration: 0.22 },
        { freq: 262, start: 0.2, duration: 0.35 },
    ]
    for (const { freq, start, duration } of notes) {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq, now + start)
        gain.gain.setValueAtTime(0, now + start)
        gain.gain.linearRampToValueAtTime(0.12, now + start + 0.03)
        gain.gain.exponentialRampToValueAtTime(0.001, now + start + duration)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(now + start)
        osc.stop(now + start + duration + 0.05)
    }
}
