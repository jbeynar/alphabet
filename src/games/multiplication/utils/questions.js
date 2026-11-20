function randomInt(min, max) {
    return min + Math.floor(Math.random() * (max - min + 1))
}

function shuffleArray(array) {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
}

function pickFactors({ maxA, maxB }, previous) {
    let a = randomInt(1, maxA)
    let b = randomInt(1, maxB)
    if (previous && maxA * maxB > 1) {
        let guard = 0
        while (a === previous.a && b === previous.b && guard < 20) {
            a = randomInt(1, maxA)
            b = randomInt(1, maxB)
            guard++
        }
    }
    return { a, b }
}

function buildDistractors(a, b, correct, count, { maxA, maxB }) {
    const picked = new Set()
    const tryAdd = value => {
        if (picked.size >= count) return
        if (!Number.isInteger(value) || value <= 0 || value === correct || picked.has(value)) return
        picked.add(value)
    }

    const neighbours = shuffleArray([
        a * (b + 1), a * (b - 1), (a + 1) * b, (a - 1) * b,
        a * (b + 2), a * (b - 2), (a + 2) * b, (a - 2) * b,
    ])
    neighbours.forEach(tryAdd)

    shuffleArray([correct + 1, correct - 1, correct + 2, correct - 2, correct + 10, correct - 10]).forEach(tryAdd)

    let guard = 0
    while (picked.size < count && guard < 200) {
        tryAdd(randomInt(1, maxA) * randomInt(1, maxB))
        guard++
    }
    guard = 0
    while (picked.size < count && guard < 200) {
        tryAdd(randomInt(1, maxA * maxB + 10))
        guard++
    }
    return [...picked]
}

export function generateQuestion(settings, previous = null) {
    const { a, b } = pickFactors(settings, previous)
    const correct = a * b
    const distractors = buildDistractors(a, b, correct, settings.answerCount - 1, settings)
    const answers = shuffleArray([correct, ...distractors])
    return { a, b, correct, answers, correctIndex: answers.indexOf(correct) }
}
