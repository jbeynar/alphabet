// Minimal line speaker icon; inherits the text color and scales with font-size.
function SpeakerIcon({ muted = false, size = '1.2em' }) {
    return (
        <svg
            className="speaker-icon"
            viewBox="0 0 24 24"
            width={size}
            height={size}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M11 5 6 9H3v6h3l5 4z" />
            {muted ? (
                <path d="m16 9 5 6m0-6-5 6" />
            ) : (
                <path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a8 8 0 0 1 0 11" />
            )}
        </svg>
    )
}

export default SpeakerIcon
