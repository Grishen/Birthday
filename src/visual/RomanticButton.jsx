import HeartMark from "./HeartMark";

export default function RomanticButton({
  children,
  className = "",
  onClick,
  type = "button",
  disabled = false,
}) {
  const burst = (event) => {
    const btn = event.currentTarget;
    btn.classList.add("is-burst");
    window.setTimeout(() => btn.classList.remove("is-burst"), 520);
    onClick?.(event);
  };

  return (
    <button type={type} className={`romantic-btn ${className}`} onClick={burst} disabled={disabled}>
      <HeartMark size={16} variant="solid" className="btn-heart left" />
      <span>{children}</span>
      <HeartMark size={16} variant="solid" className="btn-heart right" />
      <span className="btn-sparkles" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
    </button>
  );
}
