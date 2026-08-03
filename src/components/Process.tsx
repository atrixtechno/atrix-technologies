const steps = [
  {
    title: "Plática",
    body: "Entiendo tu negocio, lo que necesitas hoy y cómo lo usan tus clientes o tu equipo.",
  },
  {
    title: "Construcción",
    body: "Diseño y desarrollo el sitio o la app con foco en que sea clara, útil y lista para usar.",
  },
  {
    title: "Entrega y soporte",
    body: "Te dejo el sistema funcionando, te explico cómo usarlo y quedo disponible para ajustes.",
  },
];

export function Process() {
  return (
    <section id="proceso" className="scroll-mt-8 border-t border-line bg-bg-elevated/40 py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <p className="text-sm tracking-[0.2em] text-muted uppercase">Cómo trabajo</p>
        <h2 className="font-display mt-3 text-3xl font-bold tracking-tight md:text-5xl">
          Simple y directo
        </h2>
        <ol className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
          {steps.map((step, i) => (
            <li key={step.title} className="relative">
              <span className="font-display text-5xl font-bold text-accent/25">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="font-display mt-4 text-xl font-semibold">{step.title}</h3>
              <p className="mt-3 text-muted leading-relaxed">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
