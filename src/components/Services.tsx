const services = [
  {
    title: "Sitios y productos web",
    body: "Presencia digital clara para atraer clientes y mostrar tu marca con autoridad.",
  },
  {
    title: "Paneles y portales",
    body: "Herramientas internas para recepción, empleados o administración.",
  },
  {
    title: "Automatización e integraciones",
    body: "WhatsApp, formularios, bases de datos y flujos que conectan con tu día a día.",
  },
];

export function Services() {
  return (
    <section id="servicios" className="scroll-mt-10 border-t border-line py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <p className="text-xs font-semibold tracking-[0.28em] text-accent uppercase">
          Servicios
        </p>
        <h2 className="font-display mt-4 max-w-2xl text-3xl font-bold tracking-tight md:text-5xl">
          Tecnología con propósito de negocio
        </h2>
        <ul className="mt-14 grid gap-12 md:grid-cols-3 md:gap-10">
          {services.map((service) => (
            <li key={service.title}>
              <div className="mb-5 h-px w-14 bg-gradient-to-r from-accent to-signal" />
              <h3 className="font-display text-xl font-bold">{service.title}</h3>
              <p className="mt-3 leading-relaxed text-muted">{service.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
