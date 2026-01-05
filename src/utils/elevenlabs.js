const API_KEY = 'sk_ac802e9c250bd364a1c88242ff0f69d72850d47339b42c57'
const VOICE_ID = 'aAY9hMI6VU335JUszdRs' // Charlotte - multilingual voice

export async function speak(text) {
    try {
        const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'xi-api-key': API_KEY,
            },
            body: JSON.stringify({
                text: text,
                model_id: 'eleven_v3',
                language_code: 'pl',
                speed: 0.2,
                voice_settings: {
                    stability: 0.5,
                    similarity_boost: 0.75,
                }
            })
        })

        if (!response.ok) {
            throw new Error(`ElevenLabs API error: ${response.status}`)
        }

        const audioBlob = await response.blob()
        const audioUrl = URL.createObjectURL(audioBlob)
        const audio = new Audio(audioUrl)
        audio.volume = 1.0 // 0.0 (mute) to 1.0 (max)

        audio.onended = () => {
            URL.revokeObjectURL(audioUrl)
        }

        await audio.play()
    } catch (error) {
        console.error('ElevenLabs TTS error:', error)
    }
}
