import { useCallback, useEffect, useState } from "react";
import { DEFAULT_PREFS } from "./data/options.js";
import { pickWorkout } from "./logic.js";
import Home from "./screens/Home.jsx";
import Preferences from "./screens/Preferences.jsx";
import Shuffling from "./screens/Shuffling.jsx";
import Reveal from "./screens/Reveal.jsx";
import Active from "./screens/Active.jsx";
import Complete from "./screens/Complete.jsx";
import { playSound, stopSounds } from "./sound.js";

// The app is a simple state machine: "screen" says which of the six screens to show.
export default function App() {
  const [screen, setScreen] = useState("home"); // home | preferences | shuffling | reveal | active | complete
  const [prefs, setPrefs] = useState(DEFAULT_PREFS);
  const [result, setResult] = useState(null);   // { workout, session, minutes }
  const [completed, setCompleted] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(() => {
    try { return window.localStorage.getItem("shuffle-sound") !== "off"; } catch { return true; }
  });
  const toggleSound = () => {
    const next = !soundEnabled;
    if (!next) stopSounds();
    try { window.localStorage.setItem("shuffle-sound", next ? "on" : "off"); } catch { /* optional preference */ }
    setSoundEnabled(next);
  };

  // Always start a new screen at the top of the page.
  useEffect(() => { window.scrollTo(0, 0); }, [screen]);

  // Pick a workout, then show the Shuffling animation.
  const shuffleWith = (p) => {
    playSound("shuffle", soundEnabled);
    setPrefs(p);
    setResult(pickWorkout(p, result?.workout.id));
    setScreen("shuffling");
  };
  const surprise = () => shuffleWith({ ...DEFAULT_PREFS, music: prefs.music });
  const doneShuffling = useCallback(() => setScreen("reveal"), []);
  const finish = (count) => { playSound("complete", soundEnabled); setCompleted(count); setScreen("complete"); };

  switch (screen) {
    case "preferences":
      return <Preferences initial={prefs} onShuffle={shuffleWith} onSurprise={surprise} onHome={() => setScreen("home")} soundEnabled={soundEnabled} onToggleSound={toggleSound} />;
    case "shuffling":
      return <Shuffling onDone={doneShuffling} />;
    case "reveal":
      return <Reveal result={result} music={prefs.music} soundEnabled={soundEnabled} onToggleSound={toggleSound} onStart={() => { playSound("start", soundEnabled); setScreen("active"); }}
        onReshuffle={() => shuffleWith(prefs)} onPreferences={() => setScreen("preferences")} onHome={() => setScreen("home")} />;
    case "active":
      return <Active key={result.workout.id + result.session.steps.length} result={result} onFinish={finish} onExit={() => setScreen("home")} soundEnabled={soundEnabled} onToggleSound={toggleSound} />;
    case "complete":
      return <Complete result={result} completed={completed} soundEnabled={soundEnabled} onToggleSound={toggleSound} onShuffleAgain={() => shuffleWith(prefs)}
        onPreferences={() => setScreen("preferences")} onHome={() => setScreen("home")} />;
    default:
      return <Home soundEnabled={soundEnabled} onToggleSound={toggleSound} onSurprise={surprise} onPreferences={() => setScreen("preferences")} />;
  }
}
