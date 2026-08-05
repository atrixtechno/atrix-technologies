"use client";

import Link from "next/link";
import { Logo } from "@/components/Logo";
import { useTheme } from "@/components/ThemeProvider";
import { conferenceBacking } from "@/content/conferencias";
import { site } from "@/content/site";

export function ConferenceBacking() {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const backing = conferenceBacking;

  return (
    <article className="relative border-t border-line pt-14 md:pt-20">
      <div className="grid gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:gap-14 lg:items-start">
        {/* Brand column */}
        <div className="relative overflow-hidden px-6 py-10 sm:px-8 sm:py-12">
          <div
            className="pointer-events-none absolute inset-0 bg-bg-elevated/55"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full bg-accent/12 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-20 -left-12 h-56 w-56 rounded-full bg-signal/8 blur-3xl"
            aria-hidden
          />
          <div className="grid-tech pointer-events-none absolute inset-0 opacity-25" />
          <div className="relative">
            <p className="text-[11px] font-semibold tracking-[0.22em] text-accent uppercase">
              02 · {backing.eyebrow}
            </p>
            <div className="mt-8 max-w-[220px]">
              <Logo
                key={isLight ? "backing-lockup-light" : "backing-lockup-dark"}
                variant={isLight ? "lockup-light" : "lockup"}
                size={200}
                className="opacity-95"
              />
            </div>
            <h3 className="font-display mt-8 text-2xl font-bold tracking-tight sm:text-3xl">
              {backing.name}
            </h3>
            <p className="mt-3 text-sm text-muted">{backing.role}</p>
            <div className="animate-line mt-6 h-px w-16 bg-accent/50" />
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted">
              {backing.lead}
            </p>
            <p className="mt-7 text-xs font-semibold tracking-[0.14em] text-signal uppercase">
              {site.coverage}
            </p>
          </div>
        </div>

        {/* Capabilities narrative */}
        <div className="min-w-0 lg:pt-1">
          <div className="max-w-xl space-y-4 text-sm leading-relaxed text-muted md:text-base">
            {backing.copy.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>

          <ul className="mt-10 divide-y divide-line border-y border-line">
            {backing.capabilities.map((item, index) => (
              <li
                key={item.label}
                className="group grid gap-1 py-5 transition sm:grid-cols-[10rem_1fr] sm:items-baseline sm:gap-6"
              >
                <p className="flex items-baseline gap-3 text-sm font-semibold text-fg">
                  <span className="text-[10px] font-semibold tracking-[0.16em] text-signal uppercase tabular-nums">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {item.label}
                </p>
                <p className="pl-7 text-sm leading-relaxed text-muted sm:pl-0">
                  {item.detail}
                </p>
              </li>
            ))}
          </ul>

          <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-3">
            <Link
              href="/proyectos"
              className="text-sm font-semibold text-accent transition hover:brightness-110"
            >
              Ver proyectos reales →
            </Link>
            <Link
              href="/#servicios"
              className="text-sm font-semibold text-fg transition hover:text-accent"
            >
              Servicios ATRIX
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
