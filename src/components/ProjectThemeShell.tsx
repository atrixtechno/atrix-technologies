"use client";

import type { CSSProperties, ReactNode } from "react";
import { useTheme } from "@/components/ThemeProvider";
import type { ProjectTheme } from "@/content/projects";

function fallbackDark(theme: ProjectTheme): ProjectTheme {
  return {
    bg: "#030912",
    bgElevated: "#0a1522",
    fg: "#f2fffc",
    muted: "#8aa4b0",
    accent: theme.accent,
    accentInk: theme.accentInk,
    glow: theme.glow,
  };
}

export function ProjectThemeShell({
  theme,
  themeDark,
  children,
}: {
  theme: ProjectTheme;
  themeDark?: ProjectTheme;
  children: ReactNode;
}) {
  const { theme: mode } = useTheme();
  const active = mode === "dark" ? (themeDark ?? fallbackDark(theme)) : theme;

  return (
    <div
      style={
        {
          "--bg": active.bg,
          "--bg-elevated": active.bgElevated,
          "--fg": active.fg,
          "--muted": active.muted,
          "--accent": active.accent,
          "--accent-ink": active.accentInk,
          "--line":
            mode === "dark"
              ? "rgba(242, 255, 252, 0.1)"
              : `${active.fg}18`,
          "--signal": active.accent,
          "--project-glow": active.glow,
        } as CSSProperties
      }
      className="min-h-screen bg-[var(--bg)] text-[var(--fg)] transition-colors duration-300"
      data-project-theme={mode}
    >
      {children}
    </div>
  );
}
