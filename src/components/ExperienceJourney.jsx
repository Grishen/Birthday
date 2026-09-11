import { useCallback, useEffect, useRef, useState } from "react";
import BirthdayHero from "./BirthdayHero";
import LoveMessage from "./LoveMessage";
import FirstsSection from "./FirstsSection";
import ReasonsSection from "./ReasonsSection";
import HeartInteraction from "./HeartInteraction";
import UniverseSection from "./UniverseSection";
import SecretsSection from "./SecretsSection";
import MemoriesSection from "./MemoriesSection";
import GiftSection from "./GiftSection";
import FinalSection from "./FinalSection";
import SceneWipe from "./SceneWipe";
import RomanticAmbience from "../visual/RomanticAmbience";

const CHAPTERS = [
  { id: "hero", label: "Today", wipe: "hearts", mood: "gold" },
  { id: "letter", label: "The letter", wipe: "envelope", mood: "lamp" },
  { id: "firsts", label: "How we began", wipe: "hearts", mood: "gold" },
  { id: "reasons", label: "Reasons", wipe: "hearts", mood: "blush" },
  { id: "heart", label: "My heart", wipe: "iris", mood: "blush" },
  { id: "universe", label: "The sky", wipe: "night", mood: "night" },
  { id: "secrets", label: "Only we know", wipe: "envelope", mood: "lamp" },
  { id: "memories", label: "Us", wipe: "shutter", mood: "table" },
  { id: "gift", label: "A gift", wipe: "ribbon", mood: "wrap" },
  { id: "finale", label: "Always", wipe: "petals", mood: "dark" },
];

const LOCK_MS = 980;

const emptyFound = {
  letter: false,
  wish: false,
  reasons: [],
  stars: [],
  photos: [],
  firsts: [],
  secrets: [],
  kisses: 0,
  heart: 0,
};

function innerAllowsScroll(node, deltaY) {
  if (!node || node.scrollHeight <= node.clientHeight + 12) return false;
  const atTop = node.scrollTop <= 4;
  const atBottom = node.scrollTop + node.clientHeight >= node.scrollHeight - 4;
  if (deltaY > 0 && !atBottom) return true;
  if (deltaY < 0 && !atTop) return true;
  return false;
}

function isLocalNav(target) {
  return Boolean(target?.closest?.("[data-local-nav]"));
}

