import { useEffect, useRef, useState, useMemo } from 'react'
import Speech from 'speak-tts'
import './Letter.css'
import words from '../data/words.json'
import { speak } from '../utils/elevenlabs'

const images = import.meta.glob('../data/images/**/*.png', { eager: true })

function getImageUrl(letter, word) {
    const path = `../data/images/${letter.toLowerCase()}/${word}.png`
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

function highlightLetter(word, letter) {
    const lowerLetter = letter.toLowerCase()
    return word.split('').map((char, index) => {
        const displayChar = index === 0 ? char.toUpperCase() : char
        if (char.toLowerCase() === lowerLetter) {
            return <span key={index} className="letter-highlight">{displayChar}</span>
        }
        return displayChar
    })
}

function Letter({ letter, showBoard = false, visibleImages = 0, letterColor = '#fff', lang = 'pl-PL' }) {
    const speechRef = useRef(null)
    const hasSpoken = useRef(null)
    const letterWords = useMemo(() => {
        const letterData = words.find(w => w.letter === letter.toLowerCase())
        return shuffleArray(letterData?.words || [])
    }, [letter])
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
            const revealedIndex = visibleImages - 1
            setRevealingCard(revealedIndex)
            const timer = setTimeout(() => setRevealingCard(-1), 400)

            // Speak the revealed word using ElevenLabs
            if (letterWords[revealedIndex]) {
                speak(letterWords[revealedIndex].pl)
            }

            prevVisibleRef.current = visibleImages
            return () => clearTimeout(timer)
        }
        prevVisibleRef.current = visibleImages
    }, [visibleImages, letterWords])

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
                        const imageUrl = getImageUrl(letter, item.pl)
                        const isVisible = index < visibleImages
                        const isRevealing = index === revealingCard
                        return (
                            <div key={item.pl} className={`picture-card ${isRevealing ? 'card-reveal' : ''}`}>
                                {isVisible && imageUrl ? (
                                    <>
                                        <img src={imageUrl} alt={item.pl} className="picture-image" />
                                        <span className="picture-label">{highlightLetter(item.pl, letter)}</span>
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
