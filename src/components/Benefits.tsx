import { benefits } from "@/content/guides";

export function Benefits() {
  return (
    <section id="beneficios" className="scroll-mt-10 py-24 md:py-28">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <p className="text-xs font-semibold tracking-[0.28em] text-accent uppercase">
          Beneficios
        </p>
        <h2 className="font-display mt-4 max-w-2xl text-3xl font-bold tracking-tight md:text-5xl">
          Por qué trabajar con ATRIX
        </h2>
        <p className="mt-4 max-w-2xl text-muted">
          Combinamos diseño, ingeniería y estrategia para que tu presencia digital
          se vea bien y funcione en el negocio real.
        </p>

        <ul className="mt-12 grid gap-6 sm:grid-cols-2">
          {benefits.map((item, index) => (
            <li
              key={item.title}
              className="border-t border-line pt-6"
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <p className="text-[11px] font-semibold tracking-[0.2em] text-signal uppercase">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className="font-display mt-3 text-xl font-semibold md:text-2xl">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted md:text-base">
                {item.copy}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
