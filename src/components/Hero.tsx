import { site, whatsappUrl } from "@/content/site";

export function Hero() {
  return (
    <section className="atmosphere relative min-h-[100svh] overflow-hidden">
      <div className="relative mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-end px-6 pb-16 pt-32 md:justify-center md:px-8 md:pb-24">
        <p className="animate-rise mb-5 text-xs font-semibold tracking-[0.22em] text-accent-deep uppercase">
          {site.city} · Software a la medida
        </p>
        <h1 className="animate-brand font-display text-[clamp(3.25rem,12vw,7.5rem)] leading-[0.92] font-extrabold tracking-[0.06em] text-fg">
          {site.name}
        </h1>
        <p className="animate-rise-delay mt-2 font-display text-xl font-semibold tracking-wide text-accent-deep md:text-2xl">
          Technologies
        </p>
        <p className="animate-rise-delay mt-7 max-w-xl text-lg leading-relaxed text-muted md:text-xl">
          {site.tagline}
        </p>
        <div className="animate-rise-delay-2 mt-10 flex flex-wrap items-center gap-3">
          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-[#25D366] px-6 py-3.5 text-base font-semibold text-white shadow-[0_14px_32px_rgba(37,211,102,0.28)] transition hover:bg-[#1ebe57]"
          >
            Hablemos por WhatsApp
          </a>
          <a
            href="#proyectos"
            className="rounded-full border border-fg/15 bg-white/80 px-6 py-3.5 text-base font-medium text-fg transition hover:border-accent/40 hover:text-accent-deep"
          >
            Ver proyectos
          </a>
        </div>
      </div>
    </section>
  );
}
