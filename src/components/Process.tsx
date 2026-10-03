import { Reveal } from "@/components/Reveal";
import { SectionLink } from "@/components/SectionLink";
import { ArrowIcon, SectionHeading } from "@/components/ui";

const steps = [
  {
    code: "01",
    title: "Diagnóstico",
    body: "Entendemos tu operación real: clientes, equipo, infraestructura y lo que hoy te frena.",
    output: "Mapa de necesidades y propuesta clara",
  },
  {
    code: "02",
    title: "Construcción",
    body: "Diseñamos e implementamos la solución con foco en claridad, velocidad y control.",
    output: "Instalación, desarrollo y pruebas",
  },
  {
    code: "03",
    title: "Puesta en marcha",
    body: "Dejamos el sistema operando, capacitamos a tu equipo y acompañamos los primeros ajustes.",
    output: "Entrega, capacitación y soporte",
  },
] as const;

export function Process() {
  return (
    <section
      id="proceso"
      className="relative scroll-mt-24 overflow-hidden border-t border-line bg-bg-soft py-24 md:py-32"
    >
      <div className="grid-tech pointer-events-none absolute inset-0" aria-hidden />
      <div className="relative mx-auto max-w-[1240px] px-5 sm:px-8">
        <Reveal>
          <SectionHeading
            index="06"
            eyebrow="Proceso"
            title={
              <>
                De la idea al sistema <span className="text-gradient">en producción</span>
              </>
            }
            lead="Un flujo claro para hogares y empresas: diagnosticar, construir y dejar operando — con acompañamiento real."
          />
        </Reveal>

        <div className="relative mt-16">
          <div
            className="pointer-events-none absolute top-[2.15rem] right-[16%] left-[16%] hidden h-px bg-gradient-to-r from-accent/0 via-accent/50 to-accent/0 md:block"
            aria-hidden
          />
          <ol className="relative grid gap-5 md:grid-cols-3">
          {steps.map((step, i) => (
            <Reveal as="li" key={step.title} delay={i * 100} className="relative">
              <div className="flex justify-center md:justify-start">
                <span className="relative z-10 inline-flex h-[4.3rem] w-[4.3rem] items-center justify-center rounded-2xl border border-accent/35 bg-bg-elevated shadow-[0_0_40px_color-mix(in_srgb,var(--accent)_25%,transparent)]">
                  <span className="stat-value text-gradient text-2xl">{step.code}</span>
                </span>
              </div>
              <div className="card-glow mt-6 h-[calc(100%-5.8rem)] p-6 sm:p-7">
                <h3 className="font-display text-xl font-semibold">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{step.body}</p>
                <p className="mono mt-6 border-t border-line pt-4 text-[11px] tracking-[0.06em] text-signal">
                  → {step.output}
                </p>
              </div>
            </Reveal>
          ))}
          </ol>
        </div>

        <Reveal delay={200}>
          <div className="mt-12 flex justify-center">
            <SectionLink hash="contacto" className="btn btn-outline">
              Empezar mi diagnóstico
              <ArrowIcon />
            </SectionLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
