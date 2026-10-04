import { Reveal } from "@/components/Reveal";
import { SectionLink } from "@/components/SectionLink";
import { ArrowIcon } from "@/components/ui";

const steps = [
  {
    state: "warn",
    status: "Analizando",
    title: "Diagnóstico",
    body: "Entendemos tu operación real: clientes, equipo, infraestructura y lo que hoy te frena.",
    output: "Mapa de necesidades y propuesta clara",
  },
  {
    state: "info",
    status: "En curso",
    title: "Construcción",
    body: "Diseñamos e implementamos la solución con foco en claridad, velocidad y control.",
    output: "Instalación, desarrollo y pruebas",
  },
  {
    state: "ok",
    status: "Operando",
    title: "Puesta en marcha",
    body: "Dejamos el sistema operando, capacitamos a tu equipo y acompañamos los primeros ajustes.",
    output: "Entrega, capacitación y soporte",
  },
] as const;

export function Process() {
  return (
    <section id="proceso" className="relative scroll-mt-20 border-t border-line py-24 md:py-32">
      <div className="mx-auto max-w-[1320px] px-5 sm:px-8">
        <Reveal className="max-w-3xl">
          <h2 className="section-title">De la idea al sistema en producción</h2>
          <p className="section-lead">
            Un protocolo claro para hogares y empresas: diagnosticar, construir y
            dejar operando, con acompañamiento real en cada fase.
          </p>
        </Reveal>

        <Reveal className="relative mt-16">
          <div className="absolute top-[5px] right-0 left-0 hidden h-px bg-line md:block" aria-hidden>
            <div className="protocol-line h-full bg-gradient-to-r from-warn via-accent to-ok" />
          </div>
          <ol className="grid gap-12 md:grid-cols-3 md:gap-8">
            {steps.map((step) => (
              <li key={step.title} className="relative">
                <div className="flex items-center gap-3">
                  <span className="led relative z-10" data-state={step.state} />
                  <span className="osd text-muted">{step.status}</span>
                </div>
                <h3 className="display mt-6 text-3xl">{step.title}</h3>
                <p className="mt-4 max-w-sm leading-relaxed text-muted">{step.body}</p>
                <p className="mt-6 border-t border-line pt-4 text-sm font-medium text-fg/85">
                  {step.output}
                </p>
              </li>
            ))}
          </ol>
        </Reveal>

        <div className="mt-14">
          <SectionLink hash="contacto" className="btn btn-outline">
            Empezar mi diagnóstico
            <ArrowIcon />
          </SectionLink>
        </div>
      </div>
    </section>
  );
}
