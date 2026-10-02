// Small inline icons (so the app needs no icon font or external files).
const PATHS = {
  shuffle: <><path d="M16 3h5v5" /><path d="M4 20L21 3" /><path d="M21 16v5h-5" /><path d="M15 15l6 6" /><path d="M4 4l5 5" /></>,
  arrow: <><path d="M5 12h14" /><path d="M13 6l6 6-6 6" /></>,
  tune: <><path d="M4 7h10" /><path d="M18 7h2" /><circle cx="16" cy="7" r="2" /><path d="M4 17h2" /><path d="M10 17h10" /><circle cx="8" cy="17" r="2" /></>,
  check: <path d="M5 12l5 5L20 7" />,
  play: <path d="M7 4l13 8-13 8z" />,
  pause: <><path d="M8 4v16" /><path d="M16 4v16" /></>,
  prev: <><path d="M6 5v14" /><path d="M19 5L9 12l10 7z" /></>,
  next: <><path d="M18 5v14" /><path d="M5 5l10 7-10 7z" /></>,
  flag: <><path d="M5 21V4" /><path d="M5 4h13l-3 4 3 4H5" /></>,
  home: <><path d="M3 11l9-8 9 8" /><path d="M5 10v10h14V10" /></>,
  close: <><path d="M6 6l12 12" /><path d="M18 6L6 18" /></>,
  heart: <path d="M12 21C5 15 3 11 3 8a4.5 4.5 0 0 1 9-1 4.5 4.5 0 0 1 9 1c0 3-2 7-9 13z" />,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  bolt: <path d="M13 2L4 14h7l-1 8 9-12h-7z" />,
};

export default function Icon({ name, size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {PATHS[name]}
    </svg>
  );
}
