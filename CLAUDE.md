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
  components/                  - Shared across games (each component imports its own .css)
    WelcomeScreen.jsx          - Game picker (GAMES list: alphabet, multiplication, spelling, english)
    BackButton.jsx             - Corner button returning to the game picker (same as Escape)
    MuteButton.jsx             - Corner button toggling speech/sounds (state owned by the game)
    FaceFeedback.jsx           - Big happy/sad face shown after an answer
    HistoryBar.jsx             - Faces + score for the current round; with 2 players, player 1 left, player 2 right
    RoundSummary.jsx           - End-of-round card: per-player score, winner/draw, Kontynuuj button
    PrimaryButton.css          - Green pill `.primary-button` (Start, Kontynuuj)
  data/                        - Word data shared by the alphabet and english games
    words.json                 - Polish alphabet with 4 words per letter ({ pl, en })
    images/<letter>/<pl>.png   - Word illustrations (26 of 32 letters have them)
    words.js                   - letters (words.json), getImageUrl(letter, word) via import.meta.glob,
                                 pictureWords: flat deduped list of { pl, en, letter, image } with an image
  utils/
    browserSpeech.js           - Web Speech API wrapper (speakWord), used by all games
    sounds.js                  - playGentleWrong(): soft Web Audio tone for a wrong answer
  games/
    alphabet/
      AlphabetGame.jsx         - Alphabet game: key handling, letter/press-count state (Escape exits)
      components/
        AlphabetWelcomeScreen  - Intro screen of the alphabet game (title + decorative keyboard)
        Keyboard.jsx           - Decorative SVG keyboard
        FuseLoader.jsx         - 1s progress bar shown when a letter changes
        Letter.jsx             - Letter view: big letter, word images board (from src/data), speech
    multiplication/
      MultiplicationGame.jsx   - Multiplication game: settings -> play -> summary phases, keys a..h answer,
                                 Enter continues after a round (10 turns per player), Escape exits;
                                 mute (localStorage) skips speech/sounds and shortens the next-question delay;
                                 Start saves settings to localStorage and they become the defaults next time
      components/
        SettingsScreen.jsx     - ChoiceField players (1/2), NumberFields (max first factor, max second factor,
                                 answer count 2–8), ChoiceField difficulty (easy/hard) + Start
        NumberField.jsx        - Big numeric box: -/+ buttons, typed digits, arrow keys, min/max clamp
        ChoiceField.jsx        - Pill-option picker in the same card style (↑/↓ or click to change)
        Question.jsx           - "a × b =" with numbered answer cards (green correct / red wrong)
      utils/questions.js       - generateQuestion(settings, previous): factors, distractors, shuffle;
                                 factorRange(): hard difficulty uses only factors >= ceil(40% of max)
    spelling/
      SpellingGame.jsx         - Spelling game (ortografia): single player, starts immediately, 10 turns per
                                 round then RoundSummary (Enter continues). Each turn shows a random word with
                                 every hard spot (ó/u, ż/rz, h/ch) replaced by a dropdown gap (the first one opens
                                 automatically); choosing a letter moves to the next empty gap and the last
                                 choice submits automatically (no check button), wrong gaps turn red and the
                                 correct word is shown; the word is spoken at turn start and after a correct answer; mute
                                 (localStorage spelling.muted) skips speech/sounds and shortens the delay;
                                 Escape closes an open gap menu, otherwise exits
      SpellingGame.css         - Green gradient background, big word layout, repeat button
      components/
        SpellingWord.jsx       - Renders the word's text segments and a GapDropdown per gap (stateless)
        GapDropdown.jsx        - Custom inline dropdown (no <select>): "?" placeholder, 2 pill options,
                                 outside click closes, gap-correct / gap-wrong states
      utils/gaps.js            - PAIRS table, splitWord (digraphs ch/rz matched first), countGaps,
                                 checkGaps (per gap), pickWord (random, not the previous word)
      data/words.json          - ~1000 lowercase Polish words with ó/u, ż/rz, h/ch spots
    english/
      EnglishGame.jsx          - English game: shows a random picture from src/data (pictureWords, never the
                                 previous one), the English word and its Polish translation, speaks the English
                                 word (en-GB) on each change; Space/Enter/→/click shows the next picture,
                                 Repeat re-speaks; mute (localStorage english.muted) skips speech; Escape exits
      EnglishGame.css          - Purple gradient background, white picture card, Repeat/Next buttons
index.html                     - Entry HTML (global reset + .app-background)
```

Adding a game: create `src/games/<name>/<Name>Game.jsx` (plus any
game-specific components/data next to it), add an entry to `GAMES` in
`src/components/WelcomeScreen.jsx` and a branch in `src/App.jsx`.

## Stack

- React 19
- Vite 6 with @vitejs/plugin-react
