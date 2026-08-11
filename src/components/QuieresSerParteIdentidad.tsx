import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import { uneteIdentityGallery, unetePage } from "@/content/unete";

export function QuieresSerParteIdentidad() {
  return (
    <section
      id="identidad"
      className="relative scroll-mt-24 overflow-hidden border-b border-white/10 bg-[#05070b]"
      aria-labelledby="identidad-heading"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_45%_at_15%_0%,rgba(26,107,255,0.22),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_90%_100%,rgba(26,107,255,0.12),transparent_50%)]" />
        <div className="grid-tech absolute inset-0 opacity-20" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-5 sm:py-20 md:px-8 md:py-24">
        <Reveal>
          <div className="max-w-3xl">
            <p className="text-[10px] font-semibold tracking-[0.22em] text-accent uppercase sm:text-xs">
              {unetePage.identityEyebrow}
            </p>
            <h2
              id="identidad-heading"
              className="font-display mt-3 text-balance text-[1.75rem] font-bold tracking-tight text-white sm:text-4xl md:text-[2.75rem] md:leading-[1.08]"
            >
              {unetePage.identityTitle}
            </h2>
            <div className="mt-5 h-px w-24 bg-accent" />
            <p className="mt-5 max-w-2xl text-pretty text-[15px] leading-relaxed text-white/65 sm:text-lg">
              {unetePage.identityLead}
            </p>
          </div>
        </Reveal>

        <ul className="mt-10 grid grid-cols-1 gap-px overflow-hidden border border-white/10 bg-white/10 sm:mt-12 sm:grid-cols-3">
          {unetePage.identityPillars.map((pillar, index) => (
            <Reveal key={pillar.label} delay={index * 70}>
              <li className="h-full bg-[#080b11] px-5 py-6 sm:px-6 sm:py-7">
                <p className="font-display text-xs font-semibold tracking-[0.18em] text-accent uppercase">
                  {String(index + 1).padStart(2, "0")} · {pillar.label}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-white/70 sm:text-[15px]">
                  {pillar.copy}
                </p>
              </li>
            </Reveal>
          ))}
        </ul>

        <div className="mt-10 space-y-5 sm:mt-12 sm:space-y-6">
          {uneteIdentityGallery.map((item, index) => (
            <Reveal key={item.src} delay={index * 90}>
              <figure className="group relative overflow-hidden border border-white/10 bg-black">
                <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px bg-gradient-to-r from-transparent via-accent to-transparent" />
                <div className="relative aspect-[16/10] w-full sm:aspect-[16/9]">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    quality={100}
                    priority={index === 0}
                    className="object-contain object-center p-1 transition duration-500 group-hover:scale-[1.01] sm:p-2 md:p-3"
                    sizes="(max-width: 1152px) 100vw, 1152px"
                  />
                </div>
                <figcaption className="flex items-center justify-between gap-3 border-t border-white/10 bg-black/70 px-4 py-3 sm:px-5">
                  <span className="text-xs tracking-[0.14em] text-white/55 uppercase sm:text-[13px]">
                    {item.caption}
                  </span>
                  <span className="hidden text-[11px] tracking-[0.16em] text-accent/80 uppercase sm:inline">
                    ATRIX Technologies
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

        <Reveal delay={120}>
          <div className="mt-8 grid items-stretch gap-5 sm:mt-10 md:grid-cols-[minmax(0,0.9fr)_1.1fr] md:gap-6">
            <div className="relative min-h-[14rem] overflow-hidden border border-white/10 bg-black sm:min-h-[16rem]">
              <Image
                src="/brand/atrix-identidad-detalle.png"
                alt="Detalle de marca ATRIX en gorra"
                fill
                quality={100}
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 40vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <p className="absolute bottom-3 left-3 text-[10px] font-semibold tracking-[0.18em] text-white/80 uppercase">
                Detalle de marca
              </p>
            </div>
            <div className="flex flex-col justify-center border border-white/10 bg-[#080b11] px-5 py-7 sm:px-8 sm:py-9">
              <p className="text-[10px] font-semibold tracking-[0.22em] text-accent uppercase">
                Estándar ATRIX
              </p>
              <p className="font-display mt-3 text-xl font-semibold tracking-tight text-white sm:text-2xl">
                No es ropa de trabajo. Es cómo se ve un equipo profesional.
              </p>
              <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-white/60">
                La identidad visual refuerza confianza desde el primer contacto:
                claridad de marca, presencia seria y coherencia en cada visita.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
