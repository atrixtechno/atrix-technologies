"use client";

import Image from "next/image";

const CARDS = [
  {
    id: "frente",
    title: "Frente",
    preview: "/brand/tarjeta-atrix-frente.png",
    download: "/brand/tarjeta-atrix-frente-300dpi.png",
    downloadLabel: "Descargar frente HD (PNG)",
  },
  {
    id: "reverso",
    title: "Reverso",
    preview: "/brand/tarjeta-atrix-reverso.png",
    download: "/brand/tarjeta-atrix-reverso-300dpi.png",
    downloadLabel: "Descargar reverso HD (PNG)",
  },
] as const;

export function AdminCardPanel() {
  return (
    <div className="space-y-8">
      <header>
        <p className="text-[11px] font-semibold tracking-[0.22em] text-accent uppercase">
          3. Tarjeta presentación
        </p>
        <h1 className="font-display mt-2 text-3xl font-semibold tracking-tight text-fg md:text-4xl">
          Tarjeta ATRIX
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          Previsualiza el frente y el reverso, y descarga las versiones HD en
          PNG para impresión o uso digital.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-2">
        {CARDS.map((card) => (
          <section
            key={card.id}
            className="border border-line bg-bg-elevated/70 p-4 backdrop-blur md:p-6"
          >
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-display text-xl font-semibold text-fg">
                {card.title}
              </h2>
              <span className="text-[11px] tracking-[0.14em] text-muted uppercase">
                Preview
              </span>
            </div>

            <div className="relative mt-4 aspect-[1.75/1] overflow-hidden border border-line bg-bg">
              <Image
                src={card.preview}
                alt={`Tarjeta ATRIX — ${card.title}`}
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 100vw, 40vw"
                priority={card.id === "frente"}
              />
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <a
                href={card.download}
                download
                className="inline-flex rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-ink transition hover:brightness-110"
              >
                {card.downloadLabel}
              </a>
              <a
                href={card.preview}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-fg transition hover:border-accent/40 hover:text-accent"
              >
                Abrir preview
              </a>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
