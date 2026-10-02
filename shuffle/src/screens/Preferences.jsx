import { useState } from "react";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import SafetyNote from "../components/SafetyNote.jsx";
import Icon from "../components/Icon.jsx";
import { MOODS, FOCUSES, LEVELS, DURATIONS, EQUIPMENT, DEFAULT_PREFS, MAX_MUSIC_LENGTH } from "../data/options.js";
import { cleanText } from "../logic.js";

// One group of buttons where you pick a single answer (click again to un-pick).
function SingleChoice({ options, value, onChange, label }) {
  return (
    <div className="options" role="group" aria-label={label}>
      {options.map((o) => (
        <button key={o.value} type="button" className="option" aria-pressed={value === o.value}
          onClick={() => onChange(value === o.value ? null : o.value)}>
          <span>{o.label}</span>
          <span className="check"><Icon name="check" size={14} /></span>
        </button>
      ))}
    </div>
  );
}

function Section({ n, title, sub, badge, children }) {
  return (
    <section className="pref-section">
      <div className="pref-head">
        <div className="pref-title">
          <span className="num">{n}</span>
          <div>
            <h2 className="display h3">{title}</h2>
            <p className="hint">{sub}</p>
          </div>
        </div>
        <span className="pill">{badge}</span>
      </div>
      {children}
    </section>
  );
}

export default function Preferences({ initial, onShuffle, onSurprise, onHome }) {
  // null means "not chosen" - the app fills in a sensible default.
  const [mood, setMood] = useState(initial.mood === "surprise" ? null : initial.mood);
  const [focus, setFocus] = useState(initial.focus === "surprise" ? null : initial.focus);
  const [level, setLevel] = useState(initial.level === "unsure" ? null : initial.level);
  const [duration, setDuration] = useState(initial.duration);
  const [equipment, setEquipment] = useState(initial.equipment);
  const [music, setMusic] = useState(initial.music);

  // "No equipment" can't be combined with anything else.
  const toggleEquipment = (value) => {
    if (value === "none") return setEquipment(["none"]);
    const without = equipment.filter((e) => e !== "none" && e !== value);
    const next = equipment.includes(value) ? without : [...without, value];
    setEquipment(next.length ? next : ["none"]);
  };

  const submit = (e) => {
    e.preventDefault();
    onShuffle({
      mood: mood || "surprise",
      focus: focus || "surprise",
      level: level || "unsure",
      duration,
      equipment: equipment.length ? equipment : DEFAULT_PREFS.equipment,
      music: cleanText(music, MAX_MUSIC_LENGTH).trim(),
    });
  };

  return (
    <div className="app">
      <Header onHome={onHome}>
        <button className="btn btn-sm btn-yellow" onClick={onHome}>Back to start</button>
      </Header>

      <main className="page">
        <div className="container section stack" style={{ gap: 28 }}>
          <div className="banner">
            <span className="tag" style={{ background: "var(--black)", color: "var(--yellow)" }}>Your preferences</span>
            <h1 className="display h1" style={{ margin: "12px 0" }}>Make it yours</h1>
            <p className="lead">Pick how you're feeling, what you want to move, and how much time you have. Skip anything you like and we'll fill in the blanks.</p>
          </div>

          <form className="stack" style={{ gap: 28 }} onSubmit={submit}>
            <Section n="01" title="How are you feeling?" sub="Choose the vibe for today's workout." badge="Pick one">
              <SingleChoice options={MOODS} value={mood} onChange={setMood} label="Mood" />
            </Section>

            <Section n="02" title="What do you want to move?" sub="Choose a focus, or let SHUFFLE decide." badge="Pick one">
              <SingleChoice options={FOCUSES} value={focus} onChange={setFocus} label="Workout focus" />
            </Section>

            <Section n="03" title="Fitness level" sub="Be honest, there's no wrong answer." badge="Pick one">
              <SingleChoice options={LEVELS} value={level} onChange={setLevel} label="Fitness level" />
            </Section>

            <Section n="04" title="How long?" sub="Minutes you have to spare." badge="Pick one">
              <div className="options dur" role="group" aria-label="Duration in minutes">
                {DURATIONS.map((d) => (
                  <button key={d} type="button" className="option" aria-pressed={duration === d} onClick={() => setDuration(d)}>
                    {d} min
                  </button>
                ))}
              </div>
            </Section>

            <Section n="05" title="What gear do you have?" sub="Choose any that apply." badge="Pick any">
              <div className="options eq" role="group" aria-label="Equipment">
                {EQUIPMENT.map((o) => (
                  <button key={o.value} type="button" className="option" aria-pressed={equipment.includes(o.value)} onClick={() => toggleEquipment(o.value)}>
                    <span>{o.label}</span>
                    <span className="check"><Icon name="check" size={14} /></span>
                  </button>
                ))}
              </div>
            </Section>

            <Section n="06" title="Soundtrack idea" sub="Optional. Just for inspiration, nothing is played or sent anywhere." badge="Optional">
              <label htmlFor="music" className="hint" style={{ display: "block", marginBottom: 8 }}>Song, artist or playlist</label>
              <input id="music" className="text-input" type="text" value={music} maxLength={MAX_MUSIC_LENGTH}
                autoComplete="off" placeholder="e.g. my favourite dance playlist"
                onChange={(e) => setMusic(cleanText(e.target.value, MAX_MUSIC_LENGTH))} />
              <p className="hint" style={{ marginTop: 6 }}>{music.length}/{MAX_MUSIC_LENGTH} characters. Please don't enter personal information.</p>
            </Section>

            <SafetyNote />

            <div className="row">
              <button type="submit" className="btn btn-pink btn-big"><Icon name="shuffle" size={24} /> Shuffle my workout</button>
              <button type="button" className="btn" onClick={onSurprise}>Surprise me instead</button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
