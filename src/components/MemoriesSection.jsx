import { useState } from "react";
import { birthdayConfig } from "../data/birthdayConfig";
import HeartMark from "../visual/HeartMark";
import { Flower } from "../visual/Decor";
import MediaFrame from "../visual/MediaFrame";
import TiltCard from "../visual/TiltCard";

const ROTATIONS = [-2, 1, -1, 2];
const TAPES = ["rose", "cream", "lavender", "blush"];

export default function MemoriesSection({ onFind }) {
  const [focused, setFocused] = useState(null);
  const [seen, setSeen] = useState([]);
  const memory = birthdayConfig.memories.find((item) => item.id === focused);

  const open = (id) => {
    setFocused(id);
    if (!seen.includes(id)) {
      setSeen((current) => [...current, id]);
      onFind?.("photos", id);
    }
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
      <div className="memory-grid">
        {birthdayConfig.memories.map((item, index) => (
          <div key={item.id}>
            <TiltCard
              as="button"
              type="button"
              className={`memory-card rot-${index} ${seen.includes(item.id) ? "memory-seen" : ""}`}
              style={{ "--base-rot": `${ROTATIONS[index % ROTATIONS.length]}deg` }}
              onClick={() => open(item.id)}
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
          </div>
        ))}
      </div>
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
