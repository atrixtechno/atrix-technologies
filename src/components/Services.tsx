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
    <section id="servicios" className="scroll-mt-8 border-t border-line py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <p className="text-sm tracking-[0.2em] text-muted uppercase">Servicios</p>
        <h2 className="font-display mt-3 max-w-2xl text-3xl font-bold tracking-tight md:text-5xl">
          Lo que puedo construir para ti
        </h2>
        <ul className="mt-14 grid gap-12 md:grid-cols-3">
          {services.map((service) => (
            <li key={service.title}>
              <div className="mb-4 h-px w-12 bg-accent" />
              <h3 className="font-display text-xl font-semibold">{service.title}</h3>
              <p className="mt-3 leading-relaxed text-muted">{service.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
