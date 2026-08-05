"use client";

import { Logo } from "@/components/Logo";
import { useTheme } from "@/components/ThemeProvider";
import { site } from "@/content/site";

export function ConferenciasHeroBrand() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <div className="animate-fade-scale relative mx-auto flex w-full max-w-xs flex-col items-center justify-end md:mx-0 md:max-w-none md:items-end">
      <div className="animate-glow pointer-events-none absolute inset-0 -m-6 rounded-full bg-[radial-gradient(circle,rgba(13,159,150,0.14),transparent_70%)] blur-2xl" />
      <Logo
        key={isLight ? "conf-full-light" : "conf-full-dark"}
        variant={isLight ? "full-light" : "full"}
        size={280}
        className="relative w-[min(100%,14rem)] md:w-[min(100%,18rem)]"
        priority
      />
      <p className="relative mt-4 text-center text-[11px] font-semibold tracking-[0.2em] text-muted uppercase md:text-right">
        {site.motto}
      </p>
    </div>
  );
}
