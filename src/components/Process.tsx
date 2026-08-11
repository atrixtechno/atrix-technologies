import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import { SectionLink } from "@/components/SectionLink";

const steps = [
  {
    title: "Diagnóstico",
    body: "Entendemos tu operación real: clientes, equipo y lo que hoy te frena.",
    image: "/images/home/respuesta-rapida.jpg",
    imageAlt: "Diagnóstico técnico profesional en sitio",
  },
  {
    title: "Construcción",
    body: "Diseñamos e implementamos la solución con foco en claridad, velocidad y control.",
    image: "/images/services/software.jpg",
    imageAlt: "Construcción de software e infraestructura ATRIX",
  },
  {
    title: "Puesta en marcha",
    body: "Dejamos el sistema vivo, capacitamos a tu equipo y acompañamos los primeros ajustes.",
    image: "/images/home/aliado-tecnologico.jpg",
    imageAlt: "Puesta en marcha y acompañamiento con el cliente",
  },
] as const;

export function Process() {
  return (
    <section
      id="proceso"
      className="scroll-mt-10 border-t border-line bg-bg-elevated/60 py-24 md:py-32"
    >
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <Reveal>
          <p className="text-xs font-semibold tracking-[0.28em] text-accent uppercase">
            Proceso
          </p>
          <h2 className="font-display mt-4 max-w-3xl text-3xl font-bold tracking-tight md:text-5xl">
            De la idea al sistema en producción
          </h2>
          <div className="animate-line mt-4 h-px w-24 bg-accent/50" />
          <p className="mt-4 max-w-2xl text-muted">
            Un flujo claro para hogares y empresas: diagnosticar, construir y dejar
            operando — con acompañamiento real.
          </p>
        </Reveal>

        <ol className="mt-12 grid gap-6 md:mt-14 md:grid-cols-3 md:gap-5">
          {steps.map((step, i) => (
            <Reveal key={step.title} delay={i * 80}>
              <li className="group flex h-full flex-col overflow-hidden border border-line bg-bg/70 transition hover:border-accent/35">
                <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-line bg-bg">
                  <Image
                    src={step.image}
                    alt={step.imageAlt}
                    fill
                    quality={85}
                    className="object-cover transition duration-500 group-hover:scale-[1.03]"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg/70 via-transparent to-transparent" />
                  <span className="font-display absolute bottom-3 left-3 text-4xl font-extrabold text-white/90 tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <h3 className="font-display text-xl font-bold">{step.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
                    {step.body}
                  </p>
                  <SectionLink
                    hash="contacto"
                    className="mt-5 inline-flex text-sm font-semibold text-accent transition hover:brightness-110"
                  >
                    Empezar →
                  </SectionLink>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
