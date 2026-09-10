import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { birthdayConfig } from "./data/birthdayConfig";
import { useIsMobile, usePrefersReducedMotion } from "./hooks/useExperience";
import { usePointerWorld } from "./hooks/usePointerWorld";
import BackgroundParticles from "./components/BackgroundParticles";
import LoginScreen from "./components/LoginScreen";
import RecapSlideshow from "./components/RecapSlideshow";
import MusicController from "./components/MusicController";
import ExperienceJourney from "./components/ExperienceJourney";
import HeartTrail from "./components/HeartTrail";
import HeartMark from "./visual/HeartMark";
import { CloudBand } from "./visual/Decor";

export default function App() {
  const reducedMotion = usePrefersReducedMotion();
  const isMobile = useIsMobile();
  const [scene, setScene] = useState("login");
  const [unlockStep, setUnlockStep] = useState("idle");
  const [bearPose, setBearPose] = useState("idle");
  const [bearClicks, setBearClicks] = useState(0);
  const [headingClicks, setHeadingClicks] = useState(0);
  const [toast, setToast] = useState("");
  const [bursts, setBursts] = useState([]);
  const [runId, setRunId] = useState(0);
  const [showLogin, setShowLogin] = useState(true);
  const [loginFading, setLoginFading] = useState(false);
  const musicRef = useRef(null);
  usePointerWorld(!reducedMotion);

  const showMain = scene === "main" || scene === "recap";
  const charged = false;
  const dimmed = false;

  const spawnBurst = useCallback((x, y, count = 8) => {
    const next = Array.from({ length: count }, (_, i) => ({
      id: `${Date.now()}-${i}-${Math.random()}`,
      x,
      y,
      dx: (Math.random() - 0.5) * 80,
      dy: -12 - Math.random() * 28,
      delay: i * 28,
      size: 10 + (i % 4) * 3,
      variant: i % 3 === 0 ? "outline" : "solid",
    }));
    const ids = next.map((item) => item.id);
    setBursts((current) => [...current, ...next]);
    window.setTimeout(() => {
      setBursts((current) => current.filter((item) => !ids.includes(item.id)));
    }, 800);
  }, []);

  const showToast = (text) => {
    setToast(text);
    window.setTimeout(() => setToast(""), 2600);
  };

  const startUnlock = () => {
    musicRef.current?.playForUnlock();
    setShowLogin(false);
    setLoginFading(false);
    setUnlockStep("done");
    setBearPose("birthday");
    setScene("main");
  };

  const onWrong = () => {
    setBearPose("shake");
    window.setTimeout(() => setBearPose("shy"), 500);
    window.setTimeout(() => setBearPose("idle"), 1600);
  };

  const onBearClick = () => {
    setBearClicks((count) => {
      const next = count + 1;
      if (next === 6) {
        setBearPose("hug");
        showToast(birthdayConfig.easterEggs.bearHug);
      } else if (next < 6) {
        setBearPose("wave");
        window.setTimeout(() => setBearPose((pose) => (pose === "hug" ? "hug" : "idle")), 700);
      }
      return next;
    });
  };

  const onHeadingClick = () => {
    setHeadingClicks((count) => {
      const next = count + 1;
      if (next === 5) {
        showToast(birthdayConfig.easterEggs.headingClicks);
        spawnBurst(window.innerWidth / 2, 160, 14);
      }
      return next;
    });
  };

  const startRecap = () => {
    setScene("recap");
  };

  const finishRecap = async () => {
    setScene("main");
    setUnlockStep("done");
    try {
      await Promise.race([
        musicRef.current?.fadeOut?.(1200) ?? Promise.resolve(),
        new Promise((resolve) => window.setTimeout(resolve, 1400)),
      ]);
    } catch {
      musicRef.current?.stop();
    }
    musicRef.current?.stop();
    setShowLogin(true);
    setLoginFading(false);
    setUnlockStep("idle");
    setBearPose("idle");
    setBearClicks(0);
    setHeadingClicks(0);
    setToast("");
    setBursts([]);
    setScene("login");
    setRunId((id) => id + 1);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const buttonLabel = useMemo(() => {
    if (unlockStep === "idle") return birthdayConfig.login.unlockButton;
    return birthdayConfig.login.rememberedButton;
  }, [unlockStep]);

  return (
    <div className={`app-shell living-shell ${showMain ? "is-open" : ""}`}>
      <MusicController ref={musicRef} />
      <HeartTrail active={!reducedMotion && scene !== "recap"} open={showMain} />
      {scene === "recap" && (
        <RecapSlideshow onDone={finishRecap} reducedMotion={reducedMotion} />
      )}
      <div className="app-root" key={runId}>
      <div className="glow-blobs" aria-hidden="true">
        <div className="glow-blob one" />
        <div className="glow-blob two" />
        <div className="glow-blob three" />
      </div>
      <CloudBand />
      <BackgroundParticles reducedMotion={reducedMotion} isMobile={isMobile} />

      {showLogin && (
        <LoginScreen
          pose={bearPose}
          buttonLabel={buttonLabel}
          locked={scene !== "login"}
          fading={loginFading}
          charged={charged}
          dimmed={dimmed}
          onUnlock={startUnlock}
          onWrong={onWrong}
          onBearClick={onBearClick}
        />
      )}

      {showMain && (
        <ExperienceJourney
          ready={scene !== "recap"}
          reducedMotion={reducedMotion}
          cinematic={false}
          compact={isMobile}
          onHeadingClick={onHeadingClick}
          onBearClick={onBearClick}
          bearPose={bearPose}
          onCakeBurst={(event) => spawnBurst(event.clientX, event.clientY, 10)}
          onHeartBurst={() => spawnBurst(window.innerWidth / 2, window.innerHeight * 0.42, 14)}
          onGiftOpen={() => spawnBurst(window.innerWidth / 2, window.innerHeight * 0.45, 18)}
          onReplay={startRecap}
        />
      )}

      <ClickableHearts onBurst={spawnBurst} />

      {bursts.map((burst) => (
        <span
          key={burst.id}
          className="click-burst"
          style={{
            left: burst.x + burst.dx,
            top: burst.y + burst.dy,
            animationDelay: `${burst.delay}ms`,
          }}
        >
          <HeartMark size={burst.size} variant={burst.variant} color={showMain ? "#c45c3e" : "#d4b483"} />
        </span>
      ))}

      {toast && <div className="egg-toast">{toast}</div>}
      </div>
    </div>
  );
}

function ClickableHearts({ onBurst }) {
  const hearts = [
    { left: "7%", top: "28%", size: 20, variant: "solid" },
    { left: "91%", top: "40%", size: 16, variant: "outline" },
    { left: "10%", top: "66%", size: 14, variant: "glow" },
    { left: "88%", top: "76%", size: 18, variant: "double" },
  ];

  return (
    <>
      {hearts.map((heart) => (
        <button
          key={`${heart.left}-${heart.top}`}
          className="floating-heart-btn"
          type="button"
          aria-label="Floating heart"
          onClick={(event) => onBurst(event.clientX, event.clientY, 7)}
          style={{ left: heart.left, top: heart.top }}
        >
          <HeartMark size={heart.size} variant={heart.variant} color="#d4b483" sparkle={heart.variant === "double"} />
        </button>
      ))}
    </>
  );
}
