const groups = {
  squat: `squat band-squat chair-squat sumo-squat tempo-squat pulse-squat squat-hold squat-jump goblet-squat db-thruster squat-reach wall-sit leg-press leg-extension standing-calf-raise calf-raise step-ups`,
  lunge: `alt-lunge reverse-lunge db-reverse-lunge goblet-lunge curtsy-lunge side-lunge split-squat low-lunge`,
  hinge: `db-rdl kb-deadlift kb-sumo-deadlift kb-sl-rdl db-swing kb-swing band-good-morning`,
  bridge: `glute-bridge db-glute-bridge band-glute-bridge hip-thrust band-kickback side-leg-raise band-lateral-walk band-clamshell`,
  push: `push-ups wall-pushups incline-pushups wide-pushups closegrip-pushups pike-pushups chair-dips db-floor-press band-chest-press band-press chest-press-machine shoulder-press-machine kb-press arnold-press db-curl-to-press tri-pushdown cable-overhead-tri kb-tri-ext overhead-tri floor-skull tri-kickback`,
  pull: `band-row band-pullapart band-face-pull band-reverse-fly band-pulldown db-row-single kb-row cable-curl cable-face-pull cable-rope-hammer cable-lateral-raise lateral-raise front-raise hammer-curl kb-curl kb-upright-row seated-row lat-pulldown farmer-hold kb-suitcase db-side-bend side-bend band-curl`,
  plank: `plank forearm-plank bear-plank plank-jacks plank-reach plank-updowns shoulder-taps hip-dips side-plank mountain-climbers bear-crawl kb-pull-through`,
  abs: `bicycle standing-bicycle flutter-kicks heel-touches reverse-crunch hollow-hold dead-bug db-dead-bug russian-twist db-russian-twist kb-twist standing-cross-crunch knee-drive standing-twist pallof db-woodchop band-woodchop standing-side-reach`,
  cardio: `jumping-jacks step-jacks fast-feet high-knees butt-kicks skater low-skater brisk-march march-punches march boxing shadow-box jump-rope battle-ropes bike rower incline-walk stair-climber elliptical`,
  stretch: `ankle-rocks arm-swings shoulder-rolls shake-out hip-sway easy-twist step-touch side-steps grapevine heel-digs slow-arm-sweeps cat-cow childs-pose supine-twist figure-four standing-quad forward-fold seated-neck seated-twist doorway-chest wrist-stretch seated-figure-four lying-hamstring butterfly ninety-ninety happy-baby thread-needle sphinx knees-to-chest cross-body eagle-arms wall-angels reclined-butterfly legs-up-wall final-rest belly-breath overhead-tri`,
  balance: `single-leg-stand heel-to-toe standing-side-reach`,
  machine: `leg-curl`,
  carry: `goblet-march`,
  circle: `kb-halo`,
  burpee: `burpee`,
  inchworm: `inchworm`,
};

