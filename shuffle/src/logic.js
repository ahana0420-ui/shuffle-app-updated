import { WORKOUTS } from "./data/workouts.js";
import { DEFAULT_PREFS } from "./data/options.js";

// ---------- Pacing styles ----------
// Each style returns [work seconds, rest seconds] for a level and a position t (0..1) in the session.
const LEVEL_BASE = { beginner: [30, 20], intermediate: [40, 20], advanced: [45, 15] };
const r5 = (n) => Math.round(n / 5) * 5;
const byLevel = (b, i, a) => (lvl) => ({ beginner: b, intermediate: i, advanced: a }[lvl]);

export const PROFILES = {
  steady:    { label: "Classic circuit",  at: (l) => LEVEL_BASE[l] },
  sprint:    { label: "Sprint intervals", at: byLevel([20, 15], [20, 10], [30, 10]) },
  power:     { label: "Strength sets",    at: byLevel([30, 30], [35, 30], [40, 30]) },
  grind:     { label: "Endurance grind",  at: byLevel([40, 15], [50, 15], [60, 10]) },
  nonstop:   { label: "Nonstop flow",     at: byLevel([30, 10], [40, 10], [45, 5]) },
  pyramid:   { label: "Pyramid",          at: (l, t) => { const [w, r] = LEVEL_BASE[l]; return [w + r5(20 * (1 - Math.abs(2 * t - 1)) - 10), r]; } },
  ladder:    { label: "Ladder",           at: (l, t) => { const [w, r] = LEVEL_BASE[l]; return [w + r5(20 * t - 10), r]; } },
  countdown: { label: "Countdown",        at: (l, t) => { const [w, r] = LEVEL_BASE[l]; return [w + r5(15 - 25 * t), r]; } },
  burnout:   { label: "Shrinking rest",   at: (l, t) => { const [w, r] = LEVEL_BASE[l]; return [w, Math.max(5, r5(r + 10 - 20 * t))]; } },
  hold:      { label: "Slow holds",       at: () => [45, 5] },
  deep:      { label: "Deep holds",       at: () => [60, 10] },
  flow:      { label: "Continuous flow",  at: () => [35, 0] },
  easy:      { label: "Easy pace",        at: () => [45, 10] },
};

function defaultProfile(workout) {
  if (workout.profiles && workout.profiles.length) return workout.profiles[0];
  if (workout.focus === "stretch") return "hold";
  if (workout.focus === "light") return "easy";
  return "steady";
}

function stepTiming(profileKey, level, minutes, t) {
  const p = PROFILES[profileKey] || PROFILES.steady;
  let [work, rest] = p.at(level, t);
  if (minutes <= 5) work = Math.min(work, 30); // keep short workouts varied
  return { work, rest };
}

function describe(steps, rounds) {
  const ws = steps.map((s) => s.seconds);
  const rs = steps.length > 1 ? steps.slice(0, -1).map((s) => s.rest) : [steps[0].rest];
  const wmin = Math.min(...ws), wmax = Math.max(...ws);
  const rmin = Math.min(...rs), rmax = Math.max(...rs);
  const workPart = wmin === wmax ? `${wmin}s each` : `${wmin}–${wmax}s per move`;
  const restPart = rmax === 0 ? "no rest between"
    : rmin === rmax ? `${rmin}s rest between` : `${rmin}–${rmax}s rest between`;
  return `${workPart} with ${restPart}.${rounds > 1 ? " Moves repeat each round." : ""}`;
}

