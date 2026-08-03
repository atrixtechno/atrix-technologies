import { site, whatsappUrl } from "@/content/site";

export function Hero() {
  return (
    <section className="atmosphere relative min-h-[100svh] overflow-hidden">
      <div className="grid-fade pointer-events-none absolute inset-0" />
      <div className="relative mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-end px-6 pb-16 pt-28 md:justify-center md:px-8 md:pb-24 md:pt-32">
        <p className="animate-rise mb-6 text-sm tracking-[0.2em] text-muted uppercase">
          {site.city}
        </p>
        <h1 className="animate-brand font-display text-[clamp(3.5rem,14vw,9rem)] leading-[0.9] font-extrabold tracking-[0.08em] text-fg">
          {site.name}
        </h1>
        <p className="animate-rise-delay mt-3 font-display text-xl font-semibold tracking-wide text-muted md:text-2xl">
          Technologies
        </p>
        <p className="animate-rise-delay mt-8 max-w-xl text-lg leading-relaxed text-fg/85 md:text-xl">
          {site.tagline}
        </p>
        <div className="animate-rise-delay-2 mt-10 flex flex-wrap items-center gap-4">
          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-sm bg-accent px-6 py-3 text-base font-semibold text-accent-ink transition-transform hover:scale-[1.02]"
          >
            Hablemos por WhatsApp
          </a>
          <a
            href="#proyectos"
            className="rounded-sm border border-line px-6 py-3 text-base text-fg transition-colors hover:border-fg/30"
          >
            Ver proyectos
          </a>
        </div>
      </div>
    </section>
  );
}
