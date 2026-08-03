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
    <section
      id="proceso"
      className="scroll-mt-8 border-t border-line bg-bg-ink py-24 text-white md:py-28"
    >
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <p className="text-xs font-semibold tracking-[0.2em] text-accent uppercase">
          Cómo trabajo
        </p>
        <h2 className="font-display mt-3 text-3xl font-semibold tracking-tight md:text-5xl">
          Simple y directo
        </h2>
        <ol className="mt-12 grid gap-4 md:grid-cols-3">
          {steps.map((step, i) => (
            <li
              key={step.title}
              className="rounded-[1.35rem] border border-white/10 bg-white/5 p-6 backdrop-blur transition hover:border-accent/40 hover:bg-white/10"
            >
              <span className="text-[11px] font-semibold tracking-[0.16em] text-accent uppercase">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="font-display mt-3 text-xl font-semibold">{step.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/65">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
