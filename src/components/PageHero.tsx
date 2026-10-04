import Link from "next/link";
import type { ReactNode } from "react";
import Image from "next/image";
import { ArrowIcon, WhatsAppIcon } from "@/components/ui";

type Action = { href: string; label: string };

type Props = {
  /** Etiqueta de la página: se muestra sobre la imagen, no encima del título. */
  eyebrow: string;
  title: ReactNode;
  lead: ReactNode;
  image?: string;
  imagePosition?: string;
  primary?: Action;
  secondary?: Action;
  meta?: ReactNode;
  children?: ReactNode;
};

/** Héroe de páginas internas: copy + monitor con la señal de la página. */
export function PageHero({
  eyebrow,
  title,
  lead,
  image,
  primary,
  secondary,
  meta,
  children,
}: Props) {
  const primaryExternal = primary?.href.startsWith("http");

  return (
    <section className="relative isolate overflow-hidden">

      <div
        className={`mx-auto grid max-w-[1240px] items-center gap-12 px-5 pt-28 pb-16 sm:px-8 lg:pt-32 lg:pb-24 ${
          image ? "lg:grid-cols-[minmax(0,6fr)_minmax(0,6fr)] lg:gap-14" : ""
        }`}
      >
        <div className="min-w-0 max-w-3xl">
          <h1 className="page-hero-title animate-rise">{title}</h1>
          <p className="animate-rise-delay mt-6 max-w-2xl text-lg leading-relaxed text-muted sm:text-xl">
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
                <Link href={secondary.href} className="btn btn-outline h-[3.25rem] px-6">
                  {secondary.label}
                  <ArrowIcon />
                </Link>
              )}
            </div>
          )}

          {meta && (
            <p className="animate-rise-delay-3 mt-8 inline-flex items-center gap-2 text-sm text-subtle">
              <span className="led" />
              {meta}
            </p>
          )}
          {children}
        </div>

        {image && (
          <div className="animate-rise-delay-2 min-w-0">
            <div className="stage relative aspect-[16/11]">
              <Image src={image} alt="" fill priority sizes="(max-width: 1024px) 100vw, 620px" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#070a10]/70 via-transparent to-transparent" />
              <span className="absolute bottom-5 left-5 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-[#0b0d12]">
                <span className="led" />
                {eyebrow}
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
