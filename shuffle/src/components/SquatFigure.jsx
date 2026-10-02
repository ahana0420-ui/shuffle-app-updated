import { useEffect, useRef } from "react";

// Animated stick-figure squat (styled like the Stitch Active Workout design).
// Uses SVG animation so the feet stay planted on the ground line.
const T = "0;0.4;0.55;0.9;1";
export default function SquatFigure({ paused }) {
  const ref = useRef(null);
  useEffect(() => {
    const svg = ref.current;
    if (!svg || !svg.pauseAnimations) return;
    if (paused) svg.pauseAnimations();
    else svg.unpauseAnimations();
  }, [paused]);

  const legs = (hipX, kneeStand, kneeSquat, footX, color) => (
    <g>
      <polyline fill="none" stroke={color} strokeWidth="7" strokeLinecap="round" points={`${hipX},126 ${kneeStand},183`}>
        <animate attributeName="points" dur="3.2s" repeatCount="indefinite" keyTimes={T}
          values={`${hipX},126 ${kneeStand},183;${hipX},170 ${kneeSquat},190;${hipX},170 ${kneeSquat},190;${hipX},126 ${kneeStand},183;${hipX},126 ${kneeStand},183`} />
      </polyline>
      <polyline fill="none" stroke="#0A0A0A" strokeWidth="5.5" strokeLinecap="round" points={`${kneeStand},183 ${footX},238`}>
        <animate attributeName="points" dur="3.2s" repeatCount="indefinite" keyTimes={T}
          values={`${kneeStand},183 ${footX},238;${kneeSquat},190 ${footX},238;${kneeSquat},190 ${footX},238;${kneeStand},183 ${footX},238;${kneeStand},183 ${footX},238`} />
      </polyline>
      <path d={`M ${footX - 12} 240 L ${footX + 12} 240`} stroke="#0A0A0A" strokeWidth="6" strokeLinecap="square" />
    </g>
  );

  return (
    <svg ref={ref} viewBox="0 0 200 260" width="220" height="286" role="img" aria-label="Animated stick figure doing a squat">
      <line x1="20" y1="243" x2="180" y2="243" stroke="#0A0A0A" strokeWidth="4" strokeLinecap="square" />
      {legs(94, 88, 62, 76, "#FF007A")}
      {legs(106, 112, 138, 124, "#FF007A")}
      <g>
        <animateTransform attributeName="transform" type="translate" dur="3.2s" repeatCount="indefinite"
          keyTimes={T} values="0 0;0 44;0 44;0 0;0 0" />
        <circle cx="100" cy="46" r="18" fill="#FFE500" stroke="#0A0A0A" strokeWidth="3.5" />
        <circle cx="108" cy="42" r="3" fill="#0A0A0A" />
        <path d="M 96 32 C 102 24 116 26 118 34" stroke="#FF007A" strokeWidth="3" strokeLinecap="round" fill="none" />
        <path d="M 86 64 L 114 64 L 110 125 L 90 125 Z" fill="#1E2FFF" stroke="#0A0A0A" strokeWidth="3.5" />
        <path d="M 92 74 L 62 92 L 44 90" stroke="#0A0A0A" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <circle cx="42" cy="90" r="5" fill="#FFE500" stroke="#0A0A0A" strokeWidth="2" />
        <circle cx="100" cy="126" r="6" fill="#0A0A0A" />
      </g>
    </svg>
  );
}
