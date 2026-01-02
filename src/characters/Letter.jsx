import { useEffect, useRef, useState, useMemo } from 'react'
import Speech from 'speak-tts'
import './Letter.css'
import words from '../data/words.json'

const images = import.meta.glob('../data/images/**/*.png', { eager: true })

function getImageUrl(letter, word) {
    const path = `../data/images/${letter.toUpperCase()}/${word}.png`
    return images[path]?.default
}

function shuffleArray(array) {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
}

function Letter({ letter, showBoard = false, visibleImages = 0, letterColor = '#fff', lang = 'pl-PL' }) {
    const speechRef = useRef(null)
    const hasSpoken = useRef(null)
    const letterWords = useMemo(() => shuffleArray(words[letter.toLowerCase()] || []), [letter])
    const [animating, setAnimating] = useState(false)
    const [revealingCard, setRevealingCard] = useState(-1)
    const [isMounted, setIsMounted] = useState(false)
    const prevColorRef = useRef(letterColor)
    const prevVisibleRef = useRef(visibleImages)

    useEffect(() => {
        const timer = setTimeout(() => setIsMounted(true), 500)
        return () => clearTimeout(timer)
    }, [])

    useEffect(() => {
        if (prevColorRef.current !== letterColor && letterColor !== '#fff') {
            setAnimating(true)
            const timer = setTimeout(() => setAnimating(false), 400)
            prevColorRef.current = letterColor
            return () => clearTimeout(timer)
        }
        prevColorRef.current = letterColor
    }, [letterColor])

    useEffect(() => {
        if (visibleImages > prevVisibleRef.current) {
            setRevealingCard(visibleImages - 1)
            const timer = setTimeout(() => setRevealingCard(-1), 400)
            prevVisibleRef.current = visibleImages
            return () => clearTimeout(timer)
        }
        prevVisibleRef.current = visibleImages
    }, [visibleImages])

    const textStyle = { color: letterColor }
    const appearClass = !isMounted ? 'letter-appear' : ''
    const animClass = animating ? 'color-change' : ''

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
            <div className="letter-with-board">
                <div className="letter-side">
                    <span className={`letter-side-upper ${appearClass} ${animClass}`} style={textStyle}>{letter.toUpperCase()}</span>
                    <span className={`letter-side-lower ${appearClass} ${animClass}`} style={textStyle}>{letter.toLowerCase()}</span>
                </div>
                <div className="picture-board">
                    {letterWords.map((item, index) => {
                        const imageUrl = getImageUrl(letter, item.word)
                        const isVisible = index < visibleImages
                        const isRevealing = index === revealingCard
                        return (
                            <div key={item.word} className={`picture-card ${isRevealing ? 'card-reveal' : ''}`}>
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
        <div className="letter-container">
            <span className={`letter-uppercase ${appearClass} ${animClass}`} style={textStyle}>{letter.toUpperCase()}</span>
            <span className={`letter-lowercase ${appearClass} ${animClass}`} style={textStyle}>{letter.toLowerCase()}</span>
        </div>
    )
}

export default Letter
