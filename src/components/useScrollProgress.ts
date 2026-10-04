"use client";

import { useEffect, useRef } from "react";

type Mode =
  /** De que el borde superior entra por abajo hasta que llega al 15% del viewport. */
  | "enter"
  /** Sección alta con hijo `sticky`: 0 al fijarse, 1 al soltarse. */
  | "sticky";

/**
 * Escribe `--sp` (0..1) en el elemento según el avance del scroll y, si se pasa,
 * llama a `onProgress`. Un solo listener pasivo + rAF; se pausa fuera de vista.
 */
export function useScrollProgress<T extends HTMLElement>(
  mode: Mode,
  onProgress?: (p: number) => void,
) {
  const ref = useRef<T>(null);
  const cb = useRef(onProgress);

  useEffect(() => {
    cb.current = onProgress;
  }, [onProgress]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Con movimiento reducido el acercamiento queda fijo; las escenas fijadas siguen
    // cambiando (el CSS les quita el desplazamiento y deja solo el cambio de escena).
    if (mode === "enter" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.setProperty("--sp", "1");
      cb.current?.(1);
      return;
    }

    let raf = 0;
    let visible = false;

    const measure = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      let p: number;
      if (mode === "sticky") {
        const travel = r.height - vh;
        p = travel > 0 ? -r.top / travel : 0;
      } else {
        p = (vh - r.top) / (vh * 0.85);
      }
      p = Math.max(0, Math.min(1, p));
      el.style.setProperty("--sp", p.toFixed(4));
      cb.current?.(p);
    };

    const onScroll = () => {
      if (visible && !raf) raf = requestAnimationFrame(measure);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) onScroll();
      },
      { rootMargin: "20% 0px 20% 0px" },
    );
    io.observe(el);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    measure();

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [mode]);

  return ref;
}
