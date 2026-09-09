import { useCallback, useEffect, useMemo, useState } from "react";
import { birthdayConfig } from "../data/birthdayConfig";
import TeddyBears from "./TeddyBears";
import { GlowHeartBackdrop } from "../visual/HeartMark";
import HeartMark from "../visual/HeartMark";
import { CloudBand } from "../visual/Decor";
import RomanticAmbience from "../visual/RomanticAmbience";

const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "heart", "0", "del"];

export default function LoginScreen({
  pose,
  buttonLabel,
  locked,
  fading,
  charged,
  dimmed,
  onUnlock,
  onWrong,
  onBearClick,
}) {
  const [value, setValue] = useState("");
  const [wrong, setWrong] = useState(false);
  const [wrongLine, setWrongLine] = useState(0);
  const [clock, setClock] = useState(() => new Date());
  const copy = birthdayConfig.login;
  const length = birthdayConfig.password.length;

  useEffect(() => {
    const id = window.setInterval(() => setClock(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const timeLabel = clock.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  const dateLabel = clock.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" });

  const tryUnlock = useCallback(
    (next) => {
      if (locked || wrong) return;
      if (next === birthdayConfig.password) {
        setWrong(false);
        onUnlock();
        return;
      }
      setWrong(true);
      setWrongLine(1);
      onWrong?.();
      window.setTimeout(() => setWrongLine(2), 700);
      window.setTimeout(() => {
        setValue("");
        setWrong(false);
        setWrongLine(0);
      }, 720);
    },
    [locked, wrong, onUnlock, onWrong]
  );

  const press = useCallback(
    (key) => {
      if (locked || wrong) return;
      if (key === "heart") {
        onBearClick?.();
        return;
      }
      if (key === "del") {
        setValue((current) => current.slice(0, -1));
        return;
      }
      setValue((current) => {
        if (current.length >= length) return current;
        const next = `${current}${key}`;
        if (next.length === length) window.setTimeout(() => tryUnlock(next), 90);
        return next;
      });
    },
    [locked, wrong, length, onBearClick, tryUnlock]
  );

  useEffect(() => {
    const onKey = (event) => {
      if (event.key >= "0" && event.key <= "9") {
        event.preventDefault();
        press(event.key);
      } else if (event.key === "Backspace") {
        event.preventDefault();
        press("del");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [press]);

  const status = useMemo(() => {
    if (charged || locked) return buttonLabel.replaceAll("♡", "").trim();
    if (wrong && wrongLine >= 2) return copy.wrongSecondary;
    if (wrong) return copy.wrongPrimary;
    return copy.passcodeLabel;
  }, [buttonLabel, charged, locked, wrong, wrongLine, copy]);

  return (
    <section
      className={`login-screen ${fading ? "success-fade" : ""} ${dimmed ? "dimmed" : ""} ${charged ? "charging" : ""}`}
    >
      <CloudBand />
      <RomanticAmbience mood="night" density="airy" />
      <div className="login-float-hearts" aria-hidden="true">
        <HeartMark size={18} color="#d4b483" className="fh a" />
        <HeartMark size={14} variant="outline" color="#c4a07a" className="fh b" />
        <HeartMark size={16} sparkle color="#f0d8a6" className="fh c" />
        <HeartMark size={12} variant="pale" className="fh d" />
      </div>

      <div className="login-tilt">
        <div className={`phone-lock ${wrong ? "is-wrong" : ""} ${locked ? "is-opening" : ""}`}>
          <div className="phone-shine" />
          <span className="phone-notch" />
          <p className="lock-time">{timeLabel}</p>
          <p className="lock-date">{dateLabel}</p>
          <div className="login-stage compact">
            <GlowHeartBackdrop className={`login-glow ${charged ? "is-charged" : ""}`} />
            <div className="login-bears">
              <TeddyBears pose={pose} variant="login" charged={charged} onBearClick={onBearClick} />
            </div>
          </div>
          <p className="lock-for">For {birthdayConfig.name}</p>
          <h1 className="login-title">{copy.title}</h1>
          <p className="login-subtitle">{copy.subtitle}</p>
          <p className="passcode-label" aria-live="polite">
            {status}
          </p>
          <div className={`pass-dots ${wrong ? "wiggle" : ""}`} aria-hidden="true">
            {Array.from({ length }, (_, i) => (
              <span key={i} className={`pass-dot ${i < value.length ? "is-filled" : ""}`} />
            ))}
          </div>
          <p className="pass-hint">{copy.placeholder}</p>
          <div className="keypad" role="group" aria-label="Passcode keypad">
            {KEYS.map((key) => (
              <button
                key={key}
                type="button"
                className={`pad-key key-${key}`}
                disabled={locked}
                onClick={() => press(key)}
                aria-label={key === "del" ? "Delete" : key === "heart" ? "Heart" : key}
              >
                {key === "del" ? (
                  <span className="pad-del">⌫</span>
                ) : key === "heart" ? (
                  <HeartMark size={22} color="#d4b483" />
                ) : (
                  key
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
