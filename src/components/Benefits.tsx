import { Reveal } from "@/components/Reveal";
import { SectionMedia } from "@/components/SectionMedia";
import { benefits } from "@/content/services";

export function Benefits() {
  return (
    <section id="beneficios" className="relative scroll-mt-10 border-t border-line py-24 md:py-28">
      <div className="pointer-events-none absolute -left-20 top-1/3 h-56 w-56 rounded-full bg-accent/5 blur-3xl" />
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="grid items-start gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14">
          <Reveal>
            <p className="text-xs font-semibold tracking-[0.28em] text-accent uppercase">
              Por qué ATRIX
            </p>
            <h2 className="font-display mt-4 max-w-2xl text-3xl font-bold tracking-tight md:text-5xl">
              Un aliado tecnológico completo
            </h2>
            <div className="animate-line mt-4 h-px w-24 bg-accent/50" />
            <p className="mt-4 max-w-2xl text-muted">
              Impulsamos tu hogar o negocio con tecnología confiable, innovadora y
              adaptada a tus necesidades reales.
            </p>
            <div className="mt-8 hidden lg:block">
              <SectionMedia
                src="/images/home/aliado-tecnologico.jpg"
                alt="Consultoría tecnológica profesional ATRIX con el cliente"
                aspect="aspect-[4/3]"
                sizes="(max-width: 1024px) 100vw, 42vw"
              />
            </div>
          </Reveal>

          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
            <li className="lg:hidden">
              <SectionMedia
                src="/images/home/aliado-tecnologico.jpg"
                alt="Consultoría tecnológica profesional ATRIX con el cliente"
                aspect="aspect-[16/10]"
                sizes="100vw"
              />
            </li>
            {benefits.map((item, index) => (
              <Reveal key={item.title} delay={index * 80}>
                <li className="border-t border-line pt-6 transition hover:border-accent/40">
                  <p className="text-[11px] font-semibold tracking-[0.2em] text-signal uppercase">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="font-display mt-3 text-xl font-semibold md:text-2xl">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted md:text-base">
                    {item.copy}
                  </p>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
