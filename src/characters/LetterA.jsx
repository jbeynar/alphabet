import Letter from './Letter'

function LetterA({ showBoard, visibleImages, letterColor }) {
  return <Letter letter="A" background="linear-gradient(135deg, #ff8a8a 0%, #c0392b 100%)" showBoard={showBoard} visibleImages={visibleImages} letterColor={letterColor} />
}

export default LetterA
