import HeartMark from "../visual/HeartMark";

const HEARTS = [
  { left: "8%", delay: "0s", size: 22 },
  { left: "22%", delay: "0.08s", size: 16 },
  { left: "36%", delay: "0.04s", size: 28 },
  { left: "48%", delay: "0.12s", size: 18 },
  { left: "61%", delay: "0.02s", size: 24 },
  { left: "74%", delay: "0.1s", size: 14 },
  { left: "88%", delay: "0.06s", size: 26 },
  { left: "14%", delay: "0.16s", size: 12 },
  { left: "55%", delay: "0.18s", size: 20 },
  { left: "80%", delay: "0.14s", size: 15 },
];

export default function SceneWipe({ kind }) {
  return (
    <div className={`scene-wipe wipe-${kind}`} aria-hidden="true">
      {kind === "hearts" &&
        HEARTS.map((heart) => (
          <span
            key={`${heart.left}-${heart.delay}`}
            className="wipe-heart"
            style={{ left: heart.left, animationDelay: heart.delay }}
          >
            <HeartMark size={heart.size} color="#d4b483" />
          </span>
        ))}
      {kind === "iris" && (
        <span className="wipe-iris-heart">
          <HeartMark size={220} color="#d4b483" />
        </span>
      )}
      {kind === "envelope" && (
        <div className="wipe-envelope">
          <span className="wipe-flap" />
          <span className="wipe-pocket" />
          <span className="wipe-seal" />
        </div>
      )}
      {kind === "night" && (
        <>
          <span className="wipe-star a" />
          <span className="wipe-star b" />
          <span className="wipe-star c" />
          <span className="wipe-star d" />
          <span className="wipe-star e" />
        </>
      )}
      {kind === "shutter" && (
        <>
          <span className="wipe-panel top" />
          <span className="wipe-panel bottom" />
        </>
      )}
      {kind === "ribbon" && (
        <>
          <span className="wipe-ribbon v" />
          <span className="wipe-ribbon h" />
        </>
      )}
      {kind === "petals" &&
        Array.from({ length: 14 }, (_, i) => (
          <span key={i} className={`wipe-petal p${i % 7}`} style={{ left: `${6 + i * 6.6}%`, animationDelay: `${i * 0.04}s` }} />
        ))}
    </div>
  );
}
