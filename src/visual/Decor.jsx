export function Sparkle({ className = "", delay = 0, size = 18 }) {
  return (
    <svg
      className={`sparkle-mark ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      style={{ animationDelay: `${delay}s` }}
    >
      <path
        d="M12 1.5l1.7 7.2L21 12l-7.3 3.3L12 22.5l-1.7-7.2L3 12l7.3-3.3z"
        fill="#fff8f0"
      />
    </svg>
  );
}

export function Flower({ type = "rose", size = 28, className = "" }) {
  if (type === "daisy") {
    return (
      <svg className={className} width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
          <ellipse
            key={deg}
            cx="24"
            cy="14"
            rx="5"
            ry="10"
            fill="#f4ead8"
            stroke="#d4b483"
            transform={`rotate(${deg} 24 24)`}
          />
        ))}
        <circle cx="24" cy="24" r="6" fill="#f4c95d" />
      </svg>
    );
  }
  if (type === "tiny") {
    return (
      <svg className={className} width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
        <circle cx="16" cy="12" r="6" fill="#d4b483" />
        <circle cx="10" cy="18" r="6" fill="#b8ab96" />
        <circle cx="22" cy="18" r="6" fill="#c4a07a" />
        <circle cx="16" cy="18" r="3.2" fill="#f4ead8" />
        <path d="M16 21 v8" stroke="#8fbf7a" strokeWidth="2" />
      </svg>
    );
  }
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 52 56" aria-hidden="true">
      <path d="M26 52c0 0-2-14 0-22 4 2 8 8 8 14" fill="#8fbf7a" />
      <ellipse cx="26" cy="22" rx="11" ry="14" fill="#8a6a3a" />
      <ellipse cx="16" cy="26" rx="10" ry="13" fill="#6a4e28" transform="rotate(-28 16 26)" />
      <ellipse cx="36" cy="26" rx="10" ry="13" fill="#6a4e28" transform="rotate(28 36 26)" />
      <ellipse cx="20" cy="16" rx="9" ry="12" fill="#d4b483" transform="rotate(-18 20 16)" />
      <ellipse cx="32" cy="16" rx="9" ry="12" fill="#d4b483" transform="rotate(18 32 16)" />
      <circle cx="26" cy="22" r="4" fill="#f4c95d" />
    </svg>
  );
}

export function Cloud({ className = "", delay = 0 }) {
  return (
    <svg
      className={`dream-cloud ${className}`}
      viewBox="0 0 160 70"
      aria-hidden="true"
      style={{ animationDelay: `${delay}s` }}
    >
      <g fill="#fff8f0" opacity="0.78">
        <ellipse cx="52" cy="40" rx="34" ry="20" />
        <ellipse cx="86" cy="32" rx="30" ry="22" />
        <ellipse cx="118" cy="42" rx="26" ry="16" />
        <ellipse cx="36" cy="46" rx="20" ry="12" />
      </g>
    </svg>
  );
}

export function Balloon({ color = "#ff8fab", size = 46, tilt = -8, className = "" }) {
  return (
    <svg
      className={`balloon-mark ${className}`}
      width={size}
      height={size * 1.85}
      viewBox="0 0 60 110"
      aria-hidden="true"
      style={{ transform: `rotate(${tilt}deg)` }}
    >
      <path d="M30 78 Q31 88 30 108" fill="none" stroke="#c9a07a" strokeWidth="1.3" />
      <ellipse cx="30" cy="38" rx="22" ry="30" fill={color} />
      <ellipse cx="22" cy="28" rx="7" ry="12" fill="#fff" opacity="0.28" />
      <path d="M30 68 l-5 8 h10z" fill={color} />
    </svg>
  );
}

export function RibbonBow({ size = 36 }) {
  return (
    <svg width={size} height={size * 0.7} viewBox="0 0 64 40" aria-hidden="true">
      <path d="M32 18 L8 8 Q18 20 32 22 Q18 24 8 34 Z" fill="#fff0f6" />
      <path d="M32 18 L56 8 Q46 20 32 22 Q46 24 56 34 Z" fill="#ffe4ef" />
      <circle cx="32" cy="20" r="6" fill="#ff4d8d" />
    </svg>
  );
}

export function FlowerCluster({ className = "" }) {
  return (
    <div className={`flower-cluster ${className}`} aria-hidden="true">
      <Flower type="rose" size={34} />
      <Flower type="daisy" size={26} />
      <Flower type="tiny" size={22} />
    </div>
  );
}

export function SparkleField({ count = 6 }) {
  const items = Array.from({ length: count }, (_, i) => ({
    left: `${8 + ((i * 17) % 84)}%`,
    top: `${12 + ((i * 23) % 70)}%`,
    delay: i * 0.45,
    size: 10 + (i % 3) * 4,
  }));
  return (
    <div className="sparkle-field" aria-hidden="true">
      {items.map((item) => (
        <span key={item.left + item.top} style={{ left: item.left, top: item.top }}>
          <Sparkle delay={item.delay} size={item.size} />
        </span>
      ))}
    </div>
  );
}

export function CloudBand() {
  return (
    <div className="cloud-band" aria-hidden="true">
      <Cloud className="c1" delay={0} />
      <Cloud className="c2" delay={-6} />
      <Cloud className="c3" delay={-12} />
    </div>
  );
}

export function BalloonFrame({ compact = false }) {
  const balloons = compact
    ? [
        { color: "#ff8fab", left: "-6%", top: "12%", tilt: -12, size: 42 },
        { color: "#fff8f0", right: "-4%", top: "18%", tilt: 10, size: 38 },
        { color: "#e8d5ff", left: "4%", bottom: "8%", tilt: -6, size: 32 },
      ]
    : [
        { color: "#ff8fab", left: "-2%", top: "8%", tilt: -14, size: 58 },
        { color: "#fff8f0", left: "4%", top: "22%", tilt: -6, size: 44 },
        { color: "#c9184a", right: "-1%", top: "10%", tilt: 12, size: 54 },
        { color: "#e8d5ff", right: "5%", top: "28%", tilt: 7, size: 40 },
        { color: "#ffd6e7", left: "-3%", bottom: "18%", tilt: -8, size: 36 },
        { color: "#ff4d8d", right: "-2%", bottom: "14%", tilt: 9, size: 42 },
      ];
  return (
    <div className="balloon-frame" aria-hidden="true">
      {balloons.map((b, i) => (
        <span
          key={i}
          className="balloon-slot"
          style={{
            left: b.left,
            right: b.right,
            top: b.top,
            bottom: b.bottom,
            animationDelay: `${-i * 0.8}s`,
          }}
        >
          <Balloon color={b.color} tilt={b.tilt} size={b.size} />
        </span>
      ))}
    </div>
  );
}