const guide = {
  squat: { start: "Stand with feet about hip to shoulder width apart, toes turned slightly outward. Let your arms rest forward for balance.", steps: ["Brace gently through your middle and keep your chest lifted.", "Send your hips back and bend your knees, lowering only as far as feels comfortable.", "Keep your feet flat, then press through the floor to stand tall again."], watch: "Keep your heels down and knees pointing in the same direction as your toes." },
  lunge: { start: "Stand tall with feet hip-width apart and hands at your sides or on your hips.", steps: ["Take a comfortable step, keeping your hips facing forward.", "Bend both knees slightly as you lower; use a small range if that feels better.", "Push through your feet to return to standing, then change sides as directed."], watch: "Keep your front knee comfortable and avoid letting it collapse inward." },
  hinge: { start: "Stand with feet hip-width apart and soften your knees. Hold the weight securely if the move uses one.", steps: ["Push your hips back as your chest tips forward, keeping your back long.", "Let your hands or the weight travel close to your legs.", "Press your feet into the floor and bring your hips forward to stand tall."], watch: "The movement comes from your hips; don't round your back or force a deep reach." },
  bridge: { start: "For floor versions, lie on your back with knees bent and feet flat. For standing versions, hold a wall or chair for balance.", steps: ["Gently tighten your middle and keep your hips level.", "Press through your heels or move the working leg as the exercise name suggests.", "Pause briefly, then return slowly to the starting position and switch sides if needed."], watch: "Use a comfortable range and avoid arching your lower back." },
  push: { start: "Set up in a stable position for the variation: hands on a wall, bench, floor, or handles as appropriate. Keep your body in one long line.", steps: ["Place hands a little wider than shoulder width unless the variation calls for a different hand position.", "Bend your elbows and lower your body or the weight smoothly.", "Press through your hands to return, stopping just before your elbows lock."], watch: "Keep your shoulders relaxed and avoid letting your lower back sag." },
  pull: { start: "Stand or sit tall, or hinge forward with a long back, depending on the equipment. Hold the band, handle, or weights securely.", steps: ["Let your arms reach comfortably without rounding your shoulders.", "Pull the handles or weights toward your body, guiding with your elbows where possible.", "Pause, then straighten your arms slowly to return to the start."], watch: "Keep your shoulders away from your ears and don't swing your body to move the weight." },
  plank: { start: "Set up on your hands or forearms with hands under shoulders, knees down or legs extended as comfortable.", steps: ["Make a steady line from your shoulders through your hips.", "Keep your middle gently braced while you hold or perform the named reach, tap, or leg movement.", "Move slowly, then reset your position before continuing."], watch: "Don't let your hips sag or lift high; use your knees down whenever you need." },
  abs: { start: "Lie on your back with knees bent unless the exercise is done standing. Keep your neck relaxed and breathe naturally.", steps: ["Gently tighten your middle as you begin the named leg, arm, or turning movement.", "Move only as far as you can while keeping control of your torso.", "Return slowly to the start, then alternate sides when the move calls for it."], watch: "Don't pull on your head or strain your neck; shorten the movement if your back feels uncomfortable." },
  cardio: { start: "Stand in a clear space with feet hip-width apart. For a machine, adjust it first and begin at an easy pace.", steps: ["Start with small, comfortable steps or movements.", "Continue the named march, hop, step, or machine motion at a pace where you can stay in control.", "Land softly or slow down gradually when the interval ends."], watch: "Choose the stepping or lower-impact option whenever jumping feels uncomfortable." },
  stretch: { start: "Settle into the position named by the movement, using a mat, chair, wall, or towel if helpful.", steps: ["Ease into the position slowly until you feel a gentle stretch or comfortable movement.", "Breathe steadily and hold or move gently for the interval.", "Come out slowly and change sides when the move calls for it."], watch: "A stretch should feel gentle, not sharp or forced. Don't bounce or hold your breath." },
  balance: { start: "Stand near a wall or sturdy chair. Set both feet on the floor and look at a steady point ahead.", steps: ["Shift your weight gradually onto one foot, keeping your body tall.", "Lift or place the other foot as the movement describes, using the support if helpful.", "Hold steadily, then lower with control and change sides."], watch: "Keep a hand near support and stop if you feel unsteady." },
  machine: { start: "Sit at the leg-curl machine and adjust the pads so they rest comfortably against your lower legs. Start with a light setting.", steps: ["Hold the handles and keep your hips against the seat.", "Bend your knees to bring the padded bar toward you.", "Pause, then straighten your legs slowly without locking your knees."], watch: "Keep the weight light enough to move smoothly; don't lift your hips off the seat." },
  carry: { start: "Stand with feet hip-width apart and hold the weight securely at your chest.", steps: ["Stand tall with your ribs comfortably over your hips.", "March in place, lifting one foot a small distance at a time.", "Set each foot down softly and keep alternating."], watch: "Avoid leaning back or letting the weight pull you forward." },
  circle: { start: "Stand tall and hold the kettlebell securely by its handles near your chest.", steps: ["Carefully guide the bell around your head in a small, slow circle.", "Keep it close enough to control and let your head stay facing forward.", "Continue in one direction, then reverse direction when prompted."], watch: "Use a light weight and keep the bell away from your head; skip this if your shoulders feel pinched." },
  burpee: { start: "Stand with feet about hip-width apart in a clear space.", steps: ["Bend your knees and place your hands on the floor or a sturdy raised surface.", "Step one foot back and then the other to a comfortable plank.", "Step your feet back in one at a time, then stand up. No jump is needed."], watch: "Move one step at a time and keep your back comfortable; use a raised surface to make it easier." },
  inchworm: { start: "Stand with feet hip-width apart and knees softly bent.", steps: ["Fold forward and place your hands on the floor in front of your feet.", "Walk your hands forward until you reach a comfortable high plank.", "Walk your hands back toward your feet and stand up slowly."], watch: "Bend your knees as much as needed and avoid forcing your hands to reach the floor." },
  swing: { start: "Stand with feet a little wider than hip-width apart and the kettlebell on the floor just in front of you. Use this move only if you have learned the swing; otherwise choose a deadlift.", steps: ["Hinge at your hips, bend your knees slightly, and hold the bell with both hands.", "Hike the bell back between your thighs, then stand tall by quickly straightening your hips.", "Let the bell float to about chest height, then guide it back between your legs as your hips hinge again."], watch: "Drive the movement from your hips rather than lifting with your arms. Keep your back long and stop if you feel pain." },
  thruster: { start: "Stand with feet about shoulder-width apart, holding light weights at shoulder height. You can do this without weights while learning.", steps: ["Bend your knees and hips into a comfortable squat.", "Stand up smoothly and use that momentum to press the weights overhead.", "Lower the weights back to your shoulders with control before the next squat."], watch: "Keep your ribs over your hips as you press; use a light load and skip the overhead press if it hurts." },
  suitcase: { start: "Stand tall with feet hip-width apart and hold one kettlebell or dumbbell by your side.", steps: ["Let your arm hang straight while keeping your shoulders level.", "Brace gently through your middle and hold still for the interval.", "Set the weight down carefully and switch hands when prompted."], watch: "Don't lean toward or away from the weight; keep breathing." },
  jumpSquat: { start: "Stand with feet about shoulder-width apart and toes slightly turned out.", steps: ["Lower into a small, comfortable squat.", "Press through your feet and make a small jump, or rise onto your toes without leaving the floor.", "Land softly with knees relaxed and settle before repeating."], watch: "Use the no-jump option if landing feels uncomfortable; keep each landing quiet and controlled." },
  rower: { start: "Sit on the rower, secure your feet, and hold the handle with arms relaxed. Set a light resistance.", steps: ["Push away with your legs first while keeping your arms long.", "When your legs are nearly straight, lean back slightly and draw the handle toward your lower ribs.", "Send your arms forward, tip forward from your hips, then bend your knees to return."], watch: "Keep the strokes smooth and in that order: legs, body, arms; then arms, body, legs." },
  calf: { start: "Stand near a wall or chair for balance with feet hip-width apart and weight spread across both feet.", steps: ["Rise onto the balls of your feet, lifting your heels smoothly.", "Pause briefly at the top.", "Lower your heels slowly back to the floor."], watch: "Keep your ankles from rolling outward and use support if your balance needs it." },
  wallSit: { start: "Stand with your back against a wall and feet a comfortable step in front of you.", steps: ["Slide down the wall a little, bending your knees to a comfortable angle.", "Keep your feet flat and hold the position while breathing normally.", "Press through your feet to slide back up when the interval ends."], watch: "You don't need to lower until your thighs are level; stop if your knees feel uncomfortable." },
  birdDog: { start: "Start on hands and knees with hands under shoulders and knees under hips.", steps: ["Gently brace your middle and keep your back steady.", "Reach one arm forward and the opposite leg back without lifting them too high.", "Return to hands and knees, then switch sides."], watch: "Keep your hips facing the floor and move slowly without arching your back." },
  superman: { start: "Lie face down with arms reaching forward and forehead facing the floor.", steps: ["Gently lift your hands and upper chest a small amount.", "Pause briefly while keeping your neck long.", "Lower back down slowly and relax before repeating."], watch: "Keep the lift small and comfortable; don't crank your neck upward." },
};

