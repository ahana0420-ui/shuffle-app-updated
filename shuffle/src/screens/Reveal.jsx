import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import SafetyNote from "../components/SafetyNote.jsx";
import Icon from "../components/Icon.jsx";
import SoundToggle from "../components/SoundToggle.jsx";
import { FOCUSES, labelFor } from "../data/options.js";
import { equipmentText } from "../logic.js";

export default function Reveal({ result, music, onStart, onReshuffle, onPreferences, onHome, soundEnabled, onToggleSound }) {
  const { workout, session, minutes } = result;

  return (
    <div className="app">
      <Header onHome={onHome}>
        <SoundToggle enabled={soundEnabled} onToggle={onToggleSound} />
        <button className="btn btn-sm hide-sm" onClick={onPreferences}>Edit preferences</button>
        <button className="btn btn-sm btn-yellow" onClick={onHome}>Home</button>
      </Header>

      <main className="page">
        <section className="reveal-top">
          <div className="container pop-in">
            <span className="tag tag-yellow">Your workout</span>
            <h1 className="display h1" style={{ margin: "14px 0 0" }}>{workout.title}</h1>
            <div className="meta">
              <div className="card"><small>Duration</small><b>{minutes} min</b></div>
              <div className="card"><small>Focus</small><b>{labelFor(FOCUSES, workout.focus)}</b></div>
              <div className="card"><small>Equipment</small><b>{equipmentText(workout)}</b></div>
              <div className="card"><small>Format</small><b>{session.label ? `${session.label} · ` : ""}{session.rounds} {session.rounds === 1 ? "round" : "rounds"}</b></div>
            </div>
          </div>
        </section>

        <div className="container section stack" style={{ gap: 24 }}>
          <div>
            <h2 className="display h2">The lineup</h2>
            <p className="hint" style={{ marginTop: 6 }}>
              {session.steps.length} exercises · {session.summary}
            </p>
          </div>

          <ol className="ex-list">
            {workout.moves.map((m, i) => (
              <li className="ex" key={m.name}>
                <span className="num">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <b>{m.name}</b> <span className="pill">{m.area}</span>
                  <p>{m.cue}</p>
                </div>
              </li>
            ))}
          </ol>

          {music && (
            <div className="card card-yellow" style={{ padding: 16 }}>
              <b>Soundtrack idea:</b> {music}
            </div>
          )}

          <SafetyNote />

          <div className="row">
            <button className="btn btn-blue btn-big" onClick={onStart}><Icon name="play" size={22} /> Start workout</button>
            <button className="btn btn-pink" onClick={onReshuffle}><Icon name="shuffle" size={20} /> Shuffle again</button>
            <button className="btn" onClick={onPreferences}><Icon name="tune" size={20} /> Change preferences</button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
