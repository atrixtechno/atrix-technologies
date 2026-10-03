import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowIcon, WhatsAppIcon } from "@/components/ui";

type Action = { href: string; label: string };

type Props = {
  eyebrow: string;
  title: ReactNode;
  lead: ReactNode;
  image?: string;
  imagePosition?: string;
  /** CTA principal (WhatsApp externo si empieza con http). */
  primary?: Action;
  secondary?: Action;
  meta?: ReactNode;
  children?: ReactNode;
};

/** Héroe oscuro compartido por las páginas internas. */
export function PageHero({
  eyebrow,
  title,
  lead,
  image,
  imagePosition = "center",
  primary,
  secondary,
  meta,
  children,
}: Props) {
  const primaryExternal = primary?.href.startsWith("http");

  return (
    <section className="relative isolate overflow-hidden bg-[#05070d] text-white">
      {image && (
        <Image
          src={image}
          alt=""
          fill
          priority
          className="-z-20 object-cover opacity-35 [filter:saturate(0.7)_hue-rotate(-8deg)]"
          style={{ objectPosition: imagePosition }}
          sizes="100vw"
          aria-hidden
        />
      )}
      <div className="hero-overlay pointer-events-none absolute inset-0 -z-10" />
      <div className="hero-grid pointer-events-none absolute inset-0 -z-10" />
      <div className="pointer-events-none absolute -top-40 right-[-10%] -z-10 h-[34rem] w-[46rem] rounded-full bg-[radial-gradient(closest-side,rgba(59,130,255,0.3),transparent)] blur-2xl" />

      <div className="relative mx-auto flex min-h-[78svh] max-w-[1240px] flex-col justify-end px-5 pt-32 pb-16 sm:px-8 md:min-h-[82svh] md:justify-center md:pb-24">
        <div className="max-w-3xl">
          <p className="chip chip-dark animate-rise">
            <span className="live-dot" aria-hidden />
            {eyebrow}
          </p>
          <h1 className="page-hero-title animate-rise-delay mt-6">{title}</h1>
          <p className="animate-rise-delay-2 mt-6 max-w-2xl text-pretty text-base leading-relaxed text-[#aab6cf] sm:text-lg">
            {lead}
          </p>

          {(primary || secondary) && (
            <div className="animate-rise-delay-2 mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              {primary &&
                (primaryExternal ? (
                  <a
                    href={primary.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary h-[3.25rem] px-6"
                  >
                    <WhatsAppIcon />
                    {primary.label}
                  </a>
                ) : (
                  <Link href={primary.href} className="btn btn-primary h-[3.25rem] px-6">
                    {primary.label}
                    <ArrowIcon />
                  </Link>
                ))}
              {secondary && (
                <Link href={secondary.href} className="btn btn-ghost-light h-[3.25rem] px-6">
                  {secondary.label}
                  <ArrowIcon />
                </Link>
              )}
            </div>
          )}

          {meta && (
            <p className="mono animate-rise-delay-3 mt-8 text-[11px] tracking-[0.14em] text-[#7d8aa6] uppercase">
              {meta}
            </p>
          )}
          {children}
        </div>
      </div>
      <div className="glow-divider absolute inset-x-0 bottom-0" aria-hidden />
    </section>
  );
}
