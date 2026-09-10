import { useRef, useState } from "react";
import { birthdayConfig } from "../data/birthdayConfig";
import { GlowHeartBackdrop } from "../visual/HeartMark";
import { SparkleField } from "../visual/Decor";

export default function HeartInteraction({ onBurst, onFind }) {
  const [message, setMessage] = useState("");
  const [pulse, setPulse] = useState(false);
  const [kisses, setKisses] = useState(0);
  const [floaters, setFloaters] = useState([]);
  const lastIndex = useRef(-1);
  const messages = birthdayConfig.heartTap.messages;
  const usLines = birthdayConfig.usLines || [];

  const tap = (event) => {
    let next = Math.floor(Math.random() * messages.length);
    if (messages.length > 1 && next === lastIndex.current) {
      next = (next + 1) % messages.length;
    }
    lastIndex.current = next;
    const text = messages[next];
    setMessage(text);
    setPulse(true);
    setKisses((count) => count + 1);
    const floater = {
      id: `${Date.now()}-${Math.random()}`,
      text,
      x: event.clientX,
      y: event.clientY,
    };
    setFloaters((current) => [...current.slice(-5), floater]);
    window.setTimeout(() => setPulse(false), 560);
    window.setTimeout(() => {
      setFloaters((current) => current.filter((item) => item.id !== floater.id));
    }, 1400);
    if (navigator.vibrate) navigator.vibrate(18);
    onBurst?.();
    onFind?.("heart");
  };

  const usLine = kisses >= 3 && usLines.length ? usLines[(kisses - 3) % usLines.length] : "";

  return (
    <section className="section chapter-stage heart-section">
      <div className="chapter-head">
        <p className="chapter-kicker">THIS ONE IS YOURS</p>
        <h2 className="serif-title">{birthdayConfig.heartTap.heading}</h2>
        <p className="play-hint">Keep tapping. I meant every line.</p>
      </div>
      <div className="heart-stage">
        <SparkleField count={5} />
        <button
          className={`giant-heart ${pulse ? "pulse" : ""}`}
          type="button"
          onClick={tap}
          aria-label="Tap the heart"
        >
          <GlowHeartBackdrop />
          <span className="heart-name">{birthdayConfig.name}</span>
        </button>
        <p className="heart-message">{message || "Go on. It’s waiting for you."}</p>
        {kisses > 1 && (
          <p className="heart-combo">{kisses} little kisses. Still not enough.</p>
        )}
        {usLine && <p className="heart-us-line">{usLine}</p>}
      </div>
      {floaters.map((item) => (
        <span
          key={item.id}
          className="rising-note"
          style={{ left: item.x, top: item.y }}
        >
          {item.text}
        </span>
      ))}
    </section>
  );
}
