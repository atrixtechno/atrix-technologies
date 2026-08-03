import Image from "next/image";
import { Reveal } from "@/components/Reveal";
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
          className="h-auto w-full object-cover object-left transition duration-700 hover:scale-[1.02] md:max-h-[320px]"
          priority={false}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-bg via-bg/20 to-bg/70" />
      </div>

      <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-20">
        <Reveal>
          <p className="text-xs font-semibold tracking-[0.28em] text-accent uppercase">
            Cobertura
          </p>
          <h2 className="font-display mt-4 max-w-2xl text-3xl font-bold tracking-tight md:text-4xl">
            Servicio en {site.coverage}
          </h2>
          <div className="animate-line mt-4 h-px w-24 bg-accent/50" />
        </Reveal>

        <ul className="mt-10 grid gap-6 md:grid-cols-3">
          {promises.map((item, index) => (
            <Reveal key={item.title} delay={index * 90}>
              <li className="border-t border-line pt-5">
                <h3 className="font-display text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.copy}</p>
              </li>
            </Reveal>
          ))}
        </ul>

        <ul className="mt-12 grid gap-4 sm:grid-cols-3">
          {pillars.map((item, index) => (
            <Reveal key={item.title} delay={index * 90}>
              <li className="tech-frame border border-line bg-bg-elevated/50 px-5 py-5 transition duration-300 hover:-translate-y-0.5 hover:border-accent/35">
                <h3 className="font-display text-base font-semibold text-signal">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-muted">{item.copy}</p>
              </li>
            </Reveal>
          ))}
        </ul>

        <Reveal delay={120}>
          <div className="mt-10 flex flex-wrap gap-2">
            {values.map((value) => (
              <span
                key={value}
                className="rounded-full border border-line px-4 py-2 text-[11px] font-semibold tracking-[0.18em] text-muted uppercase transition hover:border-accent/40 hover:text-accent"
              >
                {value}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
