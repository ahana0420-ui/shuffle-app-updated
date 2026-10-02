import { useCallback, useEffect, useState } from "react";
import { DEFAULT_PREFS } from "./data/options.js";
import { pickWorkout } from "./logic.js";
import Home from "./screens/Home.jsx";
import Preferences from "./screens/Preferences.jsx";
import Shuffling from "./screens/Shuffling.jsx";
import Reveal from "./screens/Reveal.jsx";
import Active from "./screens/Active.jsx";
import Complete from "./screens/Complete.jsx";

// The app is a simple state machine: "screen" says which of the six screens to show.
export default function App() {
  const [screen, setScreen] = useState("home"); // home | preferences | shuffling | reveal | active | complete
  const [prefs, setPrefs] = useState(DEFAULT_PREFS);
  const [result, setResult] = useState(null);   // { workout, session, minutes }
  const [completed, setCompleted] = useState(0);

  // Always start a new screen at the top of the page.
  useEffect(() => { window.scrollTo(0, 0); }, [screen]);

  // Pick a workout, then show the Shuffling animation.
  const shuffleWith = (p) => {
    setPrefs(p);
    setResult(pickWorkout(p, result?.workout.id));
    setScreen("shuffling");
  };
  const surprise = () => shuffleWith({ ...DEFAULT_PREFS, music: prefs.music });
  const doneShuffling = useCallback(() => setScreen("reveal"), []);
  const finish = (count) => { setCompleted(count); setScreen("complete"); };

  switch (screen) {
    case "preferences":
      return <Preferences initial={prefs} onShuffle={shuffleWith} onSurprise={surprise} onHome={() => setScreen("home")} />;
    case "shuffling":
      return <Shuffling onDone={doneShuffling} />;
    case "reveal":
      return <Reveal result={result} music={prefs.music} onStart={() => setScreen("active")}
        onReshuffle={() => shuffleWith(prefs)} onPreferences={() => setScreen("preferences")} onHome={() => setScreen("home")} />;
    case "active":
      return <Active key={result.workout.id + result.session.steps.length} result={result} onFinish={finish} onExit={() => setScreen("home")} />;
    case "complete":
      return <Complete result={result} completed={completed} onShuffleAgain={() => shuffleWith(prefs)}
        onPreferences={() => setScreen("preferences")} onHome={() => setScreen("home")} />;
    default:
      return <Home onSurprise={surprise} onPreferences={() => setScreen("preferences")} />;
  }
}
