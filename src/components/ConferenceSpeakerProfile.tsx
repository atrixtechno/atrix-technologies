"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { ConferenceSpeaker } from "@/content/conferencias";
import { site, whatsappUrl } from "@/content/site";

type Props = {
  speaker: ConferenceSpeaker;
};

export function ConferenceSpeakerProfile({ speaker }: Props) {
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
    }, 3400);
    return () => window.clearInterval(id);
  }, [speaker.themes.length]);

  const [hero, ...gallery] = speaker.visuals;
  const mosaic = gallery.slice(0, 4);

  return (
    <article className="relative">
      <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:gap-14 lg:items-start">
        {/* Visual */}
        <div className="relative">
          <div className="relative aspect-[4/5] overflow-hidden sm:aspect-[5/6] lg:aspect-[4/5]">
            {hero && (
              <Image
                src={hero.src}
                alt={hero.alt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 42vw"
                priority={false}
              />
            )}
            <div
              className="absolute inset-0 bg-gradient-to-t from-[color-mix(in_srgb,var(--bg)_88%,transparent)] via-[color-mix(in_srgb,var(--bg)_25%,transparent)] to-transparent"
              aria-hidden
            />
            <div
              className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_15%,rgba(13,159,150,0.22),transparent_50%)]"
              aria-hidden
            />
            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
              <p className="text-[11px] font-semibold tracking-[0.22em] text-accent uppercase">
                01 · Quién imparte
              </p>
              <p className="mt-2 max-w-[16rem] text-sm leading-snug text-muted">
                Experiencia de campo en la frontera — la misma que nutre cada
                ejemplo en la sala.
              </p>
            </div>
          </div>

          {mosaic.length > 0 && (
            <ul className="mt-3 grid grid-cols-4 gap-2">
              {mosaic.map((visual) => (
                <li
                  key={visual.src}
                  className="relative aspect-[4/3] overflow-hidden"
                >
                  <Image
                    src={visual.src}
                    alt={visual.alt}
                    fill
                    className="object-cover transition duration-500 hover:scale-[1.05]"
                    sizes="10vw"
                  />
                  <span className="sr-only">{visual.caption ?? visual.alt}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Copy */}
        <div className="min-w-0 lg:pt-2">
          <p className="text-[11px] font-semibold tracking-[0.22em] text-accent uppercase lg:hidden">
            01 · Quién imparte
          </p>
          <h3 className="font-display mt-3 text-3xl font-bold tracking-tight sm:text-4xl lg:mt-0">
            {speaker.name}
          </h3>
          <p className="mt-3 text-sm font-medium text-muted sm:text-base">
            {speaker.role}
          </p>

          <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 border-y border-line py-4">
            {speaker.badges.map((badge) => (
              <span
                key={badge}
                className="text-xs font-semibold tracking-[0.12em] text-fg uppercase"
              >
                {badge}
              </span>
            ))}
          </div>

          <div className="mt-6 space-y-3 text-sm leading-relaxed text-muted md:text-base">
            {speaker.copy.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>

          {/* Rotating talk theme — intentional motion */}
          <div className="mt-8">
            <p className="text-[11px] font-semibold tracking-[0.18em] text-signal uppercase">
              Temas que imparte
            </p>
            <div
              className={`mt-3 min-h-[2.75rem] transition-all duration-300 ease-out ${
                chipVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-1.5 opacity-0"
              }`}
              aria-live="polite"
            >
              <p className="font-display text-lg font-semibold tracking-tight text-fg sm:text-xl">
                {speaker.themes[themeIndex]}
              </p>
            </div>
            <div className="mt-4 flex gap-1.5" aria-hidden>
              {speaker.themes.map((themeLabel, i) => (
                <span
                  key={themeLabel}
                  className={`h-0.5 w-7 transition-colors duration-300 ${
                    i === themeIndex ? "bg-accent" : "bg-line"
                  }`}
                />
              ))}
            </div>
          </div>

          <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-line pt-7 sm:grid-cols-4">
            {speaker.stats.map((stat) => (
              <div key={stat.label}>
                <dt className="text-[10px] font-semibold tracking-[0.14em] text-muted uppercase">
                  {stat.label}
                </dt>
                <dd className="font-display mt-1.5 text-xl font-bold tracking-tight text-fg">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
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
              className="inline-flex items-center justify-center rounded-full border border-line px-6 py-3 text-sm font-semibold text-fg transition hover:border-accent/40 hover:bg-bg-elevated"
            >
              Formulario de contacto
            </Link>
            <a
              href="#temas"
              className="inline-flex items-center justify-center px-2 py-3 text-sm font-semibold text-accent transition hover:brightness-110 sm:px-3"
            >
              Ver temario →
            </a>
          </div>
          <p className="mt-4 text-xs text-muted">
            Respuesta directa al {site.phoneDisplay} · {site.coverage}
          </p>
        </div>
      </div>
    </article>
  );
}
