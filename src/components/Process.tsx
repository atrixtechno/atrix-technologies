const steps = [
  {
    title: "Diagnóstico",
    body: "Entiendo tu operación real: clientes, equipo y lo que hoy te frena.",
  },
  {
    title: "Construcción",
    body: "Diseño y programo la solución con foco en claridad, velocidad y control.",
  },
  {
    title: "Puesta en marcha",
    body: "Te dejo el sistema vivo, te capacito y acompaño los primeros ajustes.",
  },
];

export function Process() {
  return (
    <section
      id="proceso"
      className="scroll-mt-10 border-t border-line bg-bg-elevated/60 py-24 md:py-32"
    >
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <p className="text-xs font-semibold tracking-[0.28em] text-accent uppercase">
          Proceso
        </p>
        <h2 className="font-display mt-4 text-3xl font-bold tracking-tight md:text-5xl">
          De la idea al sistema en producción
        </h2>
        <ol className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
          {steps.map((step, i) => (
            <li key={step.title} className="relative">
              <span className="font-display text-6xl font-extrabold text-accent/15">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="font-display mt-2 text-xl font-bold">{step.title}</h3>
              <p className="mt-3 leading-relaxed text-muted">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
