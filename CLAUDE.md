# Alphabet Kids POC

React 19 single-page application using Vite 6.

## Commands

- `npm run dev` - Start development server (http://localhost:5173)
- `npm run build` - Production build to `dist/`
- `npm run preview` - Preview production build

## Structure

```
src/
  main.jsx                 - React root mount
  App.jsx                  - Game router: WelcomeScreen (game picker) -> selected game
  components/
    WelcomeScreen.jsx      - Game picker (GAMES list: alphabet, multiplication)
    AlphabetWelcomeScreen  - Intro screen of the alphabet game (title + decorative keyboard)
    Keyboard.jsx           - Decorative SVG keyboard
    FuseLoader.jsx         - 1s progress bar shown when a letter changes
  games/
    AlphabetGame.jsx       - Alphabet game: key handling, letter/press-count state (Escape exits)
    MultiplicationGame.jsx - Multiplication game (placeholder for now, Escape exits)
  characters/Letter.jsx    - Letter view: big letter, word images board, speech
  data/words.json          - Polish alphabet with 4 words per letter
  data/images/<letter>/    - Word illustrations (loaded via import.meta.glob)
  utils/browserSpeech.js   - Web Speech API wrapper (speakWord)
index.html                 - Entry HTML (global reset + .app-background)
```

Adding a game: create `src/games/<Name>Game.jsx`, add an entry to `GAMES` in
`src/components/WelcomeScreen.jsx` and a branch in `src/App.jsx`.

## Stack

- React 19
- Vite 6 with @vitejs/plugin-react
