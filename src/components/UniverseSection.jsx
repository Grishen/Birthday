import { useState } from "react";
import { birthdayConfig } from "../data/birthdayConfig";
import HeartMark from "../visual/HeartMark";
import TeddyBears from "./TeddyBears";

const HEART_PATH =
  "M50 78 C50 78 18 56 18 36 C18 24 28 18 38 18 C44 18 50 24 50 24 S56 18 62 18 C72 18 82 24 82 36 C82 56 50 78 50 78";

export default function UniverseSection({ onFind }) {
  const [active, setActive] = useState(null);
  const [seen, setSeen] = useState([]);
  const [shots, setShots] = useState([]);
  const stars = birthdayConfig.universeMessages;
  const star = stars.find((item) => item.id === active);
  const points = stars.map((item) => `${item.x},${item.y}`).join(" ");
  const wishes = birthdayConfig.play.wishing;
  const complete = seen.length === stars.length;

  const openStar = (id) => {
    setActive(id);
    if (!seen.includes(id)) {
      setSeen((current) => [...current, id]);
      onFind?.("stars", id);
    }
  };

  const onSky = (event) => {
    if (event.target.closest(".sky-star, .star-popup")) return;
    const box = event.currentTarget.getBoundingClientRect();
    const shot = {
      id: `${Date.now()}-${Math.random()}`,
      x: ((event.clientX - box.left) / box.width) * 100,
      y: ((event.clientY - box.top) / box.height) * 100,
      wish: wishes[Math.floor(Math.random() * wishes.length)],
    };
    setShots((current) => [...current.slice(-6), shot]);
    setActive(null);
    window.setTimeout(() => {
      setShots((current) => current.filter((item) => item.id !== shot.id));
    }, 1600);
  };

  return (
    <section className={`section chapter-stage universe-section ${complete ? "is-complete" : ""}`}>
      <div className="chapter-head">
        <p className="chapter-kicker">LOOK UP</p>
        <h2 className="serif-title">{birthdayConfig.universeHeading.replace(" ✨", "")}</h2>
        <p className="body-copy">
          {complete ? birthdayConfig.play.skyComplete : birthdayConfig.play.skyHint}
        </p>
      </div>
      <div
        className={`universe-sky living-sky ${complete ? "is-constellation" : ""}`}
        style={{ marginTop: 24 }}
        onClick={onSky}
      >
        <svg className="constellation-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <polyline
            className={seen.length || shots.length ? "is-lit" : ""}
            points={points}
            fill="none"
            stroke="rgba(255,214,231,0.35)"
            strokeWidth="0.4"
          />
          <path className={`us-heart ${complete ? "is-drawn" : ""}`} d={HEART_PATH} />
        </svg>
        {stars.map((item) => (
          <button
            key={item.id}
            className={`sky-star ${active === item.id ? "active" : ""} ${seen.includes(item.id) ? "is-seen" : ""}`}
            type="button"
            style={{ left: `${item.x}%`, top: `${item.y}%` }}
            onClick={() => openStar(item.id)}
            aria-label={item.title}
          >
            <HeartMark size={18} color="#f0d8a6" sparkle={item.id === "star-3" || complete} />
          </button>
        ))}
        {shots.map((shot) => (
          <span key={shot.id} className="shooting-star" style={{ left: `${shot.x}%`, top: `${shot.y}%` }}>
            <span className="shooting-tail" />
            <em>{shot.wish}</em>
          </span>
        ))}
        {star && (
          <div className="star-popup" role="dialog">
            <h3>{star.title}</h3>
            <p>{star.body}</p>
            <button type="button" onClick={() => setActive(null)}>
              Keep this
            </button>
            <span className="popup-hearts" aria-hidden="true">
              <HeartMark size={12} color="#d4b483" />
              <HeartMark size={10} color="#f0d8a6" />
            </span>
          </div>
        )}
        {complete && !star && <p className="sky-us">us</p>}
      </div>
      <p className="universe-count">
        {seen.length} of {stars.length} little pieces found
      </p>
      <div className="universe-bears">
        <TeddyBears pose="sleep" variant="pair" />
      </div>
    </section>
  );
}
