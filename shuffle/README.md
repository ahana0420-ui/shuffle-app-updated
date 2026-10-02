# SHUFFLE

A workout discovery app. Pick a mood, focus, level, time and equipment (or just press SHUFFLE) and get a workout from a small built-in library, then follow it with a timer.

## Run it (VS Code)

1. Install Node.js (the LTS version) from https://nodejs.org if you don't have it.
2. Unzip this folder and open it in VS Code (File > Open Folder).
3. Open the terminal (Terminal > New Terminal) and run:

       npm install
       npm run dev

4. Open the address it prints (usually http://localhost:5173) in your browser.
5. Stop it any time with Ctrl+C in the terminal.

## Where things are

- `src/data/workouts.js`  the workout library, 54 workouts (edit or add workouts here)
- `src/data/exercises.js` shared exercise catalog that new workouts pull from
- `src/data/options.js`   the preference choices
- `src/logic.js`          how a workout is picked, varied and timed
- `scripts/test-shuffle.mjs` run `npm run test:shuffle` to check the library and shuffling
- `src/screens/`          the six screens (Home, Preferences, Shuffling, Reveal, Active, Complete)
- `src/styles.css`        all styling (colors and fonts from the Stitch designs)

No backend, no accounts, no API keys, no tracking. Fonts are bundled locally.
