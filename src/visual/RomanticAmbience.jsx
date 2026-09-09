import HeartMark from "./HeartMark";
import { Balloon, Flower, FlowerCluster, SparkleField } from "./Decor";

const WHISPERS = {
  blush: [
    { text: "always you", side: "left", top: "16%" },
    { text: "my favorite person", side: "right", top: "22%" },
    { text: "today & every day", side: "left", top: "38%" },
    { text: "I chose you", side: "right", top: "46%" },
    { text: "my favorite hello", side: "left", top: "64%" },
    { text: "♡ forever yours", side: "right", top: "74%" },
  ],
  night: [
    { text: "our little universe", side: "left", top: "16%" },
    { text: "wish on us", side: "right", top: "70%" },
  ],
  dark: [
    { text: "you + me", side: "left", top: "20%" },
    { text: "always", side: "right", top: "68%" },
  ],
};

const PETALS = [
  { left: "6%", delay: "0s", dur: "11s" },
  { left: "14%", delay: "-2s", dur: "13s" },
  { left: "23%", delay: "-4.2s", dur: "10s" },
  { left: "34%", delay: "-1s", dur: "14s" },
  { left: "44%", delay: "-6s", dur: "12s" },
  { left: "55%", delay: "-3.4s", dur: "11s" },
  { left: "66%", delay: "-7s", dur: "15s" },
  { left: "74%", delay: "-1.8s", dur: "10s" },
  { left: "83%", delay: "-5s", dur: "13s" },
  { left: "91%", delay: "-2.6s", dur: "12s" },
  { left: "18%", delay: "-8s", dur: "16s" },
  { left: "61%", delay: "-9s", dur: "14s" },
];

const HEARTS = [
  { left: "5%", top: "22%", size: 16, variant: "solid", color: "#d4b483" },
  { left: "11%", top: "48%", size: 12, variant: "outline", color: "#c4a07a" },
  { left: "7%", top: "74%", size: 18, variant: "glow", color: "#f0d8a6" },
  { right: "6%", top: "18%", size: 14, variant: "double", color: "#d4b483" },
  { right: "10%", top: "42%", size: 16, variant: "solid", color: "#b8ab96" },
  { right: "5%", top: "68%", size: 12, variant: "pale", color: "#3a3228" },
  { left: "16%", top: "12%", size: 10, variant: "outline", color: "#d4b483" },
  { right: "18%", top: "80%", size: 13, variant: "solid", color: "#8a6a3a" },
];

function CornerFlourish({ corner }) {
  return (
    <svg className={`corner-flourish ${corner}`} viewBox="0 0 140 140" aria-hidden="true">
      <path
        d="M12 128 C18 86 42 62 78 48 C52 58 40 82 38 118"
        fill="none"
        stroke="#8a7a55"
        strokeWidth="2.2"
      />
      <path d="M78 48 C92 22 118 18 128 12" fill="none" stroke="#8a7a55" strokeWidth="2" />
      <ellipse cx="52" cy="58" rx="11" ry="15" fill="#8a6a3a" transform="rotate(-24 52 58)" />
      <ellipse cx="64" cy="50" rx="10" ry="13" fill="#d4b483" transform="rotate(16 64 50)" />
      <ellipse cx="56" cy="46" rx="8" ry="11" fill="#6a4e28" transform="rotate(-8 56 46)" />
      <circle cx="58" cy="52" r="3.4" fill="#f0d8a6" />
      <ellipse cx="102" cy="28" rx="8" ry="11" fill="#c4a07a" transform="rotate(28 102 28)" />
      <ellipse cx="112" cy="22" rx="7" ry="10" fill="#d4b483" transform="rotate(-12 112 22)" />
      <circle cx="108" cy="24" r="2.6" fill="#f4ead8" />
      <circle cx="28" cy="96" r="5" fill="#b8ab96" />
      <circle cx="22" cy="102" r="5" fill="#c4a07a" />
      <circle cx="30" cy="104" r="5" fill="#d4b483" />
      <circle cx="26" cy="102" r="2.2" fill="#f4ead8" />
    </svg>
  );
}

export default function RomanticAmbience({
  mood = "blush",
  density = "airy",
  whispers = true,
  gardens = false,
}) {
  const notes = WHISPERS[mood] || WHISPERS.blush;
  const petalCount = density === "lush" ? PETALS.length : 8;
  const heartCount = density === "lush" ? HEARTS.length : 5;

  return (
    <div className={`romantic-ambience mood-${mood} density-${density}`} aria-hidden="true">
      <SparkleField count={density === "lush" ? 12 : 7} />
      <CornerFlourish corner="tl" />
      <CornerFlourish corner="tr" />
      <CornerFlourish corner="bl" />
      <CornerFlourish corner="br" />

      <div className="falling-petals">
        {PETALS.slice(0, petalCount).map((petal) => (
          <span
            key={`${petal.left}-${petal.delay}`}
            className="fall-petal"
            style={{
              left: petal.left,
              animationDelay: petal.delay,
              animationDuration: petal.dur,
            }}
          />
        ))}
      </div>

      {HEARTS.slice(0, heartCount).map((heart, i) => (
        <span
          key={`${heart.left || heart.right}-${heart.top}`}
          className="ambience-heart"
          style={{
            left: heart.left,
            right: heart.right,
            top: heart.top,
            animationDelay: `${-i * 0.7}s`,
          }}
        >
          <HeartMark size={heart.size} variant={heart.variant} color={heart.color} sparkle={i === 3} />
        </span>
      ))}

      {whispers &&
        notes.map((note) => (
          <p key={note.text} className={`whisper ${note.side}`} style={{ top: note.top }}>
            {note.text}
          </p>
        ))}

      <span className="watermark-heart left">♡</span>
      <span className="watermark-heart right">♡</span>

      {gardens && (
        <>
          <div className="side-garden left">
            <Balloon color="#ff8fab" size={52} tilt={-12} />
            <Flower type="rose" size={42} />
            <FlowerCluster />
            <Balloon color="#e8d5ff" size={38} tilt={-6} />
            <Flower type="daisy" size={32} />
            <Flower type="tiny" size={26} />
            <Balloon color="#ffd6e7" size={34} tilt={-8} />
          </div>
          <div className="side-garden right">
            <Balloon color="#fff8f0" size={48} tilt={10} />
            <Flower type="daisy" size={34} />
            <FlowerCluster />
            <Flower type="rose" size={40} />
            <Balloon color="#ff4d8d" size={42} tilt={8} />
            <Flower type="tiny" size={24} />
            <Balloon color="#ffc1dc" size={36} tilt={6} />
          </div>
        </>
      )}
    </div>
  );
}
