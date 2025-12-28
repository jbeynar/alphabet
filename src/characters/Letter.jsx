const baseStyles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'baseline',
    gap: '2rem',
    minHeight: '100vh',
    margin: 0,
    paddingTop: '15vh',
  },
  uppercase: {
    fontSize: '20rem',
    fontWeight: 'bold',
    fontFamily: 'system-ui, sans-serif',
    color: '#fff',
  },
  lowercase: {
    fontSize: '16rem',
    fontWeight: 'bold',
    fontFamily: 'system-ui, sans-serif',
    color: '#fff',
  },
}

function Letter({ letter, background }) {
  return (
    <div style={{ ...baseStyles.container, background }}>
      <span style={baseStyles.uppercase}>{letter.toUpperCase()}</span>
      <span style={baseStyles.lowercase}>{letter.toLowerCase()}</span>
    </div>
  )
}

export default Letter
