import Icon from "./Icon.jsx";

export default function SafetyNote() {
  return (
    <div className="safety" role="note">
      <Icon name="heart" size={20} />
      <span>
        <b>Move your way.</b> Choose an intensity that feels comfortable, adapt or skip any
        movement, and stop if something hurts. SHUFFLE is for inspiration, not medical advice.
      </span>
    </div>
  );
}
