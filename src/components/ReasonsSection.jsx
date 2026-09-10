import { useState } from "react";
import { birthdayConfig } from "../data/birthdayConfig";
import HeartMark from "../visual/HeartMark";
import { FlowerCluster, SparkleField } from "../visual/Decor";
import TiltCard from "../visual/TiltCard";

const ICONS = ["solid", "glow", "outline", "double", "solid", "sparkle"];

export default function ReasonsSection({ onFind }) {
  const [index, setIndex] = useState(0);
  const [opened, setOpened] = useState({});
  const reasons = birthdayConfig.reasons;
  const reason = reasons[index];
  const isOpen = Boolean(opened[reason.title]);

  const toggle = () => {
    const nextOpen = !opened[reason.title];
    setOpened((current) => ({ ...current, [reason.title]: nextOpen }));
    if (nextOpen) onFind?.("reasons", reason.title);
  };

  return (
    <section className="section chapter-stage reasons-section">
      <SparkleField count={6} />
      <FlowerCluster className="section-side-flowers left" />
      <FlowerCluster className="section-side-flowers right" />
      <div className="chapter-head">
        <p className="chapter-kicker">I COULD KEEP GOING</p>
        <h2 className="serif-title">{birthdayConfig.reasonsHeading.replace(" ♡", "")}</h2>
        <p className="play-hint">Open this one. Then the next. They’re all you.</p>
      </div>
      <div className="reason-deck" data-local-nav>
        <TiltCard
          as="button"
          type="button"
          className={`reason-card heart-card reason-spotlight ${isOpen ? "open" : ""}`}
          onClick={toggle}
        >
          <span className="reason-icon">
            <HeartMark
              size={32}
              variant={ICONS[index] === "sparkle" ? "solid" : ICONS[index]}
              sparkle={ICONS[index] === "sparkle"}
              color="#d4b483"
            />
          </span>
          <h3>{reason.title}</h3>
          <p>{reason.teaser}</p>
          {isOpen && <p className="reason-extra">{reason.extra}</p>}
          {!isOpen && <p className="chapter-progress">Tap to read the rest</p>}
        </TiltCard>
        <div className="deck-nav">
          <button type="button" disabled={index === 0} onClick={() => setIndex((i) => i - 1)}>
            Previous
          </button>
          <span className="deck-count">
            {index + 1} / {reasons.length}
          </span>
          <button
            type="button"
            disabled={index === reasons.length - 1}
            onClick={() => setIndex((i) => i + 1)}
          >
            Next reason
          </button>
        </div>
      </div>
    </section>
  );
}
