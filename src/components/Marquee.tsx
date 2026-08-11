"use client";

import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** Seconds for one full loop. */
  duration?: number;
  className?: string;
  /** Pause animation on hover. */
  pauseOnHover?: boolean;
};

/** Infinite horizontal marquee (right → left). Duplicates children for a seamless loop. */
export function Marquee({
  children,
  duration = 40,
  className = "",
  pauseOnHover = true,
}: Props) {
  return (
    <div
      className={`marquee group/marquee relative overflow-hidden ${className}`}
      style={{ ["--marquee-duration" as string]: `${duration}s` }}
    >
      <div
        className={`marquee-track flex w-max gap-4 ${
          pauseOnHover ? "group-hover/marquee:[animation-play-state:paused]" : ""
        }`}
      >
        <div className="flex shrink-0 gap-4">{children}</div>
        <div className="flex shrink-0 gap-4" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