const byKey = new Map(Object.entries(groups).flatMap(([type, keys]) => keys.trim().split(/\s+/).map((key) => [key, guide[type]])));
byKey.set("kb-swing", guide.swing);
byKey.set("db-swing", guide.swing);
byKey.set("db-thruster", guide.thruster);
byKey.set("kb-suitcase", guide.suitcase);
byKey.set("farmer-hold", guide.suitcase);
byKey.set("squat-jump", guide.jumpSquat);
byKey.set("rower", guide.rower);
byKey.set("calf-raise", guide.calf);
byKey.set("standing-calf-raise", guide.calf);
byKey.set("wall-sit", guide.wallSit);
const aliases = {
  "jumping jacks": "cardio", "bodyweight squats": "squat", "push-ups": "push", "reverse lunges": "lunge",
  "mountain climbers": "plank", "high knees": "cardio", "goblet squat": "squat", "bent-over row": "pull",
  "shoulder press": "push", "romanian deadlift": "hinge", "weighted reverse lunge": "lunge", "forearm plank": "plank",
  "banded squat": "squat", "banded row": "pull", "banded pull-apart": "pull", "banded glute bridge": "bridge",
  "banded overhead press": "push", "banded good morning": "hinge", "kettlebell deadlift": "hinge", "kettlebell halo": "circle",
  "kettlebell swing": "hinge", "single-arm press": "push", "suitcase hold": "carry", "easy cardio warm-up": "cardio",
  "seated cable row": "pull", "chest press machine": "push", "plank": "plank", "overhead press": "push",
  "lateral raise": "pull", "rear-delt fly": "pull", "biceps curl": "pull", "hammer curl": "pull", "triceps extension": "push",
  "arm circles": "stretch", "incline push-ups": "push", "shoulder taps": "plank", "plank up-downs": "plank",
  "superman reach": "plank", "wall push-ups": "push", "band pull-apart": "pull", "band face pull": "pull",
  "band biceps curl": "pull", "band shoulder press": "push", "band triceps pressdown": "push", "band lateral raise": "pull",
  "glute bridge": "bridge", "side lunges": "lunge", "calf raises": "squat", "wall sit": "squat", "donkey kick": "bridge",
  "fire hydrant": "bridge", "banded clamshell": "bridge", "banded lateral walk": "bridge", "dumbbell glute bridge": "bridge", "weighted calf raise": "squat", "leg press": "squat",
  "sumo squat": "squat", "dead bug": "abs", "bird dog": "plank", "glute bridge march": "bridge",
  "side plank (knees down)": "plank", "bicycle crunch": "abs", "plank shoulder taps": "plank", "russian twist": "abs",
  "lying leg raises": "abs", "hollow hold": "abs", "plank jacks": "plank", "gentle neck rolls": "stretch",
  "cat-cow": "stretch", "child's pose": "stretch", "seated forward fold": "stretch", "figure-four stretch": "stretch",
  "supine twist": "stretch", "hip circles": "stretch", "world's greatest stretch": "stretch", "thoracic rotations": "stretch",
  "ankle rocks": "stretch", "standing quad stretch": "stretch", "deep squat hold": "squat", "march in place": "cardio",
  "step touch": "cardio", "arm swings": "stretch", "heel digs": "cardio", "side steps": "cardio", "shoulder rolls": "stretch",
  "marching": "cardio", "shoulder circles": "stretch", "gentle knee lifts": "cardio", "small step-out squats": "squat",
  "standing cross-crunch": "abs", "step jacks": "cardio", "kettlebell swing": "hinge",
};
export function exerciseInstructions(key, name) {
  if (byKey.has(key)) return byKey.get(key);
  const normalizedName = String(name || "").toLowerCase();
  const exactOverrides = { "kettlebell swing": guide.swing, "dumbbell swing": guide.swing, "calf raises": guide.calf, "weighted calf raise": guide.calf, "wall sit": guide.wallSit, "bird dog": guide.birdDog, "superman reach": guide.superman };
  if (exactOverrides[normalizedName]) return exactOverrides[normalizedName];
  const type = aliases[normalizedName];
  return type ? guide[type] : null;
}
