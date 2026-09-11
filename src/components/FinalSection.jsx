import { useState } from "react";
import { birthdayConfig } from "../data/birthdayConfig";
import TeddyBears from "./TeddyBears";
import Reveal from "./Reveal";
import { GlowHeartBackdrop } from "../visual/HeartMark";
import HeartMark from "../visual/HeartMark";
import { FlowerCluster, SparkleField } from "../visual/Decor";
import RomanticButton from "../visual/RomanticButton";

function scrapLines(found) {
  if (!found) return [];
  const lines = [];
  if (found.wish) lines.push("You made a wish. I was listening.");
  if (found.letter) lines.push("You opened the letter.");
  if (found.firsts?.length) {
    lines.push(`${found.firsts.length} first${found.firsts.length === 1 ? "" : "s"} along the way.`);
  }
  if (found.reasons?.length) {
    lines.push(`${found.reasons.length} reason${found.reasons.length === 1 ? "" : "s"} you opened.`);
  }
  if (found.stars?.length) {
    const allStars = found.stars.length >= 6;
    lines.push(
      allStars
        ? "You found every star. The sky wrote us back."
        : `${found.stars.length} star${found.stars.length === 1 ? "" : "s"} you found.`
    );
  }
  if (found.secrets?.length) {
    lines.push(`${found.secrets.length} secret${found.secrets.length === 1 ? "" : "s"} only we know.`);
  }
  if (found.photos?.length) {
    lines.push(`${found.photos.length} photo${found.photos.length === 1 ? "" : "s"} you held.`);
  }
  if (found.kisses > 0) {
    lines.push(`${found.kisses} kiss${found.kisses === 1 ? "" : "es"} on the page.`);
  }
  if (found.heart > 2) {
    lines.push("You kept tapping my heart. I noticed.");
  }
  return lines;
}

export default function FinalSection({ onReplay, onBearClick, found }) {
  const finale = birthdayConfig.finale;
  const [kisses, setKisses] = useState([]);
  const scrap = scrapLines(found);

  const rain = (event) => {
    if (event.target.closest("button")) return;
    const next = Array.from({ length: 7 }, (_, i) => ({
      id: `${Date.now()}-${i}-${Math.random()}`,
      x: event.clientX + (Math.random() - 0.5) * 90,
      y: event.clientY + (Math.random() - 0.5) * 40,
      size: 12 + (i % 4) * 4,
    }));
    setKisses((current) => [...current, ...next].slice(-40));
    window.setTimeout(() => {
      const ids = new Set(next.map((item) => item.id));
      setKisses((current) => current.filter((item) => !ids.has(item.id)));
    }, 1200);
  };

  return (
    <section className="finale living-finale" onClick={rain}>
      <SparkleField count={8} />
      <FlowerCluster className="finale-flowers left" />
      <FlowerCluster className="finale-flowers right" />
      <div className="finale-heart-wrap living-follow">
        <GlowHeartBackdrop className="finale-glow" />
        <div className="finale-heart-copy">
          <p className="finale-name">{birthdayConfig.name}</p>
          <h2 className="display-title">{finale.title}</h2>
          <p className="serif-title">{finale.subtitle}</p>
        </div>
      </div>
      <p className="play-hint light">{birthdayConfig.play.finaleHint}</p>
      <Reveal>
        <div className="finale-lines">
          {finale.lines.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      </Reveal>
      {scrap.length > 0 && (
        <aside className="finale-scrap">
          <p className="scrap-intro">{finale.scrapIntro}</p>
          {scrap.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </aside>
      )}
      <div className="finale-bears">
        <TeddyBears pose="hug" variant="finale" onBearClick={onBearClick} />
      </div>
      <div className="replay-wrap">
        <RomanticButton className="replay-btn" onClick={onReplay}>
          REPLAY OUR LITTLE WORLD
        </RomanticButton>
      </div>
      {kisses.map((kiss) => (
        <span
          key={kiss.id}
          className="finale-kiss"
          style={{ left: kiss.x, top: kiss.y }}
        >
          <HeartMark size={kiss.size} color="#d4b483" />
        </span>
      ))}
    </section>
  );
}