// Repeat the moves in rounds until the chosen duration is filled.
export function buildSession(workout, level, minutes, profileKey = defaultProfile(workout)) {
  const moves = workout.moves;
  const target = minutes * 60;
  const base = stepTiming(profileKey, level, minutes, 0.5);
  const estimate = Math.max(moves.length, Math.floor(target / (base.work + base.rest)));
  const steps = [];
  let elapsed = 0;
  for (;;) {
    const i = steps.length;
    const t = estimate > 1 ? Math.min(1, i / (estimate - 1)) : 0.5;
    const { work, rest } = stepTiming(profileKey, level, minutes, t);
    if (i >= moves.length && elapsed + work + rest > target) break;
    steps.push({ ...moves[i % moves.length], seconds: work, rest, round: Math.floor(i / moves.length) + 1 });
    elapsed += work + rest;
  }
  const rounds = Math.ceil(steps.length / moves.length);
  const profile = PROFILES[profileKey] ? profileKey : "steady";
  return { steps, work: base.work, rest: base.rest, rounds, profile, label: PROFILES[profile].label, summary: describe(steps, rounds) };
}

function availableEquipment(chosen) {
  const set = new Set(chosen);
  if (set.has("gym")) {
    // A gym has the common equipment too.
    ["dumbbells", "bands", "kettlebell"].forEach((e) => set.add(e));
  }
  return set;
}

// ---------- Memory of recent shuffles ----------
const HISTORY_MAX = 20;
let history = [];                 // newest first: { id, focus, profile }
const lastProfileById = new Map();
export function resetShuffleHistory() { history = []; lastProfileById.clear(); }

