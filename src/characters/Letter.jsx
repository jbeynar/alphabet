import {useEffect, useRef} from 'react'
import Speech from 'speak-tts'

const baseStyles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'baseline',
        gap: '2rem',
        minHeight: '100vh',
        margin: 0,
        paddingTop: '15vh',
    },
    uppercase: {
        fontSize: '20rem',
        fontWeight: 'bold',
        fontFamily: 'system-ui, sans-serif',
        color: '#fff',
    },
    lowercase: {
        fontSize: '16rem',
        fontWeight: 'bold',
        fontFamily: 'system-ui, sans-serif',
        color: '#fff',
    },
}

function Letter({letter, background, lang = 'pl-PL'}) {
    const speechRef = useRef(null)
    const hasSpoken = useRef(null)

    useEffect(() => {
        if (hasSpoken.current === letter) return
        hasSpoken.current = letter

        const speech = new Speech()
        speechRef.current = speech

        speech.init({
            lang: lang,
            rate: 0.6,
            pitch: 0.7,
            volume: 1,
        }).then(() => {
            speech.speak({text: "\u200B" + letter[0]})
        }).catch(e => {
            console.error('Speech init error:', e)
        })

        return () => {
            speech.cancel()
        }
    }, [letter, lang])

    return (
        <div style={{...baseStyles.container, background}}>
            <span style={baseStyles.uppercase}>{letter.toUpperCase()}</span>
            <span style={baseStyles.lowercase}>{letter.toLowerCase()}</span>
        </div>
    )
}

export default Letter
