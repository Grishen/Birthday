import { useState } from "react";
import { birthdayConfig } from "../data/birthdayConfig";
import TeddyBears from "./TeddyBears";
import HeartMark from "../visual/HeartMark";
import RomanticButton from "../visual/RomanticButton";
import { FlowerCluster, SparkleField } from "../visual/Decor";
import MediaFrame from "../visual/MediaFrame";

export default function GiftSection({ onOpen }) {
  const [stage, setStage] = useState("idle");
  const gift = birthdayConfig.gift;

  const open = () => {
    if (stage !== "idle") return;
    setStage("shaking");
    window.setTimeout(() => setStage("opening"), 520);
    window.setTimeout(() => {
      setStage("opened");
      onOpen?.();
    }, 1250);
  };

  return (
    <section className="section chapter-stage gift-section">
      <FlowerCluster className="section-side-flowers left" />
      <FlowerCluster className="section-side-flowers right" />
      <div className="chapter-head">
        <p className="chapter-kicker">ONE MORE THING</p>
        <h2 className="serif-title">{gift.heading.replace("🎁", "").trim()}</h2>
        <p className="body-copy">{gift.subtext}</p>
      </div>
      <div className="gift-wrap">
        <button
          className={`gift-box ${stage}`}
          type="button"
          onClick={open}
          aria-label="Open the mystery gift"
        >
          <span className="gift-glow" />
          <SparkleField count={stage === "opening" || stage === "opened" ? 6 : 0} />
          <span className="box-bow" />
          <span className="box-lid">
            <HeartMark size={22} color="#f4ead8" />
          </span>
          <span className="box-ribbon-v" />
          <span className="box-ribbon-h" />
          <span className="box-body" />
        </button>
        {stage === "idle" && (
          <RomanticButton onClick={open}>OPEN YOUR PRESENT</RomanticButton>
        )}
        {stage === "opened" && (
          <div className="gift-reveal">
            {gift.image && <MediaFrame src={gift.image} className="gift-media" controls />}
            <h3>{gift.revealTitle}</h3>
            <p>{gift.revealBody}</p>
            {gift.extraMessage && <p>{gift.extraMessage}</p>}
          </div>
        )}
      </div>
      <div className="gift-bears">
        <TeddyBears pose="present" variant="present" />
      </div>
    </section>
  );
}
