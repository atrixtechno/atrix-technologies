const services = [
  {
    title: "Sitios y apps a medida",
    body: "Páginas y sistemas pensados para tu giro: consultorio, casa de cambio, club deportivo u otro negocio.",
  },
  {
    title: "Paneles y portales",
    body: "Herramientas internas para recepción, empleados o administración — sin depender de hojas sueltas.",
  },
  {
    title: "WhatsApp e integraciones",
    body: "Conectamos lo digital con cómo ya trabajas: avisos, formularios y flujos que tu equipo entiende.",
  },
];

export function Services() {
  return (
    <section id="servicios" className="scroll-mt-8 border-t border-line py-24 md:py-28">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <p className="text-xs font-semibold tracking-[0.2em] text-accent-deep uppercase">
          Servicios
        </p>
        <h2 className="font-display mt-3 max-w-2xl text-3xl font-semibold tracking-tight md:text-5xl">
          Lo que puedo construir para ti
        </h2>
        <ul className="mt-12 grid gap-4 md:grid-cols-3">
          {services.map((service) => (
            <li
              key={service.title}
              className="rounded-[1.35rem] border border-line bg-white p-6 shadow-[0_14px_40px_rgba(11,40,45,0.05)]"
            >
              <div className="mb-4 h-1 w-10 rounded-full bg-accent" />
              <h3 className="font-display text-xl font-semibold">{service.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{service.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
