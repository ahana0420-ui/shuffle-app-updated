export default function SoundToggle({ enabled, onToggle }) {
  return (
    <button className="btn btn-sm" type="button" aria-pressed={enabled} onClick={onToggle}>
      Sound {enabled ? "on" : "off"}
    </button>
  );
}
