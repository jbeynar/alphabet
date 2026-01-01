import { useEffect, useRef } from 'react'
import Speech from 'speak-tts'
import './Letter.css'

function Letter({ letter, background, showBoard = false, lang = 'pl-PL' }) {
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
            speech.speak({ text: "\u200B" + letter[0] })
        }).catch(e => {
            console.error('Speech init error:', e)
        })

        return () => {
            speech.cancel()
        }
    }, [letter, lang])

    if (showBoard) {
        return (
            <div className="letter-with-board" style={{ background }}>
                <div className="letter-side">
                    <span className="letter-side-upper">{letter.toUpperCase()}</span>
                    <span className="letter-side-lower">{letter.toLowerCase()}</span>
                </div>
                <div className="picture-board">
                    <div className="picture-placeholder"></div>
                    <div className="picture-placeholder"></div>
                    <div className="picture-placeholder"></div>
                    <div className="picture-placeholder"></div>
                </div>
            </div>
        )
    }

    return (
        <div className="letter-container" style={{ background }}>
            <span className="letter-uppercase">{letter.toUpperCase()}</span>
            <span className="letter-lowercase">{letter.toLowerCase()}</span>
        </div>
    )
}

export default Letter
