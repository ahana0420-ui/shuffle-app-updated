import { useEffect, useReducer, useState } from "react";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import SafetyNote from "../components/SafetyNote.jsx";
import SquatFigure from "../components/SquatFigure.jsx";
import Icon from "../components/Icon.jsx";
import { formatClock } from "../logic.js";

// status: ready (not started) | running | paused
// phase:  work | rest
function makeReducer(steps) {
  const last = steps.length - 1;
  const go = (state, i) => ({ ...state, i, phase: "work", left: steps[i].seconds });

  return function reducer(state, action) {
    switch (action.type) {
      case "START": return { ...state, status: "running" };
      case "TOGGLE": return state.status === "running" ? { ...state, status: "paused" } : { ...state, status: "running" };
      case "NEXT": return state.i < last ? go(state, state.i + 1) : state;
      case "PREV": return go(state, Math.max(0, state.i - 1));
      case "TICK": {
        if (state.status !== "running") return state;
        if (state.left > 1) return { ...state, left: state.left - 1 };
        const step = steps[state.i];
        if (state.phase === "work" && step.rest > 0 && state.i < last) return { ...state, phase: "rest", left: step.rest };
        if (state.i < last) return go(state, state.i + 1);
        return { ...state, left: 0, status: "paused", done: true };
      }
      default: return state;
    }
  };
}

export default function Active({ result, onFinish, onExit }) {
  const { workout, session, minutes } = result;
  const steps = session.steps;
  const [state, dispatch] = useReducer(makeReducer(steps), { i: 0, phase: "work", left: steps[0].seconds, status: "ready", done: false });
  const [confirmExit, setConfirmExit] = useState(false);

  // One tick per second while running.
  useEffect(() => {
    if (state.status !== "running") return;
    const id = setInterval(() => dispatch({ type: "TICK" }), 1000);
    return () => clearInterval(id);
  }, [state.status]);

  // Finished the last exercise on its own.
  useEffect(() => {
    if (state.done) onFinish(steps.length);
  }, [state.done]); // eslint-disable-line react-hooks/exhaustive-deps

  const step = steps[state.i];
  const resting = state.phase === "rest";
  const total = resting ? step.rest : step.seconds;
  const progress = total ? (total - state.left) / total : 0;
  const C = 2 * Math.PI * 90;
  const next = steps[state.i + 1];
  const roundStart = Math.floor(state.i / workout.moves.length) * workout.moves.length;
  const roundSteps = steps.slice(roundStart, roundStart + workout.moves.length);
  const completedNow = state.i + (resting ? 1 : 0);

  return (
    <div className="app">
      <Header onHome={() => setConfirmExit(true)}>
        <span className="tag tag-pink hide-sm">Live session</span>
        <button className="btn btn-sm btn-pink" onClick={() => setConfirmExit(true)}>
          Exit <Icon name="close" size={14} />
        </button>
      </Header>

      <main className="page">
        <div className="container">
          <div className="active-bar">
            <span className="tag tag-pink">Exercise {state.i + 1} of {steps.length}</span>
            <span className="tag">Round {step.round} of {session.rounds} · {minutes} min workout</span>
            <span className="tag tag-blue">{step.seconds}s work{step.rest ? ` / ${step.rest}s rest` : ""}</span>
          </div>
          <div className="chips" aria-label="This round">
            {roundSteps.map((s, k) => {
              const idx = roundStart + k;
              return (
                <div key={idx} className={`chip ${idx === state.i ? "on" : idx < state.i ? "done" : ""}`}>
                  <span>{String(k + 1).padStart(2, "0")} {s.name}</span>
                </div>
              );
            })}
          </div>

          <div className="active-grid">
            <section className="card" aria-label="Current exercise">
              <div className="row" style={{ justifyContent: "space-between" }}>
                <h1 className="display h2">{step.name}</h1>
                <span className="tag tag-pink">{step.area}</span>
              </div>
              <div className="stage">
                {step.fig === "squat" ? (
                  <SquatFigure paused={state.status !== "running"} />
                ) : (
                  <div className="poster">
                    <div className="big">{String(state.i % workout.moves.length + 1).padStart(2, "0")}</div>
                    <span className="tag tag-yellow">{resting ? "Rest" : "Move!"}</span>
                  </div>
                )}
              </div>
              <p className="cue">Form tip: {step.cue}</p>
            </section>

            <section className="card timer-card" aria-label="Timer">
              <span className="tag tag-yellow">
                {state.status === "ready" ? "Ready when you are" : resting ? "Rest" : state.status === "paused" ? "Paused" : "Go"}
              </span>
              <div className="ring">
                <svg viewBox="0 0 200 200" aria-hidden="true">
                  <circle cx="100" cy="100" r="90" fill="none" stroke="#e5e2e1" strokeWidth="16" />
                  <circle cx="100" cy="100" r="90" fill="none" stroke={resting ? "#1E2FFF" : "#FF007A"} strokeWidth="16"
                    strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - progress)} />
                </svg>
                <div className="time" role="timer">
                  {formatClock(state.left)}
                  <small>{resting ? "Rest" : "Seconds left"}</small>
                </div>
              </div>
              {resting && next && <p style={{ fontWeight: 700 }}>Up next: {next.name}</p>}
              <div style={{ marginTop: 16 }}><SafetyNote /></div>
            </section>
          </div>

          <div className="controls">
            <button className="btn" onClick={() => dispatch({ type: "PREV" })} disabled={state.i === 0 && state.left === step.seconds}>
              <Icon name="prev" size={18} /> Previous
            </button>
            {state.status === "ready" ? (
              <button className="btn btn-blue btn-big main" onClick={() => dispatch({ type: "START" })}>
                <Icon name="play" size={22} /> Start
              </button>
            ) : (
              <button className="btn btn-blue btn-big main" onClick={() => dispatch({ type: "TOGGLE" })}>
                <Icon name={state.status === "running" ? "pause" : "play"} size={22} />
                {state.status === "running" ? "Pause" : "Resume"}
              </button>
            )}
            <button className="btn btn-yellow" onClick={() => dispatch({ type: "NEXT" })} disabled={state.i === steps.length - 1}>
              Next <Icon name="next" size={18} />
            </button>
            <button className="btn btn-pink" onClick={() => onFinish(completedNow)}>
              <Icon name="flag" size={18} /> Finish
            </button>
          </div>

          <div className="card" style={{ margin: "22px 0", padding: 18 }}>
            <div className="upnext">
              <span className="num">{next ? "→" : "★"}</span>
              <div>
                <small style={{ fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase" }}>{workout.title}</small>
                <p style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 20, textTransform: "uppercase" }}>
                  {next ? `Up next: ${next.name}` : "Last exercise. Almost there!"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {confirmExit && (
        <div className="modal-back" role="dialog" aria-modal="true" aria-labelledby="exit-title">
          <div className="card modal">
            <h2 id="exit-title" className="display h3" style={{ marginBottom: 10 }}>Quit session?</h2>
            <p style={{ marginBottom: 18 }}>You're on exercise {state.i + 1} of {steps.length}. Leaving now won't count this workout as complete.</p>
            <div className="row">
              <button className="btn btn-blue" onClick={() => setConfirmExit(false)}>Keep going</button>
              <button className="btn" onClick={onExit}>Quit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
