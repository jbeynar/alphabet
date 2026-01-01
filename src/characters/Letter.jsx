import { useEffect, useRef } from 'react'
import Speech from 'speak-tts'
import './Letter.css'
import words from '../data/words.json'

const images = import.meta.glob('../data/images/**/*.png', { eager: true })

function getImageUrl(letter, word) {
    const path = `../data/images/${letter.toUpperCase()}/${word}.png`
    return images[path]?.default
}

function Letter({ letter, background, showBoard = false, visibleImages = 0, lang = 'pl-PL' }) {
    const speechRef = useRef(null)
    const hasSpoken = useRef(null)
    const letterWords = words[letter.toLowerCase()] || []

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
                    {letterWords.map((item, index) => {
                        const imageUrl = getImageUrl(letter, item.word)
                        const isVisible = index < visibleImages
                        return (
                            <div key={item.word} className="picture-card">
                                {isVisible && imageUrl ? (
                                    <>
                                        <img src={imageUrl} alt={item.word} className="picture-image" />
                                        <span className="picture-label">{item.word}</span>
                                    </>
                                ) : (
                                    <div className="picture-placeholder"></div>
                                )}
                            </div>
                        )
                    })}
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
