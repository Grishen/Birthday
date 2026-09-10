export default function BirthdayCake({ interactive = false, onBurst, className = "" }) {
  return (
    <button
      type="button"
      className={`birthday-cake ${className}`}
      onClick={onBurst}
      aria-label="Birthday cake"
      disabled={!interactive && !onBurst}
    >
      <svg viewBox="0 0 180 150" aria-hidden="true">
        <ellipse cx="90" cy="138" rx="58" ry="8" fill="rgba(0,0,0,0.28)" />
        <rect x="38" y="78" width="104" height="52" rx="12" fill="#3a3228" />
        <rect x="38" y="78" width="104" height="18" rx="10" fill="#d4b483" />
        <path d="M38 92c10-10 18 8 28 0 10-8 18 8 28 0 10-8 18 8 28 0 10-8 16 6 20 2v14H38z" fill="#f4ead8" />
        <rect x="48" y="54" width="84" height="36" rx="10" fill="#2a221c" />
        <path d="M48 68c8-8 14 6 22 0 9-7 14 7 22 0 8-7 14 7 22 0 6-5 12 4 18 2v16H48z" fill="#c4a07a" />
        <circle cx="64" cy="108" r="6" fill="#8a6a3a" />
        <circle cx="90" cy="114" r="5" fill="#d4b483" />
        <circle cx="116" cy="108" r="6" fill="#8a6a3a" />
        <path d="M64 108c0-6 6-8 6-12" stroke="#f4ead8" strokeWidth="1.4" fill="none" />
        <g className="candle" transform="translate(70 28)">
          <rect x="0" y="10" width="5" height="22" rx="1.5" fill="#f4ead8" />
          <ellipse className="cake-flame" cx="2.5" cy="6" rx="4" ry="7" fill="#ffb703" />
          <ellipse className="cake-flame inner" cx="2.5" cy="7" rx="2" ry="4" fill="#fff3bf" />
        </g>
        <g className="candle" transform="translate(88 22)">
          <rect x="0" y="10" width="5" height="26" rx="1.5" fill="#e8c9a0" />
          <ellipse className="cake-flame" cx="2.5" cy="6" rx="4.2" ry="7.5" fill="#fb8b24" />
          <ellipse className="cake-flame inner" cx="2.5" cy="7" rx="2" ry="4" fill="#fff3bf" />
        </g>
        <g className="candle" transform="translate(106 28)">
          <rect x="0" y="10" width="5" height="22" rx="1.5" fill="#f4ead8" />
          <ellipse className="cake-flame" cx="2.5" cy="6" rx="4" ry="7" fill="#ffb703" />
          <ellipse className="cake-flame inner" cx="2.5" cy="7" rx="2" ry="4" fill="#fff3bf" />
        </g>
        <path
          d="M90 96c0 0-7-4.5-7-9.2 0-2.7 2-4.6 4.4-4.6 1.5 0 2.6 1 2.6 1s1.1-1 2.6-1c2.4 0 4.4 1.9 4.4 4.6 0 4.7-7 9.2-7 9.2z"
          fill="#d4b483"
        />
      </svg>
    </button>
  );
}
