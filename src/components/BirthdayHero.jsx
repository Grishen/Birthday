import { useEffect, useState } from "react";
import { birthdayConfig } from "../data/birthdayConfig";
import TeddyBears from "./TeddyBears";
import { GlowHeartBackdrop } from "../visual/HeartMark";
import HeartMark from "../visual/HeartMark";
import { BalloonFrame, FlowerCluster, SparkleField } from "../visual/Decor";
import BirthdayCake from "../visual/BirthdayCake";

export default function BirthdayHero({ cinematic, onHeadingClick, onBearClick, bearPose, onCakeBurst, compact }) {
  const [typed, setTyped] = useState("");
  const line = birthdayConfig.cinematic.subtext;

  useEffect(() => {
    if (!cinematic) {
      setTyped(birthdayConfig.hero.subtitle);
      return undefined;
    }
    setTyped("");
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setTyped(line.slice(0, i));
      if (i >= line.length) window.clearInterval(id);
    }, 42);
    return () => window.clearInterval(id);
  }, [cinematic, line]);

  return (
    <section className={`birthday-hero living-hero ${cinematic ? "cinematic-hero" : "section"}`}>
      <BalloonFrame compact={compact} />
      <SparkleField count={compact ? 4 : 8} />
      <GlowHeartBackdrop className="hero-glow" />
      <div className="hero-hearts" aria-hidden="true">
        <HeartMark size={16} color="#d4b483" className="hh a" />
        <HeartMark size={14} variant="outline" color="#c4a07a" className="hh b" />
        <HeartMark size={18} sparkle color="#f0d8a6" className="hh c" />
      </div>
      <p className="hero-for">For {birthdayConfig.name}</p>
      <p className="section-kicker">TODAY IS YOURS</p>
      <h1 className={`display-title ${cinematic ? "glowing" : ""}`} onClick={onHeadingClick}>
        {cinematic ? birthdayConfig.cinematic.heading.replace(" ♡", "") : birthdayConfig.hero.heading}
      </h1>
      <p className="body-copy typewriter">{typed}</p>
      {!cinematic && birthdayConfig.hero.todayLine && (
        <p className="hero-today">{birthdayConfig.hero.todayLine}</p>
      )}
      <BirthdayCake interactive onBurst={onCakeBurst} />
      <div className="hero-flowers" aria-hidden="true">
        <FlowerCluster />
      </div>
      <div className="hero-bears">
        <TeddyBears pose={bearPose === "idle" ? "birthday" : bearPose} variant="hero" onBearClick={onBearClick} />
      </div>
    </section>
  );
}
