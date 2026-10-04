"use client";

import { useEffect, useRef } from "react";

/**
 * Video de red (plexus) de fondo del héroe. Solo se descarga en pantallas
 * medianas o mayores, sin "ahorro de datos" ni movimiento reducido; en el resto
 * queda el fondo estático. En tema claro se invierte y se multiplica para que
 * el fondo oscuro desaparezca y solo queden las líneas en azul ATRIX.
 */
export function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    const allowed =
      window.matchMedia("(min-width: 768px)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
      !connection?.saveData;
    if (!allowed) return;

    video.src = "/video/hero.mp4";
    video.play().catch(() => {});

    // Pausa cuando el héroe sale de vista para no gastar batería.
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) video.play().catch(() => {});
      else video.pause();
    });
    io.observe(video);
    return () => io.disconnect();
  }, []);

  return (
    <div className="hero-video pointer-events-none absolute inset-0 -z-10" aria-hidden>
      <video ref={ref} muted loop playsInline preload="none" className="h-full w-full object-cover" />
    </div>
  );
}
