import { useEffect, useState } from "react";
import HeroArt from "../components/HeroArt.jsx";
import { WORKOUTS } from "../data/workouts.js";

const SHUFFLE_MS = 2400;

// A short animated transition. Cycles through workout names, then moves on by itself.
export default function Shuffling({ onDone }) {
  const [i, setI] = useState(0);

  useEffect(() => {
    const flip = setInterval(() => setI((n) => (n + 1) % WORKOUTS.length), 140);
    const finish = setTimeout(onDone, SHUFFLE_MS);
    return () => { clearInterval(flip); clearTimeout(finish); };
  }, [onDone]);

  return (
    <main className="shuffling grid-bg" role="status" aria-live="polite">
      <div>
        <div className="disc"><HeroArt /></div>
        <h1 className="display h2" style={{ marginBottom: 18 }}>Shuffling…</h1>
        <div className="flip" aria-hidden="true">{WORKOUTS[i].title}</div>
        <p className="lead" style={{ margin: "20px auto 0" }}>Finding your workout</p>
      </div>
    </main>
  );
}
