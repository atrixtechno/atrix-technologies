"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
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

type Origin = {
  left: number;
  top: number;
  width: number;
  height: number;
};

/**
 * Logo del hero: permanece en pantalla al hacer scroll y se reduce hasta un mark compacto.
 */
export function ScrollFollowLogo() {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const slotRef = useRef<HTMLDivElement>(null);
  const originRef = useRef<Origin | null>(null);
  const rafRef = useRef(0);
  const [mounted, setMounted] = useState(false);
  const [style, setStyle] = useState<React.CSSProperties | null>(null);
  const [progress, setProgress] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      setStyle(null);
      setProgress(0);
      return;
    }

    function measureOrigin() {
      const slot = slotRef.current;
      if (!slot || window.scrollY > 4) return;
      const ghost = slot.querySelector("[data-logo-ghost]") as HTMLElement | null;
      const rect = (ghost ?? slot).getBoundingClientRect();
      originRef.current = {
        left: rect.left,
        top: rect.top,
        width: Math.min(rect.width, window.innerWidth - 32),
        height: rect.height,
      };
    }

    function update() {
      if (!originRef.current) measureOrigin();
      const o = originRef.current;
      if (!o) return;

      const mobile = window.innerWidth < 768;
      const range = Math.max(mobile ? 280 : 380, window.innerHeight * (mobile ? 0.55 : 0.7));
      const t = easeOutCubic(clamp(window.scrollY / range, 0, 1));

      const endSize = mobile ? 44 : 56;
      const endLeft = mobile
        ? Math.max(8, window.innerWidth - endSize - 14)
        : 18;
      const endTop = 10;

      const width = lerp(o.width, endSize, t);
      const height = lerp(o.height, endSize, t);
      let left = lerp(o.left, endLeft, t);
      let top = lerp(o.top, endTop, t);

      // Nunca salirse del viewport
      left = clamp(left, 8, Math.max(8, window.innerWidth - width - 8));
      top = clamp(top, 8, Math.max(8, window.innerHeight - height - 8));

      setProgress(t);
      document.documentElement.dataset.logoDocked = t > 0.45 ? "1" : "0";
      setStyle({
        position: "fixed",
        left,
        top,
        width,
        height,
        zIndex: 60,
        margin: 0,
        maxWidth: "100%",
        pointerEvents: t > 0.05 ? "auto" : "none",
      });
    }

    function onFrame() {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(update);
    }

    function onResize() {
      originRef.current = null;
      if (window.scrollY <= 4) measureOrigin();
      onFrame();
    }

    measureOrigin();
    update();
    const boot = window.setTimeout(() => {
      originRef.current = null;
      measureOrigin();
      update();
    }, 120);

    window.addEventListener("scroll", onFrame, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.clearTimeout(boot);
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("scroll", onFrame);
      window.removeEventListener("resize", onResize);
      delete document.documentElement.dataset.logoDocked;
    };
  }, [reducedMotion, isLight]);

  const compact = progress > 0.5;

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
      className={reducedMotion || progress < 0.04 ? "animate-float" : ""}
    />
  );

  const floating =
    mounted &&
    style &&
    createPortal(
      <div
        className={`will-change-[left,top,width,height] ${
          compact
            ? "rounded-2xl bg-bg/90 p-1 shadow-[0_14px_40px_rgba(11,26,36,0.28)] ring-1 ring-line backdrop-blur-md"
            : ""
        }`}
        style={style}
      >
        {progress < 0.5 && (
          <div
            className="pointer-events-none absolute inset-0 -m-6 rounded-full bg-[radial-gradient(circle,rgba(26,76,255,0.16),transparent_70%)] blur-2xl sm:-m-8"
            style={{ opacity: Math.max(0, 1 - progress * 1.4) }}
          />
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
      </div>,
      document.body,
    );

  if (reducedMotion) {
    return (
      <div className="animate-fade-scale relative mx-auto flex w-full max-w-[280px] items-center justify-center sm:max-w-[340px] md:mx-0 md:-ml-6 md:max-w-none md:justify-start lg:-ml-10 xl:-ml-14">
        <div className="animate-glow pointer-events-none absolute inset-0 -m-6 rounded-full bg-[radial-gradient(circle,rgba(26,76,255,0.16),transparent_70%)] blur-2xl sm:-m-10" />
        <div className="relative w-full max-w-[260px] sm:max-w-[340px] md:max-w-[480px] lg:max-w-[540px]">
          {logoInner}
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        ref={slotRef}
        className="animate-fade-scale relative mx-auto flex w-full max-w-[280px] items-center justify-center sm:max-w-[360px] md:mx-0 md:-ml-6 md:max-w-none md:justify-start lg:-ml-10 xl:-ml-14"
      >
        <div
          data-logo-ghost
          className="invisible w-full max-w-[260px] sm:max-w-[340px] md:max-w-[480px] lg:max-w-[540px]"
          aria-hidden
        >
          <Logo
            variant={isLight ? "full-light" : "full"}
            size={560}
            className="w-full"
          />
        </div>
      </div>
      {floating}
    </>
  );
}
