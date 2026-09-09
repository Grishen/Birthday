import { useRef } from "react";

export default function TiltCard({ as: Tag = "div", className = "", children, ...props }) {
  const ref = useRef(null);

  const onMove = (event) => {
    const node = ref.current;
    if (!node) return;
    const box = node.getBoundingClientRect();
    const x = (event.clientX - box.left) / box.width - 0.5;
    const y = (event.clientY - box.top) / box.height - 0.5;
    node.style.setProperty("--tilt-x", `${x * 16}`);
    node.style.setProperty("--tilt-y", `${y * -12}`);
  };

  const onLeave = () => {
    const node = ref.current;
    if (!node) return;
    node.style.setProperty("--tilt-x", "0");
    node.style.setProperty("--tilt-y", "0");
  };

  return (
    <Tag
      {...props}
      ref={ref}
      className={`tilt-card ${className}`}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      {children}
    </Tag>
  );
}
