// Run with:  npm run test:shuffle
import { WORKOUTS } from "../src/data/workouts.js";
import { MOODS, FOCUSES, LEVELS, DURATIONS } from "../src/data/options.js";
import { pickWorkout, resetShuffleHistory, PROFILES } from "../src/logic.js";

let fails = 0;
const ok = (c, m) => { if (!c) { fails++; console.log("  FAIL:", m); } };
const sig = (r) => `${r.workout.id}|${r.session.profile}|${r.workout.moves.map((m) => m.name).join(",")}`;
const uniq = (a) => new Set(a).size;

console.log(`\n== Library (${WORKOUTS.length} workouts) ==`);
ok(WORKOUTS.length >= 40 && WORKOUTS.length <= 60, "library size 40-60");
ok(uniq(WORKOUTS.map((w) => w.id)) === WORKOUTS.length, "unique ids");
ok(uniq(WORKOUTS.map((w) => w.title)) === WORKOUTS.length, "unique titles");
const moods = MOODS.map((m) => m.value), focuses = FOCUSES.map((f) => f.value), levels = LEVELS.map((l) => l.value);
for (const w of WORKOUTS) {
  const names = [...w.moves, ...w.extra].map((m) => m.name);
  ok(uniq(names) === names.length, `${w.id}: duplicate move names`);
  ok(w.moves.length >= 4 && w.moves.length <= 8, `${w.id}: 4-8 moves`);
  ok(w.moves.every((m) => m.name && m.area && m.cue), `${w.id}: move fields`);
  ok(focuses.includes(w.focus) && w.focus !== "surprise", `${w.id}: focus`);
  ok(w.moods.every((m) => moods.includes(m)), `${w.id}: moods`);
  ok(w.levels.every((l) => levels.includes(l)), `${w.id}: levels`);
  ok((w.profiles || []).every((p) => PROFILES[p]), `${w.id}: profiles`);
}
const count = (f) => WORKOUTS.reduce((o, w) => ((o[f(w)] = (o[f(w)] || 0) + 1), o), {});
console.log("  by focus:", JSON.stringify(count((w) => w.focus)));
console.log("  by gear: ", JSON.stringify(count((w) => w.equipment.join("+") || "none")));
console.log("  move counts:", JSON.stringify(count((w) => w.moves.length)));
const combos = new Set(WORKOUTS.map((w) => w.moves.map((m) => m.name).sort().join()));
ok(combos.size === WORKOUTS.length, "every workout has a distinct move set");

console.log("\n== Same preferences, 30 shuffles each ==");
const same = [
  ["Default / Surprise me", {}],
  ["Energy, full, beginner, 15m, no gear", { mood: "energy", focus: "full", level: "beginner", duration: 15, equipment: ["none"] }],
  ["Strong, surprise focus, intermediate, 20m, dumbbells", { mood: "strong", level: "intermediate", duration: 20, equipment: ["dumbbells"] }],
  ["Unwind, stretch, any, 10m", { mood: "unwind", focus: "stretch", level: "beginner", duration: 10 }],
  ["Core, advanced, 5m, no gear", { mood: "strong", focus: "core", level: "advanced", duration: 5 }],
  ["Legs, intermediate, 45m, gym", { focus: "legs", level: "intermediate", duration: 45, equipment: ["gym"] }],
];
for (const [name, prefs] of same) {
  resetShuffleHistory();
  let last = null; const runs = [];
  for (let i = 0; i < 30; i++) { const r = pickWorkout(prefs, last); last = r.workout.id; runs.push(r); }
  const ids = runs.map((r) => r.workout.id);
  const immediate = ids.filter((id, i) => i && id === ids[i - 1]).length;
  let near = 0; for (let i = 1; i < ids.length; i++) if (ids.slice(Math.max(0, i - 3), i).includes(ids[i])) near++;
  const paces = uniq(runs.map((r) => `${r.session.profile}:${r.session.steps[0].seconds}/${r.session.steps[0].rest}`));
  console.log(`  ${name}\n    workouts:${uniq(ids)}  pacing styles:${uniq(runs.map((r) => r.session.profile))}  distinct full signatures:${uniq(runs.map(sig))}/30  immediate repeats:${immediate}  repeats within last 3:${near}`);
  ok(immediate === 0, `${name}: immediate repeat`);
  ok(uniq(runs.map(sig)) >= 12, `${name}: not enough variety`);
}

