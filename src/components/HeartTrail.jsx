import { useEffect, useRef, useState } from "react";
import HeartMark from "../visual/HeartMark";

const LOCK_COLORS = ["#d4b483", "#f0d8a6", "#c4a07a", "#8a6a3a"];
const OPEN_COLORS = ["#c45c3e", "#d4785c", "#5f6f52", "#2a2118"];

export default function HeartTrail({ active = true, open = false }) {
  const [hearts, setHearts] = useState([]);
  const last = useRef(0);

  useEffect(() => {
    if (!active) return undefined;

    const onMove = (event) => {
      const now = performance.now();
      if (now - last.current < 55) return;
      last.current = now;
      const next = {
        id: `${now}-${Math.random()}`,
        x: event.clientX,
        y: event.clientY,
        size: 10 + Math.random() * 10,
        color: (open ? OPEN_COLORS : LOCK_COLORS)[
          Math.floor(Math.random() * (open ? OPEN_COLORS : LOCK_COLORS).length)
        ],
        rot: (Math.random() - 0.5) * 40,
      };
      setHearts((current) => [...current.slice(-14), next]);
      window.setTimeout(() => {
        setHearts((current) => current.filter((item) => item.id !== next.id));
      }, 720);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [active, open]);

  if (!active) return null;

  return (
    <div className="heart-trail" aria-hidden="true">
      {hearts.map((heart) => (
        <span
          key={heart.id}
          className="trail-heart"
          style={{
            left: heart.x,
            top: heart.y,
            transform: `translate(-50%, -50%) rotate(${heart.rot}deg)`,
          }}
        >
          <HeartMark size={heart.size} color={heart.color} />
        </span>
      ))}
    </div>
  );
}
