// The crossing-arrows emblem from the Home design. When "spin" is true it rotates (Shuffling screen).
export default function HeroArt() {
  return (
    <svg viewBox="0 0 500 500" role="img" aria-label="Two crossing shuffle arrows">
      <defs>
        <pattern id="pinkLines" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="14" stroke="#fff" strokeWidth="4.5" opacity=".5" />
        </pattern>
        <pattern id="blueDots" width="16" height="16" patternUnits="userSpaceOnUse">
          <circle cx="8" cy="8" r="3.5" fill="#00F5FF" opacity=".85" />
        </pattern>
      </defs>
      <circle cx="250" cy="250" r="210" fill="none" stroke="#0A0A0A" strokeOpacity=".35" strokeWidth="4" strokeDasharray="12 10" />
      <circle cx="250" cy="250" r="190" fill="none" stroke="#FF007A" strokeOpacity=".6" strokeWidth="4.5" strokeDasharray="6 6" />
      <circle cx="90" cy="250" r="8" fill="#0A0A0A" />
      <circle cx="425" cy="240" r="10" fill="#00F5FF" stroke="#0A0A0A" strokeWidth="3.5" />
      <polygon points="410,75 425,50 435,75 460,85 435,95 425,120 415,95 390,85" fill="#FFE500" stroke="#0A0A0A" strokeWidth="4" strokeLinejoin="round" />
      <polygon points="65,400 78,380 88,400 110,410 88,420 78,440 68,420 45,410" fill="#FF007A" stroke="#0A0A0A" strokeWidth="4" strokeLinejoin="round" />

      {/* Blue ribbon */}
      <path d="M 65 145 C 160 145, 180 355, 365 355" fill="none" stroke="#0A0A0A" strokeWidth="68" strokeLinecap="round" />
      <path d="M 65 145 C 160 145, 180 355, 365 355" fill="none" stroke="#1E2FFF" strokeWidth="50" strokeLinecap="round" />
      <path d="M 65 145 C 160 145, 180 355, 365 355" fill="none" stroke="url(#blueDots)" strokeWidth="50" strokeLinecap="round" />
      <path d="M 75 137 C 165 137, 183 347, 365 347" fill="none" stroke="#00F5FF" strokeWidth="9" strokeLinecap="round" />
      <g transform="translate(355 355)">
        <polygon points="-5,-46 68,0 -5,46" fill="#0A0A0A" transform="translate(6 6)" />
        <polygon points="-5,-46 68,0 -5,46" fill="#0A0A0A" />
        <polygon points="2,-32 54,0 2,32" fill="#1E2FFF" />
        <polygon points="6,-24 45,0 6,24" fill="#00F5FF" />
      </g>
      <circle cx="65" cy="145" r="32" fill="#0A0A0A" />
      <circle cx="65" cy="145" r="24" fill="#FFE500" stroke="#0A0A0A" strokeWidth="5" />
      <circle cx="65" cy="145" r="10" fill="#0A0A0A" />

      {/* Pink ribbon */}
      <path d="M 65 355 C 160 355, 180 145, 365 145" fill="none" stroke="#0A0A0A" strokeWidth="74" strokeLinecap="round" />
      <path d="M 65 355 C 160 355, 180 145, 365 145" fill="none" stroke="#FF007A" strokeWidth="50" strokeLinecap="round" />
      <path d="M 65 355 C 160 355, 180 145, 365 145" fill="none" stroke="url(#pinkLines)" strokeWidth="50" strokeLinecap="round" />
      <path d="M 75 363 C 165 363, 183 153, 365 153" fill="none" stroke="#fff" strokeWidth="9" strokeLinecap="round" />
      <g transform="translate(355 145)">
        <polygon points="-5,-46 68,0 -5,46" fill="#0A0A0A" transform="translate(6 6)" />
        <polygon points="-5,-46 68,0 -5,46" fill="#0A0A0A" />
        <polygon points="2,-32 54,0 2,32" fill="#FF007A" />
        <polygon points="6,-24 45,0 6,24" fill="#fff" />
      </g>
      <circle cx="65" cy="355" r="32" fill="#0A0A0A" />
      <circle cx="65" cy="355" r="24" fill="#fff" stroke="#0A0A0A" strokeWidth="5" />
      <circle cx="65" cy="355" r="10" fill="#FF007A" />

      <circle cx="250" cy="250" r="18" fill="#0A0A0A" />
      <circle cx="250" cy="250" r="12" fill="#FFE500" />
      <circle cx="250" cy="250" r="5" fill="#0A0A0A" />
    </svg>
  );
}
