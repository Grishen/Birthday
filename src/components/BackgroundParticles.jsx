import { useEffect, useRef } from "react";
import { heartShades } from "../visual/tokens";

function drawHeart(ctx, size) {
  ctx.beginPath();
  ctx.moveTo(0, size * 0.3);
  ctx.bezierCurveTo(0, -size * 0.1, -size * 0.5, -size * 0.1, -size * 0.5, size * 0.28);
  ctx.bezierCurveTo(-size * 0.5, size * 0.58, 0, size * 0.82, 0, size);
  ctx.bezierCurveTo(0, size * 0.82, size * 0.5, size * 0.58, size * 0.5, size * 0.28);
  ctx.bezierCurveTo(size * 0.5, -size * 0.1, 0, -size * 0.1, 0, size * 0.3);
  ctx.fill();
}

function spawn(width, height, kind) {
  return {
    x: Math.random() * width,
    y: height + Math.random() * 90,
    size: kind === "spark" ? 5 + Math.random() * 7 : 8 + Math.random() * 16,
    speed: 0.18 + Math.random() * 0.55,
    drift: (Math.random() - 0.5) * 0.4,
    rot: Math.random() * Math.PI * 2,
    rotSpeed: (Math.random() - 0.5) * 0.012,
    alpha: 0.18 + Math.random() * 0.45,
    kind,
    color: kind === "spark" ? "#fff8f0" : heartShades[Math.floor(Math.random() * heartShades.length)],
  };
}

export default function BackgroundParticles({ reducedMotion, isMobile }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext("2d");
    let frame = 0;
    let raf = 0;
    const count = reducedMotion ? 6 : isMobile ? 12 : 22;
    let particles = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const seed = () => {
      particles = Array.from({ length: count }, (_, i) => {
        const kind = i % 6 === 0 ? "petal" : i % 5 === 0 ? "spark" : i % 8 === 0 ? "balloon" : "heart";
        const p = spawn(canvas.width, canvas.height, kind);
        p.y = Math.random() * canvas.height;
        return p;
      });
    };

    resize();
    seed();
    window.addEventListener("resize", resize);

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        if (!reducedMotion) {
          p.y -= p.speed;
          p.x += Math.sin(frame * 0.008 + p.y * 0.012) * p.drift;
          p.rot += p.rotSpeed;
          if (p.y < -40) Object.assign(p, spawn(canvas.width, canvas.height, p.kind));
        }
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        if (p.kind === "heart") drawHeart(ctx, p.size);
        else if (p.kind === "petal") {
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size * 0.25, p.size * 0.45, 0.5, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.kind === "balloon") {
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size * 0.28, p.size * 0.4, 0, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.moveTo(0, -p.size);
          ctx.lineTo(p.size * 0.16, 0);
          ctx.lineTo(0, p.size);
          ctx.lineTo(-p.size * 0.16, 0);
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();
      });
      frame += 1;
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [reducedMotion, isMobile]);

  return <canvas ref={canvasRef} className="particles-canvas" aria-hidden="true" />;
}
