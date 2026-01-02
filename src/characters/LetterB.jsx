import Letter from './Letter'

function LetterB({ showBoard, visibleImages, letterColor }) {
  return <Letter letter="B" background="linear-gradient(135deg, #81ecec 0%, #00897b 100%)" showBoard={showBoard} visibleImages={visibleImages} letterColor={letterColor} />
}

export default LetterB
