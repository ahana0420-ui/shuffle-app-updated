// The curated workout library. Everything here is plain data you can edit.
//
// focus:     full | arms | legs | core | stretch | light
// moods:     which moods it suits (energy, chill, stressed, bored, strong, unwind)
// levels:    beginner | intermediate | advanced
// equipment: items REQUIRED (empty list = no equipment needed). "gym" means a gym is needed.
// mat:       true if a mat is helpful (optional, never required)
// moves:     the exercises of one round, resolved from the local exercise catalogue.
//            Entries are either full objects or keys from exercises.js.
//
// Variety fields (all optional):
// profiles:  pacing styles it can be played in, first = default (see PROFILES in logic.js)
// mins:      [shortest, longest] duration it suits. Outside this it is rarely picked.
// extra:     spare moves from exercises.js. Swapped in for variety on short sessions,
//            added to the round on sessions of 25+ minutes.
// fixed:     true = keep the move order and list exactly as written.
//
// The app repeats the round to fill the chosen duration.

import { X } from "./exercises.js";

const LEGACY = [
  {
    id: "wake-up-burst", title: "Wake-Up Burst", focus: "full",
    moods: ["energy", "bored", "strong"], levels: ["beginner", "intermediate", "advanced"],
    equipment: [], mat: false,
    moves: [
      { name: "Jumping jacks", area: "Full body", cue: "Step side to side instead of jumping if you want low impact." },
      { name: "Bodyweight squats", area: "Lower body", cue: "Sit hips back, chest lifted, knees tracking over toes." },
      { name: "Push-ups", area: "Upper body", cue: "Hands on a wall, counter or knees for an easier version." },
      { name: "Reverse lunges", area: "Lower body", cue: "Step back softly and keep your front knee comfortable." },
      { name: "Mountain climbers", area: "Core", cue: "Hands under shoulders. Slow it down or step the feet instead." },
      { name: "High knees", area: "Cardio", cue: "Lift knees as high as feels good. March if you prefer." },
    ],
  },
  {
    id: "strong-basics", title: "Strong Basics", focus: "full",
    moods: ["strong", "energy"], levels: ["intermediate", "advanced"],
    equipment: ["dumbbells"], mat: false,
    moves: [
      { name: "Goblet squat", area: "Lower body", cue: "Hold one dumbbell at your chest and sit down between your hips." },
      { name: "Bent-over row", area: "Back", cue: "Hinge at the hips, flat back, pull elbows toward your ribs." },
      { name: "Shoulder press", area: "Shoulders", cue: "Press overhead without arching your lower back." },
      { name: "Romanian deadlift", area: "Hamstrings", cue: "Soft knees, push hips back, dumbbells slide down your legs." },
      { name: "Weighted reverse lunge", area: "Lower body", cue: "Take a controlled step back. Use lighter weights if needed." },
      { name: "Forearm plank", area: "Core", cue: "Long line from head to heels. Drop to knees if you need to." },
    ],
  },
  {
    id: "band-together", title: "Band Together", focus: "full",
    moods: ["bored", "energy", "chill"], levels: ["beginner", "intermediate"],
    equipment: ["bands"], mat: false,
    moves: [
      { name: "Banded squat", area: "Lower body", cue: "Band above the knees, push knees gently out as you sit." },
      { name: "Banded row", area: "Back", cue: "Anchor the band, pull elbows back and squeeze shoulder blades." },
      { name: "Banded pull-apart", area: "Shoulders", cue: "Arms straight in front, pull the band wide to chest height." },
      { name: "Banded glute bridge", area: "Glutes", cue: "Press through heels and lift hips. Lower slowly." },
      { name: "Banded overhead press", area: "Shoulders", cue: "Stand on the band and press up without leaning back." },
      { name: "Banded good morning", area: "Hamstrings", cue: "Hinge forward with a flat back, then stand tall." },
    ],
  },
  {
    id: "kettlebell-kick-off", title: "Kettlebell Kick-Off", focus: "full",
    moods: ["strong", "energy", "bored"], levels: ["intermediate", "advanced"],
    equipment: ["kettlebell"], mat: false,
    moves: [
      { name: "Kettlebell deadlift", area: "Hamstrings", cue: "Hinge at the hips with a flat back and pick the bell up tall." },
      { name: "Goblet squat", area: "Lower body", cue: "Hold the bell at your chest and keep your elbows tucked in." },
      { name: "Kettlebell halo", area: "Shoulders", cue: "Circle the bell around your head slowly. Switch direction halfway." },
      { name: "Kettlebell swing", area: "Posterior chain", cue: "Hips snap forward. Swap for deadlifts if the swing feels new." },
      { name: "Single-arm press", area: "Shoulders", cue: "Press overhead, ribs down. Switch arms halfway through." },
      { name: "Suitcase hold", area: "Core", cue: "Hold the bell by your side and stand tall. Switch sides halfway." },
    ],
  },
  {
    id: "gym-floor-circuit", title: "Gym Floor Circuit", focus: "full",
    moods: ["strong", "energy", "bored"], levels: ["beginner", "intermediate", "advanced"],
    equipment: ["gym"], mat: false,
    moves: [
      { name: "Easy cardio warm-up", area: "Cardio", cue: "Bike, rower or treadmill at a pace where you could chat." },
      { name: "Goblet squat", area: "Lower body", cue: "Choose a dumbbell that feels challenging but controlled." },
      { name: "Seated cable row", area: "Back", cue: "Pull handles to your ribs and keep your chest tall." },
      { name: "Chest press machine", area: "Chest", cue: "Adjust the seat first. Press smoothly, no locking out hard." },
      { name: "Leg press", area: "Lower body", cue: "Use a moderate load, and stop short of locking your knees." },
      { name: "Plank", area: "Core", cue: "Brace your belly and breathe steadily." },
    ],
  },
  {
    id: "shoulder-spark", title: "Shoulder Spark", focus: "arms",
    moods: ["energy", "strong", "bored"], levels: ["beginner", "intermediate", "advanced"],
    equipment: ["dumbbells"], mat: false,
    moves: [
      { name: "Overhead press", area: "Shoulders", cue: "Press straight up, ribs down, neck relaxed." },
      { name: "Lateral raise", area: "Shoulders", cue: "Lift to shoulder height with soft elbows. Go light." },
      { name: "Rear-delt fly", area: "Upper back", cue: "Hinge forward and open your arms wide like wings." },
      { name: "Biceps curl", area: "Arms", cue: "Keep elbows by your sides and lower slowly." },
      { name: "Hammer curl", area: "Arms", cue: "Palms face each other, no swinging." },
      { name: "Triceps extension", area: "Arms", cue: "Keep upper arms still and extend overhead with control." },
    ],
  },
  {
    id: "arms-no-gear", title: "Arms, No Gear", focus: "arms",
    moods: ["bored", "energy", "stressed"], levels: ["beginner", "intermediate"],
    equipment: [], mat: true,
    moves: [
      { name: "Arm circles", area: "Shoulders", cue: "Small to big circles, then reverse direction." },
      { name: "Incline push-ups", area: "Chest & arms", cue: "Hands on a sturdy counter or sofa edge. Body in one line." },
      { name: "Shoulder taps", area: "Shoulders & core", cue: "In a high plank, tap each shoulder. Widen your feet for balance." },
      { name: "Plank up-downs", area: "Arms & core", cue: "Move between forearms and hands slowly. Use knees if needed." },
      { name: "Superman reach", area: "Back", cue: "Lie face down, lift arms and chest slightly, keep your neck long." },
      { name: "Wall push-ups", area: "Chest & arms", cue: "A gentle finisher: hands on a wall, bend and press away." },
    ],
  },
  {
    id: "band-shoulder-flow", title: "Band Shoulder Flow", focus: "arms",
    moods: ["chill", "unwind", "stressed"], levels: ["beginner", "intermediate"],
    equipment: ["bands"], mat: false,
    moves: [
      { name: "Band pull-apart", area: "Shoulders", cue: "Slow and smooth, squeezing shoulder blades together." },
      { name: "Band face pull", area: "Upper back", cue: "Pull the band toward your face with elbows high." },
      { name: "Band biceps curl", area: "Arms", cue: "Stand on the band and curl without swinging." },
      { name: "Band shoulder press", area: "Shoulders", cue: "Press up with control and keep your wrists straight." },
      { name: "Band triceps pressdown", area: "Arms", cue: "Anchor high and press down, keeping elbows tucked." },
      { name: "Band lateral raise", area: "Shoulders", cue: "Lift to shoulder height and lower slowly." },
    ],
  },
  {
    id: "leg-day-lite", title: "Leg Day Lite", focus: "legs",
    moods: ["chill", "bored", "energy", "stressed"], levels: ["beginner", "intermediate"],
    equipment: [], mat: false,
    moves: [
      { name: "Bodyweight squats", area: "Lower body", cue: "Sit back as if reaching for a chair. Stand tall." },
      { name: "Reverse lunges", area: "Lower body", cue: "Step back, keep your front heel planted. Hold a wall for balance if you like." },
      { name: "Glute bridge", area: "Glutes", cue: "Lie on your back, press through heels, lift hips." },
      { name: "Side lunges", area: "Inner thighs", cue: "Step wide, sit into one hip, push back to center." },
      { name: "Calf raises", area: "Calves", cue: "Rise up slowly and lower with control." },
      { name: "Wall sit", area: "Quads", cue: "Back against a wall, thighs comfortably angled." },
    ],
  },
  {
    id: "glute-lab", title: "Glute Lab", focus: "legs",
    moods: ["strong", "energy", "bored"], levels: ["intermediate", "advanced"],
    equipment: ["bands"], mat: true,
    moves: [
      { name: "Banded glute bridge", area: "Glutes", cue: "Band above knees, press out as you lift hips." },
      { name: "Banded lateral walk", area: "Glutes", cue: "Stay low with toes forward and take small side steps." },
      { name: "Banded squat", area: "Lower body", cue: "Keep knees pressing out against the band." },
      { name: "Donkey kick", area: "Glutes", cue: "On hands and knees, press one heel up toward the ceiling. Switch halfway." },
      { name: "Fire hydrant", area: "Glutes", cue: "Lift the knee out to the side without twisting your hips. Switch halfway." },
      { name: "Banded clamshell", area: "Hips", cue: "Lie on your side and open the top knee. Switch halfway." },
    ],
  },
  {
    id: "dumbbell-lower", title: "Dumbbell Lower Body", focus: "legs",
    moods: ["strong", "energy"], levels: ["intermediate", "advanced"],
    equipment: ["dumbbells"], mat: false,
    moves: [
      { name: "Goblet squat", area: "Lower body", cue: "Hold one dumbbell at your chest and squat to a comfortable depth." },
      { name: "Romanian deadlift", area: "Hamstrings", cue: "Push hips back with a flat spine and soft knees." },
      { name: "Weighted reverse lunge", area: "Lower body", cue: "Alternate legs with a controlled step back." },
      { name: "Dumbbell glute bridge", area: "Glutes", cue: "Rest a dumbbell on your hips and drive up through your heels." },
      { name: "Weighted calf raise", area: "Calves", cue: "Rise slowly, pause, and lower with control." },
      { name: "Sumo squat", area: "Inner thighs", cue: "Wide stance, toes turned out, dumbbell held low." },
    ],
  },
  {
    id: "core-control", title: "Core Control", focus: "core",
    moods: ["chill", "stressed", "bored", "strong"], levels: ["beginner", "intermediate"],
    equipment: [], mat: true,
    moves: [
      { name: "Dead bug", area: "Core", cue: "Lower back stays gently down as opposite arm and leg reach out." },
      { name: "Bird dog", area: "Core & back", cue: "Reach opposite arm and leg, hips level. Move slowly." },
      { name: "Forearm plank", area: "Core", cue: "Long body line. Drop to your knees if it gets shaky." },
      { name: "Glute bridge march", area: "Core & glutes", cue: "Hold a bridge and lift one foot at a time." },
      { name: "Side plank (knees down)", area: "Obliques", cue: "Stack shoulders over elbow. Switch sides halfway." },
      { name: "Bicycle crunch", area: "Core", cue: "Slow twists, hands light behind your head." },
    ],
  },
  {
    id: "core-fire", title: "Core Fire", focus: "core",
    moods: ["strong", "energy", "bored"], levels: ["intermediate", "advanced"],
    equipment: [], mat: true,
    moves: [
      { name: "Plank shoulder taps", area: "Core", cue: "Keep hips steady as you tap each shoulder." },
      { name: "Mountain climbers", area: "Core & cardio", cue: "Drive knees in with a strong, steady plank." },
      { name: "Russian twist", area: "Obliques", cue: "Lean back slightly and rotate from your ribs." },
      { name: "Lying leg raises", area: "Lower abs", cue: "Bend your knees if your lower back lifts up." },
      { name: "Hollow hold", area: "Core", cue: "Press your lower back down. Bend your knees to make it easier." },
      { name: "Plank jacks", area: "Core & cardio", cue: "Jump or step feet wide and together while holding plank." },
    ],
  },
  {
    id: "slow-stretch-unwind", title: "Slow Stretch Unwind", focus: "stretch",
    moods: ["unwind", "chill", "stressed"], levels: ["beginner", "intermediate", "advanced"],
    equipment: [], mat: true,
    moves: [
      { name: "Gentle neck rolls", area: "Neck", cue: "Tiny slow half circles. Never force it." },
      { name: "Cat-cow", area: "Spine", cue: "Round and arch your back with your breath." },
      { name: "Child's pose", area: "Back & hips", cue: "Sit hips back toward heels, arms long, breathe." },
      { name: "Seated forward fold", area: "Hamstrings", cue: "Bend your knees as much as you like and fold from the hips." },
      { name: "Figure-four stretch", area: "Hips", cue: "Lie back, cross ankle over knee, hold the thigh. Switch sides halfway." },
      { name: "Supine twist", area: "Spine", cue: "Drop both knees to one side, then the other halfway through." },
    ],
  },
  {
    id: "mobility-reset", title: "Mobility Reset", focus: "stretch",
    moods: ["bored", "chill", "energy", "unwind"], levels: ["beginner", "intermediate", "advanced"],
    equipment: [], mat: false,
    moves: [
      { name: "Hip circles", area: "Hips", cue: "Hands on hips and draw slow circles. Reverse halfway." },
      { name: "World's greatest stretch", area: "Full body", cue: "Lunge, rotate your chest open, alternate sides." },
      { name: "Thoracic rotations", area: "Upper back", cue: "On hands and knees, hand behind head, rotate open." },
      { name: "Ankle rocks", area: "Ankles", cue: "Knee travels forward over toes with your heel down." },
      { name: "Standing quad stretch", area: "Quads", cue: "Hold a wall for balance. Switch legs halfway." },
      { name: "Deep squat hold", area: "Hips", cue: "Hold a doorframe if you like and relax down." },
    ],
  },
  {
    id: "gentle-walk-out", title: "Gentle Walk-Out", focus: "light",
    moods: ["chill", "unwind", "stressed"], levels: ["beginner", "intermediate", "advanced"],
    equipment: [], mat: false,
    moves: [
      { name: "March in place", area: "Cardio", cue: "Easy pace with relaxed shoulders." },
      { name: "Step touch", area: "Cardio", cue: "Step side to side with a gentle sway of the arms." },
      { name: "Arm swings", area: "Shoulders", cue: "Swing arms forward and back, loose and easy." },
      { name: "Heel digs", area: "Legs", cue: "Tap alternating heels forward with small bounces." },
      { name: "Side steps", area: "Legs", cue: "Take small steps out and back. Keep it smooth." },
      { name: "Shoulder rolls", area: "Shoulders", cue: "Roll slowly back, then forward. Breathe out." },
    ],
  },
  {
    id: "easy-energy-flow", title: "Easy Energy Flow", focus: "light",
    moods: ["energy", "bored", "chill"], levels: ["beginner", "intermediate"],
    equipment: [], mat: false,
    moves: [
      { name: "Marching", area: "Cardio", cue: "Lift your knees comfortably and swing your arms." },
      { name: "Shoulder circles", area: "Shoulders", cue: "Big circles forwards, then backwards." },
      { name: "Gentle knee lifts", area: "Legs", cue: "Lift one knee and touch with the opposite hand." },
      { name: "Small step-out squats", area: "Lower body", cue: "Step out and sink slightly. Choose any depth." },
      { name: "Standing cross-crunch", area: "Core", cue: "Bring elbow toward opposite knee, standing tall." },
      { name: "Step jacks", area: "Cardio", cue: "Step one foot out and reach your arms overhead. Alternate." },
    ],
  },
];

