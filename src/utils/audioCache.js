const cache = new Map()

export function getCachedAudio(key) {
    return cache.get(key) || null
}

export function setCachedAudio(key, audioBlob) {
    cache.set(key, audioBlob)
}

export function hasAudio(key) {
    return cache.has(key)
}

export function clearCache() {
    cache.clear()
}
