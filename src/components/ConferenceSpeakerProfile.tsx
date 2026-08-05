"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo } from "@/components/Logo";
import { useTheme } from "@/components/ThemeProvider";
import type { ConferenceSpeaker } from "@/content/conferencias";
import { site, whatsappUrl } from "@/content/site";

type Props = {
  speaker: ConferenceSpeaker;
};

export function ConferenceSpeakerProfile({ speaker }: Props) {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const [themeIndex, setThemeIndex] = useState(0);
  const [chipVisible, setChipVisible] = useState(true);
  const wa = whatsappUrl(speaker.whatsappMessage);

  useEffect(() => {
    if (speaker.themes.length < 2) return;
    const id = window.setInterval(() => {
      setChipVisible(false);
      window.setTimeout(() => {
        setThemeIndex((i) => (i + 1) % speaker.themes.length);
        setChipVisible(true);
      }, 280);
    }, 3200);
    return () => window.clearInterval(id);
  }, [speaker.themes.length]);

  const [hero, ...gallery] = speaker.visuals;

  return (
    <article className="relative overflow-hidden border border-line bg-bg-elevated/60">
      <div
        className="pointer-events-none absolute -right-20 -top-24 h-56 w-56 rounded-full bg-accent/12 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-28 -left-16 h-64 w-64 rounded-full bg-signal/10 blur-3xl"
        aria-hidden
      />

      <div className="relative grid lg:grid-cols-[1.05fr_0.95fr]">
        {/* Visual column */}
        <div className="relative min-h-[280px] border-b border-line lg:min-h-[420px] lg:border-r lg:border-b-0">
          {hero && (
            <Image
              src={hero.src}
              alt={hero.alt}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 55vw"
              priority={false}
            />
          )}
          <div
            className="absolute inset-0 bg-gradient-to-t from-[color-mix(in_srgb,var(--bg)_92%,transparent)] via-[color-mix(in_srgb,var(--bg)_45%,transparent)] to-transparent"
            aria-hidden
          />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(13,159,150,0.18),transparent_55%)]" aria-hidden />

          <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7">
            <div className="flex items-end justify-between gap-4">
              <div className="min-w-0">
                <p className="text-[11px] font-semibold tracking-[0.2em] text-accent uppercase">
                  Conferencista principal
                </p>
                <p className="mt-2 max-w-xs text-sm text-muted">
                  Experiencia real de campo — la misma que alimenta cada charla ATRIX.
                </p>
              </div>
              <Logo
                key={isLight ? "speaker-mark-light" : "speaker-mark-dark"}
                variant={isLight ? "mark-light" : "mark"}
                size={52}
                className="shrink-0 drop-shadow-[0_8px_24px_rgba(0,0,0,0.35)]"
              />
            </div>
          </div>
        </div>

        {/* Copy column */}
        <div className="relative flex flex-col p-6 sm:p-8 md:p-10">
          <h3 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
            {speaker.name}
          </h3>
          <p className="mt-2 text-xs font-semibold tracking-[0.14em] text-muted uppercase">
            {speaker.role}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {speaker.badges.map((badge) => (
              <span
                key={badge}
                className="rounded-full border border-line px-3 py-1 text-xs font-semibold text-fg"
              >
                {badge}
              </span>
            ))}
          </div>

          {/* Rotating talk theme */}
          <div className="mt-6 border-t border-line pt-5">
            <p className="text-[11px] font-semibold tracking-[0.18em] text-signal uppercase">
              Temas que imparte
            </p>
            <div
              className={`mt-3 min-h-[3.25rem] transition-all duration-300 ease-out ${
                chipVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-1 opacity-0"
              }`}
              aria-live="polite"
            >
              <span className="inline-flex max-w-full rounded-full border border-accent/35 bg-accent/10 px-4 py-2 text-sm font-semibold text-fg">
                {speaker.themes[themeIndex]}
              </span>
            </div>
            <div className="mt-3 flex gap-1.5" aria-hidden>
              {speaker.themes.map((themeLabel, i) => (
                <span
                  key={themeLabel}
                  className={`h-1 w-5 rounded-full transition-colors ${
                    i === themeIndex ? "bg-accent" : "bg-line"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="mt-6 space-y-3 text-sm leading-relaxed text-muted md:text-base">
            {speaker.copy.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>

          {/* Stats */}
          <dl className="mt-7 grid grid-cols-2 gap-4 border-t border-line pt-6 sm:grid-cols-4">
            {speaker.stats.map((stat) => (
              <div key={stat.label}>
                <dt className="text-[10px] font-semibold tracking-[0.14em] text-muted uppercase">
                  {stat.label}
                </dt>
                <dd className="font-display mt-1 text-lg font-bold tracking-tight text-fg sm:text-xl">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>

          {/* CTAs */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-ink shadow-[0_12px_32px_rgba(13,159,150,0.28)] transition hover:brightness-110"
            >
              WhatsApp · Agendar plática
            </a>
            <Link
              href="/#contacto"
              className="inline-flex items-center justify-center rounded-full border border-line px-6 py-3 text-sm font-semibold text-fg transition hover:border-accent/40 hover:bg-bg"
            >
              Formulario de contacto
            </Link>
            <a
              href="#temas"
              className="inline-flex items-center justify-center rounded-full border border-transparent px-4 py-3 text-sm font-semibold text-accent transition hover:brightness-110"
            >
              Ver temario →
            </a>
          </div>
          <p className="mt-4 text-xs text-muted">
            Respuesta directa al {site.phoneDisplay} · {site.coverage}
          </p>
        </div>
      </div>

      {/* Project / brand mosaic */}
      {gallery.length > 0 && (
        <div className="relative border-t border-line">
          <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-3 sm:px-8">
            <p className="text-[11px] font-semibold tracking-[0.18em] text-muted uppercase">
              Trabajo real detrás de las charlas
            </p>
            <Link
              href="/proyectos"
              className="text-xs font-semibold text-accent transition hover:brightness-110"
            >
              Ver proyectos →
            </Link>
          </div>
          <ul className="grid grid-cols-2 sm:grid-cols-4">
            {gallery.map((visual, index) => (
              <li
                key={visual.src}
                className={`relative aspect-[4/3] overflow-hidden border-line ${
                  index % 2 === 1 ? "border-l" : ""
                } ${index >= 2 ? "border-t" : ""} sm:border-t-0 ${
                  index > 0 ? "sm:border-l" : ""
                }`}
              >
                <Image
                  src={visual.src}
                  alt={visual.alt}
                  fill
                  className="object-cover transition duration-500 hover:scale-[1.04]"
                  sizes="(max-width: 640px) 50vw, 25vw"
                />
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[color-mix(in_srgb,var(--bg)_55%,transparent)] to-transparent opacity-80"
                  aria-hidden
                />
                <span className="absolute bottom-2 left-2 right-2 truncate text-[10px] font-semibold tracking-wide text-fg/90 uppercase">
                  {visual.caption ?? visual.alt}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}
