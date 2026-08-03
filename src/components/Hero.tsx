import { Logo } from "@/components/Logo";
import { site, whatsappUrl } from "@/content/site";

export function Hero() {
  return (
    <section className="atmosphere relative min-h-[100svh] overflow-hidden">
      <div className="grid-tech pointer-events-none absolute inset-0" />

      <div className="relative mx-auto flex min-h-[100svh] max-w-6xl flex-col items-center justify-center px-5 pb-16 pt-28 text-center md:px-8 md:pb-20">
        <div className="animate-fade-scale relative mb-2">
          <div className="animate-glow pointer-events-none absolute inset-0 -m-10 rounded-full bg-[radial-gradient(circle,rgba(46,230,214,0.25),transparent_65%)]" />
          <div className="animate-float relative">
            <Logo
              variant="full"
              size={340}
              priority
              className="mx-auto max-w-[min(82vw,340px)] drop-shadow-[0_24px_80px_rgba(43,107,255,0.25)]"
            />
          </div>
        </div>

        <div className="animate-line mx-auto mt-2 h-px w-24 bg-gradient-to-r from-transparent via-accent to-transparent md:w-32" />

        <p className="animate-rise-delay mt-8 text-xs font-semibold tracking-[0.32em] text-accent uppercase">
          {site.city}
        </p>
        <p className="animate-rise-delay mt-5 max-w-xl text-lg leading-relaxed text-muted md:text-xl">
          {site.tagline}
        </p>
        <p className="animate-rise-delay mt-3 text-sm tracking-[0.18em] text-signal uppercase">
          {site.motto}
        </p>

        <div className="animate-rise-delay-2 mt-10 flex flex-wrap items-center justify-center gap-3">
          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-accent px-7 py-3.5 text-base font-semibold text-accent-ink shadow-[0_0_40px_rgba(46,230,214,0.35)] transition hover:bg-white hover:shadow-[0_0_50px_rgba(46,230,214,0.45)]"
          >
            Hablemos por WhatsApp
          </a>
          <a
            href="#proyectos"
            className="rounded-full border border-line px-7 py-3.5 text-base text-fg transition hover:border-accent/50 hover:text-accent"
          >
            Ver proyectos
          </a>
        </div>
      </div>
    </section>
  );
}
