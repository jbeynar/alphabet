import Letter from './Letter'

function LetterF({ showBoard, visibleImages, letterColor }) {
  return <Letter letter="F" background="linear-gradient(135deg, #74b9ff 0%, #0652DD 100%)" showBoard={showBoard} visibleImages={visibleImages} letterColor={letterColor} />
}

export default LetterF
