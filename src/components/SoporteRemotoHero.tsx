"use client";

import Image from "next/image";
import Link from "next/link";
import { site } from "@/content/site";
import { soporteRemotoPage } from "@/content/soporte-remoto";

type Props = {
  whatsappHref: string;
};

export function SoporteRemotoHero({ whatsappHref }: Props) {
  return (
    <section className="relative min-h-[88svh] overflow-hidden bg-[#050a16] text-white md:min-h-[92svh]">
      <Image
        src="/images/services/it-empresarial.jpg"
        alt=""
        fill
        priority
        className="object-cover object-center opacity-45"
        sizes="100vw"
        aria-hidden
      />
      <div className="hero-overlay absolute inset-0" />
      <div className="hero-glow absolute inset-0" />

      <div className="relative mx-auto flex min-h-[88svh] max-w-6xl flex-col justify-end px-5 pb-14 pt-28 sm:px-8 sm:pb-16 md:min-h-[92svh] md:justify-center md:pb-24 md:pt-32">
        <div className="animate-rise max-w-3xl">
          <p className="font-display text-[clamp(2.4rem,8vw,4.5rem)] font-extrabold leading-[0.9] tracking-[-0.04em]">
            {site.name}
          </p>
          <p className="mt-2 text-sm font-semibold tracking-[0.22em] text-white/65 uppercase">
            Technologies · {soporteRemotoPage.title}
          </p>

          <h1 className="font-display mt-8 max-w-3xl text-balance text-[1.75rem] font-bold leading-[1.12] tracking-[-0.03em] sm:text-4xl md:text-5xl md:leading-[1.05]">
            Tu departamento de sistemas, remoto y listo
          </h1>
          <p className="mt-5 max-w-xl text-pretty text-[15px] leading-relaxed text-white/75 sm:text-base md:text-lg">
            {soporteRemotoPage.lead}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center justify-center rounded-full px-7 py-3.5 text-[15px] font-semibold"
            >
              Solicitar por WhatsApp
            </a>
            <Link
              href="#servicios"
              className="btn-ghost-light inline-flex items-center justify-center rounded-full px-7 py-3.5 text-[15px] font-semibold"
            >
              Ver cobertura
            </Link>
          </div>
          <p className="mt-5 text-sm text-white/55">
            {site.coverage} · Windows · macOS
          </p>
        </div>
      </div>
    </section>
  );
}
