import { LogoMark } from "@/components/LogoMark";
import { site, whatsappUrl } from "@/content/site";

export function Hero() {
  return (
    <section className="atmosphere relative min-h-[100svh] overflow-hidden">
      <div className="grid-tech pointer-events-none absolute inset-0" />
      <div className="scanline pointer-events-none absolute inset-0" />

      <div className="relative mx-auto grid min-h-[100svh] max-w-6xl items-end gap-10 px-5 pb-16 pt-28 md:grid-cols-[1.15fr_0.85fr] md:items-center md:px-8 md:pb-20 md:pt-24">
        <div className="relative z-10">
          <p className="animate-rise text-xs font-semibold tracking-[0.28em] text-accent uppercase">
            {site.city}
          </p>
          <h1 className="animate-brand font-display mt-5 text-[clamp(4rem,16vw,9.5rem)] leading-[0.85] font-extrabold tracking-[0.1em] text-fg uppercase">
            {site.name}
          </h1>
          <p className="animate-rise-delay mt-3 font-display text-lg font-semibold tracking-[0.35em] text-signal uppercase md:text-xl">
            Technologies
          </p>
          <p className="animate-rise-delay mt-8 max-w-lg text-lg leading-relaxed text-muted md:text-xl">
            {site.tagline}
          </p>
          <div className="animate-rise-delay-2 mt-10 flex flex-wrap items-center gap-3">
            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-accent px-6 py-3.5 text-base font-semibold text-accent-ink shadow-[0_0_40px_rgba(46,230,214,0.35)] transition hover:bg-white hover:shadow-[0_0_48px_rgba(46,230,214,0.45)]"
            >
              Hablemos por WhatsApp
            </a>
            <a
              href="#proyectos"
              className="rounded-full border border-line px-6 py-3.5 text-base text-fg transition hover:border-accent/50 hover:text-accent"
            >
              Ver proyectos
            </a>
          </div>
        </div>

        <div className="relative mx-auto flex w-full max-w-[22rem] items-center justify-center md:max-w-none">
          <div className="animate-pulse-ring absolute h-[78%] w-[78%] rounded-full border border-accent/30" />
          <div
            className="animate-pulse-ring absolute h-[58%] w-[58%] rounded-full border border-signal/25"
            style={{ animationDelay: "1.2s" }}
          />
          <div className="animate-float relative">
            <LogoMark
              size={280}
              className="h-auto w-[min(70vw,280px)] drop-shadow-[0_30px_80px_rgba(46,230,214,0.35)] md:w-[320px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
