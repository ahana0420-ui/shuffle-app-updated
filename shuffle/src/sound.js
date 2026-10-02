let audioContext;
let lastSoundAt = 0;
let lastSoundKind;
let scheduledUntil = 0;
const activeSources = new Set();

// Tiny synthesized cues; create/resume audio only in response to a user action.
export function playSound(kind, enabled) {
  if (!enabled || typeof window === "undefined") return;
  try {
    const Audio = window.AudioContext || window.webkitAudioContext;
    if (!Audio) return;
    audioContext ||= new Audio();
    if (audioContext.state === "suspended") audioContext.resume().catch(() => {});
    const now = audioContext.currentTime;
    if (kind === lastSoundKind && now - lastSoundAt < 0.09) return;
    lastSoundAt = now;
    lastSoundKind = kind;
    const patterns = {
      shuffle: [[330, 0, .08], [495, .07, .09], [660, .15, .11]],
      start: [[440, 0, .12], [660, .1, .16]],
      transition: [[520, 0, .09]],
      complete: [[523, 0, .16], [659, .12, .16], [784, .24, .24]],
      timerTick: [[1450, 0, .025]],
      buzzer: [[185, 0, .18]],
    };
    const notes = patterns[kind] || [];
    const startAt = Math.max(now, scheduledUntil);
    for (const [frequency, delay, duration] of notes) {
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      const start = startAt + delay;
      oscillator.type = kind === "buzzer" ? "square" : "sine";
      oscillator.frequency.setValueAtTime(frequency, start);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(kind === "timerTick" ? 0.045 : kind === "buzzer" ? 0.065 : 0.11, start + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
      oscillator.connect(gain);
      gain.connect(audioContext.destination);
      activeSources.add(oscillator);
      oscillator.onended = () => activeSources.delete(oscillator);
      oscillator.start(start);
      oscillator.stop(start + duration);
    }
    if (notes.length) scheduledUntil = startAt + Math.max(...notes.map(([, delay, duration]) => delay + duration));
  } catch {
    // Audio is optional; unsupported or blocked audio never interrupts a workout.
  }
}

export function stopSounds() {
  for (const source of activeSources) {
    try { source.stop(); } catch { /* it may have ended already */ }
  }
  activeSources.clear();
  if (audioContext) scheduledUntil = audioContext.currentTime;
}