export default function ExperienceJourney({
  ready,
  reducedMotion,
  cinematic,
  compact,
  onHeadingClick,
  onBearClick,
  bearPose,
  onCakeBurst,
  onHeartBurst,
  onGiftOpen,
  onReplay,
}) {
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(null);
  const [entering, setEntering] = useState(false);
  const [wipe, setWipe] = useState(null);
  const [found, setFound] = useState(emptyFound);
  const busyRef = useRef(false);
  const indexRef = useRef(0);
  const scrollRef = useRef(null);
  const touchY = useRef(null);

  indexRef.current = index;

  const onFind = useCallback((kind, id) => {
    setFound((current) => {
      if (kind === "letter" || kind === "wish") {
        return current[kind] ? current : { ...current, [kind]: true };
      }
      if (kind === "kisses" || kind === "heart") {
        return { ...current, [kind]: current[kind] + 1 };
      }
      const list = current[kind];
      if (!Array.isArray(list) || !id || list.includes(id)) return current;
      return { ...current, [kind]: [...list, id] };
    });
  }, []);

  const goTo = useCallback(
    (next) => {
      if (!ready || busyRef.current) return;
      const current = indexRef.current;
      if (next === current || next < 0 || next >= CHAPTERS.length) return;
      busyRef.current = true;
      const dir = next > current ? 1 : -1;
      const kind = reducedMotion ? "fade" : CHAPTERS[dir > 0 ? next : current].wipe;
      setLeaving({ index: current, dir });
      setIndex(next);
      setEntering(true);
      setWipe(kind);
      const lock = reducedMotion ? 220 : LOCK_MS;
      window.setTimeout(() => {
        setLeaving(null);
        setEntering(false);
        setWipe(null);
        busyRef.current = false;
      }, lock);
    },
    [ready, reducedMotion]
  );

  const next = useCallback(() => goTo(indexRef.current + 1), [goTo]);
  const prev = useCallback(() => goTo(indexRef.current - 1), [goTo]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [index]);

  useEffect(() => {
    const onWheel = (event) => {
      if (!ready || busyRef.current) return;
      if (isLocalNav(event.target)) return;
      if (innerAllowsScroll(scrollRef.current, event.deltaY)) return;
      if (Math.abs(event.deltaY) < 22) return;
      event.preventDefault();
      if (event.deltaY > 0) next();
      else prev();
    };
    const onKey = (event) => {
      if (!ready || busyRef.current) return;
      const tag = event.target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (isLocalNav(event.target)) return;
      if (["ArrowDown", "PageDown", "ArrowRight"].includes(event.key)) {
        event.preventDefault();
        next();
      } else if (["ArrowUp", "PageUp", "ArrowLeft"].includes(event.key)) {
        event.preventDefault();
        prev();
      }
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
    };
  }, [ready, next, prev]);

  const onTouchStart = (event) => {
    if (isLocalNav(event.target)) {
      touchY.current = null;
      return;
    }
    touchY.current = event.touches[0]?.clientY ?? null;
  };
  const onTouchEnd = (event) => {
    if (touchY.current == null) return;
    const y = event.changedTouches[0]?.clientY ?? touchY.current;
    const dy = touchY.current - y;
    touchY.current = null;
    if (Math.abs(dy) < 56) return;
    if (innerAllowsScroll(scrollRef.current, dy)) return;
    if (dy > 0) next();
    else prev();
  };

  const renderChapter = (chapterIndex, mode) => {
    const chapter = CHAPTERS[chapterIndex];
    const active = mode === "active" || mode === "enter";
    return (
      <div
        key={chapter.id}
        className={`chapter chapter-${chapter.id} is-${mode}`}
        aria-hidden={!active}
      >
        <div className="chapter-scroll" ref={active ? scrollRef : undefined}>
          <div className="chapter-world">
            {chapter.id === "hero" && (
              <BirthdayHero
                cinematic={cinematic && chapterIndex === 0}
                compact={compact}
                onHeadingClick={onHeadingClick}
                onBearClick={onBearClick}
                bearPose={bearPose}
                onCakeBurst={onCakeBurst}
                onFind={onFind}
              />
            )}
            {chapter.id === "letter" && <LoveMessage onFind={onFind} />}
            {chapter.id === "firsts" && <FirstsSection onFind={onFind} />}
            {chapter.id === "reasons" && <ReasonsSection onFind={onFind} />}
            {chapter.id === "heart" && (
              <HeartInteraction onBurst={onHeartBurst} onFind={onFind} />
            )}
            {chapter.id === "universe" && <UniverseSection onFind={onFind} />}
            {chapter.id === "secrets" && <SecretsSection onFind={onFind} />}
            {chapter.id === "memories" && <MemoriesSection onFind={onFind} />}
            {chapter.id === "gift" && <GiftSection onOpen={onGiftOpen} />}
            {chapter.id === "finale" && (
              <FinalSection onReplay={onReplay} onBearClick={onBearClick} found={found} />
            )}
          </div>
        </div>
      </div>
    );
  };

  const chapter = CHAPTERS[index];
  const last = index === CHAPTERS.length - 1;

  return (
    <main
      className={`experience journey place-${chapter.mood} ${ready ? "is-ready" : "is-cinematic"}`}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <RomanticAmbience
        mood={chapter.mood}
        density="airy"
        gardens={false}
      />
      {CHAPTERS.map((item, i) => {
        const isHere = i === index;
        const isLeaving = leaving?.index === i;
        if (!isHere && !isLeaving) return null;
        const mode = isLeaving
          ? leaving.dir > 0
            ? "leave-up"
            : "leave-down"
          : entering
            ? "enter"
            : "active";
        return renderChapter(i, mode);
      })}
      {wipe && <SceneWipe kind={wipe} />}

      {ready && (
        <nav className="journey-chrome" aria-label="Story">
          <div className="journey-dots" role="tablist">
            {CHAPTERS.map((item, i) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                title={item.label}
                className={`journey-dot ${i === index ? "is-current" : ""}`}
                aria-label={item.label}
                aria-selected={i === index}
                onClick={() => goTo(i)}
              />
            ))}
          </div>
          <div className="journey-bar">
            <button className="journey-back" type="button" onClick={prev} disabled={index === 0}>
              Back
            </button>
            <span className="journey-label">
              {index + 1} of {CHAPTERS.length} · {chapter.label}
            </span>
            <button
              className="journey-next"
              type="button"
              onClick={next}
              disabled={last}
              style={last ? { visibility: "hidden" } : undefined}
            >
              Continue the story
            </button>
          </div>
        </nav>
      )}
    </main>
  );
}
