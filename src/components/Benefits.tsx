import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/ui";
import { benefits } from "@/content/services";

export function Benefits() {
  return (
    <section
      id="beneficios"
      className="relative scroll-mt-24 border-t border-line bg-bg-soft py-24 md:py-32"
    >
      <div className="grid-dots pointer-events-none absolute inset-0 opacity-60" aria-hidden />
      <div className="relative mx-auto max-w-[1240px] px-5 sm:px-8">
        <div className="grid items-start gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          <Reveal className="lg:sticky lg:top-28">
            <SectionHeading
              index="03"
              eyebrow="Por qué ATRIX"
              title={
                <>
                  Tu aliado <span className="text-gradient">tecnológico</span> completo
                </>
              }
              lead="Tecnología confiable, innovadora y adaptada a tu operación real — con la misma gente que la diseña, la instala y le da seguimiento."
            />
            <div className="media-frame tech-frame mt-10 aspect-[4/3]">
              <Image
                src="/images/home/aliado-tecnologico.jpg"
                alt="Consultoría tecnológica profesional ATRIX con el cliente"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 42vw"
              />
              <div className="absolute bottom-4 left-4 z-10 rounded-xl border border-white/12 bg-black/50 px-4 py-3 text-white backdrop-blur">
                <p className="mono text-[10px] tracking-[0.14em] text-white/60 uppercase">
                  Modelo de servicio
                </p>
                <p className="font-display mt-1 text-sm font-semibold">
                  Diagnóstico → Implementación → Soporte
                </p>
              </div>
            </div>
          </Reveal>

          <ol className="grid gap-5">
            {benefits.map((item, index) => (
              <Reveal
                as="li"
                key={item.title}
                delay={index * 80}
                className="card-glow flex gap-5 p-6 sm:p-7"
              >
                <span className="stat-value text-gradient shrink-0 text-4xl sm:text-5xl">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-display text-xl font-semibold">{item.title}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-muted sm:text-[15px]">
                    {item.copy}
                  </p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