// Extra fields for the original workouts (their moves above are unchanged).
const META = {
  "wake-up-burst": { profiles: ["steady", "sprint"], mins: [5, 30], extra: ["burpee", "skater", "butt-kicks", "inchworm"] },
  "strong-basics": { profiles: ["power", "steady"], extra: ["db-thruster", "db-floor-press", "db-row-single", "farmer-hold"] },
  "band-together": { profiles: ["steady", "ladder"], extra: ["band-chest-press", "band-pulldown", "band-woodchop"] },
  "kettlebell-kick-off": { profiles: ["steady", "power"], extra: ["kb-row", "goblet-lunge", "kb-sumo-deadlift"] },
  "gym-floor-circuit": { profiles: ["steady", "grind"], fixed: true },
  "shoulder-spark": { profiles: ["steady", "countdown"], extra: ["arnold-press", "front-raise", "tri-kickback"] },
  "arms-no-gear": { profiles: ["steady", "pyramid"], fixed: true },
  "band-shoulder-flow": { profiles: ["steady", "nonstop"], extra: ["band-reverse-fly", "band-pulldown"] },
  "leg-day-lite": { profiles: ["steady", "ladder"], extra: ["sumo-squat", "split-squat", "step-ups", "curtsy-lunge"] },
  "glute-lab": { profiles: ["steady", "burnout"], extra: ["band-kickback", "band-good-morning"] },
  "dumbbell-lower": { profiles: ["power", "steady"], extra: ["split-squat", "step-ups"] },
  "core-control": { profiles: ["steady", "nonstop"], extra: ["heel-touches", "reverse-crunch", "plank-reach"] },
  "core-fire": { profiles: ["sprint", "burnout", "steady"], mins: [5, 30], extra: ["flutter-kicks", "reverse-crunch", "hip-dips"] },
  "slow-stretch-unwind": { profiles: ["hold", "deep"], fixed: true },
  "mobility-reset": { profiles: ["hold", "flow"], extra: ["thread-needle", "low-lunge", "cross-body"] },
  "gentle-walk-out": { profiles: ["easy"], extra: ["grapevine", "hip-sway", "shake-out"] },
  "easy-energy-flow": { profiles: ["easy", "nonstop"], extra: ["grapevine", "hip-sway", "easy-twist"] },
};

