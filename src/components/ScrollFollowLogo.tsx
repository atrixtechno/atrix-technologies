"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/Logo";
import { useTheme } from "@/components/ThemeProvider";

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

type Metrics = {
  left: number;
  top: number;
  width: number;
  height: number;
};

export function ScrollFollowLogo() {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const slotRef = useRef<HTMLDivElement>(null);
  const originRef = useRef<Metrics | null>(null);
  const rafRef = useRef(0);
  const [style, setStyle] = useState<React.CSSProperties | null>(null);
  const [compact, setCompact] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      setStyle(null);
      setCompact(false);
      return;
    }

    function measureOrigin() {
      const slot = slotRef.current;
      if (!slot) return;
      const ghost = slot.querySelector("[data-logo-ghost]") as HTMLElement | null;
      const target = ghost ?? slot;
      const rect = target.getBoundingClientRect();
      originRef.current = {
        left: rect.left,
        top: rect.top + window.scrollY,
        width: rect.width,
        height: rect.height,
      };
    }

    function update() {
      const origin = originRef.current;
      if (!origin) {
        measureOrigin();
        if (!originRef.current) return;
      }
      const o = originRef.current!;
      const scrollY = window.scrollY;
      const range = Math.max(300, window.innerHeight * 0.58);
      const t = easeOutCubic(clamp(scrollY / range, 0, 1));

      const endSize = window.innerWidth < 640 ? 52 : 64;
      const endLeft = 16;
      const endTop = 14;

      setCompact(t > 0.7);
      setStyle({
        position: "fixed",
        left: lerp(o.left, endLeft, t),
        top: lerp(o.top - scrollY, endTop, t),
        width: lerp(o.width, endSize, t),
        height: lerp(o.height, endSize, t),
        zIndex: 45,
        margin: 0,
        maxWidth: "none",
        pointerEvents: t > 0.12 ? "auto" : "none",
      });
    }

    function onFrame() {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(update);
    }

    function onResize() {
      measureOrigin();
      onFrame();
    }

    measureOrigin();
    update();

    window.addEventListener("scroll", onFrame, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("scroll", onFrame);
      window.removeEventListener("resize", onResize);
    };
  }, [reducedMotion, isLight]);

  const logoInner = (
    <Logo
      key={`${isLight ? "light" : "dark"}-${compact ? "mark" : "full"}`}
      variant={
        compact
          ? isLight
            ? "mark-light"
            : "mark"
          : isLight
            ? "full-light"
            : "full"
      }
      size={compact ? 64 : 560}
      fill
      priority
      className={reducedMotion || !compact ? "animate-float" : ""}
    />
  );

  if (reducedMotion) {
    return (
      <div className="animate-fade-scale relative mx-auto flex w-full max-w-[360px] items-center justify-center md:mx-0 md:-ml-6 md:max-w-none md:justify-start lg:-ml-10 xl:-ml-14">
        <div className="animate-glow pointer-events-none absolute inset-0 -m-10 rounded-full bg-[radial-gradient(circle,rgba(26,76,255,0.16),transparent_70%)] blur-2xl" />
        <div className="relative w-full max-w-[340px] sm:max-w-[400px] md:max-w-[480px] lg:max-w-[540px]">
          {logoInner}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={slotRef}
      className="animate-fade-scale relative mx-auto flex w-full max-w-[360px] items-center justify-center md:mx-0 md:-ml-6 md:max-w-none md:justify-start lg:-ml-10 xl:-ml-14"
    >
      <div
        data-logo-ghost
        className="invisible w-full max-w-[340px] sm:max-w-[400px] md:max-w-[480px] lg:max-w-[540px]"
        aria-hidden
      >
        <Logo
          variant={isLight ? "full-light" : "full"}
          size={560}
          className="w-full"
        />
      </div>

      {style && (
        <div
          className={`will-change-[left,top,width,height] ${
            compact
              ? "rounded-2xl bg-bg/85 p-1.5 shadow-[0_14px_40px_rgba(11,26,36,0.24)] ring-1 ring-line backdrop-blur-md"
              : ""
          }`}
          style={style}
        >
          {!compact && (
            <div className="animate-glow pointer-events-none absolute inset-0 -m-8 rounded-full bg-[radial-gradient(circle,rgba(26,76,255,0.16),transparent_70%)] blur-2xl" />
          )}
          {compact ? (
            <Link
              href="/"
              aria-label="ATRIX Technologies — volver arriba"
              className="relative block h-full w-full"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              {logoInner}
            </Link>
          ) : (
            <div className="relative h-full w-full">{logoInner}</div>
          )}
        </div>
      )}
    </div>
  );
}
