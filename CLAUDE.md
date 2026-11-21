# Alphabet Kids POC

React 19 single-page application using Vite 6.

## Commands

- `npm run dev` - Start development server (http://localhost:5173)
- `npm run build` - Production build to `dist/`
- `npm run preview` - Preview production build

## Structure

Each game lives in its own directory under `src/games/` and owns everything
specific to it (components, data, assets, helpers). `src/components/` holds
only what is shared across games.

```
src/
  main.jsx                     - React root mount
  App.jsx                      - Game router: WelcomeScreen (game picker) -> selected game
  components/                  - Shared across games
    WelcomeScreen.jsx          - Game picker (GAMES list: alphabet, multiplication)
    BackButton.jsx             - Corner button returning to the game picker (same as Escape)
  utils/browserSpeech.js       - Web Speech API wrapper (speakWord), used by both games
  games/
    alphabet/
      AlphabetGame.jsx         - Alphabet game: key handling, letter/press-count state (Escape exits)
      components/
        AlphabetWelcomeScreen  - Intro screen of the alphabet game (title + decorative keyboard)
        Keyboard.jsx           - Decorative SVG keyboard
        FuseLoader.jsx         - 1s progress bar shown when a letter changes
        Letter.jsx             - Letter view: big letter, word images board, speech
      data/words.json          - Polish alphabet with 4 words per letter
      data/images/<letter>/    - Word illustrations (loaded via import.meta.glob)
    multiplication/
      MultiplicationGame.jsx   - Multiplication game: settings -> play -> summary phases, keys a..h answer,
                                 Enter continues after a round (10 turns per player), Escape exits;
                                 mute (localStorage) skips speech/sounds and shortens the next-question delay
      components/
        SettingsScreen.jsx     - Four NumberFields (players 1–2, max first factor, max second factor, answer count 2–8) + Start
        NumberField.jsx        - Big numeric box: -/+ buttons, typed digits, arrow keys, min/max clamp
        Question.jsx           - "a × b =" with numbered answer cards (green correct / red wrong)
        FaceFeedback.jsx       - Big happy/sad face shown after an answer
        HistoryBar.jsx         - Faces + score for the current round; with 2 players, player 1 left, player 2 right
        RoundSummary.jsx       - End-of-round card: per-player score, winner/draw, Kontynuuj button
      utils/questions.js       - generateQuestion(settings, previous): factors, distractors, shuffle
      utils/sounds.js          - playGentleWrong(): soft Web Audio tone for a wrong answer
index.html                     - Entry HTML (global reset + .app-background)
```

Adding a game: create `src/games/<name>/<Name>Game.jsx` (plus any
game-specific components/data next to it), add an entry to `GAMES` in
`src/components/WelcomeScreen.jsx` and a branch in `src/App.jsx`.

## Stack

- React 19
- Vite 6 with @vitejs/plugin-react
