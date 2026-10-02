// The choices shown on the Preferences screen.
// "value" is what the app stores; "label" is what the user sees.
export const MOODS = [
  { value: "energy", label: "Need energy" },
  { value: "chill", label: "Feeling chill" },
  { value: "stressed", label: "Stressed" },
  { value: "bored", label: "Bored" },
  { value: "strong", label: "Feeling strong" },
  { value: "unwind", label: "Need to unwind" },
  { value: "surprise", label: "Surprise me" },
];

export const FOCUSES = [
  { value: "full", label: "Full body" },
  { value: "arms", label: "Arms & shoulders" },
  { value: "legs", label: "Legs & glutes" },
  { value: "core", label: "Core" },
  { value: "stretch", label: "Stretch & mobility" },
  { value: "light", label: "Light movement" },
  { value: "surprise", label: "Surprise me" },
];

export const LEVELS = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
  { value: "unsure", label: "Not sure" },
];

export const DURATIONS = [5, 10, 15, 20, 30, 45, 60];

export const EQUIPMENT = [
  { value: "none", label: "No equipment" },
  { value: "dumbbells", label: "Dumbbells" },
  { value: "bands", label: "Resistance bands" },
  { value: "kettlebell", label: "Kettlebell" },
  { value: "gym", label: "Gym access" },
  { value: "mat", label: "Exercise mat" },
  { value: "other", label: "Other / not listed" },
];

// Used when someone skips a question or presses Surprise Me.
export const DEFAULT_PREFS = {
  mood: "surprise",
  focus: "surprise",
  level: "unsure",
  duration: 15,
  equipment: ["none"],
  music: "",
};

export const MAX_MUSIC_LENGTH = 60;

export function labelFor(list, value) {
  const found = list.find((o) => o.value === value);
  return found ? found.label : value;
}