function shuffled(list, rng) {
  const a = list.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function weightedPick(items, weightOf, rng) {
  const weights = items.map(weightOf);
  let r = rng() * weights.reduce((a, b) => a + b, 0);
  for (let i = 0; i < items.length; i++) {
    r -= weights[i];
    if (r <= 0) return items[i];
  }
  return items[items.length - 1];
}

// Which pacing style to play this workout in (avoids repeating the last one).
function chooseProfile(workout, rng) {
  const options = workout.profiles && workout.profiles.length ? workout.profiles : [defaultProfile(workout)];
  const lastHere = lastProfileById.get(workout.id);
  const lastAny = history[0] && history[0].profile;
  return weightedPick(options, (p) => {
    let w = options[0] === p ? 1.4 : 1;
    if (p === lastHere && options.length > 1) w *= 0.15;
    if (p === lastAny && options.length > 1) w *= 0.6;
    return w;
  }, rng);
}

// Which moves, and in what order, this particular run uses.
function composeMoves(workout, minutes, rng) {
  if (workout.fixed) return workout.moves;
  let moves = workout.moves.slice();
  const extra = workout.extra || [];
  if (extra.length) {
    if (minutes >= 25) {
      // Long session: a bigger round with some bonus moves.
      const room = Math.max(0, Math.min(extra.length, 3, 10 - moves.length));
      moves = moves.concat(shuffled(extra, rng).slice(0, room));
    } else {
      // Short session: swap up to two moves for alternates.
      const swaps = Math.min(extra.length, Math.floor(rng() * 3));
      const spots = shuffled(moves.map((_, i) => i), rng).slice(0, swaps);
      const picks = shuffled(extra, rng);
      spots.forEach((spot, k) => { moves[spot] = picks[k]; });
    }
  }
  const roll = rng();
  if (roll < 0.2) moves.reverse();
  else if (roll < 0.45 && moves.length > 2) {
    const k = 1 + Math.floor(rng() * (moves.length - 1));
    moves = moves.slice(k).concat(moves.slice(0, k));
  }
  return moves;
}

// Pick a workout from the local library based on the user's preferences.
// Returns { workout, session, minutes }.  "rng" is only for testing.
export function pickWorkout(rawPrefs, lastId = null, rng = Math.random) {
  const prefs = { ...DEFAULT_PREFS, ...rawPrefs };
  const level = prefs.level === "unsure" ? "beginner" : prefs.level;
  const minutes = Number(prefs.duration) || DEFAULT_PREFS.duration;
  const chosen = prefs.equipment.length ? prefs.equipment : ["none"];
  const available = availableEquipment(chosen);
  const usesGear = chosen.some((e) => ["dumbbells", "bands", "kettlebell", "gym"].includes(e));

  // 1. Only workouts whose required equipment the user has.
  let pool = WORKOUTS.filter((w) => w.equipment.every((e) => available.has(e)));
  if (pool.length === 0) pool = WORKOUTS.filter((w) => w.equipment.length === 0);

  // 2. Focus filter (if the user picked a specific one and something matches).
  if (prefs.focus !== "surprise") {
    const focused = pool.filter((w) => w.focus === prefs.focus);
    if (focused.length) pool = focused;
  }

  // 3. Level: prefer workouts made for the level; fall back to intermediate, then anything.
  let inLevel = pool.filter((w) => w.levels.includes(level));
  let tier2 = [];
  if (inLevel.length < 4) tier2 = pool.filter((w) => !inLevel.includes(w) && w.levels.includes("intermediate"));
  if (inLevel.length + tier2.length < 3) { inLevel = pool; tier2 = []; }
  const levelScore = new Map();
  inLevel.forEach((w) => levelScore.set(w, w.levels.includes(level) ? 3 : 0));
  tier2.forEach((w) => levelScore.set(w, -2));

  // 4. Score: level, mood, equipment use, duration fit.
  const scored = [...inLevel, ...tier2].map((w) => {
    let score = levelScore.get(w);
    if (prefs.mood !== "surprise" && w.moods.includes(prefs.mood)) score += 4;
    if (usesGear && w.equipment.length > 0) score += 2;
    if (!usesGear && w.equipment.length === 0) score += 1;
    const [lo, hi] = w.mins || [5, 60];
    if (minutes < lo || minutes > hi) score -= 4;
    return { w, score };
  });
  const best = Math.max(...scored.map((s) => s.score));
  let eligible = scored.filter((s) => s.score >= best - 4);
  if (eligible.length < 3) eligible = scored.slice().sort((a, b) => b.score - a.score).slice(0, 3);

  // 5. Avoid recent repeats: skip anything shown in the last few shuffles
  //    (as many as the eligible pool can spare), then choose by weighted chance.
  const recent = history.map((h) => h.id);
  if (lastId && recent[0] !== lastId) recent.unshift(lastId);
  const window = Math.min(recent.length, Math.max(1, Math.floor((eligible.length - 1) * 0.6)));
  const blocked = new Set(recent.slice(0, window));
  let candidates = eligible.filter((s) => !blocked.has(s.w.id));
  if (!candidates.length) candidates = eligible.filter((s) => s.w.id !== recent[0]);
  if (!candidates.length) candidates = eligible;
  const picked = weightedPick(candidates, (s) => Math.exp((s.score - best) / 2), rng).w;

  // 6. Make this run its own: pacing style, extra/swapped moves, move order.
  const profileKey = chooseProfile(picked, rng);
  const workout = { ...picked, moves: composeMoves(picked, minutes, rng) };
  const session = buildSession(workout, level, minutes, profileKey);

  history.unshift({ id: picked.id, focus: picked.focus, profile: session.profile });
  if (history.length > HISTORY_MAX) history.length = HISTORY_MAX;
  lastProfileById.set(picked.id, session.profile);

  return { workout, session, minutes };
}

export function formatClock(totalSeconds) {
  const s = Math.max(0, totalSeconds);
  const m = String(Math.floor(s / 60)).padStart(2, "0");
  const r = String(s % 60).padStart(2, "0");
  return `${m}:${r}`;
}

// Friendly list of equipment for the reveal screen.
export function equipmentText(workout) {
  const names = { dumbbells: "Dumbbells", bands: "Resistance bands", kettlebell: "Kettlebell", gym: "Gym access" };
  const list = workout.equipment.map((e) => names[e] || e);
  if (list.length === 0) list.push("No equipment");
  if (workout.mat) list.push("Exercise mat (optional)");
  return list.join(" + ");
}

// Strip control characters and cap the length of the optional music text.
export function cleanText(value, max) {
  return String(value).replace(/[\u0000-\u001f\u007f]/g, "").slice(0, max);
}
