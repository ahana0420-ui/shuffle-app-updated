import { useEffect, useReducer, useRef, useState } from "react";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import SafetyNote from "../components/SafetyNote.jsx";
import Icon from "../components/Icon.jsx";
import SoundToggle from "../components/SoundToggle.jsx";
import { playSound, stopSounds } from "../sound.js";
import { formatClock } from "../logic.js";
import { exerciseInstructions } from "../data/instructions.js";

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
        if (state.left > 1) return {
          ...state,
          left: state.left - 1,
          tickCue: state.phase === "work" ? state.tickCue + 1 : state.tickCue,
        };
        const step = steps[state.i];
        const buzzerCue = state.phase === "work" ? state.buzzerCue + 1 : state.buzzerCue;
        if (state.phase === "work" && step.rest > 0 && state.i < last) return { ...state, phase: "rest", left: step.rest, buzzerCue };
        if (state.i < last) return { ...go(state, state.i + 1), buzzerCue };
        return { ...state, left: 0, status: "paused", done: true, buzzerCue };
      }
      default: return state;
    }
  };
}

export default function Active({ result, onFinish, onExit, soundEnabled, onToggleSound }) {
  const { workout, session, minutes } = result;
  const steps = session.steps;
  const [state, dispatch] = useReducer(makeReducer(steps), { i: 0, phase: "work", left: steps[0].seconds, status: "ready", done: false, tickCue: 0, buzzerCue: 0 });
  const [confirmExit, setConfirmExit] = useState(false);
  const previousIndex = useRef(0);
  const previousTickCue = useRef(0);
  const previousBuzzerCue = useRef(0);

  useEffect(() => {
    if (state.i !== previousIndex.current) playSound("transition", soundEnabled);
    previousIndex.current = state.i;
  }, [state.i, soundEnabled]);

  useEffect(() => {
    if (state.tickCue !== previousTickCue.current) {
      previousTickCue.current = state.tickCue;
      playSound("timerTick", soundEnabled);
    }
    if (state.buzzerCue !== previousBuzzerCue.current) {
      previousBuzzerCue.current = state.buzzerCue;
      playSound("buzzer", soundEnabled);
    }
  }, [state.tickCue, state.buzzerCue, soundEnabled]);

  // Schedule against a fixed deadline so late browser callbacks don't make the timer drift.
  useEffect(() => {
    if (state.status !== "running") return;
    const now = () => window.performance.now();
    let deadline = now() + 1000;
    let timeoutId;
    const schedule = () => {
      timeoutId = window.setTimeout(() => {
        const current = now();
        const elapsed = Math.max(1, Math.floor((current - deadline) / 1000) + 1);
        for (let i = 0; i < elapsed; i++) dispatch({ type: "TICK" });
        deadline += elapsed * 1000;
        schedule();
      }, Math.max(0, deadline - now()));
    };
    schedule();
    return () => window.clearTimeout(timeoutId);
  }, [state.status]);

  // Finished the last exercise on its own.
  useEffect(() => {
    if (state.done) onFinish(steps.length);
  }, [state.done]); // eslint-disable-line react-hooks/exhaustive-deps

  const step = steps[state.i];
  const instructions = exerciseInstructions(step.key, step.name);
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
        <SoundToggle enabled={soundEnabled} onToggle={onToggleSound} />
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
              <div className="shuffle-stage" aria-hidden="true">
                <svg viewBox="0 0 560 240" role="presentation">
                  <path d="M62 122c30-63 74-78 116-35s54 88 104 35 77-79 125-32 65 76 103 38" fill="none" stroke="var(--black)" strokeWidth="10" strokeLinecap="round" strokeDasharray="2 17" />
                  <path d="M94 176 140 44l46 132z" fill="var(--yellow)" stroke="var(--black)" strokeWidth="6" />
                  <circle cx="278" cy="116" r="76" fill="var(--pink)" stroke="var(--black)" strokeWidth="7" />
                  <path d="m252 116 20 20 38-43" fill="none" stroke="var(--white)" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="m420 43 10 34 34 10-34 10-10 34-10-34-34-10 34-10z" fill="var(--cyan)" stroke="var(--black)" strokeWidth="5" strokeLinejoin="round" />
                  <circle cx="466" cy="177" r="19" fill="var(--blue)" stroke="var(--black)" strokeWidth="5" />
                </svg>
                <span className="stage-label">{resting ? "Catch your breath" : "Your move"}</span>
              </div>
              <p className="cue">Form tip: {step.cue}</p>
              <details className="instruction-panel">
                <summary>How to do it <span aria-hidden="true">＋</span></summary>
                <div className="instruction-content">
                  <h2>Starting position</h2>
                  <p>{instructions?.start || `Instructions for ${step.name} need review: confirm its starting position before adding movement steps.`}</p>
                  <h2>How to do it</h2>
                  {instructions ? <ol>{instructions.steps.map((line, index) => <li key={index}>{line}</li>)}</ol> : <p>This move has been flagged for clarification and does not yet have verified step-by-step guidance.</p>}
                  <h2>Watch out for</h2>
                  <p>{instructions ? `${instructions.watch} ${step.cue}` : step.cue}</p>
                </div>
              </details>
            </section>

            <section className="card timer-card" aria-label="Timer">
              <span className="tag tag-yellow">
                {resting ? "REST" : state.status === "ready" ? "Ready when you are" : state.status === "paused" ? "Paused" : "Go"}
              </span>
              <div className="ring">
                <svg viewBox="0 0 200 200" aria-hidden="true">
                  <circle cx="100" cy="100" r="90" fill="none" stroke="#e5e2e1" strokeWidth="16" />
                  <circle cx="100" cy="100" r="90" fill="none" stroke={resting ? "#1E2FFF" : "#FF007A"} strokeWidth="16"
                    strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - progress)} />
                </svg>
                <div className="time" role="timer">
                  {formatClock(state.left)}
                  <small>{resting ? "REST" : "Seconds left"}</small>
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
              {resting ? "Skip rest" : "Next"} <Icon name="next" size={18} />
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
              <button className="btn" onClick={() => { stopSounds(); onExit(); }}>Quit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