const ALL = ["beginner", "intermediate", "advanced"];
const IA = ["intermediate", "advanced"];
const BI = ["beginner", "intermediate"];

// New workouts. Moves are keys from exercises.js.
const NEW = [
  // ---------- FULL BODY ----------
  { id: "tabata-torch", title: "Tabata Torch", focus: "full", moods: ["energy", "strong", "bored"], levels: IA, equipment: [], mat: false,
    profiles: ["sprint", "burnout"], mins: [5, 20],
    moves: ["burpee", "skater", "squat-jump", "plank-jacks", "butt-kicks", "inchworm"], extra: ["shadow-box", "fast-feet", "high-knees"] },
  { id: "peak-pyramid", title: "Peak Pyramid", focus: "full", moods: ["strong", "energy", "bored"], levels: IA, equipment: [], mat: false,
    profiles: ["pyramid", "steady"], mins: [10, 45],
    moves: ["squat", "push-ups", "alt-lunge", "inchworm", "plank", "glute-bridge"], extra: ["step-ups", "curtsy-lunge", "bear-crawl"] },
  { id: "long-haul", title: "The Long Haul", focus: "full", moods: ["bored", "strong", "energy"], levels: IA, equipment: [], mat: false,
    profiles: ["grind", "steady"], mins: [20, 60],
    moves: ["jumping-jacks", "squat", "push-ups", "alt-lunge", "mountain-climbers", "bear-crawl", "plank", "high-knees"], extra: ["burpee", "skater"] },
  { id: "quiet-cardio", title: "Quiet Cardio", focus: "full", moods: ["chill", "stressed", "bored", "energy"], levels: BI, equipment: [], mat: false,
    profiles: ["nonstop", "steady"], mins: [5, 45],
    moves: ["march", "squat-reach", "knee-drive", "step-jacks", "low-skater", "boxing"], extra: ["shadow-box", "side-lunge"] },
  { id: "ladder-up", title: "Ladder Up", focus: "full", moods: ["bored", "strong", "energy"], levels: ALL, equipment: [], mat: true,
    profiles: ["ladder", "steady"], mins: [10, 45],
    moves: ["push-ups", "squat", "glute-bridge", "mountain-climbers", "side-lunge", "plank"], extra: ["alt-lunge", "bear-crawl"] },
  { id: "iron-ladder", title: "Iron Ladder", focus: "full", moods: ["strong", "energy"], levels: IA, equipment: ["dumbbells"], mat: false,
    profiles: ["ladder", "power"], mins: [15, 60],
    moves: ["db-thruster", "db-row-single", "db-rdl", "db-floor-press", "db-reverse-lunge"], extra: ["db-swing", "goblet-squat", "farmer-hold"] },
  { id: "slow-burn", title: "Slow Burn", focus: "full", moods: ["chill", "stressed", "strong"], levels: BI, equipment: ["dumbbells"], mat: false,
    profiles: ["grind", "steady"], mins: [15, 60],
    moves: ["goblet-squat", "db-floor-press", "db-row-single", "db-glute-bridge", "db-curl-to-press", "farmer-hold"], extra: ["db-rdl", "db-reverse-lunge"] },
  { id: "band-sprint", title: "Band Sprint", focus: "full", moods: ["energy", "bored", "strong"], levels: ALL, equipment: ["bands"], mat: false,
    profiles: ["sprint", "nonstop"], mins: [5, 20],
    moves: ["band-squat", "band-chest-press", "band-row", "band-woodchop", "band-good-morning"], extra: ["band-glute-bridge", "band-press", "band-pullapart"] },
  { id: "bell-ladder", title: "Bell Ladder", focus: "full", moods: ["strong", "energy", "bored"], levels: IA, equipment: ["kettlebell"], mat: false,
    profiles: ["ladder", "burnout"], mins: [10, 45],
    moves: ["kb-deadlift", "goblet-squat", "kb-swing", "kb-halo", "goblet-lunge"], extra: ["kb-press", "kb-row", "kb-suitcase"] },
  { id: "machine-mix", title: "Machine Mix", focus: "full", moods: ["strong", "chill", "bored"], levels: BI, equipment: ["gym"], mat: false,
    profiles: ["power", "steady"], mins: [20, 60],
    moves: ["leg-press", "lat-pulldown", "chest-press-machine", "shoulder-press-machine", "seated-row", "pallof"], extra: ["leg-curl", "hip-thrust"] },
  { id: "cardio-roulette", title: "Cardio Roulette", focus: "full", moods: ["energy", "bored", "strong"], levels: ALL, equipment: ["gym"], mat: false,
    profiles: ["burnout", "steady", "sprint"], mins: [10, 60],
    moves: ["bike", "rower", "incline-walk", "stair-climber", "elliptical", "jump-rope"], extra: ["battle-ropes"] },
  { id: "dumbbell-dash", title: "Dumbbell Dash", focus: "full", moods: ["energy", "strong", "bored"], levels: IA, equipment: ["dumbbells"], mat: false,
    profiles: ["sprint", "burnout"], mins: [5, 20],
    moves: ["db-thruster", "db-swing", "db-reverse-lunge", "db-row-single"], extra: ["goblet-squat", "db-floor-press"] },

  // ---------- ARMS & SHOULDERS ----------
  { id: "pushup-playground", title: "Push-Up Playground", focus: "arms", moods: ["strong", "energy", "bored"], levels: IA, equipment: [], mat: true,
    profiles: ["pyramid", "steady"], mins: [5, 30],
    moves: ["wide-pushups", "closegrip-pushups", "pike-pushups", "chair-dips", "shoulder-taps"], extra: ["plank-updowns", "incline-pushups"] },
  { id: "pump-countdown", title: "Pump Countdown", focus: "arms", moods: ["strong", "energy", "bored"], levels: ALL, equipment: ["dumbbells"], mat: false,
    profiles: ["countdown", "steady"], mins: [10, 30],
    moves: ["hammer-curl", "arnold-press", "floor-skull", "front-raise", "tri-kickback"], extra: ["db-curl-to-press", "lateral-raise", "farmer-hold"] },
  { id: "pull-session", title: "Pull Session", focus: "arms", moods: ["chill", "stressed", "bored", "strong"], levels: BI, equipment: ["bands"], mat: false,
    profiles: ["grind", "nonstop"], mins: [15, 60],
    moves: ["band-pulldown", "band-row", "band-curl", "band-face-pull", "band-reverse-fly"], extra: ["band-pullapart", "band-press"] },
  { id: "bell-shoulder-smoke", title: "Bell Shoulder Smoke", focus: "arms", moods: ["strong", "energy"], levels: IA, equipment: ["kettlebell"], mat: false,
    profiles: ["power", "steady"], mins: [10, 30],
    moves: ["kb-press", "kb-upright-row", "kb-curl", "kb-tri-ext", "kb-halo", "kb-suitcase"], extra: ["kb-row"] },
  { id: "cable-arm-day", title: "Cable Arm Day", focus: "arms", moods: ["strong", "bored", "chill"], levels: ALL, equipment: ["gym"], mat: false,
    profiles: ["steady", "grind"], mins: [15, 60],
    moves: ["cable-curl", "tri-pushdown", "cable-lateral-raise", "cable-face-pull", "cable-overhead-tri", "cable-rope-hammer"], extra: ["lat-pulldown", "shoulder-press-machine"] },

  // ---------- LEGS & GLUTES ----------
  { id: "lunge-lab", title: "Lunge Lab", focus: "legs", moods: ["strong", "energy", "bored"], levels: IA, equipment: [], mat: false,
    profiles: ["ladder", "steady"], mins: [10, 45],
    moves: ["alt-lunge", "curtsy-lunge", "side-lunge", "split-squat", "step-ups"], extra: ["reverse-lunge", "glute-bridge", "wall-sit"] },
  { id: "gentle-legs", title: "Gentle Legs", focus: "legs", moods: ["chill", "stressed", "unwind"], levels: BI, equipment: [], mat: false,
    profiles: ["steady", "nonstop"], mins: [5, 30],
    moves: ["chair-squat", "glute-bridge", "side-leg-raise", "calf-raise", "wall-sit"], extra: ["sumo-squat", "squat-hold"] },
  { id: "squat-ladder", title: "Squat Ladder", focus: "legs", moods: ["bored", "strong", "energy", "chill"], levels: ALL, equipment: [], mat: false,
    profiles: ["ladder", "pyramid"], mins: [5, 30],
    moves: ["squat", "sumo-squat", "tempo-squat", "pulse-squat", "squat-hold"], extra: ["calf-raise", "glute-bridge"] },
  { id: "bell-legs-burnout", title: "Bell Legs Burnout", focus: "legs", moods: ["strong", "energy"], levels: IA, equipment: ["kettlebell"], mat: false,
    profiles: ["burnout", "steady"], mins: [10, 30],
    moves: ["goblet-squat", "kb-swing", "goblet-lunge", "kb-sumo-deadlift", "kb-sl-rdl"], extra: ["kb-deadlift", "calf-raise"] },
  { id: "leg-express", title: "Leg Express", focus: "legs", moods: ["energy", "bored", "chill"], levels: BI, equipment: ["bands"], mat: false,
    profiles: ["sprint", "nonstop"], mins: [5, 15],
    moves: ["band-squat", "band-lateral-walk", "band-kickback", "band-glute-bridge", "band-good-morning"], extra: ["band-clamshell"] },
  { id: "gym-leg-day", title: "Gym Leg Day", focus: "legs", moods: ["strong", "bored"], levels: IA, equipment: ["gym"], mat: false,
    profiles: ["power", "grind"], mins: [20, 60],
    moves: ["leg-press", "leg-curl", "leg-extension", "hip-thrust", "goblet-squat", "standing-calf-raise"], extra: ["reverse-lunge"] },

  // ---------- CORE ----------
  { id: "plank-party", title: "Plank Party", focus: "core", moods: ["strong", "bored", "energy"], levels: IA, equipment: [], mat: true,
    profiles: ["power", "steady"], mins: [5, 20],
    moves: ["forearm-plank", "plank-reach", "hip-dips", "side-plank", "bear-plank"], extra: ["plank-jacks", "shoulder-taps"] },
  { id: "core-on-your-feet", title: "Core On Your Feet", focus: "core", moods: ["chill", "stressed", "bored", "energy"], levels: BI, equipment: [], mat: false,
    profiles: ["nonstop", "steady"], mins: [5, 30],
    moves: ["knee-drive", "standing-cross-crunch", "side-bend", "standing-twist", "standing-bicycle"], extra: ["march", "boxing"] },
  { id: "ab-sprint", title: "Ab Sprint", focus: "core", moods: ["energy", "strong", "bored"], levels: IA, equipment: [], mat: true,
    profiles: ["sprint", "burnout"], mins: [5, 15],
    moves: ["flutter-kicks", "reverse-crunch", "heel-touches", "bicycle"], extra: ["hollow-hold", "russian-twist"] },
  { id: "weighted-core", title: "Weighted Core", focus: "core", moods: ["strong", "energy"], levels: IA, equipment: ["dumbbells"], mat: true,
    profiles: ["steady", "power"], mins: [10, 30],
    moves: ["db-russian-twist", "db-woodchop", "db-side-bend", "db-dead-bug", "farmer-hold"], extra: ["plank-reach"] },
  { id: "bell-core", title: "Bell Core", focus: "core", moods: ["strong", "bored"], levels: IA, equipment: ["kettlebell"], mat: true,
    profiles: ["steady", "burnout"], mins: [10, 30],
    moves: ["kb-halo", "kb-suitcase", "kb-twist", "kb-pull-through", "goblet-march"], extra: ["kb-deadlift"] },

  // ---------- STRETCH & MOBILITY ----------
  { id: "desk-unkink", title: "Desk Unkink", focus: "stretch", moods: ["stressed", "bored", "unwind", "chill"], levels: ALL, equipment: [], mat: false,
    profiles: ["hold", "flow"], mins: [5, 20],
    moves: ["seated-neck", "seated-twist", "doorway-chest", "wrist-stretch", "seated-figure-four", "shoulder-rolls"], extra: ["cross-body", "overhead-tri"] },
  { id: "hips-and-hammies", title: "Hips & Hamstrings", focus: "stretch", moods: ["chill", "unwind", "stressed", "strong"], levels: ALL, equipment: [], mat: true,
    profiles: ["deep", "hold"], mins: [10, 45],
    moves: ["low-lunge", "lying-hamstring", "butterfly", "ninety-ninety", "figure-four", "happy-baby", "standing-quad", "forward-fold"] },
  { id: "spine-wave", title: "Spine Wave", focus: "stretch", moods: ["unwind", "chill", "stressed"], levels: ALL, equipment: [], mat: true,
    profiles: ["flow", "hold"], mins: [5, 30],
    moves: ["cat-cow", "thread-needle", "sphinx", "childs-pose", "knees-to-chest", "supine-twist"] },
  { id: "shoulder-melt", title: "Shoulder Melt", focus: "stretch", moods: ["stressed", "unwind", "bored", "chill"], levels: ALL, equipment: [], mat: false,
    profiles: ["hold", "flow"], mins: [5, 20],
    moves: ["cross-body", "overhead-tri", "doorway-chest", "eagle-arms", "wall-angels", "seated-neck"], extra: ["thread-needle", "shoulder-rolls"] },
  { id: "pre-sleep-wind-down", title: "Pre-Sleep Wind-Down", focus: "stretch", moods: ["unwind", "chill", "stressed"], levels: ALL, equipment: [], mat: true,
    profiles: ["deep"], mins: [10, 45], fixed: true,
    moves: ["belly-breath", "reclined-butterfly", "childs-pose", "supine-twist", "legs-up-wall", "final-rest"] },

  // ---------- LIGHT MOVEMENT ----------
  { id: "kitchen-dance-break", title: "Kitchen Dance Break", focus: "light", moods: ["energy", "bored", "chill"], levels: ALL, equipment: [], mat: false,
    profiles: ["easy", "nonstop"], mins: [5, 30],
    moves: ["step-touch", "grapevine", "hip-sway", "easy-twist", "shake-out", "heel-digs"], extra: ["march", "arm-swings"] },
  { id: "office-friendly-moves", title: "Office-Friendly Moves", focus: "light", moods: ["stressed", "bored", "chill"], levels: ALL, equipment: [], mat: false,
    profiles: ["easy", "steady"], mins: [5, 20],
    moves: ["chair-squat", "wall-pushups", "march", "calf-raise", "side-bend", "wall-angels"], extra: ["seated-twist", "shoulder-rolls"] },
  { id: "balance-and-breathe", title: "Balance & Breathe", focus: "light", moods: ["chill", "unwind", "stressed"], levels: ALL, equipment: [], mat: false,
    profiles: ["easy", "hold"], mins: [5, 30],
    moves: ["single-leg-stand", "heel-to-toe", "slow-arm-sweeps", "standing-side-reach", "belly-breath"], extra: ["ankle-rocks", "shoulder-rolls"] },
  { id: "pace-changer", title: "Pace Changer", focus: "light", moods: ["energy", "bored", "chill"], levels: BI, equipment: [], mat: false,
    profiles: ["easy", "ladder"], mins: [5, 30],
    moves: ["march", "brisk-march", "march-punches", "side-steps"], extra: ["step-touch", "heel-digs"] },
];

const resolveMove = (m) => {
  if (typeof m !== "string") return m;
  if (!X[m]) throw new Error(`Unknown exercise key: ${m}`);
  return X[m];
};

export const WORKOUTS = [...LEGACY.map((w) => ({ ...w, ...META[w.id] })), ...NEW].map((w) => ({
  ...w,
  moves: w.moves.map(resolveMove),
  extra: (w.extra || []).map(resolveMove),
}));
