import { useEffect } from "react";

export function usePointerWorld(enabled = true) {
  useEffect(() => {
    const root = document.documentElement;
    if (!enabled) {
      root.style.setProperty("--px", "0");
      root.style.setProperty("--py", "0");
      root.classList.remove("living");
      return undefined;
    }

    root.classList.add("living");
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;
    let raf = 0;

    const onPointer = (event) => {
      const w = window.innerWidth || 1;
      const h = window.innerHeight || 1;
      tx = (event.clientX / w) * 2 - 1;
      ty = (event.clientY / h) * 2 - 1;
    };

    const tick = () => {
      cx += (tx - cx) * 0.07;
      cy += (ty - cy) * 0.07;
      root.style.setProperty("--px", cx.toFixed(4));
      root.style.setProperty("--py", cy.toFixed(4));
      raf = window.requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onPointer, { passive: true });
    raf = window.requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onPointer);
      window.cancelAnimationFrame(raf);
      root.classList.remove("living");
      root.style.setProperty("--px", "0");
      root.style.setProperty("--py", "0");
    };
  }, [enabled]);
}
