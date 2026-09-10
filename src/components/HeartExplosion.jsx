import { useEffect, useRef } from "react";
import { heartShades } from "../visual/tokens";

function drawHeart(ctx, size, style) {
  ctx.beginPath();
  const s = size;
  ctx.moveTo(0, s * 0.32);
  ctx.bezierCurveTo(0, -s * 0.12, -s * 0.56, -s * 0.12, -s * 0.56, s * 0.28);
  ctx.bezierCurveTo(-s * 0.56, s * 0.62, 0, s * 0.88, 0, s);
  ctx.bezierCurveTo(0, s * 0.88, s * 0.56, s * 0.62, s * 0.56, s * 0.28);
  ctx.bezierCurveTo(s * 0.56, -s * 0.12, 0, -s * 0.12, 0, s * 0.32);
  ctx.closePath();
  if (style === "outline") {
    ctx.stroke();
  } else {
    ctx.fill();
    if (style === "glow") {
      ctx.shadowColor = ctx.fillStyle;
      ctx.shadowBlur = 16;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }
}

function drawSpark(ctx, size) {
  ctx.beginPath();
  ctx.moveTo(0, -size);
  ctx.lineTo(size * 0.18, -size * 0.18);
  ctx.lineTo(size, 0);
  ctx.lineTo(size * 0.18, size * 0.18);
  ctx.lineTo(0, size);
  ctx.lineTo(-size * 0.18, size * 0.18);
  ctx.lineTo(-size, 0);
  ctx.lineTo(-size * 0.18, -size * 0.18);
  ctx.closePath();
  ctx.fill();
}

function drawPetal(ctx, size) {
  ctx.beginPath();
  ctx.ellipse(0, 0, size * 0.28, size * 0.5, 0.4, 0, Math.PI * 2);
  ctx.fill();
}

function makeParticle(cx, cy, wave, i) {
  const angle = (i / 18) * Math.PI * 2 + Math.random() * 0.5;
  const speedBase = wave === 1 ? 3.2 : wave === 5 ? 0.9 : 2.4;
  const speed = speedBase + Math.random() * (wave === 1 ? 6 : 8);
  const kinds = {
    1: ["heartGlow", "heartGlow", "heartSolid"],
    2: ["heartSolid", "heartOutline", "heartDouble"],
    3: ["confetti", "ribbon", "petal", "balloon"],
    4: ["spark", "spark", "star"],
    5: ["heartTiny", "petal"],
  };
  const kindList = kinds[wave];
  const kind = kindList[i % kindList.length];
  return {
    x: cx,
    y: cy,
    vx: Math.cos(angle) * speed * (wave === 5 ? 0.45 : 1),
    vy: Math.sin(angle) * speed * 0.85 - (wave === 1 ? 3.2 : 1.6),
    rot: Math.random() * 360,
    rotSpeed: (Math.random() - 0.5) * (wave === 3 ? 14 : 8),
    size: wave === 1 ? 18 + Math.random() * 22 : wave === 5 ? 5 + Math.random() * 8 : 7 + Math.random() * 16,
    life: 1,
    decay: wave === 5 ? 0.0035 : wave === 1 ? 0.007 : 0.008 + Math.random() * 0.01,
    delay: wave === 1 ? 0 : wave === 2 ? 8 : wave === 3 ? 14 : wave === 4 ? 20 : 28,
    kind,
    color: heartShades[i % heartShades.length],
    gravity: wave === 5 ? 0.02 : wave === 1 ? 0.06 : 0.085,
    bounce: wave === 3 && Math.random() > 0.7,
  };
}

export default function HeartExplosion({ active, reducedMotion, isMobile }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!active) return undefined;
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext("2d");
    let raf = 0;
    let frame = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();

    const scale = reducedMotion ? 0.25 : isMobile ? 0.55 : 1;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const particles = [];
    const waves = [
      { wave: 1, count: Math.round(28 * scale) },
      { wave: 2, count: Math.round(70 * scale) },
      { wave: 3, count: Math.round(80 * scale) },
      { wave: 4, count: Math.round(50 * scale) },
      { wave: 5, count: Math.round(36 * scale) },
    ];
    waves.forEach(({ wave, count }) => {
      for (let i = 0; i < count; i += 1) particles.push(makeParticle(cx, cy, wave, i));
    });

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;
      particles.forEach((p) => {
        if (frame < p.delay) return;
        if (p.life <= 0) return;
        alive = true;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.vx *= 0.993;
        if (p.bounce && p.y > canvas.height - 40 && p.vy > 0) p.vy *= -0.35;
        p.rot += p.rotSpeed;
        p.life -= p.decay;
        ctx.save();
        ctx.globalAlpha = Math.max(p.life, 0);
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rot * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 2;
        if (p.kind === "heartGlow") drawHeart(ctx, p.size, "glow");
        else if (p.kind === "heartOutline") drawHeart(ctx, p.size, "outline");
        else if (p.kind === "heartDouble") {
          drawHeart(ctx, p.size, "fill");
          ctx.globalAlpha *= 0.6;
          ctx.translate(p.size * 0.18, p.size * 0.08);
          drawHeart(ctx, p.size * 0.7, "fill");
        } else if (p.kind === "heartSolid" || p.kind === "heartTiny") drawHeart(ctx, p.size, "fill");
        else if (p.kind === "confetti") ctx.fillRect(-p.size / 3, -p.size / 7, p.size * 0.7, p.size * 0.26);
        else if (p.kind === "ribbon") {
          ctx.beginPath();
          ctx.moveTo(-p.size / 2, 0);
          ctx.quadraticCurveTo(0, p.size / 2.5, p.size / 2, 0);
          ctx.stroke();
        } else if (p.kind === "petal") drawPetal(ctx, p.size);
        else if (p.kind === "balloon") {
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size * 0.28, p.size * 0.42, 0, 0, Math.PI * 2);
          ctx.fill();
        } else drawSpark(ctx, p.size * 0.55);
        ctx.restore();
      });
      frame += 1;
      if (alive || frame < 40) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [active, reducedMotion, isMobile]);

  if (!active) return null;
  return <canvas ref={canvasRef} className="explosion-canvas" aria-hidden="true" />;
}
