import letters from './words.json'

const images = import.meta.glob('./images/**/*.png', { eager: true })

export { letters }

export function getImageUrl(letter, word) {
    return images[`./images/${letter.toLowerCase()}/${word}.png`]?.default
}

export const pictureWords = (() => {
    const seen = new Set()
    const result = []
    for (const { letter, words } of letters) {
        for (const word of words) {
            const image = getImageUrl(letter, word.pl)
            if (!image || seen.has(word.pl)) continue
            seen.add(word.pl)
            result.push({ ...word, letter, image })
        }
    }
    return result
})()
