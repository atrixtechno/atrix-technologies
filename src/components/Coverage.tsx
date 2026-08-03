import Image from "next/image";
import { pillars, promises, values } from "@/content/services";
import { site } from "@/content/site";

export function Coverage() {
  return (
    <section id="cobertura" className="scroll-mt-10 border-t border-line">
      <div className="relative overflow-hidden border-b border-line">
        <Image
          src="/brand/atrix-services-banner.png"
          alt="ATRIX Technologies — soluciones tecnológicas para hogares y empresas"
          width={1024}
          height={426}
          className="h-auto w-full object-cover object-left md:max-h-[320px]"
          priority={false}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-bg via-bg/20 to-bg/70" />
      </div>

      <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-20">
        <p className="text-xs font-semibold tracking-[0.28em] text-accent uppercase">
          Cobertura
        </p>
        <h2 className="font-display mt-4 max-w-2xl text-3xl font-bold tracking-tight md:text-4xl">
          Servicio en {site.coverage}
        </h2>

        <ul className="mt-10 grid gap-6 md:grid-cols-3">
          {promises.map((item) => (
            <li key={item.title} className="border-t border-line pt-5">
              <h3 className="font-display text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{item.copy}</p>
            </li>
          ))}
        </ul>

        <ul className="mt-12 grid gap-4 sm:grid-cols-3">
          {pillars.map((item) => (
            <li
              key={item.title}
              className="border border-line bg-bg-elevated/50 px-5 py-5"
            >
              <h3 className="font-display text-base font-semibold text-signal">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-muted">{item.copy}</p>
            </li>
          ))}
        </ul>

        <div className="mt-10 flex flex-wrap gap-2">
          {values.map((value) => (
            <span
              key={value}
              className="rounded-full border border-line px-4 py-2 text-[11px] font-semibold tracking-[0.18em] text-muted uppercase"
            >
              {value}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
