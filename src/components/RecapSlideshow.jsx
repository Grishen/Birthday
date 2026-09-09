import { useEffect, useMemo, useRef, useState } from "react";
import { birthdayConfig } from "../data/birthdayConfig";
import MediaFrame from "../visual/MediaFrame";
import TeddyBears from "./TeddyBears";
import HeartMark from "../visual/HeartMark";
import { SparkleField } from "../visual/Decor";

function buildRecapSlides(config) {
  const letter = config.loveLetter.paragraphs;
  const slides = [
    {
      kind: "title",
      kicker: "Before we go",
      title: "Our little world",
      body: "Everything you just felt. One more time.",
    },
    {
      kind: "title",
      kicker: `For ${config.name}`,
      title: config.hero.heading,
      body: config.hero.subtitle,
    },
    {
      kind: "quote",
      kicker: "A letter from my heart",
      body: letter[1] || letter[0],
    },
    {
      kind: "quote",
      body: letter[3] || letter[2],
    },
    {
      kind: "quote",
      body: letter[13] || letter[Math.floor(letter.length / 2)],
    },
    {
      kind: "quote",
      body: letter[letter.length - 1],
    },
    ...config.reasons.map((reason) => ({
      kind: "quote",
      kicker: "Why I love you",
      title: reason.title,
      body: reason.teaser,
    })),
    {
      kind: "title",
      title: "You have my whole heart.",
      body: "Still choosing you. Every time.",
    },
    ...config.universeMessages.slice(0, 3).map((star) => ({
      kind: "quote",
      kicker: "Our little universe",
      title: star.title,
      body: star.body,
    })),
    ...config.memories.map((memory) => ({
      kind: "media",
      src: memory.image,
      kicker: memory.date,
      body: memory.caption,
    })),
    {
      kind: "title",
      title: config.gift.revealTitle,
      body: config.gift.revealBody,
    },
    {
      kind: "finale",
      title: config.finale.title,
      body: config.finale.subtitle,
      lines: config.finale.lines,
    },
  ];
  return slides;
}

function slideDuration(slide, reduced) {
  if (!slide) return 4000;
  if (reduced) return 2400;
  if (slide.kind === "media") return 4000;
  if (slide.kind === "finale") return 5000;
  if (slide.kind === "quote") return 4200;
  return 3500;
}

export default function RecapSlideshow({ onDone, reducedMotion }) {
  const slides = useMemo(() => buildRecapSlides(birthdayConfig), []);
  const [index, setIndex] = useState(0);
  const slide = slides[index];
  const duration = slideDuration(slide, reducedMotion);

  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;
  const finishingRef = useRef(false);

  const finish = () => {
    if (finishingRef.current) return;
    finishingRef.current = true;
    onDoneRef.current?.();
  };

  useEffect(() => {
    const id = window.setTimeout(() => {
      if (index >= slides.length - 1) finish();
      else setIndex((current) => current + 1);
    }, duration);
    return () => window.clearTimeout(id);
  }, [index, duration, slides.length]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  if (!slide) return null;

  return (
    <div className="recap-screen" role="dialog" aria-label="A look back">
      <SparkleField count={6} />
      <div className="recap-vignette" />
      <div className="recap-progress" aria-hidden="true">
        <span
          key={index}
          className="recap-progress-fill"
          style={{ animationDuration: `${duration}ms` }}
        />
      </div>
      <p className="recap-count">
        {index + 1} / {slides.length}
      </p>
      <div key={index} className={`recap-slide recap-${slide.kind}`}>
        {slide.kicker && <p className="recap-kicker">{slide.kicker}</p>}
        {slide.kind === "media" && slide.src && (
          <div className="recap-frame">
            <MediaFrame src={slide.src} alt={slide.body || ""} className="recap-media" />
          </div>
        )}
        {slide.title && <h2 className="recap-title">{slide.title}</h2>}
        {slide.body && <p className="recap-body">{slide.body}</p>}
        {slide.lines?.map((line) => (
          <p key={line} className="recap-line">
            {line}
          </p>
        ))}
        {slide.kind === "finale" && (
          <div className="recap-bears">
            <TeddyBears pose="hug" variant="finale" />
          </div>
        )}
        {slide.kind === "title" && index === 0 && (
          <HeartMark size={36} color="#d4b483" className="recap-heart" />
        )}
      </div>
      <button className="recap-skip" type="button" onClick={finish}>
        Skip
      </button>
    </div>
  );
}