console.log("\n== Matching across 3000 random preference sets ==");
const pickOne = (a) => a[Math.floor(Math.random() * a.length)];
const gearSets = [["none"], ["dumbbells"], ["bands"], ["kettlebell"], ["gym"], ["mat"], ["dumbbells", "bands"], ["none", "mat"], ["other"]];
const st = { n: 0, gear: 0, focus: 0, focusN: 0, level: 0, mood: 0, moodN: 0, dur: 0, durMax: 0, minsFit: 0, short: 0 };
resetShuffleHistory(); let last = null;
for (let i = 0; i < 3000; i++) {
  const prefs = {
    mood: pickOne(moods), focus: pickOne(focuses), level: pickOne(levels),
    duration: pickOne(DURATIONS), equipment: pickOne(gearSets),
  };
  if (i % 40 === 0) { resetShuffleHistory(); last = null; }
  const r = pickWorkout(prefs, last); last = r.workout.id;
  const have = new Set(prefs.equipment); if (have.has("gym")) ["dumbbells", "bands", "kettlebell"].forEach((e) => have.add(e));
  st.n++;
  if (r.workout.equipment.every((e) => have.has(e))) st.gear++;
  if (prefs.focus !== "surprise") { st.focusN++; if (r.workout.focus === prefs.focus) st.focus++; }
  const lv = prefs.level === "unsure" ? "beginner" : prefs.level;
  if (r.workout.levels.includes(lv)) st.level++;
  if (prefs.mood !== "surprise") {
    // Only count cases where some workout with the chosen equipment and focus suits the mood.
    const reachable = WORKOUTS.some((w) => w.equipment.every((e) => have.has(e)) && (prefs.focus === "surprise" || w.focus === prefs.focus) && w.levels.includes(lv) && w.moods.includes(prefs.mood));
    if (reachable) { st.moodN++; if (r.workout.moods.includes(prefs.mood)) st.mood++; }
  }
  const [lo, hi] = r.workout.mins || [5, 60];
  if (prefs.duration >= lo && prefs.duration <= hi) st.minsFit++;
  const total = r.session.steps.reduce((a, s) => a + s.seconds + s.rest, 0);
  if (total <= prefs.duration * 60 + 70 || r.session.steps.length === r.workout.moves.length) st.dur++;
  const stepsOk = r.session.steps.every((s) => s.seconds > 0 && s.rest >= 0);
  ok(stepsOk, "invalid step timing");
  ok(uniq(r.workout.moves.map((m) => m.name)) === r.workout.moves.length, "duplicate move names in a run");
}
const pct = (a, b) => `${((100 * a) / b).toFixed(1)}%`;
console.log(`  equipment respected: ${pct(st.gear, st.n)}   focus respected: ${pct(st.focus, st.focusN)}   level suitable: ${pct(st.level, st.n)}`);
console.log(`  mood matched (when achievable): ${pct(st.mood, st.moodN)}   duration within workout's range: ${pct(st.minsFit, st.n)}   session fills requested time: ${pct(st.dur, st.n)}`);
ok(st.gear === st.n, "equipment must always be respected");
ok(st.focus === st.focusN, "focus must always be respected");
ok(st.level / st.n > 0.95, "level suitability");
ok(st.mood / st.moodN > 0.85, "mood matching");
ok(st.minsFit / st.n > 0.9, "duration suitability");

console.log("\n== Spot checks ==");
const spot = (label, prefs, check) => {
  resetShuffleHistory(); const hits = [];
  for (let i = 0; i < 40; i++) hits.push(pickWorkout(prefs, null));
  const good = hits.filter((r) => check(r)).length;
  console.log(`  ${label}: ${good}/40`); ok(good >= 36, label);
};
spot("Stressed + no gear never needs equipment", { mood: "stressed", equipment: ["none"] }, (r) => r.workout.equipment.length === 0);
spot("Unwind + stretch gives slow-hold pacing", { mood: "unwind", focus: "stretch", level: "beginner" }, (r) => ["hold", "deep", "flow"].includes(r.session.profile));
spot("Advanced + kettlebell + 5m is kettlebell-only", { level: "advanced", equipment: ["kettlebell"], duration: 5 }, (r) => r.workout.equipment.every((e) => e === "kettlebell"));
spot("Beginner never gets advanced-only workout", { level: "beginner", focus: "full", equipment: ["none"] }, (r) => r.workout.levels.includes("beginner") || r.workout.levels.includes("intermediate"));
spot("Light movement stays gentle (<=45s work)", { focus: "light", duration: 10 }, (r) => r.session.steps.every((s) => s.seconds <= 45));
spot("5 min session is a single short round or two", { duration: 5, level: "intermediate", focus: "core" }, (r) => r.session.steps.length <= 12);

console.log(fails ? `\n${fails} FAILURE(S)\n` : "\nAll checks passed.\n");
process.exit(fails ? 1 : 0);
