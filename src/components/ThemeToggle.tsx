"use client";

import { useTheme } from "@/components/ThemeProvider";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme, ready } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Cambiar a tema claro" : "Cambiar a tema oscuro"}
      title={isDark ? "Tema claro" : "Tema oscuro"}
      className={`group relative inline-flex h-10 items-center gap-2 overflow-hidden rounded-full border border-line bg-bg-elevated/80 px-2.5 text-fg shadow-[0_0_0_1px_rgba(26,107,255,0.1)] backdrop-blur transition hover:border-accent/45 hover:shadow-[0_0_24px_rgba(26,107,255,0.22)] ${className}`}
    >
      <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,transparent,rgba(26,107,255,0.1),transparent)] opacity-0 transition group-hover:opacity-100" />

      <span
        className={`relative inline-flex h-6 w-6 items-center justify-center rounded-full transition ${
          isDark
            ? "bg-accent text-white shadow-[0_0_16px_rgba(26,107,255,0.5)]"
            : "bg-accent/15 text-accent-deep"
        }`}
      >
        {isDark ? (
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" aria-hidden>
            <path
              d="M21 14.5A8.5 8.5 0 0 1 9.5 3 7 7 0 1 0 21 14.5Z"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" aria-hidden>
            <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.7" />
            <path
              d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.05 5.05l1.55 1.55M17.4 17.4l1.55 1.55M18.95 5.05l-1.55 1.55M6.6 17.4l-1.55 1.55"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
            />
          </svg>
        )}
      </span>

      <span className="relative hidden pr-1.5 font-mono text-[10px] font-semibold tracking-[0.18em] text-muted uppercase sm:inline">
        {ready ? (isDark ? "DARK" : "LIGHT") : "···"}
      </span>
    </button>
  );
}
