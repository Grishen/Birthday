import { useEffect, useState } from "react";
import { HEART_D } from "../visual/tokens";

const CREAM = {
  fur: "#F6E6D2",
  deep: "#E8D0B6",
  snout: "#FFF8F0",
};
const BROWN = {
  fur: "#C9A07A",
  deep: "#B08963",
  snout: "#F7E8D6",
};

function Bear({
  palette,
  who,
  x,
  expression = "idle",
  holding = "none",
}) {
  const sleep = expression === "sleep";
  const surprised = expression === "surprised";
  const shy = expression === "shy";

  return (
    <g className={`bear ${who}`} transform={`translate(${x} 10)`}>
      <ellipse cx="70" cy="176" rx="34" ry="7" fill="rgba(92,42,61,0.14)" />
      <g className="bear-ear left">
        <circle cx="30" cy="40" r="18" fill={palette.fur} />
        <circle cx="30" cy="40" r="10" fill="#F4B3C4" />
      </g>
      <g className="bear-ear right">
        <circle cx="110" cy="40" r="18" fill={palette.fur} />
        <circle cx="110" cy="40" r="10" fill="#F4B3C4" />
      </g>
      <ellipse className="bear-body" cx="70" cy="148" rx="30" ry="26" fill={palette.fur} />
      <g className="bear-arm left">
        <ellipse cx="38" cy="146" rx="11" ry="17" fill={palette.deep} />
        <ellipse cx="36" cy="160" rx="8" ry="7" fill="#F4B3C4" opacity="0.85" />
      </g>
      <g className="bear-arm right">
        <ellipse cx="102" cy="146" rx="11" ry="17" fill={palette.deep} />
        <ellipse cx="104" cy="160" rx="8" ry="7" fill="#F4B3C4" opacity="0.85" />
      </g>
      <ellipse cx="54" cy="170" rx="13" ry="9" fill={palette.deep} />
      <ellipse cx="86" cy="170" rx="13" ry="9" fill={palette.deep} />
      <g className="bear-head">
        <circle cx="70" cy="72" r="50" fill={palette.fur} />
        <ellipse cx="70" cy="90" rx="24" ry="18" fill={palette.snout} />
        <ellipse cx="70" cy="84" rx="7" ry="5.5" fill="#5C2A3D" />
        <ellipse cx="67" cy="82" rx="1.6" ry="1.1" fill="#fff" opacity="0.7" />
        {sleep ? (
          <>
            <path d="M52 70 Q58 64 64 70" fill="none" stroke="#3B1830" strokeWidth="2.2" strokeLinecap="round" />
            <path d="M76 70 Q82 64 88 70" fill="none" stroke="#3B1830" strokeWidth="2.2" strokeLinecap="round" />
          </>
        ) : (
          <g className="bear-eyes">
            <ellipse cx="52" cy="68" rx={surprised ? 6.4 : 5} ry={surprised ? 8 : 6.2} fill="#3B1830" />
            <ellipse cx="88" cy="68" rx={surprised ? 6.4 : 5} ry={surprised ? 8 : 6.2} fill="#3B1830" />
            <circle cx="53.8" cy="65.5" r="1.7" fill="#fff" />
            <circle cx="89.8" cy="65.5" r="1.7" fill="#fff" />
          </g>
        )}
        {surprised ? (
          <ellipse cx="70" cy="98" rx="5" ry="4" fill="#5C2A3D" />
        ) : sleep ? (
          <path d="M64 98 Q70 101 76 98" fill="none" stroke="#C9184A" strokeWidth="1.8" strokeLinecap="round" />
        ) : (
          <path d="M62 98 Q70 106 78 98" fill="none" stroke="#C9184A" strokeWidth="2" strokeLinecap="round" />
        )}
        <ellipse cx="42" cy="86" rx="9" ry="6" fill="#F5AFC0" opacity="0.72" />
        <ellipse cx="98" cy="86" rx="9" ry="6" fill="#F5AFC0" opacity="0.72" />
        {shy && <ellipse className="paw-cover" cx="58" cy="88" rx="16" ry="14" fill={palette.fur} />}
      </g>
      {holding === "cake" && (
        <g className="held hero-cake" transform="translate(96 118) scale(0.72)">
          <rect x="0" y="14" width="36" height="20" rx="5" fill="#fff8f0" />
          <path d="M0 20c6-6 10 4 16 0 6-4 10 4 16 0 2-1 4 2 4 2v12H0z" fill="#ffc1dc" />
          <rect x="15" y="4" width="4" height="12" fill="#fff6ea" />
          <ellipse className="cake-flame" cx="17" cy="3" rx="4" ry="6" fill="#ffb703" />
        </g>
      )}
      {holding === "gift" && (
        <g className="held" transform="translate(96 126)">
          <rect x="0" y="8" width="28" height="22" rx="4" fill="#ff6b9d" />
          <rect x="-2" y="2" width="32" height="10" rx="3" fill="#ff8fab" />
          <rect x="12" y="2" width="5" height="28" fill="#fff0f6" />
          <path d="M14 0 q-8 4 -8 10 h8" fill="#fff0f6" />
          <path d="M19 0 q8 4 8 10 h-8" fill="#ffe4ef" />
        </g>
      )}
      {holding === "letter" && (
        <g className="held" transform="translate(94 124)">
          <rect x="0" y="6" width="34" height="22" rx="3" fill="#fff8f0" stroke="#e8d0b6" />
          <path d="M0 6 L17 20 L34 6" fill="none" stroke="#c9184a" strokeWidth="1.5" />
          <circle cx="17" cy="18" r="4" fill="#ff4d8d" />
        </g>
      )}
      {holding === "heart" && (
        <g className="held held-mini" transform="translate(96 128) scale(0.28)">
          <path d={HEART_D} fill="#FF4D8D" />
        </g>
      )}
    </g>
  );
}

