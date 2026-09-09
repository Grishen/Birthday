import { useId } from "react";
import { HEART_D } from "./tokens";

export default function HeartMark({
  variant = "solid",
  color = "#d4b483",
  size = 24,
  className = "",
  sparkle = false,
}) {
  const uid = useId().replace(/:/g, "");
  const glowId = `${uid}-glow`;
  const isOutline = variant === "outline";
  const isGlow = variant === "glow";

  return (
    <svg
      className={`heart-mark ${className}`}
      width={size}
      height={size}
      viewBox="0 0 100 100"
      aria-hidden="true"
      style={{ color }}
    >
      {isGlow && (
        <defs>
          <filter id={glowId} x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      )}
      {variant === "double" && (
        <path d={HEART_D} transform="translate(6 4) scale(0.9)" fill="#3a3228" />
      )}
      <path
        d={HEART_D}
        fill={isOutline ? "none" : "currentColor"}
        stroke={isOutline || variant === "double" ? "currentColor" : "none"}
        strokeWidth={isOutline ? 4 : variant === "double" ? 3 : 0}
        filter={isGlow ? `url(#${glowId})` : undefined}
      />
      {sparkle && (
        <path fill="#fff8f0" d="M78 22l2.2 5.4 5.4 2.2-5.4 2.2L78 37.2l-2.2-5.4-5.4-2.2 5.4-2.2z" />
      )}
    </svg>
  );
}

export function GlowHeartBackdrop({ className = "" }) {
  const uid = useId().replace(/:/g, "");
  const fill = `${uid}-fill`;
  const soft = `${uid}-soft`;
  return (
    <svg className={`glow-heart-backdrop ${className}`} viewBox="0 0 100 100" aria-hidden="true">
      <defs>
        <radialGradient id={fill} cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor="#f0d8a6" />
          <stop offset="55%" stopColor="#d4b483" />
          <stop offset="100%" stopColor="#8a6a3a" />
        </radialGradient>
        <filter id={soft} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.4" />
        </filter>
      </defs>
      <path d={HEART_D} fill={`url(#${fill})`} opacity="0.5" filter={`url(#${soft})`} />
      <path d={HEART_D} fill={`url(#${fill})`} />
      <path d={HEART_D} fill="none" stroke="#fff8f0" strokeWidth="1.4" opacity="0.35" />
    </svg>
  );
}
