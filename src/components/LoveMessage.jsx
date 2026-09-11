import { useEffect, useState } from "react";
import { birthdayConfig } from "../data/birthdayConfig";
import TeddyBears from "./TeddyBears";
import { FlowerCluster, SparkleField } from "../visual/Decor";
import HeartMark from "../visual/HeartMark";

const PAGES = [
  [0, 1],
  [2, 3],
  [4],
  [5, 6, 7],
  [8, 9, 10, 11],
  [12, 13, 14],
  [15, 16, 17],
  [18, 19, 20],
];

export default function LoveMessage({ onFind }) {
  const [phase, setPhase] = useState("closed");
  const [page, setPage] = useState(0);
  const [kisses, setKisses] = useState([]);
  const [tucked, setTucked] = useState(false);
  const lines = birthdayConfig.loveLetter.paragraphs;
  const current = PAGES[page] || [];
  const showPs = kisses.length >= 3;

  useEffect(() => {
    setPhase("opening");
    const openId = window.setTimeout(() => setPhase("unfolded"), 900);
    return () => window.clearTimeout(openId);
  }, []);

  useEffect(() => {
    if (page === PAGES.length - 1) onFind?.("letter");
  }, [page, onFind]);

  const leaveKiss = (event) => {
    if (event.target.closest("button")) return;
    const paper = event.currentTarget;
    const box = paper.getBoundingClientRect();
    const next = {
      id: `${Date.now()}-${Math.random()}`,
      x: event.clientX - box.left,
      y: event.clientY - box.top,
    };
    setKisses((currentKisses) => [...currentKisses.slice(-18), next]);
    onFind?.("kisses");
  };

  return (
    <section className="section chapter-stage letter-section">
      <div className="chapter-head">
        <p className="chapter-kicker">FOR {birthdayConfig.name}</p>
        <h2 className="serif-title">{birthdayConfig.loveLetter.heading.replace(" ♡", "")}</h2>
        <p className="play-hint">{birthdayConfig.play.letterHint}</p>
      </div>
      <div className="letter-surround letter-book">
        <FlowerCluster className="letter-flowers left" />
        <div className={`letter-stage ${phase}`} data-local-nav>
          <div className="envelope" aria-hidden={phase === "unfolded"}>
            <div className="envelope-flap" />
            <div className="envelope-pocket" />
            <div className="wax-seal">
              <HeartMark size={22} color="#f4ead8" />
            </div>
          </div>
          <article className="stationery love-letter living-paper" onClick={leaveKiss}>
            <SparkleField count={4} />
            <button
              className="letter-fold"
              type="button"
              aria-label="Peek the folded corner"
              onClick={() => setTucked(true)}
            />
            <div key={page} className="letter-page">
              {current.map((lineIndex) => (
                <p
                  key={lines[lineIndex]}
                  className={`letter-line visible ${lineIndex === lines.length - 1 ? "signoff" : ""}`}
                >
                  {lines[lineIndex]}
                </p>
              ))}
            </div>
            {showPs && <p className="letter-ps">{birthdayConfig.loveLetter.postscript}</p>}
            {kisses.map((kiss) => (
              <span key={kiss.id} className="paper-kiss" style={{ left: kiss.x, top: kiss.y }}>
                <HeartMark size={18} color="#8a6a3a" />
              </span>
            ))}
            <div className="letter-nav" data-local-nav>
              <button type="button" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
                Back
              </button>
              <span className="chapter-progress">
                Page {page + 1} of {PAGES.length}
              </span>
              <button
                type="button"
                disabled={page === PAGES.length - 1}
                onClick={() => setPage((p) => p + 1)}
              >
                Keep reading
              </button>
            </div>
          </article>
        </div>
        <FlowerCluster className="letter-flowers right" />
      </div>
      <div className="letter-bears">
        <TeddyBears pose="letter" variant="letter" />
      </div>
      {tucked && (
        <div className="tucked-room" onClick={() => setTucked(false)} role="dialog">
          <article className="tucked-note" onClick={(event) => event.stopPropagation()}>
            <p className="tucked-kicker">TUCKED IN THE FOLD</p>
            <h3>{birthdayConfig.loveLetter.tuckedTitle}</h3>
            <p>{birthdayConfig.loveLetter.tuckedBody}</p>
            <button type="button" onClick={() => setTucked(false)}>
              Keep this between us
            </button>
          </article>
        </div>
      )}
    </section>
  );
}
