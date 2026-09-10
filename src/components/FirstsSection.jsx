import { useState } from "react";
import { birthdayConfig } from "../data/birthdayConfig";

export default function FirstsSection({ onFind }) {
  const firsts = birthdayConfig.firsts;
  const [open, setOpen] = useState(null);
  const [seen, setSeen] = useState([]);

  const reveal = (id) => {
    setOpen(id);
    if (!seen.includes(id)) {
      setSeen((current) => [...current, id]);
      onFind?.("firsts", id);
    }
  };

  const current = firsts.find((item) => item.id === open);
  const drawn = seen.length / firsts.length;

  return (
    <section className="section chapter-stage firsts-section">
      <div className="chapter-head">
        <p className="chapter-kicker">BEFORE TODAY</p>
        <h2 className="serif-title">{birthdayConfig.firstsHeading}</h2>
        <p className="play-hint">{birthdayConfig.firstsHint}</p>
      </div>
      <div className="firsts-track" data-local-nav>
        <span className="firsts-rail" aria-hidden="true">
          <span className="firsts-fill" style={{ height: `${drawn * 100}%` }} />
        </span>
        {firsts.map((item, index) => (
          <button
            key={item.id}
            type="button"
            className={`first-bead ${seen.includes(item.id) ? "is-seen" : ""} ${open === item.id ? "is-open" : ""}`}
            onClick={() => reveal(item.id)}
          >
            <span className="first-num">{index + 1}</span>
            <span className="first-label">{item.title}</span>
          </button>
        ))}
      </div>
      {current && (
        <article className="first-card" key={current.id}>
          <h3>{current.title}</h3>
          <p>{current.body}</p>
        </article>
      )}
      <p className="chapter-progress">
        {seen.length} of {firsts.length} firsts
      </p>
    </section>
  );
}
