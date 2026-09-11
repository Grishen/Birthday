import { useState } from "react";
import { birthdayConfig } from "../data/birthdayConfig";
import HeartMark from "../visual/HeartMark";
import { Flower } from "../visual/Decor";
import MediaFrame from "../visual/MediaFrame";
import TiltCard from "../visual/TiltCard";

const ROTATIONS = [-6, 4, -2, 7];
const TAPES = ["rose", "cream", "lavender", "blush"];

export default function MemoriesSection({ onFind }) {
  const memories = birthdayConfig.memories;
  const [stack, setStack] = useState(() => memories.map((item) => item.id));
  const [kept, setKept] = useState([]);
  const [peeling, setPeeling] = useState(null);
  const [focused, setFocused] = useState(null);
  const memory = memories.find((item) => item.id === focused);

  const markSeen = (id) => {
    onFind?.("photos", id);
  };

  const peel = (id) => {
    if (peeling || stack[0] !== id) {
      if (kept.includes(id)) setFocused(id);
      return;
    }
    setPeeling(id);
    markSeen(id);
    window.setTimeout(() => {
      setStack((current) => current.filter((item) => item !== id));
      setKept((current) => (current.includes(id) ? current : [...current, id]));
      setPeeling(null);
    }, 520);
  };

  const renderCard = (item, index, mode) => {
    const depth = mode === "stack" ? index : 0;
    return (
      <TiltCard
        as="button"
        type="button"
        className={`memory-card rot-${index} ${mode === "stack" ? "in-stack" : "is-kept"} ${
          peeling === item.id ? "is-peeling" : ""
        } ${index === 0 && mode === "stack" ? "is-top" : ""}`}
        style={{
          "--base-rot": `${ROTATIONS[index % ROTATIONS.length]}deg`,
          "--stack-x": `${depth * 8}px`,
          "--stack-y": `${depth * 10}px`,
          zIndex: mode === "stack" ? memories.length - index : 1,
        }}
        onClick={() => (mode === "stack" ? peel(item.id) : setFocused(item.id))}
      >
        <span className={`washi ${TAPES[index % TAPES.length]}`} />
        <div className={`memory-photo ${item.tint}`}>
          {item.image ? (
            <MediaFrame src={item.image} alt={item.caption} />
          ) : (
            <div className="memory-placeholder">
              <Flower type={index % 2 === 0 ? "rose" : "daisy"} size={36} />
              <span>A memory goes here</span>
              <HeartMark size={16} color="#d4b483" />
            </div>
          )}
        </div>
        <HeartMark className="memory-sticker" size={18} sparkle={index === 1} color="#d4b483" />
        <time>{item.date}</time>
        <p>{item.caption}</p>
      </TiltCard>
    );
  };

  return (
    <section className="section chapter-stage memories-section">
      <Flower type="rose" size={32} className="section-side-flowers left" />
      <Flower type="daisy" size={28} className="section-side-flowers right" />
      <div className="chapter-head">
        <p className="chapter-kicker">KEEP THESE</p>
        <h2 className="serif-title">{birthdayConfig.memoriesHeading.replace(" ♡", "")}</h2>
        <p className="play-hint">{birthdayConfig.play.memoryHint}</p>
      </div>
      <div className="memory-table">
        {stack.length > 0 && (
          <div className="memory-stack" data-local-nav>
            {stack.map((id, index) => {
              const item = memories.find((memoryItem) => memoryItem.id === id);
              if (!item) return null;
              return (
                <div key={id} className="memory-stack-slot">
                  {renderCard(item, index, "stack")}
                </div>
              );
            })}
          </div>
        )}
        {kept.length > 0 && (
          <div className="memory-kept" data-local-nav>
            {kept.map((id, index) => {
              const item = memories.find((memoryItem) => memoryItem.id === id);
              if (!item) return null;
              return <div key={id}>{renderCard(item, index, "kept")}</div>;
            })}
          </div>
        )}
      </div>
      {stack.length === 0 && (
        <p className="chapter-payoff">A little pile of us. Tap any one to hold it closer.</p>
      )}
      {memory && (
        <div className="memory-focus" onClick={() => setFocused(null)} role="dialog">
          <div className="memory-focus-card" onClick={(event) => event.stopPropagation()}>
            {memory.image && <MediaFrame src={memory.image} alt={memory.caption} controls />}
            <time>{memory.date}</time>
            <p>{memory.caption}</p>
            <button type="button" onClick={() => setFocused(null)}>
              Keep this one
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
