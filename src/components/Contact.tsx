"use client";

import { FormEvent, useState } from "react";
import { site, whatsappUrl } from "@/content/site";

type Status = "idle" | "loading" | "ok" | "error";

export function Contact() {
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("fail");
      setStatus("ok");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="contacto" className="scroll-mt-10 border-t border-line py-24 md:py-32">
      <div className="mx-auto grid max-w-6xl gap-14 px-5 md:grid-cols-2 md:gap-20 md:px-8">
        <div>
          <p className="text-xs font-semibold tracking-[0.28em] text-accent uppercase">
            Contacto
          </p>
          <h2 className="font-display mt-4 text-3xl font-bold tracking-tight md:text-5xl">
            ¿Listo para cotizar?
          </h2>
          <p className="mt-4 max-w-md leading-relaxed text-muted">
            Soporte técnico, CCTV, redes, impresoras, software o IT empresarial.
            Escríbenos y te orientamos sin compromiso.
          </p>
          <a
            href={whatsappUrl("Hola ATRIX, quiero cotizar un servicio.")}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex rounded-full bg-accent px-6 py-3.5 font-semibold text-accent-ink shadow-[0_0_36px_rgba(46,230,214,0.3)] transition hover:bg-white"
          >
            WhatsApp · {site.phoneDisplay}
          </a>
          <p className="mt-4 text-sm text-muted">{site.coverage}</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
          <label className="block">
            <span className="text-xs tracking-[0.16em] text-muted uppercase">Nombre</span>
            <input
              name="name"
              required
              className="mt-2 w-full border border-line bg-bg-elevated px-4 py-3.5 text-fg outline-none transition focus:border-accent"
            />
          </label>
          <label className="block">
            <span className="text-xs tracking-[0.16em] text-muted uppercase">
              Teléfono / WhatsApp
            </span>
            <input
              name="phone"
              type="tel"
              className="mt-2 w-full border border-line bg-bg-elevated px-4 py-3.5 text-fg outline-none transition focus:border-accent"
            />
          </label>
          <label className="block">
            <span className="text-xs tracking-[0.16em] text-muted uppercase">
              Servicio de interés
            </span>
            <input
              name="business"
              placeholder="Ej. CCTV, redes, soporte, sitio web…"
              className="mt-2 w-full border border-line bg-bg-elevated px-4 py-3.5 text-fg outline-none transition focus:border-accent"
            />
          </label>
          <label className="block">
            <span className="text-xs tracking-[0.16em] text-muted uppercase">Mensaje</span>
            <textarea
              name="message"
              required
              rows={4}
              className="mt-2 w-full resize-y border border-line bg-bg-elevated px-4 py-3.5 text-fg outline-none transition focus:border-accent"
            />
          </label>
          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full border border-accent bg-transparent px-6 py-3.5 font-semibold text-accent transition hover:bg-accent hover:text-accent-ink disabled:opacity-60 md:w-auto"
          >
            {status === "loading" ? "Enviando…" : "Enviar mensaje"}
          </button>
          {status === "ok" && (
            <p className="text-sm text-accent">Listo. Te contactamos pronto.</p>
          )}
          {status === "error" && (
            <p className="text-sm text-red-400">
              No se pudo enviar. Escríbenos por WhatsApp, por favor.
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