function SharedHeart({ charged = false }) {
  return (
    <g className={`shared-heart ${charged ? "charged" : ""}`} transform="translate(120 96)">
      <g transform="scale(0.72)">
        <path d={HEART_D} fill="#FF4D8D" />
        <path d={HEART_D} fill="none" stroke="#fff8f0" strokeWidth="2" opacity="0.4" />
      </g>
    </g>
  );
}

export default function TeddyBears({
  pose = "idle",
  variant = "pair",
  charged = false,
  onBearClick,
  className = "",
}) {
  const [moment, setMoment] = useState("");

  useEffect(() => {
    if (pose !== "idle" && pose !== "heart") return undefined;
    const id = window.setInterval(() => {
      if (Math.random() > 0.48) {
        setMoment("glance");
        window.setTimeout(() => setMoment("smile"), 800);
        window.setTimeout(() => setMoment("pop"), 1300);
        window.setTimeout(() => setMoment(""), 2400);
      }
    }, 7600);
    return () => window.clearInterval(id);
  }, [pose]);

  const mapped = variant === "login" && pose === "idle" ? "heart" : pose;
  const scene = mapped === "idle" && variant === "hero" ? "birthday" : mapped;
  const hug = scene === "hug" || variant === "finale";
  const sleep = scene === "sleep";
  const letter = scene === "letter" || variant === "letter";
  const present = scene === "present" || variant === "present";
  const birthday = scene === "birthday" || variant === "hero";

  let creamHold = "none";
  let brownHold = "none";
  if (birthday) creamHold = "cake";
  if (birthday) brownHold = "heart";
  if (present) brownHold = "gift";
  if (letter) creamHold = "letter";

  const creamExpr =
    scene === "surprised" ? "surprised" : scene === "shy" ? "shy" : sleep ? "sleep" : "idle";
  const brownExpr = scene === "surprised" ? "surprised" : sleep ? "sleep" : "idle";

  return (
    <div className={`teddy-stage ${className}`}>
      <svg
        className={`teddy-svg teddy-pair ${scene} ${variant} ${moment} ${hug ? "hug" : ""}`}
        viewBox="0 0 340 200"
        role="img"
        aria-label="A cream teddy bear and a brown teddy bear"
        onClick={onBearClick}
        onMouseEnter={(event) => event.currentTarget.parentElement?.classList.add("is-hover")}
        onMouseLeave={(event) => event.currentTarget.parentElement?.classList.remove("is-hover")}
      >
        <Bear
          who="cream-bear"
          palette={CREAM}
          x={hug ? 28 : scene === "shy" ? 72 : 8}
          expression={creamExpr}
          holding={creamHold}
        />
        <Bear
          who="brown-bear"
          palette={BROWN}
          x={hug ? 138 : 168}
          expression={brownExpr}
          holding={brownHold}
        />
        {(variant === "login" || scene === "heart") && <SharedHeart charged={charged} />}
        {variant === "finale" && (
          <g className="shared-heart" transform="translate(122 88) scale(0.55)">
            <path d={HEART_D} fill="#FF4D8D" opacity="0.95" />
          </g>
        )}
        {moment === "pop" && (
          <g className="idle-pop" transform="translate(148 70) scale(0.18)">
            <path d={HEART_D} fill="#FF8FAB" />
          </g>
        )}
      </svg>
    </div>
  );
}
