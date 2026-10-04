"use client";

import { useSyncExternalStore } from "react";

/** Reloj en vivo con la hora local de Nuevo Laredo. */

const clockFormat = new Intl.DateTimeFormat("es-MX", {
  timeZone: "America/Matamoros",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

function subscribeClock(onTick: () => void) {
  const id = window.setInterval(onTick, 1000);
  return () => window.clearInterval(id);
}

function readClock() {
  return clockFormat.format(new Date());
}

/** Hora en vivo HH:MM:SS; en el servidor devuelve un marcador neutro. */
export function useLiveClock() {
  return useSyncExternalStore(subscribeClock, readClock, () => "--:--:--");
}

export function LiveClock({ className = "" }: { className?: string }) {
  const time = useLiveClock();
  return (
    <time className={`osd tabular ${className}`} suppressHydrationWarning>
      {time}
    </time>
  );
}
