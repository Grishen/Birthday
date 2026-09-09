import { useState } from "react";
import { birthdayConfig } from "../data/birthdayConfig";
import HeartMark from "../visual/HeartMark";

export default function SecretsSection({ onFind }) {
  const secrets = birthdayConfig.secrets;
  const [open, setOpen] = useState(null);
  const [seen, setSeen] = useState([]);

  const toggle = (id) => {
    const next = open === id ? null : id;
    setOpen(next);
    if (next && !seen.includes(id)) {
      setSeen((current) => [...current, id]);
      onFind?.("secrets", id);
    }
  };

  return (
    <section className="section chapter-stage secrets-section">
      <div className="chapter-head">
        <p className="chapter-kicker">OURS</p>
        <h2 className="serif-title">{birthdayConfig.secretsHeading}</h2>
        <p className="play-hint">{birthdayConfig.secretsHint}</p>
      </div>
      <div className="secret-row" data-local-nav>
        {secrets.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`secret-drawer ${open === item.id ? "is-open" : ""} ${seen.includes(item.id) ? "is-seen" : ""}`}
            onClick={() => toggle(item.id)}
          >
            <span className="secret-lid">
              <HeartMark size={16} color="#d4b483" />
              {item.title}
            </span>
            <span className="secret-note">{item.body}</span>
          </button>
        ))}
      </div>
      <p className="chapter-progress">
        {seen.length} of {secrets.length} opened
      </p>
    </section>
  );
}
